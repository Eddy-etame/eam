import { publicProjects } from '@/lib/projects'

/**
 * French dictionary — the canonical shape. `en.ts` must mirror it (enforced in
 * dictionaries/index.ts). Voice: heraldic, artisanal, confident, premium.
 */
export const fr = {
  nav: {
    home: 'Accueil',
    work: 'Réalisations',
    studio: "L'atelier",
    contact: 'Contact',
    startProject: 'Démarrer un projet',
  },
  common: {
    skipToContent: 'Aller au contenu',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    language: 'Langue',
    theme: 'Thème',
    viewProject: 'Voir',
    viewCase: 'Étude de cas',
    allProjects: 'Tous les projets',
    backToWork: 'Retour aux réalisations',
    confidential: 'Confidentiel',
    requestAccess: 'Détails sur demande',
    visitSite: 'Voir le site',
    nextProject: 'Projet suivant',
    year: 'Année',
    category: 'Catégorie',
    stack: 'Technologies',
    loading: 'Chargement',
  },
  hero: {
    eyebrow: 'Atelier digital · depuis 2024',
    titleLines: ['Nous forgeons', 'des marques', 'qui règnent.'],
    subtitle:
      "Trois artisans du web. Sites sur-mesure, applications métier et référencement qui placent nos clients en première page — et dans les réponses des IA.",
    ctaPrimary: 'Voir nos réalisations',
    ctaSecondary: 'Démarrer un projet',
    scrollHint: 'Défiler',
  },
  marquee: ['Sur-mesure', 'Performance', 'SEO senior', 'GEO', 'Identité', 'Sans compromis'],
  featured: {
    eyebrow: 'Réalisations choisies',
    title: 'Le travail parle. Nous écoutons.',
    subtitle:
      "Une sélection de présences digitales que nous avons conçues, codées et menées jusqu'au classement.",
    cta: 'Explorer toutes les réalisations',
  },
  clients: {
    eyebrow: 'Ils nous font confiance',
    title: 'Des marques qui nous ont choisis.',
  },
  services: {
    eyebrow: 'Savoir-faire',
    title: "Ce que l'atelier forge",
    intro: "De la première ligne de code au dernier pixel — et jusqu'à la première position sur Google.",
    items: [
      {
        title: 'Sites sur-mesure',
        description: "Vitrines et sites éditoriaux taillés à la main, pensés pour la vitesse et la conversion.",
      },
      {
        title: 'Applications métier',
        description: 'Dashboards, SaaS multi-tenant, PWA et outils internes qui font tourner votre activité.',
      },
      {
        title: 'SEO & GEO',
        description: 'Première page Google et citations dans ChatGPT, Perplexity et les AI Overviews.',
      },
      {
        title: 'Identité & design',
        description: 'Logo, système visuel et direction artistique cohérents — du blason au pixel.',
      },
      {
        title: 'E-commerce & livraison',
        description: 'Boutiques, intégrations de livraison et tunnels de commande sans friction.',
      },
      {
        title: 'Refonte & performance',
        description: "On reprend l'existant et on le forge à neuf : plus rapide, plus propre, mieux classé.",
      },
    ],
  },
  about: {
    eyebrow: "L'atelier",
    title: 'Trois artisans, une obsession.',
    lead: "EAM est une agence digitale créative fondée en 2024. Le nom est celui de ses trois associés : Etame, Angoula et Mbosseu.",
    body: [
      "Nous ne livrons pas des templates. Nous forgeons des présences digitales sur-mesure — chaque ligne de code, chaque courbe, chaque balise pensée pour servir une marque et son classement.",
      "Petite équipe, exigence démesurée. Vous parlez directement aux personnes qui conçoivent et qui codent. Pas d'intermédiaire, pas de jargon — des résultats mesurables.",
    ],
    valuesTitle: 'Nos principes',
    values: [
      { title: 'Puissant', text: "Des sites qui marquent et qui performent — pas de décoration sans intention." },
      { title: 'Précis', text: 'Le détail est notre métier : du SEO technique au kerning des titres.' },
      { title: 'Premium', text: "Le soin d'une maison, l'efficacité d'un studio moderne." },
    ],
    stats: [
      { value: '22+', label: 'réalisations' },
      { value: '3', label: 'artisans' },
      { value: '7', label: 'secteurs' },
      { value: '2024', label: 'fondée en' },
    ],
  },
  team: {
    eyebrow: 'Les artisans',
    title: 'Les mains derrière le blason.',
    intro:
      'Trois. Volontairement. Ceux qui conçoivent et codent votre projet sont les trois à qui vous parlez.',
    pending: 'Portrait à venir',
    toggle: {
      label: 'Aperçu',
      aria: 'Aperçu couleur des portraits',
      modes: { mono: 'Mono', gold: 'Or', iridescent: 'Prisme', paper: 'Papier' },
    },
  },
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Tout savoir sur EAM',
    items: [
      {
        q: "Qu'est-ce que EAM ?",
        a: "EAM est une agence digitale créative fondée en 2024 par trois associés — Etame, Angoula et Mbosseu, dont l'agence tire son nom. EAM conçoit des sites web sur-mesure, des applications métier et des stratégies de référencement (SEO & GEO) pour des PME, des commerces et des porteurs de projets en France, au Maroc et en Afrique francophone.",
      },
      {
        q: 'Quels services propose EAM ?',
        a: "EAM réalise des sites vitrines et éditoriaux, des applications métier (dashboards, SaaS, PWA), du e-commerce, l'identité visuelle et le branding, ainsi que le référencement SEO et GEO.",
      },
      {
        q: "Qu'est-ce que le GEO (Generative Engine Optimization) ?",
        a: "Le GEO consiste à optimiser un site pour qu'il soit cité par les moteurs de réponse IA comme ChatGPT, Perplexity et les AI Overviews de Google. EAM l'intègre à chaque projet : contenu structuré, données structurées schema.org, fichier llms.txt et réponses factuelles directes.",
      },
      {
        q: 'Quelle est la différence entre le SEO et le GEO ?',
        a: "Le SEO (Search Engine Optimization) vise le classement d'un site dans les résultats des moteurs de recherche comme Google. Le GEO (Generative Engine Optimization) vise sa citation dans les réponses des moteurs IA — ChatGPT, Perplexity, AI Overviews. Les deux reposent sur le même socle : un site rapide, structuré et factuel. EAM travaille les deux sur chaque projet.",
      },
      {
        q: 'Comment un site peut-il être cité par ChatGPT ou Perplexity ?',
        a: "En rendant son contenu lisible et vérifiable par les moteurs de réponse : réponses factuelles directes, textes présents dans le HTML rendu côté serveur (lisibles sans JavaScript), données structurées schema.org, fichier llms.txt et pages rapides. C'est la méthode qu'EAM applique à chaque projet — la décision de citer restant, elle, propre à chaque moteur.",
      },
      {
        q: 'Combien coûte un site web avec EAM ?',
        a: "Chaque projet est sur-mesure ; le budget dépend du périmètre et des fonctionnalités. EAM établit un devis gratuit sous 24 à 48 heures après un premier échange.",
      },
      {
        q: 'Quels sont les délais pour obtenir un devis ?',
        a: "EAM répond sous 24 à 48 heures après un premier échange, avec un devis gratuit. Les délais de réalisation dépendent du périmètre de chaque projet et sont précisés dans ce devis.",
      },
      {
        q: 'EAM reprend-il des sites existants (refonte) ?',
        a: "Oui. La refonte fait partie des services d'EAM : reprise d'un site existant pour le reforger — design, base technique, performance et référencement — avec pour objectif un site plus rapide, plus propre et mieux classé.",
      },
      {
        q: 'Avec quelles technologies travaille EAM ?',
        a: 'EAM travaille principalement avec Next.js, React, Astro, TypeScript, Tailwind CSS, Supabase et PostgreSQL.',
      },
      {
        q: 'EAM travaille-t-il en français et en anglais ?',
        a: "Oui. EAM conçoit des sites bilingues ou multilingues et accompagne des clients francophones comme internationaux.",
      },
      {
        q: 'Comment contacter EAM ?',
        a: "Par e-mail à eam.agency@gmail.com, ou via le formulaire de la page Contact. Réponse sous 24 à 48 heures.",
      },
    ],
  },
  brandFaq: {
    eyebrow: 'Questions fréquentes',
    title: "L'agence, en toutes lettres",
    items: [
      {
        q: 'Que signifie le nom EAM ?',
        a: "EAM est l'acronyme des noms de ses trois fondateurs : Etame, Angoula et Mbosseu.",
      },
      {
        q: "Qui sont les fondateurs d'EAM ?",
        a: "EAM a été fondée en 2024 par trois associés : Eddy Etame, Raphaël Angoula et Brad Mbosseu. Tous trois sont ingénieurs — ce sont eux qui conçoivent et codent chaque projet de l'agence.",
      },
      {
        q: 'Quel est le lien entre EAM et Microdidact ?',
        a: "Avant de fonder EAM, les trois associés ont conçu et codé seize projets au sein de Microdidact, une agence de communication toulousaine (groupe Microdidac). Ces réalisations portent le badge « Sous Microdidact » dans le portfolio. EAM est une agence indépendante — Microdidact n'en est ni la maison mère ni une filiale.",
      },
      {
        q: "Pourquoi EAM ne compte-t-elle que trois personnes ?",
        a: "Par choix. À trois, les personnes qui conçoivent et codent votre projet sont exactement celles à qui vous parlez : pas d'intermédiaire, pas de perte d'information, une responsabilité directe sur le résultat.",
      },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Un projet à forger ?',
    lead: "Parlez-nous de votre marque, de vos objectifs et de vos délais. Nous revenons vers vous sous 24 à 48 heures avec une première piste.",
    emailLabel: 'Écrivez-nous',
    responseChip: 'Réponse sous 24–48 h',
    whoAnswers: 'Ceux qui vous répondent',
    copied: 'Copié ✓',
    form: {
      name: 'Nom',
      email: 'E-mail',
      company: 'Entreprise (optionnel)',
      message: 'Votre projet',
      submit: 'Envoyer le message',
      sending: 'Envoi…',
      success: 'Bien reçu. Nous revenons vers vous sous 24 à 48 h.',
      error: "L'envoi a échoué — réessayez, ou écrivez-nous directement.",
      namePlaceholder: 'Votre nom',
      emailPlaceholder: 'vous@exemple.com',
      messagePlaceholder: 'En quelques mots, votre projet…',
      note: "En envoyant ce message, votre logiciel e-mail s'ouvrira avec les informations pré-remplies.",
    },
  },
  work: {
    eyebrow: 'Réalisations',
    title: 'Le portfolio',
    subtitle: "Sites, applications et outils forgés pour des marques qui voulaient exister — vraiment — en ligne.",
    filterAll: 'Tout',
    microdidactBadge: 'Sous Microdidact',
    microdidactNote: "Réalisé sous Microdidact — agence de communication à Toulouse (groupe Microdidac), où l'équipe a forgé ces projets.",
    internalSectionTitle: 'Outils internes & confidentiels',
    internalNote: "Projets sous accord de confidentialité. Présentés sans visuel ni lien — détails sur demande.",
    enterWorld: 'Entrer',
  },
  caseStudy: {
    overview: 'Aperçu',
    problemLabel: 'Le défi',
    solutionLabel: 'Notre réponse',
    outcomeLabel: 'Le résultat',
    draftNote: 'Indicateurs en cours de validation client.',
    visitLabel: 'Voir le site en ligne',
    nextLabel: 'Projet suivant',
  },
  /** In-room labels for the immersive project rooms (consumed by the rooms surfaces; rundowns live in src/lib/rundowns.ts). */
  rooms: {
    projet: 'Le projet',
    travail: 'Notre travail',
    enter: 'Entrer',
    scrollHint: 'Défiler',
    visit: 'Voir le site en ligne',
    next: 'Projet suivant',
    back: 'Retour au registre',
  },
  microdidact: {
    meta: {
      title: 'Le monde Microdidact',
      description:
        "Avant le blason EAM : Microdidact, agence de communication à Toulouse, où l'équipe a forgé seize projets — restaurants, garages, commerces et outils métier.",
    },
    eyebrow: "Chapitre d'origine",
    title: 'Le monde Microdidact.',
    lead: "Avant le blason, il y a eu l'atelier. Chez Microdidact, agence de communication toulousaine, les trois artisans d'EAM ont forgé côte à côte les projets qui ont aiguisé leur métier.",
    logoAlt: 'Microdidact — agence de communication, Toulouse',
    scrollHint: 'Entrer',
    story: {
      eyebrow: 'La genèse',
      title: "Là où la main s'est faite.",
      paragraphs: [
        "Microdidact est une agence de communication installée à Toulouse. C'est entre ses murs que l'équipe d'EAM a appris à livrer : des restaurants aux garages, des commerces de quartier aux outils métier, chaque commande traitée comme une pièce unique.",
        "Ces réalisations portent la marque de cette époque — et déjà l'exigence qui définit EAM aujourd'hui : du sur-mesure, de la performance, et des sites pensés pour être trouvés.",
      ],
    },
    stats: {
      projects: 'projets forgés',
      sectors: "secteurs d'activité",
      city: "port d'attache",
      cityValue: 'Toulouse',
    },
    constellation: {
      eyebrow: 'La constellation',
      title: 'Les pièces du registre.',
      intro: 'Chaque projet mène à son étude de cas — le problème, la réponse, le résultat.',
    },
    cta: {
      title: "Le prochain chapitre s'écrit avec vous.",
      text: "L'exigence forgée chez Microdidact vit désormais sous le blason EAM. Parlez-nous de votre projet.",
      button: 'Démarrer un projet',
    },
    back: 'Retour au registre',
  },
  bcWorld: {
    meta: {
      title: 'Le monde Boxing Center',
      description:
        "Client direct d'EAM : le réseau Boxing Center à Toulouse — cinq salles, un site immersif par salle et la boutique en ligne officielle Box Plus. Marine, rouge et sueur.",
    },
    eyebrow: 'Client direct · Toulouse',
    title: 'Le monde Boxing Center.',
    lead: "Un blason marine et rouge, cinq salles, une seule discipline : le combat. Pour ce réseau toulousain, EAM forge un site immersif par salle — jamais clonés — et sa boutique en ligne officielle.",
    logoAlt: 'Boxing Center — réseau de salles de sports de combat, Toulouse',
    scrollHint: "Entrer dans l'arène",
    salles: {
      eyebrow: 'Chapitre I — Les cinq salles',
      title: 'Cinq salles. Cinq sites. Zéro duplication.',
      intro:
        "Un site immersif par salle, jamais cloné. Chaque salle du réseau porte son nom de quartier — chacune impose sa matière, son métal, sa typographie, sa 3D — sous le même blason marine et rouge.",
      caseCta: 'Étude de cas',
      items: [
        {
          name: 'Portet',
          place: 'Portet-sur-Garonne',
          line: "La salle amirale — 900 m² de boxe et de cross training, un ring poli en noir profond, argent et rouge de combat.",
        },
        {
          name: 'États-Unis',
          place: 'Toulouse — quartier des États-Unis',
          line: "Présentée comme la plus grande salle de sports de combat de France — un monolithe d'acier en 3D temps réel que l'on traverse.",
        },
        {
          name: 'Minimes',
          place: 'Toulouse — Les Minimes',
          line: "L'école du geste juste — anglaise, éducative et lady boxing, là où le club forme ses premières gardes.",
        },
        {
          name: 'St-Cyprien',
          place: 'Toulouse — Saint-Cyprien',
          line: "La dernière-née du réseau — thaï, grappling, hyrox : le laboratoire des disciplines qui montent.",
        },
        {
          name: 'Ramonville',
          place: 'Ramonville-Saint-Agne',
          line: "La cage et le plateau — MMA, préparation physique et camps d'entraînement au sud de la ville.",
        },
      ],
    },
    boutique: {
      eyebrow: 'Chapitre II — La boutique officielle',
      name: 'Box Plus',
      tag: 'Boutique officielle Boxing Center · Toulouse',
      line: "La boutique en ligne du réseau — abonnements, séances d'essai, coachings et matériel. Paiement Stripe, passerelle PrestaShop, catalogue synchronisé en continu avec Deciplus.",
      visit: 'Visiter la boutique',
    },
    stats: {
      eyebrow: 'Les faits',
      items: [
        { value: '5 + 1', label: 'cinq salles + la boutique en ligne' },
        { value: '3D', label: 'temps réel — Three.js' },
        { value: 'Zéro', label: 'duplication entre les salles' },
        { value: '100%', label: 'de la copie dans le DOM' },
      ],
    },
    close: {
      provenance:
        "Boxing Center est un client direct d'EAM — un site immersif par salle et la boutique en ligne officielle, forgés sous notre blason.",
      title: 'Votre marque mérite une arène.',
      text: "Cinq salles, cinq sites, une boutique, zéro duplication. Parlez-nous de votre projet — nous forgeons à cette échelle.",
      button: 'Démarrer un projet',
    },
    back: 'Retour au registre',
  },
  footer: {
    tagline: 'Nous forgeons des marques qui règnent.',
    madeBy: 'Forgé par EAM — Etame · Angoula · Mbosseu',
    rights: 'Tous droits réservés.',
    navTitle: 'Navigation',
    contactTitle: 'Contact',
    sitemap: 'Plan du site',
  },
  notFound: {
    title: 'Page introuvable',
    text: "Cette page s'est égarée hors du blason. Revenons en terrain connu.",
    cta: "Retour à l'accueil",
  },
  errorPage: {
    title: "Un incident à l'atelier.",
    text: "Quelque chose s'est brisé en cours de forge. Réessayez — ou revenez en terrain connu.",
    retry: 'Réessayer',
  },
  meta: {
    home: {
      title: 'EAM — Sites web sur-mesure, apps métier & SEO/GEO',
      description: "EAM conçoit sites web sur-mesure, applications métier et stratégies SEO & GEO pour PME et fondateurs. France, Maroc, Afrique francophone. Devis sous 48 h.",
    },
    work: {
      title: 'Réalisations — sites web & applications sur-mesure',
      // Count interpolated from the data source — never stale.
      description: `${publicProjects.length} réalisations : sites vitrines, e-commerce, SaaS et outils métier — chaque étude de cas expose le problème, la réponse et le résultat.`,
    },
    studio: {
      title: "L'atelier — trois fondateurs, une agence digitale",
      description: "EAM = Etame, Angoula, Mbosseu. Agence digitale fondée en 2024 : trois ingénieurs, une obsession — des sites rapides, trouvables et taillés sur-mesure.",
    },
    contact: {
      title: 'Contact — devis site web gratuit sous 24-48 h',
      description: "Démarrez un projet avec EAM. Devis gratuit sous 24 à 48h. Écrivez à eam.agency@gmail.com.",
    },
  },
}
