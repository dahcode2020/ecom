import Link from 'next/link';
import { Icon } from './icon';
import { ThemeToggle } from './theme-toggle';
import { formatNumber } from '@/lib/format';

/**
 * En-tete sticky.
 *
 * Deux variantes, conformement aux overrides de page :
 *  - `landing`  : logo + lien « Comment ca marche » + CTA « Commander » + panier.
 *  - `checkout` : navigation REDUITE — logo (retour accueil), « Retour au
 *                 panier », aide WhatsApp. Aucun lien sortant : chaque sortie
 *                 est un abandon (pages/checkout.md).
 *
 * Le panier est visible en permanence (contrainte du Master) et son compteur
 * annonce un message atomique complet — pas un nombre nu.
 * UX High : DO « Use one appropriate atomic status message such as 3 items in
 * cart » ; DON'T « Announce a bare number or make every badge a competing live
 * region ». Une seule region live pour ce statut.
 */
export function SiteHeader({
  variant = 'landing',
  cartCount = 5,
}: {
  variant?: 'landing' | 'checkout';
  cartCount?: number;
}) {
  const isCheckout = variant === 'checkout';

  return (
    <header className="bg-card/95 border-border sticky top-0 z-40 border-b backdrop-blur-sm">
      <div
        className={`mx-auto flex min-h-16 items-center gap-3 px-4 sm:px-6 ${
          isCheckout ? 'max-w-[1040px]' : 'max-w-[1200px]'
        }`}
      >
        <Link
          href="/"
          className="font-heading text-primary flex shrink-0 items-center gap-2 text-lg font-bold no-underline"
        >
          <span className="bg-primary flex h-9 w-9 items-center justify-center rounded-md">
            <Icon name="truck" className="h-5 w-5 text-white" strokeWidth={2.25} />
          </span>
          <span className="text-foreground hidden sm:inline">Kpɔ́tɔ</span>
        </Link>

        {!isCheckout && (
          <nav aria-label="Navigation principale" className="ml-4 hidden items-center gap-1 md:flex">
            <Link
              href="#h-how"
              className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex min-h-12 items-center rounded-md px-3 text-sm font-medium no-underline"
            >
              Comment ça marche
            </Link>
            <Link
              href="#zones-desservies"
              className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex min-h-12 items-center rounded-md px-3 text-sm font-medium no-underline"
            >
              Zones &amp; tarifs
            </Link>
          </nav>
        )}

        {isCheckout && (
          <nav aria-label="Navigation du tunnel" className="ml-2 flex items-center gap-1">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground inline-flex min-h-12 items-center gap-1.5 rounded-md px-2 text-sm font-medium no-underline"
            >
              <Icon name="chevronRight" className="h-4 w-4 rotate-180" />
              Retour
            </Link>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Bascule de theme — presente sur les deux variantes d'en-tete.
              Le schema sombre est defini une seule fois dans globals.css. */}
          <ThemeToggle />

          {isCheckout ? (
            // Aide WhatsApp : canal de secours pendant l'attente operateur.
            <a
              href="https://wa.me/22900000000"
              className="text-primary inline-flex min-h-12 items-center gap-2 rounded-md border px-3 text-sm font-semibold no-underline"
            >
              <Icon name="message" className="h-4 w-4" />
              <span className="hidden sm:inline">Aide</span>
            </a>
          ) : (
            <Link
              href="/checkout"
              className="hover:bg-muted relative inline-flex min-h-12 items-center gap-2 rounded-md px-3 no-underline"
              aria-label={`${cartCount} articles dans le panier`}
            >
              <Icon name="cart" className="text-foreground h-5 w-5" />
              {/* Message atomique complet pour les lecteurs d'ecran ; le badge
                  visuel n'affiche que le nombre, mais le libelle accessible est
                  porte par le lien parent. Une seule region live (dans le
                  checkout), pas de live region concurrente ici. */}
              <span
                aria-hidden="true"
                className="bg-primary font-heading absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold text-white"
              >
                {formatNumber(cartCount)}
              </span>
            </Link>
          )}

          {!isCheckout && (
            <Link href="/checkout" className="btn-primary hidden min-h-12 px-5 text-sm sm:inline-flex">
              Commander
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

/**
 * Barre CTA collante en bas d'ecran, mobile uniquement (< 768px).
 *
 * Le Master impose « No content hidden behind fixed navbars » : le composant
 * est donc accompagne d'un espace reserve en bas de page (voir `app/page.tsx`).
 */
export function MobileCtaBar({ label, amount }: { label: string; amount?: string }) {
  return (
    <div className="bg-card border-border fixed inset-x-0 bottom-0 z-40 border-t p-3 md:hidden">
      <Link href="/checkout" className="btn-primary w-full">
        <span className="flex-1 text-left">
          <span className="block text-xs font-medium opacity-90">{label}</span>
          {amount && <span className="block text-base font-bold">{amount}</span>}
        </span>
        <Icon name="arrowRight" className="h-5 w-5" />
      </Link>
    </div>
  );
}
