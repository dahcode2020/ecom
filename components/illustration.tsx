import type { ReactNode } from 'react';

/**
 * Illustrations SVG par rayon — dessinées sur mesure, inline, zero requete.
 *
 * Elles remplacent le motif initial « carre plat + une icone Lucide », qui etait
 * la premiere cause du rendu juge basique : 30 tuiles identiques, sans matiere ni
 * scene.
 *
 * CONTRAINTES RESPECTEES
 *  - Inline dans le HTML : aucun octet reseau, aucun lazy-load a prevoir.
 *    A comparer aux visuels raster de `public/img/` (~117 Ko en AVIF a 640w) :
 *    ces illustrations coutent ~1 Ko chacune et se mettent en cache avec la page.
 *  - Flat Design : aplats, pas de degrade sur les objets, pas de flou, pas
 *    d'ombre portee realiste. La profondeur vient de couches a faible opacite.
 *  - COULEURS PAR VARIABLES, jamais en hex : `var(--primary)`, `var(--accent)`…
 *    donc les illustrations basculent automatiquement en mode sombre. Des hex
 *    codes en dur resteraient clairs sur fond sombre — exactement le defaut que
 *    `color-scheme` corrigait deja pour les controles natifs.
 *  - `role="img"` + `<title>` : une scene illustree porte du sens, elle n'est
 *    pas decorative. Le titre est fourni par l'appelant pour rester contextuel.
 */

export type IllustrationName =
  | 'epicerie'
  | 'pharmacie'
  | 'boissons'
  | 'hygiene'
  | 'frais'
  | 'maison';

type Props = {
  name: IllustrationName;
  /** Titre accessible de la scene. Obligatoire : ce n'est pas decoratif. */
  title: string;
  className?: string;
};

/** Socle commun : une forme organique en fond, dans le ton `--muted`. */
function Backdrop({ children }: { children?: ReactNode }) {
  return (
    <>
      {/* Forme organique (courbe, pas un rectangle) : l'arrondi irregulier est
          ce qui distingue une illustration d'un pictogramme. */}
      <path
        d="M60 6c26 0 50 12 52 34 2 21-16 40-42 44-27 4-56-4-62-24C2 40 22 6 60 6Z"
        fill="var(--muted)"
      />
      {children}
    </>
  );
}

/** Ombre portee plate, une seule couche a faible opacite. */
function GroundShadow({ cx = 60, rx = 34 }: { cx?: number; rx?: number }) {
  return <ellipse cx={cx} cy={78} rx={rx} ry={4} fill="var(--foreground)" opacity="0.1" />;
}

const SCENES: Record<IllustrationName, () => ReactNode> = {
  /* --- Epicerie : sac de riz, bouteille d'huile, boite de pates --------- */
  epicerie: () => (
    <>
      <GroundShadow />
      {/* Sac de riz */}
      <path
        d="M24 40c0-4 3-6 8-6h16c5 0 8 2 8 6l3 32c0 4-3 6-8 6H29c-5 0-8-2-8-6l3-32Z"
        fill="var(--primary)"
      />
      <path d="M32 34h16l-2-8H34l-2 8Z" fill="var(--foreground)" opacity="0.22" />
      <rect x="31" y="50" width="18" height="12" rx="2" fill="var(--card)" opacity="0.9" />
      <path d="M34 55h12M34 58h8" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" />
      {/* Bouteille d'huile */}
      <path
        d="M70 44c0-3 2-5 4-6V30h6v8c2 1 4 3 4 6v34c0 4-2 6-6 6H76c-4 0-6-2-6-6V44Z"
        fill="var(--accent)"
      />
      <rect x="72" y="26" width="8" height="6" rx="2" fill="var(--foreground)" opacity="0.55" />
      <rect x="72" y="52" width="12" height="14" rx="2" fill="var(--card)" opacity="0.85" />
      {/* Pates */}
      <path d="M92 52h14l3 26H89l3-26Z" fill="var(--secondary)" />
      <path
        d="M93 46c2-4 5-6 6-10M99 46c2-4 5-6 6-10"
        stroke="var(--foreground)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.45"
      />
    </>
  ),

  /* --- Pharmacie : croix, flacon de sirop, plaquette -------------------- */
  pharmacie: () => (
    <>
      <GroundShadow />
      {/* Flacon de sirop */}
      <path
        d="M34 38h20v6c4 2 6 5 6 9v25c0 4-3 7-7 7H35c-4 0-7-3-7-7V53c0-4 2-7 6-9v-6Z"
        fill="var(--primary)"
      />
      <rect x="36" y="30" width="16" height="9" rx="2.5" fill="var(--foreground)" opacity="0.5" />
      <rect x="33" y="56" width="22" height="16" rx="2.5" fill="var(--card)" opacity="0.92" />
      {/* Croix sur l'etiquette : le signe le plus lisible du rayon */}
      <path
        d="M42 60h4v-4h4v4h4v4h-4v4h-4v-4h-4v-4Z"
        fill="var(--primary)"
      />
      {/* Plaquette de comprimes */}
      <g transform="rotate(-8 84 58)">
        <rect x="66" y="42" width="36" height="32" rx="5" fill="var(--accent)" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <circle
              key={`${row}-${col}`}
              cx={74 + col * 10}
              cy={50 + row * 10}
              r="3.4"
              fill="var(--card)"
              opacity="0.95"
            />
          )),
        )}
      </g>
    </>
  ),

  /* --- Boissons : bouteille, verre, bulles ------------------------------ */
  boissons: () => (
    <>
      <GroundShadow />
      {/* Bouteille */}
      <path
        d="M40 26h10v10c5 3 8 8 8 14v28c0 4-3 7-7 7H39c-4 0-7-3-7-7V50c0-6 3-11 8-14V26Z"
        fill="var(--secondary)"
      />
      <rect x="39" y="20" width="12" height="8" rx="2.5" fill="var(--foreground)" opacity="0.55" />
      <rect x="34" y="54" width="22" height="18" rx="2.5" fill="var(--card)" opacity="0.85" />
      {/* Verre */}
      <path d="M68 44h26l-4 34c-.4 3-2 5-5 5H75c-3 0-4.6-2-5-5l-2-34Z" fill="var(--accent)" opacity="0.85" />
      <path d="M70 52h22l-3 26H73l-3-26Z" fill="var(--card)" opacity="0.55" />
      {/* Bulles */}
      <circle cx="78" cy="62" r="2.6" fill="var(--card)" opacity="0.9" />
      <circle cx="85" cy="70" r="1.8" fill="var(--card)" opacity="0.8" />
      <circle cx="82" cy="55" r="1.4" fill="var(--card)" opacity="0.7" />
    </>
  ),

  /* --- Hygiene & entretien : vaporisateur, savon, eponge ---------------- */
  hygiene: () => (
    <>
      <GroundShadow />
      {/* Vaporisateur */}
      <path d="M30 44h22v34c0 4-3 7-7 7H37c-4 0-7-3-7-7V44Z" fill="var(--accent)" />
      <path d="M34 44V34h14v10" fill="var(--foreground)" opacity="0.45" />
      <path d="M48 32h10l6-6v12l-6-6H48v-0Z" fill="var(--primary)" />
      <rect x="34" y="56" width="14" height="16" rx="2.5" fill="var(--card)" opacity="0.88" />
      {/* Savon */}
      <rect x="62" y="56" width="26" height="22" rx="6" fill="var(--primary)" />
      <path d="M68 62c3-2 8-2 11 0" stroke="var(--card)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {/* Gouttes */}
      <path d="M96 40c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" fill="var(--secondary)" />
      <circle cx="104" cy="62" r="3" fill="var(--secondary)" opacity="0.6" />
    </>
  ),

  /* --- Produits frais : ananas, tomate, feuilles ------------------------ */
  frais: () => (
    <>
      <GroundShadow />
      {/* Ananas */}
      <ellipse cx="44" cy="58" rx="17" ry="22" fill="var(--secondary)" />
      {/* Le treillis est ce qui rend l'ananas lisible sans photo */}
      <g stroke="var(--foreground)" strokeWidth="1.2" opacity="0.3">
        <path d="M31 46l26 24M31 58l26 12M31 36l26 12M57 46L31 70M57 58L31 82M57 36L31 60" />
      </g>
      <path
        d="M44 36c-4-6-9-8-13-9 5-2 11-1 14 3 1-6 4-10 8-12-2 5-2 9-1 12 4-4 9-5 13-4-5 2-9 5-11 10h-10Z"
        fill="var(--primary)"
      />
      {/* Tomate */}
      <circle cx="82" cy="62" r="15" fill="var(--destructive)" />
      <path
        d="M82 50c-3-3-7-3-9-2 3 0 5 2 6 4-3-2-7-1-8 1 3-1 6 0 8 2h6c1-3 4-4 7-3-2-1-5-1-7 1 1-2 3-4 6-4-2-1-6-1-9 1Z"
        fill="var(--primary)"
      />
      {/* Feuille */}
      <path d="M98 40c8 2 12 8 12 14-7 0-13-4-15-11l3-3Z" fill="var(--primary)" opacity="0.85" />
    </>
  ),

  /* --- Maison & cuisine : casserole, poele, ustensiles ------------------ */
  maison: () => (
    <>
      <GroundShadow />
      {/* Casserole */}
      <path d="M24 48h44v20c0 6-5 10-11 10H35c-6 0-11-4-11-10V48Z" fill="var(--primary)" />
      <rect x="20" y="44" width="52" height="7" rx="3.5" fill="var(--foreground)" opacity="0.5" />
      <path d="M68 52h12a4 4 0 0 1 0 8H68v-8Z" fill="var(--foreground)" opacity="0.45" />
      {/* Vapeur */}
      <path
        d="M38 36c-2-4 2-6 0-10M48 36c-2-4 2-6 0-10M58 36c-2-4 2-6 0-10"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />
      {/* Ustensiles */}
      <g transform="rotate(12 96 60)">
        <rect x="92" y="34" width="5" height="34" rx="2.5" fill="var(--accent)" />
        <path d="M88 68h13l-2 12H90l-2-12Z" fill="var(--secondary)" />
      </g>
    </>
  ),
};

export function Illustration({ name, title, className }: Props) {
  const Scene = SCENES[name];
  return (
    // `aria-label` et NON `aria-labelledby` + <title id> : la landing affiche
    // chaque rayon DEUX fois (tuiles de `Categories()` et sections de
    // `CategorySections()`), donc un id derive de `name` serait duplique —
    // `aria-labelledby` resoudrait alors vers le premier, et un validateur
    // signalerait l'infraction. `useId` aurait regle le cas, mais sa
    // disponibilite en Server Component n'est pas garantie : `aria-label` est
    // deterministe et fonctionne partout. Le <title> sans id reste utile au
    // lecteur d'ecran et fournit l'infobulle native.
    <svg
      viewBox="0 0 120 90"
      className={className}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{title}</title>
      <Backdrop />
      <Scene />
    </svg>
  );
}

/**
 * Variante compacte pour les tuiles produit du catalogue : la meme scene, sans
 * le socle organique, pour ne pas alourdir une grille de 30 elements.
 * Le poids compte : 30 illustrations completes ajouteraient ~30 Ko de SVG au
 * HTML de la page catalogue.
 */
export function IllustrationCompact({ name, title, className }: Props) {
  const Scene = SCENES[name];
  return (
    <svg viewBox="0 0 120 90" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <Scene />
    </svg>
  );
}

/** Mappe un identifiant de rayon du catalogue a une illustration. */
export function illustrationForCategory(categoryId: string): IllustrationName {
  const known: IllustrationName[] = ['epicerie', 'pharmacie', 'boissons', 'hygiene', 'frais', 'maison'];
  return (known as string[]).includes(categoryId) ? (categoryId as IllustrationName) : 'epicerie';
}

/* ================================================================== */
/*  Variante PRODUIT — socle d'illustration pour les tuiles catalogue  */
/* ================================================================== */
/**
 * Les 6 scenes par rayon ne suffisent pas au catalogue : 7 produits d'epicerie
 * y partageraient la meme illustration, ce qui remplacerait une repetition
 * (l'icone) par une autre.
 *
 * `ProductArtBackdrop` fournit donc le MEME langage graphique — socle organique,
 * aplats, couches a faible opacite — en COUCHE DE FOND, l'icone propre a chaque
 * produit restant un element HTML pose par-dessus. Le resultat garde une identite
 * distincte pour chacun des 30 produits, pour ~0,4 Ko de SVG par tuile.
 *
 * Pourquoi pas un `foreignObject` enveloppant l'icone dans le SVG (solution
 * ecrite puis abandonnee) : son rendu est irregulier dans Safari, il ajoute une
 * exigence `xmlns`, et il n'apporte rien qu'un `position: absolute` ne fasse
 * plus simplement. Un SVG reste un SVG, un element HTML reste un element HTML.
 *
 * `aria-hidden` : c'est une couche decorative. Le nom du produit est deja le
 * titre de la tuile, donc rien n'est perdu pour un lecteur d'ecran.
 */
export function ProductArtBackdrop({
  categoryId,
  className,
}: {
  /** Sert a choisir un accent coherent avec le rayon. */
  categoryId: string;
  className?: string;
}) {
  // Accent par rayon : vert pour le frais et l'epicerie, bleu pour la pharmacie
  // et l'hygiene (codes de couleur officinaux), vert clair pour les boissons.
  const accent =
    categoryId === 'pharmacie' || categoryId === 'hygiene'
      ? 'var(--accent)'
      : categoryId === 'boissons'
        ? 'var(--secondary)'
        : 'var(--primary)';

  return (
    <svg
      viewBox="0 0 120 90"
      className={className}
      aria-hidden="true"
      // `slice` : le socle remplit toute la tuile, comme une image en
      // `object-cover`, sans deformation ni bande vide.
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Socle organique : l'arrondi irregulier est ce qui casse l'alignement
          mecanique des carres et fait « illustration » plutot que « picto ». */}
      <path
        d="M60 4c28 0 54 13 56 36 2 22-17 42-45 46-29 4-60-4-66-25C-1 40 20 4 60 4Z"
        fill="var(--card)"
        opacity="0.85"
      />
      {/* Deux aplats secondaires : profondeur sans degrade ni ombre portee,
          conformement au Flat Design conserve comme base. */}
      <circle cx="94" cy="22" r="12" fill={accent} opacity="0.16" />
      <circle cx="24" cy="68" r="8" fill="var(--secondary)" opacity="0.18" />
      <circle cx="102" cy="70" r="5" fill={accent} opacity="0.12" />
    </svg>
  );
}
