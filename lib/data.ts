/**
 * Donnees metier — Quick Commerce Cotonou
 *
 * Prix en XOF (FCFA). Les valeurs sont des ordres de grandeur plausibles pour
 * le marche beninois, a remplacer par un vrai catalogue en production.
 *
 * Les icones sont referencees par NOM (string) et non par composant, pour que
 * ce fichier reste serialisable et consommable depuis un Server Component.
 * Le mapping nom -> composant Lucide est dans components/icon.tsx.
 *
 * Regle du Master : jamais d'emoji en guise d'icone — uniquement du SVG
 * (Lucide ici).
 */

export type StockState = 'in' | 'low' | 'out';

export type Category = {
  id: string;
  name: string;
  icon: string;
  /** Nombre de produits annonce sur la tuile */
  count: number;
};

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  /** Prix en FCFA, sans decimale */
  price: number;
  unit: string;
  icon: string;
  stock: StockState;
  /** Produit soumis a ordonnance → garde-fou obligatoire au checkout */
  prescription?: boolean;
  popular?: boolean;
};

export type Zone = {
  quartier: string;
  ville: string;
  served: boolean;
  /** Delai estime, en clair */
  eta?: string;
  /** Frais de livraison en FCFA */
  fee?: number;
};

export type PaymentMethod = {
  id: string;
  name: string;
  kind: 'momo' | 'card' | 'cod';
  detail?: string;
};

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */
/**
 * `count` est CALCULE a partir de `products`, jamais code en dur.
 *
 * Raison : sur la page catalogue, un filtre qui annonce « 7 produits » a cote
 * de 6 resultats est un mensonge visible, et la meme derive s'etait deja
 * produite sur le compteur de panier (`cartCount={5}`). Une seule source :
 * le tableau `products`.
 */
const categoryMeta = [
  { id: 'epicerie', name: 'Épicerie', icon: 'wheat' },
  { id: 'pharmacie', name: 'Pharmacie & santé', icon: 'cross' },
  { id: 'boissons', name: 'Boissons', icon: 'cup' },
  { id: 'hygiene', name: 'Hygiène & entretien', icon: 'sparkle' },
  { id: 'frais', name: 'Produits frais', icon: 'leaf' },
  { id: 'maison', name: 'Maison & cuisine', icon: 'home' },
] as const;

/* ------------------------------------------------------------------ */
/* Produits                                                            */
/* ------------------------------------------------------------------ */
export const products: Product[] = [
  // Epicerie
  { id: 'riz-5kg', name: 'Riz parfumé', categoryId: 'epicerie', price: 4500, unit: 'sac 5 kg', icon: 'wheat', stock: 'in', popular: true },
  { id: 'huile-1l', name: 'Huile végétale', categoryId: 'epicerie', price: 1300, unit: 'bouteille 1 L', icon: 'droplet', stock: 'in', popular: true },
  { id: 'farine-mais', name: 'Farine de maïs', categoryId: 'epicerie', price: 1100, unit: 'sachet 2 kg', icon: 'wheat', stock: 'in' },
  { id: 'tomate-conc', name: 'Tomate concentrée', categoryId: 'epicerie', price: 900, unit: 'boîte 400 g', icon: 'can', stock: 'low' },
  { id: 'sucre-1kg', name: 'Sucre en poudre', categoryId: 'epicerie', price: 800, unit: 'sachet 1 kg', icon: 'cube', stock: 'in' },
  { id: 'pates-500', name: 'Pâtes alimentaires', categoryId: 'epicerie', price: 650, unit: 'paquet 500 g', icon: 'wheat', stock: 'in' },
  { id: 'lait-poudre', name: 'Lait en poudre', categoryId: 'epicerie', price: 2400, unit: 'boîte 400 g', icon: 'milk', stock: 'in' },

  // Pharmacie & sante
  { id: 'paracetamol', name: 'Paracétamol 500 mg', categoryId: 'pharmacie', price: 500, unit: 'plaquette ×16', icon: 'pill', stock: 'in', popular: true },
  { id: 'vitamine-c', name: 'Vitamine C 1000 mg', categoryId: 'pharmacie', price: 1500, unit: 'tube ×20', icon: 'pill', stock: 'in' },
  { id: 'serum-physio', name: 'Sérum physiologique', categoryId: 'pharmacie', price: 1200, unit: 'boîte ×10', icon: 'droplet', stock: 'in' },
  { id: 'masques-50', name: 'Masques chirurgicaux', categoryId: 'pharmacie', price: 1000, unit: 'boîte ×50', icon: 'shield', stock: 'in' },
  { id: 'pansements', name: 'Pansements adhésifs', categoryId: 'pharmacie', price: 700, unit: 'boîte ×20', icon: 'bandage', stock: 'low' },
  // Soumis a ordonnance : declenche le garde-fou du checkout
  { id: 'antipalu', name: 'Antipaludéen (ACT)', categoryId: 'pharmacie', price: 2800, unit: 'traitement', icon: 'pill', stock: 'in', prescription: true },

  // Boissons
  { id: 'jus-ananas', name: "Jus d'ananas local", categoryId: 'boissons', price: 1500, unit: 'bouteille 1 L', icon: 'cup', stock: 'in', popular: true },
  { id: 'bissap', name: 'Bissap', categoryId: 'boissons', price: 1000, unit: 'bouteille 1 L', icon: 'cup', stock: 'in' },
  { id: 'eau-6', name: 'Eau minérale', categoryId: 'boissons', price: 2100, unit: 'pack ×6 (1,5 L)', icon: 'droplet', stock: 'in' },
  { id: 'gingembre', name: 'Gingembre frais', categoryId: 'boissons', price: 800, unit: '500 g', icon: 'leaf', stock: 'out' },

  // Hygiene & entretien
  { id: 'savon-3', name: 'Savon de Marseille', categoryId: 'hygiene', price: 900, unit: 'lot ×3', icon: 'sparkle', stock: 'in' },
  { id: 'dentifrice', name: 'Dentifrice', categoryId: 'hygiene', price: 1100, unit: 'tube 100 ml', icon: 'sparkle', stock: 'in' },
  { id: 'lessive-1kg', name: 'Lessive en poudre', categoryId: 'hygiene', price: 1800, unit: 'sachet 1 kg', icon: 'sparkle', stock: 'in', popular: true },
  { id: 'papier-6', name: 'Papier hygiénique', categoryId: 'hygiene', price: 1400, unit: 'paquet ×6', icon: 'roll', stock: 'in' },

  // Produits frais
  { id: 'ananas', name: 'Ananas pain de sucre', categoryId: 'frais', price: 1000, unit: 'pièce', icon: 'leaf', stock: 'in', popular: true },
  { id: 'plantain', name: 'Bananes plantain', categoryId: 'frais', price: 1500, unit: 'régime', icon: 'leaf', stock: 'in' },
  { id: 'tomates-1kg', name: 'Tomates fraîches', categoryId: 'frais', price: 1200, unit: '1 kg', icon: 'leaf', stock: 'low' },
  { id: 'oignons-1kg', name: 'Oignons', categoryId: 'frais', price: 900, unit: '1 kg', icon: 'leaf', stock: 'in' },
  { id: 'gombo', name: 'Gombo', categoryId: 'frais', price: 700, unit: '500 g', icon: 'leaf', stock: 'in' },
  { id: 'piment', name: 'Piment frais', categoryId: 'frais', price: 400, unit: '200 g', icon: 'flame', stock: 'in' },

  // Maison & cuisine
  { id: 'charbon-5kg', name: 'Charbon de bois', categoryId: 'maison', price: 2500, unit: 'sac 5 kg', icon: 'flame', stock: 'in' },
  { id: 'allumettes', name: 'Allumettes', categoryId: 'maison', price: 300, unit: 'lot ×10', icon: 'flame', stock: 'in' },
  { id: 'balai', name: 'Balai', categoryId: 'maison', price: 1000, unit: 'pièce', icon: 'home', stock: 'in' },
];

/* ------------------------------------------------------------------ */
/* Zones de livraison                                                  */
/* Pas de code postal fiable au Benin : ville + quartier + repere.     */
/* ------------------------------------------------------------------ */
export const zones: Zone[] = [
  { quartier: 'Cadjèhoun', ville: 'Cotonou', served: true, eta: '25–40 min', fee: 500 },
  { quartier: 'Haie Vive', ville: 'Cotonou', served: true, eta: '25–40 min', fee: 500 },
  { quartier: 'Les Cocotiers', ville: 'Cotonou', served: true, eta: '30–45 min', fee: 500 },
  { quartier: 'Ganhi', ville: 'Cotonou', served: true, eta: '30–45 min', fee: 500 },
  { quartier: 'Vèdoko', ville: 'Cotonou', served: true, eta: '30–45 min', fee: 500 },
  { quartier: 'Fidjrossè', ville: 'Cotonou', served: true, eta: '40–60 min', fee: 800 },
  { quartier: 'Akpakpa', ville: 'Cotonou', served: true, eta: '40–60 min', fee: 800 },
  { quartier: 'Sainte Rita', ville: 'Cotonou', served: true, eta: '35–50 min', fee: 500 },
  { quartier: 'Zogbadjè', ville: 'Abomey-Calavi', served: true, eta: '45–70 min', fee: 1000 },
  { quartier: 'Godomey', ville: 'Abomey-Calavi', served: true, eta: '45–70 min', fee: 1000 },
  { quartier: 'Abomey-Calavi centre', ville: 'Abomey-Calavi', served: true, eta: '50–75 min', fee: 1200 },
  { quartier: 'Sèmè-Podji', ville: 'Sèmè-Podji', served: true, eta: '60–90 min', fee: 1500 },
  { quartier: 'Ouidah centre', ville: 'Ouidah', served: false },
  { quartier: 'Porto-Novo centre', ville: 'Porto-Novo', served: false },
];

/* ------------------------------------------------------------------ */
/* Moyens de paiement                                                  */
/* Mobile money EN PREMIER (contrainte locale du Master).              */
/* ------------------------------------------------------------------ */
export const paymentMethods: PaymentMethod[] = [
  { id: 'mtn-momo', name: 'MTN MoMo', kind: 'momo', detail: 'Confirmation par USSD ou SMS' },
  { id: 'moov-money', name: 'Moov Money (Flooz)', kind: 'momo', detail: 'Confirmation par USSD ou SMS' },
  { id: 'wave', name: 'Wave', kind: 'momo', detail: 'Confirmation instantanée' },
  { id: 'carte', name: 'Carte bancaire', kind: 'card', detail: 'Visa, Mastercard' },
  { id: 'especes', name: 'Paiement à la livraison', kind: 'cod', detail: 'Espèces, au coursier' },
];

/* ------------------------------------------------------------------ */
/* Panier de demonstration (checkout)                                  */
/* ------------------------------------------------------------------ */
export const demoCart = [
  { productId: 'riz-5kg', qty: 2 },
  { productId: 'paracetamol', qty: 1 },
  // Produit soumis a ordonnance : il declenche le garde-fou du checkout
  // (contrainte locale du Master). Present dans le panier de demonstration pour
  // que ce chemin soit reellement exerce et visible a l'apercu.
  { productId: 'antipalu', qty: 1 },
  { productId: 'jus-ananas', qty: 3 },
  { productId: 'ananas', qty: 2 },
  { productId: 'lessive-1kg', qty: 1 },
];

/**
 * DECLARE APRES `products` : le `.map()` ci-dessous s'execute a l'initialisation
 * du module, donc il lit `products` immediatement. Placer cette ligne avant
 * `products` leve `ReferenceError: Cannot access 'products' before initialization`
 * (zone morte temporelle).
 *
 * Piege note au passage : `tsc --noEmit` ne signale PAS cette erreur, car la
 * reference est a l'interieur d'un callback. Seule l'execution la revele —
 * d'ou le test `npx tsx -e` sur ce module apres chaque changement d'ordre.
 */
export const categories: Category[] = categoryMeta.map((meta) => ({
  ...meta,
  count: products.filter((product) => product.categoryId === meta.id).length,
}));

export const productById = (id: string) => products.find((p) => p.id === id);

/**
 * Totaux du panier de demonstration, CALCULES a partir de `demoCart`.
 * Ne jamais coder en dur le nombre d'articles ni le montant dans une page :
 * ces valeurs divergeraient des le premier changement de panier.
 */
export const demoCartCount = demoCart.reduce((sum, entry) => sum + entry.qty, 0);

export const demoCartSubtotal = demoCart.reduce((sum, entry) => {
  const product = productById(entry.productId);
  return sum + (product ? product.price * entry.qty : 0);
}, 0);

export const popularProducts = products.filter((p) => p.popular);

export const productsByCategory = (categoryId: string) =>
  products.filter((p) => p.categoryId === categoryId);

export const categoryById = (id: string) => categories.find((c) => c.id === id);

/* ------------------------------------------------------------------ */
/* Commande de demonstration (suivi de livraison)                      */
/* ------------------------------------------------------------------ */
/**
 * Etat du coursier. `en_route` et `en_cours_livraison` sont les deux etats ou
 * le suivi a du sens en temps reel ; `prete` est l'etat charniere ou le client
 * attend encore une confirmation.
 */
export type OrderStatus = 'confirmee' | 'preparation' | 'prete' | 'en_route' | 'livree';

export type TrackingStep = {
  id: string;
  label: string;
  /** Detail concret, utile au client : quoi, ou, combien de temps. */
  detail: string;
  icon: string;
  status: OrderStatus;
  /** `true` = etape franchie, affichee avec heure reelle. */
  done: boolean;
  time?: string;
};

export type DemoOrder = {
  ref: string;
  status: OrderStatus;
  quartier: string;
  ville: string;
  coursier: { name: string; phone: string; vehicle: string };
  /** Position du coursier sur le schema, en pourcentage du trajet (0 = depot). */
  progress: number;
  etaMin: number;
  items: { productId: string; qty: number }[];
  steps: TrackingStep[];
};

export const demoOrder: DemoOrder = {
  ref: 'QCC-2418',
  status: 'en_route',
  quartier: 'Cadjèhoun',
  ville: 'Cotonou',
  coursier: { name: 'Serge A.', phone: '0197451203', vehicle: 'Moto' },
  progress: 0.62,
  etaMin: 14,
  items: demoCart,
  steps: [
    {
      id: 'confirmee',
      label: 'Commande confirmée',
      detail: 'Paiement reçu — MTN MoMo',
      icon: 'checkCircle',
      status: 'confirmee',
      done: true,
      time: '14 h 02',
    },
    {
      id: 'preparation',
      label: 'Préparation en cours',
      detail: 'Les 10 articles sont rassemblés au dépôt de Cadjèhoun',
      icon: 'package',
      status: 'preparation',
      done: true,
      time: '14 h 11',
    },
    {
      id: 'prete',
      label: 'Colis remis au coursier',
      detail: 'Serge A. — moto, plaque AB 4521',
      icon: 'truck',
      status: 'prete',
      done: true,
      time: '14 h 23',
    },
    {
      id: 'en_route',
      label: 'En route vers votre adresse',
      detail: 'Trajet dépôt → Cadjèhoun, via Boulevard de la Marina',
      icon: 'mapPin',
      status: 'en_route',
      done: false,
    },
    {
      id: 'livree',
      label: 'Livrée',
      detail: 'Signature ou code de réception demandé à l’arrivée',
      icon: 'home',
      status: 'livree',
      done: false,
    },
  ],
};
