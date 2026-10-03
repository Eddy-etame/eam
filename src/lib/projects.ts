import { categoryLabels, categories } from '@/lib/taxonomy'
import type { Localized, ProjectCategory } from '@/lib/taxonomy'

/**
 * EAM — Project portfolio data. Source of truth for every Work surface.
 *
 * ⚠️ DRAFT METRICS: outcome figures (percentages, Lighthouse scores, user
 * counts) are carried over from the brief and are NOT yet client-verified.
 * Treat them as provisional copy until EAM signs off — see CaseStudy display.
 *
 * Internal/NDA projects (isInternal: true) MUST never expose a live URL or a
 * real screenshot. They render via InternalCard with a confidential badge.
 *
 * Taxonomy (categories + labels) lives in lib/taxonomy.ts — CLIENT components
 * import it from there so this registry never enters a client JS chunk.
 * Server code may use the re-exports below.
 */

export { categoryLabels, categories }
export type { Localized, ProjectCategory }

export interface Project {
  slug: string
  name: string
  client: string
  tagline: Localized
  description: Localized
  category: ProjectCategory
  tags: string[]
  /** '#' for internal/NDA projects (never a live link). */
  liveUrl: string
  /** Real site screenshot under /public/thumbs/<slug>.jpg (set only when captured). */
  thumb?: string
  /** Built under the Microdidact collective (Eddy 2026-07-14) — badges + the
   *  Microdidact world on /work. Solo works: kermhosting, jcboyang-conseil. */
  underMicrodidact?: boolean
  /** Member of a world on /work — it is shown inside that world, never as a
   *  solo card on the registre. */
  world?: 'boxing-center'
  /** A family entry standing for several separately deployed sites — each one
   *  counts in the live-site total and is listed on the case page. */
  sites?: { name: string; url: string; thumb: string }[]
  /** Brand colour used as the card accent. */
  color: string
  year: number
  isFeatured: boolean
  isInternal: boolean
  techStack: string[]
  caseStudy: {
    problem: Localized
    solution: Localized
    outcome: Localized
    /** Client-verified results only — when true, the provisional note is dropped. */
    outcomeVerified?: boolean
    /** Stat band. Craft-level or self-reported figures only — never invented client data. */
    metrics?: { value: string; label: Localized }[]
    /** Screenshot sequence under /public (rendered as a scroll gallery when present). */
    gallery?: string[]
    testimonial?: { quote: Localized; author: string; role?: Localized }
  }
}

export const projects: Project[] = [
  // ── SPORT & BIEN-ÊTRE ─────────────────────────────────────────────────────
  // Boxing Center ecosystem is LIVE on its own bought domains (every URL
  // probed 200 on 2026-10-03): five salle sites (boxing-center-portet.fr,
  // clubmma.fr, boxe-toulouse.com, club-boxe-toulouse.com, mmatoulouse.com),
  // two boxe-anglaise clubs (toulouse-minimes-boxing-club.fr,
  // club-boxe-blagnac.fr), seven proximity sites (boxingcenter-<ville>.fr),
  // three stores (boutique.boxingcenter.fr, boutique-de-boxe.com,
  // matos-de-boxe.fr) + the coach-planning app and the «séance d'essai
  // offerte» funnel (still on vercel.app). boxingcenter.fr remains the legacy
  // WordPress site. The umbrella keeps liveUrl '#' — it IS the world door,
  // each piece carries its own link. No client metrics invented.
  // NOT listed on purpose (Eddy 2026-10-03): concours.boxingcenter.fr and
  // materiel-de-boxe.fr.
  {
    slug: 'boxing-center',
    name: 'Boxing Center',
    client: 'Boxing Center Toulouse',
    tagline: {
      fr: 'Cinq salles, dix-neuf pièces en ligne. Une seule obsession.',
      en: 'Five gyms, nineteen live pieces. One obsession.',
    },
    description: {
      fr: "L'écosystème digital du réseau Boxing Center — cinq sites de salle immersifs (Portet, États-Unis, Minimes, St-Cyprien, Ramonville), deux clubs de boxe anglaise (TMBC, Blagnac), sept sites de proximité autour de Toulouse, trois boutiques (Box Plus, Boutique de Boxe, Matos de Boxe), le planning des coachs et le tunnel « séance d'essai offerte ». Chaque site sur son propre domaine, aucun dupliqué.",
      en: 'The digital ecosystem of the Boxing Center network — five immersive gym sites (Portet, États-Unis, Minimes, St-Cyprien, Ramonville), two English-boxing clubs (TMBC, Blagnac), seven proximity sites around Toulouse, three stores (Box Plus, Boutique de Boxe, Matos de Boxe), the coach-planning app and the free-trial funnel. Every site on its own domain, none duplicated.',
    },
    category: 'Sport & Bien-être',
    tags: ['Sport de combat', 'Boxe', 'WebGL / 3D', 'Three.js', 'Réseau', 'Toulouse'],
    liveUrl: '#',
    world: 'boxing-center',
    color: '#1E2044',
    year: 2026,
    isFeatured: false, // the umbrella lives as the world door on /work, not a rail card
    isInternal: false,
    techStack: ['Next.js', 'TypeScript', 'Three.js / WebGL', 'GSAP', 'Lenis', 'Tailwind CSS'],
    caseStudy: {
      problem: {
        fr: "Un réseau de salles réputé sur un site vieillissant et uniforme — aucune salle ne se distingue, aucune immersion à la hauteur de l'énergie du club.",
        en: 'A respected gym network on an ageing, uniform site — no gym stands out, no immersion worthy of the club’s energy.',
      },
      solution: {
        fr: "Une maquette immersive par salle : monolithe d'acier en 3D temps réel, survol scroll-piloté des zones, double palette commutable, typographie et métal propres à chaque lieu — copie toujours dans le DOM (SEO/a11y), la 3D en enrichissement progressif avec repli sans-WebGL.",
        en: 'One immersive maquette per gym: a real-time 3D steel monolith, a scroll-driven flythrough of the zones, a switchable dual palette, and per-venue type and metal — all copy stays in the DOM (SEO/a11y), 3D as progressive enhancement with a no-WebGL fallback.',
      },
      outcome: {
        fr: "En ligne (2026) — dix-neuf pièces déployées : cinq sites de salle, deux clubs de boxe anglaise, sept sites de proximité, trois boutiques et deux outils, chaque site sur son propre nom de domaine. Indicateurs clients publiés après mesure, jamais avant.",
        en: 'Live (2026) — nineteen pieces deployed: five gym sites, two English-boxing clubs, seven proximity sites, three stores and two tools, every site on its own domain name. Client metrics published after measurement, never before.',
      },
      // Craft facts — not client outcomes.
      metrics: [
        { value: '5', label: { fr: 'salles, une identité chacune', en: 'gyms, one identity each' } },
        { value: '19', label: { fr: 'pièces en ligne — sites, boutiques, outils', en: 'live pieces — sites, stores, tools' } },
        { value: '3D', label: { fr: 'monolithe temps réel (Three.js)', en: 'real-time monolith (Three.js)' } },
      ],
      // Captures of what EAM built — salles, clubs, proximity, stores.
      gallery: [
        '/thumbs/boxing-center-portet.jpg',
        '/thumbs/boxing-center-etats-unis.jpg',
        '/thumbs/boxing-center-minimes.jpg',
        '/thumbs/boxing-center-st-cyprien.jpg',
        '/thumbs/boxing-center-ramonville.jpg',
        '/thumbs/tmbc.jpg',
        '/thumbs/club-boxe-blagnac.jpg',
        '/thumbs/bc-sat-colomiers.jpg',
        '/thumbs/boutique-de-boxe.jpg',
        '/thumbs/bc-box-plus.jpg',
      ],
    },
  },
  {
    slug: 'boxing-center-portet',
    name: 'Boxing Center — Portet',
    client: 'Boxing Center Toulouse',
    tagline: {
      fr: "L'arène, forgée pour le web",
      en: 'The arena, forged for the web',
    },
    description: {
      fr: "Vitrine immersive pour la salle phare du réseau — 600 m² dédiés aux sports de combat à Portet-sur-Garonne, avec ring de boxe anglaise et cage MMA. Le nom du club se forme en particules à l'ouverture, puis scroll cinématique, scènes 3D et son d'ambiance.",
      en: 'An immersive showcase for the flagship of the network — 600 m² dedicated to combat sports in Portet-sur-Garonne, with an English-boxing ring and an MMA cage. The club name assembles from particles on arrival, then cinematic scroll, 3D scenes and ambient sound.',
    },
    category: 'Sport & Bien-être',
    tags: ['Boxe', 'Sport de combat', 'WebGL / 3D', 'Immersif', 'Toulouse'],
    liveUrl: 'https://boxing-center-portet.fr/',
    world: 'boxing-center',
    color: '#E8001C',
    year: 2026,
    isFeatured: true,
    isInternal: false,
    techStack: ['Next.js', 'TypeScript', 'Three.js / WebGL', 'GSAP', 'Lenis', 'Tailwind CSS'],
    caseStudy: {
      problem: {
        fr: "Une salle phare — 600 m², un ring de boxe anglaise, une cage MMA, neuf disciplines — enfermée dans un site générique qui ne transmettait ni la puissance du lieu ni la richesse de son planning.",
        en: 'A flagship room — 600 m², an English-boxing ring, an MMA cage, nine disciplines — trapped in a generic site that conveyed neither the power of the place nor the depth of its schedule.',
      },
      solution: {
        fr: "Une vitrine « arène polie » : noir mat, argent et rouge de combat, défilement lissé par Lenis, chorégraphie GSAP et décor d'arène en Three.js en surcouche discrète, avec repli sans-WebGL. Toute la copie reste dans le DOM ; la 3D n'est qu'atmosphère. Légibilité WCAG AA verrouillée.",
        en: 'A “polished-arena” showcase: matte black, silver and fight-red, Lenis-smoothed scroll, GSAP choreography and a quiet Three.js arena overlay, with a no-WebGL fallback. Every line of copy stays in the DOM; the 3D is atmosphere only. WCAG-AA legibility locked.',
      },
      outcome: {
        fr: "En ligne (2026) sur boxing-center-portet.fr — l'expérience « arène polie » complète, 31 pages dont une par discipline et par coach, planning vivant, FAQ et conseils, avec repli sans-WebGL et copie DOM pour la performance, le SEO local et l'accessibilité.",
        en: 'Live (2026) at boxing-center-portet.fr — the full “polished-arena” experience, 31 pages including one per discipline and per coach, a live schedule, FAQs and guides, with a no-WebGL fallback and DOM copy for performance, local SEO and accessibility.',
      },
    },
  },
  {
    slug: 'boxing-center-etats-unis',
    name: 'Boxing Center — États-Unis',
    client: 'Boxing Center Toulouse',
    tagline: {
      fr: 'Un monument que l’on approche',
      en: 'A monument you approach',
    },
    description: {
      fr: "Salle États-Unis — présentée par le club comme la plus grande salle de sports de combat de France. DA « monument » : marine et bronze, capitales gravées à la Cinzel, et un véritable monolithe d'acier en Three.js que l'on traverse.",
      en: 'The États-Unis room — billed by the club as the largest combat-sports gym in France. A “monument” art direction: navy and bronze, Cinzel engraved caps, and a real Three.js steel monolith you walk through.',
    },
    category: 'Sport & Bien-être',
    tags: ['Boxe', 'Sport de combat', 'WebGL / 3D', 'Three.js', 'Toulouse'],
    liveUrl: 'https://clubmma.fr/',
    world: 'boxing-center',
    color: '#7A3D16',
    year: 2026,
    isFeatured: true,
    isInternal: false,
    techStack: ['Next.js', 'TypeScript', 'Three.js / WebGL', 'GSAP', 'Lenis', 'Tailwind CSS'],
    caseStudy: {
      problem: {
        fr: "La salle amirale méritait mieux qu'une fiche : il fallait faire ressentir l'échelle du bâtiment et distinguer ce lieu sans dupliquer ni contenu ni look.",
        en: 'The flagship room deserved more than a listing: the sheer scale of the building had to be felt, and the venue set apart without duplicating content or look.',
      },
      solution: {
        fr: "Un hero monolithe acier/bronze révélé au curseur, puis un survol scroll-piloté de trois salles-zones (I/II/III), fondu par la distance caméra. Bascule de palette bronze/acier persistée (sans flash). Repli vidéo + scroll photo quand le WebGL manque.",
        en: 'A steel/bronze monolith hero revealed by the cursor, then a scroll-driven flythrough of three zone-rooms (I/II/III), cross-dissolved by camera distance. A persisted bronze/steel palette toggle (no flash). Video + photo-scroll fallback when WebGL is unavailable.',
      },
      outcome: {
        fr: "En ligne (2026) sur clubmma.fr — le walkthrough Three.js réel avec repli DOM, au service de la plus grande salle de sports de combat de France.",
        en: 'Live (2026) at clubmma.fr — the real Three.js walkthrough with a DOM fallback, serving the largest combat-sports gym in France.',
      },
    },
  },
  {
    slug: 'boxing-center-minimes',
    name: 'Boxing Center — Minimes',
    client: 'Boxing Center Toulouse',
    tagline: {
      fr: 'Le club où Toulouse apprend à boxer',
      en: 'Where Toulouse learns to box',
    },
    description: {
      fr: "Le site du club des Minimes, à la Barrière de Paris — boxe anglaise, boxe éducative, Boxing Lady, pieds-poings et cross training. Un hero vidéo découpé dans le lettrage du club, avec bascule pochoir / plein, et une visite rythmée en rounds.",
      en: 'The site of the Minimes club, at Barrière de Paris — English boxing, youth boxing, Boxing Lady, kick-boxing and cross training. A video hero cut through the club lettering, with a stencil / solid toggle, and a visit paced in rounds.',
    },
    category: 'Sport & Bien-être',
    tags: ['Boxe', 'Sport de combat', 'Vidéo', 'SEO Local', 'Toulouse'],
    liveUrl: 'https://boxe-toulouse.com/',
    world: 'boxing-center',
    color: '#C8102E',
    year: 2026,
    isFeatured: false,
    isInternal: false,
    techStack: ['Astro', 'Canvas', 'Cloudinary', 'Schema.org'],
    caseStudy: {
      problem: {
        fr: "Le club historique du réseau devait répondre en une page à la question de tout débutant — « est-ce pour moi ? » — et se classer sur la requête la plus disputée de la ville : club de boxe à Toulouse.",
        en: 'The network’s historic club had to answer every beginner’s question in one page — “is this for me?” — and rank on the most contested query in town: boxing club in Toulouse.',
      },
      solution: {
        fr: "Un hero où la vidéo de la salle passe à travers le lettrage BOXING MINIMES, commutable en un clic entre pochoir et plein. La visite avance par rounds numérotés — salle, activités, coachs, planning, tarifs — et chaque page porte ses données structurées, ses avis et son plan d'accès.",
        en: 'A hero where the gym video plays through the BOXING MINIMES lettering, switchable in one click between stencil and solid. The visit moves in numbered rounds — gym, classes, coaches, schedule, pricing — and every page carries its structured data, reviews and access map.',
      },
      outcome: {
        fr: "En ligne (2026) sur boxe-toulouse.com — son propre nom de domaine, taillé pour la requête. Positions publiées après mesure, jamais avant.",
        en: 'Live (2026) at boxe-toulouse.com — its own domain name, cut for the query. Rankings published after measurement, never before.',
      },
    },
  },
  {
    slug: 'boxing-center-st-cyprien',
    name: 'Boxing Center — Saint-Cyprien',
    client: 'Boxing Center Toulouse',
    tagline: {
      fr: 'Rive gauche, à quatre minutes du métro',
      en: 'Left bank, four minutes from the metro',
    },
    description: {
      fr: "Le site du club de Saint-Cyprien, rive gauche de Toulouse — boxe anglaise, thaï / K1, grappling, Hyrox, Lady Punch et école de boxe dès 3 ans, à 4 minutes du métro A. Le blason du réseau posé sur la salle elle-même, et l'essentiel dès le premier écran.",
      en: 'The site of the Saint-Cyprien club, on Toulouse’s left bank — English boxing, Thai / K1, grappling, Hyrox, Lady Punch and a boxing school from age 3, four minutes from metro line A. The network crest set over the room itself, and the essentials on the very first screen.',
    },
    category: 'Sport & Bien-être',
    tags: ['Boxe', 'Sport de combat', 'SEO Local', 'Toulouse'],
    liveUrl: 'https://club-boxe-toulouse.com/',
    world: 'boxing-center',
    color: '#1F3A6B',
    year: 2026,
    isFeatured: false,
    isInternal: false,
    techStack: ['Astro', 'SEO Local', 'Schema.org'],
    caseStudy: {
      problem: {
        fr: "Un club de centre-ville, proche du métro, noyé parmi les salles de sport toulousaines : il fallait dire en un écran où il est, pour qui il est, et ce qu'on y pratique.",
        en: 'A city-centre club, close to the metro, lost among Toulouse’s gyms: one screen had to say where it is, who it is for, and what you train there.',
      },
      solution: {
        fr: "Un hero qui pose le blason sur la salle elle-même, trois faits sous le titre — l'adresse, les six jours d'ouverture, l'accueil des débutants — puis activités, coachs, planning et tarifs. L'offre du moment reste à un clic depuis chaque écran.",
        en: 'A hero that sets the crest over the room itself, three facts under the title — the address, six days a week, beginners welcome — then classes, coaches, schedule and pricing. The current offer stays one click away from every screen.',
      },
      outcome: {
        fr: "En ligne (2026) sur club-boxe-toulouse.com — son propre nom de domaine. Positions publiées après mesure, jamais avant.",
        en: 'Live (2026) at club-boxe-toulouse.com — its own domain name. Rankings published after measurement, never before.',
      },
    },
  },
  {
    slug: 'boxing-center-ramonville',
    name: 'Boxing Center — Ramonville',
    client: 'Boxing Center Toulouse',
    tagline: {
      fr: "L'octogone qui donne l'heure",
      en: 'The octagon that tells the time',
    },
    description: {
      fr: "Le site du club de Ramonville-Saint-Agne — 300 m² d'entraînement dehors et à l'abri, un octogone de 7 mètres, un grand ring, au terminus du métro B. L'octogone du hero tourne : ses huit côtés sont les huit disciplines, et la page affiche l'heure de Paris et la température du plateau.",
      en: 'The site of the Ramonville-Saint-Agne club — 300 m² of covered outdoor training, a 7-metre octagon, a full ring, at the end of metro line B. The hero octagon turns: its eight sides are the eight disciplines, and the page shows Paris time and the temperature on the training floor.',
    },
    category: 'Sport & Bien-être',
    tags: ['MMA', 'Boxe', 'Sport de combat', 'Assistant IA', 'SEO Local', 'Toulouse'],
    liveUrl: 'https://mmatoulouse.com/',
    world: 'boxing-center',
    color: '#4A6A8F',
    year: 2026,
    isFeatured: false,
    isInternal: false,
    techStack: ['Astro', 'GSAP', 'SVG', 'Assistant IA', 'Schema.org'],
    caseStudy: {
      problem: {
        fr: "Une salle à ciel ouvert, unique à Toulouse, que rien ne distinguait en ligne : son octogone, son plein air et son métro au bout de la rue n'apparaissaient nulle part.",
        en: 'An open-air gym, unique in Toulouse, with nothing online to set it apart: its octagon, its outdoor floor and the metro at the end of the street appeared nowhere.',
      },
      solution: {
        fr: "L'octogone devient la navigation : il tourne, chaque côté ouvre une discipline. Le planning est vivant — il sait quel cours est en cours et lequel suit —, chaque discipline et chaque coach a sa page, et un assistant répond aux questions du visiteur à partir du planning et des tarifs réels.",
        en: 'The octagon becomes the navigation: it turns, each side opens a discipline. The schedule is live — it knows which class is on and which is next — every discipline and coach has a page, and an assistant answers visitors’ questions from the real schedule and prices.',
      },
      outcome: {
        fr: "En ligne (2026) sur mmatoulouse.com — 28 pages, FAQ et données structurées à l'appui. Positions publiées après mesure, jamais avant.",
        en: 'Live (2026) at mmatoulouse.com — 28 pages, backed by FAQs and structured data. Rankings published after measurement, never before.',
      },
    },
  },
  {
    // The FFBoxe-affiliated English-boxing club hosted at the Minimes gym —
    // its own brand, its own domain (verified on its live pages 2026-10-03).
    slug: 'tmbc',
    name: 'TMBC',
    client: 'Toulouse Minimes Boxing Club',
    tagline: {
      fr: 'Toulouse Minimes Boxing Club — boxe anglaise, depuis 2017',
      en: 'Toulouse Minimes Boxing Club — English boxing, since 2017',
    },
    description: {
      fr: "Le site du Toulouse Minimes Boxing Club, club de boxe anglaise affilié FFBoxe aux Minimes — débutants, loisirs, compétiteurs et école de boxe dès 3 ans. Une identité d'affiche de gala : lettrage usé, rouge de combat, ring dans la pénombre.",
      en: 'The site of the Toulouse Minimes Boxing Club, an FFBoxe-affiliated English-boxing club in the Minimes district — beginners, leisure, competitors and a boxing school from age 3. A fight-poster identity: distressed lettering, fight-red, a ring in half-light.',
    },
    category: 'Sport & Bien-être',
    tags: ['Boxe anglaise', 'Club', 'FFBoxe', 'SEO Local', 'Toulouse'],
    liveUrl: 'https://toulouse-minimes-boxing-club.fr/',
    world: 'boxing-center',
    color: '#B0121A',
    year: 2026,
    isFeatured: false,
    isInternal: false,
    techStack: ['HTML / CSS / JavaScript', 'SEO Local', 'Schema.org', 'Vercel'],
    caseStudy: {
      problem: {
        fr: "Un club de boxe anglaise avec sa propre histoire et ses compétiteurs, sans adresse en ligne à son nom : ses tarifs, ses horaires et son école de boxe étaient introuvables.",
        en: 'An English-boxing club with its own history and its competitors, but no online address under its name: its prices, hours and boxing school were nowhere to be found.',
      },
      solution: {
        fr: "Un site à son image — le blason TMBC plein écran, traité comme une affiche de gala —, puis l'essentiel sans détour : l'essai à 10 €, le tarif saison, le métro à 3 minutes, le planning, la galerie et le contact.",
        en: 'A site in its image — the TMBC crest full-screen, treated like a fight poster — then the essentials, straight: the €10 trial, the season price, the metro three minutes away, the schedule, the gallery and the contact.',
      },
      outcome: {
        fr: "En ligne (2026) sur toulouse-minimes-boxing-club.fr — 14 pages sur son propre nom de domaine. Positions publiées après mesure, jamais avant.",
        en: 'Live (2026) at toulouse-minimes-boxing-club.fr — 14 pages on its own domain name. Rankings published after measurement, never before.',
      },
    },
  },
  {
    slug: 'club-boxe-blagnac',
    name: 'Club de Boxe Blagnac',
    client: 'Club de Boxe Blagnac — réseau Boxing Center',
    tagline: {
      fr: "Six cours, de l'éveil dès 3 ans au groupe compétition",
      en: 'Six classes, from age 3 to the competition squad',
    },
    description: {
      fr: "Le site du club de boxe anglaise de Blagnac, membre du réseau Boxing Center — six cours, six jours sur sept, de l'éveil dès 3 ans au groupe compétition. Une direction éditoriale : grand titre typographique, photographie réelle, aucune information inventée.",
      en: 'The site of the Blagnac English-boxing club, a member of the Boxing Center network — six classes, six days a week, from age 3 to the competition squad. An editorial direction: large typographic title, real photography, no invented information.',
    },
    category: 'Sport & Bien-être',
    tags: ['Boxe anglaise', 'Club', 'SEO Local', 'GEO', 'Blagnac'],
    liveUrl: 'https://www.club-boxe-blagnac.fr/',
    world: 'boxing-center',
    color: '#C5F04A',
    year: 2026,
    isFeatured: false,
    isInternal: false,
    techStack: ['Astro', 'TypeScript', 'MCP', 'llms.txt', 'Schema.org'],
    caseStudy: {
      problem: {
        fr: "Un club à faire exister en ligne à Blagnac, face à des clubs installés qui tiennent la première page — avec une règle : ne publier que des faits confirmés.",
        en: 'A club to bring online in Blagnac, against established clubs holding page one — with one rule: publish confirmed facts only.',
      },
      solution: {
        fr: "Un site statique, pensé mobile d'abord : 23 pages, et un build qui audite chacune — titre, description, H1, données structurées, images, indexabilité. Les moteurs de réponse y lisent un llms.txt et un point d'accès MCP en lecture seule.",
        en: 'A static, mobile-first site: 23 pages, and a build that audits each one — title, description, H1, structured data, images, indexability. Answer engines read an llms.txt and a read-only MCP endpoint.',
      },
      outcome: {
        fr: "En ligne (2026) sur club-boxe-blagnac.fr — 23 pages indexables sur son propre nom de domaine. Positions publiées après mesure, jamais avant.",
        en: 'Live (2026) at club-boxe-blagnac.fr — 23 indexable pages on its own domain name. Rankings published after measurement, never before.',
      },
    },
  },
  {
    // The proximity family — seven separately deployed sites, one per town
    // around Toulouse, each on its own bought domain. Same mechanics, never
    // the same text, colour or motion. Page count = sum of the seven live
    // sitemaps (125, counted 2026-10-03).
    slug: 'boxing-center-proximite',
    name: 'Boxing Center — Proximité',
    client: 'Boxing Center Toulouse',
    tagline: {
      fr: 'Sept villes, sept sites, zéro copie',
      en: 'Seven towns, seven sites, zero copies',
    },
    description: {
      fr: "Sept sites, un par commune autour de Toulouse — Colomiers, Muret, Cugnaux, Tournefeuille, Labège, L'Union, Castelginest. Chacun répond à l'habitant qui cherche un club de boxe près de chez lui : le club qui l'accueille, la ligne de bus ou la sortie qui y mène, la séance qui lui convient. Même mécanique, mais un texte, une couleur et un mouvement propres à chaque ville.",
      en: 'Seven sites, one per town around Toulouse — Colomiers, Muret, Cugnaux, Tournefeuille, Labège, L’Union, Castelginest. Each answers the resident looking for a boxing club nearby: the club that welcomes them, the bus line or exit that gets them there, the class that fits. Same mechanics, but a text, a colour and a motion signature of its own for every town.',
    },
    category: 'Sport & Bien-être',
    tags: ['SEO Local', 'GEO', 'Multi-sites', 'Boxe', 'Toulouse'],
    liveUrl: 'https://www.boxingcenter-colomiers.fr/',
    thumb: '/thumbs/bc-sat-colomiers.jpg',
    world: 'boxing-center',
    color: '#1E2044',
    year: 2026,
    isFeatured: false,
    isInternal: false,
    techStack: ['Astro 5', 'TypeScript', 'SVG', 'Inlet', 'MCP', 'llms.txt', 'Schema.org'],
    sites: [
      { name: 'Colomiers', url: 'https://www.boxingcenter-colomiers.fr/', thumb: '/thumbs/bc-sat-colomiers.jpg' },
      { name: 'Muret', url: 'https://www.boxingcenter-muret.fr/', thumb: '/thumbs/bc-sat-muret.jpg' },
      { name: 'Cugnaux', url: 'https://www.boxingcenter-cugnaux.fr/', thumb: '/thumbs/bc-sat-cugnaux.jpg' },
      { name: 'Tournefeuille', url: 'https://www.boxingcenter-tournefeuille.fr/', thumb: '/thumbs/bc-sat-tournefeuille.jpg' },
      { name: 'Labège', url: 'https://www.boxingcenter-labege.fr/', thumb: '/thumbs/bc-sat-labege.jpg' },
      { name: "L'Union", url: 'https://www.boxingcenter-lunion.fr/', thumb: '/thumbs/bc-sat-lunion.jpg' },
      { name: 'Castelginest', url: 'https://www.boxingcenter-castelginest.fr/', thumb: '/thumbs/bc-sat-castelginest.jpg' },
    ],
    caseStudy: {
      problem: {
        fr: "Les habitants de sept communes cherchent « club de boxe » suivi du nom de leur ville. Le réseau les accueille dans le club voisin — encore fallait-il le leur dire, ville par ville, sans cloner sept fois la même page.",
        en: 'Residents of seven towns search “boxing club” followed by their town’s name. The network welcomes them at the neighbouring club — it still had to tell them so, town by town, without cloning the same page seven times.',
      },
      solution: {
        fr: "Une famille de sites statiques : chaque fait vit dans un registre unique et le build refuse une page qui contredit ce registre, oublie un mot-clé ou reste fermée à l'indexation. Chaque ville a sa teinte, sa signature de mouvement, ses pages par commune voisine, ses articles conseils, son formulaire protégé par preuve de travail — et moins de 7 ko de JavaScript par page.",
        en: 'A family of static sites: every fact lives in a single registry and the build rejects a page that contradicts it, misses a keyword or stays closed to indexing. Every town has its own hue, its motion signature, its pages for neighbouring towns, its guides, a form protected by proof-of-work — and under 7 KB of JavaScript per page.',
      },
      outcome: {
        fr: "En ligne (2026) — sept sites sur sept noms de domaine, 125 pages au plan du site. Positions publiées après mesure, jamais avant.",
        en: 'Live (2026) — seven sites on seven domain names, 125 pages in their sitemaps. Rankings published after measurement, never before.',
      },
      // Craft facts — counted on the live sitemaps, not client outcomes.
      metrics: [
        { value: '7', label: { fr: 'sites, un par ville', en: 'sites, one per town' } },
        { value: '125', label: { fr: 'pages en ligne', en: 'pages live' } },
        { value: '< 7 ko', label: { fr: 'de JavaScript par page', en: 'of JavaScript per page' } },
      ],
    },
  },
  {
    // The official e-boutique of the network — LIVE (facts from its README +
    // rendered hero: Stripe checkout, PrestaShop bridge, Deciplus catalogue
    // sync bot; memberships, trial sessions, coaching, gear).
    slug: 'box-plus',
    name: 'Box Plus',
    client: 'Boxing Center Toulouse',
    tagline: {
      fr: 'La boutique officielle, en ligne',
      en: 'The official store, online',
    },
    description: {
      fr: "Refonte de la boutique en ligne officielle du réseau Boxing Center — abonnements, séances d'essai, coachings et matériel dans un seul tunnel : paiement Stripe, passerelle PrestaShop et catalogue synchronisé en continu avec Deciplus.",
      en: "A rebuild of the Boxing Center network's official online store — memberships, trial sessions, coaching and gear in one funnel: Stripe checkout, a PrestaShop bridge and a catalogue continuously synced with Deciplus.",
    },
    category: 'Commerce & Services',
    tags: ['E-commerce', 'Stripe', 'PrestaShop', 'Automatisation', 'Sport', 'Toulouse'],
    liveUrl: 'https://boutique.boxingcenter.fr/',
    world: 'boxing-center',
    color: '#B3001B',
    year: 2026,
    isFeatured: false,
    isInternal: false,
    techStack: ['Next.js', 'TypeScript', 'Stripe', 'PrestaShop', 'Node.js', 'Playwright'],
    caseStudy: {
      problem: {
        fr: "La boutique historique du réseau vivait à l'écart de son système de gestion Deciplus : catalogue maintenu à la main, offres dispersées entre les salles, aucun tunnel unique pour vendre abonnements, séances d'essai et matériel.",
        en: "The network's legacy store lived apart from its Deciplus management system: a hand-maintained catalogue, offers scattered across gyms, no single funnel to sell memberships, trial sessions and gear.",
      },
      solution: {
        fr: "Une boutique repensée sous le blason maison : paiement Stripe, passerelle PrestaShop pour l'existant, et un bot de synchronisation qui republie le catalogue Deciplus en continu — le tout déployé sur Vercel avec webhooks de commande.",
        en: 'A store rebuilt under the house crest: Stripe checkout, a PrestaShop bridge for the legacy stack, and a sync bot that continuously republishes the Deciplus catalogue — deployed on Vercel with order webhooks.',
      },
      outcome: {
        fr: "En ligne — la boutique officielle du réseau tourne sur cette refonte. Aucun indicateur commercial publié sans l'accord du client.",
        en: "Live — the network's official store runs on this rebuild. No commercial metrics published without the client's sign-off.",
      },
      gallery: ['/thumbs/bc-box-plus.jpg'],
    },
  },
  {
    // Facts: its README + the live sitemap (1 222 URLs, 2026-10-03). Sales are
    // not open yet — the site says so, and so do we.
    slug: 'boutique-de-boxe',
    name: 'Boutique de Boxe',
    client: 'SAS Boxing Center',
    tagline: {
      fr: 'Tout pour la boxe et le MMA — 1 222 pages, un seul catalogue',
      en: 'Everything for boxing and MMA — 1,222 pages, one catalogue',
    },
    description: {
      fr: "Le catalogue français de matériel de boxe, MMA et sports de combat : plus de mille modèles, des guides, un outil de choix du poids des gants et une page « où boxer » pour plus de trente villes, bâtie sur le recensement officiel des équipements sportifs. Avant l'ouverture des ventes, chaque fiche inscrit le visiteur à l'alerte d'ouverture.",
      en: 'The French catalogue of boxing, MMA and combat-sports gear: more than a thousand models, guides, a glove-weight picker and a “where to box” page for more than thirty cities, built on the official register of sports facilities. Ahead of the sales opening, every product page signs the visitor up for the opening alert.',
    },
    category: 'Commerce & Services',
    tags: ['E-commerce', 'Catalogue', 'SEO', 'GEO', 'Sport', 'France'],
    liveUrl: 'https://www.boutique-de-boxe.com/',
    world: 'boxing-center',
    color: '#D8F34B',
    year: 2026,
    isFeatured: false,
    isInternal: false,
    techStack: ['Next.js 16', 'TypeScript', 'Supabase', 'PostgreSQL', 'Drizzle', 'MCP'],
    caseStudy: {
      problem: {
        fr: "Lancer une boutique nationale de matériel de combat face à des enseignes installées, avec un domaine neuf et un catalogue fournisseur aux photos hétérogènes.",
        en: 'Launching a national combat-gear store against established retailers, with a brand-new domain and a supplier catalogue of mismatched photos.',
      },
      solution: {
        fr: "Un catalogue de plus de mille références sur une base Postgres, des fiches aux questions-réponses tirées des faits du modèle, des pages par rayon et par ville avec leurs données structurées, un panier persistant et une administration par lien magique. Les moteurs de réponse disposent d'un llms.txt et d'un outil MCP qui répond « où boxer dans ma ville ».",
        en: 'A catalogue of more than a thousand references on Postgres, product pages with Q&As drawn from each model’s facts, pages per aisle and per city with their structured data, a persistent cart and magic-link administration. Answer engines get an llms.txt and an MCP tool that answers “where can I box in my city”.',
      },
      outcome: {
        fr: "En ligne (2026) sur boutique-de-boxe.com — 1 222 pages, titres et descriptions uniques. Les ventes ouvrent prochainement ; aucun indicateur commercial publié avant.",
        en: 'Live (2026) at boutique-de-boxe.com — 1,222 pages, unique titles and descriptions. Sales open soon; no commercial metric is published before then.',
      },
      // Craft facts — counted on the live sitemap, not client outcomes.
      metrics: [
        { value: '1 222', label: { fr: 'pages en ligne', en: 'pages live' } },
        { value: '1 042', label: { fr: 'modèles au catalogue', en: 'models in the catalogue' } },
        { value: 'MCP', label: { fr: 'outil pour les agents IA', en: 'tool for AI agents' } },
      ],
    },
  },
  {
    slug: 'matos-de-boxe',
    name: 'Matos de Boxe',
    client: 'Matos de Boxe',
    tagline: {
      fr: 'Le matos des combattants',
      en: 'The fighters’ gear',
    },
    description: {
      fr: "Boutique spécialisée Metal Boxe — gants de boxe, gants MMA, protections et textile de combat. Une vitrine claire et lumineuse où le produit tient la scène, avec inscription à l'alerte d'ouverture des ventes.",
      en: 'A specialist Metal Boxe store — boxing gloves, MMA gloves, protection and fight wear. A bright, clean storefront where the product holds the stage, with sign-up for the sales-opening alert.',
    },
    category: 'Commerce & Services',
    tags: ['E-commerce', 'Catalogue', 'Metal Boxe', 'Sport', 'France'],
    liveUrl: 'https://www.matos-de-boxe.fr/',
    world: 'boxing-center',
    color: '#B89B6A',
    year: 2026,
    isFeatured: false,
    isInternal: false,
    techStack: ['Astro', 'TypeScript'],
    caseStudy: {
      problem: {
        fr: "Ouvrir une boutique spécialisée Metal Boxe où le produit est le héros, pas le gabarit.",
        en: 'Opening a specialist Metal Boxe store where the product is the hero, not the template.',
      },
      solution: {
        fr: "Une boutique Astro rapide : chaque produit photographié sur sa scène, rayons par discipline — boxe, MMA, protections, entraînement, textile —, guides de choix et recherche. La vente n'est pas encore ouverte : le site le dit, et inscrit le visiteur pour le prévenir.",
        en: 'A fast Astro store: every product shot on its own stage, aisles by discipline — boxing, MMA, protection, training, apparel — buying guides and search. Sales are not open yet: the site says so, and signs visitors up to be told.',
      },
      outcome: {
        fr: "En ligne (2026) sur matos-de-boxe.fr — 58 pages. Ouverture des ventes prochaine ; aucun indicateur commercial publié avant.",
        en: 'Live (2026) at matos-de-boxe.fr — 58 pages. Sales open soon; no commercial metric is published before then.',
      },
    },
  },

  // ── RESTAURATION & F&B ────────────────────────────────────────────────────
  {
    slug: 'beldi-fusion',
    name: 'Beldi Fusion',
    client: 'Beldi Fusion Toulouse',
    tagline: {
      fr: 'Le Maroc au cœur de Toulouse',
      en: 'Morocco in the heart of Toulouse',
    },
    description: {
      fr: "Site restaurant immersif pour une enseigne de cuisine marocaine fusion — branding sombre et chaleureux, identité forte.",
      en: 'An immersive restaurant site for a Moroccan fusion kitchen — warm, dark branding and a strong identity.',
    },
    category: 'Restauration & F&B',
    tags: ['Restaurant', 'SEO Local', 'Branding', 'Toulouse'],
    liveUrl: 'https://beldi-fusion7.vercel.app/',
    color: '#1B1744',
    year: 2025,
    isFeatured: true,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'SEO Local'],
    caseStudy: {
      problem: {
        fr: "Enseigne sans présence digitale cohérente — pas de référencement local, aucun lien Uber Eats/Deliveroo centralisé.",
        en: 'A venue with no coherent digital presence — no local SEO, no centralised Uber Eats/Deliveroo links.',
      },
      solution: {
        fr: 'Site immersif dark-luxury avec identité visuelle forte, SEO local optimisé, intégration plateformes de livraison et Google Maps.',
        en: 'An immersive dark-luxury site with a strong visual identity, optimised local SEO, delivery-platform integration and Google Maps.',
      },
      outcome: {
        fr: 'Classement page 1 Google sur « restaurant marocain Toulouse ». Commandes en livraison +45%.',
        en: 'Page-one Google ranking for “Moroccan restaurant Toulouse”. Delivery orders up +45%.',
      },
    },
  },
  {
    slug: 'the-911',
    name: 'THE 911',
    client: 'THE 911 — Guilty Sandwich',
    tagline: {
      fr: 'Guilty Sandwiches. Assumés.',
      en: 'Guilty sandwiches. Owned.',
    },
    description: {
      fr: "Identité web sombre et percutante pour une enseigne de Guilty Sandwiches halal — dark design, attitude forte.",
      en: 'A dark, punchy web identity for a halal “guilty sandwich” brand — full-dark design, bold attitude.',
    },
    category: 'Restauration & F&B',
    tags: ['Restaurant', 'Dark Design', 'Halal', 'Toulouse'],
    liveUrl: 'https://the-911.vercel.app',
    color: '#0b0b0b',
    year: 2025,
    isFeatured: true, // team 2026-07-15: "911 pèse aussi" — front-page weight
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    caseStudy: {
      problem: {
        fr: "Enseigne avec une forte identité physique mais aucune présence web fidèle à son univers.",
        en: 'A venue with a strong physical identity but no web presence true to its world.',
      },
      solution: {
        fr: 'Site full-dark avec typographie bold, animations percutantes et menu digital relié aux liens de livraison.',
        en: 'A full-dark site with bold type, punchy animations and a digital menu wired to delivery links.',
      },
      outcome: {
        fr: 'Score Lighthouse SEO 98. Chargement < 1,8 s. Une identité en ligne reconnue par les habitués.',
        en: 'Lighthouse SEO score 98. Load time < 1.8s. An online identity its regulars recognise.',
      },
    },
  },
  {
    slug: 'mon-boum',
    name: 'Mon Boum',
    client: 'Mon Boum Toulouse',
    tagline: {
      fr: 'Fast-food halal. 10 adresses. Depuis 2004.',
      en: 'Halal fast-food. 10 addresses. Since 2004.',
    },
    description: {
      fr: "Vitrine digitale pour une chaîne de fast-food halal historique — 10 restaurants, 20 ans de présence sur la métropole toulousaine.",
      en: 'A digital showcase for a long-standing halal fast-food chain — 10 restaurants, 20 years across greater Toulouse.',
    },
    category: 'Restauration & F&B',
    tags: ['Restaurant', 'Multi-établissements', 'Halal', 'Toulouse', 'Chaîne'],
    liveUrl: 'https://monboumv3.vercel.app/',
    color: '#111111',
    year: 2025,
    isFeatured: true,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Astro 5', 'TypeScript', 'Tailwind CSS', 'SEO multi-sites'],
    caseStudy: {
      problem: {
        fr: "Site vieillissant ne reflétant pas l'ampleur de la chaîne — 10 restaurants sans pages dédiées, SEO inexistant.",
        en: "An ageing site that failed to reflect the chain's scale — 10 restaurants with no dedicated pages, no SEO.",
      },
      solution: {
        fr: 'Architecture Astro optimisée pour le SEO : une page par restaurant, géolocalisation, menu visuel et liens de livraison intégrés.',
        en: 'An SEO-optimised Astro architecture: a page per restaurant, geolocation, a visual menu and built-in delivery links.',
      },
      outcome: {
        fr: 'Présence Google Maps renforcée pour 10 établissements. Lighthouse 97. Trafic organique +220%.',
        en: 'Stronger Google Maps presence for 10 locations. Lighthouse 97. Organic traffic up +220%.',
      },
    },
  },
  {
    slug: 'chicken-bens',
    name: "Chicken Ben's",
    client: "Chicken Ben's",
    tagline: {
      fr: "Le poulet frit qui s'assume.",
      en: 'Fried chicken that owns it.',
    },
    description: {
      fr: "Site vitrine au branding rouge signature pour le spécialiste du poulet frit frais et halal à Colomiers.",
      en: 'A showcase site with signature red branding for the fresh, halal fried-chicken specialist in Colomiers.',
    },
    category: 'Restauration & F&B',
    tags: ['Restaurant', 'Branding', 'Colomiers', 'Halal'],
    liveUrl: 'https://chikenbens.vercel.app',
    color: '#E63328',
    year: 2025,
    isFeatured: false,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Astro 5', 'TypeScript', 'Tailwind CSS', 'SEO Local'],
    caseStudy: {
      problem: {
        fr: "Enseigne avec un logo fort mais sans site — des clients perdus face à la concurrence sur Google.",
        en: 'A venue with a strong logo but no site — losing customers to competitors on Google.',
      },
      solution: {
        fr: 'Site mobile-first avec identité rouge-blanc percutante, menu visuel, géolocalisation et intégration Uber Eats.',
        en: 'A mobile-first site with a punchy red-and-white identity, a visual menu, geolocation and Uber Eats integration.',
      },
      outcome: {
        fr: 'Première page Google sur « poulet frit Colomiers ». LCP < 2 s sur mobile.',
        en: 'First page on Google for “fried chicken Colomiers”. LCP < 2s on mobile.',
      },
    },
  },
  {
    slug: 'marche-de-mo',
    name: "Marché de Mo'",
    client: "Marché de Mo'",
    tagline: {
      fr: "Le plus grand supermarché ethnique d'Occitanie.",
      en: "Occitanie's largest ethnic supermarket.",
    },
    description: {
      fr: "Vitrine digitale pour une enseigne emblématique — boucherie halal sur carcasse, épices du monde, fruits exotiques. Ouvert 7j/7.",
      en: 'A digital showcase for an iconic store — halal carcass butchery, spices from around the world, exotic fruit. Open 7 days a week.',
    },
    category: 'Restauration & F&B',
    tags: ['Commerce', 'Ethnique', 'Halal', 'Toulouse', 'Occitanie'],
    // marchedemov2.vercel.app stopped responding (verified dead 2026-07-29,
    // TLS ok then timeout) — restore the URL once the deployment is revived.
    liveUrl: '#',
    color: '#1C6B35',
    year: 2025,
    isFeatured: false,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Astro 4', 'TypeScript', 'Tailwind CSS'],
    caseStudy: {
      problem: {
        fr: "Enseigne connue localement mais quasi invisible en ligne — aucun site, avis Google insuffisants.",
        en: 'Locally known but almost invisible online — no site, too few Google reviews.',
      },
      solution: {
        fr: "Vitrine Astro rapide avec présentation des rayons, horaires, carte et appel à l'action Google Reviews.",
        en: 'A fast Astro showcase presenting the aisles, opening hours, a map and a Google Reviews call to action.',
      },
      outcome: {
        fr: 'Classement page 1 sur « marché ethnique Toulouse ». Avis Google ×3 en 2 mois.',
        en: 'Page-one ranking for “ethnic market Toulouse”. Google reviews ×3 in two months.',
      },
    },
  },
  {
    slug: 'nyc-cookies',
    name: 'NYC Cookies Casablanca',
    client: 'NYC Cookies Casablanca',
    tagline: {
      fr: 'The taste of happiness. Version Casa.',
      en: 'The taste of happiness. Casablanca edition.',
    },
    description: {
      fr: "Expérience digitale pour une boutique artisanale de cookies new-yorkais à Casablanca — dark & luxe, international.",
      en: 'A digital experience for an artisan New-York-style cookie shop in Casablanca — dark, luxe, international.',
    },
    category: 'Restauration & F&B',
    tags: ['F&B', 'International', 'Casablanca', 'Maroc', 'Artisanal'],
    liveUrl: 'https://nyc-cookies-casablanca.vercel.app',
    color: '#0a0a0a',
    year: 2024,
    isFeatured: false,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    caseStudy: {
      problem: {
        fr: "Nouvelle boutique sans présence web sur un marché compétitif à Casablanca.",
        en: 'A new shop with no web presence in a competitive Casablanca market.',
      },
      solution: {
        fr: 'Site dark-luxury photography-first, commande WhatsApp intégrée et stratégie Instagram reliée.',
        en: 'A dark-luxury, photography-first site with built-in WhatsApp ordering and a linked Instagram strategy.',
      },
      outcome: {
        fr: 'Lancement réussi — 500+ visites organiques le premier mois. Commandes via le site dès J+7.',
        en: 'A successful launch — 500+ organic visits in month one. Orders through the site from day 7.',
      },
    },
  },

  // ── SERVICES AUTOMOBILES ──────────────────────────────────────────────────
  {
    slug: 'car-repair',
    name: 'Car Repair',
    client: 'Car Repair Toulouse',
    tagline: {
      fr: 'Votre garage multimarque à Toulouse.',
      en: 'Your multi-brand garage in Toulouse.',
    },
    description: {
      fr: "Site vitrine SEO-first pour un garage automobile multimarque à Toulouse — mécanique, carrosserie, peinture, pneumatique.",
      en: 'An SEO-first showcase site for a multi-brand garage in Toulouse — mechanics, bodywork, paint and tyres.',
    },
    category: 'Services Automobiles',
    tags: ['Garage', 'SEO Local', 'Toulouse', 'Services'],
    liveUrl: '#', // ⚠️ car-repair-france.fr is NOT the EAM build (Eddy 2026-07-14) — set the real URL when provided
    color: '#0b0b0b',
    year: 2025,
    isFeatured: false,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Schema.org'],
    caseStudy: {
      problem: {
        fr: "Garage sans site — invisible sur Google face aux grandes chaînes (Norauto, Midas).",
        en: 'A garage with no site — invisible on Google against the big chains (Norauto, Midas).',
      },
      solution: {
        fr: 'Site SEO-first avec données structurées LocalBusiness, pages services dédiées et formulaire de devis.',
        en: 'An SEO-first site with LocalBusiness structured data, dedicated service pages and a quote form.',
      },
      outcome: {
        fr: 'Page 1 Google sur 8 requêtes clés. Lighthouse 96. Appels entrants estimés +60%.',
        en: 'Page one on Google for 8 key queries. Lighthouse 96. Inbound calls up an estimated +60%.',
      },
    },
  },
  {
    slug: 'pieces-auto-colomiers',
    name: 'Pièces Auto Colomiers',
    client: 'Pièces Auto Colomiers',
    tagline: {
      fr: 'Toutes marques. Devis en 24h.',
      en: 'All brands. Quotes within 24h.',
    },
    description: {
      fr: "Site vitrine pour un vendeur de pièces auto neuves multimarques — retrait magasin, expédition Mondial Relay.",
      en: 'A showcase site for a multi-brand new auto-parts seller — in-store pickup, Mondial Relay shipping.',
    },
    category: 'Services Automobiles',
    tags: ['Commerce', 'Automobile', 'Colomiers', 'Pièces'],
    liveUrl: 'https://piece-auto-colomiers.vercel.app',
    color: '#0F2C5A',
    year: 2025,
    isFeatured: false,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Astro 5', 'TypeScript', 'Tailwind CSS'],
    caseStudy: {
      problem: {
        fr: "Vendeur connu localement, sans vitrine digitale pour capter les recherches Google.",
        en: 'A locally known seller with no digital storefront to capture Google searches.',
      },
      solution: {
        fr: 'Site Astro ultra-rapide avec catalogue par marque, formulaire de devis et intégration Mondial Relay.',
        en: 'An ultra-fast Astro site with a brand catalogue, a quote form and Mondial Relay integration.',
      },
      outcome: {
        fr: 'Core Web Vitals au vert sur tous les indicateurs. TTFB < 80 ms.',
        en: 'Core Web Vitals green across the board. TTFB < 80ms.',
      },
    },
  },
  {
    slug: 'drive-pneu',
    name: 'Drive Pneu',
    client: 'Drive Pneu',
    tagline: {
      fr: 'Spécialiste pneumatiques à Plaisance-du-Touch.',
      en: 'Tyre specialist in Plaisance-du-Touch.',
    },
    description: {
      fr: "Site vitrine pour un garage spécialisé en pneumatiques — prise de rendez-vous et devis en ligne.",
      en: 'A showcase site for a tyre-focused garage — online booking and quotes.',
    },
    category: 'Services Automobiles',
    tags: ['Garage', 'Pneumatiques', 'Plaisance-du-Touch'],
    liveUrl: 'https://drive-beta-hazel.vercel.app/',
    color: '#1A1A2E',
    year: 2025,
    isFeatured: false,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    caseStudy: {
      problem: {
        fr: "Garage sans présence en ligne — perdu face aux concurrents référencés.",
        en: 'A garage with no online presence — lost against ranked competitors.',
      },
      solution: {
        fr: 'Site vitrine avec formulaire de devis pneumatiques et données structurées Google.',
        en: 'A showcase site with a tyre quote form and Google structured data.',
      },
      outcome: {
        fr: 'Référencement local activé. Premiers contacts organiques en moins de 30 jours.',
        en: 'Local SEO switched on. First organic enquiries in under 30 days.',
      },
    },
  },

  // ── COMMERCE & SERVICES ────────────────────────────────────────────────────
  {
    slug: 'la-brigade-mobile',
    name: 'La Brigade Mobile',
    client: 'La Brigade Mobile',
    tagline: {
      fr: 'Réparation express. Reconditionné certifié.',
      en: 'Express repair. Certified refurbished.',
    },
    description: {
      fr: "Refonte complète d'une plateforme de réparation smartphones et de vente de reconditionné à Toulouse — v1 → v2, architecture repensée.",
      en: 'A full rebuild of a smartphone-repair and refurbished-device platform in Toulouse — v1 → v2, re-architected.',
    },
    category: 'Commerce & Services',
    tags: ['Tech', 'Réparation', 'Refonte', 'E-commerce', 'Toulouse'],
    liveUrl: 'https://brigade-mobile-4-if25.vercel.app/',
    color: '#1A3A5C',
    year: 2025,
    isFeatured: true,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    caseStudy: {
      problem: {
        fr: "Site v1 statique, sans catalogue dynamique ni système de devis — pertes de clients sur mobile.",
        en: 'A static v1 with no dynamic catalogue or quote system — losing customers on mobile.',
      },
      solution: {
        fr: 'Refonte complète : catalogue filtrable par appareil/marque, devis en ligne, espace admin et SEO local renforcé.',
        en: 'A full rebuild: catalogue filterable by device/brand, online quotes, an admin space and stronger local SEO.',
      },
      outcome: {
        fr: '+180% de trafic organique en 3 mois. LCP < 2 s. +120 demandes de devis par mois.',
        en: '+180% organic traffic in 3 months. LCP < 2s. +120 quote requests per month.',
      },
    },
  },
  {
    slug: 'c-chez-toit',
    name: 'C Chez Toît',
    client: 'C Chez Toît',
    tagline: {
      fr: 'Votre toit, propre et protégé.',
      en: 'Your roof, clean and protected.',
    },
    description: {
      fr: "Site vitrine pour des experts en nettoyage de toiture, démoussage et réparation de façade en Haute-Garonne — devis gratuit sous 24h.",
      en: 'A showcase site for roof-cleaning, de-mossing and façade-repair experts in Haute-Garonne — free quote within 24h.',
    },
    category: 'Commerce & Services',
    tags: ['Services', 'BTP', 'Toulouse', 'Devis', 'Toiture'],
    liveUrl: 'https://c-chez-toi-2.vercel.app/',
    color: '#EA559D',
    year: 2025,
    isFeatured: false,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'CMS'],
    caseStudy: {
      problem: {
        fr: "Artisan sans site, acquisition 100% bouche-à-oreille — croissance bloquée.",
        en: 'A tradesman with no site, growth capped by word-of-mouth alone.',
      },
      solution: {
        fr: 'Site vitrine avec pages services dédiées, galerie avant/après et formulaire de devis sous 24h.',
        en: 'A showcase site with dedicated service pages, a before/after gallery and a 24h quote form.',
      },
      outcome: {
        fr: 'Premier lead organique en moins de 2 semaines. Couverture Google sur 15 communes.',
        en: 'First organic lead in under two weeks. Google coverage across 15 towns.',
      },
    },
  },
  {
    slug: 'decoshop-vitrine',
    name: 'DecoShop',
    client: 'DecoShop Toulouse',
    tagline: {
      fr: 'Mobilier design & home staging immobilier.',
      en: 'Design furniture & property home staging.',
    },
    description: {
      fr: "Vitrine digitale pour un spécialiste du mobilier design, lits coffres, canapés et home staging immobilier à Toulouse.",
      en: 'A digital showcase for a specialist in design furniture, storage beds, sofas and property home staging in Toulouse.',
    },
    category: 'Commerce & Services',
    tags: ['Mobilier', 'Immobilier', 'Home Staging', 'Toulouse'],
    liveUrl: 'https://deco-vitrine.vercel.app/',
    color: '#2C3E50',
    year: 2024,
    isFeatured: false,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'SEO'],
    caseStudy: {
      problem: {
        fr: "Showroom physique excellent mais aucune présence web — les clients ne trouvent pas le magasin en ligne.",
        en: "An excellent physical showroom but no web presence — customers can't find the store online.",
      },
      solution: {
        fr: 'Site vitrine avec galerie produits, pages home staging LMNP et SEO local ciblé investisseurs.',
        en: 'A showcase site with a product gallery, LMNP home-staging pages and local SEO aimed at investors.',
      },
      outcome: {
        fr: 'Apparition sur « home staging Toulouse ». Trafic qualifié d\'investisseurs LMNP.',
        en: 'Surfacing for “home staging Toulouse”. Qualified traffic from LMNP investors.',
      },
    },
  },

  // ── CORPORATE & FORMATION ──────────────────────────────────────────────────
  {
    slug: 'f2m-consulting',
    name: 'F2M Consulting',
    client: 'F2M Consulting',
    tagline: {
      fr: 'Formation DGESP & sécurité privée. Organisme Qualiopi.',
      en: 'Private-security training (DGESP). Qualiopi-certified.',
    },
    description: {
      fr: "Site institutionnel pour un organisme certifié Qualiopi — formation DGESP RNCP 36654, VAE, financement CPF à Toulouse.",
      en: 'An institutional site for a Qualiopi-certified body — DGESP training (RNCP 36654), VAE and CPF funding in Toulouse.',
    },
    category: 'Corporate & Formation',
    tags: ['Corporate', 'Formation', 'Qualiopi', 'RNCP', 'Toulouse'],
    liveUrl: '#', // ⚠️ f2mconsulting.fr is NOT the EAM build (Eddy 2026-07-14) — set the real URL when provided
    color: '#1a237e',
    year: 2025,
    isFeatured: false,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Schema.org', 'SEO'],
    caseStudy: {
      problem: {
        fr: "Organisme certifié Qualiopi sans présence web professionnelle — crédibilité insuffisante face aux candidats CPF.",
        en: 'A Qualiopi-certified body with no professional web presence — insufficient credibility with CPF candidates.',
      },
      solution: {
        fr: "Site institutionnel avec données structurées EducationalOrganization, pages formation dédiées, accès e-learning Dokeos et SEO ciblé DGESP.",
        en: 'An institutional site with EducationalOrganization structured data, dedicated course pages, Dokeos e-learning access and DGESP-targeted SEO.',
      },
      outcome: {
        fr: 'Page 1 Google sur « formation DGESP Toulouse ». Lighthouse SEO 100. Inscriptions +35%.',
        en: 'Page one on Google for “DGESP training Toulouse”. Lighthouse SEO 100. Enrolments up +35%.',
      },
    },
  },
  {
    slug: 'jcboyang-conseil',
    name: 'JCBoyang Conseil',
    client: 'JCBoyang Conseil',
    tagline: {
      fr: 'La méthode Vendeur Attitude™, portée en ligne.',
      en: 'The Vendeur Attitude™ method, carried online.',
    },
    description: {
      fr: "Site complet pour le cabinet de Jean-Christophe Boyang-Tsang — méthode Vendeur Attitude™ à trois niveaux de certification, séminaires Mindset, témoignages et prise de rendez-vous en ligne.",
      en: "A full site for Jean-Christophe Boyang-Tsang's firm — the three-level Vendeur Attitude™ method, Mindset seminars, testimonials and online booking.",
    },
    category: 'Corporate & Formation',
    tags: ['Corporate', 'Conseil', 'Stratégie'],
    liveUrl: 'https://www.jcbo-conseil.com/',
    color: '#1C2B3A',
    year: 2024,
    isFeatured: true, // team 2026-07-15: JCBO = "notre site qui pèse le plus" — leads the rail

    isInternal: false,
    techStack: ['Node.js', 'Express', 'HTML/CSS'],
    caseStudy: {
      problem: {
        fr: "Cabinet sans présence web — acquisition uniquement via réseau.",
        en: 'A firm with no web presence — client acquisition via network only.',
      },
      solution: {
        fr: "Le cabinet mis au niveau de sa méthode : les trois niveaux de certification Vendeur Attitude™ exposés clairement, séminaires Mindset, témoignages et prise de rendez-vous en ligne.",
        en: 'The firm brought up to the level of its method: the three Vendeur Attitude™ certification levels laid out clearly, Mindset seminars, testimonials and online booking.',
      },
      outcome: {
        fr: "« Les demandes arrivent par le site » — les mots signés de son fondateur, M. Boyang.",
        en: '“Enquiries now come through the site” — the signed words of its founder, M. Boyang.',
      },
    },
  },

  // ── CULTURE & ASSOCIATIF ───────────────────────────────────────────────────
  {
    slug: 'un-rire-pour-un-enfant',
    name: 'Un Rire Pour un Enfant',
    client: 'Association Un Rire Pour un Enfant',
    tagline: {
      fr: 'Un sourire qui change une vie.',
      en: 'A smile that changes a life.',
    },
    description: {
      fr: "Application web PWA pour une association solidaire dédiée aux enfants et étudiants — adhésions, dons, actualités.",
      en: 'A PWA web app for a charity supporting children and students — memberships, donations, news.',
    },
    category: 'Culture & Associatif',
    tags: ['Association', 'Social', 'PWA', 'Éducation', 'Toulouse'],
    liveUrl: 'https://un-rire-un-enfant.vercel.app/',
    color: '#8CB369',
    year: 2025,
    isFeatured: false,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['React', 'Lovable', 'Tailwind CSS', 'PWA'],
    caseStudy: {
      problem: {
        fr: "Association active sans outil digital — gestion manuelle des adhésions et communications dispersées.",
        en: 'An active charity with no digital tool — manual membership handling and scattered communications.',
      },
      solution: {
        fr: 'Application web PWA installable avec espace adhérents, actualités et module de contact.',
        en: 'An installable PWA web app with a members area, news and a contact module.',
      },
      outcome: {
        fr: 'Outil adopté dès le lancement. Gestion digitalisée de 80+ adhérents.',
        en: 'Adopted from launch. Digitised management of 80+ members.',
      },
    },
  },
  {
    slug: 'temps-dance',
    name: 'Temps Dance',
    client: 'Temps Dance',
    tagline: {
      fr: 'École de danse à Tournefeuille — Modern Jazz, Hip-Hop, Classique.',
      en: 'Dance school in Tournefeuille — Modern Jazz, Hip-Hop, Ballet.',
    },
    description: {
      fr: "Site vitrine pour une école de danse multi-disciplines à Tournefeuille — cours, planning, tarifs, livre d'or.",
      en: 'A showcase site for a multi-discipline dance school in Tournefeuille — classes, schedule, pricing, guestbook.',
    },
    category: 'Culture & Associatif',
    tags: ['Danse', 'Culture', 'École', 'Tournefeuille'],
    liveUrl: 'https://dance-puce.vercel.app/',
    color: '#8B1A4A',
    year: 2024,
    isFeatured: true,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    caseStudy: {
      problem: {
        fr: "École de danse reconnue localement mais sans site moderne pour attirer de nouvelles inscriptions.",
        en: 'A locally respected dance school with no modern site to attract new sign-ups.',
      },
      solution: {
        fr: "Site vitrine avec planning hebdomadaire interactif, galerie photos, tarifs et formulaire d'inscription.",
        en: 'A showcase site with an interactive weekly schedule, photo gallery, pricing and a sign-up form.',
      },
      outcome: {
        fr: "Doublement des demandes d'inscription en ligne à la rentrée suivante.",
        en: 'Online sign-up requests doubled the following season.',
      },
    },
  },

  // ── TECH & SAAS ────────────────────────────────────────────────────────────
  {
    slug: 'kermhosting',
    name: 'KermHosting',
    client: 'KermHosting',
    tagline: {
      fr: "Hébergement Node.js en FCFA. Pensé pour l'Afrique.",
      en: 'Node.js hosting in FCFA. Built for Africa.',
    },
    description: {
      fr: "Plateforme SaaS d'hébergement Node.js haute performance pour l'Afrique — paiement en FCFA par mobile money, PayPal et Minipay. 1 000+ utilisateurs.",
      en: 'A high-performance Node.js SaaS hosting platform for Africa — FCFA mobile-money, PayPal and Minipay payments. 1,000+ users served.',
    },
    category: 'Tech & SaaS',
    tags: ['SaaS', 'Hébergement', 'Afrique', 'International', 'Fintech'],
    liveUrl: 'https://kermhosting.site/',
    color: '#7C3AED',
    year: 2025,
    isFeatured: true,
    isInternal: false,
    techStack: ['React', 'Node.js', 'Pterodactyl', 'Tailwind CSS', 'Mobile Money'],
    caseStudy: {
      problem: {
        fr: "Aucune solution d'hébergement accessible en Afrique francophone — barrières de paiement, latence, tarifs prohibitifs.",
        en: 'No accessible hosting solution in francophone Africa — payment barriers, latency, prohibitive pricing.',
      },
      solution: {
        fr: 'Plateforme SaaS complète avec Pterodactyl, intégration Mobile Money FCFA, PayPal et Minipay, interface mobile-first.',
        en: 'A complete SaaS platform with Pterodactyl, Mobile Money (FCFA), PayPal and Minipay, mobile-first.',
      },
      outcome: {
        fr: "1 000+ utilisateurs. 500+ serveurs actifs. 99,9% uptime. Cameroun, Côte d'Ivoire, Sénégal.",
        en: "1,000+ users. 500+ active servers. 99.9% uptime. Cameroon, Côte d'Ivoire, Senegal.",
      },
      // Self-reported platform figures (EAM's own SaaS) — flip outcomeVerified once confirmed.
      metrics: [
        { value: '1 000+', label: { fr: 'utilisateurs', en: 'users' } },
        { value: '500+', label: { fr: 'serveurs actifs', en: 'active servers' } },
        { value: '99,9%', label: { fr: 'de disponibilité', en: 'uptime' } },
      ],
    },
  },

  // ── AGENCE CRÉATIVE ────────────────────────────────────────────────────────
  {
    slug: 'id-skillz',
    name: 'ID SKILLZ',
    client: 'ID SKILLZ',
    tagline: {
      fr: 'Agence créative — Web, Design, Vidéo, 3D.',
      en: 'Creative agency — Web, Design, Video, 3D.',
    },
    description: {
      fr: "Site vitrine pour une agence créative — sites sur-mesure, identité visuelle, vidéo de marque et modélisation 3D.",
      en: 'A showcase site for a creative agency — bespoke sites, visual identity, brand video and 3D modelling.',
    },
    category: 'Agence Créative',
    tags: ['Agence', 'Créatif', 'Paris', 'Toulouse', '3D', 'Vidéo'],
    liveUrl: 'https://id-skillz.vercel.app',
    color: '#B8A98C',
    year: 2025,
    isFeatured: false,
    isInternal: false,
    underMicrodidact: true,
    techStack: ['Astro 6', 'TypeScript', 'Tailwind CSS'],
    caseStudy: {
      problem: {
        fr: "Agence créative sans portfolio digital à la hauteur de ses réalisations.",
        en: 'A creative agency with no digital portfolio worthy of its work.',
      },
      solution: {
        fr: "Site vitrine Astro avec animations fluides, galerie de projets et présentation de l'offre créative 360°.",
        en: 'An Astro showcase with fluid animations, a project gallery and a 360° creative-offer presentation.',
      },
      outcome: {
        fr: 'Site livré avec un score Lighthouse 98. Un outil de prospection pour l\'équipe commerciale.',
        en: 'Delivered with a Lighthouse score of 98. A prospecting tool for the sales team.',
      },
    },
  },

  // ── OUTILS INTERNES (NDA — affichage confidentiel) ─────────────────────────
  {
    slug: 'decoshop-ecosystem',
    name: 'DecoShop — Écosystème Digital',
    client: 'DecoShop (NDA)',
    tagline: {
      fr: '3 outils internes. 1 transformation digitale.',
      en: '3 internal tools. 1 digital transformation.',
    },
    description: {
      fr: "Transformation digitale complète : application livreur PWA, dashboard admin centralisé et gestion d'inventaire temps réel — 3 outils interconnectés.",
      en: 'A complete digital transformation: a PWA driver app, a centralised admin dashboard and real-time inventory — 3 interconnected tools.',
    },
    category: 'Outil Interne',
    tags: ['Dashboard', 'Logistique', 'PWA', 'Admin', 'Fullstack', 'NDA'],
    liveUrl: '#',
    color: '#2C3E50',
    year: 2024,
    isFeatured: false,
    isInternal: true,
    techStack: ['Next.js 15', 'Supabase', 'PostgreSQL', 'TypeScript', 'PWA'],
    caseStudy: {
      problem: {
        fr: "DecoShop gérait livraisons, stock et commandes via Excel et messagerie — erreurs fréquentes, aucune visibilité temps réel.",
        en: 'DecoShop ran deliveries, stock and orders through Excel and chat — frequent errors, no real-time visibility.',
      },
      solution: {
        fr: 'Trois applications interconnectées : (1) app chauffeur-livreur PWA avec GPS et statuts temps réel, (2) dashboard admin centralisé, (3) module inventaire avec alertes de stock automatiques.',
        en: 'Three interconnected apps: (1) a PWA driver app with GPS and live statuses, (2) a centralised admin dashboard, (3) an inventory module with automatic stock alerts.',
      },
      outcome: {
        fr: "Erreurs de livraison -70%. Temps de traitement d'une commande divisé par 3. Adoption complète en moins de 2 semaines.",
        en: 'Delivery errors -70%. Order-handling time cut threefold. Full adoption in under two weeks.',
      },
    },
  },
  {
    slug: 'inlet',
    name: 'Inlet',
    client: 'Agence EAM — produit maison',
    tagline: {
      fr: 'Un seul backend de formulaires pour tous vos sites.',
      en: 'One form backend for all your websites.',
    },
    description: {
      fr: "Microservice SaaS de formulaires centralisé — l'alternative auto-hébergée à Jotform, Formspree et EmailJS. Toutes les soumissions de tous les sites dans un tableau de bord unique, avec e-mails en marque blanche et anti-spam nouvelle génération.",
      en: 'A centralised form-backend SaaS — the self-hosted alternative to Jotform, Formspree and EmailJS. Every submission from every site in one dashboard, with white-label emails and next-gen spam blocking.',
    },
    category: 'Tech & SaaS',
    tags: ['SaaS', 'Formulaires', 'Anti-spam', 'Multi-tenant', 'Produit'],
    liveUrl: 'https://inlett.vercel.app/',
    color: '#2563EB',
    year: 2026,
    isFeatured: false,
    isInternal: false,
    techStack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Resend / Brevo'],
    caseStudy: {
      problem: {
        fr: "Chaque site client réclamait sa propre plomberie de formulaires : SMTP à configurer, spam à filtrer, accusés de réception à styliser — multiplié par vingt sites.",
        en: 'Every client site demanded its own form plumbing: SMTP to configure, spam to filter, receipts to style — multiplied across twenty sites.',
      },
      solution: {
        fr: "Un microservice unique (V3) : panneau d'administration centralisé, e-mails dynamiques en marque blanche (logos, couleurs, polices du client), accusés stylisés FR/EN, anti-spam NLP + preuve de travail + pot de miel, logs d'échecs en direct, export CSV des leads et CORS dynamique.",
        en: 'One microservice (V3): a centralised admin panel, dynamic white-label emails (client logos, colors, fonts), styled FR/EN receipts, NLP + proof-of-work + honeypot spam defense, live failure logs, CSV lead export and dynamic CORS.',
      },
      outcome: {
        fr: "En production sur les sites du studio — le formulaire de contact d'EAM lui-même peut s'y brancher. Zéro configuration SMTP par site.",
        en: "In production across the studio's sites — EAM's own contact form can plug into it. Zero per-site SMTP setup.",
      },
      metrics: [
        { value: 'V3', label: { fr: 'moteur — logs en direct', en: 'engine — live logs' } },
        { value: 'PoW', label: { fr: 'défis cryptographiques anti-bots', en: 'cryptographic bot challenges' } },
        { value: 'CSV', label: { fr: 'export des leads en un clic', en: 'one-click lead export' } },
      ],
    },
  },
  {
    slug: 'hellophone-studio',
    name: 'HelloPhone Studio',
    client: 'HelloPhone (NDA)',
    tagline: {
      fr: "Générateur d'affiches. Une promo en 2 minutes.",
      en: 'Poster generator. A promo in 2 minutes.',
    },
    description: {
      fr: "Outil interne de génération d'affiches publicitaires paramétrables — produits, promotions et services, prêt à l'impression et aux réseaux.",
      en: 'An internal tool to generate parametric ad posters — products, promos and services, print- and social-ready.',
    },
    category: 'Outil Interne',
    tags: ['Outil Interne', 'Design Génératif', 'Print', 'Canvas API', 'NDA'],
    liveUrl: '#',
    color: '#FF5F00',
    year: 2025,
    isFeatured: false,
    isInternal: true,
    techStack: ['React', 'Canvas API', 'TypeScript', 'Tailwind CSS'],
    caseStudy: {
      problem: {
        fr: "Production d'affiches manuelle — 1 à 2 heures par affiche via Canva ou Photoshop.",
        en: 'Manual poster production — 1 to 2 hours per poster in Canva or Photoshop.',
      },
      solution: {
        fr: 'Outil web paramétrique : logo, texte, prix, couleurs, format → export PNG/PDF haute résolution en moins de 2 minutes.',
        en: 'A parametric web tool: logo, text, price, colours, format → high-res PNG/PDF export in under 2 minutes.',
      },
      outcome: {
        fr: 'Gain de 6 h/semaine sur la production marketing. 100% adopté dès le premier jour.',
        en: 'Saves 6 hours/week on marketing production. 100% adopted from day one.',
      },
    },
  },
  {
    slug: 'boutididact-kiosk',
    name: 'Boutididact — Borne de Commande',
    client: 'Boutididact (NDA)',
    tagline: {
      fr: 'Commandez seul. Payez vite. Zéro file.',
      en: 'Order yourself. Pay fast. Zero queue.',
    },
    description: {
      fr: "Application de borne de commande tactile plein écran pour point de vente — UX pensée pour l'autonomie sur tablette.",
      en: 'A full-screen touch self-order kiosk app for point of sale — UX designed for tablet autonomy.',
    },
    category: 'Outil Interne',
    tags: ['Kiosk', 'Tactile', 'UX', 'PWA', 'NDA'],
    liveUrl: '#',
    color: '#4f46e5',
    year: 2025,
    isFeatured: false,
    isInternal: true,
    techStack: ['React', 'PWA', 'TypeScript', 'Supabase'],
    caseStudy: {
      problem: {
        fr: "Caisse unique engorgée aux heures de pointe — temps d'attente élevé, clients perdus.",
        en: 'A single till jammed at peak hours — long waits, lost customers.',
      },
      solution: {
        fr: "Borne tactile PWA en mode kiosk : catalogue visuel, panier, paiement — zéro formation, zéro dépendance réseau critique.",
        en: 'A PWA touch kiosk: visual catalogue, cart, payment — zero training, no critical network dependency.',
      },
      outcome: {
        fr: "Temps d'attente -40%. Déployée sur 2 bornes physiques. Zéro incident après 3 mois.",
        en: 'Wait times -40%. Deployed on 2 physical kiosks. Zero incidents after three months.',
      },
    },
  },
]

// Wire real site screenshots (public/thumbs/<slug>.jpg) onto the projects that
// captured cleanly. Add a slug here after capturing its screenshot; broken/dead
// deployments (Vercel 404, onrender spin-up) and unreachable domains are omitted
// on purpose so those cards keep the branded gradient fallback.
// NOTE: the umbrella 'boxing-center' entry carries NO thumb on purpose — every
// capture we own belongs to ONE specific salle's site, and EAM did not build
// boxingcenter.fr itself. Mislabeling a salle shot as "the network" is a lie.
const THUMBED = new Set([
  // Boxing Center ecosystem — recaptured from the LIVE domains 2026-10-03
  // (image-complete gated, every frame eyeballed). 'boxing-center-proximite'
  // sets its own thumb (the Colomiers site) in its entry.
  'boxing-center-portet',
  'boxing-center-etats-unis',
  'boxing-center-minimes',
  'boxing-center-st-cyprien',
  'boxing-center-ramonville',
  'tmbc',
  'club-boxe-blagnac',
  'boutique-de-boxe',
  'matos-de-boxe',
  'box-plus', // the live boutique hero (image-complete gated capture)
  'kermhosting',
  'la-brigade-mobile',
  'mon-boum',
  'beldi-fusion',
  'chicken-bens',
  'the-911',
  'nyc-cookies',
  'pieces-auto-colomiers',
  'id-skillz',
  'marche-de-mo',
  'decoshop-vitrine',
  'drive-pneu',
  'c-chez-toit',
  'temps-dance',
  'inlet',
  'jcboyang-conseil',
])
for (const p of projects) if (THUMBED.has(p.slug)) p.thumb = `/thumbs/${p.slug}.jpg`

// ── Helpers ─────────────────────────────────────────────────────────────────
// Curated featured order — lead with the most technically baffling work (SaaS
// scale, WebGL, rebuilds) rather than declaration order, which over-indexed F&B.
// Boxing Center is represented by Portet (the flagship, with its own real
// capture) — the umbrella entry has no thumb and stays a world door on /work.
// Team ruling 2026-07-15: JCBO leads ("notre site qui pèse le plus"), The 911
// close behind — both live client properties that will backlink « fait par EAM ».
const FEATURED_RANK: Record<string, number> = {
  'jcboyang-conseil': 0,
  kermhosting: 1,
  'the-911': 2,
  'boxing-center-portet': 3,
  'boxing-center-etats-unis': 4,
  'la-brigade-mobile': 5,
  'temps-dance': 6,
  'mon-boum': 7,
  'beldi-fusion': 8,
}
export const featuredProjects = projects
  .filter((p) => p.isFeatured && !p.isInternal)
  .sort((a, b) => (FEATURED_RANK[a.slug] ?? 99) - (FEATURED_RANK[b.slug] ?? 99))
export const publicProjects = projects.filter((p) => !p.isInternal)
export const internalProjects = projects.filter((p) => p.isInternal)
export const microdidactProjects = publicProjects.filter((p) => p.underMicrodidact)
/** Genuine solos — outside Microdidact AND outside any world on /work. */
export const soloProjects = publicProjects.filter((p) => !p.underMicrodidact && !p.world)
/** Sites actually online — a family entry counts each of its deployments. */
export const liveSiteCount = publicProjects.reduce(
  (n, p) => n + (p.liveUrl !== '#' ? (p.sites?.length ?? 1) : 0),
  0,
)
export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
export const getProjectsByCategory = (category: ProjectCategory) =>
  publicProjects.filter((p) => p.category === category)
