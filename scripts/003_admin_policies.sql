-- Allow admins to update any profile (for verification)
create policy "Admins can update all profiles" on public.profiles
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Allow admins to view all applications
create policy "Admins can view all applications" on public.applications
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Allow admins to view all jobs
create policy "Admins can view all jobs" on public.jobs
  for select using (true);
