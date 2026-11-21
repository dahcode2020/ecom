import type { ReactNode } from 'react';

/**
 * En-tete de section editoriale : sur-titre + titre + chapo + action.
 *
 * POURQUOI CE COMPOSANT EXISTE. La landing parlait deux langues : le hero, les
 * rayons et la vitrine etaient en bento editorial (h1 en `.display`, clamp
 * 36 -> 68 px, graisse 800), puis les cinq sections suivantes retombaient sur
 * `text-2xl sm:text-3xl` (24 -> 30 px) pose au-dessus de `card p-6` en grilles
 * uniformes. Rupture de 68 px a 30 px, aucun chapo sur deux sections, un
 * sous-titre sur les autres : la page culminait en haut puis se dedefinissait.
 *
 * Ce composant impose UN motif a toutes les sections. `.display-sm` (cree pour
 * ca et utilise deux fois seulement jusqu'ici) porte desormais chaque titre.
 *
 * Server Component : il n'embarque AUCUN JavaScript cote client.
 */
export function SectionHeader({
  eyebrow,
  title,
  titleId,
  lede,
  action,
  className = '',
}: {
  /** Etiquette de section, en petites capitales. Ne jamais la poser sur un fond
   *  `--muted` en theme clair : --primary n'y donne que 4.34:1 (mesure). */
  eyebrow?: string;
  title: ReactNode;
  /** Doit correspondre au `aria-labelledby` de la section englobante. */
  titleId: string;
  /** Chapo. `max-w-[62ch]` : une ligne de 90 caracteres est illisible. */
  lede?: ReactNode;
  /** Action alignee sur la ligne de base du titre, a droite en desktop. */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`section-head ${className}`.trim()} data-reveal>
      <div className="min-w-0 flex-1">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={titleId} className="display-sm text-foreground">
          {title}
        </h2>
        {lede && (
          <p className="text-muted-foreground mt-3 max-w-[62ch] text-base sm:text-lg">{lede}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
