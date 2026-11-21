import type { Metadata, Viewport } from 'next';
import './globals.css';

// Polices self-hosted via @fontsource-variable : zero requete externe.
// Voir la note POLICES dans design-system/quick-commerce-cotonou/globals.css.
import '@fontsource-variable/rubik/wght.css';
import '@fontsource-variable/nunito-sans/index.css';

export const metadata: Metadata = {
  title: {
    default: 'Livraison épicerie & pharmacie à Cotonou',
    template: '%s · Quick Commerce Cotonou',
  },
  description:
    'Épicerie, pharmacie et produits frais livrés chez vous à Cotonou et Abomey-Calavi. Paiement MTN MoMo, Moov Money, Wave ou à la livraison.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0fdf4' },
    { media: '(prefers-color-scheme: dark)', color: '#0c1a12' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang="fr" : contrainte locale du Master.
    <html lang="fr" suppressHydrationWarning>
      {/* Pas de classe font-* ici : globals.css applique les familles via
          @layer base sur body et les titres. */}
      <body>{children}</body>
    </html>
  );
}
