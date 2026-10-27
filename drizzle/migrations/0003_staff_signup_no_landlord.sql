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
  -- signed up through a staff/tenant login without an invitation: no landlord account
  if coalesce(new.raw_user_meta_data->>'portal','landlord') <> 'landlord' then return new; end if;

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