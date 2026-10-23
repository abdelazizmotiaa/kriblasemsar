// ====================================================================
// TWILIO VERIFY & SMS FALLBACK PROVIDERS
// Platform: https://kriblasemsar.com
// ====================================================================

import { IVerificationProvider, VerificationChannel } from '../types';

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  serviceSid: string;
}

export class TwilioVerifyProvider implements IVerificationProvider {
  name = 'TwilioVerify';
  channel: VerificationChannel = 'whatsapp';

  private config: TwilioConfig;

  constructor(config?: Partial<TwilioConfig>) {
    this.config = {
      accountSid: config?.accountSid || '',
      authToken: config?.authToken || '',
      serviceSid: config?.serviceSid || ''
    };
  }

  async sendOtp(phoneE164: string, otpCode: string): Promise<{ success: boolean; providerRef?: string; error?: string }> {
    if (!this.config.accountSid || !this.config.authToken || !this.config.serviceSid) {
      return {
        success: false,
        error: 'Identifiants Twilio Verify non configurés.'
      };
    }

    try {
      const url = `https://verify.twilio.com/v2/Services/${this.config.serviceSid}/Verifications`;
      const authHeader = 'Basic ' + btoa(`${this.config.accountSid}:${this.config.authToken}`);

      const body = new URLSearchParams({
        To: phoneE164,
        Channel: 'whatsapp',
        CustomCode: otpCode
      });

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: `Erreur Twilio (${res.status}): ${JSON.stringify(err)}` };
      }

      const data = await res.json();
      return { success: true, providerRef: data.sid };
    } catch (err: any) {
      return { success: false, error: `Erreur réseau Twilio: ${err.message}` };
    }
  }
}

export class SmsFallbackProvider implements IVerificationProvider {
  name = 'SmsFallback';
  channel: VerificationChannel = 'sms';

  async sendOtp(phoneE164: string, otpCode: string): Promise<{ success: boolean; providerRef?: string; error?: string }> {
    // SMS Fallback logic (can bridge to Twilio SMS or Infobip/Maroc local SMS gateway)
    return {
      success: true,
      providerRef: `sms-fallback-${Date.now()}`
    };
  }
}
