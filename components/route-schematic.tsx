import { Icon } from './icon';
import type { DemoOrder } from '@/lib/data';

/**
 * Schema de trajet — SVG STATIQUE, aucune tuile de carte.
 *
 * DECISION TRANCHEE (elle etait notee « a trancher » dans MASTER.md) :
 * `products.csv` recommandait « Inventory Dashboard » pour le suivi, mais cette
 * ligne est HERITEE du modele Pharmacy/Drug Store. La ligne Food Delivery /
 * On-Demand recommande « Real-Time Monitoring + Map », bien plus adaptee a un
 * coursier. C'est cette derniere qui est retenue.
 *
 * MAIS avec la contrainte du Master : « pas de fond de carte lourd — tuiles
 * legeres, ou schema statique + etapes textuelles si le reseau est degrade ».
 * Un fournisseur de tuiles (Google Maps, Mapbox, OSM) couterait :
 *   - une cle d'API et des requetes vers un tiers, or l'environnement de build
 *     n'a pas d'acces reseau sortant (deja constate avec fonts.googleapis.com) ;
 *   - 150 a 500 Ko de tuiles raster + JS, redhibitoire en 3G/4G instable,
 *     la cible declaree de ce projet ;
 *   - une dependance a la geolocalisation du client.
 *
 * Donc : un schema SVG en ligne, ~2 Ko, rendu cote serveur, qui fonctionne hors
 * ligne et n'empeche jamais l'affichage des etapes textuelles. Le texte reste la
 * SOURCE DE VERITE ; le schema est un complement visuel, jamais l'inverse.
 * C'est pourquoi chaque information du schema existe aussi en texte a cote.
 */

type Props = { order: DemoOrder };

/** Positions des jalons sur le schema, en pourcentage du trajet. */
const DEPOT = 0;
const DESTINATION = 100;

export function RouteSchematic({ order }: Props) {
  // Bornage defensif : une progression hors [0, 100] ferait sortir le marqueur
  // du SVG. `progress` vient de donnees de demonstration, mais une commande
  // reelle viendra d'une API.
  const progress = Math.min(DESTINATION, Math.max(DEPOT, order.progress * 100));

  return (
    <figure className="card overflow-hidden p-0">
      <figcaption className="border-border text-foreground border-b px-4 py-3 text-sm font-semibold">
        Trajet du coursier
      </figcaption>

      <div className="bg-muted px-4 py-6 md:px-6">
        <svg
          viewBox="0 0 400 72"
          className="h-auto w-full"
          // role="img" + <title>/<desc> : le schema est une image pour un
          // lecteur d'ecran. Son contenu textuel equivalent est dans la liste
          // d'etapes juste a cote, donc rien n'est perdu.
          role="img"
          aria-labelledby="trajet-titre trajet-desc"
          preserveAspectRatio="xMidYMid meet"
        >
          <title id="trajet-titre">
            Position du coursier entre le dépôt et {order.quartier}
          </title>
          <desc id="trajet-desc">
            {`Schéma du trajet : le coursier ${order.coursier.name} a parcouru environ ${Math.round(progress)} pour cent de la distance entre le dépôt et ${order.quartier}, ${order.ville}.`}
          </desc>

          {/* Troncon deja parcouru */}
          <line
            x1="24"
            y1="36"
            x2="376"
            y2="36"
            stroke="var(--border-strong)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="24"
            y1="36"
            x2={24 + (352 * progress) / 100}
            y2="36"
            stroke="var(--primary)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Depot */}
          <circle cx="24" cy="36" r="7" fill="var(--card)" stroke="var(--primary)" strokeWidth="3" />
          {/* Destination */}
          <circle cx="376" cy="36" r="7" fill="var(--card)" stroke="var(--primary)" strokeWidth="3" />

          {/* Coursier : position calculee, pas une animation CSS, pour rester
              fidele a la donnee reelle. Le halo pulse uniquement si l'utilisateur
              n'a pas demande de mouvement reduit. */}
          <g transform={`translate(${24 + (352 * progress) / 100}, 36)`}>
            <circle r="13" fill="var(--primary)" className="motion-safe:animate-pulse" opacity="0.25" />
            <circle r="11" fill="var(--primary)" />
            {/* Marqueur blanc sur --primary : le seul endroit ou du blanc sur
                vert fonce est utilise, et --primary sombre (#15803D) donne un
                contraste suffisant. Jamais de blanc sur --secondary. */}
            <path
              d="M -4 2 L 0 -4 L 4 2 M -3 2 A 3 3 0 1 0 3 2"
              stroke="var(--primary-foreground)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        <div className="text-muted-foreground mt-3 flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <Icon name="package" className="h-3.5 w-3.5" />
            Dépôt {order.quartier}
          </span>
          <span className="text-foreground font-semibold">{Math.round(progress)} %</span>
          <span className="flex items-center gap-1.5">
            <Icon name="home" className="h-3.5 w-3.5" />
            {order.quartier}
          </span>
        </div>
      </div>
    </figure>
  );
}
