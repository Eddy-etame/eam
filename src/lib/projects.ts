import type { Locale } from '@/i18n/config'

/**
 * EAM — Project portfolio data. Source of truth for every Work surface.
 *
 * ⚠️ DRAFT METRICS: outcome figures (percentages, Lighthouse scores, user
 * counts) are carried over from the brief and are NOT yet client-verified.
 * Treat them as provisional copy until EAM signs off — see CaseStudy display.
 *
 * Internal/NDA projects (isInternal: true) MUST never expose a live URL or a
 * real screenshot. They render via InternalCard with a confidential badge.
 */

export type Localized<T = string> = Record<Locale, T>

export type ProjectCategory =
  | 'Restauration & F&B'
  | 'Services Automobiles'
  | 'Commerce & Services'
  | 'Corporate & Formation'
  | 'Tech & SaaS'
  | 'Culture & Associatif'
  | 'Agence Créative'
  | 'Sport & Bien-être'
  | 'Outil Interne'

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
  // Boxing Center maquettes are IN PRODUCTION (not yet deployed) — liveUrl '#'
  // hides the "visit" link. boxingcenter.fr is the legacy WordPress site EAM is
  // REPLACING, not our build. No client metrics invented. Confirm with Eddy:
  // deployed URLs, umbrella-vs-per-salle, and whether to show all 5 salles.
  {
    slug: 'boxing-center',
    name: 'Boxing Center',
    client: 'Boxing Center Toulouse',
    tagline: {
      fr: 'Cinq salles, cinq identités. Une seule obsession.',
      en: 'Five gyms, five identities. One obsession.',
    },
    description: {
      fr: "Refonte digitale du réseau Boxing Center (Portet, États-Unis, Minimes, St-Cyprien, Ramonville) — un site immersif WebGL par salle, chacun forgé à partir du logo maison (marine + cuivre), jamais dupliqué.",
      en: 'A digital rebuild of the Boxing Center network (Portet, États-Unis, Minimes, St-Cyprien, Ramonville) — one immersive WebGL site per gym, each forged from the house logo (navy + copper), never duplicated.',
    },
    category: 'Sport & Bien-être',
    tags: ['Sport de combat', 'Boxe', 'WebGL / 3D', 'Three.js', 'Réseau', 'Toulouse'],
    liveUrl: '#',
    color: '#1E2044',
    year: 2026,
    isFeatured: true,
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
        fr: 'En cours de production — maquettes livrées, portage Astro/Next en cours. Aucun indicateur publié tant que les sites ne sont pas en ligne.',
        en: 'In production — maquettes delivered, Astro/Next port under way. No metrics published until the sites are live.',
      },
      // Craft facts from the delivered maquettes — not client outcomes.
      metrics: [
        { value: '5', label: { fr: 'salles, une identité chacune', en: 'gyms, one identity each' } },
        { value: '3D', label: { fr: 'monolithe temps réel (Three.js)', en: 'real-time monolith (Three.js)' } },
        { value: '100%', label: { fr: 'de la copie dans le DOM — SEO intact', en: 'of the copy in the DOM — SEO intact' } },
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
      fr: "Vitrine immersive pour la salle amirale du réseau — 900 m² de boxe et de cross training à Portet-sur-Garonne. Ring poli en noir profond, argent et rouge de combat, scroll cinématique et arène 3D discrète.",
      en: 'An immersive showcase for the flagship of the network — 900 m² of boxing and cross training in Portet-sur-Garonne. A polished ring in deep black, silver and fight-red, cinematic scroll and a quiet 3D arena.',
    },
    category: 'Sport & Bien-être',
    tags: ['Boxe', 'Sport de combat', 'WebGL / 3D', 'Immersif', 'Toulouse'],
    liveUrl: '#',
    color: '#E8001C',
    year: 2026,
    isFeatured: false,
    isInternal: false,
    techStack: ['Next.js', 'TypeScript', 'Three.js / WebGL', 'GSAP', 'Lenis', 'Tailwind CSS'],
    caseStudy: {
      problem: {
        fr: "Une salle phare — ring olympique, tatami, panneaux MMA, 24 sacs, 500 m² de boxe et 400 m² de cross training — enfermée dans un site générique qui ne transmettait ni la puissance du lieu ni l'accès illimité 7 j/7.",
        en: 'A flagship room — Olympic ring, tatami, MMA panels, 24 heavy bags, 500 m² of boxing and 400 m² of cross training — trapped in a generic site that conveyed neither the power of the place nor its unlimited 7-day-a-week concept.',
      },
      solution: {
        fr: "Une vitrine « arène polie » : noir mat, argent et rouge de combat, défilement lissé par Lenis, chorégraphie GSAP et décor d'arène en Three.js en surcouche discrète, avec repli sans-WebGL. Toute la copie reste dans le DOM ; la 3D n'est qu'atmosphère. Légibilité WCAG AA verrouillée.",
        en: 'A “polished-arena” showcase: matte black, silver and fight-red, Lenis-smoothed scroll, GSAP choreography and a quiet Three.js arena overlay, with a no-WebGL fallback. Every line of copy stays in the DOM; the 3D is atmosphere only. WCAG-AA legibility locked.',
      },
      outcome: {
        fr: "Provisoire — à confirmer par EAM : une expérience immersive de niveau agence primée, pensée pour un portage Astro/Next. Repli sans-WebGL et copie DOM garantissent performance, SEO local et accessibilité.",
        en: 'Provisional — to be confirmed by EAM: an award-tier immersive experience engineered for an Astro/Next hand-off. A no-WebGL fallback and DOM copy guarantee performance, local SEO and accessibility.',
      },
    },
  },
  {
    slug: 'boxing-center-le-colosse',
    name: 'Boxing Center — Le Colosse',
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
    liveUrl: '#',
    color: '#7A3D16',
    year: 2026,
    isFeatured: false,
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
        fr: "Provisoire — à confirmer par EAM : maquette v4 avec walkthrough Three.js réel et repli DOM ; feuille de route ouverte (reflets métal, easing caméra par salle, audio spatial par zone).",
        en: 'Provisional — to be confirmed by EAM: a v4 maquette with a real Three.js walkthrough and DOM fallback; open roadmap (metal reflections, per-room camera easing, per-zone spatial audio).',
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
    liveUrl: 'https://the911.fr',
    color: '#0b0b0b',
    year: 2025,
    isFeatured: false,
    isInternal: false,
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
    liveUrl: 'https://www.chickenbens.fr/',
    color: '#E63328',
    year: 2025,
    isFeatured: false,
    isInternal: false,
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
    liveUrl: 'https://marchedemov2.vercel.app/',
    color: '#1C6B35',
    year: 2025,
    isFeatured: false,
    isInternal: false,
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
    liveUrl: 'https://nyc-cookies.ma',
    color: '#0a0a0a',
    year: 2024,
    isFeatured: false,
    isInternal: false,
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
    liveUrl: 'https://www.car-repair-france.fr/',
    color: '#0b0b0b',
    year: 2025,
    isFeatured: false,
    isInternal: false,
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
    liveUrl: 'https://pieces-auto-colomiers.vercel.app/',
    color: '#0F2C5A',
    year: 2025,
    isFeatured: false,
    isInternal: false,
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
    liveUrl: 'https://f2mconsulting.fr',
    color: '#1a237e',
    year: 2025,
    isFeatured: true,
    isInternal: false,
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
      fr: 'Cabinet de conseil & accompagnement stratégique.',
      en: 'Consulting firm & strategic advisory.',
    },
    description: {
      fr: "Site institutionnel pour un cabinet de conseil — accompagnement stratégique et conseil en organisation.",
      en: 'An institutional site for a consulting firm — strategic guidance and organisational consulting.',
    },
    category: 'Corporate & Formation',
    tags: ['Corporate', 'Conseil', 'Stratégie'],
    liveUrl: 'https://jcboyang-conseil-1.onrender.com/',
    color: '#1C2B3A',
    year: 2024,
    isFeatured: false,
    isInternal: false,
    techStack: ['Node.js', 'Express', 'HTML/CSS'],
    caseStudy: {
      problem: {
        fr: "Cabinet sans présence web — acquisition uniquement via réseau.",
        en: 'A firm with no web presence — client acquisition via network only.',
      },
      solution: {
        fr: 'Site institutionnel sobre avec présentation des offres et formulaire de contact.',
        en: 'A clean institutional site presenting the offer with a contact form.',
      },
      outcome: {
        fr: 'Première vitrine digitale du cabinet. Une base pour des campagnes LinkedIn.',
        en: "The firm's first digital storefront. A base for LinkedIn campaigns.",
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
    isFeatured: false,
    isInternal: false,
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
      fr: "Plateforme SaaS d'hébergement haute performance pour l'Afrique — paiement FCFA, PayPal et Minipay. 1 000+ utilisateurs.",
      en: 'A high-performance SaaS hosting platform for Africa — FCFA, PayPal and Minipay payments. 1,000+ users.',
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
    liveUrl: 'https://id-skillz.com/',
    color: '#B8A98C',
    year: 2025,
    isFeatured: false,
    isInternal: false,
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
    slug: 'formforge',
    name: 'FormForge',
    client: 'Agence EAM (Interne — NDA)',
    tagline: {
      fr: 'Notre SaaS de formulaires multi-clients.',
      en: 'Our multi-client forms SaaS.',
    },
    description: {
      fr: "SaaS propriétaire de création et gestion de formulaires multi-clients — analytics temps réel, soumissions, webhooks.",
      en: 'A proprietary SaaS to build and manage multi-client forms — real-time analytics, submissions, webhooks.',
    },
    category: 'Outil Interne',
    tags: ['SaaS', 'Formulaires', 'Analytics', 'Multi-tenant', 'NDA'],
    liveUrl: '#',
    color: '#0F2C5A',
    year: 2025,
    isFeatured: false,
    isInternal: true,
    techStack: ['Next.js 15', 'Supabase', 'TypeScript', 'PostgreSQL', 'Prisma'],
    caseStudy: {
      problem: {
        fr: "L'agence payait Typeform/JotForm pour ses clients — coût élevé, branding générique, données chez des tiers.",
        en: 'The agency paid for Typeform/JotForm on behalf of clients — high cost, generic branding, third-party-hosted data.',
      },
      solution: {
        fr: 'SaaS propriétaire multi-tenant avec création drag-and-drop, analytics temps réel, export CSV, webhooks et panel client dédié.',
        en: 'A proprietary multi-tenant SaaS with drag-and-drop building, real-time analytics, CSV export, webhooks and a dedicated client panel.',
      },
      outcome: {
        fr: 'Économie de 1 200 €/an en abonnements tiers. Déployé pour 5 clients actifs. Plateforme évolutive.',
        en: 'Saves €1,200/year in third-party subscriptions. Deployed for 5 active clients. A scalable platform.',
      },
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
// (boxing-center intentionally absent — no maquette deployed yet; keeps gradient)
const THUMBED = new Set([
  'kermhosting',
  'la-brigade-mobile',
  'f2m-consulting',
  'mon-boum',
  'beldi-fusion',
  'chicken-bens',
  'marche-de-mo',
  'car-repair',
  'decoshop-vitrine',
  'drive-pneu',
  'c-chez-toit',
  'temps-dance',
])
for (const p of projects) if (THUMBED.has(p.slug)) p.thumb = `/thumbs/${p.slug}.jpg`

// ── Localised category labels ──────────────────────────────────────────────
export const categoryLabels: Record<ProjectCategory, Localized> = {
  'Restauration & F&B': { fr: 'Restauration & F&B', en: 'Restaurants & F&B' },
  'Services Automobiles': { fr: 'Services Automobiles', en: 'Automotive Services' },
  'Commerce & Services': { fr: 'Commerce & Services', en: 'Retail & Services' },
  'Corporate & Formation': { fr: 'Corporate & Formation', en: 'Corporate & Training' },
  'Tech & SaaS': { fr: 'Tech & SaaS', en: 'Tech & SaaS' },
  'Culture & Associatif': { fr: 'Culture & Associatif', en: 'Culture & Nonprofit' },
  'Agence Créative': { fr: 'Agence Créative', en: 'Creative Agency' },
  'Sport & Bien-être': { fr: 'Sport & Bien-être', en: 'Sport & Wellness' },
  'Outil Interne': { fr: 'Outil Interne', en: 'Internal Tool' },
}

export const categories: ProjectCategory[] = [
  'Restauration & F&B',
  'Services Automobiles',
  'Commerce & Services',
  'Corporate & Formation',
  'Tech & SaaS',
  'Culture & Associatif',
  'Agence Créative',
  'Sport & Bien-être',
  'Outil Interne',
]

// ── Helpers ─────────────────────────────────────────────────────────────────
// Curated featured order — lead with the most technically baffling work (SaaS
// scale, WebGL, rebuilds) rather than declaration order, which over-indexed F&B.
const FEATURED_RANK: Record<string, number> = {
  kermhosting: 0,
  'boxing-center': 1,
  'la-brigade-mobile': 2,
  'f2m-consulting': 3,
  'mon-boum': 4,
  'beldi-fusion': 5,
}
export const featuredProjects = projects
  .filter((p) => p.isFeatured && !p.isInternal)
  .sort((a, b) => (FEATURED_RANK[a.slug] ?? 99) - (FEATURED_RANK[b.slug] ?? 99))
export const publicProjects = projects.filter((p) => !p.isInternal)
export const internalProjects = projects.filter((p) => p.isInternal)
export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
export const getProjectsByCategory = (category: ProjectCategory) =>
  publicProjects.filter((p) => p.category === category)
