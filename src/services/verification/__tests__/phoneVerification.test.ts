// ====================================================================
// AUTOMATED UNIT TESTS: MOROCCAN PHONE PARSING & OTP VERIFICATION
// Platform: https://kriblasemsar.com
// ====================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { normalizeMoroccanPhone, identifyMoroccanOperator } from '../phoneNormalization';
import { VerificationService } from '../verificationService';
import { MockVerificationProvider } from '../providers/mockProvider';

describe('Moroccan Phone Normalization (+212 E.164)', () => {
  it('correctly normalizes 10-digit local Moroccan numbers starting with 06 and 07', () => {
    const res1 = normalizeMoroccanPhone('0612345678');
    expect(res1.isValid).toBe(true);
    expect(res1.e164).toBe('+212612345678');
    expect(res1.nationalFormat).toBe('06 12 34 56 78');

    const res2 = normalizeMoroccanPhone('0712345678');
    expect(res2.isValid).toBe(true);
    expect(res2.e164).toBe('+212712345678');
    expect(res2.nationalFormat).toBe('07 12 34 56 78');
  });

  it('correctly normalizes international formats +212 and 00212', () => {
    const resPlus = normalizeMoroccanPhone('+212661234567');
    expect(resPlus.isValid).toBe(true);
    expect(resPlus.e164).toBe('+212661234567');

    const resDoubleZero = normalizeMoroccanPhone('00212671581167');
    expect(resDoubleZero.isValid).toBe(true);
    expect(resDoubleZero.e164).toBe('+212671581167');

    const resRaw212 = normalizeMoroccanPhone('212661234567');
    expect(resRaw212.isValid).toBe(true);
    expect(resRaw212.e164).toBe('+212661234567');
  });

  it('strips spaces, dashes, parentheses and dots cleanly', () => {
    const formatted = normalizeMoroccanPhone('06 71-58.11 (67)');
    expect(formatted.isValid).toBe(true);
    expect(formatted.e164).toBe('+212671581167');
  });

  it('rejects landline numbers (05...) with a helpful message regarding WhatsApp support', () => {
    const landline = normalizeMoroccanPhone('0522123456');
    expect(landline.isValid).toBe(false);
    expect(landline.e164).toBeNull();
    expect(landline.errorFr).toContain('Les lignes fixes (05...) ne supportent pas la vérification WhatsApp');
  });

  it('rejects numbers with invalid lengths or non-numeric characters', () => {
    const tooShort = normalizeMoroccanPhone('061234');
    expect(tooShort.isValid).toBe(false);

    const withLetters = normalizeMoroccanPhone('061234abc8');
    expect(withLetters.isValid).toBe(false);

    const empty = normalizeMoroccanPhone('');
    expect(empty.isValid).toBe(false);
  });

  it('detects Moroccan operators IAM, Orange and inwi', () => {
    expect(identifyMoroccanOperator('0661123456')).toBe('Maroc Telecom');
    expect(identifyMoroccanOperator('0660123456')).toBe('Orange Maroc');
    expect(identifyMoroccanOperator('0620123456')).toBe('inwi');
  });
});

describe('WhatsApp OTP Verification Workflow & Security Engine', () => {
  let mockProvider: MockVerificationProvider;
  let service: VerificationService;

  beforeEach(() => {
    mockProvider = new MockVerificationProvider();
    service = new VerificationService(mockProvider, true);
  });

  it('sends an OTP to a valid Moroccan number and delivers a 6-digit code', async () => {
    const res = await service.requestOtp('0671581167');
    expect(res.success).toBe(true);
    expect(res.phoneE164).toBe('+212671581167');
    expect(res.expiresInSeconds).toBe(300);
    expect(res.resendCooldownSeconds).toBe(60);
    expect(res.mockOtp).toBeDefined();
    expect(res.mockOtp).toHaveLength(6);
  });

  it('successfully verifies when the correct OTP code is provided', async () => {
    const sendRes = await service.requestOtp('0671581167');
    const otpCode = sendRes.mockOtp!;

    const verifyRes = await service.verifyOtp('0671581167', otpCode);
    expect(verifyRes.success).toBe(true);
    expect(verifyRes.phoneE164).toBe('+212671581167');
    expect(verifyRes.verifiedAt).toBeDefined();
  });

  it('decrements remaining attempts on incorrect code and locks after 3 attempts', async () => {
    await service.requestOtp('0671581167');

    // Attempt 1 wrong
    const attempt1 = await service.verifyOtp('0671581167', '000000');
    expect(attempt1.success).toBe(false);
    expect(attempt1.remainingAttempts).toBe(2);

    // Attempt 2 wrong
    const attempt2 = await service.verifyOtp('0671581167', '000001');
    expect(attempt2.success).toBe(false);
    expect(attempt2.remainingAttempts).toBe(1);

    // Attempt 3 wrong
    const attempt3 = await service.verifyOtp('0671581167', '000002');
    expect(attempt3.success).toBe(false);
    expect(attempt3.remainingAttempts).toBe(0);

    // Attempt 4 locked out
    const attempt4 = await service.verifyOtp('0671581167', '000003');
    expect(attempt4.success).toBe(false);
    expect(attempt4.error).toContain('dépassé');
  });

  it('enforces a 60-second cooldown between resend requests', async () => {
    const req1 = await service.requestOtp('0671581167');
    expect(req1.success).toBe(true);

    // Immediate resend should be rejected with cooldown
    const req2 = await service.requestOtp('0671581167');
    expect(req2.success).toBe(false);
    expect(req2.error).toContain('patienter');
    expect(req2.resendCooldownSeconds).toBeGreaterThan(0);
  });

  it('rejects expired OTP codes after 5 minutes', async () => {
    const sendRes = await service.requestOtp('0671581167');
    const otpCode = sendRes.mockOtp!;

    // Artificially expire the session (mocking time forward by 6 minutes)
    const session = service.getSession('+212671581167');
    expect(session).toBeDefined();
    session!.expiresAt = Date.now() - 1000; // expired 1s ago

    const verifyRes = await service.verifyOtp('0671581167', otpCode);
    expect(verifyRes.success).toBe(false);
    expect(verifyRes.error).toContain('expiré');
  });

  it('prevents replay attacks on already verified OTP codes', async () => {
    const sendRes = await service.requestOtp('0671581167');
    const otpCode = sendRes.mockOtp!;

    // 1st verify succeeds
    const verify1 = await service.verifyOtp('0671581167', otpCode);
    expect(verify1.success).toBe(true);

    // Replay with same code must fail
    const verify2 = await service.verifyOtp('0671581167', otpCode);
    expect(verify2.success).toBe(false);
  });
});
