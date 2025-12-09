-- Create bids table for auction system
create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  worker_id uuid not null references public.workers(id) on delete cascade,
  proposed_price decimal(10,2) not null,
  estimated_duration text,
  message text,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.bids enable row level security;

-- Policies
create policy "bids_select_request_owner"
  on public.bids for select
  using (
    request_id in (
      select id from public.service_requests where customer_id = auth.uid()
    )
  );

create policy "bids_select_own_worker"
  on public.bids for select
  using (auth.uid() = worker_id);

create policy "bids_insert_worker"
  on public.bids for insert
  with check (auth.uid() = worker_id);

create policy "bids_update_worker"
  on public.bids for update
  using (auth.uid() = worker_id);

-- Create indexes
create index if not exists bids_request_idx on public.bids (request_id);
create index if not exists bids_worker_idx on public.bids (worker_id);
