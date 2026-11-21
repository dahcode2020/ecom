# Agent guide

## UI/UX Pro Max skill is installed

Seven design skills live in `.agents/skills/`. For any UI/UX work in this repo — designing,
building, reviewing or fixing interfaces, choosing colors/fonts/styles, adding charts, or
stack-specific UI implementation — consult them instead of guessing.

Entry point: `.agents/skills/ui-ux-pro-max/SKILL.md`. Read it first; it maps each scenario to the
right search.

The data is local and offline. Query it with Python 3 (standard library only):

```bash
# New project or page -> full design system (pattern, style, colors, typography, effects, checklist)
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "ecommerce storefront fashion" --design-system -p "Arena Shop"

# One focused question -> single domain
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "checkout form validation" --domain ux -n 3

# Stack-specific best practices
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "server components" --stack nextjs -n 3
```

Domains: `style`, `color`, `chart`, `landing`, `product`, `ux`, `typography`, `icons`, `gsap`,
`react`, `web`, `google-fonts`.
Stacks: `react`, `nextjs`, `vue`, `svelte`, `astro`, `shadcn`, `html-tailwind`, `nuxtjs`, `nuxt-ui`,
`angular`, `laravel`, `threejs`, `swiftui`, `react-native`, `flutter`, `jetpack-compose`, `wpf`,
`winui`, `avalonia`, `uno`, `uwp`, `javafx`.

Rules when using the search script:

- A `Found: 0 results` answer is a real miss, not an empty value. Retry with broader keywords
  before falling back to general defaults, and say explicitly that no database match was found.
- Persist a chosen design system so later pages stay consistent:
  `--design-system --persist -p "Name" --output-dir .` writes `design-system/<slug>/MASTER.md`;
  add `--page <name>` for a page-specific override.
- Honour the pre-delivery checklist the design system returns: no emoji icons (use SVG),
  `cursor-pointer` on clickables, 4.5:1 text contrast, visible focus states,
  `prefers-reduced-motion`, and responsive checks at 375 / 768 / 1024 / 1440px.

Sibling skills: `design`, `design-system`, `ui-styling`, `brand`, `banner-design`, `slides` —
each has its own `SKILL.md` in `.agents/skills/<name>/`.

## Ce projet a un design system — le lire avant d'ecrire du UI

`design-system/quick-commerce-cotonou/MASTER.md` est la source de verite. Produit : **quick
commerce** (epicerie + pharmacie + livraison rapide, marche beninois). Stack : **Next.js +
shadcn/ui + Tailwind v4**.

Regles de consultation, dans l'ordre impose par le skill :

1. Lire `design-system/quick-commerce-cotonou/MASTER.md`.
2. Pour une page precise, chercher `design-system/quick-commerce-cotonou/pages/<page>.md`.
   S'il existe, **il prime** sur le Master. Sinon, appliquer le Master seul.
3. `design-system/quick-commerce-cotonou/globals.css` contient les tokens prets a copier vers
   `app/globals.css`. Il compile sous Tailwind v4.3.5 — ne pas le reecrire a la main.

**Lire aussi `## Corrections verifiees` en fin de MASTER.md.** La sortie brute du generateur
comportait 13 ecarts corriges et etayes (typographie incoherente, bordures de champs a 1.16:1 et
1.23:1 donc sous le seuil WCAG 1.4.11, focus ring quasi invisible, carte dont le fond etait egal a
celui de la page, CTA B2B « Contact Sales / Get Quote » sur un produit grand public, ombres en
contradiction avec le style Flat Design retenu). Ne pas « reparer » ces corrections en revenant aux
valeurs generees.

Ne pas regenerer MASTER.md avec `--force` : il est corrige et annote a la main. Le skill l'interdit
d'ailleurs sans autorisation explicite de l'utilisateur.

Installation, verification and update commands: see `README.md`.
