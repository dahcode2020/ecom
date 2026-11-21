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
- **CSS — mesure reelle, et un defaut corrige.** Tailwind v4 detecte automatiquement les classes
  dans toute la racine du projet. Sans exclusion, il aspirait aussi `.agents/` — les donnees et la
  documentation du skill ui-ux-pro-max. Constat mesure : `dark:scale-0`, present uniquement dans
  `.agents/skills/ui-styling/references/shadcn-theming.md`, etait compile dans la CSS servie, alors
  que `app/`, `components/` et `lib/` n'utilisent **aucune** variante `dark:`.
  Correction dans `app/globals.css` : `@source not "../.agents"` et `@source not "../design-system"`.
  **CSS passee de 59 910 o a 30 171 o, soit -49,6 %.** Gain direct sur la contrainte bas debit.
- **Variante `dark:` alignee sur la strategie par classe.** Par defaut Tailwind fait repondre
  `dark:` a `@media (prefers-color-scheme: dark)`, alors que ce projet bascule par CLASSE
  (`.dark` sur `<html>`). `@custom-variant dark (&:where(.dark, .dark *));` est declare dans
  `app/globals.css` pour que toute future classe `dark:...` suive la bascule utilisateur.
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
- [ ] Cartes produit : `next/image` + `sizes` + AVIF/WebP — **hero NON prioritaire** (voir
      l'amendement IMAGES en fin de fichier : `priority` couterait ~24 Ko sur mobile ou le
      visuel est sous la ligne de flottaison, et le LCP doit rester le titre)
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


---

# AMENDEMENT — direction visuelle « Bento éditorial premium »

Ajouté après livraison d'une première version jugée **basique**, à juste titre. Diagnostic mesuré
de cette première version, qui explique le verdict :

| Manque | Mesure |
|---|---|
| Motion expressive | **0 `@keyframes`** dans tout le design system |
| Animations | 4 occurrences, toutes `animate-spin` / `animate-pulse` = spinners fonctionnels |
| Transitions | 5 au total |
| Impact typographique | h1 majoritairement en `text-3xl` (30 px), `text-5xl` utilisé **une fois** |
| Imagerie | aucune ; chaque produit = carré plat + 1 icône |
| Asymétrie | aucune ; sections empilées uniformément |

Trois causes : `--variance` jamais utilisé (le Master note qu'il pousse vers *Minimalism & Swiss*,
donc plus minimal encore), le Flat Design décliné en règle « aucun dégradé, aucune ombre », et
l'absence d'images traitée comme une fatalité technique alors que c'était le **premier** facteur du
rendu wireframe.

## Styles retenus (catalogue `styles.csv`, 88 entrées)

Combinés, tous `cost:low` et Mobile `adaptable`/`nativ` :

| Style | Complexité | Perf | A11y | Mobile | Conversion |
|---|---|---|---|---|---|
| Bento Box Grid | Low | cost:low | risk:low | adaptable | High |
| Hero-Centric Design | Medium | cost:low | risk:low | native | **Very High** |
| Bold Typography (Mobile Poster) | Medium | cost:low | risk:conditional | native | High |
| Micro-interactions | Medium | cost:low | risk:low | adaptable | High |

**Écartés avec la raison lue dans leur colonne « Do Not Use For »** — pas par goût :
Neubrutalism, Claymorphism, Vibrant & Block-based (*healthcare*, or il y a un rayon pharmacie sous
ordonnance) ; Aurora UI / Gradient Mesh (*critical accessibility, content-heavy*) ; Swiss Modernism
2.0 et Exaggerated Minimalism (*plus minimal encore, l'inverse de la demande*) ; 3D &
Hyperrealism, Skeuomorphism, Parallax Storytelling (*cost:high*, interdit sur la cible 3G/4G).

Le **Flat Design n'est pas abandonné** : il reste la base (aplats, pas de flou, séparation par fond
et bordure). Ce qui change est l'ossature — grille asymétrique, échelle typographique affirmée,
profondeur par couches, mouvement.

**Deux règles du Master sont amendées, et c'est assumé :**
1. *Correction n°7* (ombres réservées aux calques flottants) : Bento demande « Shadows subtle ».
   Une ombre très légère est autorisée **uniquement au survol** des tuiles bento. Au repos la
   séparation reste assurée par fond + bordure : l'intention de la règle est préservée.
2. Le LCP n'est plus nécessairement le titre : voir IMAGES ci-dessous.

## Typographie

`.display` = `clamp(2.25rem, 1.4rem + 4.2vw, 4.25rem)`, graisse 800, `line-height: 1.03`,
`letter-spacing: -0.03em`, `text-wrap: balance`. Ratio h1/corps ≈ 4,3× à 68 px pour un corps de
16 px — la checklist du style exige « at least 4–5× ».

Sur 375 px le clamp retombe à ~36 px, soit 2,25× : **en dessous de la cible du style,
volontairement**. « Text bleeds to/over screen edges » est un code d'affiche ; appliqué à un titre
de 8 mots il ferait déborder la ligne, ce que ce même style interdit par ailleurs. La contrainte
« No horizontal scroll on mobile » du Master prime.

`.display-sm` (titres de section), `.lede` (accroches, `text-wrap: pretty` pour éviter les veuves)
et `.stat` (chiffres mis en avant) complètent l'échelle.

## IMAGES — poids mesurés sur le serveur, pas estimés

4 visuels générés dans `public/img/`, servis par l'optimiseur Next (`sharp` présent, vérifié).

| Format / largeur | hero | livraison | frais | pharmacie | **Total** |
|---|---|---|---|---|---|
| JPEG source | 213,7 Ko | 194,3 Ko | 204,0 Ko | 88,0 Ko | **704 Ko** |
| AVIF 640w | 24,5 Ko | 17,2 Ko | 16,5 Ko | 6,2 Ko | **64,3 Ko** |
| WebP 640w | 45,0 Ko | 32,1 Ko | 31,0 Ko | 9,4 Ko | **117,5 Ko** |
| AVIF 1024w | 60,0 Ko | 32,8 Ko | 34,2 Ko | 11,3 Ko | **138,3 Ko** |

**Estimation fausse corrigée.** Un test `sharp` isolé annonçait 116,9 Ko d'AVIF et 114,8 Ko de
WebP à 640w — WebP semblait gagnant. Faux en conditions réelles : les réglages d'encodeur AVIF par
défaut de `sharp` (`effort` bas, compression rapide) ne sont pas ceux de l'optimiseur Next, qui
compresse ~1,8× mieux. **Leçon : ne jamais extrapoler un budget d'octets d'un outil de conversion
à un autre ; mesurer sur le serveur qui servira réellement les octets.**

**Décision `priority` — l'inverse de ce que disait la checklist ci-dessus.** Le hero n'est PAS en
`priority`. Sur mobile (cible déclarée du projet) cette tuile est sous la ligne de flottaison :
`priority` y préchargerait ~24 Ko inutilement, et le LCP redeviendrait l'image. Sans `priority`,
`loading="lazy"` ne diffère que le hors-écran : sur desktop, où le visuel est visible, il se charge
immédiatement. Le LCP reste donc le titre du hero sur mobile, conformément à la règle d'origine.

Les 3 visuels de la vitrine sont sous la ligne de flottaison : aucun effet sur le LCP.

**Voile de contraste sur image — alpha 0.72 minimum, valeur calculée.** Ce n'est pas décoratif :

| Configuration | Ratio (pire cas, image blanche derrière) |
|---|---|
| blanc sur voile 0.55 | 4,00:1 — **insuffisant** |
| blanc sur voile 0.65 | 5,58:1 — AA |
| blanc sur voile 0.72 | **7,15:1 — AAA** |
| blanc sur voile 0.80 | 9,57:1 — AAA |
| secondaire `#BBF7D0` sur voile 0.72 | 5,90:1 — AA |

Descendre sous 0,65 fait passer sous 4,5:1 dès qu'une zone claire de l'image se trouve derrière le
texte. La valeur est issue du calcul, pas d'un choix à l'œil.

## Tuile inversée — tokens dédiés, accents vérifiés

Fond = `--foreground`, texte = `--background` : l'inversion suit automatiquement le thème. **Mais
les accents ne peuvent pas suivre**, et c'est mesuré :

| Sur fond inversé clair `#14532D` | Ratio | Verdict |
|---|---|---|
| `--secondary` `#22C55E` | 4,00:1 | insuffisant pour du texte |
| `--accent` `#0369A1` | 1,54:1 | interdit |
| `--primary` `#15803D` | 1,82:1 | un bouton primaire y serait quasi invisible |
| texte `#F0FDF4` | 8,70:1 | AAA |
| secondaire `#BBF7D0` | 7,52:1 | AAA |
| accent dédié `#86EFAC` | 6,49:1 | AA |

En mode sombre le fond inversé devient clair (`#E8F5EC`) : texte `#0C1A12` 15,96:1, secondaire
`#1F5C3A` 7,06:1, accent `#166534` 6,35:1 — tandis que `--primary` `#22C55E` n'y donnerait que
2,94:1. D'où les tokens `--inverted-*` distincts, et les variantes `.btn-inverted` /
`.btn-inverted-ghost` : un `.btn-primary` classique sur cette tuile serait illisible.

## Motion — 17 recettes de `motion.csv`, appliquées sans GSAP

GSAP reste écarté (~70 Ko). Les durées et courbes des recettes sont portées par des tokens CSS,
chaque token citant sa recette d'origine :

| Token | Recette | Durée | Courbe GSAP → `cubic-bezier` |
|---|---|---|---|
| `--dur-micro` / `--ease-power1-out` | 1 Hover [Subtle] | 180 ms | `power1.out` → `(0.25,0.46,0.45,0.94)` |
| `--dur-hover` / `--ease-power2-out` | 2 Hover [Standard] | 260 ms | `power2.out` → `(0.215,0.61,0.355,1)` |
| `--dur-stagger` / `--ease-back-out` | 8 Stagger [Standard] | 380 ms | `back.out(1.4)` → `(0.34,1.56,0.64,1)` |
| `--stagger-step` | 7 Stagger [Subtle] | 30 ms/élément | — |
| `--reveal-offset` | 4 Scroll Reveal [Subtle] | — | y 12 px (fourchette 8–16 px) |
| `--dur-shimmer` / `--ease-sine-in-out` | 15 Skeleton | 1 400 ms | `sine.inOut` → `(0.445,0.05,0.55,0.95)` |
| `--dur-route` / `--ease-power1-in-out` | 10 Page Transition | 240 ms | `power1.inOut` → `(0.45,0,0.55,1)` |

Garde-fous des recettes, respectés et vérifiables dans le code :
- **4 DON'T** — pas de contenu indexable masqué *sans repli no-JS*. Quatre replis : l'état masqué
  vit dans `.js [data-reveal]` (classe posée par le script bloquant) ; un `<noscript>` remet
  `opacity: 1` en `!important` ; `prefers-reduced-motion: reduce` neutralise tout **y compris
  l'état final** ; côté client, `IntersectionObserver` absent ⇒ tout est révélé.
- **5 DON'T** — stagger plafonné à 8 rangs (`MAX_STAGGER_RANK`), au-delà les derniers éléments
  paraissent traîner.
- **7 DO** — délai par élément 20–40 ms : `--stagger-step` vaut 30 ms.
- **8 DON'T** — « Don't use back.out on dense data tables » : l'overshoot est réservé aux tuiles
  bento de la landing, **jamais** à la grille du catalogue (30 produits, UI informationnelle).
- **1 DO** — déplacement < 2 px : `translateY(-1px)` au survol des boutons.
- **2 DO** — tween de retour apparié : en CSS `:hover`/`:not(:hover)` est symétrique par
  construction, donc rien ne reste collé si le pointeur sort vite.
- **15 DO** — balayage de `background-position`, pas un fondu d'opacité.
- **13 DON'T** — jamais de parallaxe sur du texte courant (aucune parallaxe ici).
- **17** — pas d'auto-rotation : aucun carrousel automatique, conformément à ce fichier.

`@media (hover: hover)` garde chaque effet de survol : sans cela un tap mobile laisserait l'état
survol collé sur la tuile.

## Illustrations SVG

Deux niveaux, pour deux usages différents :
- **6 scènes par rayon** (`Illustration`) : compositions dessinées (sac de riz + bouteille +
  pâtes, flacon + plaquette, ananas tréillissé + tomate…). ~1 Ko chacune, utilisées là où une
  scène se justifie.
- **`ProductArtBackdrop`** pour les 30 tuiles produit : le même langage graphique en couche de
  fond, l'icône propre au produit restant par-dessus. Les 6 scènes seules auraient fait partager la
  même illustration à 7 produits d'épicerie — remplacer une répétition par une autre.

Une variante `foreignObject` enveloppant l'icône dans le SVG a été écrite puis **abandonnée** :
rendu irrégulier dans Safari, exigence `xmlns` supplémentaire, et aucun apport face à un simple
`position: absolute`.

**Couleurs par variables** (`var(--primary)`, `var(--accent)`…), jamais en hex codé en dur : les
illustrations basculent donc automatiquement en mode sombre. Des hex fixes resteraient clairs sur
fond sombre — le même défaut que `color-scheme` corrigeait pour les contrôles natifs.

**Accessibilité** : `aria-label` et non `aria-labelledby` + `<title id>`. La landing affiche chaque
rayon deux fois (`Categories()` et `CategorySections()`), donc un id dérivé du nom serait dupliqué
et `aria-labelledby` résoudrait vers le premier. `useId` aurait réglé le cas mais sa disponibilité
en Server Component n'est pas garantie ; `aria-label` est déterministe.

---

## AMENDEMENT — matériau « Liquid Glass » (chrome uniquement)

Demande : « se servir de ce skill et rendre le style liquid glass au site », avec la librairie
[`rdev/liquid-glass-react`](https://github.com/rdev/liquid-glass-react). Les deux ont été
utilisés : la librairie pour l'effet, et la fiche `Liquid Glass` de `styles.csv` pour en borner
l'usage.

### Ce que la fiche du style impose — et ce qu'elle interdit

| Rubrique de `styles.csv` | Valeur | Conséquence ici |
|---|---|---|
| Best For | « Apple-platform **navigation, controls**, and system-aligned **app chrome** » | Le verre va sur l'en-tête, la barre CTA mobile, le panneau de vérification de zone |
| **Do Not Use For** | « **content layers, dense reading surfaces**, or custom effects without accessibility fallbacks » | **Exclut** la grille de 30 tuiles du catalogue, les tuiles produit, les étapes de `/suivi`, les champs de saisie |
| Performance | `cost:moderate \| drivers: animation, blur` | Le verre n'est pas gratuit : d'où le chunk lazy et le refus du `feDisplacementMap` sur une barre pleine largeur |
| Accessibility | `risk:conditional \| requires: contrast-text-4.5, keyboard, visible-focus, reduced-motion` | Quatre garde-fous implémentés, dont `prefers-reduced-transparency` |
| Checklist | « Keep content on a separate layer », « Apply color judiciously », « Test reduced transparency » | La teinte `--glass-tint` **est** cette couche séparée ; aberration chromatique à 1 |

### Le piège central : le verre seul ne garantit aucun contraste

Un fond translucide laisse voir ce qui est dessous. Le texte de l'en-tête survole, au scroll, la
tuile inversée du hero (`#14532D`), des photos voilées et le fond clair. Mesure du texte
`--foreground` sur une teinte blanche posée sur le verre, pour **chacun** de ces fonds :

| alpha de la teinte | pire cas (5 fonds) | verdict |
|---|---|---|
| **0.00 — verre pur** | **1.00:1** | texte **invisible** au-dessus du hero inversé |
| 0.55 | 3.09:1 | insuffisant |
| 0.65 | 4.09:1 | insuffisant |
| **0.72** | **4.90:1** | AA — **plancher absolu** |
| **0.78** | **5.66:1** | AA confortable — **RETENU** |
| 0.85 | 6.65:1 | AA |

En mode sombre (texte `#E8F5EC`, teinte `#12241A`) : 0.72 → 6.09:1, **0.78 → 7.41:1**, le pire cas
étant là encore la tuile inversée, claire en sombre. `0.78` est donc retenu dans les deux modes.
**Ne jamais descendre sous 0.72** : le 4,5:1 casse dès qu'un fond sombre passe sous la barre.

C'est la mise en œuvre de « Keep content on a separate layer » : le contenu repose sur cette
teinte, pas sur le verre. La fiche Glassmorphism, plus permissive, propose « translucent white
15-30 % » — **inapplicable ici**, car 15-30 % donne un pire cas très inférieur à 4,5:1 sur nos
fonds sombres. La référence utile est le calcul du voile sur image : 0.72 y était déjà le plancher.

### Deux implémentations, selon la taille de la surface

**`.glass-chrome` (CSS seule)** — en-tête collant, donc grande surface **permanente** :
`backdrop-filter: blur(8px) saturate(160%)` + `-webkit-backdrop-filter` (obligatoire pour Safari).
La librairie ajoute un `feDisplacementMap` et un `feColorMatrix` ; sur une barre pleine largeur
toujours visible, ces filtres SVG sont recomposés **à chaque image pendant le scroll** — exactement
le `cost:moderate | drivers: blur` que la fiche signale. De plus la librairie rend en
`display:inline-flex`, ce qui se bat avec une barre pleine largeur. Enfin, son propre README
avertit que « Safari and Firefox only partially support the effect (displacement will not be
visible) » : sur ces navigateurs les deux approches se ressemblent, donc le déplacement ne vaut pas
son coût sur une grande surface.

**`<GlassSurface>` (librairie React)** — barre CTA mobile et panneau de vérification de zone, deux
éléments **contenus et flottants**, au-dessus de contenu qui défile : là, le lensing et le
« liquid feel » d'Apple ont du sens. Paramètres volontairement modestes (`blurAmount 0.08` → 6,6 px
réels, `saturation 150`, `aberrationIntensity 1`, `elasticity 0.2`, `mode standard` et non `shader`
qui génère une carte de déplacement au runtime).

### Les quatre garde-fous (checklist du style)

1. **Crash SSR évité.** La librairie lit `navigator.userAgent` **directement dans le corps du
   rendu** (`src/index.tsx:180`, `const isFirefox = …`), sans garde `typeof navigator` ni
   `useEffect`. Rendue côté serveur par l'App Router, elle lèverait `ReferenceError: navigator is
   not defined`. Elle n'est donc **jamais importée au niveau module** : seul un `import()` dans un
   `useEffect` la charge. Le paquet publié ne porte d'ailleurs **aucune directive `'use client'`**
   (vérifié sur `dist/index.esm.js`) — `components/glass-surface.tsx` la porte.
2. **Budget JS.** `dist/index.esm.js` pèse **34 454 o gzip** (62 Ko brut). Le budget First Load est
   de 130 Ko et la landing était à 123 Ko : l'importer dans le chunk partagé l'aurait portée à
   ~157 Ko, soit **21 % de dépassement**. Mesuré après intégration : **124 Ko First Load**, chunk
   verre **32,3 Ko gzip** chargé après l'hydratation, **absent du HTML prérendu** (0 occurrence
   parmi les 8 chunks référencés). Il n'est téléchargé que si le verre est réellement applicable.
3. **`prefers-reduced-transparency: reduce`** — distinct de `prefers-reduced-motion` et trop souvent
   oublié : c'est le motif principal d'échec d'accessibilité du glassmorphism. Il désactive le flou
   et repasse en surface pleine `var(--card)`. `prefers-reduced-motion: reduce` met `elasticity` à
   `0` : le matériau reste, seule la déformation au survol disparaît.
4. **Repli sans `backdrop-filter`** — `@supports not (…)` en CSS, et `CSS.supports()` côté JS :
   un navigateur ancien obtient une surface pleine, jamais du texte sur un fond non flouté au
   contraste non garanti. `color-mix()` reste proscrit (mêmes raisons que pour le bento).

`next/dynamic` n'est **pas** utilisé, volontairement : son état `loading` rendrait `null` le temps
de charger le chunk, donc le contenu disparaîtrait une frame. Ici les enfants sont rendus en
permanence, dans l'une **ou** l'autre branche, jamais en double (pas d'`id` ni d'ARIA dupliqués —
le piège déjà rencontré avec `aria-labelledby`).

### Rendu serveur = repli solide, toujours

Le HTML servi ne contient **aucun** filtre SVG de la librairie : le premier paint est le repli
solide, puis le verre s'applique après détection. `capability` est `null` au premier rendu, côté
serveur comme client, donc **le HTML est identique et il n'y a aucune erreur d'hydratation**. Le
contenu ne dépend jamais de la réussite de l'`import()` : un échec réseau laisse le repli solide.

### Ce qui n'a PAS été mis en verre (décision assumée)

La grille du catalogue (30 tuiles), les tuiles produit, les étapes et le schéma de `/suivi`, les
champs `.input` (un champ translucide rend curseur et texte imprévisibles), et `/checkout`
(entonnoir de conversion : le matériau y ajouterait du bruit sans rien servir). Toutes ces surfaces
sont des *content layers* ou des *dense reading surfaces* — explicitement dans la colonne
« Do Not Use For » de la fiche.

### Coût mesuré de l'amendement

| Mesure | Avant | Après | Δ |
|---|---|---|---|
| First Load JS `/` | 123 Ko | **124 Ko** | +1 Ko (budget 130 Ko) |
| CSS brute | 41 460 o | 42 023 o | +563 o |
| CSS **gzip** | 8 992 o | **9 141 o** | **+149 o** |
| Landing gzip | 30 368 o | 30 421 o | +53 o |
| Chunk verre (lazy) | — | **32,3 Ko gzip** | hors First Load |

Audit de conformité : **57/57** (`/tmp/audit5.py` — crash SSR, repli solide au premier paint,
valeurs des tokens vérifiées numériquement, les deux replis d'accessibilité, périmètre contenu vs
chrome, non-régression bento). L'audit cumulé du bento reste à **86/92**, avec les mêmes 6 faux
négatifs connus du script (minification, `data-reveal="true"`, `srcSet` en camelCase, images `fill`).
