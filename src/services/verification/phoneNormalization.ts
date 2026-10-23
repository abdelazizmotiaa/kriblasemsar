// ====================================================================
// MOROCCAN PHONE NORMALIZATION & VALIDATION (+212 E.164)
// Platform: https://kriblasemsar.com
// ====================================================================

import { PhoneParseResult, MoroccanOperator } from './types';

/**
 * Identifies Moroccan mobile operator based on prefix
 * IAM: 0610-0618, 0661, 0662, 0666, 0667, 0668, 0670-0673, 0676-0678
 * Orange (ex-Méditel): 0660, 0663-0665, 0674, 0675, 0761-0763, 0766-0768
 * inwi (Wana): 0620-0629, 0700-0708, 0770-0777
 */
export function identifyMoroccanOperator(nationalNumber: string): MoroccanOperator {
  const prefix2 = nationalNumber.substring(0, 2);
  const prefix4 = nationalNumber.substring(0, 4);

  if (prefix2 === '06') {
    if (['0661', '0662', '0666', '0667', '0668', '0670', '0671', '0672', '0673'].includes(prefix4)) {
      return 'Maroc Telecom';
    }
    if (['0660', '0663', '0664', '0665', '0674', '0675'].includes(prefix4)) {
      return 'Orange Maroc';
    }
    if (['0620', '0621', '0622', '0623', '0624', '0625', '0626', '0627', '0628', '0629'].includes(prefix4)) {
      return 'inwi';
    }
  }

  if (prefix2 === '07') {
    if (['0700', '0701', '0702', '0703', '0706', '0707', '0708', '0770', '0771', '0777'].includes(prefix4)) {
      return 'inwi';
    }
    if (['0761', '0762', '0763', '0766', '0767', '0768'].includes(prefix4)) {
      return 'Orange Maroc';
    }
  }

  return 'Unknown';
}

/**
 * Normalizes any Moroccan phone input into strict E.164 (+212XXXXXXXXX)
 * Supports:
 * - 0612345678, 0712345678
 * - +212612345678, +212712345678
 * - 00212612345678, 00212712345678
 * - 212612345678, 212712345678
 * - Formatted: 06 12 34 56 78, +212 6-12-34-56-78
 */
export function normalizeMoroccanPhone(input: string): PhoneParseResult {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      e164: null,
      nationalFormat: null,
      operator: 'Unknown',
      errorFr: 'Numéro de téléphone requis.',
      errorAr: 'رقم الهاتف مطلوب.'
    };
  }

  // Strip whitespaces, hyphens, periods, parentheses
  let cleaned = input.trim().replace(/[\s\-\.\(\)]/g, '');

  // 1. Detect International prefix and strip down to national digits
  if (cleaned.startsWith('+212')) {
    cleaned = cleaned.substring(4);
  } else if (cleaned.startsWith('00212')) {
    cleaned = cleaned.substring(5);
  } else if (cleaned.startsWith('212') && cleaned.length === 12) {
    cleaned = cleaned.substring(3);
  }

  // If starts with 0, strip the leading 0 for E.164 conversion
  let localNineDigits = '';
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    localNineDigits = cleaned.substring(1);
  } else if (cleaned.length === 9) {
    localNineDigits = cleaned;
  } else {
    return {
      isValid: false,
      e164: null,
      nationalFormat: null,
      operator: 'Unknown',
      errorFr: 'Longueur de numéro incorrecte (9 chiffres requis après le préfixe +212).',
      errorAr: 'طول رقم الهاتف غير صحيح (يجب أن يحتوي على 9 أرقام بعد الرمز +212).'
    };
  }

  // Verify all characters are digits
  if (!/^\d{9}$/.test(localNineDigits)) {
    return {
      isValid: false,
      e164: null,
      nationalFormat: null,
      operator: 'Unknown',
      errorFr: 'Le numéro ne doit contenir que des chiffres.',
      errorAr: 'يجب أن يحتوي الرقم على أرقام فقط.'
    };
  }

  // Check mobile indicator: in Morocco, mobiles start strictly with '6' or '7'
  const firstDigit = localNineDigits.charAt(0);
  if (firstDigit !== '6' && firstDigit !== '7') {
    if (firstDigit === '5') {
      return {
        isValid: false,
        e164: null,
        nationalFormat: null,
        operator: 'Unknown',
        errorFr: 'Les lignes fixes (05...) ne supportent pas la vérification WhatsApp. Veuillez utiliser un numéro mobile (06 ou 07).',
        errorAr: 'الخطوط الثابتة (05...) لا تدعم واتساب. يرجى استخدام رقم محمول (06 أو 07).'
      };
    }
    return {
      isValid: false,
      e164: null,
      nationalFormat: null,
      operator: 'Unknown',
      errorFr: 'Numéro mobile marocain invalide (doit commencer par 06 ou 07).',
      errorAr: 'رقم محمول مغربي غير صالح (يجب أن يبدأ بـ 06 أو 07).'
    };
  }

  const nationalStr = `0${localNineDigits}`;
  const e164Str = `+212${localNineDigits}`;

  // Format as readable Moroccan format: 06 12 34 56 78
  const formatted = `${nationalStr.substring(0, 2)} ${nationalStr.substring(2, 4)} ${nationalStr.substring(4, 6)} ${nationalStr.substring(6, 8)} ${nationalStr.substring(8, 10)}`;

  const operator = identifyMoroccanOperator(nationalStr);

  return {
    isValid: true,
    e164: e164Str,
    nationalFormat: formatted,
    operator: operator
  };
}
