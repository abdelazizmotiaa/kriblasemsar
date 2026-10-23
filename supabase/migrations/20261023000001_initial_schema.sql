-- ====================================================================
-- MIGRATION 001: KRIBLASEMSAR CORE SCHEMA
-- Platform: https://kriblasemsar.com
-- ====================================================================

-- 1. Enable PostGIS and UUID Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Enumerated types
DO $$ BEGIN
  CREATE TYPE user_type_enum AS ENUM ('tenant', 'owner', 'flatmate', 'authorized_representative');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE listing_type_enum AS ENUM ('private_room', 'shared_room', 'entire_property');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE property_type_enum AS ENUM ('apartment', 'studio', 'house', 'villa', 'student_residence', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE listing_status_enum AS ENUM ('draft', 'pending_review', 'published', 'rejected', 'suspended', 'rented', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status_enum AS ENUM ('unverified', 'phone_verified', 'document_submitted', 'fully_verified');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Admin Roles (Strictly separate from user profiles)
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role_name TEXT CHECK (role_name IN ('super_admin', 'moderator', 'support')) NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Helper function to check if user is admin (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. User Profiles (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  display_name TEXT,
  email TEXT NOT NULL,
  phone_e164 TEXT,
  phone_verified_at TIMESTAMPTZ,
  user_type user_type_enum DEFAULT 'tenant' NOT NULL,
  preferred_language TEXT DEFAULT 'fr' CHECK (preferred_language IN ('fr', 'ar', 'en')),
  avatar_path TEXT,
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'pending_verification', 'banned')),
  trust_level INTEGER DEFAULT 1 CHECK (trust_level BETWEEN 0 AND 5),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Moroccan Cities
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_fr TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  center geography(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cities_center ON public.cities USING GIST(center);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON public.cities(slug);

-- 6. Property Listings
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  city_id UUID REFERENCES public.cities(id) ON DELETE RESTRICT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  listing_type listing_type_enum NOT NULL,
  property_type property_type_enum NOT NULL,
  monthly_price_mad NUMERIC(10, 2) NOT NULL CHECK (monthly_price_mad >= 0),
  deposit_mad NUMERIC(10, 2) DEFAULT 0 CHECK (deposit_mad >= 0),
  additional_charges_mad NUMERIC(10, 2) DEFAULT 0 CHECK (additional_charges_mad >= 0),
  charges_included BOOLEAN DEFAULT false,
  charges_details TEXT,
  number_of_rooms INTEGER DEFAULT 1 CHECK (number_of_rooms >= 1),
  bedrooms INTEGER DEFAULT 1 CHECK (bedrooms >= 0),
  bathrooms INTEGER DEFAULT 1 CHECK (bathrooms >= 1),
  surface_m2 INTEGER NOT NULL CHECK (surface_m2 > 0),
  furnished BOOLEAN DEFAULT true,
  available_from DATE DEFAULT CURRENT_DATE NOT NULL,
  minimum_stay_months INTEGER DEFAULT 1 CHECK (minimum_stay_months >= 1),
  neighborhood TEXT NOT NULL,
  private_address TEXT, -- PROTECTED: visible only to owner and authorized renters
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  exact_location geography(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
  -- Bruitage de 150m-200m pour la confidentialité publique
  public_map_location geography(Point, 4326),
  exact_location_hidden BOOLEAN DEFAULT false,
  status listing_status_enum DEFAULT 'draft' NOT NULL,
  verification_status verification_status_enum DEFAULT 'unverified' NOT NULL,
  views_count INTEGER DEFAULT 0,
  gender_preference TEXT DEFAULT 'mixed' CHECK (gender_preference IN ('mixed', 'female_only', 'male_only')),
  occupant_type_preference TEXT DEFAULT 'any' CHECK (occupant_type_preference IN ('any', 'students', 'professionals')),
  call_conditions_hours TEXT DEFAULT '18h30 - 21h00',
  call_conditions_note TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (timezone('utc'::text, now()) + INTERVAL '60 days')
);

CREATE INDEX IF NOT EXISTS idx_listings_exact_loc ON public.listings USING GIST(exact_location);
CREATE INDEX IF NOT EXISTS idx_listings_public_loc ON public.listings USING GIST(public_map_location);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(monthly_price_mad);

CREATE TRIGGER set_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. Listing Photos
CREATE TABLE IF NOT EXISTS public.listing_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  width INTEGER,
  height INTEGER,
  mime_type TEXT DEFAULT 'image/webp',
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_listing_photos_listing ON public.listing_photos(listing_id, sort_order);

-- 8. Listing Amenities
CREATE TABLE IF NOT EXISTS public.listing_amenities (
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE PRIMARY KEY,
  wifi_fiber BOOLEAN DEFAULT true,
  washing_machine BOOLEAN DEFAULT false,
  ac BOOLEAN DEFAULT false,
  parking BOOLEAN DEFAULT false,
  elevator BOOLEAN DEFAULT false,
  security_24_7 BOOLEAN DEFAULT false,
  kitchen_equipped BOOLEAN DEFAULT true,
  balcony BOOLEAN DEFAULT false,
  private_bathroom BOOLEAN DEFAULT false
);

-- 9. Seeker Profiles (Recherche de Colocataires)
CREATE TABLE IF NOT EXISTS public.seeker_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  preferred_city_id UUID REFERENCES public.cities(id) ON DELETE RESTRICT NOT NULL,
  preferred_neighborhoods TEXT[] DEFAULT '{}',
  min_budget_mad NUMERIC(10, 2) DEFAULT 1000,
  max_budget_mad NUMERIC(10, 2) DEFAULT 4000,
  desired_move_in_date DATE DEFAULT CURRENT_DATE,
  preferred_housing_type listing_type_enum DEFAULT 'private_room',
  gender_preference TEXT DEFAULT 'mixed',
  short_introduction TEXT,
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'verified_only', 'hidden')),
  contact_preference TEXT DEFAULT 'whatsapp' CHECK (contact_preference IN ('whatsapp', 'phone', 'platform')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER set_seeker_profiles_updated_at
BEFORE UPDATE ON public.seeker_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 10. Favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, listing_id)
);

-- 11. Listing & User Reports (Signalements Anti-Semsar & Fraude)
CREATE TABLE IF NOT EXISTS public.listing_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN (
    'suspected_broker_semsar',
    'brokerage_commission_requested',
    'fake_listing',
    'incorrect_price',
    'property_unavailable',
    'stolen_photos',
    'harassment',
    'other'
  )),
  evidence_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved_action_taken', 'dismissed')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_listing_reports_listing ON public.listing_reports(listing_id);

CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  evidence_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Contact Events (Audit anti-scraping & dévoilement sécurisé)
CREATE TABLE IF NOT EXISTS public.contact_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  contact_type TEXT CHECK (contact_type IN ('whatsapp_click', 'phone_call_reveal', 'internal_message')) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_events_requester ON public.contact_events(requester_id, created_at);

-- 13. Phone Verifications (Historique et Rate Limiting des OTP)
CREATE TABLE IF NOT EXISTS public.phone_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  phone_e164 TEXT NOT NULL,
  otp_hash TEXT NOT NULL, -- Hashed with salt, NEVER stored in plaintext
  channel TEXT CHECK (channel IN ('whatsapp', 'sms')) DEFAULT 'whatsapp' NOT NULL,
  attempts INTEGER DEFAULT 0 CHECK (attempts >= 0),
  max_attempts INTEGER DEFAULT 3,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  provider_reference TEXT,
  cost_estimate_mad NUMERIC(6, 4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_phone_verifications_user ON public.phone_verifications(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone ON public.phone_verifications(phone_e164, created_at);

-- 14. Listing Moderation History
CREATE TABLE IF NOT EXISTS public.listing_moderation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  moderator_id UUID REFERENCES public.profiles(id),
  action TEXT CHECK (action IN ('approved', 'rejected', 'suspended', 'reinstated')) NOT NULL,
  reason TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. Account Restrictions
CREATE TABLE IF NOT EXISTS public.account_restrictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  restriction_type TEXT CHECK (restriction_type IN ('shadow_ban', 'contact_limit', 'posting_block', 'full_ban')) NOT NULL,
  reason TEXT NOT NULL,
  applied_by UUID REFERENCES public.profiles(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id, created_at);

-- 17. Saved Searches & Notifications
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  city_id UUID REFERENCES public.cities(id),
  neighborhoods TEXT[],
  listing_type listing_type_enum,
  max_price_mad NUMERIC(10, 2),
  notify_email BOOLEAN DEFAULT true,
  notify_whatsapp BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
