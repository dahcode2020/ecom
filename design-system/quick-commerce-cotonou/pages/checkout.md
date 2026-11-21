# Checkout Page Overrides

> **PROJECT:** Quick Commerce Cotonou
> **Page Type:** Checkout / Payment
> **Generated:** 2026-11-21 13:11:09 (ebauche du skill) — **contenu authoré et verifie 2026-11-21**
> **Master :** `design-system/quick-commerce-cotonou/MASTER.md`

> ⚠️ **PRECEDENCE.** Les regles de ce fichier **priment** sur le Master. Tout ce qui n'est pas
> liste ici releve du Master seul. Lire aussi `## Corrections verifiees` du Master : les
> corrections de bordure, de focus ring et d'interdiction du blanc sur `--color-secondary`
> s'appliquent avec une exigence maximale sur cette page.

---

## Provenance — ce que l'ebauche generee contenait

Le `--page checkout` du skill produit un **stub generique**, identique octet pour octet a
`pages/landing.md` hors titre et horodatage. Il a ete remplace, pas complete. Ses defauts :

| Champ genere | Probleme | Corrige ci-dessous |
|---|---|---|
| `design-system/MASTER.md` | **Chemin casse.** Le Master reel est `design-system/quick-commerce-cotonou/MASTER.md` | En-tete corrige |
| `Max Width: 1200px (standard)` | Inadapte : un tunnel de commande large disperse l'attention | 640px mobile / 1040px desktop |
| `Effects: Purposeful **admin** feedback` | **Fuite admin** heritee de l'appariement produit *Pharmacy/Drug Store*. Cette page est 100 % cliente | Feedback client explicite |
| `Component Overrides → Avoid: No caching strategy` | **Erreur de categorie** : une regle de performance rangee dans les composants, et non specifiee | Section Performance, valeur concrete |
| `No unique components for this page` | Faux : un checkout a au minimum un selecteur de paiement, un resume de commande et un indicateur d'etapes | 6 composants specifiques |
| Spacing / Typography / Color : `No overrides` | Conserve — aucun ecart n'est justifie sur cette page | Inchanges, Master applique |

---

## Layout Overrides

- **Max Width :** `640px` sur mobile et tablette (colonne unique).
  Desktop : grille `minmax(0, 1fr) 360px`, conteneur `1040px` max — formulaire a gauche,
  resume de commande **sticky** a droite.
  Un tunnel etroit reduit la distraction ; 1200px est une valeur de page marketing, pas de checkout.
- **Navigation reduite au minimum :** logo (retour accueil) + « Retour au panier » + aide WhatsApp.
  **Aucun lien de navigation sortant** : pas de menu catalogue, pas de liens editoriaux, pas de
  footer complet. Chaque sortie est un abandon.
- **Pas de hero, pas d'illustration decorative.** Cette page n'a qu'un objectif : encaisser.
- **Resume de commande toujours visible sur mobile.** Barre collante en bas d'ecran portant le
  **montant total en FCFA** et le bouton de validation. Indispensable pendant la saisie : sur
  mobile money, l'utilisateur doit pouvoir verifier le montant sans remonter.
- **Une seule colonne sur mobile**, dans l'ordre : livraison → paiement → confirmation.
  Ne jamais empiler deux champs cote a cote sous 640px.

---

## Density Overrides

Aucun ecart d'echelle — les tokens `--space-*` du Master (density 7/10) s'appliquent tels quels.

Usage impose sur cette page :

- `--space-md` (16px) entre deux champs d'un meme groupe.
- `--space-lg` (24px) entre deux groupes (Livraison / Paiement).
- `--space-xl` (32px) autour du bouton de validation, pour l'isoler.
- **8px minimum entre deux cibles tactiles** (`--tap-gap`) — s'applique en particulier aux cartes
  de moyen de paiement, qui sont cote a cote.

---

## Color Overrides

Aucune nouvelle couleur. Deux contraintes du Master sont **rappelées** parce que cette page est
celle ou elles coutent le plus cher :

- ⚠️ **Tous les champs de saisie utilisent `--border-strong` / `--input` (`#6B8F76` light,
  `#7FA88C` dark), jamais `--border` (`#BBF7D0`).** Un champ delimite a 1.23:1 est invisible :
  sur un checkout, c'est un abandon direct. Seuil WCAG 1.4.11 = 3:1 ; `#6B8F76` donne 3.45:1 sur
  page et 3.61:1 sur carte.
- ⚠️ **Jamais de texte blanc sur `--color-secondary` (`#22C55E`) : 2.28:1.** Si un badge promo ou
  un etat « offert » utilise ce vert, le texte est `--secondary-foreground` (`#0F172A` → 7.83:1).
- Les **erreurs** utilisent `--destructive` (`#DC2626` light, `#F87171` dark) **avec** son
  `--destructive-foreground` (blanc light / `#450A0A` dark). Jamais le rouge seul sur fond clair
  sans verifier : `#DC2626` sur carte = 4.83:1, conforme, mais un rouge plus clair ne l'est pas.
- L'**etat de succes** utilise `--primary`, pas un vert ad hoc : `#15803D` avec texte blanc = 5.02:1.

---

## Component Overrides

Chaque regle cite la guideline UX du skill qui la fonde, avec sa severite. Ces guidelines ont ete
recuperees via `--domain ux` et verifiees une a une.

### 1. Indicateur d'etapes

> *UX — Feedback, severite **Medium** : DO « Step indicators or progress bar » ;
> DON'T « No indication of progress ».*

3 etapes visibles et nominatives : **Livraison → Paiement → Confirmation**.
L'etape courante est marquee par la couleur **et** par `aria-current="step"` — jamais par la
couleur seule.
> *UX — Accessibility, severite **High** : DO « Use aria-live or role=alert for errors » ;
> DON'T « Visual-only error indication ».*
> (Attribution exacte : cette exigence vient du domaine `ux` du skill, pas de la liste
> d'anti-patterns du Master.)
Sur mobile : libelles courts + « 2/3 ». Les etapes passees restent cliquables, les etapes futures
ne le sont pas (`aria-disabled`, pas seulement une couleur grisée).

### 2. Resume d'erreurs en tete de formulaire

> *UX — Forms / Accessibility, severite **High** : DO « Place it at the top of the form; move focus
> to its heading or container after failed submit; link each item to its invalid field; retain
> inline errors » ; DON'T « Replace inline errors with a visual-only summary or move focus on every
> blur ».*

Regles exactes, dans l'ordre :

1. Au submit echoue, un resume apparait **en haut du formulaire**, avec un titre (`h2`) portant
   `role="alert"` ou un conteneur `aria-live="assertive"`.
2. **Le focus est deplace vers ce titre** — une seule fois, au submit echoue.
3. Chaque ligne du resume est un **lien vers son champ invalide** (`href="#id-du-champ"`).
4. Les **erreurs inline sont conservees** en plus du resume. Le resume ne les remplace jamais.
5. **Ne jamais deplacer le focus au `blur`.** C'est explicitement interdit par la guideline :
   cela arrache le clavier des mains de l'utilisateur pendant la saisie.

> *UX — Accessibility, severite **High** : DO « Use aria-live or role=alert for errors » ;
> DON'T « Visual-only error indication ».*

Un champ invalide porte `aria-invalid="true"` et `aria-describedby` pointant vers son message.

### 3. Libelles toujours visibles

> *UX — Forms, severite **High** : DO « Always show label above or beside input » ;
> DON'T « Placeholder as only label ».*

Chaque champ a un `<label for="...">` **visible en permanence**, place au-dessus. Le placeholder
est un exemple de format (`ex. Cotonou, Calavi…`), jamais le libelle.
Cette regle vient du domaine `ux` du skill (`ux-guidelines.csv`, severite **High**), et non de la
liste d'anti-patterns du Master — qui ne comporte pas d'item « placeholder ». Les deux sources
convergent, mais l'attribution exacte est celle-ci.

### 4. Types de champs et claviers mobiles

> *UX — Forms, severite **Medium** : DO « Use email tel number url etc » ;
> DON'T « Text input for everything ».*
> *UX — Forms, severite **Medium** : DO « Use inputmode attribute » ;
> DON'T « Default keyboard for all inputs ».*

Mapping impose — c'est ce qui evite le clavier alphabetic sur un champ numerique, et donc la
majorite des abandons mobiles :

| Champ | `type` | `inputmode` | `autocomplete` |
|---|---|---|---|
| Telephone | `tel` | `tel` | `tel` |
| Quantite | `number` | `numeric` | — |
| Code de confirmation (OTP) | `text` | `numeric` | `one-time-code` |
| Email (facultatif) | `email` | `email` | `email` |
| Rue / quartier | `text` | — | `street-address` |
| Ville | `text` | — | `address-level2` |
| Nom complet | `text` | — | `name` |

> ⚠️ **Pas de champ « code postal » obligatoire.** Le Master l'impose : pas de code postal fiable
> au Benin. L'adresse s'appuie sur **ville + quartier + repere**. Un `autocomplete="postal-code"`
> requis bloquerait des commandes valides.

Taille de police des champs : **16px minimum** (Master) — empeche le zoom force d'iOS au focus.

### 5. Champ OTP / code de confirmation mobile money

> *UX — Forms / Accessibility, severite **High** : DO « Allow password managers and paste; offer
> passkeys OAuth or another non-cognitive method » ; DON'T « Block paste or require manual OTP
> transcription with no alternative ».*

Cette guideline s'applique directement au code recu par SMS ou USSD :

- **Le collage doit rester autorise.** Ne jamais poser `onpaste="return false"`.
- `autocomplete="one-time-code"` pour la saisie automatique iOS/Android.
- **Ne pas exiger de recopier le code sans alternative** : proposer le renvoi, et un canal de
  secours (WhatsApp, appel) si l'operateur ne repond pas.
- `inputmode="numeric"`, `maxlength` borne, et **separer les chiffres visuellement sans creer six
  champs distincts** qui cassent le collage.

### 6. Etat du bouton de validation et attente operateur

> *UX — Forms, severite **High** : DO « Show loading then success/error state » ;
> DON'T « No feedback after submit ».*

- Le bouton passe par trois etats explicites : **idle → loading → success | error**.
  Jamais de retour silencieux.
- Pendant `loading` : `aria-busy="true"`, libelle change (« Confirmation en cours… »), et
  **`disabled`** pour empecher le double envoi.
- ⚠️ **Contrainte locale critique :** la confirmation cote operateur mobile money peut depasser
  **30 secondes**. Prevoir un etat « en attente de confirmation » distinct du `loading` initial,
  avec un message qui explique l'attente et un garde-fou contre la double requete.
  > *UX — Feedback, severite **High** : DO « Follow platform and component guidance; preserve layout
  > focus and accessible busy status » ; DON'T « Apply one timing threshold to every operation or
  > leave long waits unexplained ».*
  > Un seuil unique pour toutes les operations est explicitement interdit : l'attente USSD n'a pas
  > le meme traitement qu'un calcul de frais de livraison.
- **Ne jamais perdre le panier** sur echec : le contenu du formulaire et du panier survit a
  l'erreur, au rechargement et a la coupure reseau.

### 7. Selecteur de moyen de paiement

Composant specifique a cette page, absent du Master.

- **Mobile money en premier**, dans cet ordre : MTN MoMo, Moov Money (Flooz), Wave.
  Carte bancaire ensuite, **paiement a la livraison** en option visible.
- Chaque option est une **carte radio** : `role="radio"` dans un `radiogroup`, ou
  `<input type="radio">` natif + `<label>`. Navigation clavier par fleches.
- Dimensions : **`min-height: 48px`** (`--tap-target`), **8px d'ecart** (`--tap-gap`).
- **Logo officiel en SVG** pour chaque operateur. Jamais d'emoji, jamais de texte seul
  (anti-pattern Master « Emojis as icons »).
- L'option selectionnee se distingue par la bordure **et** une coche : pas par la couleur seule.
- Les frais de livraison et le delai sont affiches **avant** la validation, pas apres
  (contrainte de confiance du Master).

### 8. Compteur d'articles du panier

> *UX — Accessibility, severite **High** : DO « Use one appropriate atomic status message such as
> 3 items in cart » ; DON'T « Announce a bare number or make every badge a competing live region ».*

Le badge du panier annonce **« 3 articles dans le panier »** — pas `3` seul.
**Une seule region `aria-live`** pour ce statut : ne pas faire de chaque badge une live region
concurrente, ce qui noierait la lecture d'ecran.

### 9. Confirmation

> *UX — Interaction, severite **Medium** : DO « Show success message or visual change ».*
> *UX — Feedback, severite **Medium** : DO « Brief success message ».*

Message de succes **court**, avec : numero de commande, montant paye en FCFA, delai estime,
et le bouton WhatsApp de suivi. Pas de confettis ni d'animation longue — Motion est a 3/10 et le
Master interdit les effets non essentiels sous `prefers-reduced-motion`.

### 10. Format monetaire

- Devise **XOF**, libelle `FCFA`. **Jamais** `€` ni `$`.
- Separateur de milliers : **espace fine insecable** → `1 500 FCFA`. Pas de virgule, pas de point.
- Utiliser `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' })` et verifier le
  rendu : la sortie doit etre `1 500 F CFA` ou approchant, a normaliser vers `1 500 FCFA`.
- **Le montant est rappele sur le bouton de validation** (« Payer 1 500 FCFA »), pas seulement
  dans le resume : c'est la derniere chose que l'utilisateur lit avant de confirmer.

---

## Performance & Cache

> L'ebauche generee indiquait `Set appropriate cache headers` sans valeur, range a tort dans
> « Component Overrides ». Voici la regle concrete.

- ⚠️ **`Cache-Control: no-store`** sur toute route du tunnel. Cette page vehicule des donnees
  personnelles et de paiement : elle ne doit jamais etre mise en cache, ni cote navigateur, ni cote
  CDN. C'est l'application directe de l'anti-pattern Master « Privacy concerns ».
- **Aucun script tiers bloquant** sur cette page. Pas de tag marketing, pas de chat widget charge
  en synchrone. Le style retenu est `cost:low` : le garder.
- Polices **self-hosted via `next/font`** (guideline `nextjs` : « Use next/font »,
  *« Don't: External font links »*). Deux familles maximum.
- **Prefetch du paiement** : la route de confirmation est prechargee des la saisie du paiement,
  pour ne pas ajouter de latence au moment le plus sensible.
- Le code du tunnel est **decoupe par etape** (`dynamic()` ou `React.lazy`) : l'etape 1 ne charge
  pas le code du selecteur de paiement.

---

## Anti-Patterns specifiques a cette page

S'ajoutent a ceux du Master :

- ❌ **Creer un compte obligatoire** avant de payer. (Voir « Non couverts » ci-dessous.)
- ❌ **Lien de navigation sortant** dans le tunnel.
- ❌ **Placeholder comme seul libelle** de champ.
- ❌ **Focus deplace au `blur`** d'un champ.
- ❌ **Resume d'erreurs qui remplace** les erreurs inline.
- ❌ **Collage bloque** sur le champ OTP.
- ❌ **Bouton sans etat de retour** apres clic.
- ❌ **Double requete de paiement** possible pendant l'attente operateur.
- ❌ **Montant absent du bouton** de validation.
- ❌ **Page mise en cache** (`no-store` obligatoire).
- ❌ **Carte de paiement de moins de 48px** de haut, ou deux cartes collees sans 8px d'ecart.

---

## Checklist pre-livraison — specifique checkout

Etend la checklist du Master, ne la remplace pas.

- [ ] Largeur 640px mobile / 1040px desktop, resume sticky a droite
- [ ] Aucun lien de navigation sortant dans le tunnel
- [ ] Indicateur d'etapes avec `aria-current="step"`, etape future non cliquable
- [ ] Resume d'erreurs en haut, `role="alert"`, focus deplace **au submit echoue uniquement**
- [ ] Chaque ligne du resume est un lien vers son champ
- [ ] Erreurs inline conservees **en plus** du resume
- [ ] Chaque champ : `<label for>` visible, `aria-invalid`, `aria-describedby`
- [ ] `type` + `inputmode` + `autocomplete` conformes au tableau ci-dessus
- [ ] Aucun code postal obligatoire ; ville + quartier + repere
- [ ] Champs a 16px minimum (pas de zoom iOS au focus)
- [ ] Bordures de champ sur `--border-strong`, focus en anneau plein 2px
- [ ] OTP : collage autorise, `one-time-code`, alternative de secours presente
- [ ] Bouton : idle → loading → success | error, `aria-busy`, `disabled` pendant l'envoi
- [ ] Etat « en attente de confirmation » distinct pour le mobile money (>30 s)
- [ ] Panier et formulaire conserves apres echec et apres rechargement
- [ ] Mobile money liste en premier, logos SVG officiels, cartes ≥48px et 8px d'ecart
- [ ] Moyen de paiement selectionne distingue par bordure **et** coche, pas couleur seule
- [ ] Badge panier : message atomique « N articles dans le panier », une seule live region
- [ ] Montant au format `1 500 FCFA`, rappele sur le bouton de validation
- [ ] Frais de livraison et delai affiches **avant** validation
- [ ] `Cache-Control: no-store` sur toutes les routes du tunnel
- [ ] Garde-fou explicite si un medicament soumis a ordonnance est au panier

---

## Non couverts par la base de donnees

Conformite a la regle du skill : *« If the retry still fails, state that no verified match was
found and use clearly labeled general guidance instead. »* Les requetes suivantes ont ete tentees,
puis reformulees une fois ; **aucune correspondance verifiee** n'a ete trouvee :

| Sujet | Requetes tentees | Resultat |
|---|---|---|
| Achat sans compte | `guest checkout account creation`, `sign in registration account login` | **0 resultat** les deux fois |
| Choix du mode de livraison | `delivery shipping options selector`, `shipping method delivery time selection` | **0 resultat** les deux fois |
| Etat de stock | `out of stock unavailable product`, `product unavailable stock status` | Resultats **hors sujet** (etat de chargement, badge panier) |

> **Guidance generale, explicitement NON issue de la base :** autoriser l'achat **sans creation de
> compte**, en invitant a la creation apres la commande. C'est une pratique standard du commerce
> en ligne et elle compte double ici, ou la friction fait perdre la vente. A valider par l'equipe
> produit — ce n'est pas une recommandation du skill.
>
> **Requete faussement positive a noter :** `promo code discount coupon` a retourne une guideline
> de performance sur le *code splitting* — le mot « code » a matche hors contexte. Elle n'a pas ete
> retenue.
