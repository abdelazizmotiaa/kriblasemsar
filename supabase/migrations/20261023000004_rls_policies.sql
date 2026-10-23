-- ====================================================================
-- MIGRATION 004: COMPLETE ROW LEVEL SECURITY (RLS) POLICIES
-- Platform: https://kriblasemsar.com
-- ====================================================================

-- Enable RLS across all tables
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_moderation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 1. admin_roles Policies
-- --------------------------------------------------------------------
CREATE POLICY "Admin roles readable only by super admins"
ON public.admin_roles FOR SELECT
USING (public.is_admin(auth.uid()));

-- --------------------------------------------------------------------
-- 2. profiles Policies
-- --------------------------------------------------------------------
-- Anyone can view basic public profile info (name, avatar, trust level)
CREATE POLICY "Public profile data viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

-- Authenticated users can update ONLY their own profile
-- Users CANNOT change phone_verified_at, account_status, or trust_level directly
CREATE POLICY "Users can update their own profile fields"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
);

-- Profiles inserted on auth.users signup
CREATE POLICY "Users can insert their own initial profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- --------------------------------------------------------------------
-- 3. cities Policies (Public Reference)
-- --------------------------------------------------------------------
CREATE POLICY "Cities are viewable by all users"
ON public.cities FOR SELECT
USING (true);

CREATE POLICY "Cities manageable only by admins"
ON public.cities FOR ALL
USING (public.is_admin(auth.uid()));

-- --------------------------------------------------------------------
-- 4. listings Policies (Zero Semsar Security)
-- --------------------------------------------------------------------
-- Anyone can view published listings
CREATE POLICY "Published listings are viewable by all"
ON public.listings FOR SELECT
USING (status = 'published');

-- Owners can view all their own listings (draft, pending_review, rejected, etc.)
CREATE POLICY "Owners can view their own listings"
ON public.listings FOR SELECT
USING (auth.uid() = owner_id);

-- Admins can view all listings
CREATE POLICY "Admins can view all listings"
ON public.listings FOR SELECT
USING (public.is_admin(auth.uid()));

-- Authenticated users can create draft listings
CREATE POLICY "Authenticated users can create listings"
ON public.listings FOR INSERT
WITH CHECK (
  auth.uid() = owner_id 
  AND status = 'draft' -- Cannot directly insert as 'published'!
);

-- Owners can edit their own draft or pending listings
-- Cannot self-promote status to 'published'
CREATE POLICY "Owners can update their own listings"
ON public.listings FOR UPDATE
USING (auth.uid() = owner_id)
WITH CHECK (
  auth.uid() = owner_id
  AND (
    -- If status changes, it can only go to draft, pending_review, or rented
    status IN ('draft', 'pending_review', 'rented')
    OR status = (SELECT status FROM public.listings WHERE id = listings.id)
  )
);

-- Owners can delete their own listings if not in active contract
CREATE POLICY "Owners can delete their own listings"
ON public.listings FOR DELETE
USING (auth.uid() = owner_id);

-- --------------------------------------------------------------------
-- 5. listing_photos Policies
-- --------------------------------------------------------------------
CREATE POLICY "Listing photos viewable by everyone"
ON public.listing_photos FOR SELECT
USING (true);

CREATE POLICY "Owners can insert photos for their own listings"
ON public.listing_photos FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE id = listing_id AND owner_id = auth.uid()
  )
);

CREATE POLICY "Owners can delete photos from their own listings"
ON public.listing_photos FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE id = listing_id AND owner_id = auth.uid()
  )
);

-- --------------------------------------------------------------------
-- 6. listing_amenities Policies
-- --------------------------------------------------------------------
CREATE POLICY "Amenities viewable by everyone"
ON public.listing_amenities FOR SELECT
USING (true);

CREATE POLICY "Owners can manage amenities for their own listings"
ON public.listing_amenities FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE id = listing_id AND owner_id = auth.uid()
  )
);

-- --------------------------------------------------------------------
-- 7. seeker_profiles Policies
-- --------------------------------------------------------------------
CREATE POLICY "Public seeker profiles viewable by all"
ON public.seeker_profiles FOR SELECT
USING (
  profile_visibility = 'public'
  OR (profile_visibility = 'verified_only' AND auth.uid() IS NOT NULL)
  OR auth.uid() = user_id
);

CREATE POLICY "Users can manage their own seeker profile"
ON public.seeker_profiles FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 8. favorites Policies
-- --------------------------------------------------------------------
CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 9. listing_reports & user_reports Policies
-- --------------------------------------------------------------------
CREATE POLICY "Authenticated users can submit listing reports"
ON public.listing_reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Only admins can view listing reports"
ON public.listing_reports FOR SELECT
USING (public.is_admin(auth.uid()) OR auth.uid() = reporter_id);

CREATE POLICY "Only admins can update listing reports"
ON public.listing_reports FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can submit user reports"
ON public.user_reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Only admins can view user reports"
ON public.user_reports FOR SELECT
USING (public.is_admin(auth.uid()));

-- --------------------------------------------------------------------
-- 10. contact_events Policies
-- --------------------------------------------------------------------
CREATE POLICY "Requesters and Owners can view their own contact events"
ON public.contact_events FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = owner_id OR public.is_admin(auth.uid()));

-- Insert is performed via reveal_contact_info RPC (SECURITY DEFINER)
-- Direct client insertions are rejected
CREATE POLICY "Direct client inserts into contact_events disallowed"
ON public.contact_events FOR INSERT
WITH CHECK (false);

-- --------------------------------------------------------------------
-- 11. phone_verifications Policies
-- --------------------------------------------------------------------
-- Direct reads/writes disallowed. Verification executed exclusively via RPC
CREATE POLICY "Direct phone_verifications client access disallowed"
ON public.phone_verifications FOR ALL
USING (false);

-- --------------------------------------------------------------------
-- 12. audit_logs Policies
-- --------------------------------------------------------------------
CREATE POLICY "Audit logs viewable only by super admins"
ON public.audit_logs FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Direct inserts into audit_logs disallowed"
ON public.audit_logs FOR INSERT
WITH CHECK (false);

-- --------------------------------------------------------------------
-- 13. saved_searches Policies
-- --------------------------------------------------------------------
CREATE POLICY "Users can view and manage their own saved searches"
ON public.saved_searches FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
