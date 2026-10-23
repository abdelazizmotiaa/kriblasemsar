// ====================================================================
// KRIBLASEMSAR VERIFICATION SERVICE TYPES
// Platform: https://kriblasemsar.com
// ====================================================================

export type MoroccanOperator = 'Maroc Telecom' | 'Orange Maroc' | 'inwi' | 'Unknown';

export interface PhoneParseResult {
  isValid: boolean;
  e164: string | null;            // e.g. "+212612345678"
  nationalFormat: string | null;  // e.g. "06 12 34 56 78"
  operator: MoroccanOperator;
  errorFr?: string;
  errorAr?: string;
}

export type VerificationChannel = 'whatsapp' | 'sms';

export interface OtpSendResult {
  success: boolean;
  channel: VerificationChannel;
  verificationId: string;
  phoneE164: string;
  expiresInSeconds: number;
  resendCooldownSeconds: number;
  mockOtp?: string; // Populated only in test/dev mode
  error?: string;
}

export interface OtpVerifyResult {
  success: boolean;
  phoneE164: string;
  verifiedAt?: string;
  error?: string;
  remainingAttempts?: number;
}

export interface IVerificationProvider {
  name: string;
  channel: VerificationChannel;
  sendOtp(phoneE164: string, otpCode: string): Promise<{ success: boolean; providerRef?: string; error?: string }>;
}
