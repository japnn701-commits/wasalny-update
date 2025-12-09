-- Create a view for worker_profiles to maintain backward compatibility
-- This view allows the code to use 'worker_profiles' while the actual table is 'workers'

create or replace view public.worker_profiles as
select 
  w.*,
  p.full_name,
  p.email,
  p.phone,
  p.avatar_url,
  p.created_at as profile_created_at,
  p.updated_at as profile_updated_at
from public.workers w
inner join public.profiles p on w.id = p.id;

-- Grant permissions
grant select on public.worker_profiles to authenticated;
grant select on public.worker_profiles to anon;

-- Enable RLS on the view (inherits from underlying tables)
-- Note: RLS policies on the underlying 'workers' and 'profiles' tables will apply

-- Create a function to handle inserts (redirect to workers table)
create or replace function public.insert_worker_profile()
returns trigger as $$
begin
  insert into public.workers (
    id, service_ids, experience_years, hourly_rate, bio,
    location_lat, location_lng, city, address, is_available,
    is_verified, total_jobs, rating, subscription_type, subscription_expires_at
  ) values (
    new.id, new.service_ids, new.experience_years, new.hourly_rate, new.bio,
    new.location_lat, new.location_lng, new.city, new.address, new.is_available,
    new.is_verified, new.total_jobs, new.rating, new.subscription_type, new.subscription_expires_at
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create a function to handle updates
create or replace function public.update_worker_profile()
returns trigger as $$
begin
  update public.workers set
    service_ids = new.service_ids,
    experience_years = new.experience_years,
    hourly_rate = new.hourly_rate,
    bio = new.bio,
    location_lat = new.location_lat,
    location_lng = new.location_lng,
    city = new.city,
    address = new.address,
    is_available = new.is_available,
    is_verified = new.is_verified,
    total_jobs = new.total_jobs,
    rating = new.rating,
    subscription_type = new.subscription_type,
    subscription_expires_at = new.subscription_expires_at,
    updated_at = now()
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- Note: Since views in PostgreSQL don't support direct INSERT/UPDATE/DELETE,
-- you'll need to update your code to use the 'workers' table directly for writes,
-- or use the functions above through triggers (though this is more complex).

-- Recommended approach: Update your application code to use 'workers' table directly
-- This view is mainly for backward compatibility with SELECT queries

