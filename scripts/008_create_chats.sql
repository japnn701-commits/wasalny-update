-- Create chats table
create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.service_requests(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  last_message text,
  last_message_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.chats enable row level security;

-- Policies
create policy "chats_select_participant"
  on public.chats for select
  using (auth.uid() = customer_id or auth.uid() = worker_id);

create policy "chats_insert_participant"
  on public.chats for insert
  with check (auth.uid() = customer_id or auth.uid() = worker_id);

-- Create indexes
create index if not exists chats_customer_idx on public.chats (customer_id);
create index if not exists chats_worker_idx on public.chats (worker_id);
create index if not exists chats_last_message_idx on public.chats (last_message_at desc);
