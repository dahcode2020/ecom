import Link from 'next/link';
import { Icon, PaymentIcon } from './icon';
import { ZoneCheck } from './zone-check';
import {
  categories,
  paymentMethods,
  popularProducts,
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
  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="font-heading text-primary mb-4 inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm font-semibold">
              <Icon name="truck" className="h-4 w-4" />
              Cotonou &amp; Abomey-Calavi
            </p>

            {/* h1 unique et reel (SEO) — pas un div stylise. */}
            <h1 className="font-heading text-foreground text-4xl leading-tight font-bold text-balance sm:text-5xl">
              Épicerie et pharmacie livrées chez vous en moins d’une heure
            </h1>

            <p className="text-muted-foreground mt-4 max-w-prose text-lg">
              Produits frais, épicerie, médicaments sans ordonnance et hygiène. Paiement MTN MoMo,
              Moov Money, Wave — ou à la livraison.
            </p>

            {/* Le contenu du hero n'est PAS masque a opacity:0 : c'est le LCP et
                c'est indexable. Aucun scroll reveal sur cette page. */}
            <ul className="text-foreground mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {[
                { icon: 'clock', text: 'Livraison 25–90 min' },
                { icon: 'truck', text: 'Dès 500 FCFA' },
                { icon: 'shieldPlain', text: 'Pharmacie partenaire' },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2">
                  <Icon name={item.icon} className="text-primary h-4 w-4" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA primaire : la verification de zone, au-dessus de la ligne de
              flottaison (marketplace-directory : « Search is the primary CTA »). */}
          <div className="card bg-card p-6 sm:p-8">
            <ZoneCheck />
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
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16" aria-labelledby="h-categories">
      <h2 id="h-categories" className="font-heading text-foreground text-2xl font-bold sm:text-3xl">
        Nos rayons
      </h2>
      {/* Nombre de rayons CALCULE, jamais ecrit a la main : « Six » mentait
          des l'ajout d'un rayon. */}
      <p className="text-muted-foreground mt-2">
        {frenchCardinalCapitalized(categories.length)} rayons, un seul panier.
      </p>

      {/* 2 colonnes mobile, 3 en tablette, 4+ en desktop.
          Tuiles >= 48px, ecart >= 8px. Libelles non tronques. */}
      <ul className="mt-8 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`#${category.id}`}
              className="bg-muted text-foreground hover:border-border-strong flex min-h-12 flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center no-underline"
            >
              <Icon name={category.icon} className="text-primary h-7 w-7" strokeWidth={1.75} />
              {/* Libelle court, une ligne, jamais tronque : la checklist du
                  Master impose « No horizontal scroll on mobile » et le
                  responsive 375px. */}
              <span className="font-heading text-sm leading-tight font-semibold">
                {category.name}
              </span>
              <span className="text-muted-foreground text-xs">{category.count} articles</span>
            </Link>
          </li>
        ))}
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
