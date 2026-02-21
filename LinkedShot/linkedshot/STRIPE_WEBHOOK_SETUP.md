# Webhook Stripe : crédits ajoutés automatiquement après paiement

Quand un client paie (Starter 50 images ou Pro 200 images), Stripe envoie un événement à ton site et les crédits sont **ajoutés automatiquement** au bon compte. Il faut que le webhook soit bien configuré.

## 1. Créer le webhook dans Stripe

1. Va sur [dashboard.stripe.com](https://dashboard.stripe.com) → **Developers** → **Webhooks**.
2. Clique sur **Add endpoint**.
3. **Endpoint URL** : `https://TON-DOMAINE.com/api/webhooks/stripe`  
   (remplace par ta vraie URL en prod, ex. `https://linkedshot.com/api/webhooks/stripe`).
4. Dans **Select events to listen to**, choisis :
   - **checkout.session.completed**
5. Clique sur **Add endpoint**.

## 2. Récupérer le secret

1. Sur la page du webhook créé, ouvre **Signing secret** (clique sur « Reveal »).
2. Copie la valeur (elle commence par `whsec_...`).

## 3. Configurer Vercel

1. **Vercel** → ton projet → **Settings** → **Environment Variables**.
2. Ajoute (ou modifie) :
   - **Nom** : `STRIPE_WEBHOOK_SECRET`
   - **Valeur** : le secret copié (`whsec_...`)
3. **Important** : sélectionne l’environnement **Production** (et Preview si tu testes en preview).
4. Enregistre et **redéploie** le projet (Deployments → … → Redeploy).

## 4. Vérifier que ça marche

- Fais un **paiement test** (mode test Stripe avec la carte `4242 4242 4242 4242`).
- Dans Stripe → **Developers** → **Webhooks** → ton endpoint → **Recent deliveries** : tu dois voir un événement **checkout.session.completed** avec une réponse **200**.
- Sur ton site, le compte utilisé pour le paiement doit avoir **+50** (Starter) ou **+200** (Pro) crédits sur le dashboard.

## Comportement côté code

- **Checkout** (`/api/checkout`) : crée une session Stripe avec en metadata `user_id`, `plan_id`, `credits` (50 ou 200 selon le plan).
- **Webhook** (`/api/webhooks/stripe`) : à la réception de `checkout.session.completed`, lit `user_id` et `credits`, puis **ajoute** ces crédits au compte (création de la ligne `credits` si besoin).
- Les plans sont définis dans `src/lib/stripe.ts` : Starter = 50 crédits, Pro = 200 crédits.

Une fois le webhook configuré et le secret renseigné en prod, **les crédits sont ajoutés automatiquement selon le plan payé**.
