-- Create loyalty points table
create table if not exists public.loyalty_points (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null default 0,
  total_earned integer not null default 0,
  total_spent integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(customer_id)
);

-- Enable RLS
alter table public.loyalty_points enable row level security;

-- Policies
create policy "loyalty_select_own"
  on public.loyalty_points for select
  using (auth.uid() = customer_id);

create policy "loyalty_insert_own"
  on public.loyalty_points for insert
  with check (auth.uid() = customer_id);

create policy "loyalty_update_own"
  on public.loyalty_points for update
  using (auth.uid() = customer_id);

-- Create loyalty transactions table
create table if not exists public.loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null,
  type text not null check (type in ('earned', 'spent', 'expired')),
  description text,
  request_id uuid references public.service_requests(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.loyalty_transactions enable row level security;

-- Policies
create policy "transactions_select_own"
  on public.loyalty_transactions for select
  using (auth.uid() = customer_id);

create policy "transactions_insert_own"
  on public.loyalty_transactions for insert
  with check (auth.uid() = customer_id);
