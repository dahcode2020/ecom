'use client';

import { useEffect, useState, type ComponentType, type ReactNode } from 'react';

/**
 * Surface « Liquid Glass » — encapsulation de `liquid-glass-react`.
 *
 * PERIMETRE, dicte par la fiche du style dans `styles.csv` et non par l'effet
 * de mode. Liquid Glass y est decrit comme :
 *   Best For      : « Apple-platform navigation, controls, and system-aligned
 *                    app chrome »
 *   Do Not Use For: « content layers, dense reading surfaces, or custom effects
 *                    without accessibility fallbacks »
 * Ce composant est donc reserve au CHROME et aux CONTROLES. Il n'est
 * volontairement pas utilise sur la grille du catalogue (30 tuiles = surface de
 * lecture dense), ni sur les tuiles produit, ni sur les champs de formulaire.
 *
 * ---------------------------------------------------------------------------
 * POURQUOI CETTE ENCAPSULATION EST OBLIGATOIRE
 * ---------------------------------------------------------------------------
 * 1. CRASH SSR. La librairie lit `navigator.userAgent` DIRECTEMENT dans le
 *    corps du rendu (src/index.tsx:180, `const isFirefox = ...`), sans garde
 *    `typeof navigator` ni `useEffect`. Rendue cote serveur par l'App Router,
 *    elle leverait `ReferenceError: navigator is not defined`. Elle n'est donc
 *    jamais importee au niveau module : le `import()` dynamique ci-dessous ne
 *    s'execute que dans le navigateur.
 *
 * 2. BUDGET JS. La librairie pese 34 454 o gzip (mesure sur le dist publie).
 *    Le budget First Load de pages/landing.md est de 130 Ko et la landing etait
 *    a 123 Ko : l'importer dans le chunk partage aurait fait ~157 Ko, soit 21 %
 *    de depassement. Chargee apres l'hydratation, elle reste HORS du First Load.
 *
 * 3. PAS DE `'use client'` dans le paquet publie (verifie sur dist/index.esm.js) :
 *    sans cette encapsulation, l'import dans un Server Component echouerait.
 *
 * 4. `next/dynamic` n'est PAS utilise, volontairement : son etat `loading`
 *    rendrait `null` le temps de charger le chunk, donc le contenu disparaitrait
 *    une frame. Ici les enfants sont rendus en permanence, dans l'une OU l'autre
 *    branche, jamais en double (pas d'ids ni d'ARIA dupliques).
 *
 * ---------------------------------------------------------------------------
 * LES QUATRE GARDE-FOUS (checklist du style : « Test reduced transparency »,
 * « Test reduced motion », « Verify text and control contrast »)
 * ---------------------------------------------------------------------------
 */

type LiquidGlassComponent = ComponentType<{
  children?: ReactNode;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number;
  overLight?: boolean;
  mode?: 'standard' | 'polar' | 'prominent' | 'shader';
  className?: string;
  padding?: string;
  onClick?: () => void;
}>;

type Props = {
  children: ReactNode;
  /** Classes du REPLI solide. S'appliquent aussi sous le verre, pour la teinte. */
  fallbackClassName?: string;
  className?: string;
  cornerRadius?: number;
  padding?: string;
  onClick?: () => void;
  /**
   * `overLight` active la variante pour fond clair de la librairie (flou 12px
   * au lieu de 4, ombre portee plus forte). A `true` sur les surfaces posees
   * sur des photos.
   */
  overLight?: boolean;
};

/** Capacites detectees. `null` = pas encore mesure (rendu serveur / 1er paint). */
type Capability = { glass: boolean; reduceMotion: boolean };

function detect(): Capability {
  // `backdrop-filter` est le mecanisme central : sans lui la librairie ne
  // produit qu'une ombre et un contour, donc autant garder le repli solide.
  const supportsBlur =
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    (CSS.supports('backdrop-filter', 'blur(4px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(4px)'));

  // `prefers-reduced-transparency: reduce` — l'utilisateur refuse la
  // transparence. C'est une preference DISTINCTE de reduced-motion, et la
  // respecter n'est pas optionnel : c'est le motif principal d'echec
  // d'accessibilite du glassmorphism.
  let reduceTransparency = false;
  let reduceMotion = false;
  try {
    reduceTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    // matchMedia indisponible : on reste sur le repli solide, sans risque.
    return { glass: false, reduceMotion: true };
  }

  return { glass: supportsBlur && !reduceTransparency, reduceMotion };
}

export function GlassSurface({
  children,
  fallbackClassName = '',
  className = '',
  cornerRadius = 16,
  padding = '0px',
  onClick,
  overLight = false,
}: Props) {
  // `null` au premier rendu, cote serveur comme client : le HTML est identique,
  // donc aucune erreur d'hydratation. La detection ne se fait qu'apres le montage.
  const [capability, setCapability] = useState<Capability | null>(null);
  const [Glass, setGlass] = useState<LiquidGlassComponent | null>(null);

  useEffect(() => {
    const detected = detect();
    setCapability(detected);
    if (!detected.glass) return;

    let cancelled = false;
    // Import DIFFERE : ce chunk n'est jamais dans le First Load JS, et n'est
    // telecharge que si le verre est reellement applicable sur cet appareil.
    import('liquid-glass-react')
      .then((mod) => {
        if (!cancelled) setGlass(() => mod.default as LiquidGlassComponent);
      })
      .catch(() => {
        // Echec reseau ou chunk indisponible : on reste sur le repli solide.
        // Le contenu ne doit jamais dependre de la reussite de cet import.
        if (!cancelled) setGlass(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const useGlass = capability?.glass === true && Glass !== null;

  if (!useGlass) {
    // REPLI SOLIDE — aussi le rendu serveur, le premier paint, et tout appareil
    // sans backdrop-filter ou demandant moins de transparence. Le contenu est
    // toujours la, avec un contraste garanti par `--card`.
    return (
      <div className={`${fallbackClassName} ${className}`.trim()} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <Glass
      // `glass-fill` neutralise le `display:inline-flex` que la librairie pose en
      // style INLINE sur sa couche interne : sans lui, la surface se contracte sur
      // son contenu au lieu de remplir sa cellule bento ou la barre mobile pleine
      // largeur. Voir la regle scopée dans globals.css.
      className={`glass-fill ${className}`.trim()}
      cornerRadius={cornerRadius}
      padding={padding}
      onClick={onClick}
      overLight={overLight}
      // Valeurs volontairement MODESTES. Le style est annonce
      // `cost:moderate | drivers: animation, blur`, et la cible du projet est un
      // reseau 3G/4G instable sur des appareils d'entree de gamme.
      blurAmount={0.08} // -> blur reel (4 + 0.08*32) = 6,6px, sous les 10-20px
      // de la fiche Glassmorphism : suffisant pour le materiau, moins couteux.
      saturation={150}
      displacementScale={64}
      aberrationIntensity={1} // faible : l'aberration chromatique forte distrait
      // et la fiche du style demande « Apply color judiciously ».
      // Recette motion : `elasticity` est le « liquid feel », donc du mouvement.
      // A 0 si l'utilisateur demande moins de mouvement — le materiau reste,
      // seule la deformation au survol disparait.
      elasticity={capability?.reduceMotion ? 0 : 0.2}
      // Ombre portee : la librairie pose en inline `0 12px 40px rgb(0 0 0 /.25)`
      // (ou 0.75 si `overLight`). Non surchargeable sans `!important`, et ici
      // ASSUMEE : la regle Flat Design du Master interdit les ombres SAUF sur les
      // « calques flottants (modales, dropdowns, sheets) » — une surface de verre
      // posee au-dessus du contenu qui defile en est un, par definition. C'est
      // aussi ce qui separe le calque sans recourir a une bordure epaisse.
      //
      // `standard` et non `shader` : le mode shader genere une carte de
      // deplacement au runtime, cout inutile pour du chrome.
      mode="standard"
    >
      {/* COUCHE DE TEINTE — non decorative, valeur calculee.
          Le verre pur laisse voir le fond : mesure sur les cinq fonds
          reellement possibles sous une barre collante, le texte
          `--foreground` tombe a **1.00:1** au pire cas (au-dessus du hero
          inverse), c'est-a-dire invisible.
            alpha 0.65 -> 4.09:1  insuffisant
            alpha 0.72 -> 4.90:1  plancher AA
            alpha 0.78 -> 5.66:1  RETENU (7.41:1 en mode sombre)
          C'est la mise en oeuvre de « Keep content on a separate layer » : le
          contenu repose sur cette couche, pas sur le verre. */}
      <div
        className={fallbackClassName}
        style={{
          backgroundColor: 'var(--glass-tint)',
          borderRadius: `${cornerRadius}px`,
        }}
      >
        {children}
      </div>
    </Glass>
  );
}
