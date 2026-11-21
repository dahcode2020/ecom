'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './icon';

/**
 * Delai restant et actualisation du suivi.
 *
 * HONNETETE SUR LA DONNEE : il n'y a pas de backend dans ce depot. Le compte a
 * rebours est une EXTRAPOLATION LOCALE du delai fourni par le serveur au moment
 * du rendu — il ne recoit aucune position reelle. En production, ce composant
 * est le point d'attache d'un `EventSource` (SSE) ou d'un sondage HTTP vers
 * l'API de suivi ; l'UI, les libelles et les etats d'erreur sont deja en place.
 *
 * Pas de sondage automatique ici : sur 3G/4G instable, un `setInterval` qui
 * interroge le serveur toutes les 15 s epuise la batterie et la bande passante
 * sans garantie de reponse. L'actualisation est donc EXPLICITE (bouton), ce qui
 * correspond aussi a la regle du checkout : ne jamais relancer une requete
 * automatiquement pendant un etat « en attente ».
 *
 * HYDRATATION : le premier rendu utilise la valeur serveur (`etaMin`). Aucune
 * lecture de `Date.now()` pendant le rendu, donc le HTML du serveur et celui du
 * client sont identiques et React ne signale pas de desynchronisation. Le compte
 * a rebours ne demarre qu'apres le montage, dans `useEffect`.
 */

type Props = {
  etaMin: number;
  orderRef: string;
};

export function LiveEta({ etaMin, orderRef }: Props) {
  const router = useRouter();
  const [remaining, setRemaining] = useState<number>(etaMin);
  const [isRefreshing, startRefresh] = useTransition();

  // Le delai serveur change entre les rendus (actualisation) : on se resynchronise.
  useEffect(() => {
    setRemaining(etaMin);
  }, [etaMin]);

  // `arrived` est declare AVANT l'effet et utilise comme dependance : l'effet ne
  // se rejoue qu'au basculement vrai/faux, ce qui demarre et arrete l'intervalle
  // correctement. (Une dependance ecrite `[remaining > 0]` directement dans le
  // tableau obtenait le meme resultat mais restait une astuce illisible et
  // signalee par la regle exhaustive-deps.)
  const arrived = remaining <= 0;

  useEffect(() => {
    if (arrived) return;
    // Pas de tick a la seconde : une minute par decrement suffit a un delai de
    // livraison, et evite de rendre le composant 60 fois par minute.
    const id = setInterval(() => {
      setRemaining((value) => (value > 1 ? value - 1 : 0));
    }, 60_000);
    return () => clearInterval(id);
  }, [arrived]);

  function refresh() {
    startRefresh(() => router.refresh());
  }

  return (
    <div className="card flex flex-col gap-4 p-4 md:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-sm">
            {arrived ? 'Le coursier arrive' : 'Arrivée estimée dans'}
          </p>
          {/* Libelle court et explicite, jamais un compte a rebours a la seconde
              pres : les secondes qui defilent generent de l'anxiete et changent
              trop vite pour un lecteur d'ecran. */}
          <p className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            {arrived ? (
              'Maintenant'
            ) : (
              <>
                {remaining}
                <span className="text-muted-foreground ml-1.5 text-lg font-semibold">min</span>
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={isRefreshing}
          aria-disabled={isRefreshing}
          className={
            isRefreshing
              ? 'text-muted-foreground min-h-12 cursor-not-allowed rounded-md border px-4 py-2 text-sm font-semibold opacity-60'
              : 'btn-outline min-h-12 px-4 py-2 text-sm'
          }
        >
          <span className="flex items-center gap-2">
            {/* `Icon` applique deja `aria-hidden` par defaut : l'icone est
                decorative, le libelle du bouton porte l'information. */}
            <Icon name="spinner" className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualisation…' : 'Actualiser'}
          </span>
        </button>
      </div>

      {/* Rappel de la reference : le client la lit au telephone pour identifier
          sa commande. Elle doit rester visible, pas seulement dans l'URL. */}
      <p className="text-muted-foreground border-border flex items-center gap-2 border-t pt-3 text-sm">
        <Icon name="info" className="h-4 w-4 shrink-0" />
        Commande <span className="text-foreground font-semibold">{orderRef}</span>
        <span aria-hidden="true">·</span>
        <span>Le délai est recalculé à chaque actualisation.</span>
      </p>
    </div>
  );
}
