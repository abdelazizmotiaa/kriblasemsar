# Guide de Déploiement Cloudflare Pages & Liaison Spaceship
## Pour le domaine : `kriblasemsar.com` et `www.kriblasemsar.com`

Ce guide vous donne les étapes exactes pour mettre en ligne **KriblaSemsar** en moins de 3 minutes sur **Cloudflare Pages (100% gratuit)** et lier votre nom de domaine acheté sur **Spaceship**.

---

### Étape 1 : Déployer le site sur Cloudflare Pages (30 secondes)

1. Rendez-vous sur votre tableau de bord gratuit : **[dash.cloudflare.com](https://dash.cloudflare.com/)**
   *(Si vous n'avez pas de compte, créez-en un en 1 minute avec votre email).*
2. Dans le menu de gauche, cliquez sur **Workers & Pages** (ou **Compute**).
3. Cliquez sur le bouton bleu **Create application** (Créer une application).
4. Cliquez sur l'onglet **Pages** (en haut).
5. Sélectionnez **Upload assets** (Téléverser des fichiers).
6. **Nom du projet :** écrivez `kriblasemsar`.
7. **Téléversement :**
   - Glissez-déposez le dossier `dist/` OU sélectionnez le fichier zip généré :
     📁 `/home/abdelaziz/Desktop/PhD/analysis/kriblasemsa/kriblasemsar-build.zip`
8. Cliquez sur **Deploy site** (Déployer le site).
9. 🎉 **Votre site est instantanément en ligne** sur l'adresse :
   👉 `https://kriblasemsar.pages.dev`

---

### Étape 2 : Ajouter votre domaine dans Cloudflare Pages

1. Toujours sur Cloudflare Pages, dans votre projet `kriblasemsar` :
2. Cliquez sur l'onglet **Custom domains** (Domaines personnalisés).
3. Cliquez sur **Set up a custom domain** (Configurer un domaine personnalisé).
4. Entrez : `kriblasemsar.com` puis cliquez sur **Continue**.
5. Répétez l'opération pour ajouter également : `www.kriblasemsar.com`.

---

### Étape 3 : Configurer le DNS sur Spaceship (2 minutes)

1. Connectez-vous à votre compte **[Spaceship.com](https://www.spaceship.com/)**.
2. Dans le tableau de bord, cliquez sur **Domain List** (Liste des domaines).
3. Cliquez sur votre domaine `kriblasemsar.com`.
4. Cliquez sur l'onglet **Advanced DNS** (DNS avancé).
5. Ajoutez les deux enregistrements suivants :

| Type d'enregistrement | Host (Nom / Hôte) | Value (Cible / Valeur) | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** (ou ALIAS) | `@` | `kriblasemsar.pages.dev` | Auto |
| **CNAME** | `www` | `kriblasemsar.pages.dev` | Auto |

*(Ne supprimez pas vos enregistrements MX/Email si vous avez une boîte email Spaceship).*

---

### Résultat & Vérification

- La propagation DNS prend généralement entre **2 et 15 minutes**.
- Cloudflare génère automatiquement votre **certificat SSL (HTTPS) gratuit à vie**.
- Dès que la propagation est terminée, votre site sera accessible publiquement sur :
  🔒 **`https://www.kriblasemsar.com`** et **`https://kriblasemsar.com`** !
