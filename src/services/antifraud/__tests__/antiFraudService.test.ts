// ====================================================================
// AUTOMATED UNIT TESTS: ANTI-FRAUD & ANTI-SEMSAR ENGINE
// Platform: https://kriblasemsar.com
// ====================================================================

import { describe, it, expect } from 'vitest';
import { AntiFraudService } from '../antiFraudService';

describe('Anti-Semsar & Fraud Risk Evaluation Engine', () => {
  const service = new AntiFraudService();

  it('marks a genuine individual listing as LOW risk and AUTO_APPROVE', () => {
    const listing = {
      id: 'l-1',
      title: 'Chambre meublée calme proche UM6P',
      description: 'Chambre très propre dans appartement familial, idéale pour étudiant ou chercheur.',
      city: 'Benguerir'
    };

    const result = service.evaluateListing(listing, 1, [], 0);
    expect(result.riskLevel).toBe('LOW');
    expect(result.riskScore).toBe(0);
    expect(result.recommendedAction).toBe('AUTO_APPROVE');
    expect(result.triggeredRules).toHaveLength(0);
  });

  it('flags an account with high posting frequency (>= 3 in 24h) for review', () => {
    const listing = {
      id: 'l-2',
      title: 'Appartement à louer',
      description: 'Appartement disponible immédiatement.',
      city: 'Casablanca'
    };

    const result = service.evaluateListing(listing, 4, [], 0);
    expect(result.riskLevel).not.toBe('LOW');
    expect(result.riskScore).toBeGreaterThanOrEqual(30);
    expect(result.triggeredRules.some((r) => r.ruleId === 'HIGH_POSTING_VELOCITY')).toBe(true);
  });

  it('detects commission keywords (frais d agence, honoraires, commission)', () => {
    const listing = {
      id: 'l-3',
      title: 'Studio Maârif',
      description: 'Beau studio à louer. Prévoir 1 mois de loyer pour honoraires de semsar.',
      city: 'Casablanca'
    };

    const result = service.evaluateListing(listing, 1, [], 0);
    expect(result.triggeredRules.some((r) => r.ruleId === 'COMMISSION_KEYWORDS')).toBe(true);
    expect(result.riskScore).toBeGreaterThanOrEqual(30);
  });

  it('automatically suspends listings that accumulate 3 or more community semsar reports', () => {
    const listing = {
      id: 'l-4',
      title: 'Chambre colocation Agdal',
      description: 'Chambre meublée.',
      city: 'Rabat'
    };

    const result = service.evaluateListing(listing, 1, [], 3);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.recommendedAction).toBe('AUTO_SUSPEND');
    expect(result.triggeredRules.some((r) => r.ruleId === 'COMMUNITY_SEMSAR_REPORTS')).toBe(true);
  });

  it('detects multi-city portfolios typical of real estate brokerage brokers', () => {
    const listing = {
      id: 'l-5',
      title: 'Appartement Gueliz',
      description: 'Bien situé.',
      city: 'Marrakech'
    };

    const previousListings = [
      { id: 'p-1', city: 'Casablanca', description: 'Desc 1' },
      { id: 'p-2', city: 'Tanger', description: 'Desc 2' }
    ];

    const result = service.evaluateListing(listing, 2, previousListings, 0);
    expect(result.triggeredRules.some((r) => r.ruleId === 'MULTI_CITY_PORTFOLIO')).toBe(true);
  });

  it('detects duplicate text descriptions across listings', () => {
    const identicalText = 'Superbe bien refait à neuf, toutes commodités.';
    const listing = {
      id: 'l-6',
      description: identicalText,
      city: 'Casablanca'
    };

    const previousListings = [
      { id: 'p-3', description: identicalText, city: 'Casablanca' }
    ];

    const result = service.evaluateListing(listing, 2, previousListings, 0);
    expect(result.triggeredRules.some((r) => r.ruleId === 'DUPLICATE_DESCRIPTION')).toBe(true);
  });
});
