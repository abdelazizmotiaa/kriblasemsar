-- ====================================================================
-- MIGRATION 003: SEED MOROCCAN CITIES DIRECTORY
-- Platform: https://kriblasemsar.com
-- ====================================================================

INSERT INTO public.cities (name_fr, name_ar, slug, region, latitude, longitude, popular)
VALUES
  -- 1. Benguerir (UM6P & Ville Verte)
  ('Benguerir', 'ابن جرير', 'benguerir', 'Marrakech-Safi', 32.2350, -7.9530, true),
  -- 2. Casablanca (CFC, Casanearshore, Maârif)
  ('Casablanca', 'الدار البيضاء', 'casablanca', 'Casablanca-Settat', 33.5731, -7.6498, true),
  -- 3. Rabat (Agdal, Hay Riad, Technopolis)
  ('Rabat', 'الرباط', 'rabat', 'Rabat-Salé-Kénitra', 34.0209, -6.8416, true),
  -- 4. Tanger (Malabata, Boukhalef, Free Zone)
  ('Tanger', 'طنجة', 'tanger', 'Tanger-Tétouan-Al Hoceïma', 35.7767, -5.8039, true),
  -- 5. Marrakech (Guéliz, Semlalia, Majorelle)
  ('Marrakech', 'مراكش', 'marrakech', 'Marrakech-Safi', 31.6295, -7.9811, true),
  -- 6. Kénitra (Atlantic Free Zone, Campus Ibn Tofail)
  ('Kénitra', 'القنيطرة', 'kenitra', 'Rabat-Salé-Kénitra', 34.2500, -6.5833, true),
  -- 7. Agadir (Talborjt, Dakhla, Taghazout Bay)
  ('Agadir', 'أكادير', 'agadir', 'Souss-Massa', 30.4214, -9.5831, true),
  -- 8. Fès (Ville Nouvelle, Route d''Immouzzer, Euromed)
  ('Fès', 'فاس', 'fes', 'Fès-Meknès', 34.0333, -5.0000, false),
  -- 9. Meknès (Hamria, ENSAM, Moulay Ismail)
  ('Meknès', 'مكناس', 'meknes', 'Fès-Meknès', 33.8833, -5.5500, false),
  -- 10. Tétouan (Martil Front de Mer, Campus Abdelmalek Essaâdi)
  ('Tétouan', 'تطوان', 'tetouan', 'Tanger-Tétouan-Al Hoceïma', 35.5667, -5.3667, false),
  -- 11. Salé & Témara (Tabriquet, Harhoura, Wifaq)
  ('Salé', 'سلا', 'sale', 'Rabat-Salé-Kénitra', 34.0531, -6.7985, false),
  ('Témara', 'تمارة', 'temara', 'Rabat-Salé-Kénitra', 33.9234, -6.9076, false),
  -- 12. Oujda (Al Qods, Campus Mohammed Premier)
  ('Oujda', 'وجدة', 'oujda', 'Oriental', 34.6867, -1.9114, false),
  -- 13. El Jadida (Plateau, Chouaib Doukkali, Jorf Lasfar)
  ('El Jadida', 'الجديدة', 'el-jadida', 'Casablanca-Settat', 33.2566, -8.5025, false),
  -- 14. Mohammedia (ENSET, Parc, Kasbah)
  ('Mohammedia', 'المحمدية', 'mohammedia', 'Casablanca-Settat', 33.6833, -7.3833, false),
  -- 15. Ifrane (Al Akhawayn University)
  ('Ifrane', 'إفران', 'ifrane', 'Fès-Meknès', 33.5228, -5.1100, false),
  -- 16. Béni Mellal (Mghila, Sultan Moulay Slimane)
  ('Béni Mellal', 'بني ملال', 'beni-mellal', 'Béni Mellal-Khénifra', 32.3394, -6.3608, false),
  -- 17. Safi (Plateau, Biadha, Port OCP)
  ('Safi', 'آسفي', 'safi', 'Marrakech-Safi', 32.2994, -9.2372, false),
  -- 18. Nador (Marchica, Selouane)
  ('Nador', 'الناظور', 'nador', 'Oriental', 35.1667, -2.9333, false),
  -- 19. Khouribga (1337 Coding School, ENSA)
  ('Khouribga', 'خريبكة', 'khouribga', 'Béni Mellal-Khénifra', 32.8811, -6.9063, false),
  -- 20. Settat (Hassan 1er, ENCG)
  ('Settat', 'سطات', 'settat', 'Casablanca-Settat', 33.0010, -7.6166, false),
  -- 21. Essaouira (Médina, Diabat, Surf & Tech)
  ('Essaouira', 'الصويرة', 'essaouira', 'Marrakech-Safi', 31.5085, -9.7595, false),
  -- 22. Dakhla (Baie de Dakhla, Nomades digitaux & Kitesurf)
  ('Dakhla', 'الداخلة', 'dakhla', 'Dakhla-Oued Ed-Dahab', 23.7136, -15.9355, false),
  -- 23. Laâyoune (Al Wifaq, Faculté de Médecine)
  ('Laâyoune', 'العيون', 'laayoune', 'Laâyoune-Sakia El Hamra', 27.1536, -13.2033, false)
ON CONFLICT (slug) DO UPDATE
SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  region = EXCLUDED.region,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  popular = EXCLUDED.popular;
