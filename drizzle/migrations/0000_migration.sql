create type public.app_role as enum ('admin','landlord','caretaker','tenant');
create type public.payment_method as enum ('M-Pesa','Co-op Bank','Cash');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  created_at timestamptz not null default now()
);
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  name text not null,
  location text not null default '',
  units int not null default 0 check (units >= 0),
  occupied int not null default 0 check (occupied >= 0),
  caretaker text not null default '',
  created_at timestamptz not null default now()
);
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  phone text not null default '',
  unit text not null,
  rent numeric(12,2) not null default 0,
  water numeric(12,2) not null default 0,
  garbage numeric(12,2) not null default 0,
  balance numeric(12,2) not null default 0,
  move_in date not null default current_date,
  created_at timestamptz not null default now()
);
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  method payment_method not null default 'M-Pesa',
  ref text not null default '',
  paid_on date not null default current_date,
  created_at timestamptz not null default now()
);
create index on public.properties(owner_id);
create index on public.tenants(owner_id);
create index on public.payments(owner_id, paid_on);

grant select, insert, update on public.profiles to authenticated;
grant select on public.user_roles to authenticated;
grant select, insert, update, delete on public.properties, public.tenants, public.payments to authenticated;
grant all on public.profiles, public.user_roles, public.properties, public.tenants, public.payments to service_role;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.properties enable row level security;
alter table public.tenants enable row level security;
alter table public.payments enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid());
create policy "own roles read" on public.user_roles for select to authenticated using (user_id = auth.uid());

create policy "landlord properties" on public.properties for all to authenticated
  using (owner_id = auth.uid() and public.has_role(auth.uid(),'landlord'))
  with check (owner_id = auth.uid() and public.has_role(auth.uid(),'landlord'));
create policy "landlord tenants" on public.tenants for all to authenticated
  using (owner_id = auth.uid() and public.has_role(auth.uid(),'landlord'))
  with check (owner_id = auth.uid() and public.has_role(auth.uid(),'landlord')
    and exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid()));
create policy "landlord payments" on public.payments for all to authenticated
  using (owner_id = auth.uid() and public.has_role(auth.uid(),'landlord'))
  with check (owner_id = auth.uid() and public.has_role(auth.uid(),'landlord')
    and exists (select 1 from public.tenants t where t.id = tenant_id and t.owner_id = auth.uid()));

-- Payments reduce tenant balance
create or replace function public.apply_payment()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.tenants set balance = greatest(balance - new.amount, 0) where id = new.tenant_id;
  return new;
end $$;
create trigger payments_apply after insert on public.payments for each row execute function public.apply_payment();

-- New user: profile, landlord role, sample portfolio
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  o uuid := new.id; p1 uuid; p2 uuid; p3 uuid; p4 uuid;
  t record; m int;
begin
  insert into public.profiles(id, full_name) values (o, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
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

  -- 6 months of history; bypass balance trigger by inserting then restoring balances is unnecessary:
  -- trigger floors at 0 and seeded balances are the "current" state, so restore after.
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

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();