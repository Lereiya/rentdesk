create type public.issue_status as enum ('open','in_progress','resolved');

alter table public.tenants add column email text, add column user_id uuid;
create index on public.tenants(lower(email));
create index on public.tenants(user_id);

create table public.property_staff (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  property_id uuid not null references public.properties(id) on delete cascade,
  email text not null,
  user_id uuid,
  created_at timestamptz not null default now(),
  unique (property_id, email)
);
create table public.issues (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  property_id uuid not null references public.properties(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  description text not null default '',
  status issue_status not null default 'open',
  created_at timestamptz not null default now()
);
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  property_id uuid not null references public.properties(id) on delete cascade,
  author_id uuid not null default auth.uid(),
  title text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);
create index on public.issues(property_id);
create index on public.announcements(property_id, created_at desc);

grant select, insert, update, delete on public.property_staff, public.issues, public.announcements to authenticated;
grant all on public.property_staff, public.issues, public.announcements to service_role;
alter table public.property_staff enable row level security;
alter table public.issues enable row level security;
alter table public.announcements enable row level security;

create or replace function public.is_staff(_property uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.property_staff where property_id = _property and user_id = auth.uid())
$$;
create or replace function public.my_tenant_ids() returns setof uuid
language sql stable security definer set search_path = public as $$
  select id from public.tenants where user_id = auth.uid()
$$;
create or replace function public.my_tenant_properties() returns setof uuid
language sql stable security definer set search_path = public as $$
  select property_id from public.tenants where user_id = auth.uid()
$$;

-- owner_id always derived from the property
create or replace function public.set_owner_from_property() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  select owner_id into new.owner_id from public.properties where id = new.property_id;
  if new.owner_id is null then raise exception 'Unknown property'; end if;
  return new;
end $$;
create trigger tenants_owner before insert on public.tenants for each row execute function public.set_owner_from_property();
create trigger issues_owner before insert on public.issues for each row execute function public.set_owner_from_property();
create trigger ann_owner before insert on public.announcements for each row execute function public.set_owner_from_property();
create trigger staff_owner before insert on public.property_staff for each row execute function public.set_owner_from_property();

-- issues: property comes from tenant
create or replace function public.issue_property() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  select property_id into new.property_id from public.tenants where id = new.tenant_id;
  return new;
end $$;
create trigger issues_prop before insert on public.issues for each row execute function public.issue_property();
-- ensure issue_property runs first (alphabetical: issues_owner < issues_prop) -> rename
drop trigger issues_prop on public.issues;
create trigger issues_a_prop before insert on public.issues for each row execute function public.issue_property();

-- link accounts by email when staff/tenant rows are added
create or replace function public.link_user_by_email() returns trigger
language plpgsql security definer set search_path = public as $$
declare uid uuid; r app_role;
begin
  if new.email is null or new.user_id is not null then return new; end if;
  new.email := lower(trim(new.email));
  select id into uid from auth.users where lower(email) = new.email limit 1;
  if uid is not null then
    new.user_id := uid;
    r := case when tg_table_name = 'property_staff' then 'caretaker'::app_role else 'tenant'::app_role end;
    insert into public.user_roles(user_id, role) values (uid, r) on conflict do nothing;
  end if;
  return new;
end $$;
create trigger tenants_link before insert or update of email on public.tenants for each row execute function public.link_user_by_email();
create trigger staff_link before insert on public.property_staff for each row execute function public.link_user_by_email();

-- Policies
create policy "staff see property" on public.properties for select to authenticated using (public.is_staff(id));
create policy "tenant sees property" on public.properties for select to authenticated using (id in (select public.my_tenant_properties()));

create policy "staff manage tenants" on public.tenants for all to authenticated
  using (public.is_staff(property_id)) with check (public.is_staff(property_id));
create policy "tenant sees self" on public.tenants for select to authenticated using (user_id = auth.uid());

create policy "staff see payments" on public.payments for select to authenticated
  using (exists (select 1 from public.tenants t where t.id = tenant_id and public.is_staff(t.property_id)));
create policy "tenant sees payments" on public.payments for select to authenticated using (tenant_id in (select public.my_tenant_ids()));

create policy "landlord staff" on public.property_staff for all to authenticated
  using (owner_id = auth.uid()) with check (exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid()));
create policy "staff sees own" on public.property_staff for select to authenticated using (user_id = auth.uid());

create policy "landlord issues" on public.issues for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "staff issues read" on public.issues for select to authenticated using (public.is_staff(property_id));
create policy "staff issues update" on public.issues for update to authenticated using (public.is_staff(property_id)) with check (public.is_staff(property_id));
create policy "tenant issues read" on public.issues for select to authenticated using (tenant_id in (select public.my_tenant_ids()));
create policy "tenant issues create" on public.issues for insert to authenticated with check (tenant_id in (select public.my_tenant_ids()));

create policy "landlord announcements" on public.announcements for all to authenticated
  using (owner_id = auth.uid()) with check (exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid()));
create policy "staff announcements" on public.announcements for all to authenticated
  using (public.is_staff(property_id)) with check (public.is_staff(property_id) and author_id = auth.uid());
create policy "tenant announcements" on public.announcements for select to authenticated using (property_id in (select public.my_tenant_properties()));

-- New user: link to staff/tenant invites first; otherwise landlord with sample portfolio
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  o uuid := new.id; p1 uuid; p2 uuid; p3 uuid; p4 uuid;
  t record; m int; linked boolean := false;
begin
  insert into public.profiles(id, full_name) values (o, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));

  update public.property_staff set user_id = o where lower(email) = lower(new.email) and user_id is null;
  if found then insert into public.user_roles(user_id, role) values (o,'caretaker') on conflict do nothing; linked := true; end if;
  update public.tenants set user_id = o where lower(email) = lower(new.email) and user_id is null;
  if found then insert into public.user_roles(user_id, role) values (o,'tenant') on conflict do nothing; linked := true; end if;
  if linked then return new; end if;

  insert into public.user_roles(user_id, role) values (o, 'landlord');
  insert into public.properties(owner_id,name,location,units,occupied,caretaker) values (o,'Kilimani Heights','Kilimani, Nairobi',24,22,'Peter Otieno') returning id into p1;
  insert into public.properties(owner_id,name,location,units,occupied,caretaker) values (o,'Ruaka Gardens','Ruaka, Kiambu',36,31,'Grace Wanjiru') returning id into p2;
  insert into public.properties(owner_id,name,location,units,occupied,caretaker) values (o,'Nyali Court','Nyali, Mombasa',12,12,'Hassan Ali') returning id into p3;
  insert into public.properties(owner_id,name,location,units,occupied,caretaker) values (o,'Kasarani Flats','Kasarani, Nairobi',18,14,'John Kamau') returning id into p4;

  insert into public.tenants(owner_id,property_id,name,phone,unit,rent,water,garbage,balance,move_in) values
   (o,p1,'Wanjiku Mwangi','0712 345 678','A3',35000,1200,300,0,'2024-02-01'),
   (o,p1,'Brian Ochieng','0722 111 222','B7',35000,950,300,36250,'2023-08-15'),
   (o,p2,'Faith Chebet','0733 456 789','C12',18000,800,200,4000,'2025-01-10'),
   (o,p2,'Kevin Mutua','0701 987 654','D4',18000,1100,200,0,'2024-06-01'),
   (o,p3,'Amina Hassan','0745 222 333','2B',42000,1500,400,0,'2023-11-01'),
   (o,p4,'Dennis Kiprop','0710 444 555','G2',15000,700,200,31800,'2024-09-01'),
   (o,p4,'Mercy Akinyi','0791 666 777','F5',15000,650,200,7850,'2025-03-01'),
   (o,p2,'Samuel Njoroge','0768 888 999','A1',18000,900,200,0,'2022-05-01');

  for t in select id, rent+water+garbage as due, balance from public.tenants where owner_id = o loop
    for m in 1..5 loop
      insert into public.payments(owner_id,tenant_id,amount,method,ref,paid_on)
      values (o,t.id,t.due - (case when t.balance > 0 and m = 1 then t.due/2 else 0 end),
        (array['M-Pesa','M-Pesa','Co-op Bank','Cash']::payment_method[])[1 + (m % 4)],
        upper(substr(md5(t.id::text || m), 1, 10)),
        (date_trunc('month', current_date) - make_interval(months => m) + interval '4 days')::date);
    end loop;
    if t.balance = 0 then
      insert into public.payments(owner_id,tenant_id,amount,method,ref,paid_on)
      values (o,t.id,t.due,'M-Pesa',upper(substr(md5(t.id::text || 'now'),1,10)),(date_trunc('month', current_date) + interval '3 days')::date);
    end if;
    update public.tenants set balance = t.balance where id = t.id;
  end loop;
  return new;
end $$;