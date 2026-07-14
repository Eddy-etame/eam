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
        q: 'Que signifie le nom EAM ?',
        a: "EAM est l'acronyme des noms de ses trois fondateurs : Etame, Angoula et Mbosseu.",
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
        q: 'Combien coûte un site web avec EAM ?',
        a: "Chaque projet est sur-mesure ; le budget dépend du périmètre et des fonctionnalités. EAM établit un devis gratuit sous 24 à 48 heures après un premier échange.",
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
    internalSectionTitle: 'Outils internes & confidentiels',
    internalNote: "Projets sous accord de confidentialité. Présentés sans visuel ni lien — détails sur demande.",
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
      title: 'EAM — Agence digitale créative',
      description: "Agence digitale créative fondée par trois artisans. Sites sur-mesure, applications métier, SEO & GEO. France, Maroc & Afrique francophone.",
    },
    work: {
      title: 'Réalisations',
      description: "Le portfolio d'EAM : sites web, applications métier et outils sur-mesure forgés pour des marques en France, au Maroc et en Afrique.",
    },
    studio: {
      title: "L'atelier",
      description: "EAM, agence digitale créative fondée en 2024 par Etame, Angoula et Mbosseu. Trois artisans, une obsession du détail et du classement.",
    },
    contact: {
      title: 'Contact',
      description: "Démarrez un projet avec EAM. Devis gratuit sous 24 à 48h. Écrivez à eam.agency@gmail.com.",
    },
  },
}
