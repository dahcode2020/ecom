/**
 * Formatage monetaire et helpers de presentation.
 *
 * Regle du Master (pages/checkout.md et pages/landing.md) :
 *   - Devise XOF, libelle `FCFA`. Jamais `EUR` ni `USD`.
 *   - Separateur de milliers : **espace fine insecable** (U+202F).
 *   - Rendu attendu : `1 500 FCFA`.
 *
 * ⚠️ NE PAS UTILISER `Intl.NumberFormat(..., { style: 'currency', currency: 'XOF' })`
 * directement. Verifie a l'execution : il produit **« 1 500 F CFA »**, avec une
 * espace insecable (U+00A0) entre le F et le CFA. C'est exactement l'ecart que
 * le Master demande de normaliser. On formate donc le nombre seul, puis on
 * accole le libelle.
 */

/** Espaces utilisees : U+202F (fine insecable) pour les milliers et avant FCFA. */
const NNBSP = '\u202F';

const nombreFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0,
});

/** `1500` -> `"1 500 FCFA"` */
export function formatXOF(amount: number): string {
  return `${nombreFormatter.format(Math.round(amount))}${NNBSP}FCFA`;
}

/** Montant seul, sans devise : `1500` -> `"1 500"` (boutons etroits, badges) */
export function formatNumber(amount: number): string {
  return nombreFormatter.format(Math.round(amount));
}

/**
 * Libelle d'un delai. Conserve le tiret cadratin tel que saisi dans les donnees
 * (`25–40 min`) : il ne doit pas etre remplace par un trait d'union ASCII.
 */
export function formatEta(eta: string): string {
  return eta;
}

/**
 * Normalise une chaine pour la comparaison sans accents ni casse — utilise par
 * le combobox de verification de zone (`Zogbadje` doit matcher `Zogbadjè`).
 */
export function normalizeForMatch(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/gi, '')
    .trim()
    .toLowerCase();
}

/**
 * Formate un numero de telephone beninois pour l'affichage.
 *
 * ⚠️ ECART VERIFIE vs la contrainte locale du Master.
 * Le Master indique `+229 XX XX XX XX`, soit **8 chiffres** — c'est l'ancien plan
 * de numérotation. Le Benin est passe a un plan a **10 chiffres** (les numeros
 * existants ont ete prefixes, notamment par `01`). Un validateur borne a 8
 * chiffres **rejette donc des numeros valides**, ce qui sur un checkout fait
 * perdre la commande.
 *
 * Cette fonction accepte les deux longueurs et groupe par paires :
 *   `0197123456` -> `+229 01 97 12 34 56`
 *   `97123456`   -> `+229 97 12 34 56`
 * L'indicatif `229` en entree est retire avant comptage.
 *
 * A reporter dans MASTER.md : la validation doit accepter 8 OU 10 chiffres.
 */
export function formatBeninPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('229') && digits.length > 8) digits = digits.slice(3);
  if (digits.length !== 8 && digits.length !== 10) return raw;
  const parts = digits.match(/.{1,2}/g) ?? [];
  return `+229 ${parts.join(' ')}`;
}

/**
 * Validation de telephone beninois : 8 chiffres (ancien plan) ou 10 chiffres
 * (plan actuel). Retourne le nombre de chiffres nationaux, ou `null` si invalide.
 */
export function validateBeninPhone(raw: string): number | null {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('229') && digits.length > 8) digits = digits.slice(3);
  return digits.length === 8 || digits.length === 10 ? digits.length : null;
}
