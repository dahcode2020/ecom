import Link from 'next/link';
import { SiteHeader, MobileCtaBar } from '@/components/site-header';
import {
  Categories,
  CategorySections,
  FinalCta,
  Hero,
  HowItWorks,
  PopularProducts,
  ProofBand,
} from '@/components/landing-sections';
import { demoCartCount, demoCartSubtotal } from '@/lib/data';
import { formatXOF } from '@/lib/format';

/**
 * Landing — Quick Commerce Cotonou.
 *
 * Spec : design-system/quick-commerce-cotonou/pages/landing.md
 *
 * RENDU : statique / ISR.
 *   `revalidate = 60` conformement a l'override de page. Cache CDN actif.
 *   ⚠️ NE PAS appliquer `no-store` ici : c'est l'inverse du checkout, qui lui
 *   vehicule des donnees personnelles et de paiement. Le stub genere par le
 *   skill donnait le meme conseil de cache aux deux pages — erreur corrigee.
 *
 * AUCUNE librairie d'animation : le scroll reveal GSAP du Master est
 * volontairement NON utilise sur cette page. Le Master avertit deja qu'il ne
 * faut pas masquer du contenu indexable a opacity:0 sans repli sans JS, et
 * c'est precisement la page d'indexation. Tout est rendu cote serveur, visible
 * sans JavaScript.
 */
export const revalidate = 60;

export default function LandingPage() {
  return (
    <>
      {/* Lien d'evitement : premier element focusable, visible au focus.
          Satisfait « Focus states visible for keyboard navigation ». */}
      <a
        href="#contenu"
        className="bg-primary focus:text-primary fixed top-2 left-2 z-50 -translate-y-24 rounded-md px-4 py-2 font-semibold text-white no-underline focus:translate-y-0"
      >
        Aller au contenu
      </a>

      <SiteHeader variant="landing" cartCount={demoCartCount} />

      {/* `id="top"` : cible du mini-CTA de l'etape 1. */}
      <main id="contenu">
        <span id="top" />

        {/* Ordre de sections — pattern `marketplace-directory` de landing.csv,
            complete par le bloc 3 etapes de `funnel-3-step-conversion`. */}
        <Hero />
        <Categories />
        <PopularProducts />
        <HowItWorks />
        <CategorySections />
        <ProofBand />
        <FinalCta />
      </main>

      <footer className="bg-card border-border border-t">
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-heading text-foreground flex items-center gap-2 font-bold">
                <span className="bg-primary flex h-8 w-8 items-center justify-center rounded-md">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
                    <path d="M10 17h4V5H2v12h3" />
                    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
                    <circle cx="7.5" cy="17.5" r="2.5" />
                    <circle cx="17.5" cy="17.5" r="2.5" />
                  </svg>
                </span>
                Kpɔ́tɔ
              </p>
              <p className="text-muted-foreground mt-3 text-sm">
                Épicerie, pharmacie et produits frais livrés à Cotonou et Abomey-Calavi.
              </p>
              <p className="text-muted-foreground mt-2 text-xs">
                Prix en francs CFA (XOF). Les médicaments soumis à ordonnance nécessitent une
                vérification par notre pharmacie partenaire.
              </p>
            </div>

            <nav aria-label="Pied de page — informations">
              <h2 className="font-heading text-foreground text-sm font-semibold">Informations</h2>
              <ul className="mt-3 space-y-1 text-sm">
                {[
                  { href: '#zones-desservies', label: 'Zones desservies' },
                  { href: '#h-how', label: 'Comment ça marche' },
                  { href: '#zones-desservies', label: 'Frais de livraison' },
                  { href: '#zones-desservies', label: 'Moyens de paiement' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground inline-flex min-h-12 items-center no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Pied de page — contact">
              <h2 className="font-heading text-foreground text-sm font-semibold">Contact</h2>
              <ul className="mt-3 space-y-1 text-sm">
                <li>
                  <a
                    href="https://wa.me/22900000000"
                    className="text-muted-foreground hover:text-foreground inline-flex min-h-12 items-center gap-2 no-underline"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    WhatsApp · +229 00 00 00 00
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+22900000000"
                    className="text-muted-foreground hover:text-foreground inline-flex min-h-12 items-center gap-2 no-underline"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Appeler la boutique
                  </a>
                </li>
              </ul>
              <p className="text-muted-foreground mt-3 text-xs">
                Du lundi au samedi, 7 h – 21 h. Dimanche, 9 h – 14 h.
              </p>
            </nav>
          </div>

          <p className="text-muted-foreground border-border mt-8 border-t pt-6 text-xs">
            Démonstration — design system généré avec le skill ui-ux-pro-max puis vérifié et
            corrigé. Voir <code>design-system/quick-commerce-cotonou/</code>.
          </p>
        </div>
      </footer>

      {/* Barre collante mobile. Le Master impose « No content hidden behind
          fixed navbars » : pb-24 sur mobile reserve l'espace en bas de page. */}
      {/* Libelle et montant CALCULES depuis demoCart — jamais codés en dur. */}
      <MobileCtaBar
        label={`Panier · ${demoCartCount} article${demoCartCount > 1 ? 's' : ''}`}
        amount={formatXOF(demoCartSubtotal)}
      />
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
