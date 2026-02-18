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
| `NEXT_PUBLIC_SITE_URL` | URL du site en prod (ex. https://linkedshot.vercel.app) |

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
```

Renseigne chaque variable avec la valeur de ton `.env.local`, puis enregistre. Redéploie le projet si besoin pour que les variables soient prises en compte.
