import {
  AlertTriangle,
  ArrowRight,
  Bandage,
  Banknote,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  Cross,
  CupSoda,
  Droplet,
  Flame,
  Home,
  Info,
  Leaf,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Milk,
  Minus,
  Package,
  Phone,
  Pill,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Stethoscope,
  Truck,
  User,
  Wheat,
  X,
  type LucideIcon,
} from 'lucide-react';

/**
 * Mapping nom (donnees) -> composant Lucide.
 *
 * Regle du Master, anti-pattern « Emojis as icons » : uniquement du SVG, issu
 * d'un jeu d'icones coherent. Toutes les cles ci-dessous correspondent aux noms
 * utilises dans lib/data.ts ; les 41 icones ont ete verifiees presentes dans
 * lucide-react@1.77.0.
 */
const ICONS: Record<string, LucideIcon> = {
  // donnees produit / categories
  wheat: Wheat,
  cross: Cross,
  cup: CupSoda,
  sparkle: Sparkles,
  leaf: Leaf,
  home: Home,
  droplet: Droplet,
  can: Box,
  cube: Box,
  milk: Milk,
  pill: Pill,
  shield: ShieldCheck,
  bandage: Bandage,
  roll: Package,
  flame: Flame,
  // interface
  mapPin: MapPin,
  search: Search,
  cart: ShoppingCart,
  truck: Truck,
  clock: Clock,
  check: Check,
  checkCircle: CheckCircle2,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  message: MessageCircle,
  card: CreditCard,
  cash: Banknote,
  phone: Phone,
  smartphone: Smartphone,
  star: Star,
  warning: AlertTriangle,
  close: X,
  arrowRight: ArrowRight,
  plus: Plus,
  minus: Minus,
  stethoscope: Stethoscope,
  package: Package,
  spinner: Loader2,
  mail: Mail,
  user: User,
  info: Info,
  lock: Lock,
  shieldPlain: Shield,
};

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  className = 'h-5 w-5',
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
  'aria-hidden'?: boolean;
}) {
  const Cmp = ICONS[name] ?? Package;
  // aria-hidden par defaut : les icones sont decoratives, le libelle adjacent
  // porte le sens. Ne retirer aria-hidden que si l'icone est le seul contenu.
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden={ariaHidden} />;
}

/**
 * Logo d'un moyen de paiement, en SVG (Lucide) — jamais d'emoji, jamais de
 * texte seul. Le Master impose le logo officiel en production ; ici l'icone est
 * un substitut coherent en attendant les assets officiels des operateurs.
 */
export function PaymentIcon({ kind, className = 'h-6 w-6' }: { kind: string; className?: string }) {
  if (kind === 'momo') return <Icon name="smartphone" className={className} />;
  if (kind === 'card') return <Icon name="card" className={className} />;
  return <Icon name="cash" className={className} />;
}
