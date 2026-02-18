# Supabase – LinkedShot

## 1. Exécuter la migration

Dans le **SQL Editor** du dashboard Supabase, exécute le contenu de :

- `migrations/001_credits_and_jobs.sql`

## 2. Créer les buckets Storage

Dans **Storage** du dashboard Supabase :

1. **Créer un bucket** nommé `raw`  
   - Public : **Oui** (pour que les URLs publiques des images uploadées fonctionnent).

2. **Créer un bucket** nommé `processed`  
   - Public : **Oui**.

3. **Policies** (optionnel, pour sécuriser) :  
   - `raw` : les utilisateurs authentifiés peuvent **upload** dans leur dossier `{user_id}/*`.  
   - `processed` : en écriture côté serveur uniquement (service role) ; en lecture publique pour afficher les images.

Tu peux définir des policies dans l’onglet **Policies** de chaque bucket (ex. : "Users can upload to own folder" sur `raw` avec `bucket_id = 'raw'` et `(storage.foldername(name))[1] = auth.uid()::text`).

## 3. Google OAuth (recommandé)

1. **Supabase** → Authentication → Providers → **Google** : activer, laisser les champs vides pour l’instant.

2. **Google Cloud Console** (console.cloud.google.com) :
   - APIs & Services → Credentials → **Create Credentials** → **OAuth 2.0 Client ID**
   - Type : **Web application**
   - **Authorized redirect URIs** : `https://ttosloajpguxzppncomo.supabase.co/auth/v1/callback`
   - Créer puis copier **Client ID** et **Client Secret**

3. Coller **Client ID** et **Client Secret** dans Supabase (Authentication → Providers → Google), sauvegarder.
