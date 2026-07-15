import { publicProjects } from '@/lib/projects'

/** English dictionary — must mirror fr.ts (parity enforced in index.ts). */
export const en = {
  nav: {
    home: 'Home',
    work: 'Work',
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
    eyebrow: 'Digital atelier · since 2024',
    titleLines: ['We forge', 'brands', 'that reign.'],
    subtitle:
      'Three web craftsmen. Bespoke sites, business apps and SEO that put our clients on page one — and inside the answers AI gives.',
    ctaPrimary: 'See our work',
    ctaSecondary: 'Start a project',
    scrollHint: 'Scroll',
  },
  marquee: ['Bespoke', 'Performance', 'Senior SEO', 'GEO', 'Identity', 'No compromise'],
  featured: {
    eyebrow: 'Selected work',
    title: 'The work speaks. We listen.',
    subtitle: 'A selection of digital presences we designed, coded and carried all the way to the ranking.',
    cta: 'Explore all work',
  },
  clients: {
    eyebrow: 'Trusted by',
    title: 'Brands that chose us.',
  },
  homeWorlds: {
    eyebrow: 'Two worlds',
    title: 'Entire worlds, not pages.',
    enter: 'Enter',
    doors: {
      microdidact: {
        name: 'Microdidact',
        count: '16',
        line: 'Sixteen projects forged under the Toulouse agency — the crossing happens on scroll.',
      },
      boxingCenter: {
        name: 'Boxing Center',
        count: '5+1',
        line: 'Five gyms, one immersive site each — plus the official Box Plus store.',
      },
    },
  },
  services: {
    eyebrow: 'Craft',
    title: 'What the atelier forges',
    intro: 'From the first line of code to the last pixel — and all the way to page one.',
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
        description: 'Page-one Google and citations in ChatGPT, Perplexity and AI Overviews.',
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
    title: 'Three craftsmen, one obsession.',
    lead: 'EAM is a creative digital agency founded in 2024. The name belongs to its three partners: Etame, Angoula and Mbosseu.',
    body: [
      "We don't ship templates. We forge bespoke digital presences — every line of code, every curve, every tag built to serve a brand and its ranking.",
      'Small team, outsized standards. You speak directly to the people who design and code. No middlemen, no jargon — measurable results.',
    ],
    valuesTitle: 'Our principles',
    values: [
      { title: 'Powerful', text: 'Sites that land and perform — no decoration without intent.' },
      { title: 'Precise', text: 'Detail is the craft: from technical SEO to the kerning of a headline.' },
      { title: 'Premium', text: 'The care of a maison, the speed of a modern studio.' },
    ],
    stats: [
      { value: '22+', label: 'projects' },
      { value: '3', label: 'craftsmen' },
      { value: '7', label: 'industries' },
      { value: '2024', label: 'founded' },
    ],
  },
  team: {
    eyebrow: 'The craftsmen',
    title: 'The hands behind the crest.',
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
        a: "EAM is a creative digital agency founded in 2024 by three partners — Etame, Angoula and Mbosseu, whose names form the agency's name. EAM builds bespoke websites, business applications and search strategies (SEO & GEO) for SMEs, local businesses and founders across France, Morocco and francophone Africa.",
      },
      {
        q: 'What services does EAM offer?',
        a: 'EAM builds showcase and editorial websites, business applications (dashboards, SaaS, PWAs), e-commerce, visual identity and branding, plus SEO and GEO.',
      },
      {
        q: 'Is EAM a web agency in Toulouse?',
        a: "EAM's team has its roots in the Toulouse area: the three founders forged sixteen projects there under Microdidact, and the Boxing Center network, a direct client, is based in Toulouse. EAM works remotely for clients in France, Morocco, francophone Africa and internationally; the head-office address is not published.",
      },
      {
        q: 'What is GEO (Generative Engine Optimization)?',
        a: "GEO is optimising a site to be cited by AI answer engines such as ChatGPT, Perplexity and Google's AI Overviews. EAM bakes it into every project: structured content, schema.org data, an llms.txt file and direct, factual answers.",
      },
      {
        q: 'What is the difference between SEO and GEO?',
        a: "SEO (Search Engine Optimization) targets a site's ranking in search results such as Google's. GEO (Generative Engine Optimization) targets its citation inside AI answers — ChatGPT, Perplexity, AI Overviews. Both rest on the same foundation: a fast, structured, factual site. EAM works both into every project.",
      },
      {
        q: 'How can a website get cited by ChatGPT or Perplexity?',
        a: "By making its content readable and verifiable by answer engines: direct factual answers, copy present in server-rendered HTML (readable without JavaScript), schema.org structured data, an llms.txt file and fast pages. That is the method EAM applies to every project — the decision to cite remains each engine's own.",
      },
      {
        q: 'How much does a website with EAM cost?',
        a: 'Every project is bespoke; the budget depends on scope and features. EAM provides a free quote within 24–48 hours of a first conversation.',
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
        q: 'How do I contact EAM?',
        a: 'By email at eam.agency@gmail.com, or through the form on the Contact page. We reply within 24–48 hours.',
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
    emailLabel: 'Write to us',
    responseChip: 'Reply within 24–48h',
    whoAnswers: 'Who answers you',
    copied: 'Copied ✓',
    form: {
      name: 'Name',
      email: 'Email',
      company: 'Company (optional)',
      message: 'Your project',
      submit: 'Send message',
      sending: 'Sending…',
      success: 'Received. We get back to you within 24–48h.',
      error: 'Sending failed — try again, or write to us directly.',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'you@example.com',
      messagePlaceholder: 'Your project, in a few words…',
      note: 'Sending this opens your email client pre-filled with the details.',
    },
  },
  work: {
    eyebrow: 'Work',
    title: 'The portfolio',
    subtitle: 'Sites, apps and tools forged for brands that wanted to truly exist online.',
    filterAll: 'All',
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
    button: 'Start a project',
    secondary: 'Visit the studio',
    roomAsk: 'A project like this one?',
    case: {
      eyebrow: 'Your turn',
      title: 'Already picturing yours?',
      text: "This level of craft, applied to your brand. Let's talk.",
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
      button: 'Start a project',
    },
    back: 'Back to the registry',
  },
  bcWorld: {
    meta: {
      title: 'The Boxing Center world',
      description:
        'A direct EAM client: the Boxing Center network in Toulouse — five gyms, one immersive site per gym, plus the official Box Plus online store. Navy, red and sweat.',
    },
    eyebrow: 'Direct client · Toulouse',
    title: 'The Boxing Center world.',
    lead: 'A navy-and-red crest, five gyms, one discipline: combat. For this Toulouse network EAM forges one immersive site per gym — never cloned — plus its official online store.',
    logoAlt: 'Boxing Center — combat-sports gym network, Toulouse',
    scrollHint: 'Step into the arena',
    salles: {
      eyebrow: 'Chapter I — The five gyms',
      title: 'Five gyms. Five sites. Zero duplication.',
      intro:
        'One immersive site per gym, never cloned. Each gym carries its neighbourhood name — each asserts its own matter, its metal, its type, its 3D — under the same navy-and-red crest.',
      caseCta: 'Case study',
      items: [
        {
          name: 'Portet',
          place: 'Portet-sur-Garonne',
          line: 'The flagship — 900 m² of boxing and cross training, a polished ring in deep black, silver and fight-red.',
        },
        {
          name: 'États-Unis',
          place: 'Toulouse — États-Unis district',
          line: 'Billed as the largest combat-sports gym in France — a real-time 3D steel monolith you walk through.',
        },
        {
          name: 'Minimes',
          place: 'Toulouse — Les Minimes',
          line: 'The school of the clean gesture — English boxing, beginners and lady boxing, where the club trains its first guards.',
        },
        {
          name: 'St-Cyprien',
          place: 'Toulouse — Saint-Cyprien',
          line: 'The newest of the network — Muay Thai, grappling, hyrox: the laboratory of rising disciplines.',
        },
        {
          name: 'Ramonville',
          place: 'Ramonville-Saint-Agne',
          line: 'The cage and the platform — MMA, strength training and fight camps on the south side of the city.',
        },
      ],
    },
    boutique: {
      eyebrow: 'Chapter II — The official store',
      name: 'Box Plus',
      tag: 'Official Boxing Center store · Toulouse',
      line: "The network's online store — memberships, trial sessions, coaching and gear. Stripe checkout, PrestaShop bridge, catalogue continuously synced with Deciplus.",
      visit: 'Visit the store',
    },
    stats: {
      eyebrow: 'The facts',
      items: [
        { value: '5 + 1', label: 'five gyms + the online store' },
        { value: '3D', label: 'real time — Three.js' },
        { value: 'Zero', label: 'duplication across the gyms' },
        { value: '100%', label: 'of the copy in the DOM' },
      ],
    },
    close: {
      provenance:
        'Boxing Center is a direct EAM client — one immersive site per gym plus the official online store, forged under our crest.',
      title: 'Your brand deserves an arena.',
      text: 'Five gyms, five sites, one store, zero duplication. Tell us about your project — we forge at this scale.',
      button: 'Start a project',
    },
    back: 'Back to the registry',
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
          'Contact: eam.agency@gmail.com.',
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
          'Under the General Data Protection Regulation (GDPR), you can exercise your rights of access, rectification and erasure by writing to eam.agency@gmail.com.',
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
  notFound: {
    title: 'Page not found',
    text: "This page wandered off the crest. Let's head back to familiar ground.",
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
      description: 'Start a project with EAM. Free quote within 24–48h. Email eam.agency@gmail.com.',
    },
    legal: {
      title: 'Legal Notice',
      description:
        'Legal notice for the EAM website: publisher, hosting, intellectual property, personal data (GDPR) and cookies.',
    },
  },
}
