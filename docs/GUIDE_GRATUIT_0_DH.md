# KriblaSemsar — Guide d'Exploitation 100% Gratuite (0,00 DH / Zéro Frais)
## دليل تشغيل منصة « كْري بلا سمسار » مجاناً 100% بدون أي مصاريف

Ce document explique en détail comment déployer et maintenir **KriblaSemsar** (`kriblasemsar.com` — « كْري بلا سمسار ») en tant qu'**initiative bénévole et solidaire**, sans payer aucun abonnement, aucun service payant ni aucun frais de SMS/WhatsApp.

---

### 1. Pourquoi le projet fonctionne à 0,00 DH (Budget Zéro) ?

| Besoin Technique | Solution Payante Classique (Évitée ❌) | Solution Gratuite KriblaSemsar (Adoptée ✅) | Coût pour vous |
| :--- | :--- | :--- | :--- |
| **Hébergement Web & PWA** | Serveur dédié OVH / AWS ($20/mois) | **Vercel Hobby** ou **Cloudflare Pages** | **0 DH** (Gratuit à vie) |
| **Base de Données & PostGIS** | AWS RDS PostgreSQL ($30/mois) | **Supabase Free Plan** (500 Mo PostgreSQL + PostGIS) | **0 DH** (Gratuit à vie) |
| **Stockage Photos** | AWS S3 ($5/mois) | **Supabase Storage** (1 Go gratuit avec WebP = ~10 000 photos) | **0 DH** (Gratuit à vie) |
| **SMS / WhatsApp OTP** | Meta Cloud API / Twilio (0,40 DH / SMS) | **Mode Solidaire Instantané `FreeCommunityProvider`** | **0 DH** (Zéro facture) |
| **Mise en relation WhatsApp** | API Chatbot payante | **Liens officiels `wa.me/212...`** ouvrant le WhatsApp du locataire | **0 DH** (Direct et gratuit) |
| **Cartographie** | Google Maps API payante | **CARTO Voyager (Clé active) / OpenStreetMap** | **0 DH** (Inclus) |
| **Certificat SSL (HTTPS)** | Certificat payant ($50/an) | **Let's Encrypt automatique via Cloudflare/Vercel** | **0 DH** (Automatique) |
| **TOTAL MENSUEL** | **~600 à 1 200 DH / mois** | **KRIBLASEMSAR GRATUIT** | **0,00 DH / MOIS** |

---

### 2. Comment fonctionne la vérification téléphonique sans payer d'API ?

1. **Format marocain (+212) :** L'utilisateur saisit son numéro (`06...` ou `07...`).
2. **Normalisation automatique :** Le système vérifie que le préfixe correspond à un vrai opérateur marocain (Maroc Telecom, Orange Maroc, inwi) et le convertit en E.164 (`+212XXXXXXXXX`).
3. **Validation Solidaire Instantanée :**
   - Un jeton de sécurité à 6 chiffres est généré instantanément et affiché à l'utilisateur (« *Initiative Bénévole & Solidaire — 100% Gratuit* »).
   - L'utilisateur recopie ce code pour confirmer qu'il est bien un utilisateur humain actif.
   - **Avantage :** 0 dépense, aucune dépendance envers Meta ou Twilio, aucune facture imprévue en cas d'afflux d'utilisateurs.

---

### 3. Comment les locataires contactent-ils les propriétaires gratuitement ?

- La plateforme génère un lien profond standard :
  `https://wa.me/212XXXXXXXXX?text=Bonjour...`
- Lorsqu'un utilisateur clique sur « **Contacter sur WhatsApp** » :
  1. L'application WhatsApp s'ouvre directement sur son smartphone.
  2. Le message poli et pré-rempli s'affiche avec la référence de l'annonce.
  3. L'échange se fait de téléphone à téléphone via les connexions personnelles normales des utilisateurs (4G/Wi-Fi).
  4. **KriblaSemsar ne paie absolument rien pour cette mise en relation.**

---

### 4. Comment lutter contre les semsars sans payer d'outils d'IA payants ?

1. **Déclaration sur l'honneur obligatoire :** Chaque annonceur doit cocher qu'il est propriétaire ou colocataire et certifie sur l'honneur qu'aucune commission ne sera demandée.
2. **Signalement communautaire en 1 clic :** Si un faux particulier demande des « frais de semsar », le locataire clique sur « Signaler ».
3. **Suspension automatique (Déclencheur SQL Postgres) :** Dès 3 signalements confirmés, la base de données masque automatiquement l'annonce et suspend le compte.
4. **Tableau de bord de modération bénévole :** Vous disposez de la page d'administration (`AdminModerationDashboard.tsx`) pour valider ou rejeter les annonces en quelques secondes.

---

### 5. Étapes de Mise en Ligne sans Carte Bancaire

1. **Créer un compte gratuit sur [Supabase.com](https://supabase.com)** (Offre gratuite $0).
2. **Créer un projet** et copier-coller les 5 fichiers SQL situés dans `supabase/migrations/` dans l'éditeur SQL de Supabase.
3. **Créer un compte gratuit sur [Vercel.com](https://vercel.com)** ou **Cloudflare Pages**.
4. **Lier le dépôt Git** et renseigner les variables d'environnement gratuites :
   ```env
   VITE_CARTO_API_KEY=cb1_4t6e_1_a5d52c28d7a3493bc3cbb3dd
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_cle_anon
   VITE_FREE_COMMUNITY_MODE=true
   ```
5. **Pointer le nom de domaine Spaceship** (`kriblasemsar.com`) vers Vercel ou Cloudflare.

**Votre site est 100% en ligne, sécurisé, rapide, et ne vous coûtera jamais rien.**
