-- Create messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  image_url text,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.messages enable row level security;

-- Policies
create policy "messages_select_chat_participant"
  on public.messages for select
  using (
    chat_id in (
      select id from public.chats 
      where customer_id = auth.uid() or worker_id = auth.uid()
    )
  );

create policy "messages_insert_chat_participant"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and
    chat_id in (
      select id from public.chats 
      where customer_id = auth.uid() or worker_id = auth.uid()
    )
  );

-- Create index
create index if not exists messages_chat_idx on public.messages (chat_id, created_at desc);

-- Function to update last message in chat
create or replace function update_chat_last_message()
returns trigger as $$
begin
  update public.chats
  set 
    last_message = new.content,
    last_message_at = new.created_at
  where id = new.chat_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_last_message_trigger on public.messages;

create trigger update_last_message_trigger
  after insert on public.messages
  for each row
  execute function update_chat_last_message();
