-- Create workers table (extended info for workers)
create table if not exists public.workers (
  id uuid primary key references public.profiles(id) on delete cascade,
  service_ids uuid[] not null,
  experience_years integer,
  hourly_rate decimal(10,2),
  bio text,
  location_lat decimal(10,8),
  location_lng decimal(11,8),
  city text,
  address text,
  is_available boolean default true,
  is_verified boolean default false,
  total_jobs integer default 0,
  rating decimal(3,2) default 0,
  subscription_type text default 'basic' check (subscription_type in ('basic', 'pro', 'premium')),
  subscription_expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.workers enable row level security;

-- Policies for workers
create policy "workers_select_all"
  on public.workers for select
  using (true);

create policy "workers_insert_own"
  on public.workers for insert
  with check (auth.uid() = id);

create policy "workers_update_own"
  on public.workers for update
  using (auth.uid() = id);

create policy "workers_delete_own"
  on public.workers for delete
  using (auth.uid() = id);

-- Create index for location-based searches
create index if not exists workers_location_idx on public.workers (location_lat, location_lng);
create index if not exists workers_city_idx on public.workers (city);
create index if not exists workers_rating_idx on public.workers (rating desc);
