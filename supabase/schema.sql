-- ==========================================================
-- WWW.KRIBLASEMSAR.COM (0% Semsar - La Carte des Colocs Maroc)
-- Supabase PostgreSQL + PostGIS Schema & RLS Policies
-- ==========================================================

-- 1. Enable PostGIS extension for geospatial radius and bounding-box queries
create extension if not exists postgis;

-- 2. Users table (Profiles linked to Supabase Auth)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  avatar_url text,
  phone_number text,
  phone_verified boolean default false,
  whatsapp_number text,
  role text check (role in ('tenant', 'flatmate', 'owner', 'admin')) default 'tenant',
  occupation text check (occupation in ('student', 'phd_researcher', 'corporate_professional', 'other')) default 'corporate_professional',
  verified_badge boolean default false,
  country_code text default 'MA',
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Listings table
create table if not exists public.listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  listing_type text check (listing_type in ('colocation_room', 'full_apartment', 'roommate_search')) not null,
  title text not null,
  description text not null,
  country_code text default 'MA' not null,
  city text not null,
  neighborhood text not null,
  latitude double precision not null,
  longitude double precision not null,
  geom geometry(Point, 4326) generated always as (st_setsrid(st_makepoint(longitude, latitude), 4326)) stored,
  exact_location_hidden boolean default false,
  price_amount numeric(10, 2) not null,
  currency text default 'MAD' not null,
  deposit_amount numeric(10, 2) default 0,
  charges_included boolean default false,
  charges_details text,
  surface_total integer not null,
  room_surface integer,
  total_rooms integer default 1,
  available_rooms integer default 1,
  furnished boolean default true,
  gender_preference text check (gender_preference in ('female_only', 'male_only', 'mixed')) default 'mixed',
  occupant_type_preference text check (occupant_type_preference in ('students', 'professionals', 'any')) default 'any',
  amenities jsonb default '{"wifi_fiber": true, "washing_machine": true, "ac": false, "parking": false, "elevator": false, "security_24_7": false, "kitchen_equipped": true}'::jsonb,
  contact_methods jsonb default '{"allow_whatsapp": true, "allow_phone": true, "allow_internal_chat": true}'::jsonb,
  call_conditions_hours text default '18h00 - 21h00',
  call_conditions_note text default 'Travail en journée, merci de privilégier WhatsApp',
  available_from date default current_date,
  min_stay_months integer default 1,
  current_flatmates_description text,
  house_rules jsonb default '{"non_smoker": true, "pets_allowed": false, "quiet_hours": true, "overnight_guests": false}'::jsonb,
  status text check (status in ('active', 'rented', 'flagged_semsar')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create spatial index for fast geospatial bounding-box search
create index if not exists listings_geom_idx on public.listings using gist(geom);
create index if not exists listings_city_idx on public.listings(city);
create index if not exists listings_status_idx on public.listings(status);

-- 4. Listing Photos table
create table if not exists public.listing_photos (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  photo_url text not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Favorites table
create table if not exists public.favorites (
  user_id uuid references public.users(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, listing_id)
);

-- 6. Anti-Semsar Reports table
create table if not exists public.semsar_reports (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  reporter_user_id uuid references public.users(id) on delete cascade not null,
  reason text not null,
  evidence_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Trigger: Automatically suspend listing when 3 Semsar reports are filed
create or replace function handle_semsar_flagging()
returns trigger as $$
declare
  report_count integer;
begin
  select count(*) into report_count from public.semsar_reports where listing_id = new.listing_id;
  if report_count >= 3 then
    update public.listings set status = 'flagged_semsar' where id = new.listing_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_semsar_report_added
after insert on public.semsar_reports
for each row execute function handle_semsar_flagging();

-- 8. Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.favorites enable row level security;
alter table public.semsar_reports enable row level security;

-- Public can read active listings
create policy "Active listings are viewable by everyone" 
  on public.listings for select using (status = 'active');

-- Owners can modify their own listings
create policy "Users can insert and update their own listings"
  on public.listings for all using (auth.uid() = user_id);

-- Anyone can view listing photos
create policy "Photos are viewable by everyone"
  on public.listing_photos for select using (true);

-- Authenticated users can manage favorites
create policy "Users can manage their own favorites"
  on public.favorites for all using (auth.uid() = user_id);

-- Authenticated users can submit semsar reports
create policy "Users can submit semsar reports"
  on public.semsar_reports for insert with check (auth.uid() = reporter_user_id);
