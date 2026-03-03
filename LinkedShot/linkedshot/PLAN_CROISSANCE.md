# Comment faire cartonner LinkedShot (avec FAL.AI)

## Ce qui est déjà en place
- **FAL.AI** (Bria) pour le retrait de fond → ~3 sec par image
- 3 gratuites, 9€/50 images, 29€/200 images
- SEO : meta, Open Graph, JSON-LD, blog
- Google Analytics + Google Ads (conversions)
- Stripe, Supabase, Vercel

---

## 1. Trafic (faire venir du monde)

### SEO
- **Mots-clés à viser** : "amazon product photo white background", "remove background amazon", "product photography amazon", "amazon photo requirements", "fond blanc amazon"
- **Blog** : tu as déjà des articles. Ajoute 1–2 par mois sur des requêtes longue traîne (ex. "amazon image size 2024", "white background fiverr vs ai")
- **Backlinks** : annuaires e-commerce, forums FBA (Reddit r/FulfillmentByAmazon), réponses sur Quora/Medium avec lien vers linkedshot.com
- **Schema** : tu as SoftwareApplication. Ajoute `FAQPage` sur la page d’accueil (déjà en place) et éventuellement `HowTo` pour "How to get Amazon-compliant product photos"

### Google Ads
- Campagnes **Search** sur : "amazon product photography", "white background product photo", "remove background for amazon"
- CPC souvent 1–5 € selon la concurrence. Budget test : 10–20 €/jour, mesurer coût par acquisition (CPA)
- **Remarketing** : pixel sur le site, cibler les visiteurs qui n’ont pas créé de compte ou pas acheté

### Réseaux
- **Facebook / LinkedIn** : cibler "Amazon seller", "FBA", "e-commerce". Posts avant/après + lien vers les 3 gratuites
- **Partenariats** : outils pour vendeurs Amazon (gestion stock, repricing), logiciels de création de fiches → proposer une intégration ou un lien "photos produit par LinkedShot"

---

## 2. Conversion (transformer les visiteurs en clients)

### Déjà fait / à garder
- Message clair : "Get your 3 free images — no credit card"
- Timer pendant le traitement FAL (~3 sec) pour rassurer
- Messages d’erreur compréhensibles si FAL échoue
- Copy "Powered by state-of-the-art AI" pour la confiance

### Idées en plus
- **1 image sans compte** : permettre 1 traitement anonyme (par IP / jour), puis "Inscrivez-vous pour télécharger et avoir 2 autres gratuites". Augmente le nombre d’inscriptions.
- **Témoignages vidéo** : 1–2 vendeurs Amazon qui montrent leur écran (avant/après, upload, téléchargement). À mettre en hero ou juste au-dessus du pricing.
- **Garantie** : "30-Day Money-Back" déjà en bas de page → la rappeler près des boutons "Get 50 images" / "Get 200 images".
- **Urgence légère** : ex. "3 free credits this month" ou "Limited free credits" (sans mentir : si tu limites vraiment le nombre de comptes gratuits par mois, c’est honnête).

---

## 3. FAL.AI – technique et positionnement

### Qualité
- Vérifier que la sortie est bien **#FFFFFF** (fond blanc pur). Si Bria renvoie du transparent, ajouter une étape (ex. avec Sharp) : composer l’image sur un fond blanc 1024×1024 avant de la stocker.
- Si FAL propose d’autres modèles (ex. "white background" ou "amazon"), tester et comparer la qualité perçue par les vendeurs.

### Fiabilité
- **FAL_KEY** bien configurée en prod (Vercel).
- En cas de rate limit ou 5xx FAL : retry 1–2 fois avec backoff, puis message clair à l’utilisateur ("Please try again in a few seconds").
- Optionnel : file d’attente (queue.fal.run) + webhook pour les gros volumes, pour éviter les timeouts.

### Positionnement
- Ne pas nécessairement dire "FAL" aux utilisateurs. "State-of-the-art AI", "Same tech used by top marketplaces" suffit.
- Si tu veux un badge "Powered by FAL" (si autorisé par FAL), tu peux l’ajouter en footer.

---

## 4. Offre et pricing

- **Gratuit** : 3 images = bon lead magnet. Garder "no credit card".
- **Starter 9€** : très bon prix d’entrée. Le mettre en avant ("Most popular" déjà sur Pro – tu peux tester "Best value" sur Starter pour pousser le premier paiement).
- **Pro 29€** : pour ceux qui ont beaucoup de produits. Message du type "200 images = moins de 0,15 €/image".

Idée optionnelle : **pack "Launch"** (ex. 20 images pour 5 €) pour les tout petits vendeurs, puis upsell vers 50 ou 200.

---

## 5. Métriques à suivre

- **Trafic** : sessions (GA) par source (organic, paid, direct).
- **Funnel** : visite → inscription (3 gratuites) → 1ère image traitée → achat Starter/Pro.
- **Coût** : CPA (coût par achat) en Ads, LTV (combien un client dépense sur 6–12 mois).
- **FAL** : nombre d’appels / jour, taux d’erreur (5xx), temps de réponse moyen.

Objectif : réduire le coût d’acquisition et augmenter le taux "visiteur → inscrit" puis "inscrit → payant".

---

## Résumé actions prioritaires

1. **SEO** : 1–2 articles blog ciblés "amazon product photo" / "white background", backlinks forums FBA.
2. **Ads** : lancer ou optimiser Google Search sur 3–5 mots-clés, budget test 10–20 €/jour, mesurer CPA.
3. **Conversion** : garder les 3 gratuites + sign-in clair ; envisager 1 image sans compte puis "Sign up to download".
4. **Technique** : s’assurer fond #FFFFFF (post-traitement si besoin), FAL_KEY en prod, messages d’erreur et timer déjà en place.
5. **Trust** : témoignage(s) vidéo ou citation avec photo, rappeler la garantie 30 jours près des boutons d’achat.

Tu as déjà l’API FAL, un bon pricing et une landing claire. Le levier principal reste le **trafic qualifié** (SEO + Ads) puis l’optimisation du **taux d’inscription et d’achat** avec les idées ci-dessus.
