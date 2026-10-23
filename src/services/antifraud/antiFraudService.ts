// ====================================================================
// KRIBLASEMSAR ANTI-FRAUD & ANTI-SEMSAR DETECTION ENGINE
// Platform: https://kriblasemsar.com
// ====================================================================

import { Listing } from '../../types';

export interface AntiFraudRuleResult {
  ruleId: string;
  ruleName: string;
  triggered: boolean;
  severity: 'low' | 'medium' | 'high';
  scoreImpact: number;
  explanation: string;
}

export interface ListingRiskAssessment {
  listingId: string;
  riskScore: number; // 0 (safest) to 100 (highest risk)
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedAction: 'AUTO_APPROVE' | 'FLAG_FOR_REVIEW' | 'AUTO_SUSPEND';
  triggeredRules: AntiFraudRuleResult[];
  evaluatedAt: string;
}

export class AntiFraudService {
  /**
   * Evaluates a listing against known broker / semsar patterns
   * @param listing The listing to analyze
   * @param userListingsCount Number of listings already posted by this user in the last 24h
   * @param allUserListings All existing listings by this user
   * @param semsarReportCount Number of semsar reports filed against this listing or user
   */
  evaluateListing(
    listing: Partial<Listing>,
    userListingsCount = 0,
    allUserListings: Partial<Listing>[] = [],
    semsarReportCount = 0
  ): ListingRiskAssessment {
    const rules: AntiFraudRuleResult[] = [];
    let riskScore = 0;

    // Rule 1: High Posting Velocity (> 3 listings within 24h is typical broker behavior)
    if (userListingsCount >= 3) {
      const score = Math.min(45, (userListingsCount - 2) * 15);
      riskScore += score;
      rules.push({
        ruleId: 'HIGH_POSTING_VELOCITY',
        ruleName: 'Volume de publication anormal',
        triggered: true,
        severity: 'high',
        scoreImpact: score,
        explanation: `L'utilisateur a publié ${userListingsCount} annonces en 24h. Les particuliers publient rarement plus de 1 ou 2 biens simultanément.`
      });
    }

    // Rule 2: Multiple unrelated cities or distant neighborhoods
    if (allUserListings.length > 1) {
      const cities = new Set(allUserListings.map((l) => l.city).filter(Boolean));
      if (listing.city) cities.add(listing.city);

      if (cities.size >= 3) {
        riskScore += 35;
        rules.push({
          ruleId: 'MULTI_CITY_PORTFOLIO',
          ruleName: 'Multi-villes sans justification',
          triggered: true,
          severity: 'high',
          scoreImpact: 35,
          explanation: `Le compte gère des biens dans ${cities.size} villes distinctes, typique d'une agence ou d'un intermédiaire semsar.`
        });
      }
    }

    // Rule 3: Description Similarity / Duplication Check
    if (listing.description && allUserListings.length > 0) {
      const cleanDesc = listing.description.trim().toLowerCase();
      const duplicateFound = allUserListings.some(
        (other) => other.description && other.description.trim().toLowerCase() === cleanDesc
      );

      if (duplicateFound) {
        riskScore += 25;
        rules.push({
          ruleId: 'DUPLICATE_DESCRIPTION',
          ruleName: 'Description dupliquée',
          triggered: true,
          severity: 'medium',
          scoreImpact: 25,
          explanation: 'La description textuelle est un copier-coller identique à une autre annonce du compte.'
        });
      }
    }

    // Rule 4: Semsar Reports filed by community
    if (semsarReportCount > 0) {
      const score = Math.min(50, semsarReportCount * 20);
      riskScore += score;
      rules.push({
        ruleId: 'COMMUNITY_SEMSAR_REPORTS',
        ruleName: 'Signalements de la communauté',
        triggered: true,
        severity: semsarReportCount >= 3 ? 'high' : 'medium',
        scoreImpact: score,
        explanation: `${semsarReportCount} signalement(s) pour commission ou intermédiaire suspect reçu(s).`
      });
    }

    // Rule 5: Keywords in description suggesting agency fees
    if (listing.description) {
      const descLower = listing.description.toLowerCase();
      const agencyKeywords = ['honoraires', 'frais d\'agence', 'semsar', 'commission', 'frais de visite', 'agence immobiliere'];
      const matched = agencyKeywords.filter((kw) => descLower.includes(kw));

      if (matched.length > 0) {
        riskScore += 30;
        rules.push({
          ruleId: 'COMMISSION_KEYWORDS',
          ruleName: 'Mots-clés de commission détectés',
          triggered: true,
          severity: 'medium',
          scoreImpact: 30,
          explanation: `Mots-clés suspects détectés dans le texte: ${matched.join(', ')}.`
        });
      }
    }

    // Clamp score between 0 and 100
    riskScore = Math.min(100, Math.max(0, riskScore));

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let recommendedAction: 'AUTO_APPROVE' | 'FLAG_FOR_REVIEW' | 'AUTO_SUSPEND' = 'AUTO_APPROVE';

    if (riskScore >= 70 || semsarReportCount >= 3) {
      riskLevel = 'HIGH';
      recommendedAction = 'AUTO_SUSPEND';
    } else if (riskScore >= 30) {
      riskLevel = 'MEDIUM';
      recommendedAction = 'FLAG_FOR_REVIEW';
    }

    return {
      listingId: listing.id || 'new',
      riskScore,
      riskLevel,
      recommendedAction,
      triggeredRules: rules,
      evaluatedAt: new Date().toISOString()
    };
  }
}

export const defaultAntiFraudService = new AntiFraudService();
