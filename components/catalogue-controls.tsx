'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './icon';
import {
  AVAILABILITY_OPTIONS,
  SORT_OPTIONS,
  buildCatalogueUrl,
  parseCatalogueParams,
  type AvailabilityKey,
  type SortKey,
} from '@/lib/catalogue';
import type { Category } from '@/lib/data';

/**
 * Controles du catalogue : recherche, categorie, disponibilite, tri.
 *
 * ENHANCEMENT PROGRESSIF. Le formulaire est un vrai `<form method="get">` :
 * sans JavaScript, le bouton « Filtrer » recharge la page avec les parametres
 * dans l'URL et le SERVEUR rend la liste filtree. Avec JavaScript, les memes
 * parametres sont pousses dans l'URL via `router.replace` pour un retour
 * immediat, sans rechargement complet.
 *
 * Source de verite unique : le DOM du formulaire, lu via `formRef` et
 * `new FormData()`. Aucun etat React ne duplique les valeurs des champs — deux
 * copies finiraient par diverger, comme les compteurs codes en dur deja corriges
 * ailleurs dans ce projet.
 *
 * Les URLs restent partageables et indexables : `/catalogue?cat=frais&tri=prix-asc`.
 */

type Props = {
  categories: Category[];
  query: { q: string; cat: string; dispo: AvailabilityKey; tri: SortKey };
  /** Nombre de resultats, pour le libelle du bouton de reinitialisation. */
  resultCount: number;
  totalCount: number;
};

export function CatalogueControls({ categories, query, resultCount, totalCount }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  // Le debounce est un etat local d'UI, pas une copie des valeurs du formulaire.
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer) clearTimeout(timer); }, [timer]);

  /** Lit le DOM du formulaire et pousse l'URL correspondante. */
  function apply(immediate = false) {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const next = parseCatalogueParams({
      q: String(data.get('q') ?? ''),
      cat: String(data.get('cat') ?? ''),
      dispo: String(data.get('dispo') ?? ''),
      tri: String(data.get('tri') ?? ''),
    });
    const url = buildCatalogueUrl(next);

    if (timer) clearTimeout(timer);
    if (immediate) {
      startTransition(() => router.replace(url, { scroll: false }));
      return;
    }
    // Debounce sur la recherche : sur reseau degrade, une requete par frappe
    // saturerait la connexion. 350 ms = compromis ressenti / cout.
    const id = setTimeout(() => {
      startTransition(() => router.replace(url, { scroll: false }));
    }, 350);
    setTimer(id);
  }

  const filtersActive =
    Boolean(query.q.trim()) || Boolean(query.cat) || query.dispo !== 'tous' || query.tri !== 'pertinence';

  return (
    <form
      ref={formRef}
      method="get"
      action="/catalogue"
      // Sans JS : soumission native GET. Avec JS : on pilote l'URL nous-memes.
      onSubmit={(event) => {
        event.preventDefault();
        apply(true);
      }}
      className="card flex flex-col gap-4 p-4"
      aria-label="Filtres du catalogue"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end">
        {/* --- Recherche ------------------------------------------------ */}
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="q" className="text-foreground text-sm font-semibold">
            Rechercher un produit
          </label>
          <div className="relative">
            <Icon
              name="search"
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            />
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={query.q}
              placeholder="Riz, huile, paracétamol…"
              autoComplete="off"
              // >= 16px pour eviter le zoom automatique d'iOS au focus.
              className="input pl-9 text-base"
              onChange={() => apply()}
            />
          </div>
        </div>

        {/* --- Disponibilite ------------------------------------------- */}
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="dispo" className="text-foreground text-sm font-semibold">
            Disponibilité
          </label>
          <select
            id="dispo"
            name="dispo"
            defaultValue={query.dispo}
            className="input min-h-12 min-w-[10rem] text-base"
            onChange={() => apply(true)}
          >
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* --- Tri ------------------------------------------------------ */}
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="tri" className="text-foreground text-sm font-semibold">
            Trier par
          </label>
          <select
            id="tri"
            name="tri"
            defaultValue={query.tri}
            className="input min-h-12 min-w-[11rem] text-base"
            onChange={() => apply(true)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Categories : radios visibles, pas un <select> cache ---------
          Un client en 3G doit voir toutes les categories d'un coup d'oeil et
          pouvoir en changer en une seule tape. Cibles >= 48px, ecart >= 8px. */}
      <fieldset className="flex min-w-0 flex-col gap-2 border-0 p-0">
        <legend className="text-foreground mb-1 text-sm font-semibold">Catégorie</legend>
        <div className="flex flex-wrap gap-2">
          <CategoryChip value="" label={`Tout (${totalCount})`} checked={query.cat === ''} onChange={() => apply(true)} />
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              value={category.id}
              label={`${category.name} (${category.count})`}
              icon={category.icon}
              checked={query.cat === category.id}
              onChange={() => apply(true)}
            />
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        {/* Reinitialisation : lien reel, donc utilisable sans JS egalement. */}
        {filtersActive && (
          <a
            href="/catalogue"
            onClick={(event) => {
              event.preventDefault();
              formRef.current?.reset();
              apply(true);
            }}
            className="text-accent inline-flex min-h-12 cursor-pointer items-center gap-1.5 text-sm font-semibold underline underline-offset-4"
          >
            <Icon name="close" className="h-4 w-4" />
            Réinitialiser les filtres
          </a>
        )}

        {/* Bouton de soumission : seul chemin sans JavaScript. */}
        <noscript>
          <button type="submit" className="btn-primary min-h-12 px-5 text-sm">
            Filtrer
          </button>
        </noscript>

        {/* Etat de chargement : le rendu serveur prend du temps en 3G, il faut
            le signaler. `aria-busy` est pose sur la region de resultats. */}
        {isPending && (
          // aria-hidden : une deuxieme live region entrerait en concurrence avec
          // l'annonce du compte de resultats (meme regle que le badge panier du
          // checkout, limite a UNE seule region atomique).
          <p className="text-muted-foreground flex items-center gap-2 text-sm" aria-hidden="true">
            <Icon name="spinner" className="h-4 w-4 animate-spin" />
            Mise à jour des résultats…
          </p>
        )}

        {/* UNIQUE live region de la page : annonce le compte de facon atomique. */}
        <p className="text-muted-foreground ml-auto text-sm" role="status" aria-live="polite">
          {resultCount} {resultCount > 1 ? 'produits' : 'produit'}
          {filtersActive ? ` sur ${totalCount}` : ''}
        </p>
      </div>
    </form>
  );
}

/**
 * Puce de categorie : un vrai `radio` dans un `radiogroup` natif (le fieldset).
 * Le compte affiche est CALCULE cote serveur depuis `products`, jamais saisi.
 */
function CategoryChip({
  value,
  label,
  icon,
  checked,
  onChange,
}: {
  value: string;
  label: string;
  icon?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${
        checked
          ? // Selection marquee par la bordure ET le fond, jamais par la couleur
            // seule (le vert est porteur de sens ailleurs dans ce design system).
            'border-primary bg-primary text-primary-foreground'
          : 'border-border-strong bg-card text-foreground hover:border-primary'
      }`}
    >
      <input
        type="radio"
        name="cat"
        value={value}
        checked={checked}
        onChange={onChange}
        // Visuellement cache mais accessible : le <label> porte deja le libelle
        // et l'etat visible. `sr-only` conserve la navigation clavier.
        className="sr-only"
      />
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {label}
    </label>
  );
}
