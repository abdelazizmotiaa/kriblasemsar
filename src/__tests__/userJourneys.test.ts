/**
 * KriblaSemsar — Comprehensive Automated Scenarios (Phase 13)
 * Tests core user journeys across Tenant, Owner, Anti-Semsar, Security & PWA.
 */

import { describe, it, expect } from 'vitest';
import { normalizeMoroccanPhone } from '../services/verification/phoneNormalization';
import { defaultVerificationService } from '../services/verification/verificationService';
import { defaultAntiFraudService } from '../services/antifraud/antiFraudService';
import { revealContactInfo, buildWhatsAppUrl, buildWhatsAppMessage, UserSessionState } from '../services/contact/contactService';
import { listingCreationSchema, otpVerificationSchema } from '../services/validation/schemas';
import { validateImageFile, buildListingPhotoPath } from '../services/storage/imageOptimizer';
import { TRANSLATIONS } from '../i18n/translations';

describe('Phase 13: Core User Journeys & Security Scenarios', () => {
  // Scenario A — Tenant
  describe('Scenario A: Tenant Journey', () => {
    it('normalizes Moroccan phone, verifies OTP, and securely reveals owner contact for WhatsApp', async () => {
      // 1. Phone input normalization
      const normalized = normalizeMoroccanPhone('06 71 58 11 67');
      expect(normalized.isValid).toBe(true);
      expect(normalized.e164).toBe('+212671581167');

      // 2. Request OTP
      const otpRequest = await defaultVerificationService.requestOtp(
        normalized.e164!,
        'whatsapp'
      );
      expect(otpRequest.success).toBe(true);

      // 3. Verify OTP
      const verifyResult = await defaultVerificationService.verifyOtp(
        normalized.e164!,
        otpRequest.mockOtp || '123456'
      );
      expect(verifyResult.success).toBe(true);

      // 4. Authorized tenant session
      const tenantSession: UserSessionState = {
        isAuthenticated: true,
        isPhoneVerified: true,
        phoneE164: normalized.e164!,
      };

      // 5. Contact reveal
      const revealRes = await revealContactInfo(
        'cb-1',
        'whatsapp',
        tenantSession,
        '+212612345678'
      );
      expect(revealRes.success).toBe(true);
      expect(revealRes.phoneNumber).toBe('+212612345678');

      // 6. Generate polite direct WhatsApp URL
      const waMsg = buildWhatsAppMessage('Casablanca', 'Maârif', 'Studio meublé', 'fr');
      const waUrl = buildWhatsAppUrl(revealRes.phoneNumber!, waMsg);
      expect(waUrl).toContain('https://wa.me/212612345678');
      expect(waUrl).toContain('KriblaSemsar');
    });
  });

  // Scenario B — Owner
  describe('Scenario B: Property Owner Journey', () => {
    it('validates role, enforces zero-brokerage pledge, verifies photos, and passes schema validation', () => {
      // 1. Validate photo file requirements
      const mockPhoto = new File(['photo data'], 'living_room.webp', { type: 'image/webp' });
      const photoValidation = validateImageFile(mockPhoto);
      expect(photoValidation.valid).toBe(true);

      // 2. Generate secure storage path
      const storagePath = buildListingPhotoPath('owner-uuid-1', 'listing-uuid-1', 'photo-1');
      expect(storagePath).toBe('owner-uuid-1/listing-uuid-1/photo-1.webp');

      // 3. Submit valid owner listing with certified zero-brokerage
      const validPayload = {
        title: 'Chambre propre et calme proche UM6P',
        description: 'Chambre meublée dans colocation d’ingénieurs, cuisine équipée, terrasse.',
        city: 'Benguerir',
        neighborhood: 'Proche UM6P',
        listing_type: 'colocation_room' as const,
        property_type: 'apartment' as const,
        price_amount: 1900,
        charges_included: true,
        furnished: true,
        photos: ['https://kriblasemsar.com/photos/room1.webp'],
        advertiser_role: 'owner' as const,
        certified_no_brokerage: true as const,
      };

      const parseResult = listingCreationSchema.safeParse(validPayload);
      expect(parseResult.success).toBe(true);
    });
  });

  // Scenario C — Suspected Broker Detection
  describe('Scenario C: Anti-Semsar & Fraud Mitigation', () => {
    it('flags an account with high posting velocity and broker report history without unfair instant ban', () => {
      const suspiciousListing = {
        id: 'suspicious-01',
        title: 'Appartement à louer pas cher',
        city: 'Casablanca',
        price_amount: 4500,
      };

      // 4 postings in 24h + 2 semsar reports
      const assessment = defaultAntiFraudService.evaluateListing(
        suspiciousListing,
        4,
        [
          { city: 'Casablanca' },
          { city: 'Rabat' },
          { city: 'Marrakech' },
        ],
        2
      );

      expect(assessment.riskScore).toBeGreaterThanOrEqual(50);
      expect(assessment.riskLevel).toBe('HIGH');
      expect(assessment.recommendedAction).toBe('AUTO_SUSPEND');
      expect(assessment.triggeredRules.some((r) => r.ruleId === 'HIGH_POSTING_VELOCITY')).toBe(true);
      expect(assessment.triggeredRules.some((r) => r.ruleId === 'COMMUNITY_SEMSAR_REPORTS')).toBe(true);
    });
  });

  // Scenario D — Unauthorized Access Prevention
  describe('Scenario D: Unauthorized User / Privacy Gates', () => {
    it('strictly blocks unauthenticated users from unlocking owner phone numbers', async () => {
      const unauthSession: UserSessionState = {
        isAuthenticated: false,
        isPhoneVerified: false,
      };

      const res = await revealContactInfo('cb-1', 'phone_call', unauthSession, '+212612345678');
      expect(res.success).toBe(false);
      expect(res.code).toBe('AUTH_REQUIRED');
      expect(res.phoneNumber).toBeUndefined();
    });

    it('strictly blocks authenticated users who have not completed phone verification', async () => {
      const unverifiedSession: UserSessionState = {
        isAuthenticated: true,
        isPhoneVerified: false,
      };

      const res = await revealContactInfo('cb-1', 'phone_call', unverifiedSession, '+212612345678');
      expect(res.success).toBe(false);
      expect(res.code).toBe('PHONE_UNVERIFIED');
      expect(res.phoneNumber).toBeUndefined();
    });
  });

  // Scenario E — OTP Abuse & Rate Limiting
  describe('Scenario E: OTP Abuse Prevention', () => {
    it('blocks rapid OTP requests during cooldown window', async () => {
      const phone = '+212671589999';

      // First request
      const req1 = await defaultVerificationService.requestOtp(phone, 'whatsapp');
      expect(req1.success).toBe(true);

      // Immediate second request within cooldown
      const req2 = await defaultVerificationService.requestOtp(phone, 'whatsapp');
      expect(req2.success).toBe(false);
      expect(req2.error).toContain('patienter');
    });

    it('rejects incorrect OTPs and fails validation schema', () => {
      const invalidOtp = otpVerificationSchema.safeParse({
        phone: '+212671581167',
        code: 'wrong!',
      });
      expect(invalidOtp.success).toBe(false);
    });
  });

  // Scenario F — Moroccan Localization & PWA
  describe('Scenario F: Localization & PWA Compliance', () => {
    it('contains comprehensive translation keys in both French and Moroccan Arabic', () => {
      expect(TRANSLATIONS.fr.charter_title).toBe('Charte Zéro Semsar');
      expect(TRANSLATIONS.ar.charter_title).toBe('ميثاق زيرو سمسار');
      expect(TRANSLATIONS.ar.brand_tagline).toContain('كراء مباشر');
    });
  });
});
