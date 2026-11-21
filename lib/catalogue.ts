import { categories, products, type Product } from './data';
import { normalizeForMatch } from './format';

/**
 * Logique de filtrage du catalogue — FONCTIONS PURES, sans React ni DOM.
 *
 * Separee du rendu pour deux raisons :
 *  - testable directement (`npx tsx -e`), sans monter de composant ;
 *  - le catalogue serveur et les controles client lisent la MEME fonction, donc
 *    un filtre ne peut pas afficher un compte different de la liste affichee.
 */

export type SortKey = 'pertinence' | 'prix-asc' | 'prix-desc' | 'nom';
export type AvailabilityKey = 'tous' | 'dispo';

export type CatalogueQuery = {
  q: string;
  cat: string;
  dispo: AvailabilityKey;
  tri: SortKey;
};

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'pertinence', label: 'Pertinence' },
  { value: 'prix-asc', label: 'Prix croissant' },
  { value: 'prix-desc', label: 'Prix décroissant' },
  { value: 'nom', label: 'Nom (A → Z)' },
];

export const AVAILABILITY_OPTIONS: { value: AvailabilityKey; label: string }[] = [
  { value: 'tous', label: 'Tous les produits' },
  // Filtrer les indisponibles est un CHOIX explicite de l'utilisateur : ce
  // n'est pas la meme chose que de les retirer silencieusement du catalogue.
  { value: 'dispo', label: 'Disponibles uniquement' },
];

const VALID_SORTS = new Set<string>(SORT_OPTIONS.map((o) => o.value));
const VALID_AVAILABILITY = new Set<string>(AVAILABILITY_OPTIONS.map((o) => o.value));
const VALID_CATEGORIES = new Set<string>(categories.map((c) => c.id));

/**
 * Lit les parametres d'URL et les VALIDE.
 *
 * Toute valeur inconnue retombe sur le defaut plutot que de propager une chaine
 * arbitraire : une URL partagee ou modifiee a la main ne doit jamais casser la
 * page ni produire un filtrage incoherent.
 */
export function parseCatalogueParams(params: Record<string, string | string[] | undefined>): CatalogueQuery {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? (value[0] ?? '') : (value ?? '');

  const cat = first(params.cat);
  const dispo = first(params.dispo);
  const tri = first(params.tri);

  return {
    q: first(params.q).slice(0, 80),
    cat: VALID_CATEGORIES.has(cat) ? cat : '',
    dispo: VALID_AVAILABILITY.has(dispo) ? (dispo as AvailabilityKey) : 'tous',
    tri: VALID_SORTS.has(tri) ? (tri as SortKey) : 'pertinence',
  };
}

/**
 * Recherche sans accents ni casse. `Cotonou`, `cotonou` et `COTONOU` matchent
 * pareil ; chercher « pharm » trouve les produits de la categorie Pharmacie.
 *
 * Le champ de recherche porte sur le nom, l'unite ET la categorie : un client
 * qui cherche « epicerie » ou « 5 kg » doit obtenir quelque chose.
 */
function matchesQuery(product: Product, query: string): boolean {
  if (!query) return true;
  const category = categories.find((c) => c.id === product.categoryId);
  const haystack = normalizeForMatch(
    [product.name, product.unit, category?.name ?? ''].join(' '),
  );
  // Chaque terme doit matcher (ET implicite) : « riz 5 » trouve le sac de 5 kg.
  return normalizeForMatch(query)
    .split(' ')
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function filterProducts(query: CatalogueQuery): Product[] {
  const filtered = products.filter((product) => {
    if (query.cat && product.categoryId !== query.cat) return false;
    if (query.dispo === 'dispo' && product.stock === 'out') return false;
    if (!matchesQuery(product, query.q)) return false;
    return true;
  });

  switch (query.tri) {
    case 'prix-asc':
      return [...filtered].sort((a, b) => a.price - b.price);
    case 'prix-desc':
      return [...filtered].sort((a, b) => b.price - a.price);
    case 'nom':
      return [...filtered].sort((a, b) =>
        a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }),
      );
    case 'pertinence':
    default:
      // Ordre du catalogue : populaires d'abord, puis indisponibles en dernier.
      // Un produit indisponible reste visible (regle du Master) mais ne doit pas
      // occuper la premiere place d'une liste triee par pertinence.
      return [...filtered].sort((a, b) => {
        const popularDelta = Number(b.popular ?? false) - Number(a.popular ?? false);
        if (popularDelta !== 0) return popularDelta;
        const stockRank = (p: Product) => (p.stock === 'out' ? 1 : 0);
        return stockRank(a) - stockRank(b);
      });
  }
}

/**
 * Construit l'URL partageable correspondant a un jeu de filtres.
 * Les parametres au defaut sont OMIS : l'URL reste courte et lisible.
 */
export function buildCatalogueUrl(query: CatalogueQuery): string {
  const params = new URLSearchParams();
  if (query.q.trim()) params.set('q', query.q.trim());
  if (query.cat) params.set('cat', query.cat);
  if (query.dispo !== 'tous') params.set('dispo', query.dispo);
  if (query.tri !== 'pertinence') params.set('tri', query.tri);
  const search = params.toString();
  return search ? `/catalogue?${search}` : '/catalogue';
}

/** Libelle de categorie, pour le fil d'Ariane et le titre de page. */
export function categoryLabel(id: string): string {
  return categories.find((c) => c.id === id)?.name ?? 'Toutes les catégories';
}
