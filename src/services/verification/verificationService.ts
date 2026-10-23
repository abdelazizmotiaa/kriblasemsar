// ====================================================================
// KRIBLASEMSAR VERIFICATION SERVICE (ORCHESTRATOR)
// Platform: https://kriblasemsar.com
// ====================================================================

import {
  IVerificationProvider,
  OtpSendResult,
  OtpVerifyResult,
  VerificationChannel
} from './types';
import { normalizeMoroccanPhone } from './phoneNormalization';
import { MockVerificationProvider } from './providers/mockProvider';

export interface ActiveOtpSession {
  verificationId: string;
  phoneE164: string;
  codeHash: string;
  salt: string;
  channel: VerificationChannel;
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  expiresAt: number;
  lastSentAt: number;
  verified: boolean;
  mockCode?: string; // only populated in mock mode for unit tests
}

// Simple deterministic hash for verification session
function hashOtp(code: string, salt: string): string {
  let hash = 0;
  const str = code + ':' + salt + ':kriblasemsar_2026';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(16);
}

export class VerificationService {
  private provider: IVerificationProvider;
  private isMock: boolean;
  
  // In-memory sessions store (In full production Supabase, mirrors public.phone_verifications)
  private sessions: Map<string, ActiveOtpSession> = new Map();
  // Rate limiting map: phone -> timestamps of requests
  private rateLimits: Map<string, number[]> = new Map();

  constructor(provider?: IVerificationProvider, isMock = true) {
    this.provider = provider || new MockVerificationProvider();
    this.isMock = isMock;
  }

  setProvider(provider: IVerificationProvider, isMock = false): void {
    this.provider = provider;
    this.isMock = isMock;
  }

  /**
   * Request an OTP for a Moroccan phone number via WhatsApp or SMS
   */
  async requestOtp(
    rawPhone: string,
    channel: VerificationChannel = 'whatsapp'
  ): Promise<OtpSendResult> {
    // 1. Normalize and validate Moroccan number
    const parsed = normalizeMoroccanPhone(rawPhone);
    if (!parsed.isValid || !parsed.e164) {
      return {
        success: false,
        channel,
        verificationId: '',
        phoneE164: rawPhone,
        expiresInSeconds: 0,
        resendCooldownSeconds: 0,
        error: parsed.errorFr || 'Numéro marocain invalide.'
      };
    }

    const phoneE164 = parsed.e164;
    const now = Date.now();

    // 2. Anti-Pumping Rate Limiting: Max 5 requests per phone per hour
    const history = this.rateLimits.get(phoneE164) || [];
    const oneHourAgo = now - 3600 * 1000;
    const recentRequests = history.filter((t) => t > oneHourAgo);

    if (recentRequests.length >= 5) {
      return {
        success: false,
        channel,
        verificationId: '',
        phoneE164,
        expiresInSeconds: 0,
        resendCooldownSeconds: 3600,
        error: 'Trop de tentatives pour ce numéro. Veuillez réessayer dans une heure pour des raisons de sécurité.'
      };
    }

    // 3. Resend Cooldown Check: Must wait at least 60 seconds between resends
    const existing = this.sessions.get(phoneE164);
    if (existing && !existing.verified) {
      const elapsedSinceLastSend = (now - existing.lastSentAt) / 1000;
      if (elapsedSinceLastSend < 60) {
        const remainingCooldown = Math.ceil(60 - elapsedSinceLastSend);
        return {
          success: false,
          channel,
          verificationId: existing.verificationId,
          phoneE164,
          expiresInSeconds: Math.max(0, Math.ceil((existing.expiresAt - now) / 1000)),
          resendCooldownSeconds: remainingCooldown,
          error: `Veuillez patienter ${remainingCooldown} secondes avant de demander un nouveau code.`
        };
      }
    }

    // 4. Generate secure 6-digit OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = Math.random().toString(36).substring(2, 10);
    const codeHash = hashOtp(rawOtp, salt);
    const verificationId = `verif_${now}_${Math.random().toString(36).substring(2, 8)}`;
    const expiresInSeconds = 300; // 5 minutes validity
    const expiresAt = now + expiresInSeconds * 1000;

    // 5. Save session with attempt limit
    const session: ActiveOtpSession = {
      verificationId,
      phoneE164,
      codeHash,
      salt,
      channel,
      attempts: 0,
      maxAttempts: 3,
      createdAt: now,
      expiresAt,
      lastSentAt: now,
      verified: false,
      mockCode: this.isMock ? rawOtp : undefined
    };

    this.sessions.set(phoneE164, session);

    // Update rate limits
    recentRequests.push(now);
    this.rateLimits.set(phoneE164, recentRequests);

    // 6. Send OTP via configured provider
    const sendRes = await this.provider.sendOtp(phoneE164, rawOtp);
    if (!sendRes.success) {
      return {
        success: false,
        channel,
        verificationId,
        phoneE164,
        expiresInSeconds: 0,
        resendCooldownSeconds: 0,
        error: sendRes.error || "Erreur lors de l'envoi du code WhatsApp."
      };
    }

    return {
      success: true,
      channel,
      verificationId,
      phoneE164,
      expiresInSeconds,
      resendCooldownSeconds: 60,
      mockOtp: this.isMock ? rawOtp : undefined
    };
  }

  /**
   * Verify an OTP submitted by the user
   */
  async verifyOtp(rawPhone: string, inputCode: string): Promise<OtpVerifyResult> {
    const parsed = normalizeMoroccanPhone(rawPhone);
    if (!parsed.isValid || !parsed.e164) {
      return {
        success: false,
        phoneE164: rawPhone,
        error: 'Numéro de téléphone invalide.'
      };
    }

    const phoneE164 = parsed.e164;
    const session = this.sessions.get(phoneE164);
    const now = Date.now();

    if (!session) {
      return {
        success: false,
        phoneE164,
        error: 'Aucune demande de vérification en cours pour ce numéro. Veuillez demander un code.'
      };
    }

    // Check expiration (5 minutes)
    if (now > session.expiresAt) {
      this.sessions.delete(phoneE164);
      return {
        success: false,
        phoneE164,
        error: 'Ce code a expiré (validité 5 minutes). Veuillez demander un nouveau code.'
      };
    }

    // Replay attack prevention: already verified codes cannot be reused
    if (session.verified) {
      return {
        success: false,
        phoneE164,
        error: 'Ce code a déjà été utilisé.'
      };
    }

    // Increment attempts count
    session.attempts += 1;

    // Check max attempts
    if (session.attempts > session.maxAttempts) {
      this.sessions.delete(phoneE164);
      return {
        success: false,
        phoneE164,
        remainingAttempts: 0,
        error: 'Nombre maximal de tentatives dépassé (3). Le code a été invalidé par sécurité.'
      };
    }

    // Compare hash
    const inputHash = hashOtp(inputCode.trim(), session.salt);
    if (inputHash !== session.codeHash) {
      const remaining = session.maxAttempts - session.attempts;
      return {
        success: false,
        phoneE164,
        remainingAttempts: remaining,
        error: remaining > 0 
          ? `Code incorrect. Il vous reste ${remaining} tentative${remaining > 1 ? 's' : ''}.`
          : 'Code incorrect. Nombre maximal de tentatives dépassé.'
      };
    }

    // Mark verified and invalidate session
    session.verified = true;
    const verifiedAt = new Date().toISOString();
    this.sessions.delete(phoneE164);

    return {
      success: true,
      phoneE164,
      verifiedAt
    };
  }

  // Get active session for inspection during tests
  getSession(phoneE164: string): ActiveOtpSession | undefined {
    return this.sessions.get(phoneE164);
  }

  // Reset internal state
  clear(): void {
    this.sessions.clear();
    this.rateLimits.clear();
  }
}

// Default singleton instance
export const defaultVerificationService = new VerificationService();
