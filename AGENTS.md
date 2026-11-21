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

Installation, verification and update commands: see `README.md`.
