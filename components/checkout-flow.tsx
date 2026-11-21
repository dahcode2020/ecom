'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon, PaymentIcon } from './icon';
import { demoCart, paymentMethods, productById, zones } from '@/lib/data';
import { formatXOF, validateBeninPhone } from '@/lib/format';
import { SUPPORT_WHATSAPP } from '@/lib/contact';

/**
 * Tunnel de commande.
 *
 * Spec : design-system/quick-commerce-cotonou/pages/checkout.md
 * Chaque regle implementee ici cite la guideline UX du skill qui la fonde.
 */

type Step = 1 | 2 | 3;
type SubmitState = 'idle' | 'validating' | 'awaiting' | 'success' | 'error';

type DeliveryForm = {
  fullName: string;
  phone: string;
  zone: string;
  landmark: string;
  email: string;
};

type FieldErrors = Partial<Record<keyof DeliveryForm | 'payment' | 'otp', string>>;

const STEPS = [
  { n: 1 as const, label: 'Livraison', short: 'Livraison' },
  { n: 2 as const, label: 'Paiement', short: 'Paiement' },
  { n: 3 as const, label: 'Confirmation', short: 'Confirmé' },
];

/** Delai avant de basculer de `validating` a `awaiting` (attente operateur). */
const OPERATOR_HANDOFF_MS = 1200;
/** Duree simulee de l'attente USSD en demonstration. En production elle peut
 *  depasser 30 s : c'est justement pourquoi l'etat `awaiting` est distinct. */
const DEMO_AWAIT_MS = 6000;

export function CheckoutFlow() {
  const [step, setStep] = useState<Step>(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [awaitElapsed, setAwaitElapsed] = useState(0);
  const [simulateFailure, setSimulateFailure] = useState(false);

  const [form, setForm] = useState<DeliveryForm>({
    fullName: '',
    phone: '',
    zone: '',
    landmark: '',
    email: '',
  });
  const [paymentId, setPaymentId] = useState<string>('');
  const [otp, setOtp] = useState('');
  const [orderRef, setOrderRef] = useState<string>('');

  const summaryRef = useRef<HTMLHeadingElement>(null);
  const step1Ref = useRef<HTMLHeadingElement>(null);
  const step2Ref = useRef<HTMLHeadingElement>(null);
  // Refs vers les formulaires : la barre collante mobile declenche le submit du
  // formulaire de l'etape courante via requestSubmit(), ce qui passe par la meme
  // validation et le meme gestionnaire que le bouton principal. Pas de
  // querySelector fragile, pas d'attribut `form` pointant vers un id inexistant.
  const form1Ref = useRef<HTMLFormElement>(null);
  const form2Ref = useRef<HTMLFormElement>(null);
  const timersRef = useRef<number[]>([]);

  // Nettoyage des minuteries au demontage : evite un double envoi ou un etat
  // fantome si l'utilisateur quitte le tunnel.
  useEffect(() => () => timersRef.current.forEach((t) => window.clearTimeout(t)), []);

  const selectedZone = zones.find((z) => `${z.ville}|${z.quartier}` === form.zone);
  const selectedPayment = paymentMethods.find((p) => p.id === paymentId);
  const isMobileMoney = selectedPayment?.kind === 'momo';

  const lines = useMemo(
    () =>
      demoCart
        .map((entry) => {
          const product = productById(entry.productId);
          return product ? { product, qty: entry.qty, total: product.price * entry.qty } : null;
        })
        .filter((l): l is NonNullable<typeof l> => l !== null),
    [],
  );

  const cartCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const deliveryFee = subtotal >= 10000 ? 0 : (selectedZone?.fee ?? 500);
  const total = subtotal + deliveryFee;

  // Garde-fou ordonnance : si un produit soumis a ordonnance est au panier,
  // une verification humaine est obligatoire (contrainte locale du Master).
  const prescriptionLines = lines.filter((l) => l.product.prescription);

  function update<K extends keyof DeliveryForm>(key: K, value: DeliveryForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // ⚠️ Ne JAMAIS deplacer le focus ni revalider au blur.
    // UX High : DON'T « move focus on every blur ».
    // On retire simplement l'erreur inline du champ des qu'il est corrige,
    // sans toucher au focus ni au resume.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function validateStep1(): FieldErrors {
    const next: FieldErrors = {};
    if (form.fullName.trim().length < 2) next.fullName = 'Indiquez votre nom complet.';
    const phoneDigits = validateBeninPhone(form.phone);
    if (!phoneDigits) {
      next.phone =
        'Numéro béninois invalide. Attendu : 8 chiffres (ancien plan) ou 10 chiffres (plan actuel), avec ou sans +229.';
    }
    if (!form.zone) next.zone = 'Sélectionnez votre quartier de livraison.';
    else if (selectedZone && !selectedZone.served)
      next.zone = 'Ce quartier n’est pas encore desservi.';
    if (form.landmark.trim().length < 3)
      next.landmark = 'Ajoutez un repère (ex. en face de la pharmacie, portail bleu).';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = 'Adresse e-mail invalide. Ce champ est facultatif.';
    return next;
  }

  function validateStep2(): FieldErrors {
    const next: FieldErrors = {};
    if (!selectedPayment) next.payment = 'Choisissez un moyen de paiement.';
    // Le collage reste autorise sur l'OTP : ne jamais bloquer la saisie.
    if (isMobileMoney && !/^\d{4,6}$/.test(otp.trim()))
      next.otp = 'Saisissez le code reçu par SMS ou USSD (4 à 6 chiffres).';
    return next;
  }

  /**
   * Soumission echouee : le resume apparait en haut et **le focus est deplace
   * vers son titre** — une seule fois, ici. Jamais au blur.
   * UX High : DO « Place it at the top of the form; move focus to its heading or
   * container after failed submit; link each item to its invalid field; retain
   * inline errors ».
   */
  function focusSummary() {
    window.requestAnimationFrame(() => {
      summaryRef.current?.focus();
      summaryRef.current?.scrollIntoView({ block: 'nearest' });
    });
  }

  function submitStep1(event: React.FormEvent) {
    event.preventDefault();
    const found = validateStep1();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusSummary();
      return;
    }
    setStep(2);
    window.requestAnimationFrame(() => step2Ref.current?.focus());
  }

  function submitStep2(event: React.FormEvent) {
    event.preventDefault();
    if (submitState === 'validating' || submitState === 'awaiting') return; // anti double envoi

    const found = validateStep2();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusSummary();
      return;
    }

    setSubmitState('validating');

    timersRef.current.push(
      window.setTimeout(() => {
        // Etat « en attente de confirmation » DISTINCT du loading initial.
        // UX High : DON'T « Apply one timing threshold to every operation or
        // leave long waits unexplained ».
        if (isMobileMoney) setSubmitState('awaiting');
        else settle();
      }, OPERATOR_HANDOFF_MS),
    );

    function settle() {
      const waitMs = isMobileMoney ? DEMO_AWAIT_MS : 0;
      timersRef.current.push(
        window.setTimeout(() => {
          if (simulateFailure) {
            setSubmitState('error');
            // Le panier et le formulaire SURVIVENT a l'echec : on ne reinitialise
            // rien, l'utilisateur peut retenter sans ressaisir.
            return;
          }
          setOrderRef(
            `KPT-${String(Math.floor(Math.random() * 9000) + 1000)}-${new Date()
              .getFullYear()
              .toString()
              .slice(2)}`,
          );
          setSubmitState('success');
          setStep(3);
        }, waitMs),
      );
    }
    settle();
  }

  // Minuteur de l'attente operateur : l'attente doit etre EXPLIQUEE.
  useEffect(() => {
    if (submitState !== 'awaiting') {
      setAwaitElapsed(0);
      return;
    }
    const interval = window.setInterval(() => setAwaitElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(interval);
  }, [submitState]);

  const busy = submitState === 'validating' || submitState === 'awaiting';
  const errorEntries = Object.entries(errors).filter(([, message]) => Boolean(message)) as [
    keyof FieldErrors,
    string,
  ][];

  const FIELD_LABELS: Record<keyof FieldErrors, string> = {
    fullName: 'Nom complet',
    phone: 'Téléphone',
    zone: 'Quartier',
    landmark: 'Repère',
    email: 'E-mail',
    payment: 'Moyen de paiement',
    otp: 'Code de confirmation',
  };

  /* ---------------------------------------------------------------- */
  /* Etape 3 — Confirmation                                            */
  /* ---------------------------------------------------------------- */
  if (step === 3 && submitState === 'success') {
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-10 sm:px-6">
        {/* UX Medium : DO « Brief success message » + « Show success message or
            visual change ». Message COURT, pas de confettis ni d'animation
            longue (Motion 3/10). */}
        <div className="card p-6 sm:p-8" role="status" aria-live="polite">
          <span className="bg-primary flex h-14 w-14 items-center justify-center rounded-full">
            <Icon name="check" className="h-7 w-7 text-white" strokeWidth={2.5} />
          </span>

          <h1 className="font-heading text-foreground mt-5 text-2xl font-bold">
            Commande confirmée
          </h1>
          <p className="text-muted-foreground mt-2">
            Référence <strong className="text-foreground font-semibold">{orderRef}</strong>
          </p>

          <dl className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-xs">Montant payé</dt>
              <dd className="font-heading text-foreground text-xl font-bold">{formatXOF(total)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Délai estimé</dt>
              <dd className="font-heading text-foreground text-xl font-bold">
                {selectedZone?.eta ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Livraison à</dt>
              <dd className="text-foreground text-sm">
                {selectedZone?.quartier}, {selectedZone?.ville}
                <br />
                <span className="text-muted-foreground">{form.landmark}</span>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Payé avec</dt>
              <dd className="text-foreground flex items-center gap-2 text-sm">
                <PaymentIcon kind={selectedPayment?.kind ?? 'cod'} className="text-primary h-4 w-4" />
                {selectedPayment?.name}
              </dd>
            </div>
          </dl>

          {/* ACTION PRIMAIRE = suivre la commande. Avant l'existence de la page
              /suivi, WhatsApp etait le seul canal de suivi possible ; il reste
              propose, mais en repli, sous les boutons. Confirmation COURTE
              (pages/checkout.md) : deux boutons, pas trois.
              `Link` et non `<a>` pour les routes internes : `<a>` declenche un
              rechargement complet, ce qui perd le prefetch et le cache client. */}
          <div className="tap-group mt-8 flex flex-wrap">
            <Link href="/suivi" className="btn-primary min-h-12 flex-1 px-4">
              <Icon name="truck" className="h-5 w-5" />
              Suivre ma commande
            </Link>
            <Link href="/" className="btn-outline min-h-12 flex-1 px-4">
              Retour à l’accueil
            </Link>
          </div>

          <p className="text-muted-foreground mt-4 text-sm">
            Une question sur cette commande ?{' '}
            <a href={SUPPORT_WHATSAPP} className="text-accent underline underline-offset-4">
              Écrire sur WhatsApp
            </a>
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Etapes 1 et 2                                                     */
  /* ---------------------------------------------------------------- */
  return (
    <div className="mx-auto w-full max-w-[1040px] px-4 py-8 sm:px-6 md:py-10">
      {/* Indicateur d'etapes — UX Medium : DO « Step indicators or progress bar »,
          DON'T « No indication of progress ».
          Etape courante marquee par la couleur ET par aria-current="step" :
          jamais par la couleur seule. */}
      <nav aria-label="Progression de la commande">
        <ol className="flex items-center gap-2">
          {STEPS.map((item, index) => {
            const isCurrent = item.n === step;
            const isDone = item.n < step;
            const isFuture = item.n > step;
            return (
              <li key={item.n} className="flex flex-1 items-center gap-2">
                {isDone ? (
                  <button
                    type="button"
                    onClick={() => setStep(item.n)}
                    className="flex min-h-12 flex-1 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-left"
                  >
                    <Icon name="checkCircle" className="text-primary h-5 w-5 shrink-0" />
                    <span className="font-heading text-foreground truncate text-sm font-semibold">
                      {item.short}
                    </span>
                  </button>
                ) : (
                  <span
                    // Etapes futures non atteignables : aria-disabled, pas
                    // seulement une couleur grisée.
                    aria-disabled={isFuture}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`flex min-h-12 flex-1 items-center gap-2 rounded-md border px-3 py-2 ${
                      isCurrent ? 'bg-primary text-white' : 'text-muted-foreground'
                    }`}
                  >
                    <span
                      className={`font-heading flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isCurrent ? 'bg-white/20 text-white' : 'bg-muted'
                      }`}
                      aria-hidden="true"
                    >
                      {item.n}
                    </span>
                    <span className="font-heading truncate text-sm font-semibold">{item.short}</span>
                  </span>
                )}
                {index < STEPS.length - 1 && (
                  <span className="bg-border-strong hidden h-px w-4 shrink-0 sm:block" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
        <p className="text-muted-foreground mt-2 text-sm">
          Étape {step} sur {STEPS.length} — {STEPS[step - 1].label}
        </p>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Colonne formulaire — 640px max sur mobile/tablette */}
        <div className="w-full max-w-[640px]">
          {/* ---------------------------------------------------- */}
          {/* RESUME D'ERREURS EN TETE — UX High                    */}
          {/* ---------------------------------------------------- */}
          {errorEntries.length > 0 && (
            <div className="bg-destructive/5 border-destructive mb-6 rounded-lg border p-4">
              <h2
                ref={summaryRef}
                // role="alert" : UX High — DO « Use aria-live or role=alert for
                // errors », DON'T « Visual-only error indication ».
                role="alert"
                tabIndex={-1}
                className="font-heading text-destructive flex items-start gap-2 text-base font-bold focus:outline-none"
              >
                <Icon name="warning" className="mt-0.5 h-5 w-5 shrink-0" />
                {errorEntries.length === 1
                  ? '1 champ à corriger avant de continuer'
                  : `${errorEntries.length} champs à corriger avant de continuer`}
              </h2>
              {/* Chaque ligne est un LIEN vers son champ invalide. */}
              <ul className="mt-3 space-y-1 text-sm">
                {errorEntries.map(([field, message]) => (
                  <li key={field}>
                    <a
                      href={`#field-${field}`}
                      className="text-destructive underline decoration-dotted underline-offset-2"
                    >
                      {FIELD_LABELS[field]}
                    </a>
                    <span className="text-foreground"> — {message}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-3 text-xs">
                Les erreurs sont aussi indiquées sous chaque champ.
              </p>
            </div>
          )}

          {/* Etat d'echec operateur, distinct du resume de validation */}
          {submitState === 'error' && (
            <div className="bg-destructive/5 border-destructive mb-6 rounded-lg border p-4" role="alert">
              <h2 className="font-heading text-destructive flex items-center gap-2 text-base font-bold">
                <Icon name="warning" className="h-5 w-5 shrink-0" />
                Le paiement n’a pas abouti
              </h2>
              <p className="text-foreground mt-2 text-sm">
                L’opérateur n’a pas confirmé le débit. <strong>Aucun montant n’a été prélevé.</strong>{' '}
                Votre panier et vos informations sont conservés : vous pouvez réessayer sans rien
                ressaisir.
              </p>
              <div className="tap-group mt-4 flex flex-wrap">
                <button
                  type="button"
                  onClick={() => setSubmitState('idle')}
                  className="btn-primary min-h-12 px-4 text-sm"
                >
                  <Icon name="arrowRight" className="h-4 w-4" />
                  Réessayer le paiement
                </button>
                <a href={SUPPORT_WHATSAPP} className="btn-outline min-h-12 px-4 text-sm">
                  <Icon name="message" className="h-4 w-4" />
                  Aide WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* ETAPE 1 — LIVRAISON                                   */}
          {/* ---------------------------------------------------- */}
          {step === 1 && (
            <form ref={form1Ref} onSubmit={submitStep1} noValidate>
              <fieldset className="border-0 p-0">
                <legend className="p-0">
                  <h1 ref={step1Ref} tabIndex={-1} className="font-heading text-foreground text-2xl font-bold focus:outline-none">
                    Où livrons-nous&nbsp;?
                  </h1>
                </legend>
                <p className="text-muted-foreground mt-1 text-sm">
                  Pas de code postal au Bénin : nous utilisons la ville, le quartier et un repère.
                </p>

                <div className="mt-6 space-y-4">
                  <Field
                    id="fullName"
                    label="Nom complet"
                    required
                    error={errors.fullName}
                    // Libelle TOUJOURS visible : UX High — DON'T « Placeholder as
                    // only label ». Le placeholder n'est qu'un exemple de format.
                    placeholder="ex. Aline Adjovi"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(v) => update('fullName', v)}
                  />

                  <Field
                    id="phone"
                    label="Téléphone"
                    required
                    error={errors.phone}
                    hint="8 ou 10 chiffres, avec ou sans +229."
                    placeholder="ex. 01 97 12 34 56"
                    // type/inputmode conformes au tableau de pages/checkout.md
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(v) => update('phone', v)}
                  />

                  {/* Quartier : select natif plutot que saisie libre dans le
                      tunnel — moins de friction, pas d'ambiguite. */}
                  <FieldError id="zone" label="Quartier de livraison" required error={errors.zone}>
                    <select
                      id="field-zone"
                      name="zone"
                      className="input"
                      value={form.zone}
                      aria-invalid={Boolean(errors.zone)}
                      aria-describedby={errors.zone ? 'error-zone' : undefined}
                      onChange={(e) => update('zone', e.target.value)}
                      required
                    >
                      <option value="">Choisir un quartier…</option>
                      {zones.map((zone) => (
                        <option
                          key={`${zone.ville}|${zone.quartier}`}
                          value={`${zone.ville}|${zone.quartier}`}
                          disabled={!zone.served}
                        >
                          {zone.quartier} — {zone.ville}
                          {zone.served ? ` · ${zone.eta} · ${formatXOF(zone.fee ?? 0)}` : ' · non desservi'}
                        </option>
                      ))}
                    </select>
                  </FieldError>

                  <Field
                    id="landmark"
                    label="Repère"
                    required
                    error={errors.landmark}
                    hint="Ce qui permettra au coursier de vous trouver."
                    placeholder="ex. portail bleu en face de la pharmacie"
                    autoComplete="street-address"
                    value={form.landmark}
                    onChange={(v) => update('landmark', v)}
                  />

                  <Field
                    id="email"
                    label="E-mail"
                    optional
                    error={errors.email}
                    hint="Facultatif — pour recevoir le reçu."
                    placeholder="ex. aline@exemple.bj"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(v) => update('email', v)}
                  />
                </div>
              </fieldset>

              {/* Garde-fou ordonnance — contrainte locale du Master */}
              {prescriptionLines.length > 0 && (
                <div className="bg-muted mt-6 rounded-lg border p-4">
                  <p className="font-heading text-foreground flex items-start gap-2 text-sm font-semibold">
                    <Icon name="stethoscope" className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    Ordonnance requise
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Votre panier contient{' '}
                    <strong className="text-foreground">
                      {prescriptionLines.map((l) => l.product.name).join(', ')}
                    </strong>
                    . Notre pharmacie partenaire vérifiera l’ordonnance par WhatsApp ou par appel
                    avant la livraison. Préparez une photo de l’ordonnance.
                  </p>
                </div>
              )}

              <div className="mt-8">
                <button type="submit" className="btn-primary w-full sm:w-auto sm:px-10">
                  Continuer vers le paiement
                  <Icon name="arrowRight" className="h-5 w-5" />
                </button>
              </div>
            </form>
          )}

          {/* ---------------------------------------------------- */}
          {/* ETAPE 2 — PAIEMENT                                    */}
          {/* ---------------------------------------------------- */}
          {step === 2 && (
            <form
              ref={form2Ref}
              onSubmit={submitStep2}
              noValidate
              // aria-busy pendant l'envoi : UX High — « preserve layout focus and
              // accessible busy status ».
              aria-busy={busy}
            >
              <h1 ref={step2Ref} tabIndex={-1} className="font-heading text-foreground text-2xl font-bold focus:outline-none">
                Comment payez-vous&nbsp;?
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Mobile money en premier. La carte et le paiement à la livraison restent disponibles.
              </p>

              {/* Selecteur de moyen de paiement : radiogroup natif via fieldset.
                  Cartes >= 48px, ecart >= 8px, selection marquee par la bordure
                  ET par une coche — pas par la couleur seule. */}
              <fieldset className="mt-6 border-0 p-0" aria-describedby={errors.payment ? 'error-payment' : undefined}>
                <legend className="font-heading text-foreground mb-3 block text-base font-semibold">
                  Moyen de paiement <span className="text-destructive" aria-hidden="true">*</span>
                </legend>

                <div className="grid gap-2">
                  {paymentMethods.map((method) => {
                    const checked = paymentId === method.id;
                    return (
                      <label
                        key={method.id}
                        htmlFor={`payment-${method.id}`}
                        className={`bg-card flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                          checked ? 'border-primary ring-ring ring-2' : 'hover:border-border-strong'
                        }`}
                      >
                        <input
                          id={`payment-${method.id}`}
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={checked}
                          onChange={() => {
                            setPaymentId(method.id);
                            setErrors((p) => ({ ...p, payment: undefined }));
                          }}
                          className="text-primary h-5 w-5 shrink-0"
                        />
                        <span className="text-primary shrink-0">
                          {/* Icone SVG. En production : logo officiel de
                              l'operateur, egalement en SVG — jamais d'emoji. */}
                          <PaymentIcon kind={method.kind} className="h-6 w-6" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="text-foreground block font-semibold">{method.name}</span>
                          {method.detail && (
                            <span className="text-muted-foreground block text-sm">{method.detail}</span>
                          )}
                        </span>
                        {/* Coche en plus de la bordure : la selection n'est pas
                            signalee par la couleur seule. */}
                        {checked && <Icon name="check" className="text-primary h-5 w-5 shrink-0" />}
                      </label>
                    );
                  })}
                </div>

                {errors.payment && <ErrorText id="payment">{errors.payment}</ErrorText>}
              </fieldset>

              {/* Champ OTP — mobile money uniquement */}
              {isMobileMoney && (
                <div className="bg-muted mt-6 rounded-lg border p-4">
                  <Field
                    id="otp"
                    label="Code de confirmation"
                    required
                    error={errors.otp}
                    hint={`Composez *144# ou #555# sur le numéro lié à ${selectedPayment?.name ?? ''}, puis reportez le code ici.`}
                    placeholder="ex. 4821"
                    // ⚠️ Le COLLAGE DOIT RESTER AUTORISE : aucun onpaste bloquant.
                    // UX High : DON'T « Block paste or require manual OTP
                    // transcription with no alternative ».
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(v) => {
                      // Seuls les chiffres sont filtres — le collage reste permis.
                      setOtp(v.replace(/[^\d]/g, '').slice(0, 6));
                      setErrors((p) => ({ ...p, otp: undefined }));
                    }}
                  />
                  <p className="text-muted-foreground mt-2 flex items-start gap-1.5 text-xs">
                    <Icon name="info" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Vous pouvez coller le code reçu. Si vous ne recevez rien sous 2 minutes,
                    demandez un renvoi ou écrivez-nous sur WhatsApp.
                  </p>
                </div>
              )}

              {/* Etats du bouton : idle -> loading -> awaiting -> success | error.
                  UX High : DO « Show loading then success/error state »,
                  DON'T « No feedback after submit ». */}
              <div className="mt-8 space-y-3">
                <button type="submit" className="btn-primary w-full" disabled={busy}>
                  {busy ? (
                    <>
                      <Icon name="spinner" className="h-5 w-5 animate-spin" />
                      {submitState === 'awaiting'
                        ? `Attente de l’opérateur… ${awaitElapsed}s`
                        : 'Vérification en cours…'}
                    </>
                  ) : (
                    <>
                      <Icon name="lock" className="h-5 w-5" />
                      {/* Le montant est RAPPELE sur le bouton : c'est la derniere
                          chose lue avant de confirmer. */}
                      Payer {formatXOF(total)}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={busy}
                  className="btn-outline w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon name="chevronRight" className="h-4 w-4 rotate-180" />
                  Modifier la livraison
                </button>
              </div>

              {/* Attente operateur : etat DISTINCT, explique, avec issue de secours.
                  Contrainte locale du Master : la confirmation USSD peut depasser 30 s. */}
              {submitState === 'awaiting' && (
                <div className="bg-card mt-4 rounded-lg border p-4" role="status" aria-live="polite">
                  <p className="font-heading text-foreground flex items-center gap-2 text-sm font-semibold">
                    <Icon name="clock" className="text-primary h-4 w-4 shrink-0" />
                    En attente de confirmation {selectedPayment?.name}
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Validez la demande sur votre téléphone. Cette attente peut dépasser 30 secondes.
                    Ne rechargez pas la page et ne payez pas une seconde fois&nbsp;: la commande est
                    déjà enregistrée.
                  </p>
                  <p className="text-muted-foreground mt-2 text-xs">
                    Écoulé : {awaitElapsed}s. Aucun débit ne sera effectué sans confirmation de
                    l’opérateur.
                  </p>
                  <a
                    href={SUPPORT_WHATSAPP}
                    className="text-primary mt-3 inline-flex min-h-12 items-center gap-2 text-sm font-semibold"
                  >
                    <Icon name="message" className="h-4 w-4" />
                    Signaler un problème sur WhatsApp
                  </a>
                </div>
              )}

              {/* Controle de demonstration — a retirer en production. */}
              <div className="bg-muted mt-6 rounded-lg border border-dashed p-3">
                <label htmlFor="simulate-failure" className="flex min-h-12 cursor-pointer items-center gap-3 text-sm">
                  <input
                    id="simulate-failure"
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="h-5 w-5 shrink-0"
                  />
                  <span>
                    <span className="text-foreground block font-semibold">
                      Démo : simuler un échec opérateur
                    </span>
                    <span className="text-muted-foreground block text-xs">
                      Permet de vérifier le résumé d’erreurs et la conservation du panier.
                    </span>
                  </span>
                </label>
              </div>
            </form>
          )}
        </div>

        {/* ------------------------------------------------------ */}
        {/* RESUME DE COMMANDE — sticky a droite en desktop         */}
        {/* ------------------------------------------------------ */}
        <aside
          aria-labelledby="order-summary"
          className="card lg:sticky lg:top-24 lg:h-fit lg:self-start"
        >
          <h2 id="order-summary" className="font-heading text-foreground text-lg font-bold">
            Votre commande
          </h2>
          {/* Message atomique complet, pas un nombre nu — UX High. */}
          <p className="text-muted-foreground mt-1 text-sm">
            {cartCount} articles dans le panier
          </p>

          <ul className="mt-4 space-y-3">
            {lines.map(({ product, qty, total: lineTotal }) => (
              <li key={product.id} className="flex items-start justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-start gap-2">
                  <Icon name={product.icon} className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="text-foreground block truncate">{product.name}</span>
                    <span className="text-muted-foreground block text-xs">
                      {qty} × {formatXOF(product.price)}
                    </span>
                  </span>
                </span>
                <span className="font-heading shrink-0 font-semibold">{formatXOF(lineTotal)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Sous-total</dt>
              <dd className="text-foreground font-medium">{formatXOF(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">
                Livraison
                {selectedZone && <span className="block text-xs">{selectedZone.quartier}</span>}
              </dt>
              <dd className="text-foreground font-medium">
                {deliveryFee === 0 ? (
                  <span className="text-primary font-semibold">Offerte</span>
                ) : (
                  formatXOF(deliveryFee)
                )}
              </dd>
            </div>
            {/* Delai affiche AVANT la validation — contrainte de confiance du
                Master. La ligne est TOUJOURS presente : sans quartier choisi
                elle affiche une fourchette par defaut au lieu de disparaitre,
                sinon l'information manque au moment meme ou l'utilisateur
                decide de payer. */}
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Délai estimé</dt>
              <dd className="text-foreground font-medium">
                {selectedZone?.eta ?? '25–90 min selon le quartier'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t pt-3">
              <dt className="font-heading text-foreground text-base font-bold">Total</dt>
              <dd className="font-heading text-primary text-xl font-bold">{formatXOF(total)}</dd>
            </div>
          </dl>

          <p className="text-muted-foreground mt-4 flex items-start gap-2 text-xs">
            <Icon name="lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Paiement sécurisé. Aucun débit sans confirmation de l’opérateur.
          </p>
        </aside>
      </div>

      {/* Resume collant en bas d'ecran, mobile uniquement : le montant doit
          rester visible pendant toute la saisie. */}
      <div className="bg-card border-border fixed inset-x-0 bottom-0 z-40 border-t p-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <span>
            <span className="text-muted-foreground block text-xs">
              {cartCount} articles · {selectedZone?.eta ?? 'délai à confirmer'}
            </span>
            <span className="font-heading text-primary text-lg font-bold">{formatXOF(total)}</span>
          </span>
          {step === 1 ? (
            <button
              type="button"
              className="btn-primary px-5 text-sm"
              onClick={() => form1Ref.current?.requestSubmit()}
            >
              Continuer
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary px-5 text-sm"
              disabled={busy}
              onClick={() => form2Ref.current?.requestSubmit()}
            >
              {busy ? 'En cours…' : `Payer ${formatXOF(total)}`}
            </button>
          )}
        </div>
      </div>
      {/* Espace reserve pour la barre collante : « No content hidden behind
          fixed navbars ». */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Champs                                                              */
/* ------------------------------------------------------------------ */

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={`error-${id}`} className="text-destructive mt-1.5 flex items-start gap-1.5 text-sm font-medium">
      <Icon name="warning" className="mt-0.5 h-4 w-4 shrink-0" />
      {children}
    </p>
  );
}

/** Enveloppe : libelle visible + controle + erreur inline + hint. */
function FieldError({
  id,
  label,
  required,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const describedBy = [hint ? `hint-${id}` : null, error ? `error-${id}` : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div>
      {/* Libelle TOUJOURS visible au-dessus du champ — UX High. */}
      <label htmlFor={`field-${id}`} className="font-heading text-foreground mb-1.5 block text-sm font-semibold">
        {label}{' '}
        {required && <span className="text-destructive" aria-hidden="true">*</span>}
        {optional && <span className="text-muted-foreground font-normal">(facultatif)</span>}
      </label>
      {hint && (
        <p id={`hint-${id}`} className="text-muted-foreground mb-1.5 text-xs">
          {hint}
        </p>
      )}
      {/* L'erreur inline est CONSERVEE en plus du resume — UX High :
          DON'T « Replace inline errors with a visual-only summary ». */}
      <div aria-describedby={describedBy}>{children}</div>
      {error && <ErrorText id={id}>{error}</ErrorText>}
    </div>
  );
}

function Field({
  id,
  label,
  required,
  optional,
  hint,
  error,
  placeholder,
  type = 'text',
  inputMode,
  autoComplete,
  maxLength,
  value,
  onChange,
}: {
  id: keyof FieldErrors;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  placeholder?: string;
  type?: string;
  inputMode?: 'tel' | 'numeric' | 'email' | 'text';
  autoComplete?: string;
  maxLength?: number;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FieldError id={id} label={label} required={required} optional={optional} hint={hint} error={error}>
      <input
        id={`field-${id}`}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      />
    </FieldError>
  );
}
