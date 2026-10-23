import { describe, it, expect } from 'vitest';
import {
  validateImageFile,
  buildListingPhotoPath,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_PHOTOS_PER_LISTING,
} from '../imageOptimizer';

describe('imageOptimizer', () => {
  describe('validateImageFile', () => {
    it('accepts valid JPEG, PNG, and WebP images within 10MB', () => {
      const mockJpeg = new File(['mock content'], 'photo.jpg', { type: 'image/jpeg' });
      expect(validateImageFile(mockJpeg).valid).toBe(true);

      const mockWebp = new File(['mock content'], 'photo.webp', { type: 'image/webp' });
      expect(validateImageFile(mockWebp).valid).toBe(true);

      const mockPng = new File(['mock content'], 'photo.png', { type: 'image/png' });
      expect(validateImageFile(mockPng).valid).toBe(true);
    });

    it('rejects unsupported file types (e.g., PDF, EXE, GIF)', () => {
      const mockPdf = new File(['mock content'], 'doc.pdf', { type: 'application/pdf' });
      const resPdf = validateImageFile(mockPdf);
      expect(resPdf.valid).toBe(false);
      expect(resPdf.error).toContain('non supporté');

      const mockGif = new File(['mock content'], 'animation.gif', { type: 'image/gif' });
      const resGif = validateImageFile(mockGif);
      expect(resGif.valid).toBe(false);
    });

    it('rejects images exceeding MAX_FILE_SIZE_BYTES (10MB)', () => {
      // Create a mock large file
      const largeBlob = new Blob([new Uint8Array(MAX_FILE_SIZE_BYTES + 1024)], { type: 'image/jpeg' });
      const res = validateImageFile(largeBlob);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('trop volumineuse');
    });

    it('handles null or empty files gracefully', () => {
      const res = validateImageFile(null as any);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('Aucun fichier');
    });
  });

  describe('buildListingPhotoPath', () => {
    it('formats standardized storage path with user, listing, and photo ids', () => {
      const path = buildListingPhotoPath(
        'user-uuid-1234',
        'listing-uuid-5678',
        'photo-01'
      );
      expect(path).toBe('user-uuid-1234/listing-uuid-5678/photo-01.webp');
    });

    it('generates thumbnail path suffix when requested', () => {
      const thumbPath = buildListingPhotoPath(
        'user-uuid-1234',
        'listing-uuid-5678',
        'photo-01',
        true
      );
      expect(thumbPath).toBe('user-uuid-1234/listing-uuid-5678/photo-01_thumb.webp');
    });

    it('sanitizes unsafe characters from identifiers', () => {
      const dirtyPath = buildListingPhotoPath(
        'user/../../evil',
        'listing<script>',
        'photo 1.jpg'
      );
      expect(dirtyPath).not.toContain('..');
      expect(dirtyPath).not.toContain('<script>');
      expect(dirtyPath).not.toContain(' ');
    });
  });

  describe('configuration constants', () => {
    it('enforces maximum 10 photos per listing', () => {
      expect(MAX_PHOTOS_PER_LISTING).toBe(10);
    });

    it('includes required modern image formats', () => {
      expect(ALLOWED_MIME_TYPES).toContain('image/webp');
      expect(ALLOWED_MIME_TYPES).toContain('image/jpeg');
      expect(ALLOWED_MIME_TYPES).toContain('image/png');
    });
  });
});
