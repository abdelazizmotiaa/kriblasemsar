# KriblaSemsar — Checklist de Sécurité & Conformité (docs/SECURITY_CHECKLIST.md)

**Plateforme :** `https://kriblasemsar.com`  
**Niveau d'exigence :** Production / Données personnelles & Géospatiales  

---

## 1. Matrice de Contrôle d'Accès Row Level Security (RLS)

| Table | Rôle Anonyme (`anon`) | Rôle Connecté (`authenticated`) | Propriétaire de l'Enregistrement | Administrateur (`admin_role`) |
| :--- | :--- | :--- | :--- | :--- |
| **`profiles`** | Lecture des profils publics uniquement | Lecture des profils publics | Lecture + Mise à jour de ses propres données | Lecture complète + Suspension |
| **`listings`** | Lecture des annonces `status = 'published'` uniquement | Lecture des annonces publiées | CRUD complet sur ses propres brouillons / annonces | Modération complète (approbation, rejet, suspension) |
| **`listing_photos`** | Lecture publique | Lecture publique | Ajout et suppression sur ses propres annonces | Suppression modératrice |
| **`seeker_profiles`**| Lecture des profils configurés comme publics | Lecture selon visibilité | Modification de son propre profil | Lecture + Modération |
| **`favorites`** | Aucun accès | Aucun accès sur autrui | CRUD sur ses propres favoris uniquement | Aucun accès requis |
| **`listing_reports`** | Aucun accès | Création de signalement autorisée | Aucun droit de modification ou suppression | Consultation + Traitement des alertes |
| **`contact_events`** | Aucun accès | Insertion via RPC uniquement | Aucun droit de modification | Audit global et détection de scraping |
| **`phone_verifications`**| Aucun accès | Aucun accès direct aux tables (RPC uniquement) | Vérification de son propre code via RPC | Traçabilité des tentatives sans accès au hash |

---

## 2. Protection Contre les Vulnérabilités Web Majeures (OWASP Top 10)

### A. Injections (SQL / PostGIS)
- [x] Utilisation exclusive de requêtes paramétrées via le client Supabase et PostgREST.
- [x] Les fonctions géospatiales PostGIS utilisent des arguments typés (`FLOAT`, `INTEGER`) et jamais de concaténation de chaînes SQL dynamiques dans des clauses non protégées.
- [x] Les coordonnées GPS d'entrée sont validées par Zod pour respecter les limites strictes du Maroc (`latitude BETWEEN 21.0 AND 36.0`, `longitude BETWEEN -18.0 AND -1.0`).

### B. Broken Object Level Authorization (BOLA / IDOR)
- [x] Les requêtes de mise à jour (`UPDATE`) et suppression (`DELETE`) vérifient systématiquement `auth.uid() = owner_id`.
- [x] Un utilisateur ne peut pas modifier le statut d'une annonce vers `'published'` ou `'verified'` sans passer par la fonction serveur de modération.
- [x] La suppression de photos vérifie que la photo appartient bien à une annonce détenue par l'utilisateur connecté.

### C. Dévoilement et Fuite de Coordonnées Personnelles (Contact Scraping)
- [x] Les numéros de téléphone ne sont jamais inclus dans les réponses JSON des listes publiques ou des marqueurs de la carte.
- [x] L'accès au numéro ou au lien WhatsApp nécessite un appel à la fonction sécurisée `reveal_contact_info(listing_id)`.
- [x] La fonction `reveal_contact_info` vérifie :
  1. Que l'utilisateur est authentifié.
  2. Que son propre numéro marocain est vérifié.
  3. Qu'il n'a pas dépassé son quota journalier (Rate limit : 10 consultations/24h).
- [x] Journalisation de chaque événement dans `contact_events` avec horodatage et adresse IP pour bannir les scrapers.

### D. Sécurité du Flux OTP WhatsApp & SMS
- [x] Les codes OTP ne sont **jamais** stockés en texte clair dans la base de données.
- [x] Expiration stricte des codes OTP à 5 minutes.
- [x] Cooldown de 60 secondes entre deux demandes de renvoi.
- [x] Verrouillage après 3 tentatives infructueuses consécutives.
- [x] Protection contre le « SMS/WhatsApp Pumping » : limitation par IP et par tranche horaire.
- [x] Réponse générique pour éviter l'énumération des numéros de téléphone existants.

### E. Sécurité des Téléversements (Supabase Storage)
- [x] Validation stricte des types MIME autorisés : `image/jpeg`, `image/png`, `image/webp`.
- [x] Limite de taille fixée à 8 Mo par photo.
- [x] Nettoyage automatique des métadonnées EXIF (pouvant contenir les coordonnées GPS privées de l'appareil photo du bailleur) lors de la compression client.
- [x] Noms de fichiers renommés en UUID aléatoires pour éviter les collisions et les attaques par traversée de répertoires (`../`).

---

## 3. Conformité avec la Loi Marocaine N° 09-08 (CNDP)

La plateforme KriblaSemsar traite des données à caractère personnel de citoyens et résidents marocains. Les principes fondamentaux suivants sont appliqués :

1. **Principe de Minimisation des Données :**
   - Seules les données strictement indispensables à la mise en relation locative sont collectées (nom, numéro de téléphone, préférences de logement).
   - Aucune collecte de coordonnées bancaires ou de documents d'identité non nécessaires au stade initial.
2. **Consentement Éclairé & Transparence :**
   - Notification claire à l'utilisateur lors de la création de compte sur l'usage de son numéro de téléphone.
   - Accord explicite sur la politique « 0% Semsar » et les conditions générales d'utilisation.
3. **Droit d'Accès, de Rectification et d'Effacement :**
   - L'utilisateur peut à tout moment modifier ses annonces, supprimer son compte et purger ses photos du stockage.
4. **Sécurité et Confidentialité :**
   - Chiffrement des communications de bout en bout (TLS 1.3 / HTTPS).
   - Accès administrateur strictement compartimenté avec traçabilité dans `audit_logs`.
5. **Démarches CNDP préalables au lancement commercial :**
   - Dépôt de la déclaration de traitement de données à caractère personnel auprès de la Commission Nationale de contrôle de la protection des Données à caractère Personnel (CNDP) du Royaume du Maroc avant l'ouverture commerciale publique.
