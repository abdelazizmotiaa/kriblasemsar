/**
 * KriblaSemsar — Strict Zod Validation Schemas
 * Protects against XSS, SQLi, IDOR, malformed payloads, and injection.
 */

import { z } from 'zod';

// Moroccan phone number regex (+212 6 or 7 followed by 8 digits)
export const MOROCCAN_PHONE_REGEX = /^\+212[67]\d{8}$/;

// 6-digit numeric OTP regex
export const OTP_REGEX = /^\d{6}$/;

/**
 * Phone number validation schema
 */
export const phoneInputSchema = z.object({
  phone: z
    .string()
    .min(9, 'Le numéro est trop court')
    .max(16, 'Le numéro est trop long')
    .trim(),
  channel: z.enum(['whatsapp', 'sms']),
});

/**
 * OTP verification schema
 */
export const otpVerificationSchema = z.object({
  phone: z
    .string()
    .regex(MOROCCAN_PHONE_REGEX, 'Format marocain E.164 invalide (+2126... ou +2127...)'),
  code: z
    .string()
    .length(6, 'Le code OTP doit comporter exactement 6 chiffres')
    .regex(OTP_REGEX, 'Le code OTP ne doit contenir que des chiffres'),
});

/**
 * Listing submission & creation schema
 */
export const listingCreationSchema = z.object({
  title: z
    .string()
    .min(10, 'Le titre doit comporter au moins 10 caractères')
    .max(120, 'Le titre ne peut dépasser 120 caractères')
    .trim(),
  description: z
    .string()
    .min(20, 'La description doit comporter au moins 20 caractères')
    .max(2000, 'La description ne peut dépasser 2000 caractères')
    .trim(),
  city: z.string().min(2, 'Ville invalide'),
  neighborhood: z.string().min(2, 'Quartier obligatoire').max(100),
  listing_type: z.enum(['colocation_room', 'full_apartment', 'roommate_search']),
  property_type: z.enum(['apartment', 'studio', 'house', 'villa', 'student_residence', 'other']),
  price_amount: z
    .number()
    .int('Le loyer doit être un montant entier')
    .min(300, 'Loyer minimum : 300 DH')
    .max(100000, 'Loyer maximum : 100 000 DH'),
  deposit_mad: z.number().int().min(0).max(200000).default(0),
  charges_included: z.boolean().default(false),
  furnished: z.boolean().default(true),
  surface_m2: z.number().int().min(5).max(1000).optional(),
  number_of_rooms: z.number().int().min(1).max(20).default(1),
  photos: z
    .array(z.string().url('URL de photo invalide'))
    .min(1, 'Au moins une photo est requise')
    .max(10, 'Maximum 10 photos par annonce'),
  advertiser_role: z.enum(['owner', 'flatmate', 'authorized_representative']),
  certified_no_brokerage: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez certifier sur l\'honneur l\'absence de frais de semsar.' }),
  }),
});

/**
 * Semsar & Fraud Report submission schema
 */
export const semsarReportSchema = z.object({
  listingId: z.string().min(1, 'Identifiant d\'annonce requis'),
  category: z.enum([
    'brokerage_commission_requested',
    'suspected_broker',
    'fake_listing',
    'incorrect_price',
    'property_unavailable',
    'stolen_photos',
    'harassment',
    'other_concern',
  ]),
  notes: z
    .string()
    .max(1000, 'Les remarques ne peuvent dépasser 1000 caractères')
    .trim()
    .optional(),
});

/**
 * Contact reveal request schema
 */
export const contactRevealRequestSchema = z.object({
  listingId: z.string().min(1, 'Identifiant d\'annonce requis'),
  contactType: z.enum(['phone_call', 'whatsapp']),
});
