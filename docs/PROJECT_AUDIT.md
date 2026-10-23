# KriblaSemsar — Audit Technique Complet du Projet (docs/PROJECT_AUDIT.md)

**Date :** 23 Octobre 2026  
**Auteur :** Antigravity (Principal Technical Architect & Full-Stack Lead)  
**Domaine officiel :** `https://kriblasemsar.com` / `https://www.kriblasemsar.com`  
**Slogan :** كْري بلا سمسار — 0% Semsar, 0 DH Frais d'agence  
**Référence :** `https://www.lacartedescolocs.fr/`  

---

## 1. Vue d'Ensemble de la Stack Technique

| Composant | Technologie Identifiée | Version | Statut & Remarques |
| :--- | :--- | :--- | :--- |
| **Framework Frontend** | React | 18.3.1 | Moderne, performant |
| **Tooling & Bundler** | Vite | 5.4.10 | HMR ultra-rapide, bundle optimisé |
| **Langage** | TypeScript | 5.6.3 | Typage strict activé (`tsc -b`) |
| **Styling** | Tailwind CSS + PostCSS | 3.4.15 | Responsive, design tokens soignés |
| **Cartographie** | Leaflet + CARTO Voyager | 1.9.4 | Tuiles rétina authentifiées avec clé API valide |
| **Composants d'icônes** | Lucide React | 0.460.0 | Iconographie cohérente |
| **Backend & Base de données** | Supabase PostgreSQL + PostGIS | 15+ | Schéma initial en place (`supabase/schema.sql`) |
| **PWA** | Web App Manifest | - | `manifest.json` présent, Service Worker à implémenter |

---

## 2. Inventaire des Fonctionnalités

### A. Fonctionnalités Totalement Opérationnelles (Working)
1. **Cartographie CARTO Voyager sans watermark :**
   - Rendu fluide des tuiles `rastertiles/voyager` avec la clé officielle `cb1_4t6e_1_a5d52c28d7a3493bc3cbb3dd`.
   - Confinement géographique strict aux coordonnées du Maroc (`[[21.0, -18.0], [36.0, -1.0]]`, `minZoom: 5`).
2. **Bulles de prix interactives en Dirhams (MAD) :**
   - Pastilles de prix cliquables et stylisées (`2 200 DH`, `3 500 DH`, etc.).
   - Code couleur distinct : 🔵 Bleu (Colocation), 🟢 Vert (Logement entier sans intermédiaire), 🟠 Orange (Recherche coloc).
3. **Double Affichage Split-View (50/50 Desktop & Toggle Mobile) :**
   - Desktop : Liste défilante à gauche, carte sticky à droite avec synchronisation au survol et au clic.
   - Mobile (PWA) : Bouton flottant `[ 🗺️ Carte | 📋 Liste (X) ]` et mini-fiche d'aperçu tactile avec balayage précédent/suivant.
4. **Répertoire Géographique Marocain National :**
   - Module [moroccoCities.ts](file:///home/abdelaziz/Desktop/PhD/analysis/kriblasemsa/src/data/moroccoCities.ts) couvrant 20+ villes (Casablanca, Benguerir UM6P, Rabat, Tanger, Marrakech, Kénitra, Agadir, Fès, Meknès, Oujda, etc.).
   - Autocomplétion immédiate avec recherche floue (campus, gares, pôles d'affaires, quartiers).
   - Puces de raccourci par ville sous la barre de recherche.
5. **Jeu de données réaliste :**
   - 20 annonces modélisées avec colocataires, photos réelles, tags de compatibilité et transparence des charges.
6. **Filtres de recherche avancés :**
   - Type de bien, budget max, quartier, fibre optique, charges comprises, filles uniquement, meublé.
   - Drawer « Plus de filtres » (SDB privative, clim, machine à laver, parking, ascenseur, balcon, animaux, fumeurs).
   - Filtre dynamique par zone visible sur la carte (« Rechercher quand je déplace la carte »).
7. **Assistant de publication d'annonces (Wizard 4 étapes) :**
   - Choix de la ville marocaine, du quartier, et repère GPS sur carte Leaflet avec cercle de discrétion (200m).
   - Saisie du loyer, caution, charges, commodités, photos et créneaux horaires d'appel.

### B. Fonctionnalités Partiellement Implémentées (Partially Implemented)
1. **Intégration Supabase :**
   - `supabase/schema.sql` existe avec une structure initiale, mais les tables de gestion de profils, seeker_profiles, logs d'audit, contact_events et RLS complètes restent à interconnecter avec le code client.
2. **PWA :**
   - Le fichier `manifest.json` et les balises `<meta>` pour iOS/Android sont configurés dans `index.html`.
   - Il manque le Service Worker de mise en cache sécurisée et la gestion hors ligne.
3. **Persistance des données :**
   - Stockage local fonctionnel (`localStorage`) pour les favoris et les annonces créées via le wizard, devant être synchronisé avec Supabase PostgreSQL.

### C. Fonctionnalités Manquantes (Missing)
1. **Vérification OTP WhatsApp des numéros marocains (+212) :**
   - Normalisation E.164 stricte des numéros `06XX...`, `07XX...`.
   - Couche d'abstraction fournisseur (WhatsApp Business Platform / Twilio Verify / Supabase Auth).
   - Protection anti-pumping, expiration à 5 minutes, limitation de taux (rate limiting) et repli SMS.
2. **Endpoint Sécurisé de Dévoilement de Contact :**
   - Interdiction formelle d'exposer les numéros de téléphone des propriétaires dans les requêtes de recherche publiques ou le code HTML initial.
   - Dévoilement conditionné à l'authentification et à la vérification du numéro de l'utilisateur demandeur.
3. **Système Anti-Semsar & Modération Avancée :**
   - Déclaration d'honneur obligatoire lors de la publication.
   - Détection des signaux suspects (photos dupliquées, fréquence anormale de dépôts, numéros partagés).
   - Dashboard administrateur de modération des annonces et traitement des signalements.
4. **Optimisation des Images (Supabase Storage) :**
   - Compression côté client avant upload, suppression des métadonnées EXIF, conversion WebP et génération de miniatures.
5. **Support Internationalisation (i18n) Bilingue FR / AR (RTL) :**
   - Traduction complète en Arabe avec inversion de direction `dir="rtl"`.
6. **Suite de Tests Automatisés :**
   - Tests unitaires et d'intégration pour les règles RLS, la validation des numéros +212, et les flux critiques.

---

## 3. Analyse des Vulnérabilités & Problèmes de Sécurité

1. **Exposition potentielle des numéros de téléphone :**
   - Dans le prototype actuel, les numéros sont présents dans l'objet `Listing`. En production Supabase, les colonnes privées (`phone_number`, `exact_address`) doivent être masquées des vues publiques et accessibles uniquement via une fonction RPC / Edge Function sécurisée après vérification.
2. **Absence d'authentification serveur :**
   - Les publications actuelles sont générées côté client sans session Supabase Auth vérifiée.
3. **Protection contre l'usurpation de statut :**
   - Les champs `verified_badge`, `phone_verified` et le statut de publication (`published`) ne doivent jamais être modifiables directement par une requête `UPDATE` du client. Ils doivent être régis par des triggers PL/pgSQL et des fonctions de sécurité `SECURITY DEFINER`.

---

## 4. Services Externes et Identifiants Requis

| Service | Utilité | Statut Actuel | Environnement Requis |
| :--- | :--- | :--- | :--- |
| **CARTO Voyager Tiles** | Fond de plan cartographique haute définition | Clé officielle configurée (`cb1_4t6e_...`) | `.env` / `.env.local` |
| **Supabase** | Base de données PostgreSQL, Auth, PostGIS, Storage | Schéma initial rédigé | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| **WhatsApp OTP Provider** | Envoi de codes de vérification sur WhatsApp | Abstraction mockée prête pour intégration (Twilio Verify / Meta Cloud API) | `WHATSAPP_API_KEY`, `WHATSAPP_PHONE_ID` |
| **Hébergement & DNS** | Déploiement `kriblasemsar.com` | Prévu Vercel / Cloudflare Pages + Spaceship DNS | Configuration Apex + www |

---

## 5. Décision d'Architecture

- **Maintien de React 18 + Vite :** Le projet fonctionne remarquablement bien, compile en 3 secondes (`npm run build`), et offre une fluidité PWA optimale. Une réécriture vers Next.js n'est ni justifiée ni souhaitable, conformément à la RÈGLE 1 ("Ne pas recommencer de zéro").
- **Backend Supabase :** Implémentation du backend complet avec PostGIS pour les requêtes géospatiales performantes, Row Level Security étanche, et Edge Functions / RPC pour les flux sensibles.
