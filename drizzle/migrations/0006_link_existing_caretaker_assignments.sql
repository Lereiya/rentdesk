update public.property_staff staff
set user_id = auth_user.id
from auth.users auth_user
where staff.user_id is null
  and lower(trim(staff.email)) = lower(trim(auth_user.email));

insert into public.user_roles (user_id, role)
select distinct staff.user_id, 'caretaker'::public.app_role
from public.property_staff staff
where staff.user_id is not null
on conflict (user_id, role) do nothing;
