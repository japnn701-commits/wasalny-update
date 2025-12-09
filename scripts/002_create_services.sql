-- Create services table (types of services available)
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  icon text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.services enable row level security;

-- Allow everyone to read services
create policy "services_select_all"
  on public.services for select
  using (true);

-- Insert default services
insert into public.services (name_ar, name_en, description_ar, description_en, icon) values
  ('سباكة', 'Plumbing', 'خدمات السباكة والصيانة', 'Plumbing and maintenance services', 'wrench'),
  ('كهرباء', 'Electrical', 'خدمات الكهرباء والإصلاح', 'Electrical and repair services', 'zap'),
  ('نقاشة', 'Painting', 'خدمات الدهان والنقاشة', 'Painting and decoration services', 'paintbrush'),
  ('محارة', 'Plastering', 'خدمات المحارة والتشطيب', 'Plastering and finishing services', 'hammer'),
  ('تشطيب', 'Finishing', 'خدمات التشطيب الكامل', 'Complete finishing services', 'home'),
  ('صيانة عامة', 'General Maintenance', 'خدمات الصيانة العامة', 'General maintenance services', 'tool'),
  ('تكييف', 'Air Conditioning', 'صيانة وتركيب التكييفات', 'AC installation and maintenance', 'wind'),
  ('نجارة', 'Carpentry', 'خدمات النجارة والأثاث', 'Carpentry and furniture services', 'box')
on conflict do nothing;
