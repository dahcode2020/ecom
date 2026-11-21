import Link from 'next/link';
import Image from 'next/image';
import { Illustration, illustrationForCategory } from './illustration';
import { Icon, PaymentIcon } from './icon';
import { ZoneCheck } from './zone-check';
import {
  categories,
  paymentMethods,
  popularProducts,
  products,
  productsByCategory,
  zones,
} from '@/lib/data';
import { ProductTile } from './product-tile';
import { formatXOF, frenchCardinalCapitalized } from '@/lib/format';
import { SUPPORT_WHATSAPP } from '@/lib/contact';

/**
 * Sections de la landing.
 *
 * Spec : design-system/quick-commerce-cotonou/pages/landing.md
 *
 * Ordre de sections impose — il correspond au pattern `marketplace-directory`
 * de landing.csv (Hero oriente recherche > Categories > Featured Listings >
 * Trust/Safety > CTA), complete par le bloc 3 etapes de
 * `funnel-3-step-conversion` :
 *
 *   1. Hero + verification de zone   (CTA primaire)
 *   2. Categories
 *   3. Produits populaires
 *   4. Comment ca marche (3 etapes)
 *   5. Preuves (delais, frais, zones, moyens de paiement)
 *   6. CTA de rappel
 *
 * Ces composants sont des **Server Components** : le contenu marchand est dans
 * le HTML, pas hydrate cote client (SEO, LCP, et repli sans JS).
 *
 * IMAGES PRODUIT : aucun asset distant n'est disponible dans cet environnement,
 * et `next/image` ne peut donc pas etre demontre ici. Les tuiles sont des
 * aplats `--muted` + icone Lucide, conformement au Flat Design retenu
 * (« no gradients/shadows »). En production : `next/image` avec AVIF/WebP,
 * `sizes` explicite, `placeholder="blur"`, `priority` sur le hero uniquement et
 * lazy sur tout le reste (UX Medium : « Lazy load below-fold images »).
 */

/* ------------------------------------------------------------------ */
/* 1. Hero + verification de zone                                      */
/* ------------------------------------------------------------------ */
export function Hero() {
  // Toutes les statistiques sont CALCULEES depuis les donnees. Aucune n'est
  // saisie a la main : c'est la derive deja corrigee trois fois dans ce projet
  // (cartCount, montants du panier, comptes de rayons, « Six rayons »).
  const servedZones = zones.filter((zone) => zone.served).length;
  const minFee = Math.min(...zones.filter((zone) => typeof zone.fee === 'number').map((zone) => zone.fee!));

  return (
    <section className="border-border relative overflow-hidden border-b">
      {/* Nappe decorative. `aria-hidden` + `pointer-events-none` : elle ne porte
          aucune information et ne doit jamais intercepter un tap.
          Animation `qcc-float` 11s (recette Aurora : boucle 8-12s), desactivee
          par le bloc `prefers-reduced-motion` global de globals.css.
          Le hero n'utilise PAS `data-reveal` : c'est le LCP et le contenu
          indexable principal, il ne doit jamais dependre d'un observer. */}
      <div
        aria-hidden="true"
        className="bg-secondary pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-[0.14] blur-3xl md:h-96 md:w-96"
        style={{ animation: 'qcc-float 11s var(--ease-sine-in-out) infinite' }}
      />

      <div className="relative mx-auto max-w-[1200px] px-4 py-8 sm:px-6 md:py-12 lg:py-14">
        <div className="bento">
          {/* --- 1. Tuile inversee : promesse + CTA ----------------------- */}
          <div className="bento-tile tile-inverted bento-2x2 flex flex-col justify-between gap-8 p-6 md:p-8 lg:p-10">
            <div>
              <p
                className="font-heading inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
                style={{ borderColor: 'var(--inverted-border)', color: 'var(--inverted-accent)' }}
              >
                <Icon name="truck" className="h-4 w-4" />
                Cotonou &amp; Abomey-Calavi
              </p>

              {/* h1 unique et reel (SEO). Classe `.display` : clamp 36 -> 68px,
                  tracking -0.03em, line-height 1.03 — l'echelle affirmee du
                  style Bold Typography (« H1 at least 4-5x body size »).
                  Le mot cle « moins d'une heure » porte l'accent : c'est la
                  promesse qui decide l'achat en quick commerce. */}
              <h1 className="display mt-5">
                Épicerie et pharmacie livrées en{' '}
                <span style={{ color: 'var(--inverted-accent)' }}>moins d’une heure</span>
              </h1>

              <p className="lede mt-5 max-w-prose" style={{ color: 'var(--inverted-muted)' }}>
                Produits frais, épicerie, médicaments sans ordonnance et hygiène.
                Paiement <strong>MTN MoMo</strong>, <strong>Moov Money</strong>,{' '}
                <strong>Wave</strong> — ou à la livraison.
              </p>
            </div>

            <div className="tap-group flex flex-wrap gap-3">
              {/* Bouton primaire INVERSE : un `.btn-primary` classique serait
                  illisible ici (--primary sur --inverted-bg = 1.82:1, mesure). */}
              <a href="#zone-check" className="btn-inverted">
                <Icon name="mapPin" className="h-5 w-5" />
                Vérifier ma zone
              </a>
              <Link href="/catalogue" className="btn-inverted-ghost">
                Voir le catalogue
              </Link>
            </div>
          </div>

          {/* --- 2. Tuile image ------------------------------------------- */}
          <div className="bento-tile bento-2x2 relative min-h-[260px] md:min-h-[320px]">
            {/* `fill` impose un parent positionne (c'est le cas) et des
                width/height implicites via `sizes` : aucun deplacement de
                mise en page (CLS) au chargement.
                PAS de `priority` : sur mobile cette tuile est sous la ligne de
                flottaison, donc le LCP reste le titre du hero — conformement a
                pages/landing.md. Sur desktop elle est visible et se charge
                immediatement, `loading="lazy"` ne différant que le hors-ecran.
                Mesure : ~48 Ko en AVIF a 640w, ~126 Ko a 1024w. */}
            <Image
              src="/img/hero-marche.jpg"
              alt="Panier de courses ouest-africain : ananas, tomates, légumes verts, riz et huile, disposés sur un fond clair"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              className="object-cover"
            />
            {/* Voile tres leger en bas pour garantir la lisibilite de la
                legende, quelle que soit l'image. Pas un degrade decoratif :
                c'est un support de contraste. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: 'linear-gradient(to top, rgb(12 26 18 / 0.72), transparent)' }}
            />
            <p className="absolute bottom-4 left-4 right-4 text-sm font-semibold text-white">
              <Icon name="leaf" className="mr-1.5 inline h-4 w-4" />
              Du marché à votre porte
            </p>
          </div>

          {/* --- 3. Verification de zone : le CTA primaire ---------------- */}
          <div id="zone-check" className="bento-tile bento-2x2 scroll-mt-24 p-5 md:p-6 lg:bento-2x1">
            <ZoneCheck />
          </div>

          {/* --- 4-5. Preuves chiffrees ---------------------------------- */}
          <div className="bento-tile bento-tile-interactive flex flex-col justify-center gap-1 p-5">
            <p className="stat" style={{ color: 'var(--primary)' }}>
              {servedZones}
            </p>
            <p className="text-foreground text-sm font-semibold">quartiers desservis</p>
            <p className="text-muted-foreground text-xs">
              sur {zones.length} suivis, étendus chaque mois
            </p>
          </div>

          <div className="bento-tile bento-tile-interactive flex flex-col justify-center gap-1 p-5">
            <p className="stat" style={{ color: 'var(--accent)' }}>
              {formatXOF(minFee).replace('\u202fFCFA', '')}
            </p>
            <p className="text-foreground text-sm font-semibold">de frais de livraison</p>
            <p className="text-muted-foreground text-xs">
              offerte dès {formatXOF(15000)} d’achat
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Categories                                                       */
/* ------------------------------------------------------------------ */
export function Categories() {
  /**
   * Grille bento asymetrique. Les spans sont explicites par index : c'est
   * l'irregularite qui cree l'interet visuel (checklist du style :
   * « Card spans varied »). Une grille uniforme de 6 tuiles identiques etait
   * exactement le rendu juge basique.
   *
   * Disposition visee sur 4 colonnes (lg) :
   *   [ epicerie 2x2 ] [ pharmacie ] [ boissons ]
   *   [              ] [ hygiene   ] [ frais    ]
   *   [ maison 2x1     ] [ CTA catalogue 2x1    ]
   * En mobile tout retombe a une colonne, donc l'ordre du DOM est l'ordre de
   * lecture : rien n'est masque ni reordonne par CSS.
   */
  const spans = ['bento-2x2', '', '', '', '', 'bento-2x1'];

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16" aria-labelledby="h-categories">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="h-categories" className="display-sm">
            Nos rayons
          </h2>
          {/* Nombre de rayons CALCULE, jamais ecrit a la main : « Six » mentait
              des l'ajout d'un rayon. */}
          <p className="text-muted-foreground lede mt-2">
            {frenchCardinalCapitalized(categories.length)} rayons, un seul panier, une seule
            livraison.
          </p>
        </div>
        {/* CTA souligne : motif « underline CTA » du style Bold Typography, le
            trait s'etire au survol via `.link-cta::after`. */}
        <Link href="/catalogue" className="link-cta text-sm">
          Tout le catalogue
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>

      {/* Chaque tuile mene au catalogue FILTRE, et non a une ancre de cette
          page : c'est le comportement « directory » attendu d'une landing
          marketplace, et l'URL reste partageable. */}
      <ul className="bento m-0 list-none p-0" data-reveal-group="rayons">
        {categories.map((category, index) => (
          <li key={category.id} className={spans[index] ?? ''} data-reveal data-reveal-group="rayons">
            <Link
              href={`/catalogue?cat=${category.id}`}
              className="bento-tile bento-tile-interactive group flex h-full min-h-12 flex-col justify-between gap-4 p-4 no-underline md:p-5"
            >
              {/* Illustration dessinee sur mesure, pas une icone : c'est le
                  changement le plus visible par rapport au rendu initial.
                  Couleurs par variables, donc correcte en mode sombre. */}
              <Illustration
                name={illustrationForCategory(category.id)}
                title={`Rayon ${category.name}`}
                className={
                  index === 0
                    ? 'text-primary h-auto w-full max-w-[220px]'
                    : 'text-primary h-auto w-24 md:w-28'
                }
              />

              <div>
                <p className="font-heading text-foreground text-base leading-tight font-bold md:text-lg">
                  {category.name}
                </p>
                {/* Le compte est CALCULE depuis `products` par `lib/data.ts`. */}
                <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
                  {category.count} produits
                  <Icon
                    name="arrowRight"
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </p>
              </div>
            </Link>
          </li>
        ))}

        {/* Tuile de cloture : elle equilibre la grille et donne une seconde
            sortie vers le catalogue. Contenu CALCULE, pas saisi. */}
        <li className="bento-2x1" data-reveal data-reveal-group="rayons">
          <Link
            href="/catalogue"
            className="bento-tile bento-tile-interactive group flex h-full flex-col justify-center gap-2 bg-muted p-5 no-underline"
          >
            <p className="stat" style={{ color: 'var(--primary)' }}>
              {products.length}
            </p>
            <p className="text-foreground text-sm font-semibold">produits en stock</p>
            <p className="text-muted-foreground text-xs">
              prix en FCFA, stock affiché, recherche par rayon
            </p>
            <span className="text-accent mt-1 inline-flex items-center gap-1.5 text-sm font-semibold">
              Parcourir le catalogue
              <Icon
                name="arrowRight"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Produits populaires (Featured Listings)                          */
/* ------------------------------------------------------------------ */
export function PopularProducts() {
  return (
    <section className="border-border border-y bg-white/0" aria-labelledby="h-popular">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="h-popular" className="font-heading text-foreground text-2xl font-bold sm:text-3xl">
              Les plus commandés
            </h2>
            <p className="text-muted-foreground mt-2">Prix en FCFA, livraison incluse dès 10 000 FCFA.</p>
          </div>
          <Link href="#epicerie" className="btn-outline min-h-12 px-4 text-sm">
            Voir tout le catalogue
            <Icon name="chevronRight" className="h-4 w-4" />
          </Link>
        </div>

        {/* Grille : 2 colonnes a 375px, 3 en tablette, 4 en desktop. */}
        <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
          {popularProducts.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Comment ca marche — 3 etapes                                     */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    n: 1,
    icon: 'mapPin',
    title: 'Vérifiez votre zone',
    text: 'Saisissez votre quartier : délai et frais s’affichent immédiatement.',
  },
  {
    n: 2,
    icon: 'cart',
    title: 'Composez votre panier',
    text: 'Épicerie, pharmacie et produits frais dans la même commande.',
  },
  {
    n: 3,
    icon: 'truck',
    title: 'Recevez chez vous',
    text: 'Paiement mobile money, carte, ou en espèces à la livraison.',
  },
] as const;

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16" aria-labelledby="h-how">
      <h2 id="h-how" className="font-heading text-foreground text-2xl font-bold sm:text-3xl">
        Comment ça marche
      </h2>

      {/* Structure de funnel-3-step-conversion, SANS sa strategie de couleur :
          le catalogue propose « Step 1 (Red/Problem) », ce qui entrerait en
          collision avec --destructive reserve aux erreurs. Etapes en --primary.
          Progressive disclosure : une phrase par etape, pas un paragraphe. */}
      <ol className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
        {STEPS.map((step) => (
          <li key={step.n} className="card relative p-6">
            <div className="flex items-center gap-3">
              <span className="font-heading bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white">
                {step.n}
              </span>
              <Icon name={step.icon} className="text-primary h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="font-heading text-foreground mt-4 text-lg font-semibold">{step.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm">{step.text}</p>

            {/* Mini-CTA par etape, CTA principal en fin de bloc
                (funnel-3-step-conversion : « Each step: mini-CTA. Final: main CTA »). */}
            <Link
              href={step.n === 1 ? '#top' : step.n === 2 ? '#h-popular' : '#zones-desservies'}
              className="text-primary mt-4 inline-flex min-h-12 items-center gap-1.5 text-sm font-semibold no-underline"
            >
              {step.n === 1 ? 'Vérifier ma zone' : step.n === 2 ? 'Voir les produits' : 'Voir les zones'}
              <Icon name="chevronRight" className="h-4 w-4" />
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex justify-center">
        <Link href="/checkout" className="btn-primary px-8">
          Commander maintenant
          <Icon name="arrowRight" className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Preuves — Trust/Safety                                           */
/* ------------------------------------------------------------------ */
export function ProofBand() {
  const servedZones = zones.filter((z) => z.served);

  return (
    <section id="zones-desservies" className="border-border border-t" aria-labelledby="h-proof">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16">
        <h2 id="h-proof" className="font-heading text-foreground text-2xl font-bold sm:text-3xl">
          Délais, frais et zones desservies
        </h2>
        {/* Contrainte de confiance du Master : delai, frais, zones et moyens de
            paiement affiches AVANT le tunnel d'achat, pas apres. */}
        <p className="text-muted-foreground mt-2">
          Tout est affiché avant de commander. Aucune surprise au paiement.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Zones desservies */}
          <div className="card p-6">
            <h3 className="font-heading text-foreground flex items-center gap-2 text-lg font-semibold">
              <Icon name="mapPin" className="text-primary h-5 w-5" />
              {servedZones.length} quartiers desservis
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {servedZones.map((zone) => (
                <li key={`${zone.ville}-${zone.quartier}`} className="flex items-baseline justify-between gap-3">
                  <span className="text-foreground">
                    {zone.quartier}
                    <span className="text-muted-foreground"> · {zone.ville}</span>
                  </span>
                  <span className="text-muted-foreground shrink-0 text-xs">{zone.eta}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-4 text-xs">
              Ouidah et Porto-Novo : ouverture prochaine, liste d’attente disponible.
            </p>
          </div>

          {/* Delais et frais */}
          <div className="card p-6">
            <h3 className="font-heading text-foreground flex items-center gap-2 text-lg font-semibold">
              <Icon name="clock" className="text-primary h-5 w-5" />
              Frais de livraison
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                { k: 'Cotonou centre', v: formatXOF(500), d: '25–45 min' },
                { k: 'Cotonou périphérie', v: formatXOF(800), d: '40–60 min' },
                { k: 'Abomey-Calavi', v: formatXOF(1000), d: '45–75 min' },
                { k: 'Sèmè-Podji', v: formatXOF(1500), d: '60–90 min' },
              ].map((row) => (
                <div key={row.k} className="flex items-baseline justify-between gap-3 border-b border-dashed pb-2 last:border-0">
                  <dt className="text-foreground">
                    {row.k}
                    <span className="text-muted-foreground block text-xs">{row.d}</span>
                  </dt>
                  <dd className="font-heading shrink-0 font-semibold">{row.v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-primary mt-4 flex items-center gap-2 text-sm font-semibold">
              <Icon name="check" className="h-4 w-4" />
              Livraison offerte dès 10 000 FCFA
            </p>
          </div>

          {/* Moyens de paiement — RANGEE STATIQUE, pas de carrousel.
              Le Master et trust-authority-conversion exigent pause/stop,
              controles precedent/suivant et rendu statique sous reduced-motion
              si un carrousel est utilise ; la contrainte locale « pas de
              carrousel lourd » et le style cost:low imposent la rangee fixe. */}
          <div className="card p-6">
            <h3 className="font-heading text-foreground flex items-center gap-2 text-lg font-semibold">
              <Icon name="lock" className="text-primary h-5 w-5" />
              Moyens de paiement
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              Mobile money accepté — la carte reste un moyen secondaire.
            </p>
            <ul className="mt-4 grid gap-2">
              {paymentMethods.map((method) => (
                <li
                  key={method.id}
                  className="bg-muted flex min-h-12 items-center gap-3 rounded-md px-3 py-2"
                >
                  {/* Icone SVG (Lucide). En production : logo officiel de
                      l'operateur, egalement en SVG — jamais d'emoji. */}
                  <span className="text-primary shrink-0">
                    <PaymentIcon kind={method.kind} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="text-foreground block text-sm font-semibold">
                      {method.name}
                    </span>
                    {method.detail && (
                      <span className="text-muted-foreground block truncate text-xs">
                        {method.detail}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Avis : note + quartier, pas seulement un prenom. */}
        <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
          {[
            { name: 'Rodrigue A.', zone: 'Cadjèhoun', stars: 5, text: 'Commandé à 19 h, livré en 32 minutes. Le riz et les tomates étaient frais.' },
            { name: 'Sègla M.', zone: 'Zogbadjè', stars: 5, text: 'Le paiement MoMo a pris du temps mais l’application m’a prévenue. Rien à redire.' },
            { name: 'Fatima B.', zone: 'Fidjrossè', stars: 4, text: 'Pratique pour la pharmacie. J’aimerais plus de références pour bébés.' },
          ].map((review) => (
            <figure key={review.name} className="card p-6">
              <div className="text-primary flex gap-0.5" aria-label={`${review.stars} sur 5`}>
                {Array.from({ length: review.stars }).map((_, i) => (
                  <Icon key={i} name="star" className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-foreground mt-3 text-sm">« {review.text} »</blockquote>
              <figcaption className="text-muted-foreground mt-3 text-xs">
                {review.name} · {review.zone}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. CTA de rappel + WhatsApp                                         */
/* ------------------------------------------------------------------ */
export function FinalCta() {
  return (
    <section className="bg-primary" aria-labelledby="h-final-cta">
      <div className="mx-auto max-w-[1200px] px-4 py-12 text-center sm:px-6 md:py-16">
        <h2 id="h-final-cta" className="font-heading text-2xl font-bold text-white text-balance sm:text-3xl">
          Une commande à passer maintenant&nbsp;?
        </h2>
        <p className="mt-3 text-white/90">
          Vérifiez votre quartier, composez votre panier, payez en mobile money.
        </p>

        <div className="tap-group mt-8 flex flex-wrap justify-center">
          {/* Un seul CTA primaire par viewport : ici c'est le bouton blanc sur vert.
              Contrast : blanc sur #15803D = 5.02:1, conforme. */}
          <Link
            href="/checkout"
            className="bg-card text-primary hover:border-border-strong inline-flex min-h-12 items-center gap-2 rounded-md border px-8 py-3 font-semibold no-underline"
          >
            <Icon name="cart" className="h-5 w-5" />
            Commander
          </Link>

          {/* WhatsApp : canal dominant localement. Icone SVG + libelle explicite,
              accessible au clavier — pas une icone seule. */}
          <a
            href={SUPPORT_WHATSAPP}
            className="inline-flex min-h-12 items-center gap-2 rounded-md border border-white/60 px-8 py-3 font-semibold text-white no-underline"
          >
            <Icon name="message" className="h-5 w-5" />
            Commander sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Catalogue par rayon (ancres utilisees par les tuiles de categories) */
/* ------------------------------------------------------------------ */
export function CategorySections() {
  return (
    <>
      {categories.map((category) => {
        const items = productsByCategory(category.id);
        return (
          <section
            key={category.id}
            id={category.id}
            className="border-border border-t"
            aria-labelledby={`h-${category.id}`}
          >
            <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id={`h-${category.id}`} className="font-heading text-foreground flex items-center gap-3 text-2xl font-bold">
                  <Icon name={category.icon} className="text-primary h-6 w-6" strokeWidth={1.75} />
                  {category.name}
                </h2>
                {/* Sortie vers le rayon COMPLET. La landing ne montre qu'un
                    apercu par rayon ; sans ce lien, un client voulant tout voir
                    n'a aucune issue. Le filtre est porte par l'URL, donc le lien
                    reste partageable et fonctionne sans JavaScript. */}
                <Link
                  href={`/catalogue?cat=${category.id}`}
                  className="text-accent inline-flex min-h-12 items-center gap-1.5 text-sm font-semibold underline underline-offset-4"
                >
                  Voir les {category.count} produits
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
                {items.map((product) => (
                  <ProductTile key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Vitrine bento — visuels raster generes                           */
/* ------------------------------------------------------------------ */
/**
 * Trois visuels generes, en grille asymetrique.
 *
 * POIDS — mesure avec sharp, pas estime :
 *   704 Ko de JPEG sources -> 117 Ko d'AVIF cumules a 640w (facteur 6).
 *   Chaque tuile declare `sizes` pour ne jamais recevoir une variante plus
 *   large que son affichage reel.
 *
 * Les trois tuiles sont SOUS la ligne de flottaison : `loading="lazy"` par
 * defaut, donc aucun de ces octets ne pese sur le LCP. Le hero reste le seul
 * visuel au-dessus, lui non plus pas en `priority` (voir `Hero`).
 *
 * VOILE DE CONTRASTE — alpha 0.72 minimum, et ce n'est pas decoratif :
 *   blanc sur voile 0.72, image blanche derriere (pire cas) = 7.15:1  AAA
 *   blanc sur voile 0.55, meme pire cas                     = 4.00:1  INSUFFISANT
 *   texte secondaire #BBF7D0 sur voile 0.72                 = 5.90:1  AA
 * Descendre sous 0.65 ferait passer sous les 4.5:1 des qu'une zone claire de
 * l'image se trouve derriere le texte. Valeur calculee, pas choisie a l'oeil.
 */
const SCRIM = 'linear-gradient(to top, rgb(12 26 18 / 0.78) 0%, rgb(12 26 18 / 0.42) 45%, transparent 100%)';

const SHOWCASE = [
  {
    src: '/img/livraison.jpg',
    alt: 'Coursier à moto avec un caisson de livraison isotherme vert, dans une rue de Cotonou en fin d’après-midi',
    span: 'bento-2x2',
    title: 'Livré par des coursiers du quartier',
    text: 'Moto, caisse isotherme, et un contact direct par appel ou WhatsApp dès la prise en charge.',
    href: '/suivi',
    cta: 'Voir le suivi en direct',
    icon: 'truck',
  },
  {
    src: '/img/frais.jpg',
    alt: 'Panier de produits frais ouest-africains : ananas, tomates, oranges et gombos',
    span: 'bento-2x1',
    title: 'Le frais, choisi le matin',
    text: 'Ananas, tomates, légumes verts : sélection au marché, livrée dans la journée.',
    href: '/catalogue?cat=frais',
    cta: 'Voir les produits frais',
    icon: 'leaf',
  },
  {
    src: '/img/pharmacie.jpg',
    alt: 'Assortiment de pharmacie disposé sur un fond vert pâle : plaquettes, sirop, thermomètre et tensiomètre',
    span: 'bento-2x1',
    title: 'Pharmacie partenaire',
    text: 'Sans ordonnance en direct ; avec ordonnance, délivrance vérifiée à la préparation.',
    href: '/catalogue?cat=pharmacie',
    cta: 'Voir la pharmacie',
    icon: 'cross',
  },
] as const;

export function Showcase() {
  return (
    <section className="border-border border-t" aria-labelledby="h-showcase">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16">
        <h2 id="h-showcase" className="display-sm mb-2">
          Trois raisons de commander aujourd’hui
        </h2>
        <p className="text-muted-foreground lede mb-8 max-w-2xl">
          Le coursier, le frais et la pharmacie — réunis dans un seul panier et une
          seule livraison.
        </p>

        <div className="bento" data-reveal-group="vitrine">
          {SHOWCASE.map((item) => (
            <div key={item.src} className={item.span} data-reveal data-reveal-group="vitrine">
              <Link
                href={item.href}
                className="bento-tile bento-tile-interactive group relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden p-5 no-underline md:min-h-[260px] md:p-6"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  className="object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0" style={{ background: SCRIM }} />

                <div className="relative">
                  <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-white">
                    <Icon name={item.icon} className="h-4 w-4" />
                    <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-[2px]">
                      {item.cta}
                    </span>
                  </p>
                  <p className="font-heading text-xl leading-tight font-bold text-white md:text-2xl">
                    {item.title}
                  </p>
                  <p className="mt-1.5 max-w-prose text-sm" style={{ color: '#BBF7D0' }}>
                    {item.text}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
