-- Auto-create profile on signup using metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, phone, city)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'worker'),
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'phone', null),
    coalesce(new.raw_user_meta_data ->> 'city', null)
  )
  on conflict (id) do nothing;

  -- If role is company, also create a company row
  if coalesce(new.raw_user_meta_data ->> 'role', 'worker') = 'company' then
    insert into public.companies (profile_id, company_name, cr_number)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'company_name', 'My Company'),
      coalesce(new.raw_user_meta_data ->> 'cr_number', null)
    )
    on conflict (profile_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Prevent unauthorized role/verification updates
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
as $$
begin
  -- If the user is not an admin, they cannot change their role or verification status
  if (
    (old.role is distinct from new.role or old.is_verified is distinct from new.is_verified)
    and not exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  ) then
    raise exception 'Unauthorized to modify role or verification status';
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_update on public.profiles;

create trigger on_profile_update
  before update on public.profiles
  for each row
  execute function public.prevent_role_escalation();
