# Élargir LinkedShot au-delà d’Amazon avec FAL.AI

FAL donne accès à [600+ modèles](https://docs.fal.ai/model-apis) (image, vidéo, audio). LinkedShot peut devenir un **studio photo IA** avec plusieurs produits, pas seulement le fond blanc Amazon.

---

## 1. Modèles FAL à intégrer (par cas d’usage)

### Déjà en place
| Modèle | Usage actuel |
|--------|----------------|
| `fal.run/fal-ai/bria/background/remove` | Fond blanc #FFFFFF pour Amazon |

### À ajouter (priorité)

| Cas d’usage | Modèle FAL | Input | Output | Idée produit |
|-------------|------------|--------|--------|--------------|
| **Photo produit lifestyle** | [`fal-ai/bria/product-shot`](https://fal.ai/models/fal-ai/bria/product-shot/api) | `image_url` + `scene_description` (ex. "on marble table, luxury") ou `ref_image_url` | Produit placé dans une scène pro | "Lifestyle shot" pour Amazon A+, Shopify, réseaux |
| **Headshots pro** | [`fal-ai/image-apps-v2/headshot-photo`](https://fal.ai/models/fal-ai/image-apps-v2/headshot-photo/api) | `image_url` + `background_style`: professional, corporate, clean, gradient | Photo pro type LinkedIn | "Photo pro LinkedIn" – un crédit = une photo |
| **Remove BG (générique)** | [`fal-ai/imageutils/rembg`](https://fal.ai/models/fal-ai/imageutils/rembg) | image URL | PNG transparent (ou crop) | "Fond transparent" pour tout usage (présentations, sites, etc.) |
| **Upscale** | [`fal-ai/esrgan`](https://fal.ai/models/fal-ai/esrgan) ou [`fal-ai/creative-upscaler`](https://fal.ai/models/fal-ai/creative-upscaler) | image + facteur (2x, 4x) | Image plus grande / plus nette | "Améliorer la résolution" produit ou photo |

### Autres modèles utiles (après)
- **Bria Embed Product** (`bria/embed-product`) : intégrer un produit dans une scène avec contrôle précis.
- **BiRefNet** : retrait de fond alternatif (portrait / général).
- **Product Photography** (`fal-ai/image-apps-v2/product-photography`) : photos produit avec éclairage réaliste.

---

## 2. Nouveau positionnement : "LinkedShot – AI Photo Studio"

**Message unique** : *"Photos pro en quelques secondes – fond blanc Amazon, lifestyle produit, headshots LinkedIn, fond transparent."*

### Page d’accueil proposée
- **Hero** : "Photos pro en secondes. Pas de Photoshop."
- **Bloc "Que voulez-vous faire ?"** avec cartes :
  1. **Fond blanc Amazon** (actuel) – "Fond #FFFFFF, conforme Amazon"
  2. **Photo produit lifestyle** – "Votre produit dans une scène pro (marbre, bureau, etc.)"
  3. **Photo pro LinkedIn** – "Headshot avec fond pro / corporate / clean"
  4. **Fond transparent** – "PNG transparent pour présentations, sites, print"
  5. **Upscale** – "Agrandir et améliorer la netteté"

Chaque carte → même système de crédits (3 gratuits, puis 9€/29€) mais **type de job** différent côté API (appel du bon modèle FAL).

### Crédits
- **Option A** : Un crédit = une opération, quel que soit le type (Amazon, lifestyle, headshot, remove BG, upscale). Simple.
- **Option B** : Headshot = 2 crédits, lifestyle = 1, etc. Pour refléter le coût FAL (ex. headshot ~0,04$/image).

---

## 3. Implémentation technique (résumé)

### Backend
- **Une route par type** (ou une route `/api/process` avec `mode: "amazon" | "lifestyle" | "headshot" | "transparent" | "upscale"`).
- Pour chaque mode, appeler le bon endpoint FAL :
  - `amazon` → `fal-ai/bria/background/remove` + post-traitement fond #FFFFFF si besoin.
  - `lifestyle` → `fal-ai/bria/product-shot` avec `scene_description` ou `ref_image_url`.
  - `headshot` → `fal-ai/image-apps-v2/headshot-photo` avec `background_style`.
  - `transparent` → `fal-ai/imageutils/rembg`.
  - `upscale` → `fal-ai/esrgan` ou `creative-upscaler`.
- Même logique **crédits** (décrémenter après succès) et **stockage** (Supabase processed).

### Frontend
- **Choix du mode** avant upload : onglets ou cartes "Amazon", "Lifestyle", "Headshot", "Transparent", "Upscale".
- Pour **lifestyle** : champ texte "Décrivez la scène (ex. on marble table)" ou upload d’une image de référence.
- Pour **headshot** : choix du style de fond (professional, corporate, clean, gradient).
- Pour **upscale** : choix du facteur (2x, 4x).
- Ensuite même zone d’upload et même flux (traitement → résultat → téléchargement).

### Dépendance
- Utiliser le client officiel : `@fal-ai/client` (voir [docs FAL](https://docs.fal.ai/model-apis)).  
- Les appels se font **côté serveur** (API route Next.js) avec `FAL_KEY` en env.

---

## 4. Ordre de mise en œuvre suggéré

1. **Garder Amazon** comme entrée principale, ajouter en nav ou hero un lien "Autres outils" / "Studio".
2. **Ajouter "Fond transparent"** (rembg) : même flux que Amazon, autre modèle, sortie PNG transparent. Idéal pour réutiliser ton UI actuelle.
3. **Ajouter "Headshot pro"** : nouvelle page ou mode dédié, formulaire (image + style de fond), appel `headshot-photo`. Cible LinkedIn / RH.
4. **Ajouter "Lifestyle produit"** : formulaire (image + description de scène ou image de référence), appel `bria/product-shot`. Cible vendeurs Amazon A+ / Shopify.
5. **Ajouter "Upscale"** : option 2x/4x, appel ESRGAN ou creative-upscaler. Utile pour tous les cas (produit, headshot).

---

## 5. SEO & messaging

- **Titres / meta** : "Photos pro Amazon, LinkedIn et e-commerce – fond blanc, lifestyle, headshot – LinkedShot".
- **Pages dédiées** (optionnel) : `/headshot`, `/lifestyle`, `/remove-background` avec contenu et mots-clés spécifiques (ex. "photo pro LinkedIn", "product photo lifestyle").
- **Blog** : articles "Photo produit lifestyle avec l’IA", "Meilleure photo LinkedIn en 1 clic", etc., avec liens vers les bons modes.

Tu restes focalisé sur des **cas métier clairs** (Amazon, e-commerce, LinkedIn, fond transparent) tout en t’appuyant sur l’écosystème FAL pour ne pas te limiter à un seul type de rendu.
