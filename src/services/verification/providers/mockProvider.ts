// ====================================================================
// MOCK VERIFICATION PROVIDER (For Testing & Local Development)
// Platform: https://kriblasemsar.com
// ====================================================================

import { IVerificationProvider, VerificationChannel } from '../types';

export class MockVerificationProvider implements IVerificationProvider {
  name = 'MockProvider';
  channel: VerificationChannel = 'whatsapp';
  
  // Storage for inspectable sent messages during tests
  public sentMessages: { phoneE164: string; code: string; timestamp: number }[] = [];

  async sendOtp(phoneE164: string, otpCode: string): Promise<{ success: boolean; providerRef?: string; error?: string }> {
    this.sentMessages.push({
      phoneE164,
      code: otpCode,
      timestamp: Date.now()
    });

    // Simulated successful provider response
    return {
      success: true,
      providerRef: `mock-msg-${Date.now()}`
    };
  }

  getLastCodeFor(phoneE164: string): string | undefined {
    const matching = this.sentMessages.filter((m) => m.phoneE164 === phoneE164);
    return matching[matching.length - 1]?.code;
  }

  clear(): void {
    this.sentMessages = [];
  }
}
