import { formatBeninPhone, validateBeninPhone } from './format';

/**
 * Coordonnees de contact — SOURCE UNIQUE.
 *
 * Defaut corrige ici : le numero fictif `22900000000` etait recopie a 8 endroits
 * dans 5 fichiers (`wa.me/22900000000`, `tel:+22900000000`). Deux problemes :
 *   - c'est un numero qui semble reel mais ne mene nulle part, et WhatsApp est le
 *     canal de commande ET de support privilegie au Benin — un lien mort sur ce
 *     canal bloque la vente ;
 *   - huit copies, donc huit endroits a modifier le jour ou le vrai numero arrive.
 *
 * Toute page doit importer ces constantes, jamais ecrire un numero en dur.
 * Le numero de demonstration suit le format du Master : `+229 01 97 12 34 56`.
 */

/** Numero national, au plan béninois a 10 chiffres (prefixe `01`). */
const SUPPORT_NUMBER = '0197123456';

/**
 * Garde-fou a l'initialisation du module : le numero de contact DOIT passer le
 * validateur utilise pour les clients. S'il echouait, cela signifierait que la
 * regle de validation et le numero reel ne sont plus d'accord — exactement la
 * derive deja rencontree quand le Master exigeait 8 chiffres alors que le Benin
 * est passe a 10.
 *
 * En development, on leve pour que l'erreur soit vue. En production, on laisse
 * passer : un numero mal forme ne doit jamais faire tomber une page.
 */
const digits = validateBeninPhone(SUPPORT_NUMBER);
if (digits === null && process.env.NODE_ENV !== 'production') {
  throw new Error(
    `lib/contact.ts : le numero de support "${SUPPORT_NUMBER}" est rejete par validateBeninPhone. ` +
      `Corriger le numero OU la regle de validation, pas ce garde-fou.`,
  );
}

/** `tel:` — format international, seul format fiable depuis un mobile. */
export const SUPPORT_TEL = `+229${SUPPORT_NUMBER}`;

/**
 * `wa.me` — sans `+`, sans espaces, sans `00`. C'est le format exige par
 * WhatsApp ; un `+` ou un espace dans cette URL casse le lien.
 */
export const SUPPORT_WHATSAPP = `https://wa.me/229${SUPPORT_NUMBER}`;

/**
 * Affichage lisible, CALCULE par `formatBeninPhone` et non recopie a la main :
 * si le formatage evolue, l'affichage suit automatiquement.
 */
export const SUPPORT_DISPLAY = formatBeninPhone(SUPPORT_NUMBER);
