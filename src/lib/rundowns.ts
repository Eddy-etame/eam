import type { Locale } from '@/i18n/config'

/**
 * In-room rundowns for the immersive project rooms — «Le projet» / «Notre
 * travail», drafted from live fetches of each site (2026-07-14) so every line
 * is grounded in what the shipped product actually does. Keyed by slug.
 */
export interface Rundown {
  projet: Record<Locale, string>
  travail: Record<Locale, string>
}

export const rundowns: Record<string, Rundown> = {
  'kermhosting': {
    projet: {
      fr: "KermHosting, plateforme d'hébergement Node.js pensée pour les développeurs africains : des serveurs déployés en une minute, payables en FCFA via Orange Money, MTN Mobile Money ou PayPal. Il fallait une vitrine et un produit à la hauteur de l'ambition.",
      en: "KermHosting, a Node.js hosting platform built for African developers: servers deployed in a minute, payable in FCFA via Orange Money, MTN Mobile Money or PayPal. It needed a storefront and product worthy of that ambition.",
    },
    travail: {
      fr: "Nous avons forgé l'expérience complète : page de tarifs à quatre formules (Free à Pro), système de coins maison (1 coin = 5 FCFA), paiements mobiles intégrés via Fapshi, et un dashboard de gestion des serveurs avec templates de bots et historique des transactions.",
      en: "We forged the full experience: a four-tier pricing page (Free to Pro), a bespoke coin system (1 coin = 5 FCFA), mobile payments wired through Fapshi, and a server-management dashboard with bot templates and transaction history.",
    },
  },
  'inlet': {
    projet: {
      fr: "Inlet, un backend de formulaires auto-hébergé : toutes les soumissions de tous vos sites, réunies dans un seul tableau de bord — sans SMTP, sans compromis sur la confidentialité.",
      en: "Inlet, a self-hosted form backend: every submission from every site, gathered into a single dashboard — no SMTP, no compromise on privacy.",
    },
    travail: {
      fr: "Nous avons forgé la landing SaaS et le produit : dashboard multi-sites, filtrage anti-spam par IA et preuve de travail, e-mails de réponse en marque blanche, export CSV et docs d'intégration pour Astro, Next.js, Nuxt, Vue et Svelte.",
      en: "We forged the SaaS landing and the product itself: a multi-site dashboard, AI and proof-of-work spam filtering, white-label auto-reply emails, CSV export, and integration docs for Astro, Next.js, Nuxt, Vue and Svelte.",
    },
  },
  'jcboyang-conseil': {
    projet: {
      fr: "JCBO Conseil, le cabinet de Jean-Christophe Boyang-Tsang : trente ans de terrain commercial mis au service des TPE-PME. Il fallait une vitrine à la hauteur de la méthode — Vendeur Attitude™, séminaires Mindset, transformation des organisations.",
      en: "JCBO Conseil is Jean-Christophe Boyang-Tsang's consulting practice: thirty years of commercial fieldcraft for SMEs. It needed a stage worthy of the method — Vendeur Attitude™, Mindset seminars, organizational transformation.",
    },
    travail: {
      fr: "Nous avons forgé un site complet et structuré : parcours méthode et services, programme Vendeur Attitude™ à trois niveaux de certification, galerie de séminaires, témoignages clients, actualités, ressources — le tout relié à une prise de rendez-vous en ligne.",
      en: "We forged a full, structured site: method and services journeys, the three-level Vendeur Attitude™ certification program, seminar galleries, client testimonials, news and resources — all wired to online booking.",
    },
  },
  'la-brigade-mobile': {
    projet: {
      fr: "La Brigade Mobile, atelier toulousain de réparation express — écrans, batteries, microsoudure, désoxydation — et d'appareils reconditionnés, promesse affichée : réparé en 30 minutes. Il lui fallait une vitrine à la hauteur de cette cadence, capable de transformer une panne en rendez-vous.",
      en: "La Brigade Mobile is a Toulouse repair atelier — screens, batteries, micro-soldering, water-damage recovery — plus refurbished devices, with a bold promise: fixed in 30 minutes. It needed a storefront that matched that pace and turned a breakdown into a booking.",
    },
    travail: {
      fr: "Nous avons forgé un site complet aux accents bleu-sarcelle : catalogue de réparations par appareil et par panne, boutique de reconditionné, et surtout un devis en ligne en huit étapes — de la marque au créneau, boutique, domicile ou envoi postal — avec estimation de prix instantanée et dashboard admin en coulisses.",
      en: "We forged a full site in clean blue-teal: a repair catalog by device and by fault, a refurbished-device shop, and above all an eight-step online quote flow — from brand to time slot, in-store, home pickup or postal — with instant price estimates and an admin dashboard behind the counter.",
    },
  },
  'mon-boum': {
    projet: {
      fr: "Mon Boum, institution du street-food halal toulousain depuis 2004 : quatre enseignes, dix restaurants, et une notoriété qui déborde de TikTok. Il fallait une vitrine à la hauteur du phénomène.",
      en: "Mon Boum, a Toulouse halal street-food institution since 2004: four brands, ten restaurants, and a TikTok following to match. It needed a showcase as loud as the phenomenon.",
    },
    travail: {
      fr: "Nous avons forgé un site à l'énergie brute de la marque : quatre univers de marque distincts, commande en livraison reliée à Deliveroo, carte des dix adresses avec drive, promos et section franchise — typographie musclée, sections color-block, zéro temps mort.",
      en: "We forged a site with the brand's raw energy: four distinct brand universes, Deliveroo-linked delivery ordering, ten drive-through locations, live promotions and a franchise section — bold typography, color-blocked layouts, no dead air.",
    },
  },
  'beldi-fusion': {
    projet: {
      fr: "Beldi Fusion, table marocaine du quartier Patte d'Oie à Toulouse, cuisine « beldi » — faite maison, chaque jour. Il lui fallait une vitrine à la hauteur de sa générosité, et un pont direct vers la commande en ligne.",
      en: "Beldi Fusion, a Moroccan table in Toulouse's Patte d'Oie district serving home-style 'beldi' cooking made fresh daily. It needed a showcase worthy of its generosity — and a direct bridge to online ordering.",
    },
    travail: {
      fr: "Nous avons forgé une identité épurée aux accents marocains — illustrations, chiffres arabes, tons de terre — autour d'une carte saisonnière, d'une galerie de coulisses, des avis clients et de la commande en ligne reliée à Uber Eats et Deliveroo.",
      en: "We forged a clean identity with Moroccan accents — illustrations, Arabic numerals, earth tones — built around a seasonal menu, a behind-the-scenes gallery, customer reviews, and online ordering wired to Uber Eats and Deliveroo.",
    },
  },
  'the-911': {
    projet: {
      fr: "The 911, c'est le sandwich coupable : une enseigne toulousaine de burgers halal au concept scène de crime, deux adresses, ouverte jusqu'à 2h du matin. Il lui fallait un site à la hauteur de son insolence.",
      en: "The 911 is the guilty sandwich: a Toulouse halal burger joint with a crime-scene concept, two locations, open until 2 AM. It needed a site as bold as its attitude.",
    },
    travail: {
      fr: "Nous avons forgé un univers noir et policier — carte de 20+ suspects présentés comme des pièces à conviction, best-sellers en vitrine, commande reliée à Uber Eats et Deliveroo, avis Google et double adresse avec horaires.",
      en: "We forged a dark, police-noir universe — a 20+ item menu styled as criminal evidence, best-sellers on display, ordering wired to Uber Eats and Deliveroo, Google reviews and dual locations with hours.",
    },
  },
  'chicken-bens': {
    projet: {
      fr: "Chicken Ben's, c'est le poulet frit halal fait maison de Colomiers — du frais, du croustillant, monté minute. Il lui fallait une vitrine à la hauteur de la friture : appétissante, locale, immédiate.",
      en: "Chicken Ben's is Colomiers' homemade halal fried chicken — fresh, crispy, made to order. It needed a storefront as appetizing as the fryer: local, warm, immediate.",
    },
    travail: {
      fr: "Nous avons forgé un site chaud et gourmand : menu complet par catégories, commande en ligne reliée à Uber Eats et Deliveroo, avis clients, FAQ et mascotte animée — le tout ancré dans Colomiers, de la carte Google Maps au formulaire de contact.",
      en: "We forged a mouth-watering site: full categorized menu, online ordering wired to Uber Eats and Deliveroo, customer reviews, FAQ and an animated mascot — all rooted in Colomiers, from the Google Maps embed to the contact form.",
    },
  },
  'nyc-cookies': {
    projet: {
      fr: "NYC Cookies, c'est Manhattan qui débarque à Casablanca : des cookies artisanaux baptisés Soho, Harlem ou Times Square, servis aux gourmands comme aux cafés et hôtels de la ville. Il fallait une vitrine à la hauteur du mythe.",
      en: "NYC Cookies brings Manhattan to Casablanca: artisanal cookies named Soho, Harlem or Times Square, served to sweet tooths and to the city's cafés and hotels alike. The legend needed a storefront to match.",
    },
    travail: {
      fr: "Nous avons forgé une vitrine vibrante et gourmande : collection signature mise en scène, espace pro B2B avec commande et rappels WhatsApp, feed Instagram intégré, FAQ et contact — le tout dans une esthétique new-yorkaise taillée pour l'écran.",
      en: "We forged a vibrant, appetite-first showcase: a staged signature collection, a B2B pro portal with ordering and WhatsApp reminders, an embedded Instagram feed, FAQ and contact — all wrapped in a screen-ready New York aesthetic.",
    },
  },
  'marche-de-mo': {
    projet: {
      fr: "Le plus grand supermarché ethnique d'Occitanie méritait mieux qu'une simple fiche Google : 12 rayons, 20 000 références et des saveurs de quatre continents réclamaient une vitrine à leur mesure.",
      en: "The largest ethnic supermarket in Occitanie deserved more than a Google listing: 12 departments, 20,000 references and flavours from four continents called for a storefront worthy of them.",
    },
    travail: {
      fr: "Nous avons forgé un site complet aux accents verts et généreux : catalogue par rayons filtrable par région du monde, promotions hebdomadaires, programme de fidélité, recettes du monde et espaces recrutement et franchise — le tout pensé mobile et taillé pour le référencement local toulousain.",
      en: "We forged a full site in bold green tones: a department catalogue filterable by world region, weekly promotions, a loyalty programme, world recipes, plus recruitment and franchise spaces — mobile-first and tuned for local Toulouse SEO.",
    },
  },
  'pieces-auto-colomiers': {
    projet: {
      fr: "Pièces Auto Colomiers, spécialiste de la pièce neuve multi-marques dans l'Ouest toulousain, avait besoin d'une vitrine à la hauteur de son comptoir : claire, rapide, faite pour générer des devis.",
      en: "Pièces Auto Colomiers, a multi-brand new-parts specialist west of Toulouse, needed a storefront worthy of its counter: clear, fast, built to generate quotes.",
    },
    travail: {
      fr: "Nous avons forgé un catalogue de 47 catégories avec sélecteur véhicule, un parcours devis 24 h relié à WhatsApp et au téléphone, et intégré retrait en boutique, expédition Mondial Relay, avis Google et FAQ — le tout dans un design net, signé aux couleurs de l'atelier.",
      en: "We forged a 47-category catalog with a vehicle selector, a 24-hour quote flow wired to WhatsApp and phone, plus in-store pickup, Mondial Relay shipping, Google reviews and FAQ — all in a clean, sharply branded design.",
    },
  },
  'drive-pneu': {
    projet: {
      fr: "Drive Pneu, garage auto et spécialiste du pneu à Plaisance-du-Touch, avait besoin d'une vitrine à la hauteur de son atelier : locale, rassurante, taillée pour convertir l'automobiliste pressé.",
      en: "Drive Pneu, an auto garage and tire specialist in Plaisance-du-Touch, needed a storefront worthy of its workshop: local, reassuring, built to convert drivers in a hurry.",
    },
    travail: {
      fr: "Un site vitrine forgé pour l'appel et le devis : CTA d'appel direct, formulaire de demande en ligne, catalogue de prestations (pneumatiques, mécanique, diagnostic électronique), avis clients datés et copy SEO local ciblant Tournefeuille, Colomiers et tout l'ouest toulousain.",
      en: "A showcase site forged for the call and the quote: direct-call CTA, online request form, a full services catalog (tires, mechanics, electronic diagnostics), dated customer reviews and local SEO copy targeting Tournefeuille, Colomiers and the whole west of Toulouse.",
    },
  },
  'c-chez-toit': {
    projet: {
      fr: "C Chez Toît, artisan couvreur-nettoyeur de la région toulousaine, avait besoin d'une vitrine à la hauteur de ses toits : claire, locale, et qui transforme le visiteur en devis.",
      en: "C Chez Toît, a roof-cleaning and roofing craftsman serving the Toulouse region, needed a storefront worthy of its rooftops: clear, local, and built to turn visitors into quote requests.",
    },
    travail: {
      fr: "Nous avons forgé un site complet — catalogue de six prestations, parcours devis gratuit en quatre étapes, témoignages clients — et taillé plus de douze pages de zones d'intervention pour ancrer le référencement local autour de Toulouse.",
      en: "We forged a complete site — a six-service catalog, a four-step free-quote journey, client testimonials — and carved out twelve-plus service-area pages to anchor local SEO across greater Toulouse.",
    },
  },
  'decoshop-vitrine': {
    projet: {
      fr: "DecoShop, maison toulousaine du meuble et du home staging, habille les intérieurs des particuliers comme les biens des investisseurs LMNP. Il lui fallait une vitrine à la hauteur de ses ambiances.",
      en: "DecoShop, a Toulouse furniture and home-staging house, dresses private interiors and LMNP investors' rentals alike. It needed a showcase worthy of its rooms.",
    },
    travail: {
      fr: "Nous avons forgé une vitrine épurée : collections présentées en ambiances immersives (salon, chambre, dressing…), pack investisseur LMNP clé en main, vidéos TikTok intégrées et prise de contact directe, avis Google en première page.",
      en: "We forged a clean, atmospheric showcase: collections staged as immersive room vignettes (living, bedroom, dressing…), a turnkey LMNP investor pack, embedded TikTok videos, and direct contact with Google reviews front and center.",
    },
  },
  'temps-dance': {
    projet: {
      fr: "Temps Dance, école de danse à Tournefeuille, forme petits et grands — de l'éveil à 3 ans au aerial silk — dans une ambiance familiale. Il lui fallait une vitrine à la hauteur de ses quatorze disciplines.",
      en: "Temps Dance, a dance school in Tournefeuille, trains kids and adults alike — from age-3 movement classes to aerial silk — in a family atmosphere. Its fourteen disciplines deserved a showcase to match.",
    },
    travail: {
      fr: "Nous avons forgé un site complet et lisible : catalogue de cours détaillé, profils des professeurs, planning et tarifs, livre d'or, albums photos et formulaire de contact — tout ce qu'un élève cherche, à portée de clic.",
      en: "We forged a complete, legible site: a detailed course catalog, teacher profiles, schedule and pricing, a guestbook of testimonials, photo albums and a contact form — everything a student looks for, one click away.",
    },
  },
  'un-rire-pour-un-enfant': {
    projet: {
      fr: "Une association solidaire qui nourrit enfants et étudiants dans le besoin — il lui fallait plus qu'une vitrine : un outil de terrain pour orchestrer ses distributions alimentaires et fédérer ses bénévoles.",
      en: "A solidarity nonprofit feeding children and students in need — it needed more than a brochure site: a field tool to orchestrate its food distributions and rally its volunteers.",
    },
    travail: {
      fr: "Nous avons forgé une application web complète, installable comme une app mobile : inscription aux distributions de repas en temps réel, page de dons, messagerie avec les responsables, blog et tableau de bord admin pour piloter distributions et bénévoles.",
      en: "We forged a full web app, installable like a mobile app: real-time sign-up for meal distributions, a donation page, direct messaging with organizers, a blog, and an admin dashboard to run distributions and manage volunteers.",
    },
  },
  'id-skillz': {
    projet: {
      fr: "ID SKILLZ, agence créative entre Paris et Colomiers — web, branding, vidéo, drone et 3D architecturale — avait besoin d'une vitrine à la hauteur de son savoir-faire.",
      en: "ID SKILLZ, a French creative agency spanning Paris and Colomiers — web, branding, video, drone and architectural 3D — needed a showcase worthy of its craft.",
    },
    travail: {
      fr: "Un site one-page à l'esthétique tech affirmée (« SYS.STATUS: ONLINE ») : galerie de réalisations vidéo et 3D, méthode en six étapes, avis Google 5.0/5 intégrés et formulaire de contact — le tout forgé pour convertir.",
      en: "A one-page site with a bold tech aesthetic (\"SYS.STATUS: ONLINE\"): a gallery of video and 3D work, a six-step method section, embedded 5.0/5 Google reviews and a contact form — all forged to convert.",
    },
  },
}
