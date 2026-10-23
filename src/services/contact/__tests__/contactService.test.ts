import { describe, it, expect } from 'vitest';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  revealContactInfo,
  UserSessionState,
} from '../contactService';

describe('contactService', () => {
  describe('buildWhatsAppMessage', () => {
    it('generates polite French message with listing details', () => {
      const msg = buildWhatsAppMessage('Casablanca', 'Maârif', 'Studio meublé', 'fr');
      expect(msg).toContain('KriblaSemsar');
      expect(msg).toContain('Casablanca');
      expect(msg).toContain('Maârif');
      expect(msg).toContain('Studio meublé');
    });

    it('generates authentic Moroccan Darija / Arabic message', () => {
      const msg = buildWhatsAppMessage('Benguerir', 'Proche UM6P', 'Chambre en coloc', 'ar');
      expect(msg).toContain('كري بلا سمسار');
      expect(msg).toContain('باقي متوفر للزيارة');
    });
  });

  describe('buildWhatsAppUrl', () => {
    it('formats wa.me URL with clean phone digits and url-encoded text', () => {
      const url = buildWhatsAppUrl('+212 671-581167', 'Salam / Bonjour');
      expect(url).toBe('https://wa.me/212671581167?text=Salam%20%2F%20Bonjour');
    });
  });

  describe('revealContactInfo privacy gates', () => {
    it('blocks unauthenticated visitors', async () => {
      const unauthSession: UserSessionState = {
        isAuthenticated: false,
        isPhoneVerified: false,
      };

      const res = await revealContactInfo('listing-1', 'phone_call', unauthSession);
      expect(res.success).toBe(false);
      expect(res.code).toBe('AUTH_REQUIRED');
      expect(res.phoneNumber).toBeUndefined();
    });

    it('blocks authenticated users without verified Moroccan phone number', async () => {
      const unverifiedSession: UserSessionState = {
        isAuthenticated: true,
        isPhoneVerified: false,
      };

      const res = await revealContactInfo('listing-1', 'whatsapp', unverifiedSession);
      expect(res.success).toBe(false);
      expect(res.code).toBe('PHONE_UNVERIFIED');
      expect(res.phoneNumber).toBeUndefined();
    });

    it('allows verified Moroccan users to access contact info', async () => {
      const verifiedSession: UserSessionState = {
        isAuthenticated: true,
        isPhoneVerified: true,
        phoneE164: '+212671581167',
      };

      const res = await revealContactInfo(
        'listing-1',
        'whatsapp',
        verifiedSession,
        '+212612345678'
      );
      expect(res.success).toBe(true);
      expect(res.phoneNumber).toBe('+212612345678');
    });
  });
});
