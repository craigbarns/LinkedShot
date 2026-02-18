# Variables d'environnement pour Vercel

À ajouter dans **Vercel** → ton projet → **Settings** → **Environment Variables**.

Copie les **noms** ci-dessous et colle les **valeurs** depuis ton `.env.local` (les mêmes que en local).

---

## Obligatoires

| Nom | Description |
|-----|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase (ex. https://xxx.supabase.co) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role Supabase |
| `FAL_KEY` | Clé API FAL (retrait de fond) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (sk_live_...) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret du webhook Stripe (whsec_...) |

## Recommandées

| Nom | Description |
|-----|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe (pk_live_...) |
| `NEXT_PUBLIC_SITE_URL` | URL du site en prod (ex. https://linkedshot.com). **Requis pour OAuth Google** en prod ; voir `OAUTH_PRODUCTION.md` si la connexion Google ne marche pas. |

## Admin dashboard (/admin)

Sans ces variables, la page **/admin/login** affiche « Admin login not configured ».

| Nom | Description |
|-----|-------------|
| `ADMIN_EMAIL` | Email du compte admin (API /api/admin/stats) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Même email : utilisé pour la connexion « ADMIN » sur /admin/login |
| `ADMIN_REVENUE_SINCE_DATE` | Optionnel. Ne compter que les ventes à partir de cette date (YYYY-MM-DD). Ex. `2026-02-19` pour masquer les anciens revenus. |

---

## Liste à copier-coller (noms uniquement)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
FAL_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
ADMIN_EMAIL
NEXT_PUBLIC_ADMIN_EMAIL
ADMIN_REVENUE_SINCE_DATE
```

**Admin :** Crée dans Supabase (Authentication → Users → Add user) un utilisateur avec l’email `admin@linkedshot.com` (ou celui que tu mets dans ADMIN_EMAIL) et le mot de passe de ton choix (ex. Linkedshot2302). Ensuite connecte-toi sur **/admin/login** avec user **ADMIN** et ce mot de passe.

Renseigne chaque variable avec la valeur de ton `.env.local`, puis enregistre. Redéploie le projet si besoin pour que les variables soient prises en compte.
