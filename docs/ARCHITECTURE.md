# KriblaSemsar — Architecture Système (docs/ARCHITECTURE.md)

**Plateforme :** KriblaSemsar (`kriblasemsar.com`)  
**Mission :** Première place de marché marocaine de location et colocation 100% directe (« 0% Semsar »).  

---

## 1. Vue d'Ensemble de l'Architecture

L'application repose sur un modèle moderne **Mobile-First Jamstack / BaaS** couplé à une base de données relationnelle géospatiale avancée :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CLIENT APPLICATION (PWA)                              │
│   React 18 + Vite + TypeScript + Tailwind CSS                               │
│   - Map View (Leaflet + CARTO Voyager)                                      │
│   - Split Feed View & Instant Autocomplete                                  │
│   - PWA Service Worker (Cache hors ligne sécurisé)                          │
│   - Multi-Device UI (Mobile Drawer & 50/50 Desktop)                         │
└──────────────────────┬───────────────────────────────┬──────────────────────┘
                       │ HTTPS / REST / WebSockets     │ Storage Upload
                       ▼                               ▼
┌───────────────────────────────────────┐   ┌─────────────────────────────────┐
│        SUPABASE EDGE / API            │   │        SUPABASE STORAGE         │
│  - JWT Auth & Session Handling        │   │  - listing-photos (Public CDN)  │
│  - RPC: get_listings_in_bbox()        │   │  - verification-docs (Private)  │
│  - RPC: reveal_contact_info()         │   └─────────────────────────────────┘
│  - RPC: submit_semsar_report()        │
└──────────────────┬────────────────────┘
                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUPABASE POSTGRESQL + POSTGIS (DB)                       │
│  - Tables : profiles, cities, listings, listing_photos, seeker_profiles...  │
│  - Colonnes géographiques : geography(Point, 4326) avec index GiST          │
│  - Row Level Security (RLS) étanche sur chaque table                        │
│  - Triggers de sécurité : modération, calculs de scores, timestamps         │
└─────────────────────────────────────────────────────────────────────────────┘
                   │
                   ▼ (Appels sécurisés côté serveur)
┌─────────────────────────────────────────────────────────────────────────────┐
│               WHATSAPP OTP & SMS FALLBACK ENGINE                            │
│  - Normalisation des numéros marocains (+212 E.164)                         │
│  - Provider Abstraction : Twilio Verify / Meta Cloud API / Mock             │
│  - Protection Anti-Pumping, Rate Limiting & Cooldown 5 minutes              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Modèle de Données & Relations

### Entités Principales
1. **`profiles` (extension de `auth.users`) :**
   - Identifiant unique UUID lié à Supabase Auth.
   - Données : `full_name`, `display_name`, `email`, `phone_e164`, `phone_verified_at`, `user_type` (`tenant`, `owner`, `flatmate`, `authorized_representative`), `account_status`, `trust_level`.
   - **Règle absolue :** Les privilèges d'administration (`is_admin`) ne sont jamais modifiables par le client ; ils sont stockés dans une table de rôles protégée `admin_roles`.

2. **`cities` :**
   - Villes marocaines avec noms français/arabes (`name_fr`, `name_ar`), slug, région, latitude, longitude et point géographique `geography(Point, 4326)`.

3. **`listings` :**
   - Annonces de colocation ou logement entier.
   - Détails : `listing_type`, `property_type`, `monthly_price_mad`, `deposit_mad`, `additional_charges_mad`, `surface_m2`, `furnished`, `available_from`.
   - Localisation : `neighborhood`, `private_address` (protégée), `exact_location` (privée), `public_map_location` (bruitée/approximée pour la vie privée).
   - Statuts contrôlés par serveur : `draft`, `pending_review`, `published`, `rejected`, `suspended`, `rented`, `expired`.

4. **`listing_photos` :**
   - Photos rattachées à l'annonce, avec ordre de tri, dimensions, taille et chemin de stockage dans le bucket `listing-photos`.

5. **`seeker_profiles` :**
   - Profils de recherche de colocation avec budget souhaité, ville, quartier, préférences et contrôles de confidentialité distincts.

6. **Tables de Sécurité & Modération :**
   - `favorites` : Favoris utilisateurs.
   - `listing_reports` & `user_reports` : Signalements de semsar ou d'abus.
   - `contact_events` : Journalisation d'audit des demandes de contact pour empêcher le scraping de numéros.
   - `phone_verifications` : Suivi des tentatives OTP avec expiration et hachage (jamais de code en clair).
   - `audit_logs` : Traçabilité des actions administratives et des modifications d'état.

---

## 3. Modèle de Confidentialité des Coordonnées (Contact Privacy)

Pour éradiquer le scraping de numéros par des intermédiaires véreux :
1. **Pas de fuite publique :** Les requêtes `SELECT` publiques sur `listings` renvoient une vue `public_listings` qui omet systématiquement le numéro de téléphone et l'adresse physique exacte.
2. **Dévoilement via RPC Sécurisée (`reveal_contact_info`) :**
   - L'utilisateur demandeur doit être connecté (`auth.uid() IS NOT NULL`).
   - Le profil demandeur doit posséder un numéro de téléphone marocain vérifié (`phone_verified_at IS NOT NULL`).
   - Contrôle du taux de consultation (maximum 10 consultations de contacts par jour pour un locataire, empêchant l'extraction automatisée).
   - Enregistrement d'une ligne d'audit dans `contact_events`.
   - Restitution du lien WhatsApp officiel `https://wa.me/212...` avec message contextuel pré-formaté.

---

## 4. Pipeline de Recherche Géospatiale (PostGIS)

1. **Indexation GiST :**
   ```sql
   CREATE INDEX idx_listings_geom ON public.listings USING GIST(geom);
   ```
2. **Recherche par Bounding Box (Emprise visible de la carte) :**
   - Fonction RPC `get_listings_in_bbox(min_lng, min_lat, max_lng, max_lat, filters)` :
   - Filtre instantanément via `ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)` sans balayage complet de la table.
3. **Floutage de Confidentialité (Privacy Circle 200m) :**
   - Lorsque `exact_location_hidden` est coché, la carte Leaflet affiche un disque de 180-200 mètres de rayon au lieu d'un marqueur précis sur la porte de l'immeuble.
4. **Algorithme Spiderfier Déterministe :**
   - Évite la superposition visuelle des pastilles de prix pour les logements partageant les mêmes coordonnées GPS.

---

## 5. Système Anti-Semsar & Détection de Fraude

1. **Déclaration d'engagement :** Validation obligatoire de la déclaration sur l'honneur bilingue (FR/AR) certifiant l'absence totale de commission.
2. **Signaux de détection automatisée :**
   - Fréquence de dépôt anormale (> 3 annonces créées en moins de 24 heures par un même compte).
   - Numéro de téléphone ou photos réutilisés sur plusieurs comptes distincts.
   - Cumul de signalements (`listing_reports` $\ge 3$) déclenchant une mise en quarantaine immédiate (`status = 'suspended'`).
3. **Modération humaine assistée :** Console d'administration permettant de valider, rejeter ou suspendre des annonces avec motif motivé.
