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

/**
 * Script BLOQUANT, execute dans <head> avant le premier paint.
 *
 * Il resout le theme dans cet ordre : choix explicite de l'utilisateur
 * (localStorage) > preference systeme (prefers-color-scheme) > clair.
 *
 * Sans lui, un utilisateur en mode sombre verrait un ecran clair pendant une
 * frame (FOUC). Il est volontairement minifie et synchrone : quelques octets,
 * aucune requete, et il doit avoir fini avant le rendu.
 *
 * Entoure d'un try/catch : localStorage peut lever en navigation privee ou si
 * les stockages sont bloques. Une echec ne doit jamais casser la page.
 *
 * La cle `qcc-theme` doit rester identique a celle de components/theme-toggle.tsx.
 *
 * Il pose AUSSI la classe `js` sur <html>, et c'est la condition qui autorise
 * l'etat masque du scroll reveal (`components/scroll-reveal.tsx` et le bloc 3 de
 * globals.css). Sans JavaScript cette classe n'existe pas, donc rien n'est
 * masque : c'est le repli no-JS exige par la recette 4 de motion.csv
 * (« Don't reveal below-the-fold content ... as invisible-by-default WITHOUT A
 * NO-JS FALLBACK »).
 *
 * `classList.add('js')` est place AVANT le try/catch, et non dedans : un echec
 * de localStorage (navigation privee) ne doit surtout pas empecher le theme ni
 * le reveal de s'initialiser.
 */
const themeInitScript = `(function(){var r=document.documentElement;r.classList.add('js');try{var s=localStorage.getItem('qcc-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;r.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang="fr" : contrainte locale du Master.
    // suppressHydrationWarning : le script ci-dessous ajoute la classe `dark`
    // sur <html> avant le premier paint, donc le HTML cote client peut differer
    // du HTML serveur sur CET element uniquement. C'est attendu et sans danger.
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Quatrieme repli du scroll reveal : meme si la classe `js` avait ete
            posee puis le script principal echoue, le contenu redevient visible.
            `!important` est necessaire pour battre la specificite de
            `.js [data-reveal]`. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </head>
      {/* Pas de classe font-* ici : globals.css applique les familles via
          @layer base sur body et les titres. */}
      <body>{children}</body>
    </html>
  );
}
