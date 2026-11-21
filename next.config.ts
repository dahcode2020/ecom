import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // L'apercu est servi sous https://{port}-{sandboxId}.e2b.app : le dev server
  // doit accepter cette origine, sinon il rejette les requetes HMR/asset.
  allowedDevOrigins: ['*.e2b.app'],
  reactStrictMode: true,

  /**
   * En-tetes de reponse.
   *
   * `Cache-Control: no-store` sur le tunnel de commande — voir
   * design-system/quick-commerce-cotonou/pages/checkout.md.
   * C'est l'OPPOSE de la landing, qui est en ISR avec cache CDN actif.
   *
   * L'App Router ne permet pas d'emettre des en-tetes de reponse depuis une
   * page : `headers()` dans la config (ou un middleware) est le seul endroit.
   */
  async headers() {
    return [
      {
        source: '/checkout',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
      {
        source: '/checkout/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
    ];
  },
};

export default nextConfig;
