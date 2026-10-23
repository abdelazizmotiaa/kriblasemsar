-- ====================================================================
-- KriblaSemsar — Migration 000005: Supabase Storage Buckets & Policies
-- Storage isolation, RLS rules, and photo lifecycle management
-- ====================================================================

-- 1. Create Storage Buckets in storage.buckets (idempotent)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'listing-photos',
        'listing-photos',
        true,
        10485760, -- 10MB limit per image before compression
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    ),
    (
        'verification-documents',
        'verification-documents',
        false, -- Private bucket! Never publicly exposed
        15728640, -- 15MB
        ARRAY['application/pdf', 'image/jpeg', 'image/png']
    )
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage RLS Policies for listing-photos
-- Path structure: listing-photos/{user_id}/{listing_id}/{photo_id}.webp

-- Anyone can view listing photos
CREATE POLICY "Public can view listing photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-photos');

-- Authenticated users can upload listing photos into their own user directory
CREATE POLICY "Users can upload their listing photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update photos in their own directory
CREATE POLICY "Users can update their listing photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own listing photos (or moderators)
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
            AND role IN ('super_admin', 'moderator')
        )
    )
);

-- 3. Storage RLS Policies for verification-documents (Strictly Private)
-- Path structure: verification-documents/{user_id}/{doc_id}.pdf

-- Document owners and platform administrators can view documents
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
            AND role IN ('super_admin', 'moderator')
        )
    )
);

-- Users can upload documents only to their own directory
CREATE POLICY "Users can upload verification documents to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own verification documents
CREATE POLICY "Users and admins can delete verification documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'verification-documents'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM public.admin_roles
            WHERE user_id = auth.uid()
            AND role IN ('super_admin', 'moderator')
        )
    )
);
