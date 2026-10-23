import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '../translations';

describe('translations', () => {
  it('contains consistent translation keys for both FR and AR', () => {
    const frKeys = Object.keys(TRANSLATIONS.fr).sort();
    const arKeys = Object.keys(TRANSLATIONS.ar).sort();

    expect(frKeys).toEqual(arKeys);
  });

  it('contains expected authentic Moroccan Darija terms in Arabic translation', () => {
    expect(TRANSLATIONS.ar.brand_name).toBe('كري بلا سمسار');
    expect(TRANSLATIONS.ar.charges_included).toContain('ONEE');
    expect(TRANSLATIONS.ar.colocation_room).toContain('كولوكاسيون');
  });

  it('contains zero broker fee commitment in both languages', () => {
    expect(TRANSLATIONS.fr.hero_subtitle).toContain('0 DH de commission');
    expect(TRANSLATIONS.ar.hero_subtitle).toContain('0 درهم مصاريف سمسار');
  });
});
