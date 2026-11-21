import Link from 'next/link';
import type { Metadata } from 'next';
import { Icon } from '@/components/icon';
import { ProductTile } from '@/components/product-tile';
import { CatalogueControls } from '@/components/catalogue-controls';
import { SiteHeader } from '@/components/site-header';
import { categories, products } from '@/lib/data';
import { categoryLabel, filterProducts, parseCatalogueParams } from '@/lib/catalogue';
import { SUPPORT_WHATSAPP } from '@/lib/contact';

/**
 * Catalogue — grille dense, filtres, tri.
 *
 * RENDU : Server Component. La liste filtree est rendue COTE SERVEUR a partir
 * des parametres d'URL, donc :
 *  - le contenu est indexable et partageable (`/catalogue?cat=frais&tri=prix-asc`) ;
 *  - il fonctionne SANS JavaScript (le formulaire est un vrai `method="get"`) ;
 *  - aucun produit n'est jamais masque a `opacity: 0` dans l'attente d'une
 *    animation (regle de pages/landing.md, valable aussi ici).
 *
 * CACHE : `searchParams` empeche la pre-generation, donc la route est dynamique.
 * Mesure sans en-tete explicite, Next lui appliquait son defaut
 * `private, no-cache, no-store` : chaque filtre refaisait un rendu complet, sans
 * jamais profiter du cache — contraire a la contrainte bas debit. Or cette page
 * ne lit ni cookie ni session, uniquement des donnees publiques.
 * `next.config.ts` pose donc `public, s-maxage=60, stale-while-revalidate=300`,
 * soit la meme borne d'obsolescence que la landing. Si du contenu personnalise
 * apparaissait ici, cet en-tete devrait etre retire (voir le commentaire dans la
 * config). Verifie par `curl -D -`.
 *
 * IMAGES : aucune. Les tuiles sont des aplats + icones SVG inline, donc le
 * conseil « lazy load below-fold images » ne s'applique pas — il n'y a pas
 * d'octets d'image a differer. Si de vraies photos arrivent, il faudra
 * `next/image` avec `loading="lazy"` sous la ligne de flottaison.
 */

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const query = parseCatalogueParams(await searchParams);
  const cat = query.cat ? categoryLabel(query.cat) : null;
  const title = cat ? `Catalogue — ${cat}` : 'Catalogue';
  return {
    title: `${title} | Quick Commerce Cotonou`,
    description: cat
      ? `${cat} livrés à Cotonou en 25 à 90 minutes. Prix en FCFA, stock affiché en temps réel, paiement MTN MoMo, Moov Money ou Wave.`
      : 'Épicerie, pharmacie, boissons, produits frais et hygiène livrés à Cotonou en 25 à 90 minutes. Prix en FCFA, stock affiché, paiement mobile money.',
    alternates: { canonical: '/catalogue' },
  };
}

export default async function CataloguePage({ searchParams }: { searchParams: SearchParams }) {
  // Next 15 : `searchParams` est une promesse, il faut l'attendre.
  const query = parseCatalogueParams(await searchParams);
  const results = filterProducts(query);
  const catLabel = query.cat ? categoryLabel(query.cat) : null;

  return (
    <>
      <SiteHeader cartCount={0} />

      <main id="contenu" className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-6 lg:py-8">
        {/* Fil d'Ariane : la landing est la racine, le catalogue une section. */}
        <nav aria-label="Fil d'Ariane" className="mb-4">
          <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <Link href="/" className="text-accent underline underline-offset-4">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true">
              <Icon name="chevronRight" className="h-3.5 w-3.5" />
            </li>
            <li>
              {/* Page courante : pas un lien, et aria-current="page". */}
              <span aria-current="page" className="text-foreground font-medium">
                {catLabel ?? 'Catalogue'}
              </span>
            </li>
          </ol>
        </nav>

        <header className="mb-6">
          <h1 className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            {catLabel ?? 'Catalogue'}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-base">
            {products.length} produits disponibles à Cotonou, livrés en 25 à 90 minutes
            selon le quartier. Prix en FCFA, stock affiché.
          </p>
        </header>

        <div className="mb-6">
          <CatalogueControls
            categories={categories}
            query={query}
            resultCount={results.length}
            totalCount={products.length}
          />
        </div>

        {results.length === 0 ? (
          /* ETAT VIDE : jamais un ecran blanc. On explique, on propose une
             sortie, et on garde le lien avec le support (contrainte locale :
             WhatsApp est le canal de commande et d'assistance). */
          <section className="card flex flex-col items-start gap-4 p-6 md:p-8" aria-labelledby="vide-titre">
            <h2 id="vide-titre" className="font-heading text-foreground text-xl font-bold">
              Aucun produit ne correspond à ces filtres
            </h2>
            <p className="text-muted-foreground text-sm">
              {query.q.trim() ? (
                <>
                  Rien ne correspond à « <span className="text-foreground font-medium">{query.q.trim()}</span> »
                  {catLabel ? ` dans ${catLabel}` : ''}. Essayez un terme plus court, ou retirez un filtre.
                </>
              ) : (
                <>Cette combinaison de filtres ne renvoie aucun produit. Retirez-en un pour élargir la recherche.</>
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/catalogue" className="btn-primary inline-flex min-h-12 items-center px-5 text-sm">
                Voir tout le catalogue
              </Link>
              <a
                href={SUPPORT_WHATSAPP}
                rel="noopener noreferrer"
                target="_blank"
                className="btn-outline inline-flex min-h-12 items-center gap-2 px-5 text-sm"
              >
                <Icon name="message" className="h-4 w-4" />
                Demander sur WhatsApp
              </a>
            </div>
          </section>
        ) : (
          /* Grille dense (densite elevee demandee pour le catalogue), 2 colonnes
             des 375px : une tuile par ligne gaspillerait l'ecran mobile. */
          <section aria-label={`Résultats : ${results.length} produits`}>
            <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {results.map((product) => (
                <li key={product.id}>
                  <ProductTile product={product} heading="h2" dense />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className="border-border bg-card border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 py-6 text-sm md:px-6">
          <p>
            Produits soumis à ordonnance : la délivrance reste conditionnée à une
            ordonnance valide, vérifiée à la préparation.
          </p>
          <p>
            <Link href="/" className="text-accent underline underline-offset-4">
              Retour à l’accueil
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
