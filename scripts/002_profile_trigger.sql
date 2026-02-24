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
