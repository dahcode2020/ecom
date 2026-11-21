'use client';

import { useEffect } from 'react';

/**
 * Scroll reveal — implémentation des recettes 4 et 5 de `motion.csv`.
 *
 * Recette 4 [Subtle]  : 300-400ms, power1.out, décalage y 8-16px.
 * Recette 5 [Standard]: « Scope the ScrollTrigger to the section container so
 *   it doesn't re-scan the whole page » — ici un seul observer racine, et les
 *   délais de stagger sont calculés PAR GROUPE (`data-reveal-group`), pas sur
 *   toute la page.
 *
 * GARDE-FOUS RESPECTÉS
 *  - Recette 4 DON'T : pas de contenu indexable invisible par défaut SANS repli
 *    no-JS. L'état masqué vit dans `.js [data-reveal]`, et la classe `js` est
 *    posée par le script bloquant du <head>. Sans JavaScript, rien n'est masqué.
 *  - Recette 5 DON'T : « Don't stagger more than ~8 children; beyond that the
 *    last items feel laggy ». Le délai est donc PLAFONNÉ à 8 rangs.
 *  - Recette 7 DO : délai par élément 20-40ms — `--stagger-step` vaut 30ms.
 *  - IntersectionObserver absent (vieux navigateurs) : tout est révélé
 *    immédiatement, jamais de contenu bloqué à opacity: 0.
 *  - One-shot : chaque élément est dé-observé après révélation, donc aucun
 *    re-trigger au remontage du scroll et aucun observer qui tourne en boucle.
 *
 * Aucune dépendance : GSAP (~70 Ko) est écarté par pages/landing.md. Les durées
 * et courbes sont portées par les tokens CSS, ce composant ne pose que des
 * classes et une variable de délai.
 */

const MAX_STAGGER_RANK = 8;

export function ScrollReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (nodes.length === 0) return;

    const reveal = (el: HTMLElement) => el.classList.add('is-revealed');
    const revealAll = () => nodes.forEach(reveal);

    // Repli 1 — l'utilisateur demande moins de mouvement : rien à observer.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) {
      revealAll();
      return;
    }

    // Repli 2 — pas d'IntersectionObserver : on révèle tout, sans exception.
    if (typeof IntersectionObserver === 'undefined') {
      revealAll();
      return;
    }

    // Délais de stagger par groupe, plafonnés (recette 5 DON'T).
    const seen = new Map<string, number>();
    for (const el of nodes) {
      const group = el.dataset.revealGroup ?? 'page';
      const rank = seen.get(group) ?? 0;
      seen.set(group, rank + 1);
      if (rank > 0 && rank <= MAX_STAGGER_RANK) {
        el.style.setProperty('--reveal-delay', `calc(var(--stagger-step) * ${rank})`);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      // rootMargin négatif en bas : la révélation se déclenche un peu avant que
      // l'élément n'atteigne le bord, pour que l'animation soit déjà en cours
      // quand l'œil arrive dessus.
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    nodes.forEach((el) => observer.observe(el));

    // Filet de sécurité : si quelque chose empêchait le déclenchement
    // (élément dans un conteneur à overflow inhabituel), on révèle ce qui est
    // ALORS dans le viewport — pas tout le document.
    //
    // Une version précédente révélait ici la totalité des nœuds après 2,5 s.
    // C'était une régression : un visiteur qui lit le haut de page plus de
    // 2,5 s sans défiler voyait tout le reste apparaître d'un coup, ce qui
    // annulait précisément l'effet recherché.
    const failsafe = window.setTimeout(() => {
      for (const el of nodes) {
        if (el.classList.contains('is-revealed')) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) reveal(el);
      }
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
