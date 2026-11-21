# Landing Page Overrides

> **PROJECT:** Quick Commerce Cotonou
> **Page Type:** Landing / Marketing
> **Generated:** 2026-11-21 13:11:10 (ebauche du skill) — **contenu authoré et verifie 2026-11-21**
> **Master :** `design-system/quick-commerce-cotonou/MASTER.md`

> ⚠️ **PRECEDENCE.** Les regles de ce fichier **priment** sur le Master. Tout ce qui n'est pas
> liste ici releve du Master seul.

> 🔎 **Cette page est la page d'indexation.** Une regle ci-dessous (`## SEO et scroll reveal`)
> restreint volontairement le Motion du Master : elle est specifique a cette page et ne doit pas
> etre generalisee.

---

## Provenance — ce que l'ebauche generee contenait

`--page landing` produit le **meme stub generique** que `--page checkout` : les deux fichiers sont
identiques octet pour octet, hors titre, horodatage et `Page Type`. Aucune differenciation n'est
generee. Defauts corriges :

| Champ genere | Probleme | Corrige ci-dessous |
|---|---|---|
| `design-system/MASTER.md` | **Chemin casse** — le Master reel est `design-system/quick-commerce-cotonou/MASTER.md` | En-tete corrige |
| `Effects: Purposeful **admin** feedback` | **Fuite admin** sur une page 100 % publique et marchande | Feedback client + regles SEO |
| `Performance: Set appropriate cache headers` | Non specifie, et **a l'oppose** de ce qu'il faut ici : la landing doit etre mise en cache agressivement, le checkout jamais | `## Performance & Cache` |
| `Component Overrides → Avoid: No caching strategy` | **Erreur de categorie** : regle de performance rangee dans les composants | Reclassifie |
| `No unique components for this page` | Faux : champ de verification de zone, tuiles de categories, cartes produit, bloc « comment ca marche », bandeau de preuves | 6 composants specifiques |
| Spacing / Typography / Color : `No overrides` | Faux pour la couleur : le pattern de funnel du catalogue imposerait du **rouge**, en conflit avec `--destructive` | `## Color Overrides` |

---

## Composition du pattern — etayee par `landing.csv`

Le Master retient le pattern **`trust-authority-conversion`**. La lecture de sa ligne complete dans
`landing.csv` confirme le diagnostic pose dans `## Corrections verifiees` du Master :

- `Keywords` contient **`enterprise`** ;
- `Primary CTA Placement` = **« Contact Sales / Get Quote (primary) + Nav »** ;
- `Color Strategy` = **« Navy/Grey corporate »**, en contradiction avec la palette verte produite
  par le meme appel.

Ce pattern est structurellement B2B. Il est **conserve** uniquement pour ses exigences
d'accessibilite du carrousel (`Conversion Optimization` : pause/stop au focus, au survol et sous
`prefers-reduced-motion` ; controles precedent/suivant accessibles au clavier ; jeu de logos
statique sous `reduced motion`), qui restent pertinentes.

La structure de la page est composee a partir de **deux autres patterns du catalogue** :

### Structure primaire : `marketplace-directory` (landing.csv n° 22)

- `Section Order` : **Hero (Search focused) > Categories > Featured Listings > Trust/Safety > CTA**
- `Primary CTA Placement` : **Hero Search Bar** + Navbar
- `Color Strategy` : *Search: High contrast. Categories: Visual icons. Trust: Blue/Green.*
- `Recommended Effects` : **Search autocomplete animation**, card carousel
- `Conversion Optimization` : **« Search is the primary CTA. Reduce friction with useful
  suggestions. »**

> ✅ **Corroboration.** L'ordre de sections corrige dans le Master —
> *Saisie adresse / zone de livraison > Categories > Produits populaires > Comment ca marche >
> Preuves > CTA de rappel* — correspond presque terme a terme a `marketplace-directory`
> (Hero oriente recherche > Categories > Featured Listings > Trust/Safety > CTA).
> **La correction n'est donc pas une invention : elle existe deja dans le catalogue.**
> Le `Trust: Blue/Green` de ce pattern valide aussi la palette verte + bleue du Master.

### Bloc « Comment ca marche » : `funnel-3-step-conversion` (landing.csv n° 5)

- `Section Order` : Hero > Step 1 (problem) > Step 2 (solution) > Step 3 (action) > CTA progression
- `Primary CTA Placement` : *Each step: mini-CTA. Final: main CTA*
- `Conversion Optimization` : *Progressive disclosure. Show only essential info per step. Use
  progress indicators. Multiple CTAs.*
- `Recommended Effects` : *Step number animations, progress bar fill, step transitions smooth scroll*

Retenu pour le bloc pedagogique en 3 etapes, **a l'exclusion de sa strategie de couleur** — voir
ci-dessous.

---

## Color Overrides

⚠️ **La `Color Strategy` de `funnel-3-step-conversion` est REJETEE pour ce projet.**

Le catalogue indique : *« Step colors: 1 (Red/Problem), 2 (Orange/Process), 3 (Green/Solution) »*.

Appliquer cette regle ici creerait une **collision semantique** : dans notre palette,
`--destructive` (`#DC2626` light / `#F87171` dark) est reserve aux **erreurs** et aux actions
destructrices. Teinter l'etape 1 en rouge la ferait lire comme une erreur, sur une page dont le
seul but est de mettre en confiance.

**Regle retenue :** les trois etapes utilisent `--primary` (vert) pour l'etape active ou aboutie,
`--accent` (bleu) pour la mise en valeur, et `--muted-foreground` pour les etapes non actives.
Aucun usage de `--destructive` en dehors des messages d'erreur reels.

Autres regles de couleur specifiques :

- **Champ de verification de zone : contraste eleve.** `marketplace-directory` demande
  *« Search: High contrast »* — c'est le CTA primaire de la page. Utiliser `--card` (blanc) sur
  `--background` avec une bordure `--border-strong` (`#6B8F76`, 3.45:1) et un bouton `--primary`.
- **Tuiles de categories :** icônes en `--primary` sur fond `--muted`. Jamais d'illustration
  multicolore concurrente de la palette.
- **Bandeau de preuves :** bleu/vert conformement au `Trust: Blue/Green` du pattern — `--accent`
  pour les elements de reassurance (delais, securite), `--primary` pour les statistiques.
- **Un seul CTA primaire par viewport.** Les CTA secondaires sont en `.btn-outline`.

---

## Layout Overrides

- **Hero :** pleine largeur, contenu contraint a `1200px` (valeur du stub, **conservee** : elle est
  correcte pour une page marketing, contrairement au checkout).
- **Padding du hero :** `--space-3xl` (64px) desktop, `--space-2xl` (48px) mobile — conformement a
  la table d'espacement du Master (density 7/10).
- **Le champ de verification de zone est au-dessus de la ligne de flottaison**, dans le hero.
  C'est le CTA primaire : `marketplace-directory` place la recherche dans le hero, et notre
  equivalent fonctionnel est la verification de zone.
- **Navbar sticky** avec : logo, lien « Comment ca marche », et CTA « Commander ».
  Panier visible en permanence (contrainte du Master).
- **Barre CTA collante en bas d'ecran sur mobile** (< 768px) : montant ou delai + « Commander ».
- **Une colonne sous 640px**, deux colonnes a partir de 768px pour les grilles de produits.

---

## Density Overrides

Aucun ecart d'echelle — les tokens `--space-*` du Master s'appliquent.

La documentation du skill indique que `--density` se regle **haut pour un dashboard, bas pour une
page marketing**. Le Master est a `7/10 (Standard)`, un compromis pour l'ensemble du projet.
Sur cette page, utiliser le **haut de l'echelle existante** plutot que de regenerer des tokens :

- `--space-3xl` (64px) entre les sections desktop ; `--space-2xl` (48px) mobile.
- `--space-xl` (32px) a l'interieur d'une carte produit.
- **Ne pas** resserrer sous `--space-md` (16px) entre deux blocs de texte.

> Si une echelle marketing dediee devient necessaire, la generer dans un fichier separe avec
> `--density 4` — **ne pas regenerer le Master**, qui est corrige et annote a la main.

---

## Composants specifiques a cette page

### 1. Champ « Verifier ma zone de livraison » — CTA primaire

> *UX — Search, severite **Medium** : DO « Show predictions as user types ».*
> *UX — Search, severite **Medium** : DO « Show 'No results' with suggestions ».*
> *`marketplace-directory` : « Search is the primary CTA. Reduce friction with useful
> suggestions. » + « Search autocomplete animation ».*

- `<label for>` **visible** (guideline UX High : *« Always show label above or beside input »*,
  DON'T *« Placeholder as only label »*). Le placeholder est un exemple : `ex. Calavi, Zogbadjè…`.
- **Suggestions pendant la frappe** : quartiers de Cotonou, Abomey-Calavi, Sèmè-Podji.
  `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, navigation fleches
  haut/bas, `Echap` pour fermer.
- **Si la zone n'est pas desservie :** message explicite + **suggestions** — never un ecran vide.
  Proposer l'inscription a une liste d'attente et le retrait sur place.
  > *UX — Feedback, severite **Medium** : DO « Show helpful message and action » ;
  > DON'T « Blank empty screens ».*
- Bordure `--border-strong`, focus en anneau plein 2px (corrections du Master).
- Hauteur **48px minimum** (`--tap-target`), bouton attenante de meme hauteur.
- **Pas de code postal** : ville + quartier + repere (contrainte locale du Master).

### 2. Tuiles de categories

- Grille : 2 colonnes mobile, 4 colonnes ≥ 768px.
- **Icône SVG** (Lucide ou Heroicons) en `--primary` sur fond `--muted`. Jamais d'emoji
  (anti-pattern Master), jamais d'illustration photographique lourde.
- Carte **≥ 48px** de haut, ecart **8px** minimum (`--tap-gap`).
- Libelle court, une ligne, **sans troncature**. Regle projet, appuyee sur deux items reels de la
  checklist du Master : « No horizontal scroll on mobile » et
  « Responsive: 375px, 768px, 1024px, 1440px ». Un libelle tronque ou replie sur une tuile de
  2 colonnes a 375px fait echouer ces deux items.
- Categories attendues : Epicerie, Pharmacie & sante, Boissons, Hygiene & entretien,
  Produits frais, Maison.

### 3. Cartes produit (Featured Listings)

- Grille 2 colonnes mobile, 3 a 4 colonnes desktop.
- **Image via `next/image`** avec `sizes` correct, AVIF/WebP, `placeholder="blur"`.
  > *UX — Performance, severite **Medium** : DO « Lazy load below-fold images and content » ;
  > DON'T « Load everything upfront ».*
  Seule l'image du hero est chargee en priorite (`priority`), tout le reste en lazy.
- Prix en **`1 500 FCFA`** — espace fine insecable, jamais `€` ni `$` (Master).
- **Etat de stock explicite.** La base du skill ne couvre pas ce cas (voir `## Non couverts`) :
  regle generale retenue — un produit indisponible est **visiblement** marque, reste dans la liste,
  avec son bouton desactive (`aria-disabled`) et un libelle « Indisponible ». Ne jamais le retirer
  silencieusement.
- Bordure `--border` (decoratif) au repos, `--border-strong` au survol : Flat Design, pas d'ombre.

### 4. Bloc « Comment ca marche » — 3 etapes

Structure de `funnel-3-step-conversion`, **sans** sa strategie de couleur rouge/orange/verte
(rejetee, voir `## Color Overrides`).

1. **Verifiez votre zone** — saisie du quartier
2. **Composez votre panier** — epicerie et pharmacie
3. **Recevez chez vous** — paiement mobile money ou a la livraison

- *Progressive disclosure* et *essential info per step* : une phrase par etape, pas un paragraphe.
- Numeros d'etapes en `--primary`, pas d'animation de compteur lourde (Motion 3/10).
- **Mini-CTA a chaque etape** vers la section correspondante, CTA principal en fin de bloc
  (`Each step: mini-CTA. Final: main CTA`).
- Sur mobile : les trois etapes s'empilent, jamais de carrousel d'etapes.

### 5. Bandeau de preuves (Trust/Safety)

- **Delai de livraison moyen**, **frais de livraison**, **zones desservies**, **moyens de paiement
  acceptes** — affiches ici, **avant** le tunnel d'achat (contrainte de confiance du Master).
- **Logos des operateurs mobile money en SVG** : MTN MoMo, Moov Money (Flooz), Wave.
  Jamais en emoji, jamais en texte seul.
- Avis clients avec note et quartier, pas seulement un prenom.
- **Carrousel : a éviter ici.** Le Master et `trust-authority-conversion` exigent, si un carrousel
  est utilise : pause/stop au focus, au survol et sous `prefers-reduced-motion` ; controles
  precedent/suivant accessibles au clavier ; rendu statique sous `reduced motion`.
  La contrainte locale du Master (*« pas de carrousel lourd »*) et le style `cost:low` imposent
  plutot une **rangee de logos statique**. C'est le choix retenu.
- Si des compteurs animes sont utilises (`stat counters` du pattern) : ils doivent rendre leur
  valeur finale immediatement sous `prefers-reduced-motion`.

### 6. CTA de rappel + WhatsApp

- Bouton `.btn-primary` « Commander », montant ou delai a proximite.
- **WhatsApp visible** : icône officielle SVG, lien `wa.me/229XXXXXXXX`. Canal dominant localement
  (Master). Doit rester accessible au clavier et annoncer un libelle explicite
  (« Contacter sur WhatsApp »), pas seulement une icône.

---

## SEO et scroll reveal

⚠️ **Restriction specifique a cette page, qui prime sur la section Motion du Master.**

Le Master fournit un scroll reveal GSAP (`opacity: 0` → `1`, 300-400 ms) et avertit deja :
*« Don't reveal below-the-fold content needed for SEO/crawlers as invisible-by-default without a
no-JS fallback. »*

Cette page **est** la page d'indexation. Regles :

- **Aucun contenu indexable ne doit debuter a `opacity: 0`** sans repli fonctionnel sans JS.
- Le reveal est applique **uniquement** aux blocs decoratifs ou d'accompagnement, jamais aux
  titres de section, aux noms de produits, aux prix ni aux liens de categorie.
- Preferer un reveal **CSS pur** (`@media (prefers-reduced-motion: no-preference)` +
  `animation-timeline` ou classes d'intersection) a GSAP sur cette page : moins de JS, meilleur
  LCP, et le contenu est visible par defaut si le script echoue.
- Sous `prefers-reduced-motion: reduce`, **etat final immediat** — deja impose par le `@layer base`
  de `globals.css`.
- Titre `h1` unique et reel, `lang="fr"`, meta description, et **donnees structurees** `Product` /
  `Offer` avec `priceCurrency: "XOF"` sur les cartes produit.
- Rendu **statique ou ISR** : le contenu marchand doit etre dans le HTML, pas hydrate cote client.

---

## Performance & Cache

> ⚠️ **A l'oppose exact du checkout.** `pages/checkout.md` impose `no-store` ; cette page doit etre
> mise en cache agressivement. Le stub generique disait `Set appropriate cache headers` sans
> distinguer — c'est precisement l'erreur que cette section leve.

- **Rendu statique ou ISR** (`revalidate` court, par exemple 60 s) sur la landing.
  Cache CDN actif. Le checkout reste `no-store`.
- **LCP = le champ de verification de zone ou le titre du hero**, pas une image. Aucune image
  pleine largeur bloquante au-dessus de la ligne de flottaison.
- **Polices self-hosted via `next/font`** (guideline `nextjs` : « Use next/font »,
  *« Don't: External font links »*), `display: swap`, deux familles maximum, `preload` sur les
  graisses reellement utilisees (Rubik 500/600/700, Nunito Sans 400/600).
- **Aucune librairie d'animation sur cette page.** Le style est `cost:low | drivers:none` ; GSAP +
  ScrollTrigger represente un poids inutile ici. Voir `## SEO et scroll reveal`.
- **Pas de video autoplay**, pas de fond anime (contrainte locale : reseau 3G/4G instable).
- Images produit en AVIF/WebP avec `sizes` explicite — jamais d'image pleine resolution servie sur
  mobile.
- **Budget JS — CORRIGE apres mesure.** L'objectif initialement pose ici
  (« JS < 100 Ko gzip sur cette route ») est **inatteignable avec cette stack** : le socle
  Next.js App Router pese a lui seul **103 Ko** de First Load JS partage (mesure au build).
  Budget retenu a la place : **First Load JS <= 130 Ko** sur cette route, soit <= 27 Ko
  imputables a l'application.
  **Mesure reelle au build : 116 Ko First Load, dont 4,84 Ko de JS de page → ~13 Ko
  imputables a l'application.** Budget respecte avec de la marge.
- **Polices — mesure reelle.** 2 familles variables self-hosted via `@fontsource-variable`,
  11 fichiers woff2 declares avec `unicode-range`, tous servis en `200 font/woff2`.
  Pour du francais le navigateur ne telecharge que 4 fichiers :
  `rubik-latin` 35 348 o + `rubik-latin-ext` 19 400 o + `nunito-sans-latin` 31 076 o +
  `nunito-sans-latin-ext` 27 908 o = **113 732 o (111 Ko)**.
  Les subsets arabe, cyrillique, hebreu et vietnamien ne sont jamais telecharges : les 248 Ko
  de woff2 presents dans le build sont des artefacts, pas du poids runtime.
- **LCP < 2,5 s** en 4G degradee reste l'objectif ; le LCP doit etre le titre du hero ou le champ
  de verification de zone, pas une image.

---

## Anti-Patterns specifiques a cette page

S'ajoutent a ceux du Master :

- ❌ **Contenu indexable a `opacity: 0`** sans repli sans JS.
- ❌ **GSAP / ScrollTrigger sur la landing** — CSS pur suffit, le poids est injustifie.
- ❌ **Video autoplay ou fond anime.**
- ❌ **Carrousel de logos** — rangee statique.
- ❌ **Rouge pour l'etape 1** du bloc « comment ca marche » (collision avec `--destructive`).
- ❌ **Champ de zone sous la ligne de flottaison** — c'est le CTA primaire.
- ❌ **Code postal obligatoire** dans le champ de zone.
- ❌ **Prix en `€` ou `$`**, ou sans espace fine insecable.
- ❌ **Emoji en guise d'icône** de categorie ou de moyen de paiement.
- ❌ **Produit indisponible retire silencieusement** de la grille.
- ❌ **`no-store` sur cette route** (erreur de report depuis le checkout).
- ❌ **Images non lazy** sous la ligne de flottaison.

---

## Checklist pre-livraison — specifique landing

Etend la checklist du Master, ne la remplace pas.

- [ ] Champ « Verifier ma zone » au-dessus de la ligne de flottaison, `<label>` visible
- [ ] Suggestions pendant la frappe, `role="combobox"` complet, navigation fleches + `Echap`
- [ ] Zone non desservie : message explicite **et** action de repli, jamais d'ecran vide
- [ ] Ordre de sections : zone > categories > produits populaires > comment ca marche > preuves > CTA
- [ ] Un seul `h1`, `lang="fr"`, donnees structurees `Product`/`Offer` en `XOF`
- [ ] Aucun contenu indexable a `opacity: 0` ; reveal en CSS pur, decoratif uniquement
- [ ] `prefers-reduced-motion` : etat final immediat, compteurs figes
- [ ] 4 tuiles de categories mobile / 4+ desktop, icônes SVG, libelles non tronques
- [ ] Cartes produit : `next/image` + `sizes` + AVIF/WebP, hero seul en `priority`, reste lazy
- [ ] Prix au format `1 500 FCFA`
- [ ] Produits indisponibles marques visiblement, bouton `aria-disabled`, jamais retires
- [ ] Bloc 3 etapes : une phrase par etape, mini-CTA par etape, CTA principal en fin
- [ ] Aucune etape teintee en rouge
- [ ] Bandeau de preuves : delai, frais, zones, moyens de paiement — avant le tunnel
- [ ] Logos operateurs en SVG officiels, rangee statique (pas de carrousel)
- [ ] WhatsApp accessible au clavier avec libelle explicite
- [ ] Navbar sticky + CTA ; barre collante mobile < 768px
- [ ] Route en statique ou ISR, cache CDN actif, **pas** de `no-store`
- [ ] Polices self-hosted (`next/font` ou `@fontsource-variable`), `display: swap`, aucune
      requete externe, graisses prechargees limitees a l'utile
- [ ] Aucune librairie d'animation, aucune video autoplay
- [ ] First Load JS <= 130 Ko (socle Next ~103 Ko inclus) — mesure au build : 116 Ko
- [ ] Polices : 4 woff2 latin/latin-ext seulement, ~111 Ko
- [ ] LCP < 2,5 s en 4G degradee
- [ ] Responsive verifie : 375 / 768 / 1024 / 1440 px, aucun scroll horizontal sur mobile

---

## Non couverts par la base de donnees

Conformite a la regle du skill : *« If the retry still fails, state that no verified match was
found and use clearly labeled general guidance instead. »*

| Sujet | Requetes tentees | Resultat |
|---|---|---|
| Etat de stock / indisponibilite | `out of stock unavailable product`, puis `product unavailable stock status` | **Hors sujet** les deux fois (etats de chargement, badge panier, hierarchie typographique) |
| Achat sans compte | `guest checkout account creation`, `sign in registration account login` | **0 resultat** les deux fois |
| Choix du mode de livraison | `delivery shipping options selector`, `shipping method delivery time selection` | **0 resultat** les deux fois |
| Code promo | `promo code discount coupon` | **Faux positif** : a retourne une guideline de *code splitting*, le mot « code » ayant matche hors contexte. Non retenue. |

> **Guidance generale, explicitement NON issue de la base :** les regles d'etat de stock, de
> retrait silencieux et d'achat sans compte donnees plus haut sont des pratiques standard du
> commerce en ligne, pas des recommandations du skill. A valider par l'equipe produit.
