-- ====================================================================
-- KRIBLASEMSAR — MIGRATION 006: SECURITY HARDENING, RISK-BASED MODERATION & PRIVACY
-- Platform: https://kriblasemsar.com
-- ====================================================================

-- 1. Replace vulnerable automatic suspension with Risk-Based Moderation
-- Prevents malicious griefing/DoS attacks where competitors submit 3 fake reports
CREATE OR REPLACE FUNCTION public.handle_listing_report_suspension()
RETURNS TRIGGER AS $$
DECLARE
  broker_report_count INTEGER;
  listing_rec RECORD;
BEGIN
  -- Count active broker/commission reports
  SELECT COUNT(*) INTO broker_report_count
  FROM public.listing_reports
  WHERE listing_id = NEW.listing_id
    AND reason IN ('suspected_broker_semsar', 'brokerage_commission_requested');

  SELECT * INTO listing_rec FROM public.listings WHERE id = NEW.listing_id;

  -- When 3 or more reports are accumulated, escalate priority for human review
  -- DO NOT automatically delete or suspend without evidence
  IF broker_report_count >= 3 THEN
    -- Escalate to high-priority review queue
    INSERT INTO public.listing_moderation_history (
      listing_id,
      action,
      reason,
      internal_notes
    ) VALUES (
      NEW.listing_id,
      'flagged_high_risk',
      'semsar_threshold_reached',
      format('Alerte de risque : %s signalements de semsar/commission enregistrés. Dossier transmis pour examen humain prioritaire.', broker_report_count)
    );

    -- Log urgent audit event for super admins
    INSERT INTO public.audit_logs (
      user_id,
      action,
      resource_type,
      resource_id,
      details
    ) VALUES (
      NEW.reporter_id,
      'flagged_high_risk',
      'listing',
      NEW.listing_id,
      jsonb_build_object(
        'report_count', broker_report_count,
        'trigger', 'risk_threshold',
        'owner_id', listing_rec.owner_id
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach trigger
DROP TRIGGER IF EXISTS trg_on_listing_report_added ON public.listing_reports;
CREATE TRIGGER trg_on_listing_report_added
AFTER INSERT ON public.listing_reports
FOR EACH ROW EXECUTE FUNCTION public.handle_listing_report_suspension();

-- --------------------------------------------------------------------
-- 2. Fix Storage RLS column name bug in Migration 005
-- Replaces erroneous 'role' column check with 'role_name'
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can delete their listing photos" ON storage.objects;
CREATE POLICY "Users can delete their listing photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'listing-photos'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM public.admin_roles
            WHERE user_id = auth.uid()
            AND role_name IN ('super_admin', 'moderator')
        )
    )
);

DROP POLICY IF EXISTS "Owners and admins can view verification documents" ON storage.objects;
CREATE POLICY "Owners and admins can view verification documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'verification-documents'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM public.admin_roles
            WHERE user_id = auth.uid()
            AND role_name IN ('super_admin', 'moderator')
        )
    )
);

-- --------------------------------------------------------------------
-- 3. Strict Profile Privacy (Moroccan Law 09-08 / CNDP)
-- Disallow unrestricted SELECT on raw profiles table.
-- Sensitive fields (phone_e164, email, account_status) readable ONLY by owner or admin.
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public profile data viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin(auth.uid()));

-- Safe Public View for directory and display name without leaking phone/email
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  display_name,
  user_type,
  preferred_language,
  avatar_path,
  trust_level,
  created_at
FROM public.profiles;
