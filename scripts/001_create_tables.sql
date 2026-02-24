-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('worker', 'company', 'admin')),
  full_name text,
  phone text,
  city text,
  avatar_url text,
  rating numeric default 0,
  ratings_count integer default 0,
  is_verified boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Anyone can view profiles" on public.profiles for select using (true);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
create policy "Users can delete own profile" on public.profiles for delete using (auth.uid() = id);

-- Companies table
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade unique,
  company_name text not null,
  cr_number text,
  description text,
  logo_url text,
  created_at timestamptz default now()
);

alter table public.companies enable row level security;

create policy "Anyone can view companies" on public.companies for select using (true);
create policy "Owner can insert company" on public.companies for insert with check (auth.uid() = profile_id);
create policy "Owner can update company" on public.companies for update using (auth.uid() = profile_id);
create policy "Owner can delete company" on public.companies for delete using (auth.uid() = profile_id);

-- Jobs table
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  description text,
  city text,
  location text,
  start_date date,
  end_date date,
  salary numeric,
  workers_needed integer default 1,
  status text default 'open' check (status in ('open', 'closed', 'completed')),
  created_at timestamptz default now()
);

alter table public.jobs enable row level security;

create policy "Anyone can view jobs" on public.jobs for select using (true);
create policy "Company owner can insert jobs" on public.jobs for insert
  with check (
    exists (
      select 1 from public.companies
      where companies.id = company_id
      and companies.profile_id = auth.uid()
    )
  );
create policy "Company owner can update jobs" on public.jobs for update
  using (
    exists (
      select 1 from public.companies
      where companies.id = company_id
      and companies.profile_id = auth.uid()
    )
  );
create policy "Company owner can delete jobs" on public.jobs for delete
  using (
    exists (
      select 1 from public.companies
      where companies.id = company_id
      and companies.profile_id = auth.uid()
    )
  );

-- Applications table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  unique(job_id, worker_id)
);

alter table public.applications enable row level security;

create policy "Workers can view own applications" on public.applications
  for select using (auth.uid() = worker_id);
create policy "Company owners can view job applications" on public.applications
  for select using (
    exists (
      select 1 from public.jobs
      join public.companies on companies.id = jobs.company_id
      where jobs.id = job_id
      and companies.profile_id = auth.uid()
    )
  );
create policy "Workers can insert applications" on public.applications
  for insert with check (auth.uid() = worker_id);
create policy "Company owners can update applications" on public.applications
  for update using (
    exists (
      select 1 from public.jobs
      join public.companies on companies.id = jobs.company_id
      where jobs.id = job_id
      and companies.profile_id = auth.uid()
    )
  );

-- Ratings table
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  from_user uuid not null references public.profiles(id) on delete cascade,
  to_user uuid not null references public.profiles(id) on delete cascade,
  score integer not null check (score >= 1 and score <= 5),
  comment text,
  created_at timestamptz default now(),
  unique(job_id, from_user, to_user)
);

alter table public.ratings enable row level security;

create policy "Anyone can view ratings" on public.ratings for select using (true);
create policy "Authenticated users can insert ratings" on public.ratings
  for insert with check (auth.uid() = from_user);
