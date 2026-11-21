'use client';

import { useEffect, useState } from 'react';
import { Icon } from './icon';

/**
 * Bascule de theme clair / sombre.
 *
 * Le schema sombre est defini UNE SEULE FOIS, dans le bloc `.dark` de
 * `design-system/quick-commerce-cotonou/globals.css` (17 tokens, 14 paires de
 * contraste mesurees). Cette bascule se contente d'ajouter ou retirer la classe
 * `dark` sur `<html>` — elle ne duplique aucun token.
 *
 * Pourquoi une classe et non `@media (prefers-color-scheme: dark)` :
 * une variante media obligerait a duplicer les 17 tokens sombres en deux
 * endroits. Deux copies peuvent diverger, et une divergence ici casse des
 * ratios de contraste verifies au dixieme pres. Classe unique = une source.
 *
 * Anti-flash : un script bloquant dans <head> (voir app/layout.tsx) applique le
 * choix avant le premier paint. Sans lui, un utilisateur en mode sombre verrait
 * un ecran clair pendant une frame.
 */
const STORAGE_KEY = 'qcc-theme';

export function ThemeToggle() {
  // `null` au premier rendu, cote SERVEUR comme cote CLIENT : markup identique,
  // donc aucune erreur d'hydratation. La valeur reelle est lue apres le montage,
  // une fois que le script du <head> a applique la classe.
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains('dark'));
    sync();

    // Tant que l'utilisateur n'a pas choisi explicitement, on suit le systeme
    // en direct (changement d'OS, bascule automatique au coucher du soleil).
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        /* localStorage indisponible (navigation privee, cookies bloques) */
      }
      if (!stored) {
        root.classList.toggle('dark', event.matches);
        sync();
      }
    };
    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');
    root.classList.toggle('dark', next);
    setIsDark(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      /* Le choix ne survivra pas au rechargement, mais la bascule fonctionne. */
    }
  }

  // Libelle annoncant l'ETAT ACTUEL puis l'action, conforme a aria-pressed.
  const label =
    isDark === null
      ? 'Basculer le thème'
      : isDark
        ? 'Mode sombre activé — passer en mode clair'
        : 'Mode clair activé — passer en mode sombre';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark ?? undefined}
      aria-label={label}
      title={label}
      // Cible tactile >= 48px (--tap-target) comme tout controle du projet.
      className="hover:bg-muted text-muted-foreground hover:text-foreground inline-flex min-h-12 min-w-12 shrink-0 cursor-pointer items-center justify-center rounded-md border p-2"
    >
      {/* Icone neutre (ecran) avant le montage : evite d'afficher une frame avec
          la mauvaise icone. `monitor` signale aussi que le theme suit le systeme. */}
      <Icon name={isDark === null ? 'monitor' : isDark ? 'sun' : 'moon'} className="h-5 w-5" />
    </button>
  );
}
