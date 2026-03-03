# Vérifier les jobs dans Supabase

Ouvre **Supabase Dashboard** → ton projet → **SQL Editor**, puis exécute les requêtes ci-dessous.

---

## 1. Structure de la table `jobs`

Vérifie que la table a bien toutes les colonnes (dont `used_free_credit` de la migration 002) :

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'jobs'
ORDER BY ordinal_position;
```

**Attendu :**  
`id`, `user_id`, `original_path`, `processed_path`, `status`, `created_at`, `used_free_credit`

Si `used_free_credit` manque, exécute la migration 002 :

```sql
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS used_free_credit boolean NOT NULL DEFAULT false;
```

---

## 2. Politiques RLS sur `jobs`

```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'jobs';
```

**Attendu :**  
- Une policy **SELECT** avec `qual` contenant `auth.uid() = user_id` (ex. "Users can read own jobs")
- Une policy **INSERT** avec `with_check` contenant `auth.uid() = user_id` (ex. "Users can insert own jobs")

Sans ces policies, les utilisateurs ne voient pas leurs jobs dans le dashboard.

---

## 3. Derniers jobs (tous utilisateurs, avec le service role)

Dans **SQL Editor**, avec le rôle par défaut (ou en tant qu’admin), tu peux lister les derniers jobs :

```sql
SELECT id, user_id, status, processed_path, created_at
FROM public.jobs
ORDER BY created_at DESC
LIMIT 20;
```

Si cette requête renvoie des lignes, les jobs sont bien en base. Si le dashboard ne les affiche pas, le problème vient en général des policies RLS ou de la session (anon key + cookie utilisateur).

---

## 4. Tester la lecture “côté utilisateur” (RLS)

Pour simuler ce que voit un utilisateur connecté, remplace `'TON-USER-UUID'` par un vrai `user_id` présent dans `auth.users` (ou récupère-le avec `SELECT id FROM auth.users LIMIT 1;`) :

```sql
SET request.jwt.claim.sub = 'TON-USER-UUID';

SELECT id, user_id, status, processed_path, created_at
FROM public.jobs
WHERE user_id = 'TON-USER-UUID'
ORDER BY created_at DESC
LIMIT 10;
```

Ensuite remet la session à zéro :

```sql
RESET request.jwt.claim.sub;
```

(Supabase ne permet pas toujours de faire ce `SET` dans le SQL Editor ; dans ce cas, la vérification se fait surtout via les policies ci-dessus et les logs de l’app.)

---

## 5. Vérifier qu’il y a bien des utilisateurs et des crédits

```sql
SELECT c.user_id, c.amount, c.updated_at
FROM public.credits c
ORDER BY c.updated_at DESC
LIMIT 10;
```

```sql
SELECT COUNT(*) AS total_jobs FROM public.jobs;
SELECT COUNT(*) AS done_jobs FROM public.jobs WHERE status = 'done';
```

---

## Résumé

- Si **1** montre bien la colonne `used_free_credit` → migrations OK.
- Si **2** montre les deux policies (SELECT + INSERT) → RLS OK pour le dashboard.
- Si **3** montre des lignes → les jobs sont bien enregistrés par l’API.
- Si le dashboard reste vide alors que **3** renvoie des lignes → problème de session (cookies, domaine) ou de policy RLS (vérifier **2**).
