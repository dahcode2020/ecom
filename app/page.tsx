import Link from 'next/link';
import { SiteHeader, MobileCtaBar } from '@/components/site-header';
import { ScrollReveal } from '@/components/scroll-reveal';
import { Icon } from '@/components/icon';
import {
  Categories,
  CategorySections,
  FinalCta,
  Hero,
  HowItWorks,
  PopularProducts,
  ProofBand,
  Showcase,
} from '@/components/landing-sections';
import { demoCartCount, demoCartSubtotal } from '@/lib/data';
import { formatXOF } from '@/lib/format';
import { SUPPORT_WHATSAPP, SUPPORT_TEL, SUPPORT_DISPLAY } from '@/lib/contact';

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
 * MOUVEMENT — position revisee, et pourquoi.
 *
 * La version initiale de cette page n'avait AUCUNE animation (0 @keyframes dans
 * tout le design system, 4 `animate-spin` purement fonctionnels). Le rendu a ete
 * juge basique a juste titre. Les recettes 4 et 5 de motion.csv sont donc
 * appliquees via `components/scroll-reveal.tsx`.
 *
 * GSAP reste ecarte (~70 Ko) : les memes courbes et durees sont portees par des
 * tokens CSS (`--ease-*`, `--dur-*`), pour zero octet de dependance.
 *
 * L'exigence du skill n'est pas « pas de reveal », c'est « pas de contenu
 * indexable masque SANS REPLI no-JS » (recette 4, DON'T). Quatre replis sont en
 * place, dont trois independants de JavaScript :
 *   1. l'etat masque vit dans `.js [data-reveal]`, et la classe `js` n'existe
 *      que si le script bloquant du <head> a tourne ;
 *   2. un <noscript> remet opacity: 1 en `!important` ;
 *   3. `prefers-reduced-motion: reduce` neutralise tout, etat final inclus ;
 *   4. cote client, IntersectionObserver absent OU reduced-motion => tout est
 *      revele immediatement.
 *
 * Le HERO ne porte volontairement PAS `data-reveal` : c'est le LCP et le contenu
 * indexable principal, il ne doit dependre d'aucun observer.
 */
export const revalidate = 60;

export default function LandingPage() {
  return (
    <>
      {/* Lien d'evitement : premier element focusable, visible au focus.
          Satisfait « Focus states visible for keyboard navigation ». */}
      <a
        href="#contenu"
        // Meme double bug que sur /checkout, corrige ici aussi : `text-white` sur
        // `bg-primary` ne donne que 2.28:1 en theme sombre (--primary #22C55E), et
        // `focus:text-primary` sans changer le fond rendait le texte primary sur
        // primary, donc invisible au moment precis ou le lien apparait. Le swap
        // complet est mesure : clair 5.02:1, sombre 7.13:1.
        className="bg-primary text-primary-foreground focus:bg-card focus:text-primary fixed top-2 left-2 z-50 -translate-y-24 rounded-md px-4 py-2 font-semibold no-underline focus:translate-y-0"
      >
        Aller au contenu
      </a>

      <SiteHeader variant="landing" cartCount={demoCartCount} />

      {/* `id="top"` : cible du mini-CTA de l'etape 1. */}
      {/* Montee ici et non dans le layout : le catalogue se re-rend au fil des
          filtres, et un observer monte une seule fois ne verrait jamais ses
          nouveaux noeuds. Chaque page decide donc de son propre reveal. */}
      <ScrollReveal />

      <main id="contenu">
        <span id="top" />

        {/* Ordre de sections — pattern `marketplace-directory` de landing.csv,
            complete par le bloc 3 etapes de `funnel-3-step-conversion`. */}
        <Hero />
        <Categories />
        <PopularProducts />
        {/* Vitrine bento avec les visuels generes : placee sous la ligne de
            flottaison, donc en lazy-load — aucun effet sur le LCP. */}
        <Showcase />
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
                {/* DEUX corrections. (1) Contraste : `text-white` sur `bg-primary`
                    ne donne que 2.28:1 en theme sombre (--primary #22C55E) ; le
                    token `text-primary-foreground` vaut #052E16 en sombre (6.54:1)
                    et #FFFFFF en clair (5.02:1). (2) Dedoublonnage : ce camion etait
                    redessine a la main ici alors que `components/icon.tsx` expose
                    deja la cle `truck`, utilisee par l'en-tete — deux tracés du
                    meme logo finissent toujours par diverger. */}
                <span className="bg-primary flex h-8 w-8 items-center justify-center rounded-md">
                  <Icon name="truck" className="h-4 w-4 text-primary-foreground" strokeWidth={2.25} />
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
              // Titre de colonne en sur-titre editorial : meme langage que les
              // en-tetes de section. Contraste mesure : --primary sur --card
              // (le pied de page est en bg-card) = 5.02:1 clair, 7.13:1 sombre.
              <h2 className="eyebrow">Informations</h2>
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
              // Titre de colonne en sur-titre editorial : meme langage que les
              // en-tetes de section. Contraste mesure : --primary sur --card
              // (le pied de page est en bg-card) = 5.02:1 clair, 7.13:1 sombre.
              <h2 className="eyebrow">Contact</h2>
              <ul className="mt-3 space-y-1 text-sm">
                <li>
                  <a
                    href={SUPPORT_WHATSAPP}
                    className="text-muted-foreground hover:text-foreground inline-flex min-h-12 items-center gap-2 no-underline"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    {/* BUG CORRIGE : ce libelle affichait un numero PLACEHOLDER
                        (« +229 00 00 00 00 ») alors que le lien `wa.me` pointait,
                        lui, vers le vrai numero. Le client lisait donc un numero
                        mort sur le canal de commande ET de support privilegie au
                        Benin — et s'il le composait a la main, il n'aboutissait
                        nulle part. `lib/contact.ts` interdit pourtant tout numero
                        ecrit en dur ; celui-ci avait echappe au nettoyage parce que
                        l'audit cherchait la chaine `22900000000` sans espaces, que
                        ce formatage espace ne contient pas.
                        Lecon : auditer la VALEUR AFFICHEE, pas seulement l'URL. */}
                    WhatsApp · {SUPPORT_DISPLAY}
                  </a>
                </li>
                <li>
                  <a
                    href={SUPPORT_TEL}
                    className="text-muted-foreground hover:text-foreground inline-flex min-h-12 items-center gap-2 no-underline"
                  >
                    {/* Icone partagee, plus un tracé a la main : la cle `phone`
                        existe deja dans `components/icon.tsx`.
                        Le glyphe WhatsApp ci-dessus est en revanche CONSERVE en
                        inline : c'est une forme de marque reconnue, et WhatsApp
                        est le canal de commande dominant localement — le
                        remplacer par une bulle generique ferait perdre ce
                        repere. Il utilise `currentColor`, donc suit le theme. */}
                    <Icon name="phone" className="h-4 w-4" strokeWidth={2} />
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
