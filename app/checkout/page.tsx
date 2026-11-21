import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { demoCartCount } from '@/lib/data';
import { CheckoutFlow } from '@/components/checkout-flow';

/**
 * Tunnel de commande.
 *
 * Spec : design-system/quick-commerce-cotonou/pages/checkout.md
 *
 * ⚠️ CACHE — l'OPPOSE de la landing.
 *   La landing est en ISR (`revalidate = 60`, cache CDN actif). Cette route
 *   vehicule des donnees personnelles et de paiement : elle ne doit JAMAIS etre
 *   mise en cache, ni cote navigateur ni cote CDN.
 *   `force-dynamic` desactive le cache de route ; l'en-tete
 *   `Cache-Control: no-store` est pose dans `next.config.ts` (section
 *   `headers()`), seul endroit ou l'App Router permet d'emettre des en-tetes de
 *   reponse. Application directe de l'anti-pattern Master « Privacy concerns ».
 *
 *   Le stub genere par le skill donnait le MEME conseil de cache aux deux pages
 *   (« Set appropriate cache headers ») : c'est l'erreur que cette separation leve.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Commander',
  // Une page de tunnel ne doit pas etre indexee.
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      {/* Lien d'evitement AVANT l'en-tete, pour pouvoir le sauter. Sa cible est
          le <main> ci-dessous — pas lui-meme. */}
      <a
        href="#contenu"
        className="bg-primary focus:text-primary fixed top-2 left-2 z-50 -translate-y-24 rounded-md px-4 py-2 font-semibold text-white no-underline focus:translate-y-0"
      >
        Aller au formulaire
      </a>

      {/* Navigation REDUITE : aucun lien sortant. Chaque sortie est un abandon. */}
      <SiteHeader variant="checkout" cartCount={demoCartCount} />

      <main id="contenu">
        <CheckoutFlow />
      </main>
    </>
  );
}
