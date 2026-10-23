import { describe, it, expect } from 'vitest';
import {
  phoneInputSchema,
  otpVerificationSchema,
  listingCreationSchema,
  semsarReportSchema,
} from '../schemas';

describe('Zod Validation Schemas', () => {
  describe('phoneInputSchema', () => {
    it('accepts valid phone input with channel', () => {
      const res = phoneInputSchema.safeParse({
        phone: '0671581167',
        channel: 'whatsapp',
      });
      expect(res.success).toBe(true);
    });

    it('rejects unsupported channel', () => {
      const res = phoneInputSchema.safeParse({
        phone: '0671581167',
        channel: 'telegram',
      });
      expect(res.success).toBe(false);
    });
  });

  describe('otpVerificationSchema', () => {
    it('accepts valid 6-digit numeric OTP with Moroccan E.164 phone', () => {
      const res = otpVerificationSchema.safeParse({
        phone: '+212671581167',
        code: '123456',
      });
      expect(res.success).toBe(true);
    });

    it('rejects OTP with non-digits or wrong length', () => {
      const resLetters = otpVerificationSchema.safeParse({
        phone: '+212671581167',
        code: '12A456',
      });
      expect(resLetters.success).toBe(false);

      const resShort = otpVerificationSchema.safeParse({
        phone: '+212671581167',
        code: '12345',
      });
      expect(resShort.success).toBe(false);
    });
  });

  describe('listingCreationSchema', () => {
    it('accepts compliant listing payload with certified_no_brokerage=true', () => {
      const res = listingCreationSchema.safeParse({
        title: 'Chambre lumineuse proche campus UM6P',
        description: 'Superbe chambre meublée dans un appartement calme avec fibre optique.',
        city: 'Benguerir',
        neighborhood: 'Proche UM6P',
        listing_type: 'colocation_room',
        property_type: 'apartment',
        price_amount: 1800,
        photos: ['https://example.com/photo1.webp'],
        advertiser_role: 'owner',
        certified_no_brokerage: true,
      });
      expect(res.success).toBe(true);
    });

    it('rejects listing without certified_no_brokerage guarantee', () => {
      const res = listingCreationSchema.safeParse({
        title: 'Chambre lumineuse proche campus UM6P',
        description: 'Superbe chambre meublée dans un appartement calme avec fibre optique.',
        city: 'Benguerir',
        neighborhood: 'Proche UM6P',
        listing_type: 'colocation_room',
        property_type: 'apartment',
        price_amount: 1800,
        photos: ['https://example.com/photo1.webp'],
        advertiser_role: 'owner',
        certified_no_brokerage: false,
      });
      expect(res.success).toBe(false);
    });

    it('rejects unrealistic or negative prices', () => {
      const res = listingCreationSchema.safeParse({
        title: 'Chambre lumineuse proche campus UM6P',
        description: 'Superbe chambre meublée dans un appartement calme avec fibre optique.',
        city: 'Benguerir',
        neighborhood: 'Proche UM6P',
        listing_type: 'colocation_room',
        property_type: 'apartment',
        price_amount: -50,
        photos: ['https://example.com/photo1.webp'],
        advertiser_role: 'owner',
        certified_no_brokerage: true,
      });
      expect(res.success).toBe(false);
    });
  });

  describe('semsarReportSchema', () => {
    it('accepts valid report category', () => {
      const res = semsarReportSchema.safeParse({
        listingId: 'listing-uuid-1234',
        category: 'brokerage_commission_requested',
        notes: 'L\'intermédiaire a demandé 500 DH pour la visite.',
      });
      expect(res.success).toBe(true);
    });

    it('rejects unrecognized report category', () => {
      const res = semsarReportSchema.safeParse({
        listingId: 'listing-uuid-1234',
        category: 'spam_promotion',
      });
      expect(res.success).toBe(false);
    });
  });
});
