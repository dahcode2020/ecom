import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // L'apercu est servi sous https://{port}-{sandboxId}.e2b.app : le dev server
  // doit accepter cette origine, sinon il rejette les requetes HMR/asset.
  allowedDevOrigins: ['*.e2b.app'],
  reactStrictMode: true,

  /**
   * En-tetes de reponse.
   *
   * L'App Router ne permet pas d'emettre des en-tetes de reponse depuis une
   * page : `headers()` dans la config (ou un middleware) est le seul endroit.
   *
   * Trois politiques distinctes, volontairement :
   *
   *   /            ISR 60 s + cache CDN actif      (pages/landing.md)
   *   /catalogue   cache CDN 60 s par URL          (contenu public, filtres en URL)
   *   /checkout    no-store                        (pages/checkout.md)
   *   /suivi       no-store                        (etat de commande)
   *
   * `/checkout` et `/suivi` partagent le `no-store` pour la meme raison : une
   * reponse mise en cache y afficherait un etat perime — montant, moyen de
   * paiement, ou position du coursier. Sur `/suivi` l'erreur est particulierement
   * couteuse : afficher « en preparation » a un client dont le colis est deja
   * parti genere un appel au support.
   */
  async headers() {
    const NO_STORE = [
      { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
      { key: 'Pragma', value: 'no-cache' },
    ];
    // Chaque route est declaree avec et sans sous-chemin : `/checkout` ne couvre
    // pas `/checkout/livraison`, et inversement.
    const noStoreSources = ['/checkout', '/checkout/:path*', '/suivi', '/suivi/:path*'];

    return [
      ...noStoreSources.map((source) => ({ source, headers: NO_STORE })),

      /**
       * /catalogue — cache CDN par URL.
       *
       * CONSTAT MESURE : sans cet en-tete, Next applique son defaut pour une
       * route dynamique (`private, no-cache, no-store, max-age=0, must-revalidate`)
       * parce que la page lit `searchParams`. Chaque changement de filtre
       * refaisait donc un rendu serveur complet, sans jamais profiter du cache —
       * a l'oppose de la contrainte bas debit du projet.
       *
       * C'est sans danger ICI : le catalogue ne depend que de donnees publiques
       * (`products`, `categories`). Il ne lit ni cookie, ni en-tete, ni session.
       * Chaque combinaison de filtres a sa propre URL, donc sa propre entree.
       *
       * INVARIANT A PRESERVER : si un jour cette route affiche du contenu
       * personnalise (recommandations, prix par client, stock par utilisateur),
       * CETTE ENTREE DOIT ETRE SUPPRIMEE. Un cache `public` sur une reponse
       * personnalisee fait fuiter les donnees d'un client vers un autre.
       *
       * 60 s comme la landing : borne l'obsolescence d'un etat de stock
       * (« Stock faible », « Indisponible ») a une minute, ce qui reste
       * acceptable pour de l'epicerie et coherent avec `/`.
       */
      {
        source: '/catalogue',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
        ],
      },
    ];
  },
};

export default nextConfig;
