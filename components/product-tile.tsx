import { Icon } from './icon';
import { formatXOF } from '@/lib/format';
import type { Product, StockState } from '@/lib/data';

/**
 * Tuile produit PARTAGEE entre la landing et le catalogue.
 *
 * Extraite de `landing-sections.tsx` pour qu'il n'existe qu'UNE implementation :
 * deux copies divergeraient (meme principe que les tokens sombres, definis une
 * seule fois dans `.dark`). Un ecart ici se verrait immediatement : le meme
 * produit affiche a deux prix differents selon la page.
 *
 * Regles du Master appliquees :
 * - Flat Design : aplat de couleur + icone, aucun degrading, aucune ombre.
 * - Les produits indisponibles restent VISIBLES et marques, jamais retires
 *   silencieusement ; le bouton est desactive mais present, avec `aria-disabled`.
 * - Montants en FCFA via `formatXOF` (separateur U+202F), jamais `Intl` XOF.
 * - Cible tactile >= 48px (`min-h-12`).
 */

const STOCK_LABEL: Record<StockState, { text: string; tone: string }> = {
  in: { text: 'En stock', tone: 'text-primary' },
  low: { text: 'Stock faible', tone: 'text-muted-foreground' },
  out: { text: 'Indisponible', tone: 'text-muted-foreground' },
};

export function StockBadge({ stock }: { stock: StockState }) {
  const { text, tone } = STOCK_LABEL[stock];
  return (
    <span className={`${tone} flex items-center gap-1 text-xs font-medium`}>
      <Icon
        name={stock === 'in' ? 'check' : stock === 'low' ? 'info' : 'close'}
        className="h-3.5 w-3.5"
      />
      {text}
    </span>
  );
}

type ProductTileProps = {
  product: Product;
  /**
   * Niveau de titre adapte au plan de la page : `h3` sur la landing (sous une
   * section `h2`), `h2` sur le catalogue (sous le `h1` de page). Un plan de
   * titres coherent est une exigence d'accessibilite, pas un detail.
   */
  heading?: 'h2' | 'h3';
  /** Rendu plus dense pour les grilles longues (catalogue). */
  dense?: boolean;
};

export function ProductTile({ product, heading = 'h3', dense = false }: ProductTileProps) {
  const soldOut = product.stock === 'out';
  const Heading = heading;

  return (
    <article className="card flex flex-col gap-3 p-0">
      {/* Tuile plate : pas de degrading, pas d'ombre (Flat Design).
          Aucun <img> donc rien a charger en lazy : l'aplat et l'icone sont
          deja dans le HTML et la CSS. */}
      <div className="bg-muted text-primary flex aspect-square items-center justify-center rounded-t-lg">
        <Icon name={product.icon} className={dense ? 'h-8 w-8' : 'h-10 w-10'} strokeWidth={1.5} />
      </div>

      <div className={`flex flex-1 flex-col gap-2 ${dense ? 'p-3' : 'p-4'}`}>
        <Heading className="font-heading text-foreground text-base leading-snug font-semibold">
          {product.name}
        </Heading>
        <p className="text-muted-foreground text-sm">{product.unit}</p>

        {product.prescription && (
          <p className="text-accent flex items-center gap-1 text-xs font-medium">
            <Icon name="shield" className="h-3.5 w-3.5" />
            Ordonnance requise
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2">
          <p className="font-heading text-foreground text-lg font-bold">
            {formatXOF(product.price)}
          </p>
          <StockBadge stock={product.stock} />
        </div>

        {/* Bouton desactive MAIS present quand le produit est indisponible,
            avec aria-disabled et un libelle explicite. */}
        <button
          type="button"
          disabled={soldOut}
          aria-disabled={soldOut}
          className={
            soldOut
              ? 'text-muted-foreground min-h-12 w-full cursor-not-allowed rounded-md border py-2 text-sm font-semibold opacity-60'
              : 'btn-primary w-full py-2 text-sm'
          }
        >
          {soldOut ? 'Indisponible' : 'Ajouter au panier'}
        </button>
      </div>
    </article>
  );
}
