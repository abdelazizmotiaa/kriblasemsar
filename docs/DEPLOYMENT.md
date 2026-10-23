# KriblaSemsar — Guide de Déploiement & Configuration DNS (docs/DEPLOYMENT.md)

**Domaine de production :** `https://kriblasemsar.com` et `https://www.kriblasemsar.com`  
**Registrar DNS :** Spaceship  
**Framework :** React 18 / Vite (Single Page Application / PWA)  

---

## 1. Choix d'Hébergement & Justification

Pour héberger le frontend KriblaSemsar (Vite SPA) avec des performances optimales à l'échelle du Maroc et du continent africain :
- **Option Recommandée : Cloudflare Pages ou Vercel**
  - **Points de présence (Edge CDN) :** Cache distribué à Casablanca, Rabat et dans tout le bassin méditerranéen pour un chargement instantané des assets PWA.
  - **Support natif SSL / TLS 1.3 gratuit.**
  - **Déploiements atomiques avec rollback instantané.**

---

## 2. Configuration des Enregistrements DNS Spaceship

> [!IMPORTANT]
> Ne jamais modifier ni supprimer d'enregistrements MX, SPF ou DKIM préexistants liés à votre messagerie professionnelle.
> Toute modification DNS en production doit faire l'objet d'une validation explicite.

### Table des Enregistrements DNS Requis (Exemple Vercel / Cloudflare Pages)

| Type | Nom / Hôte | Valeur / Cible | TTL | Remarques |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (Apex) | `76.76.21.21` (ou IP Cloudflare Pages) | Auto / 300 | Pointage du domaine racine `kriblasemsar.com` |
| **CNAME** | `www` | `cname.vercel-dns.com.` (ou alias Cloudflare) | Auto / 300 | Pointage du sous-domaine `www.kriblasemsar.com` |
| **TXT** | `_vercel` (si Vercel) | *(fourni par la console de déploiement)* | Auto / 300 | Vérification de propriété du domaine |

### Redirection Canonique
- **Règle recommandée :** Rediriger `https://kriblasemsar.com` vers `https://www.kriblasemsar.com` avec un code HTTP 301 permanent pour consolider l'autorité SEO et éviter le contenu dupliqué.

---

## 3. Configuration Supabase en Production

1. **URL de Redirection Supabase Auth :**
   Dans votre tableau de bord Supabase (*Authentication -> URL Configuration*) :
   - **Site URL :** `https://www.kriblasemsar.com`
   - **Redirect URLs :**
     - `https://www.kriblasemsar.com/*`
     - `https://kriblasemsar.com/*`
     - `http://localhost:5173/*` (pour l'environnement local de développement)
2. **PostGIS & Extensions :**
   Exécuter les migrations SQL situées dans `supabase/migrations/`.
3. **Buckets de Stockage (Storage) :**
   - `listing-photos` : Public, taille max 8 Mo, types MIME `image/jpeg`, `image/png`, `image/webp`.
   - `verification-documents` : Privé, réservé à la modération.

---

## 4. Modèle des Variables d'Environnement (`.env.example`)

```bash
# ===================================================
# KRIBLASEMSAR — VARIABLES D'ENVIRONNEMENT PRODUCTION
# ===================================================

# Fond de plan cartographique Leaflet CARTO Voyager (Actif sans watermark)
VITE_CARTO_API_KEY=cb1_4t6e_1_a5d52c28d7a3493bc3cbb3dd

# Supabase BaaS (PostgreSQL + PostGIS + Auth + Storage)
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

# Domaine public de l'application
VITE_APP_URL=https://www.kriblasemsar.com

# Fournisseur de vérification OTP WhatsApp (Côté Edge Function / Serveur)
# Mode actuel : 'mock' pour le développement, 'whatsapp_cloud' ou 'twilio' en prod
VITE_OTP_PROVIDER_MODE=mock
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_TEMPLATE_NAME=kriblasemsar_otp_fr

# SMS Fallback (Optionnel pour le pilote)
SMS_FALLBACK_PROVIDER=mock
```

---

## 5. Pipeline d'Intégration & Déploiement Continu (CI/CD)

Script de vérification exécutable avant tout déploiement :
```bash
# 1. Validation des types TypeScript
npm run build

# 2. Vérification du formatage et des linters
npm run lint (ou tsc -b)

# 3. Lancement des tests unitaires et de sécurité RLS
npm test
```
Toute erreur lors du `npm run build` interrompt immédiatement le déploiement pour protéger la production.
