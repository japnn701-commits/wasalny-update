-- Create worker portfolio table (photos of their work)
create table if not exists public.worker_portfolio (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.workers(id) on delete cascade,
  image_url text not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.worker_portfolio enable row level security;

-- Policies
create policy "portfolio_select_all"
  on public.worker_portfolio for select
  using (true);

create policy "portfolio_insert_own"
  on public.worker_portfolio for insert
  with check (auth.uid() = worker_id);

create policy "portfolio_update_own"
  on public.worker_portfolio for update
  using (auth.uid() = worker_id);

create policy "portfolio_delete_own"
  on public.worker_portfolio for delete
  using (auth.uid() = worker_id);
