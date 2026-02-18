# OAuth Google en production

Si **« Continue with Google »** ne fonctionne pas sur le site en ligne, c’est en général parce que l’URL de redirection n’est pas autorisée dans Supabase.

## 1. Supabase – URL Configuration

1. Ouvre ton projet sur [supabase.com](https://supabase.com) → **Authentication** → **URL Configuration**.
2. Renseigne :
   - **Site URL** : l’URL de ton site en prod, ex. `https://linkedshot.com`.
   - **Redirect URLs** : ajoute (une ligne par URL) :
     - `https://linkedshot.com/auth/callback`
     - `https://linkedshot.com/**`
     - Si tu utilises aussi un domaine Vercel : `https://ton-projet.vercel.app/auth/callback` et `https://ton-projet.vercel.app/**`
3. Clique sur **Save**.

## 2. Vercel – Variable d’environnement

Pour que l’app utilise la bonne URL en prod :

- **Vercel** → projet → **Settings** → **Environment Variables**
- Ajoute **NEXT_PUBLIC_SITE_URL** = `https://linkedshot.com` (ta vraie URL de prod)
- Redéploie le projet.

## 3. Google Cloud Console (déjà fait en local)

Les **Authorized redirect URIs** chez Google doivent contenir l’URL de **Supabase**, pas celle de ton site :

- `https://<TON_PROJECT_REF>.supabase.co/auth/v1/callback`

(Remplace `<TON_PROJECT_REF>` par l’id de ton projet Supabase, ex. `ttosloajpguxzppncomo`.)

Si c’est déjà configuré pour le dev, tu n’as rien à changer ici pour la prod.

---

**Résumé :** le blocage vient presque toujours de **Redirect URLs** dans Supabase. Dès que `https://ton-site.com/auth/callback` (et éventuellement `https://ton-site.com/**`) est dans la liste et que **Site URL** est correct, OAuth en prod doit fonctionner.
