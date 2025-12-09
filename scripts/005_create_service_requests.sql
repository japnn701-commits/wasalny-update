-- Create service requests table
create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  worker_id uuid references public.workers(id) on delete set null,
  service_id uuid not null references public.services(id),
  title text not null,
  description text not null,
  problem_images text[],
  location_lat decimal(10,8),
  location_lng decimal(11,8),
  city text,
  address text not null,
  scheduled_date timestamp with time zone,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  is_emergency boolean default false,
  is_auction boolean default false,
  final_price decimal(10,2),
  payment_method text check (payment_method in ('cash', 'card', 'wallet')),
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.service_requests enable row level security;

-- Policies
create policy "requests_select_own_customer"
  on public.service_requests for select
  using (auth.uid() = customer_id);

create policy "requests_select_own_worker"
  on public.service_requests for select
  using (auth.uid() = worker_id);

create policy "requests_select_pending_workers"
  on public.service_requests for select
  using (
    status = 'pending' and 
    auth.uid() in (select id from public.workers)
  );

create policy "requests_insert_customer"
  on public.service_requests for insert
  with check (auth.uid() = customer_id);

create policy "requests_update_customer"
  on public.service_requests for update
  using (auth.uid() = customer_id);

create policy "requests_update_worker"
  on public.service_requests for update
  using (auth.uid() = worker_id);

-- Create indexes
create index if not exists requests_customer_idx on public.service_requests (customer_id);
create index if not exists requests_worker_idx on public.service_requests (worker_id);
create index if not exists requests_status_idx on public.service_requests (status);
create index if not exists requests_created_idx on public.service_requests (created_at desc);
