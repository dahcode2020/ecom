import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // L'apercu est servi sous https://{port}-{sandboxId}.e2b.app : le dev server
  // doit accepter cette origine, sinon il rejette les requetes HMR/asset.
  allowedDevOrigins: ['*.e2b.app'],
  reactStrictMode: true,

  /**
   * Optimisation des images.
   *
   * `sharp` est present dans l'environnement (verifie), donc l'optimiseur de
   * Next peut re-encoder au runtime.
   *
   * MESURE REELLE via `curl` sur l'optimiseur (`/_next/image?...&w=640&q=75`),
   * avec un en-tete Accept declarant avif puis webp — les 4 visuels cumules :
   *
   *   JPEG sources          704 Ko
   *   AVIF  a 640w          64,3 Ko   (hero 24,5 | livraison 17,2 |
   *                                    frais 16,5 | pharmacie 6,2)
   *   WebP  a 640w         117,5 Ko
   *   AVIF  a 1024w        138,3 Ko
   *
   * AVIF d'abord, WebP en repli : l'AVIF sert ~1,8x plus petit ici.
   *
   * CORRECTION D'UNE ESTIMATION FAUSSE. Un test `sharp` isole annoncait
   * 116,9 Ko d'AVIF q65 a 640w et 114,8 Ko de WebP q75 — soit WebP legerement
   * gagnant. C'etait trompeur : les reglages d'encodeur AVIF par defaut de
   * sharp (`effort` bas, donc compression rapide) ne sont pas ceux de
   * l'optimiseur de Next, qui compresse nettement mieux. Seule la mesure sur le
   * serveur reel fait foi. Lecon : ne jamais extrapoler un budget d'octets
   * d'un outil de conversion vers un autre.
   *
   * Seul le hero est au-dessus de la ligne de flottaison (~24,5 Ko sur mobile) ;
   * les trois visuels de la vitrine sont en `loading="lazy"` et ne pesent donc
   * pas sur le LCP.
   */
  images: {
    formats: ['image/avif', 'image/webp'] as const,
    // Les visuels generes font au plus 1408px de large. Plafonner evite de
    // servir des variantes inutiles et limite le travail de l'optimiseur.
    deviceSizes: [420, 640, 750, 828, 1024, 1200],
    minimumCacheTTL: 31536000,
  },

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
