import { publicProjects, microdidactProjects, liveSiteCount } from '@/lib/projects'

// Derived counts — mirror fr.ts (the registry is the single source of truth).
const PROJECT_COUNT = publicProjects.length
const LIVE_COUNT = liveSiteCount
const MICRODIDACT_COUNT = microdidactProjects.length
const SECTOR_COUNT = new Set(publicProjects.map((p) => p.category)).size

/** English dictionary — must mirror fr.ts (parity enforced in index.ts). */
export const en = {
  nav: {
    home: 'Home',
    work: 'Work',
    services: 'Services',
    studio: 'The studio',
    contact: 'Contact',
    startProject: 'Start a project',
  },
  common: {
    skipToContent: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    theme: 'Theme',
    viewProject: 'View',
    viewCase: 'Case study',
    allProjects: 'All projects',
    backToWork: 'Back to work',
    confidential: 'Confidential',
    requestAccess: 'Details on request',
    visitSite: 'Visit site',
    nextProject: 'Next project',
    year: 'Year',
    category: 'Category',
    stack: 'Tech',
    loading: 'Loading',
  },
  hero: {
    eyebrow: 'Web engineering studio · since 2024',
    titleLines: ['We forge', 'brands', 'that reign.'],
    subtitle: `${PROJECT_COUNT} projects shipped, from Toulouse to Casablanca — by three engineers who answer you themselves. The next reigning brand could be yours.`,
    ctaPrimary: 'See our work',
    ctaSecondary: 'Get my free quote',
    riskNote: 'Free quote in 24-48h · no commitment · 2 months of maintenance free',
    scrollHint: 'Scroll',
  },
  marquee: ['Bespoke', 'A+ security', 'SEO & GEO', 'Schema.org', 'llms.txt', '24-48h response'],
  featured: {
    eyebrow: 'Selected work',
    title: 'The work speaks.',
    subtitle: `${PROJECT_COUNT} projects shipped, ${LIVE_COUNT} sites live — designed, coded and carried all the way to the ranking.`,
    cta: 'Explore all work',
  },
  clients: {
    eyebrow: 'Trusted by',
    title: 'Brands that chose us.',
  },
  proofs: {
    aria: 'Verifiable proof',
    items: [
      { value: 'A+', label: 'security', link: 'scan' },
      { value: `${PROJECT_COUNT}`, label: 'projects shipped', link: 'work' },
      { value: `${LIVE_COUNT}`, label: 'sites live', link: 'work' },
      { value: '24-48h', label: 'response time', link: 'contact' },
    ],
  },
  testimonials: {
    eyebrow: 'In their words',
    title: 'Clients speak.',
    note: 'Every quote is signed — and links to its case study.',
  },
  homeWorlds: {
    eyebrow: 'Two worlds',
    title: 'Entire worlds, not pages.',
    enter: 'Enter',
    doors: {
      microdidact: {
        name: 'Microdidact',
        count: `${MICRODIDACT_COUNT}`,
        line: 'Sixteen projects forged under the Toulouse agency — the crossing happens on scroll.',
      },
      boxingCenter: {
        name: 'Boxing Center',
        count: '19',
        line: 'Five gym sites, seven proximity sites, three stores — and the tools that run the network.',
      },
    },
  },
  services: {
    eyebrow: 'Craft',
    title: 'What the atelier forges',
    intro: 'Design, code, search — delivered with receipts: performance, structured data, AI visibility.',
    items: [
      {
        title: 'Bespoke websites',
        description: 'Hand-cut showcase and editorial sites, built for speed and conversion.',
      },
      {
        title: 'Business applications',
        description: 'Dashboards, multi-tenant SaaS, PWAs and internal tools that run your operation.',
      },
      {
        title: 'SEO & GEO',
        description: 'Visibility built on Google and inside AI answers — and measured: our citation logs are public, hits and misses alike.',
      },
      {
        title: 'Brand & design',
        description: 'Logo, visual system and art direction in lockstep — from crest to pixel.',
      },
      {
        title: 'E-commerce & delivery',
        description: 'Stores, delivery integrations and frictionless checkout funnels.',
      },
      {
        title: 'Rebuild & performance',
        description: 'We take what exists and forge it anew: faster, cleaner, better ranked.',
      },
    ],
  },
  about: {
    eyebrow: 'The studio',
    title: 'Three engineers. One standard.',
    lead: 'EAM is a creative digital agency founded in 2024. The name belongs to its three partners: Etame, Angoula and Mbosseu.',
    body: [
      "We don’t ship templates. Every line of code, every curve, every tag is built to serve a brand and its ranking.",
      `${PROJECT_COUNT} projects shipped since 2024 — and you speak directly to the three people who design and code them. No middlemen, no jargon.`,
    ],
    valuesTitle: 'Our principles',
    values: [
      { title: 'Measurable', text: 'A+ security, structured data on every page, copy 100% in the DOM — verifiable, not declarative.' },
      { title: 'Precise', text: 'Detail is the craft: from technical SEO to the kerning of a headline.' },
      { title: 'Direct', text: 'You speak to the three people who design and code — no one else.' },
    ],
    stats: [
      { value: `${PROJECT_COUNT}`, label: 'projects' },
      { value: '3', label: 'engineers' },
      { value: `${SECTOR_COUNT}`, label: 'industries' },
      { value: '2024', label: 'founded' },
    ],
  },
  team: {
    eyebrow: 'The team',
    title: 'The three who answer.',
    intro:
      'Three. On purpose. The people who design and code your project are the same three you speak to.',
    pending: 'Portrait forthcoming',
    toggle: {
      label: 'Preview',
      aria: 'Portrait colour preview',
      modes: { mono: 'Mono', gold: 'Gold', iridescent: 'Prism', paper: 'Paper' },
    },
  },
  faq: {
    eyebrow: 'Frequently asked',
    title: 'Everything about EAM',
    items: [
      {
        q: 'What is EAM?',
        a: "EAM is a creative digital agency founded in 2024 by three partners — Etame, Angoula and Mbosseu, whose names form the agency’s name. EAM builds bespoke websites, business applications and search strategies (SEO & GEO) for SMEs, local businesses and founders across France, Morocco and francophone Africa.",
      },
      {
        q: 'What services does EAM offer?',
        a: 'EAM builds showcase and editorial websites, business applications (dashboards, SaaS, PWAs), e-commerce, visual identity and branding, plus SEO and GEO.',
      },
      {
        q: 'Is EAM a web agency in Toulouse?',
        a: "EAM’s team has its roots in the Toulouse area: the three founders forged sixteen projects there under Microdidact, and the Boxing Center network, a direct client, is based in Toulouse. EAM works remotely for clients in France, Morocco, francophone Africa and internationally; the head-office address is not published.",
      },
      {
        q: 'What is GEO (Generative Engine Optimization)?',
        a: "GEO is optimising a site to be cited by AI answer engines such as ChatGPT, Perplexity and Google’s AI Overviews. EAM bakes it into every project: structured content, schema.org data, an llms.txt file and direct, factual answers.",
      },
      {
        q: 'What is the difference between SEO and GEO?',
        a: "SEO (Search Engine Optimization) targets a site’s ranking in search results such as Google’s. GEO (Generative Engine Optimization) targets its citation inside AI answers — ChatGPT, Perplexity, AI Overviews. Both rest on the same foundation: a fast, structured, factual site. EAM works both into every project.",
      },
      {
        q: 'How can a website get cited by ChatGPT or Perplexity?',
        a: "By making its content readable and verifiable by answer engines: direct factual answers, copy present in server-rendered HTML (readable without JavaScript), schema.org structured data, an llms.txt file and fast pages. That is the method EAM applies to every project — the decision to cite remains each engine’s own.",
      },
      {
        q: 'How much does a website with EAM cost?',
        a: 'Every site is priced to measure: the cost depends on scope — number of pages, features, content to create. Tell us about your project and you get a precise, free quote within 24–48 hours, with no commitment, straight from the engineers who will build it. Monthly SEO & GEO support starts at €300 (excl. VAT).',
      },
      {
        q: 'How long does it take to get a quote?',
        a: 'EAM replies within 24–48 hours of a first conversation, with a free quote. Build timelines depend on the scope of each project and are laid out in that quote.',
      },
      {
        q: 'Does EAM rebuild existing websites?',
        a: 'Yes. Rebuilds are part of what EAM offers: taking an existing site and forging it anew — design, technical foundation, performance and search — with one goal: faster, cleaner, better ranked.',
      },
      {
        q: 'What technologies does EAM use?',
        a: 'EAM works primarily with Next.js, React, Astro, TypeScript, Tailwind CSS, Supabase and PostgreSQL.',
      },
      {
        q: 'Does EAM work in French and English?',
        a: 'Yes. EAM builds bilingual and multilingual sites and serves both francophone and international clients.',
      },
      {
        q: 'Is maintenance included?',
        a: 'The first two months of maintenance on your site are free — worth €50 a month. EAM stays directly reachable during and after that period.',
      },
      {
        q: 'How do I contact EAM?',
        a: 'Through the form on the Contact page, or on WhatsApp. You get a reply within 24–48 hours, straight from the three engineers.',
      },
    ],
  },
  brandFaq: {
    eyebrow: 'Frequently asked',
    title: 'The agency, spelled out',
    items: [
      {
        q: 'What does the name EAM mean?',
        a: "EAM is an acronym of its three founders' names: Etame, Angoula and Mbosseu.",
      },
      {
        q: 'Who are the founders of EAM?',
        a: 'EAM was founded in 2024 by three partners: Eddy Etame, Raphaël Angoula and Brad Mbosseu. All three are engineers — they are the ones who design and code every project the agency ships.',
      },
      {
        q: 'What is the relationship between EAM and Microdidact?',
        a: 'Before founding EAM, the three partners designed and coded sixteen projects within Microdidact, a Toulouse communication agency (Microdidac group). Those works carry the "Under Microdidact" badge in the portfolio. EAM is an independent agency — Microdidact is neither its parent company nor a subsidiary.',
      },
      {
        q: 'Why is EAM only three people?',
        a: 'By choice. At three, the people who design and code your project are exactly the ones you talk to: no middlemen, no information loss, direct accountability for the result.',
      },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'A project to forge?',
    lead: 'Tell us about your brand, your goals and your timeline. We get back to you within 24–48 hours with a first direction.',
    responseChip: 'Reply within 24–48h',
    whoAnswers: 'Who answers you',
    form: {
      name: 'Name',
      email: 'Email',
      company: 'Company (optional)',
      message: 'Your project',
      submit: 'Send message',
      sending: 'Sending…',
      success: 'Received. We get back to you within 24–48h.',
      error: 'Sending failed — try again in a moment, or message us on',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'you@example.com',
      messagePlaceholder: 'Your project, in a few words…',
    },
  },
  work: {
    eyebrow: 'Work',
    title: 'The portfolio',
    subtitle: 'Sites, apps and tools forged for brands that wanted to truly exist online.',
    filterAll: 'All',
    countLabel: 'projects shipped',
    doorsHeading: 'The two worlds',
    solosHeading: 'Independent builds',
    microdidactBadge: 'Under Microdidact',
    microdidactNote: 'Built under Microdidact — a Toulouse communication agency (Microdidac group) where the team forged these projects.',
    internalSectionTitle: 'Internal & confidential tools',
    internalNote: 'Projects under NDA. Shown without visuals or links — details on request.',
    enterWorld: 'Enter',
  },
  /** Category filter chips — short labels sized for the chip rows. */
  filters: {
    eyebrow: 'Explore by trade',
    all: 'All',
    labels: {
      'Restauration & F&B': 'Restaurants',
      'Services Automobiles': 'Automotive',
      'Commerce & Services': 'Retail & Services',
      'Corporate & Formation': 'Corporate',
      'Tech & SaaS': 'SaaS',
      'Culture & Associatif': 'Culture',
      'Agence Créative': 'Creative',
      'Sport & Bien-être': 'Sport',
      'Outil Interne': 'Internal tool',
    },
  },
  caseStudy: {
    overview: 'Overview',
    problemLabel: 'The challenge',
    solutionLabel: 'Our answer',
    outcomeLabel: 'The outcome',
    draftNote: 'Metrics pending client validation.',
    visitLabel: 'Visit the live site',
    nextLabel: 'Next project',
  },
  /** Conversion bands — the single ask of each surface (consumed by ConversionBand & the room CTA rows). */
  conversion: {
    button: 'Get my free quote',
    secondary: 'Visit the studio',
    roomAsk: 'A project like this one?',
    case: {
      eyebrow: 'Your turn',
      title: 'Already picturing yours?',
      text: "This level of craft, applied to your brand. Let’s talk.",
    },
    world: {
      eyebrow: 'And the next one?',
      title: 'Your sector deserves the same care.',
      text: 'Restaurants, garages, shops, business tools — every piece of this world was cut to measure. Yours is still to be forged.',
    },
    registre: {
      eyebrow: 'The registry, continued',
      title: 'Every project here began with a message.',
      text: 'Yours can set off today — we reply within 24 to 48 hours.',
    },
  },
  /** In-room labels for the immersive project rooms (consumed by the rooms surfaces; rundowns live in src/lib/rundowns.ts). */
  rooms: {
    projet: 'The project',
    travail: 'Our work',
    enter: 'Enter',
    scrollHint: 'Scroll',
    visit: 'Visit the live site',
    next: 'Next project',
    back: 'Back to the registry',
  },
  microdidact: {
    meta: {
      title: 'The Microdidact world',
      description:
        'Before the EAM crest: Microdidact, a Toulouse communication agency where the team forged sixteen projects — restaurants, garages, shops and business tools.',
    },
    eyebrow: 'Origin chapter',
    title: 'The Microdidact world.',
    lead: 'Before the crest, there was the workshop. At Microdidact, a Toulouse communication agency, the three craftsmen of EAM forged side by side the projects that sharpened their trade.',
    logoAlt: 'Microdidact — communication agency, Toulouse',
    scrollHint: 'Enter',
    story: {
      eyebrow: 'The genesis',
      title: 'Where the hand was trained.',
      paragraphs: [
        'Microdidact is a communication agency based in Toulouse. Within its walls the EAM team learned to deliver: from restaurants to garages, neighbourhood shops to business tools, every commission treated as a one-off piece.',
        'These works carry the mark of that era — and already the standard that defines EAM today: bespoke builds, performance, and sites engineered to be found.',
      ],
    },
    stats: {
      projects: 'projects forged',
      sectors: 'sectors served',
      city: 'home port',
      cityValue: 'Toulouse',
    },
    constellation: {
      eyebrow: 'The constellation',
      title: 'The pieces of the registry.',
      intro: 'Each project leads to its case study — the problem, the answer, the outcome.',
    },
    cta: {
      title: 'The next chapter is written with you.',
      text: 'The standard forged at Microdidact now lives under the EAM crest. Tell us about your project.',
      button: 'Get my free quote',
    },
    back: 'Back to the registry',
  },
  bcWorld: {
    meta: {
      title: 'The Boxing Center world',
      description:
        'A direct EAM client: the Boxing Center network in Toulouse — five gym sites, two clubs, seven proximity sites and three stores, each on its own domain.',
    },
    eyebrow: 'Direct client · Toulouse',
    title: 'The Boxing Center world.',
    lead: 'A navy-and-red crest, five gyms, one discipline: combat. For this Toulouse network EAM forged nineteen live pieces — one site per gym, two English-boxing clubs, seven proximity sites, three stores and the tools that run the network.',
    logoAlt: 'Boxing Center — combat-sports gym network, Toulouse',
    scrollHint: 'Step into the arena',
    caseCta: 'Case study',
    visitCta: 'Visit the site',
    salles: {
      eyebrow: 'Chapter I — The five gyms',
      title: 'Five gyms. Five sites live. Zero duplication.',
      intro:
        'One site per gym, never cloned — each on its own domain name. Each gym carries its neighbourhood name and asserts its own matter, its metal, its type — under the same navy-and-red crest.',
      label: 'Gym',
      items: [
        {
          name: 'Portet',
          place: 'Portet-sur-Garonne',
          line: '“Here, sport becomes a passion. Passion becomes a way of life.” — the flagship: 600 m² dedicated to combat sports, a ring and an MMA cage. The club name assembles from particles on arrival.',
        },
        {
          name: 'États-Unis',
          place: 'Toulouse — avenue des États-Unis',
          line: 'The largest combat-sports gym in France — 1,200 m², three 400 m² spaces, two rings and a cage. MMA, grappling, boxing and conditioning under one roof.',
        },
        {
          name: 'Minimes',
          place: 'Toulouse — Barrière de Paris',
          line: '“The first class is enough to understand why people come back.” — English boxing, youth boxing, Boxing Lady and kick-boxing; the gym video plays through the club lettering.',
        },
        {
          name: 'St-Cyprien',
          place: 'Toulouse — Saint-Cyprien, left bank',
          line: 'Beginners, leisure, competition — English boxing, K1, Muay Thai and cross-training, four minutes from metro line A.',
        },
        {
          name: 'Ramonville',
          place: 'Ramonville-Saint-Agne',
          line: 'The octagon turns: eight sides, eight disciplines — 300 m² of covered outdoor training, a 7-metre octagon, at the end of metro line B.',
        },
      ],
    },
    clubs: {
      eyebrow: 'Chapter II — Two English-boxing clubs',
      title: 'Two clubs. Two identities.',
      intro:
        'Around the network, two English-boxing clubs have a site of their own: TMBC in the Minimes district, FFBoxe-affiliated, and Club de Boxe Blagnac, a member of the Boxing Center network.',
      label: 'Club',
      items: [
        {
          name: 'TMBC',
          place: 'Toulouse — Les Minimes',
          line: 'Toulouse Minimes Boxing Club, since 2017 — leisure and competitive English boxing, a boxing school from age 3. The club crest, treated like a fight poster.',
        },
        {
          name: 'Blagnac',
          place: 'Blagnac — 31700',
          line: 'Six classes, six days a week, from age 3 to the competition squad — a 23-page editorial site, readable by answer engines too.',
        },
      ],
    },
    proximite: {
      eyebrow: 'Chapter III — The seven proximity sites',
      title: 'Seven towns. Seven sites. Zero copies.',
      intro:
        'One site per town around Toulouse, for the resident looking for a boxing club nearby. Same mechanics, but a text, a colour and a motion signature of its own for every town — 125 pages in total.',
      // Each line is the town site's own H1, quoted as published (French sites).
      items: [
        { name: 'Colomiers', line: 'Boxing Center accueille les Columérins à Toulouse Minimes et à Portet.' },
        { name: 'Muret', line: 'Ton club de boxe proche de Muret.' },
        { name: 'Cugnaux', line: 'Des cours de boxe accessibles depuis Cugnaux.' },
        { name: 'Tournefeuille', line: 'Ton club de MMA et de boxe thaï près de Tournefeuille.' },
        { name: 'Labège', line: 'Sports de combat à proximité de Labège.' },
        { name: 'L’Union', line: 'La plus grande salle de sports de combat, proche de L’Union.' },
        { name: 'Castelginest', line: 'Boxe, MMA et sports de combat accessibles depuis Castelginest.' },
      ],
    },
    boutique: {
      eyebrow: 'Chapter IV — The three stores',
      name: 'Box Plus',
      tag: 'Official Boxing Center store · Toulouse',
      line: "The network’s online store — memberships, trial sessions, coaching and gear. Stripe checkout, PrestaShop bridge, catalogue continuously synced with Deciplus.",
      visit: 'Visit the store',
      label: 'Store',
      others: [
        {
          name: 'Boutique de Boxe',
          place: 'France — national catalogue',
          line: 'Everything for boxing and MMA: more than a thousand models, guides and a “where to box” page per city — 1,222 pages live, sales opening soon.',
        },
        {
          name: 'Matos de Boxe',
          place: 'France — Metal Boxe catalogue',
          line: '“The fighters’ gear” — Metal Boxe gloves, protection and fight wear, every product on its own stage. Sales opening soon.',
        },
      ],
    },
    outils: {
      eyebrow: 'Chapter V — Backstage',
      title: 'The network also runs backstage.',
      intro:
        'Beyond the showcases: EAM builds the tools that run the network day to day — and the funnel that fills the gyms.',
      items: [
        {
          name: 'Coach Planning',
          line: 'The internal coach-scheduling app — five gyms of time slots, driven from a single screen.',
          url: 'https://planning-bc.vercel.app',
        },
        {
          name: 'Free trial session',
          line: 'The network’s acquisition funnel — one page, one promise, one form: the trial session that fills the gyms.',
          url: 'https://bc-seance-offerte.vercel.app',
        },
      ],
      open: 'Open',
    },
    stats: {
      eyebrow: 'The facts',
      items: [
        { value: '5', label: 'gym sites' },
        { value: '7', label: 'proximity sites' },
        { value: '3', label: 'online stores' },
        { value: '19', label: 'live pieces in total' },
      ],
    },
    close: {
      provenance:
        'Boxing Center is a direct EAM client — gym sites, proximity sites, stores and the network tools, forged under our crest.',
      title: 'Your brand deserves an arena.',
      text: 'Nineteen live pieces, each on its own domain name — zero duplication. Tell us about your project: we forge at this scale.',
      button: 'Get my free quote',
    },
    back: 'Back to the registry',
  },
  privacy: {
    meta: {
      title: 'Privacy policy',
      description:
        'What the EAM site collects (almost nothing), what it does with it, and your rights — no ad trackers, no data resale, no third-party cookies.',
    },
    eyebrow: 'Privacy',
    title: 'Privacy policy',
    intro:
      'The policy is short because the collection is too: this site sets no advertising cookies, embeds no third-party trackers and sells nothing.',
    sections: [
      {
        heading: 'What we collect',
        body: [
          'The contact form sends only what you write in it: name, email address, company (optional) and your message. It goes through Inlet, the form service built by EAM, and is used solely to reply to you.',
          'Browsing itself is not profiled: no advertising cookies, no tracking pixels, no third-party behavioural analytics.',
        ],
      },
      {
        heading: 'Where the data goes',
        body: [
          'The site is hosted by Vercel Inc. (United States), which may produce the technical logs (IP addresses, timestamps) required to run and secure the service.',
          'Your messages stay in our professional inbox for the duration of the business relationship, then are deleted. They are never shared, sold or used for anything else.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'Under the GDPR you have the right to access, rectify and delete data concerning you. A request through the form on the Contact page is enough — answered within 24–48 hours, like everything else.',
        ],
      },
    ],
  },
  footer: {
    tagline: 'We forge brands that reign.',
    madeBy: 'Forged by EAM — Etame · Angoula · Mbosseu',
    rights: 'All rights reserved.',
    navTitle: 'Navigation',
    contactTitle: 'Contact',
    sitemap: 'Sitemap',
    legal: 'Legal notice',
  },
  legal: {
    eyebrow: 'Legal information',
    title: 'Legal notice',
    intro:
      'Legal information about the EAM website — publisher, hosting, intellectual property, personal data and cookies.',
    sections: [
      {
        heading: 'Site publisher',
        body: [
          'This site is published by EAM, a collective of three engineers: Eddy Etame, Raphaël Angoula and Brad Mbosseu.',
          'Contact: the form on the Contact page.',
          'Publication director: EAM.',
        ],
      },
      {
        heading: 'Hosting',
        body: [
          'The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA — vercel.com.',
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          'All content on this site — copy, visuals, code and visual identity — is the property of EAM unless stated otherwise. Any reproduction without prior authorisation is prohibited.',
          'Client trademarks, logos and visuals shown here belong to their respective owners; they appear on this site as portfolio references.',
        ],
      },
      {
        heading: 'Personal data (GDPR)',
        body: [
          'Information submitted through the contact form (name, email, company, message) is delivered to EAM by email and used solely to answer your request. It feeds no marketing list and is shared with no third party.',
          'This site uses no trackers, no audience analytics and no advertising cookies.',
          'Under the General Data Protection Regulation (GDPR), you can exercise your rights of access, rectification and erasure through the form on the Contact page.',
        ],
      },
      {
        heading: 'Cookies',
        body: [
          'This site sets no cookies beyond what is strictly necessary for its technical operation.',
        ],
      },
    ],
  },
  servicesPage: {
    hub: {
      eyebrow: 'Services',
      title: 'Four ways to work together.',
      lead: 'Every service ships with receipts — performance, structured data, AI visibility — from the three engineers you actually meet.',
      metaTitle: 'Services — website creation, e-commerce, SEO & GEO, rebuilds',
      metaDescription:
        'Bespoke websites, e-commerce, SEO & GEO, rebuilds: every project gets a free quote within 24-48h — you speak directly to the engineers.',
    },
    quoteCta: 'Get my free quote',
    quoteNote: '24-48h response · no commitment',
    whatsappCta: 'Chat on WhatsApp',
    deliverablesTitle: 'What you get',
    floorLabel: 'from',
    floorNote: 'excl. VAT — precise, free quote within 24-48h',
    /** Shown where a service carries no public price: the quote IS the offer. */
    hubQuote: 'Free quote · 24-48h',
    metaQuote: 'free quote in 24-48h',
    steps: {
      title: 'How it works',
      items: [
        'You tell us about your project — form, email or WhatsApp.',
        'You get a precise, free quote within 24 to 48 hours.',
        'You approve, we build — you talk to the engineers from start to finish.',
      ],
    },
    proofsCta: 'View the case study',
    receiptsCta: 'See our published measurements — hits and misses',
    faqTitle: 'Frequently asked',
    radio: {
      eyebrow: 'Free',
      title: 'The free X-ray of your website.',
      text: 'Send us your current site address: we return a readable audit — speed, search, AI visibility, security — whether you become a client or not.',
      cta: 'Request my X-ray',
    },
  },
  preuves: {
    meta: {
      title: 'Proof — our AI-visibility measurements, published',
      description:
        'EAM measures whether its clients (and EAM itself) are cited by ChatGPT, Bing, Google and Perplexity — and publishes it all: hits, misses, screenshots.',
    },
    eyebrow: 'Proof',
    title: 'We measure. We publish. Even the misses.',
    lead: 'Everyone promises AI visibility. We measure it — query by query, engine by engine — and publish the results here with screenshots. Including when the answer is "not yet".',
    method: {
      title: 'The method',
      steps: [
        'Real queries that real prospects type — for EAM and for our clients.',
        'Each query is asked of ChatGPT, Bing, Google and Perplexity — no account, no history.',
        'Every result is logged with its screenshot — cited or not.',
        'The measurement re-runs monthly. Nothing is removed, nothing is polished.',
      ],
    },
    table: {
      query: 'Query',
      target: 'For',
      cited: 'Cited',
      notCited: 'Not yet',
      blocked: 'Not measurable',
      evidence: 'Screenshot',
      targetEam: 'EAM',
    },
    lastRun: 'Last measured',
    footnote:
      '"—": engine unreachable during this measurement (bot-wall or login required) — we publish the screenshot of the block rather than an unverifiable result.',
    empty:
      'First measurement in progress — results will appear here, hits and misses alike. That is the point.',
    cta: 'Measure your visibility',
  },
  pricing: {
    eyebrow: 'Your quote',
    title: 'A quote cut to your project.',
    intro:
      'Every project has its scope, every business its budget. Pick what fits and tell us about yours: you get a precise, free proposal within 24 to 48 hours, with no commitment.',
    from: 'from',
    cta: 'Talk about my project',
    offer: {
      label: 'Free',
      text: 'The first two months of maintenance on your site — worth €50 a month.',
    },
    note: 'Business application, SaaS or anything off the map: let’s talk — that quote is free too.',
    bands: [
      {
        sujet: 'site-vitrine',
        name: 'Bespoke showcase site',
        price: null as string | null,
        includes: [
          'Bespoke design — never a template',
          'Technical SEO + structured data',
          'Careful performance and accessibility',
        ],
      },
      {
        sujet: 'identite',
        name: 'Immersive site & identity',
        price: null as string | null,
        includes: [
          'Full art direction',
          'Motion, real-time 3D when the project deserves it',
          'Identity carried from logo to pixel',
        ],
      },
      {
        sujet: 'e-commerce',
        name: 'E-commerce',
        price: null as string | null,
        includes: [
          'Frictionless checkout funnel',
          'Stripe or your existing payment stack',
          'Catalogue sync where needed',
        ],
      },
      {
        sujet: 'seo-geo',
        name: 'Monthly SEO & GEO',
        price: '€300 / mo' as string | null,
        includes: [
          'Continuous optimisation — Google and AI engines',
          'Structured data and llms.txt maintained',
          'Monthly report',
        ],
      },
    ],
  },
  notFound: {
    title: 'Page not found',
    text: "This page wandered off the crest. Let’s head back to familiar ground.",
    cta: 'Back home',
  },
  errorPage: {
    title: 'A mishap at the atelier.',
    text: 'Something broke mid-forge. Try again — or head back to familiar ground.',
    retry: 'Try again',
  },
  meta: {
    home: {
      title: 'EAM — Bespoke Websites, Business Apps & SEO/GEO',
      description: 'EAM designs bespoke websites, business applications and SEO & GEO strategies for SMEs and founders. France, Morocco, francophone Africa. Quote within 48h.',
    },
    work: {
      title: 'Work — Bespoke Websites & Business Applications',
      // Count interpolated from the data source — never stale.
      description: `${publicProjects.length} public builds: showcase sites, e-commerce, SaaS and business tools — each case study covers the problem, the answer and the outcome.`,
    },
    studio: {
      title: 'The Studio — Three Founders, One Digital Agency',
      description: 'EAM = Etame, Angoula, Mbosseu. A digital agency founded in 2024: three engineers, one obsession — fast, findable, hand-built websites.',
    },
    contact: {
      title: 'Contact — Free Website Quote Within 24-48h',
      description: 'Start a project with EAM: describe what you need and the three engineers who will build your site reply within 24-48h with a free quote. WhatsApp or email.',
    },
    legal: {
      title: 'Legal Notice',
      description:
        'Legal notice for the EAM website: publisher, hosting, intellectual property, personal data (GDPR) and cookies.',
    },
  },
}
