import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icon';
import { RouteSchematic } from '@/components/route-schematic';
import { LiveEta } from '@/components/live-eta';
import { SiteHeader } from '@/components/site-header';
import { demoOrder, productById } from '@/lib/data';
import { formatXOF } from '@/lib/format';
import { SUPPORT_WHATSAPP } from '@/lib/contact';

/**
 * Suivi de commande — Real-Time Monitoring.
 *
 * DECISION : voir components/route-schematic.tsx. « Real-Time Monitoring + Map »
 * (ligne Food Delivery / On-Demand) est retenu plutot que « Inventory Dashboard »
 * (ligne heritee de Pharmacy), avec un schema SVG statique au lieu de tuiles.
 *
 * CACHE : `no-store`, comme le checkout. Un etat de commande mis en cache par un
 * CDN afficherait « en preparation » a un client dont le colis est deja parti —
 * l'erreur la plus couteuse possible sur cet ecran. L'en-tete est pose dans
 * next.config.ts, seul endroit ou l'App Router peut emettre des en-tetes.
 *
 * HIERARCHIE DE L'INFORMATION : les etapes TEXTUELLES sont la source de verite.
 * Le schema SVG et le compte a rebours sont des complements. Si le JavaScript
 * echoue ou si le reseau est degrade, le client connait quand meme l'etat de sa
 * commande — le contenu est rendu cote serveur.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Suivi de commande | Quick Commerce Cotonou',
  description:
    'Suivez votre livraison en temps réel à Cotonou : étapes, position du coursier, délai restant et contact direct par téléphone ou WhatsApp.',
  // Page liee a une commande precise : jamais indexee.
  robots: { index: false, follow: false },
};

export default function TrackingPage() {
  const order = demoOrder;
  const activeStepId = order.status;

  // Total CALCULE depuis les lignes de commande, jamais saisi : ces compteurs
  // codes en dur ont deja derive deux fois dans ce projet.
  const total = order.items.reduce((sum, entry) => {
    const product = productById(entry.productId);
    return sum + (product ? product.price * entry.qty : 0);
  }, 0);
  const itemCount = order.items.reduce((sum, entry) => sum + entry.qty, 0);

  return (
    <>
      <SiteHeader cartCount={0} />

      <main id="contenu" className="mx-auto w-full max-w-[1040px] px-4 py-6 md:px-6 lg:py-8">
        <nav aria-label="Fil d'Ariane" className="mb-4">
          <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <Link href="/" className="text-accent underline underline-offset-4">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true">
              <Icon name="chevronRight" className="h-3.5 w-3.5" />
            </li>
            <li>
              <span aria-current="page" className="text-foreground font-medium">
                Suivi de commande
              </span>
            </li>
          </ol>
        </nav>

        <header className="mb-6">
          <h1 className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            Votre commande est en route
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Référence <span className="text-foreground font-semibold">{order.ref}</span>
            <span aria-hidden="true"> · </span>
            livraison à {order.quartier}, {order.ville}
          </p>
        </header>

        {/* Grille : schema + delai en haut, etapes et details en dessous. */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] md:gap-6">
          <div className="flex min-w-0 flex-col gap-4 md:gap-6">
            {/* Le schema est un complement : les etapes textuelles ci-dessous
                portent la meme information, donc rien n'est perdu sans image. */}
            <RouteSchematic order={order} />

            {/* ETAPES TEXTUELLES — source de verite du suivi. */}
            <section className="card p-4 md:p-5" aria-labelledby="etapes-titre">
              <h2 id="etapes-titre" className="font-heading text-foreground mb-4 text-lg font-bold">
                Étapes de la livraison
              </h2>
              <ol className="m-0 flex list-none flex-col gap-0 p-0">
                {order.steps.map((step, index) => {
                  const isActive = step.id === activeStepId;
                  const isLast = index === order.steps.length - 1;
                  return (
                    <li key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
                      {/* Ligne de liaison entre les jalons, en retrait derriere
                          l'icone. `aria-hidden` : purement decoratif. */}
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className="bg-border absolute top-8 left-[15px] h-[calc(100%-1.5rem)] w-0.5"
                        />
                      )}
                      <span
                        aria-hidden="true"
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                          step.done
                            ? 'border-primary bg-primary text-primary-foreground'
                            : isActive
                              ? 'border-primary bg-card text-primary'
                              : 'border-border-strong bg-card text-muted-foreground'
                        }`}
                      >
                        <Icon name={step.done ? 'check' : step.icon} className="h-4 w-4" />
                      </span>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <p
                          className={`text-sm font-semibold ${
                            // L'etape en cours est signalee par aria-current,
                            // pas seulement par la couleur ou l'epaisseur.
                            isActive || step.done ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                          {...(isActive ? { 'aria-current': 'step' as const } : {})}
                        >
                          {step.label}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-sm">{step.detail}</p>
                        {step.time && (
                          <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                            <Icon name="clock" className="h-3.5 w-3.5" />
                            {step.time}
                          </p>
                        )}
                        {isActive && (
                          <p className="text-primary mt-1 text-xs font-semibold">
                            Étape en cours
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>

          {/* Colonne laterale : delai, coursier, contenu, support. */}
          <aside className="flex min-w-0 flex-col gap-4 md:gap-6" aria-label="Détails de la livraison">
            <LiveEta etaMin={order.etaMin} orderRef={order.ref} />

            <section className="card p-4 md:p-5" aria-labelledby="coursier-titre">
              <h2 id="coursier-titre" className="font-heading text-foreground mb-3 text-lg font-bold">
                Votre coursier
              </h2>
              <p className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <Icon name="user" className="text-muted-foreground h-4 w-4" />
                {order.coursier.name}
              </p>
              <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                <Icon name="truck" className="h-4 w-4" />
                {order.coursier.vehicle}
              </p>
              {/* Contact direct : au Benin, le client appelle ou ecrit au coursier
                  plutot que de passer par un centre d'appel. Les deux canaux sont
                  presents, WhatsApp en premier (canal privilegie du projet). */}
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={`https://wa.me/229${order.coursier.phone}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="btn-primary min-h-12 w-full py-2 text-sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="message" className="h-4 w-4" />
                    Écrire sur WhatsApp
                  </span>
                </a>
                <a
                  href={`tel:+229${order.coursier.phone}`}
                  className="btn-outline min-h-12 w-full py-2 text-sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="phone" className="h-4 w-4" />
                    Appeler
                  </span>
                </a>
              </div>
            </section>

            <section className="card p-4 md:p-5" aria-labelledby="contenu-titre">
              <h2 id="contenu-titre" className="font-heading text-foreground mb-3 text-lg font-bold">
                Contenu de la commande
              </h2>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {order.items.map((entry) => {
                  const product = productById(entry.productId);
                  if (!product) return null;
                  return (
                    <li key={entry.productId} className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-foreground min-w-0">
                        {product.name}
                        <span className="text-muted-foreground ml-1">× {entry.qty}</span>
                      </span>
                      <span className="text-foreground shrink-0 font-semibold">
                        {formatXOF(product.price * entry.qty)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="border-border text-foreground mt-3 flex items-center justify-between gap-3 border-t pt-3 text-sm">
                <span className="font-semibold">
                  {itemCount} {itemCount > 1 ? 'articles' : 'article'}
                </span>
                <span className="font-heading text-base font-bold">{formatXOF(total)}</span>
              </p>
            </section>
          </aside>
        </div>

        {/* Un probleme sur la livraison doit avoir une sortie evidente : c'est le
            motif de contact le plus frequent en quick commerce. */}
        <section className="border-border bg-card mt-6 flex flex-col items-start gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-heading text-foreground text-base font-bold">
              Un problème avec cette livraison ?
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Notre équipe répond en moins de 10 minutes, de 7 h à 22 h.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={SUPPORT_WHATSAPP}
              rel="noopener noreferrer"
              target="_blank"
              className="btn-primary inline-flex min-h-12 items-center gap-2 px-5 text-sm"
            >
              <Icon name="message" className="h-4 w-4" />
              Contacter le support
            </a>
            <Link href="/catalogue" className="btn-outline inline-flex min-h-12 items-center px-5 text-sm">
              Retour au catalogue
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
