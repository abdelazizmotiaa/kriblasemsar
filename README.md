# KriblaSemsar (www.kriblasemsar.com)
### La Carte des Colocs — Maroc & MENA/Africa Edition (100% Zéro Semsar)

**KriblaSemsar** (« Kribla » = Louer sans, « Semsar » = Courtier/Intermédiaire) est la plateforme Mobile-First de référence pour la colocation et la location directe entre particuliers au Maroc et en Afrique/MENA.

Inspirée directement de **lacartedescolocs.fr**, la plateforme élimine les intermédiaires informels et garantit **0 DH de frais de semsar** grâce à une interface interactive carte/liste ultra-fluide, des conditions d'appel strictes et des liens directs WhatsApp pré-remplis.

---

## 🌟 Points Forts & Fonctionnalités Clés

1. **Architecture Mobile-First & PWA :**
   - Conçue en priorité pour les écrans de smartphones (90%+ du trafic marocain).
   - **Bouton flottant central `[ 🗺️ Carte | 📋 Liste ]`** pour basculer instantanément entre la carte GPS interactive et le flux de cartes.
   - **Barre de navigation sticky en bas** : `Explorer`, `Favoris`, `+ Publier` (bouton central surélevé), `Alertes`, `Profil`.
   - **Mode bureau split-screen 50/50** : Volet gauche déroulant avec filtres + volet droit carte plein écran avec pins interactifs.

2. **Carte GPS Interactive avec Bulles de Prix Colorées :**
   - Marqueurs stylisés en bulles de prix (ex: `2 200 DH`, `3 500 DH`).
   - Code couleur distinctif par type :
     - 🔵 **Bleu :** Chambre en colocation (*Chambre meublée dans appartement partagé*)
     - 🟢 **Vert :** Logement entier sans semsar (*Studio ou appartement direct propriétaire*)
     - 🟠 **Orange :** Recherche groupée / Profil colocataire (*Monter une coloc / Recherche*)
   - **Périmètre de confidentialité 200m** : Option permettant aux bailleurs et colocataires de masquer l'adresse exacte tout en indiquant la proximité des points d'intérêt (Tramway, Campus UM6P, Gare ONCF).

3. **Villes Pilotes & Données Réalistes Immédiatement Testables :**
   - **Benguerir (Ville Verte & Campus UM6P) :**
     - Chambre meublée haut standing proche UM6P / Ville Verte (2 200 DH/mois, Fibre 100M, doctorants IA).
     - Appartement entier 2 chambres sans semsar - Hay Elassil (3 500 DH/mois, direct propriétaire).
     - Colocation 3 personnes ingénieurs/chercheurs - Proche Gare ONCF (1 800 DH/mois).
     - Studio meublé refait à neuf - Centre-Ville (2 600 DH/mois).
     - Chambre pour étudiante dans résidence sécurisée - Hay Al Majd (1 700 DH/mois, Filles uniquement).
     - Profil chercheur doctorant en colocation (Budget 2 000 DH).
   - **Casablanca :**
     - Maârif Extension (3 200 DH/mois, suite parentale avec SDB privée, cadres tech).
     - Casa Finance City (CFC) & Tramway (3 800 DH/mois, standing neuf, parking).
     - Studio meublé direct propriétaire - Bourgogne (4 500 DH/mois, 0% commission).
     - Sidi Maârouf Casanearshore (2 500 DH/mois, ingénieurs logiciels).
     - Quartier Gauthier (3 500 DH/chambre, terrasse & commerces).
     - Résidentiel Oasis proche Facultés et Tramway (2 300 DH/mois).

4. **Système de Contact Anti-Spam & Charte Anti-Semsar :**
   - **Lien WhatsApp pré-rempli :** Ouvre directement WhatsApp avec un message poli contextualisé en français/darija contenant le titre, le quartier, la ville et le loyer.
   - **Conditions d'appel de l'annonceur :** Affiche les créneaux d'appel autorisés par l'occupant (ex: *« 18h00 - 21h30 (En labo ou entreprise la journée) »*).
   - **Case d'attestation sur l'honneur obligatoire :** *« Je certifie sur l'honneur être un particulier (locataire potentiel) et non un intermédiaire ou semsar »* avant de déverrouiller le numéro.
   - **Bouton « Signaler un Semsar » :** Permet à la communauté de signaler immédiatement tout demandeur de commission. 3 signalements suspendent l'annonce automatiquement.

5. **Wizard de Publication Multi-Étapes avec Pin-Drop GPS :**
   - Choix du type de bien.
   - Sélection de ville/quartier avec carte cliquable pour déposer le repère GPS précis.
   - Photos, loyer, caution, charges réelles détaillées (ONEE, eau, fibre).
   - Spécifications adaptées au Maroc : Fibre Optique haut débit, Climatisation, SDB privative, Parking sous-sol, Meublé.
   - Préférences colocataires (Filles, Garçons, Mixte, Étudiants, Salariés).
   - Configuration des horaires d'appel et du numéro WhatsApp.

---

## 🛠️ Stack Technique

- **Frontend :** React 18 + TypeScript + Vite.
- **Styling :** Tailwind CSS + Lucide Icons + animations sur mesure.
- **Moteur Cartographique :** Leaflet avec tuiles CartoDB Voyager (haute lisibilité, zéro coût d'API).
- **Backend & Données :**
  - Schéma PostgreSQL + PostGIS complet (`supabase/schema.sql`) pour bounding-box spatiales, RLS et déclencheurs anti-semsar.
  - Store réactif local avec persistance des favoris dans `localStorage`.

---

## 🚀 Démarrage Rapide

```bash
# 1. Se placer dans le dossier
cd /home/abdelaziz/Desktop/PhD/analysis/kriblasemsa

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev -- --host 0.0.0.0 --port 5173

# 4. Accéder à l'application
# Sur votre ordinateur : http://localhost:5173/
# Sur votre smartphone (sur le même réseau Wi-Fi) : http://<IP_LOCALE>:5173/
```
