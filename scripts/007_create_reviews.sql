-- Create reviews table (bidirectional reviews)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policies
create policy "reviews_select_all"
  on public.reviews for select
  using (true);

create policy "reviews_insert_own"
  on public.reviews for insert
  with check (auth.uid() = reviewer_id);

create policy "reviews_update_own"
  on public.reviews for update
  using (auth.uid() = reviewer_id);

-- Create indexes
create index if not exists reviews_reviewee_idx on public.reviews (reviewee_id);
create index if not exists reviews_request_idx on public.reviews (request_id);

-- Function to update worker rating
create or replace function update_worker_rating()
returns trigger as $$
begin
  update public.workers
  set rating = (
    select avg(rating)::decimal(3,2)
    from public.reviews
    where reviewee_id = new.reviewee_id
  )
  where id = new.reviewee_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_rating_trigger on public.reviews;

create trigger update_rating_trigger
  after insert or update on public.reviews
  for each row
  execute function update_worker_rating();
