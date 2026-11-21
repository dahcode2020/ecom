# ecom

## Installed skills

### UI/UX Pro Max

Source: <https://github.com/nextlevelbuilder/ui-ux-pro-max-skill> (MIT)
Installed with [`ui-ux-pro-max-cli`](https://www.npmjs.com/package/ui-ux-pro-max-cli) v2.15.0 → `.agents/skills/` (Agent Standard layout).

Design intelligence for web, mobile and desktop UI. Local, offline, Python 3 standard library only — no network calls at query time.

| Skill | Purpose |
|-------|---------|
| `ui-ux-pro-max` | Orchestrator + searchable data catalogs and `scripts/search.py` |
| `design` | Brand identity, design tokens, logos, icons, banners |
| `design-system` | Three-layer tokens (primitive → semantic → component), component specs |
| `ui-styling` | shadcn/ui + Radix + Tailwind, accessible components, responsive layout |
| `brand` | Brand voice, messaging frameworks, style guides |
| `banner-design` | Banners for social, ads, web heroes, print |
| `slides` | HTML presentations with Chart.js and design tokens |

**Data catalogs** (`data/catalog-summary.json`, verified 2026-08-13):
79 searchable styles (50 active) · 192 product palettes + reasoning profiles · 74 font pairings · 1,934 Google Fonts · 105 curated icons (+1,512 upstream Phosphor) · 119 UX guidelines · 17 motion presets · 25 chart types · 22 stacks / 1,260 stack guidelines.

### Usage

Generate a full design system recommendation:

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<product> <industry> <keywords>" --design-system -p "Project Name"
```

Search a single domain (`style`, `color`, `chart`, `landing`, `product`, `ux`, `typography`, `icons`, `gsap`, `react`, `web`, `google-fonts`):

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> -n 3
```

Search stack-specific guidelines (`react`, `nextjs`, `vue`, `svelte`, `astro`, `shadcn`, `html-tailwind`, `swiftui`, `flutter`, `react-native`, `angular`, `laravel`, `nuxtjs`, `threejs`, …):

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack nextjs -n 3
```

Persist a design system to `design-system/<slug>/MASTER.md` (plus per-page overrides with `--page`):

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist \
  -p "Project Name" --output-dir .
```

Tune the output with `--variance`, `--motion`, `--density` (1–10), or emit `--json` / `--format markdown`.

## Design system du projet

`design-system/quick-commerce-cotonou/` — quick commerce (epicerie + pharmacie + livraison, marche
beninois), stack **Next.js + shadcn/ui + Tailwind v4**.

- `MASTER.md` — source de verite : palette light **et** dark mesuree, typographie, espacement,
  specs composants, pattern de page, motion, anti-patterns, contraintes locales (mobile money,
  FCFA, WhatsApp, cibles tactiles), et `## Corrections verifiees` qui trace les 13 ecarts corriges
  entre la sortie brute du generateur et ce fichier.
- `globals.css` — tokens prets a copier vers `app/globals.css`. Compile sous Tailwind v4.3.5 ;
  les 15 utilitaires de couleur/typo/rayon et les 8 classes composants sont verifies generes.

Genere avec :

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py \
  "grocery delivery pharmacy fast local commerce" \
  --design-system --persist --motion 3 --density 7 \
  -p "Quick Commerce Cotonou" --output-dir .
```

> `MASTER.md` est corrige et annote a la main : ne pas le regenerer avec `--force`.

### Maintenance

```bash
uipro update --ai universal            # refresh skill files from the installed CLI
npm install -g ui-ux-pro-max-cli@latest && uipro init --ai universal --force
uipro uninstall --ai universal         # remove
```

Re-run the bundled checks after any update:

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/validate_data.py
python3 -m unittest discover -s .agents/skills/ui-ux-pro-max/scripts/tests -p "test_*.py"
```

> `test_catalog_refresh` and `test_relevance_evaluator` error in an installed copy: they load
> `scripts/evaluate-relevance.py` and `scripts/generate-catalog-summary.py`, which ship only in the
> upstream source checkout. The remaining 130 tests pass.

Other install targets are available (`claude`, `cursor`, `codex`, `copilot`, `gemini`, `windsurf`,
`roocode`, `kiro`, `opencode`, `openclaw`, `autoclaw`, `all`, …) — run `uipro init --ai <target>`.
Add `--global` to install under `~/` instead of this workspace.
