# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Quick Commerce Cotonou
**Generated:** 2026-11-21 13:01:33
**Category:** Pharmacy/Drug Store
**Design Dials:** Motion 3/10 (Subtle) | Density 7/10 (Standard)
**Stack cible:** Next.js + shadcn/ui + Tailwind
**Verifications appliquees:** 2026-11-21 — voir `## Corrections verifiees` en fin de fichier.

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#15803D` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#22C55E` | `--color-secondary` |
| On Secondary | `#0F172A` | `--color-on-secondary` |
| Accent/CTA | `#0369A1` | `--color-accent` |
| On Accent/CTA | `#FFFFFF` | `--color-on-accent` |
| Background | `#F0FDF4` | `--color-background` |
| Foreground | `#14532D` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#14532D` | `--color-card-foreground` |
| Muted | `#E8F0F1` | `--color-muted` |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border (decoratif) | `#BBF7D0` | `--color-border` |
| Border (controles) | `#6B8F76` | `--color-border-strong` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring | `#15803D` | `--color-ring` |

**Color Notes:** Pharmacy green + trust blue

> ⚠️ **Ne jamais mettre de texte blanc sur `--color-secondary` (`#22C55E`)** : 2.28:1 seulement.
> Sur ce vert, utiliser `--color-on-secondary` (`#0F172A`) → 7.83:1.
>
> ⚠️ **`--color-border` (`#BBF7D0`) est reserve aux separateurs decoratifs.** Il mesure 1.16:1
> contre le fond de page, tres en dessous des 3:1 requis par WCAG 1.4.11 pour delimiter un
> composant. Pour les champs de saisie, selects et boutons outlines, utiliser
> `--color-border-strong` (`#6B8F76`) → 3.45:1 sur page, 3.61:1 sur carte.

### Typography

- **Heading Font:** Rubik
- **Body Font:** Nunito Sans
- **Mood:** ecommerce, clean, shopping, product, retail, conversion
- **Best For:** E-commerce, online stores, product pages, retail, shopping
- **Licence:** OFL (les deux), familles `active`, verifiees 2026-08-13
- **Subsets:** `latin` + `latin-ext` sur les deux → accents francais couverts
- **Google Fonts:** [Rubik + Nunito Sans](https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&family=Rubik:wght@400;500;600;700&display=swap)

> ⚠️ **CORRIGE — la paire generee etait `Inter` (heading) / `Playfair Display` (body).**
> Playfair Display est classe `Serif / Display` avec les mots-cles *elegant, traditional, classic,
> refined* et un *Best For* = « creative brand flagships, luxury mobile experiences, flash pages ».
> C'est un mauvais appariement pour une app de livraison epicerie/pharmacie, et le champ *Best For*
> genere le prouvait deja. La paire ci-dessus vient du domaine `typography` du meme skill
> (appariement **« E-commerce Clean »**, cherche avec `grocery delivery pharmacy trust clean fast`).
> L'URL d'origine embarquait aussi **JetBrains Mono**, absent de la paire : poids mort supprime.
>
> **Variante si l'axe sante/pharmacie devient dominant :** appariement **« Medical Clean »** du
> catalogue — Figtree (heading) / Noto Sans (body), OFL, mots-cles *medical, clean, accessible,
> healthcare, trustworthy*. Noto Sans est rank 6 et Figtree rank 32 en popularite.

**Recommande pour Next.js — self-hosting via `next/font`** (aucune requete tierce, zero CLS,
meilleur pour les connexions lentes, contrairement a un `@import` Google Fonts) :

```ts
// app/layout.tsx
import { Rubik, Nunito_Sans } from 'next/font/google';

const rubik = Rubik({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rubik',   // consomme par globals.css via var(--font-rubik)
  display: 'swap',
});

const nunito = Nunito_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',  // consomme par globals.css via var(--font-nunito)
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${rubik.variable} ${nunito.variable}`}>
      {/* font-body est genere par @theme inline de globals.css */}
      <body>{children}</body>
    </html>
  );
}
```

```css
/* fallback si @import reste necessaire */
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&family=Rubik:wght@400;500;600;700&display=swap');
```

### Spacing Variables

*Density: 7/10 — Standard*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Modales uniquement |

> ⚠️ **Contradiction resolue :** le style retenu est **Flat Design**, dont les *Key Effects* disent
> « No gradients/shadows », mais cette table etait appliquee aux cartes et aux boutons. Regle :
> **les ombres sont reservees aux calques flottants** (modales, dropdowns, sheets) ou l'elevation
> porte une information fonctionnelle. Cartes, boutons et tuiles produit separent par **bordure**,
> jamais par ombre. `--shadow-md` n'est donc plus utilise sur `.card`.

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #0369A1;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #15803D;
  border: 2px solid #15803D;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: var(--color-card);          /* #FFFFFF — pas #F0FDF4, qui est egal
                                             a --color-background : la carte serait
                                             invisible contre la page */
  border: 1px solid var(--color-border);  /* Flat Design : la separation passe par
                                             la bordure, pas par l'ombre */
  border-radius: 12px;
  padding: 24px;
  transition: border-color 200ms ease, background-color 200ms ease;
  cursor: pointer;
}

.card:hover {
  border-color: var(--color-border-strong);  /* #6B8F76 — simple shift de couleur,
                                                conforme a "Key Effects" du style */
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid var(--color-border-strong);  /* #6B8F76 — 3.61:1 sur carte.
                                                    L'original #E2E8F0 ne faisait que
                                                    1.23:1 : champ non delimiter,
                                                    echec WCAG 1.4.11 */
  border-radius: 8px;
  font-size: 16px;   /* >=16px empeche le zoom force iOS au focus */
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.input:focus {
  border-color: var(--color-ring);
  outline: 2px solid var(--color-ring);   /* #15803D plein, 5.02:1 sur carte.
                                             L'original 0 0 0 3px #15803D20 est un
                                             halo a 12.5% d'alpha : quasi invisible,
                                             echec "focus states visible" */
  outline-offset: 2px;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Flat Design

**Keywords:** 2D, minimalist, bold colors, no shadows, clean lines, simple shapes, typography-focused, modern, icon-heavy

**Best For:** Web apps, mobile apps, cross-platform, startup MVPs, user-friendly, SaaS, dashboards, corporate

**Key Effects:** No gradients/shadows, simple hover (color/opacity shift), fast loading, clean transitions (150-200ms ease), minimal icons

### Page Pattern

**Pattern Name:** Trust & Authority + Conversion

- **Conversion Strategy:** Security badges. Case studies. Transparent pricing. Low-friction form. Provide pause/stop and stop the logo carousel on focus, hover, and reduced motion. Previous/next controls provide the keyboard equivalent; pause offscreen/hidden and render a static logo set under reduced motion.
- **Color Strategy:** Vert pharmacie `#15803D` + bleu de confiance `#0369A1`, accent reserve au CTA.

> ⚠️ **CORRIGE — CTA et ordre de sections.** Le generateur a apparie ce projet au type produit
> **Pharmacy/Drug Store**, dont le pattern est oriente B2B : CTA *« Contact Sales / Get Quote »* et
> sections *« Hero (mission/credibility) > Proof (logos, certs, stats) > Solution overview > Clear
> CTA path »*, avec une *Color Strategy* annoncee « Navy/Grey corporate » qui contredisait la
> palette verte reellement produite. Un commerce de livraison grand public ne vend pas par devis.
> Les deux regles ci-dessous remplacent le CTA et l'ordre de sections ; la *Conversion Strategy*
> d'origine est conservee car ses exigences carrousel/accessibilite restent pertinentes.

- **CTA Placement (corrige):** « Commander » (primaire, hero + navbar sticky + bas de page) +
  « Verifier ma zone de livraison » (secondaire, hero). Panier visible en permanence sur mobile.
- **Section Order (corrige):** Saisie adresse / zone de livraison > Categories (epicerie, pharmacie,
  boissons, hygiene) > Produits populaires > Comment ca marche (3 etapes) > Preuves (delais, avis,
  partenaires de paiement) > CTA de rappel

---

## Motion

**Scroll Reveal** (Subtle) — Trigger: scroll (viewport enter) | Duration: 300-400ms | Easing: `power1.out`

```js
gsap.from(el, { opacity: 0, y: 12, duration: 0.35, ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } });
```

**Framework notes:** Requires the ScrollTrigger plugin registered once via gsap.registerPlugin(ScrollTrigger); Use matchMedia('(prefers-reduced-motion: reduce)') to skip non-essential motion and render the final state immediately

- ✅ Keep the y offset small (8-16px) so it reads as a fade, not a slide
- ❌ Don't reveal below-the-fold content needed for SEO/crawlers as invisible-by-default without a no-JS fallback
- ⚡ toggleActions 'play none none reverse' avoids re-triggering on every scroll direction change

---

## Anti-Patterns (Do NOT Use)

- ❌ Confusing layout
- ❌ Privacy concerns
- ❌ AI purple/pink gradients

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile

---

## Dark Mode (verifie)

Le style **Flat Design** est tagué `Light supported | Dark supported` : le schema sombre est donc
attendu, et la guideline `shadcn` impose un `:root` **et** un `.dark` complets. Le generateur n'a
produit que le schema clair. Celui-ci est derive de la palette claire, puis **mesure**.

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#0C1A12` | `--color-background` |
| Foreground | `#E8F5EC` | `--color-foreground` |
| Card | `#12241A` | `--color-card` |
| Card Foreground | `#E8F5EC` | `--color-card-foreground` |
| Primary | `#22C55E` | `--color-primary` |
| On Primary | `#052E16` | `--color-on-primary` |
| Secondary | `#16A34A` | `--color-secondary` |
| On Secondary | `#0C1A12` | `--color-on-secondary` |
| Accent/CTA | `#38BDF8` | `--color-accent` |
| On Accent/CTA | `#082F49` | `--color-on-accent` |
| Muted | `#1B2E23` | `--color-muted` |
| Muted Foreground | `#A7C0B0` | `--color-muted-foreground` |
| Border (decoratif) | `#2A4234` | `--color-border` |
| Border (controles) | `#7FA88C` | `--color-border-strong` |
| Destructive | `#F87171` | `--color-destructive` |
| On Destructive | `#450A0A` | `--color-on-destructive` |
| Ring | `#22C55E` | `--color-ring` |

### Contrastes mesures (dark)

| Cas | Ratio | Seuil | Verdict |
|-----|-------|-------|---------|
| Texte sur fond | 15.96:1 | 4.5 | OK |
| Texte sur carte | 14.47:1 | 4.5 | OK |
| Muted foreground sur fond | 9.22:1 | 4.5 | OK |
| Muted foreground sur carte | 8.36:1 | 4.5 | OK |
| On-primary sur primary | 6.54:1 | 4.5 | OK |
| On-accent sur accent | 6.48:1 | 4.5 | OK |
| **On-secondary sur secondary** | **5.44:1** | 4.5 | **OK (corrige)** |
| On-destructive sur destructive | 5.84:1 | 4.5 | OK |
| Texte primary (CTA) sur fond | 7.86:1 | 4.5 | OK |
| Lien accent sur fond | 8.36:1 | 4.5 | OK |
| Border-strong sur carte | 6.10:1 | 3.0 | OK |
| Border-strong sur fond | 6.72:1 | 3.0 | OK |
| Ring (focus) sur fond | 7.86:1 | 3.0 | OK |
| Border decoratif sur carte | 1.49:1 | — | Assume : decoratif, ne delimite aucun composant |

> ⚠️ `--color-on-secondary` est `#0C1A12` et **non** `#E8F5EC`. Un texte clair sur le vert
> `#16A34A` ne donne que **2.94:1** — echec. `#0C1A12` donne **5.44:1**, avec de la marge.
> Le blanc sur `#16A34A` ne ferait que 3.30:1 : egalement interdit.

**Regles dark mode :** pas d'ombre (Flat Design) — la separation des calques passe par
`--color-border` et par des fonds plus clairs d'un cran (`#0C1A12` → `#12241A` → `#1B2E23`).
Les ombres restent autorisees uniquement sur les calques flottants (modales, dropdowns, sheets).

---

## Contraintes locales — marche beninois

Le skill ne couvre pas ce contexte. Ces regles s'ajoutent au Master et **ne sont pas negociables**
pour ce projet.

### Paiement

- **Mobile money en priorite absolue** : MTN MoMo, Moov Money (Flooz), Wave. La carte bancaire est
  un moyen **secondaire**, jamais le seul.
- Chaque moyen de paiement affiche son **logo officiel en SVG** — jamais en emoji, jamais en texte
  seul (rappel de l'anti-pattern « Emojis as icons »).
- Le bouton de paiement confirme le **montant en FCFA** (`XOF`) avant validation, avec le format
  `1 500 FCFA` (espace insécable comme separateur de milliers — pas de virgule).
- Prevoir l'echec USSD : le delai de confirmation cote operateur peut depasser 30 s. Afficher un
  etat « en attente de confirmation » explicite, ne jamais bloquer l'UI, ne jamais doubler la requete.
- **Paiement a la livraison** en option visible : c'est un facteur de confiance decisive localement.

### Langue et formats

- `lang="fr"` sur `<html>`. Francais par defaut.
- Prevoir l'extension vers le **Fon** et le **Yoruba** sans refonte : ne jamais coder en dur des
  largeurs de libelles, les chaines passent par un catalogue i18n.
- Devise **XOF / FCFA**, pas de symbole `€` ni `$`.
- **Telephone : accepter 8 OU 10 chiffres.** Le format `+229 XX XX XX XX` note initialement ici
  correspond a l'**ancien** plan de numerotation ; le Benin est passe a un plan a **10 chiffres**
  (numeros existants prefixes, notamment par `01`). Un validateur borne a 8 chiffres rejette des
  numeros valides et fait perdre la commande au checkout. Implementations de reference :
  `formatBeninPhone` et `validateBeninPhone` dans `lib/format.ts`, toutes deux testees sur les deux
  longueurs. Affichage par paires : `+229 01 97 12 34 56`.
- Adresses : pas de code postal fiable au Benin → le formulaire s'appuie sur **ville + quartier +
  repere** (Cotonou, Calavi, Abomey-Calavi…), et non sur un champ « code postal » obligatoire.

### Mobile et reseau

- **Mobile-first strict.** La majorite du trafic sera sur mobile, souvent en 3G/4G instable.
- Cibles tactiles : **48 dp minimum** (la guideline UX du skill, severite *High*, donne 44 pt iOS /
  48 dp Android et la regle WCAG *Target Size* pour le web), **8 px minimum entre deux cibles**,
  et cibles agrandies sur mobile plutot que de conserver les petites tailles desktop.
- Champs de saisie a **16 px minimum** pour eviter le zoom force d'iOS au focus.
- Le style retenu est `cost:low | drivers:none` : le garder. **Pas de video autoplay**, pas de
  carrousel lourd, pas de librairie d'animation superflue. Images produit en `next/image` avec
  `sizes` correct, AVIF/WebP, placeholder `blur`.
- Polices **self-hosted via `next/font`** (la guideline `nextjs` du skill dit explicitement
  « Use next/font », *« Don't: External font links »*). Deux familles maximum.
- **WhatsApp** comme canal de commande et de support, en evidence : c'est le canal dominant
  localement. Icône officielle SVG, lien `wa.me/229XXXXXXXX`.

### Confiance

- Afficher clairement : **zone de livraison**, **delai estime**, **frais de livraison**, et
  **moyens de paiement acceptes** — avant le tunnel d'achat, pas apres.
- Pour les produits de pharmacie : ne jamais promettre de delivrance de medicaments soumis a
  ordonnance sans un garde-fou explicite (mention « ordonnance requise », verification humaine).

---

## Corrections verifiees

Provenance de chaque ecart entre ce fichier et la sortie brute du generateur. Toutes les
corrections sont etayees par les propres catalogues du skill ou par une mesure de contraste.

| # | Champ | Valeur generee | Valeur retenue | Justification |
|---|-------|----------------|----------------|---------------|
| 1 | Typographie | Inter / Playfair Display | **Rubik / Nunito Sans** | Playfair Display est classe `Serif / Display`, mots-cles *elegant, traditional, refined*, *Best For* « luxury mobile experiences ». Incoherent pour une app de livraison. Rubik/Nunito Sans = appariement **« E-commerce Clean »** du domaine `typography`, *Best For* « e-commerce, online stores, product pages, retail ». Les deux sont **OFL**, `active`, subsets `latin` + `latin-ext`. |
| 2 | URL Google Fonts | incluait **JetBrains Mono** | retire | Famille absente de la paire declaree : requete et poids inutiles, penalisant sur connexion lente. |
| 3 | `--color-border` | `#BBF7D0` pour tout | scinde : decoratif `#BBF7D0` / controles **`#6B8F76`** | `#BBF7D0` = **1.16:1** sur page, **1.21:1** sur carte → tres sous les 3:1 de WCAG 1.4.11. `#6B8F76` = 3.45:1 / 3.61:1, le vert-gris le plus clair qui passe encore. |
| 4 | Bordure `.input` | `#E2E8F0` | **`#6B8F76`** | `#E2E8F0` = **1.23:1** sur carte → champ de saisie non delimite. Critique sur un tunnel de checkout. |
| 5 | Focus `.input` | `0 0 0 3px #15803D20` | **`outline: 2px solid #15803D`** | Halo a 12.5 % d'alpha, quasi invisible → viole l'anti-pattern « Invisible focus states » du meme fichier. `#15803D` plein = 5.02:1 sur carte. |
| 6 | Fond `.card` | `#F0FDF4` | **`#FFFFFF`** | `#F0FDF4` est **egal** a `--color-background` : la carte etait indiscernable de la page, sa seule separation etant l'ombre — que Flat Design interdit. |
| 7 | Ombres | table `--shadow-*` appliquee aux cartes et boutons | reservee aux **calques flottants** | Le fichier declarait `Flat Design` / « No gradients/shadows » tout en mettant `box-shadow` sur `.card`. Contradiction interne tranchee en faveur du style retenu. |
| 8 | Hover `.card` | `translateY(-2px)` + ombre | **shift de `border-color`** | Les *Key Effects* du style disent « simple hover (color/opacity shift) ». |
| 9 | CTA placement | « Contact Sales / Get Quote (primary) + Nav » | **« Commander » + « Verifier ma zone »** | Fuite B2B heritee de l'appariement au type produit *Pharmacy/Drug Store*. Un commerce de livraison grand public ne vend pas par devis. |
| 10 | Ordre de sections | Hero (mission) > Proof (logos, certs) > Solution > CTA | **Adresse/zone > Categories > Produits populaires > Comment ca marche > Preuves > CTA** | Meme fuite B2B. En quick commerce, la verification de zone et le catalogue priment sur les logos de certification. |
| 11 | Color strategy | « Navy/Grey corporate » | vert pharmacie + bleu de confiance | Le texte genere contredisait la palette verte reellement produite par le meme appel. |
| 12 | Dark mode | **absent** | schema complet ajoute + mesure | Le style est tagué `Dark supported` et la guideline `shadcn` exige `:root` **et** `.dark`. 14 paires mesurees, 1 corrigee (`on-secondary` : 2.94:1 → 5.44:1). |
| 13 | Blanc sur `--color-secondary` | non signale | **interdit** | `#FFFFFF` sur `#22C55E` = **2.28:1**. Le generateur ne prevenait pas. Utiliser `#0F172A` → 7.83:1. |

### Ce qui a ete conserve tel quel

La **palette claire** (vert `#15803D` + bleu `#0369A1`, fond `#F0FDF4`) : elle est corroborée par
deux lignes distinctes de `products.csv` — *Pharmacy/Drug Store* (« Pharmacy Green + Trust Blue +
Clean White ») et *Grocery & Shopping List* (« Fresh green ») — et ses 9 paires de contraste
mesurees passent toutes (minimum 4.61:1).

Le style **Flat Design** : `cost:low | drivers:none`, `a11y risk:low`, et recommande en *primary*
par les deux memes lignes produit. Le meilleur choix pour un reseau contraint.

Les tokens **d'espacement** (`--density 7`) et de **motion** (`--motion 3`, scroll reveal 300-400 ms
avec garde `prefers-reduced-motion`) : inchanges.

### Reproduction

```bash
# Sortie brute du generateur, avant corrections :
python3 .agents/skills/ui-ux-pro-max/scripts/search.py \
  "grocery delivery pharmacy fast local commerce" \
  --design-system --motion 3 --density 7 -p "Quick Commerce Cotonou" --format markdown

# Appariement typo retenu (domaine typography) :
python3 .agents/skills/ui-ux-pro-max/scripts/search.py \
  "grocery delivery pharmacy trust clean fast" --domain typography -n 6

# Archetype produit a retenir pour le suivi de livraison en phase 2 :
python3 .agents/skills/ui-ux-pro-max/scripts/search.py \
  "food delivery on-demand courier grocery" --domain product -n 3 --full
```

### A trancher en phase 2 — suivi de livraison

Le generateur a apparie ce projet a **Pharmacy/Drug Store**, dont le dashboard recommande est
*« Inventory Dashboard »*. Or la ligne **Food Delivery / On-Demand** de `products.csv` recommande
**« Real-Time Monitoring + Map »**, bien plus adapte au suivi de coursier. Pour l'ecran de suivi de
commande et le back-office livreur, retenir **Real-Time Monitoring + Map**, avec la contrainte
« pas de fond de carte lourd » (tuiles legeres, ou schema statique + etapes textuelles si le reseau
est degrade).
