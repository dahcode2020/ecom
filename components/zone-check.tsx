'use client';

import { useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from './icon';
import { zones, type Zone } from '@/lib/data';
import { formatXOF, normalizeForMatch } from '@/lib/format';

/**
 * Champ « Verifier ma zone de livraison » — CTA PRIMAIRE de la landing.
 *
 * Spec appliquee : design-system/quick-commerce-cotonou/pages/landing.md
 *   - `<label>` visible en permanence (UX High : DON'T « Placeholder as only label »)
 *   - suggestions pendant la frappe (UX Medium : « Show predictions as user types »)
 *   - zone non desservie -> message explicite + action de repli, jamais d'ecran vide
 *     (UX Medium : DO « Show helpful message and action », DON'T « Blank empty screens »)
 *   - `role="combobox"` complet, navigation fleches + Echap
 *   - bordure `--border-strong`, focus en anneau plein 2px (corrections du Master)
 *   - hauteur >= 48px (`--tap-target`)
 *   - pas de code postal : ville + quartier + repere
 */
export function ZoneCheck() {
  const uid = useId();
  const inputId = `${uid}-zone-input`;
  const listboxId = `${uid}-zone-listbox`;
  const hintId = `${uid}-zone-hint`;
  const statusId = `${uid}-zone-status`;

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selected, setSelected] = useState<Zone | null>(null);
  const [waitlisted, setWaitlisted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = normalizeForMatch(query);

  // Suggestions pendant la frappe. Sans saisie, on propose les zones les plus
  // demandees : « Reduce friction with useful suggestions » (marketplace-directory).
  const matches = useMemo(() => {
    if (!normalizedQuery) return zones.slice(0, 6);
    const hits = zones.filter(
      (z) =>
        normalizeForMatch(z.quartier).includes(normalizedQuery) ||
        normalizeForMatch(z.ville).includes(normalizedQuery),
    );
    // Pas de resultat : on ne renvoie jamais une liste vide sans alternative.
    return hits;
  }, [normalizedQuery]);

  const suggestionsWhenEmpty = useMemo(
    () => zones.filter((z) => z.served).slice(0, 4),
    [],
  );

  const activeId =
    activeIndex >= 0 && matches[activeIndex]
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  function selectZone(zone: Zone) {
    setSelected(zone);
    setQuery(`${zone.quartier}, ${zone.ville}`);
    setOpen(false);
    setActiveIndex(-1);
    setWaitlisted(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) setOpen(true);
        setActiveIndex((i) => (i + 1) % Math.max(matches.length, 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i <= 0 ? matches.length - 1 : i - 1));
        break;
      case 'Home':
        if (open && matches.length) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case 'End':
        if (open && matches.length) {
          event.preventDefault();
          setActiveIndex(matches.length - 1);
        }
        break;
      case 'Enter':
        if (open && activeIndex >= 0 && matches[activeIndex]) {
          event.preventDefault();
          selectZone(matches[activeIndex]);
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
        }
        break;
      case 'Tab':
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  const hasQuery = normalizedQuery.length > 0;
  const noMatch = hasQuery && matches.length === 0;

  return (
    <div className="w-full">
      {/* Libelle TOUJOURS visible — jamais le placeholder seul. */}
      <label htmlFor={inputId} className="font-heading mb-2 block text-base font-semibold">
        Votre quartier
      </label>

      <p id={hintId} className="text-muted-foreground mb-2 text-sm">
        Saisissez votre quartier pour connaître le délai et les frais de livraison.
      </p>

      <div className="relative">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <span className="text-primary pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
              <Icon name="mapPin" className="h-5 w-5" />
            </span>
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-expanded={open}
              aria-controls={listboxId}
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              aria-describedby={`${hintId} ${statusId}`}
              // Pas d'autocomplete="postal-code" : pas de code postal fiable au Benin.
              placeholder="ex. Cadjèhoun, Zogbadjè, Fidjrossè…"
              // 16px minimum : empeche le zoom force d'iOS au focus.
              className="input pl-12"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                setActiveIndex(-1);
                setSelected(null);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              onBlur={() => {
                // Delai court pour laisser le clic sur une option passer avant.
                window.setTimeout(() => setOpen(false), 120);
              }}
            />
          </div>

          <Link
            href={selected?.served ? '/checkout' : '#zones-desservies'}
            // Desactive tant que la zone n'est pas confirmee comme desservie.
            aria-disabled={!selected?.served}
            tabIndex={selected?.served ? 0 : -1}
            className={`btn-primary shrink-0 ${
              selected?.served ? '' : 'pointer-events-none opacity-50'
            }`}
          >
            Commander
            <Icon name="arrowRight" className="h-5 w-5" />
          </Link>
        </div>

        {open && !noMatch && matches.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Zones de livraison"
            className="overlay bg-card absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-lg border py-1"
          >
            {matches.map((zone, index) => {
              const id = `${listboxId}-option-${index}`;
              const isActive = index === activeIndex;
              return (
                <li
                  key={`${zone.ville}-${zone.quartier}`}
                  id={id}
                  role="option"
                  aria-selected={isActive}
                  // Les options sont atteignables au clic ET au clavier (fleches + Entree).
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectZone(zone)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-3 ${
                    isActive ? 'bg-muted' : ''
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      name="mapPin"
                      className={zone.served ? 'text-primary h-4 w-4' : 'text-muted-foreground h-4 w-4'}
                    />
                    <span>
                      <span className="block font-medium">{zone.quartier}</span>
                      <span className="text-muted-foreground block text-sm">{zone.ville}</span>
                    </span>
                  </span>
                  {zone.served ? (
                    <span className="text-muted-foreground shrink-0 text-sm">{zone.eta}</span>
                  ) : (
                    <span className="text-muted-foreground shrink-0 text-sm">Non desservi</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Region de statut : message atomique, pas un nombre nu.
          UX High : DO « Use one appropriate atomic status message ». */}
      <div id={statusId} role="status" aria-live="polite" className="mt-3 min-h-6">
        {noMatch && (
          <div className="bg-muted text-foreground rounded-lg border p-4 text-sm">
            <p className="font-heading flex items-center gap-2 font-semibold">
              <Icon name="warning" className="text-primary h-4 w-4" />
              Aucun quartier ne correspond à « {query} »
            </p>
            {/* UX Medium : DO « Show 'No results' with suggestions ». */}
            <p className="text-muted-foreground mt-2">
              Zones desservies les plus demandées&nbsp;:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestionsWhenEmpty.map((zone) => (
                <button
                  key={zone.quartier}
                  type="button"
                  onClick={() => selectZone(zone)}
                  className="tap-target bg-card text-foreground min-h-8 cursor-pointer rounded-md border px-3 py-1 text-sm"
                >
                  {zone.quartier}
                </button>
              ))}
            </div>
          </div>
        )}

        {selected?.served && (
          <div className="bg-card rounded-lg border p-4 text-sm">
            <p className="font-heading flex flex-wrap items-center gap-2 font-semibold">
              <Icon name="checkCircle" className="text-primary h-5 w-5" />
              Nous livrons à {selected.quartier} ({selected.ville})
            </p>
            <dl className="text-muted-foreground mt-3 grid grid-cols-2 gap-3">
              <div>
                <dt className="flex items-center gap-1.5 text-xs">
                  <Icon name="clock" className="h-3.5 w-3.5" />
                  Délai estimé
                </dt>
                <dd className="text-foreground mt-0.5 font-semibold">{selected.eta}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs">
                  <Icon name="truck" className="h-3.5 w-3.5" />
                  Frais de livraison
                </dt>
                <dd className="text-foreground mt-0.5 font-semibold">
                  {formatXOF(selected.fee ?? 0)}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {selected && !selected.served && (
          <div className="bg-muted rounded-lg border p-4 text-sm">
            <p className="font-heading flex items-center gap-2 font-semibold">
              <Icon name="info" className="text-accent h-5 w-5" />
              {selected.quartier} n’est pas encore desservi
            </p>
            {/* Jamais d'ecran vide : message explicite + action de repli. */}
            <p className="text-muted-foreground mt-2">
              Nous ouvrons {selected.ville} prochainement. Laissez votre numéro, nous vous
              prévenons dès l’ouverture — ou commandez et retirez sur place à Cotonou.
            </p>
            <div className="tap-group mt-3 flex flex-wrap">
              <button
                type="button"
                onClick={() => setWaitlisted(true)}
                className="btn-primary min-h-12 px-4 text-sm"
                disabled={waitlisted}
              >
                {waitlisted ? (
                  <>
                    <Icon name="check" className="h-4 w-4" />
                    Inscrit à la liste d’attente
                  </>
                ) : (
                  'Prévenez-moi à l’ouverture'
                )}
              </button>
              <a href="#zones-desservies" className="btn-outline min-h-12 px-4 text-sm">
                Voir les zones desservies
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
