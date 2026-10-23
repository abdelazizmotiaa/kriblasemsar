-- ====================================================================
-- MIGRATION 002: POSTGIS FUNCTIONS, CONTACT PRIVACY & MODERATION WORKFLOW
-- Platform: https://kriblasemsar.com
-- ====================================================================

-- 1. Bounding-Box Geospatial Search with Public Privacy Filtering
CREATE OR REPLACE FUNCTION public.get_listings_in_bbox(
  min_lng DOUBLE PRECISION,
  min_lat DOUBLE PRECISION,
  max_lng DOUBLE PRECISION,
  max_lat DOUBLE PRECISION,
  filter_city_id UUID DEFAULT NULL,
  filter_listing_type TEXT DEFAULT NULL,
  filter_max_price NUMERIC DEFAULT NULL,
  filter_min_price NUMERIC DEFAULT NULL,
  filter_gender TEXT DEFAULT NULL,
  filter_furnished BOOLEAN DEFAULT NULL,
  filter_wifi_fiber BOOLEAN DEFAULT NULL,
  filter_charges_included BOOLEAN DEFAULT NULL,
  limit_count INTEGER DEFAULT 100,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  owner_id UUID,
  city_id UUID,
  title TEXT,
  description TEXT,
  listing_type listing_type_enum,
  property_type property_type_enum,
  monthly_price_mad NUMERIC,
  deposit_mad NUMERIC,
  additional_charges_mad NUMERIC,
  charges_included BOOLEAN,
  charges_details TEXT,
  surface_total INTEGER,
  number_of_rooms INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  furnished BOOLEAN,
  available_from DATE,
  neighborhood TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  exact_location_hidden BOOLEAN,
  status listing_status_enum,
  gender_preference TEXT,
  occupant_type_preference TEXT,
  call_conditions_hours TEXT,
  call_conditions_note TEXT,
  photos TEXT[],
  created_at TIMESTAMPTZ,
  owner_full_name TEXT,
  owner_avatar TEXT,
  owner_verified BOOLEAN
) AS $$
DECLARE
  bbox_geom geometry;
BEGIN
  -- Strict input bounds clamp for Morocco
  bbox_geom := ST_MakeEnvelope(
    GREATEST(min_lng, -18.0),
    GREATEST(min_lat, 21.0),
    LEAST(max_lng, -1.0),
    LEAST(max_lat, 36.0),
    4326
  );

  RETURN QUERY
  SELECT
    l.id,
    l.owner_id,
    l.city_id,
    l.title,
    l.description,
    l.listing_type,
    l.property_type,
    l.monthly_price_mad,
    l.deposit_mad,
    l.additional_charges_mad,
    l.charges_included,
    l.charges_details,
    l.surface_m2 AS surface_total,
    l.number_of_rooms,
    l.bedrooms,
    l.bathrooms,
    l.furnished,
    l.available_from,
    l.neighborhood,
    -- Return public coordinates (never private exact address!)
    CASE 
      WHEN l.public_map_location IS NOT NULL THEN ST_Y(l.public_map_location::geometry)
      ELSE l.latitude
    END AS latitude,
    CASE 
      WHEN l.public_map_location IS NOT NULL THEN ST_X(l.public_map_location::geometry)
      ELSE l.longitude
    END AS longitude,
    l.exact_location_hidden,
    l.status,
    l.gender_preference,
    l.occupant_type_preference,
    l.call_conditions_hours,
    l.call_conditions_note,
    COALESCE(
      (SELECT array_agg(lp.storage_path ORDER BY lp.sort_order ASC) 
       FROM public.listing_photos lp WHERE lp.listing_id = l.id),
      ARRAY[]::TEXT[]
    ) AS photos,
    l.created_at,
    p.full_name AS owner_full_name,
    p.avatar_path AS owner_avatar,
    (p.phone_verified_at IS NOT NULL) AS owner_verified
  FROM public.listings l
  JOIN public.profiles p ON l.owner_id = p.id
  LEFT JOIN public.listing_amenities am ON l.id = am.listing_id
  WHERE l.status = 'published'
    AND l.exact_location && bbox_geom
    AND (filter_city_id IS NULL OR l.city_id = filter_city_id)
    AND (filter_listing_type IS NULL OR l.listing_type::TEXT = filter_listing_type)
    AND (filter_max_price IS NULL OR l.monthly_price_mad <= filter_max_price)
    AND (filter_min_price IS NULL OR l.monthly_price_mad >= filter_min_price)
    AND (filter_gender IS NULL OR l.gender_preference = filter_gender OR l.gender_preference = 'mixed')
    AND (filter_furnished IS NULL OR l.furnished = filter_furnished)
    AND (filter_wifi_fiber IS NULL OR am.wifi_fiber = filter_wifi_fiber)
    AND (filter_charges_included IS NULL OR l.charges_included = filter_charges_included)
  ORDER BY l.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 2. Radius Search around GPS point (e.g., Campus UM6P or Gare TGV)
CREATE OR REPLACE FUNCTION public.get_listings_nearby(
  target_lat DOUBLE PRECISION,
  target_lng DOUBLE PRECISION,
  radius_meters INTEGER DEFAULT 5000,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  monthly_price_mad NUMERIC,
  neighborhood TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  distance_meters DOUBLE PRECISION
) AS $$
DECLARE
  target_point geography;
BEGIN
  target_point := ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)::geography;

  RETURN QUERY
  SELECT
    l.id,
    l.title,
    l.monthly_price_mad,
    l.neighborhood,
    l.latitude,
    l.longitude,
    ST_Distance(l.exact_location, target_point) AS distance_meters
  FROM public.listings l
  WHERE l.status = 'published'
    AND ST_DWithin(l.exact_location, target_point, radius_meters)
  ORDER BY distance_meters ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 3. Protected Contact Reveal RPC
-- NEVER leak raw numbers to unverified or anonymous scrapers
CREATE OR REPLACE FUNCTION public.reveal_contact_info(
  target_listing_id UUID,
  user_ip_str TEXT DEFAULT NULL,
  user_agent_str TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  current_user_uuid UUID;
  requester_profile RECORD;
  listing_record RECORD;
  owner_profile RECORD;
  contact_count_today INTEGER;
  wa_text TEXT;
  wa_url TEXT;
BEGIN
  current_user_uuid := auth.uid();
  IF current_user_uuid IS NULL THEN
    RAISE EXCEPTION 'Authentification requise pour contacter le propriétaire.';
  END IF;

  -- Verify requester's profile and verified phone
  SELECT * INTO requester_profile FROM public.profiles WHERE id = current_user_uuid;
  IF requester_profile IS NULL OR requester_profile.phone_verified_at IS NULL THEN
    RAISE EXCEPTION 'Vous devez avoir un numéro marocain vérifié pour contacter directement les annonceurs.';
  END IF;

  -- Fetch listing
  SELECT * INTO listing_record FROM public.listings WHERE id = target_listing_id;
  IF listing_record IS NULL OR listing_record.status != 'published' THEN
    RAISE EXCEPTION 'Cette annonce n''est plus active ou est en cours de vérification.';
  END IF;

  -- Rate limit check (Max 10 contact reveals per user per 24h)
  SELECT COUNT(*) INTO contact_count_today
  FROM public.contact_events
  WHERE requester_id = current_user_uuid
    AND created_at >= (timezone('utc'::text, now()) - INTERVAL '24 hours');

  IF contact_count_today >= 10 THEN
    RAISE EXCEPTION 'Limite de sécurité atteinte (10 contacts par jour). Ceci protège les propriétaires contre le démarchage commercial.';
  END IF;

  -- Fetch owner profile
  SELECT * INTO owner_profile FROM public.profiles WHERE id = listing_record.owner_id;
  IF owner_profile IS NULL OR owner_profile.phone_e164 IS NULL THEN
    RAISE EXCEPTION 'Coordonnées de l''annonceur indisponibles.';
  END IF;

  -- Record audit contact event
  INSERT INTO public.contact_events (
    listing_id,
    requester_id,
    owner_id,
    contact_type,
    ip_address,
    user_agent
  ) VALUES (
    target_listing_id,
    current_user_uuid,
    listing_record.owner_id,
    'whatsapp_click',
    CASE WHEN user_ip_str IS NOT NULL THEN user_ip_str::INET ELSE NULL END,
    user_agent_str
  );

  -- Format WhatsApp message
  wa_text := format(
    'Salam / Bonjour, je vous contacte via KriblaSemsar.com pour votre annonce "%s" à %s (Loyer: %s DH). Est-elle toujours disponible ?',
    listing_record.title,
    listing_record.neighborhood,
    listing_record.monthly_price_mad::TEXT
  );

  wa_url := 'https://wa.me/' || replace(owner_profile.phone_e164, '+', '') || '?text=' || urlencode(wa_text);

  RETURN jsonb_build_object(
    'success', true,
    'owner_name', owner_profile.full_name,
    'phone_e164', owner_profile.phone_e164,
    'whatsapp_url', wa_url,
    'call_hours', listing_record.call_conditions_hours,
    'call_note', listing_record.call_conditions_note,
    'remaining_reveals_today', 10 - (contact_count_today + 1)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Automatic Moderation Suspension Trigger for Repeated Reports
CREATE OR REPLACE FUNCTION public.handle_listing_report_suspension()
RETURNS TRIGGER AS $$
DECLARE
  broker_report_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO broker_report_count
  FROM public.listing_reports
  WHERE listing_id = NEW.listing_id
    AND reason IN ('suspected_broker_semsar', 'brokerage_commission_requested');

  -- If 3 or more broker reports, automatically suspend for staff inspection
  IF broker_report_count >= 3 THEN
    UPDATE public.listings
    SET status = 'suspended'
    WHERE id = NEW.listing_id;

    INSERT INTO public.listing_moderation_history (
      listing_id,
      action,
      reason,
      internal_notes
    ) VALUES (
      NEW.listing_id,
      'suspended',
      'semsar_threshold_reached',
      format('Suspension automatique suite à %s signalements de semsar ou demande de commission.', broker_report_count)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_on_listing_report_added
AFTER INSERT ON public.listing_reports
FOR EACH ROW EXECUTE FUNCTION public.handle_listing_report_suspension();

-- 5. Safe Submission of Listing: Draft -> Pending Review
CREATE OR REPLACE FUNCTION public.submit_listing_for_review(target_listing_id UUID)
RETURNS JSONB AS $$
DECLARE
  current_user_uuid UUID;
  listing_record RECORD;
BEGIN
  current_user_uuid := auth.uid();
  IF current_user_uuid IS NULL THEN
    RAISE EXCEPTION 'Authentification requise.';
  END IF;

  SELECT * INTO listing_record FROM public.listings WHERE id = target_listing_id;
  IF listing_record IS NULL OR listing_record.owner_id != current_user_uuid THEN
    RAISE EXCEPTION 'Annonce introuvable ou vous n''êtes pas le propriétaire.';
  END IF;

  -- Ensure listing has at least 1 photo
  IF NOT EXISTS (SELECT 1 FROM public.listing_photos WHERE listing_id = target_listing_id) THEN
    RAISE EXCEPTION 'Veuillez ajouter au moins une photo avant de soumettre l''annonce.';
  END IF;

  UPDATE public.listings
  SET status = 'pending_review',
      updated_at = timezone('utc'::text, now())
  WHERE id = target_listing_id;

  INSERT INTO public.listing_moderation_history (
    listing_id,
    action,
    reason,
    internal_notes
  ) VALUES (
    target_listing_id,
    'approved', -- initial submit
    'user_submission',
    'Soumission par l''utilisateur pour modération anti-semsar.'
  );

  RETURN jsonb_build_object('success', true, 'status', 'pending_review');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Moderation Approval RPC (Admins Only)
CREATE OR REPLACE FUNCTION public.moderate_listing(
  target_listing_id UUID,
  new_status TEXT,
  reason_text TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  current_user_uuid UUID;
BEGIN
  current_user_uuid := auth.uid();
  IF NOT public.is_admin(current_user_uuid) THEN
    RAISE EXCEPTION 'Privilèges administrateur requis pour modérer une annonce.';
  END IF;

  IF new_status NOT IN ('published', 'rejected', 'suspended') THEN
    RAISE EXCEPTION 'Statut de modération non valide.';
  END IF;

  UPDATE public.listings
  SET status = new_status::listing_status_enum,
      published_at = CASE WHEN new_status = 'published' THEN timezone('utc'::text, now()) ELSE published_at END,
      updated_at = timezone('utc'::text, now())
  WHERE id = target_listing_id;

  INSERT INTO public.listing_moderation_history (
    listing_id,
    moderator_id,
    action,
    reason,
    internal_notes
  ) VALUES (
    target_listing_id,
    current_user_uuid,
    new_status,
    reason_text,
    'Décision prise par le modérateur.'
  );

  RETURN jsonb_build_object('success', true, 'status', new_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
