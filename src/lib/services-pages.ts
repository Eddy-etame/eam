import type { Locale } from '@/i18n/config'

/**
 * The four commercial landing pages — the lead engine. Every line is
 * OUTCOME-LED (the client’s gain, not our identity) and truth-audited:
 * deliverables are what we actually ship, proofs are real case slugs with
 * captures, floors mirror dict.pricing. The `sujet` key prefills the contact
 * form. (Conversion audit 2026-07-16: these pages are the missing funnel.)
 */

type L = Record<Locale, string>

export interface ServicePage {
  slug: string
  sujet: string
  /** Index into dict.pricing.bands for the floor shown on the page. */
  bandIndex: number
  name: L
  /** Outcome-led H1 — what the CLIENT gets. */
  h1: L
  lead: L
  deliverables: { title: L; text: L }[]
  /** Existing case-study slugs shown as proof (must have thumbs). */
  proofSlugs: string[]
  proofsTitle: L
  faq: { q: L; a: L }[]
}

export const servicePages: ServicePage[] = [
  {
    slug: 'site-vitrine',
    sujet: 'site-vitrine',
    bandIndex: 0,
    name: { fr: 'Site vitrine sur-mesure', en: 'Bespoke showcase website' },
    h1: {
      fr: 'Un site qui transforme les visites en clients.',
      en: 'A website that turns visits into customers.',
    },
    lead: {
      fr: "Votre vitrine travaille jour et nuit : trouvée sur Google et citée par les IA, rapide sur mobile, et conçue pour amener le visiteur jusqu’au contact.",
      en: 'Your site works day and night: found on Google and cited by AI engines, fast on mobile, and built to walk visitors to your inbox.',
    },
    deliverables: [
      {
        title: { fr: 'Design sur-mesure', en: 'Bespoke design' },
        text: {
          fr: 'Jamais de template — une identité dessinée pour votre marque, du logo au pixel.',
          en: 'Never a template — an identity drawn for your brand, from logo to pixel.',
        },
      },
      {
        title: { fr: 'Rapide sur tous les téléphones', en: 'Fast on every phone' },
        text: {
          fr: "La majorité de vos clients arrivent sur mobile : le site est pensé d’abord pour eux.",
          en: 'Most of your customers arrive on mobile: the site is designed for them first.',
        },
      },
      {
        title: { fr: 'Trouvé sur Google et par les IA', en: 'Found on Google and by AI' },
        text: {
          fr: 'SEO technique, données structurées et fichier llms.txt — visible dans les recherches ET dans les réponses de ChatGPT ou Google.',
          en: 'Technical SEO, structured data and an llms.txt file — visible in searches AND in ChatGPT or Google answers.',
        },
      },
      {
        title: { fr: 'Conçu pour le contact', en: 'Built for contact' },
        text: {
          fr: "Chaque section guide vers l’appel, le message ou la réservation — pas de décoration sans intention.",
          en: 'Every section guides toward the call, the message or the booking — no decoration without intent.',
        },
      },
    ],
    proofSlugs: ['beldi-fusion', 'jcboyang-conseil', 'temps-dance'],
    proofsTitle: { fr: 'Des vitrines que nous avons livrées', en: 'Showcase sites we shipped' },
    faq: [
      {
        q: { fr: 'Combien coûte un site vitrine ?', en: 'How much does a showcase site cost?' },
        a: {
          fr: 'À partir de 2 000 € HT. Chaque projet reçoit un devis précis et gratuit sous 24 à 48 heures.',
          en: 'From €2,000 excl. VAT. Every project gets a precise, free quote within 24–48 hours.',
        },
      },
      {
        q: { fr: 'Combien de temps pour livrer ?', en: 'How long does delivery take?' },
        a: {
          fr: "Le délai dépend du périmètre — il est fixé dans le devis et tenu. Vous parlez directement aux trois ingénieurs qui construisent votre site.",
          en: 'Timelines depend on scope — set in the quote and kept. You speak directly to the three engineers building your site.',
        },
      },
      {
        q: { fr: 'Le site sera-t-il à moi ?', en: 'Will I own the site?' },
        a: {
          fr: 'Oui. Le design et le code vous appartiennent — pas d’abonnement captif, pas de plateforme propriétaire.',
          en: 'Yes. The design and the code are yours — no captive subscription, no proprietary platform.',
        },
      },
    ],
  },
  {
    slug: 'e-commerce',
    sujet: 'e-commerce',
    bandIndex: 2,
    name: { fr: 'E-commerce', en: 'E-commerce' },
    h1: {
      fr: 'Une boutique qui vend pendant que vous travaillez.',
      en: 'A store that sells while you work.',
    },
    lead: {
      fr: "Tunnel de commande sans friction, paiement fiable, catalogue synchronisé — comme Box Plus, la boutique officielle du réseau Boxing Center.",
      en: 'Frictionless checkout, reliable payments, a synced catalogue — like Box Plus, the official store we shipped for the Boxing Center network.',
    },
    deliverables: [
      {
        title: { fr: 'Tunnel de commande sans friction', en: 'Frictionless checkout' },
        text: {
          fr: 'Chaque étape supprimée est une vente gagnée — panier, paiement et confirmation pensés mobile d’abord.',
          en: 'Every removed step is a sale won — cart, payment and confirmation designed mobile-first.',
        },
      },
      {
        title: { fr: 'Paiement Stripe ou existant', en: 'Stripe or your existing stack' },
        text: {
          fr: 'Stripe, PrestaShop, solution en place : nous branchons la boutique sur votre réalité, pas l’inverse.',
          en: 'Stripe, PrestaShop or what you already run: we plug the store into your reality, not the reverse.',
        },
      },
      {
        title: { fr: 'Catalogue synchronisé', en: 'Synced catalogue' },
        text: {
          fr: 'Vos produits et plannings peuvent se mettre à jour tout seuls depuis vos outils métier.',
          en: 'Your products and schedules can update themselves from your business tools.',
        },
      },
      {
        title: { fr: 'Livraison intégrée', en: 'Delivery integrated' },
        text: {
          fr: 'Uber Eats, Deliveroo ou votre propre logistique — reliés proprement à la commande.',
          en: 'Uber Eats, Deliveroo or your own logistics — cleanly wired into the order flow.',
        },
      },
    ],
    proofSlugs: ['box-plus', 'mon-boum', 'la-brigade-mobile'],
    proofsTitle: { fr: 'Du commerce que nous avons livré', en: 'Commerce we shipped' },
    faq: [
      {
        q: { fr: 'Combien coûte une boutique en ligne ?', en: 'How much does an online store cost?' },
        a: {
          fr: 'À partir de 3 000 € HT selon le catalogue et les intégrations. Devis précis et gratuit sous 24 à 48 heures.',
          en: 'From €3,000 excl. VAT depending on catalogue and integrations. Precise, free quote within 24–48 hours.',
        },
      },
      {
        q: {
          fr: 'Puis-je garder mon système de caisse ou de gestion ?',
          en: 'Can I keep my POS or management system?',
        },
        a: {
          fr: "Dans la plupart des cas, oui : nous avons déjà relié une boutique à PrestaShop et à un logiciel de gestion de salles (Deciplus) sans rien casser.",
          en: 'In most cases, yes: we have already bridged a store to PrestaShop and to a gym-management system (Deciplus) without breaking anything.',
        },
      },
      {
        q: { fr: 'Qui gère la boutique ensuite ?', en: 'Who runs the store afterwards?' },
        a: {
          fr: 'Vous — elle est construite pour être administrée sans nous. Et nous restons joignables en direct si besoin.',
          en: 'You do — it is built to be run without us. And we stay directly reachable when needed.',
        },
      },
    ],
  },
  {
    slug: 'seo-geo',
    sujet: 'seo-geo',
    bandIndex: 3,
    name: { fr: 'SEO & GEO', en: 'SEO & GEO' },
    h1: {
      fr: 'Être trouvé sur Google — et cité par les IA.',
      en: 'Be found on Google — and cited by AI.',
    },
    lead: {
      fr: "Vos futurs clients cherchent sur Google et demandent à ChatGPT. Nous travaillons les deux : SEO technique ET visibilité IA, avec un rapport mensuel.",
      en: 'Your future customers search Google and ask ChatGPT. We work both: technical SEO AND visibility inside answer engines — with a monthly report.',
    },
    deliverables: [
      {
        title: { fr: 'SEO technique complet', en: 'Full technical SEO' },
        text: {
          fr: 'Vitesse, données structurées Schema.org, maillage, balises — le socle que Google mesure.',
          en: 'Speed, Schema.org structured data, internal linking, tags — the foundation Google measures.',
        },
      },
      {
        title: { fr: 'GEO — visibilité IA', en: 'GEO — AI visibility' },
        text: {
          fr: 'Contenu lisible par les moteurs de réponse, fichier llms.txt, réponses factuelles directes — la méthode appliquée à ce site même.',
          en: 'Answer-engine-readable content, an llms.txt file, direct factual answers — the method applied to this very site.',
        },
      },
      {
        title: { fr: 'SEO local', en: 'Local SEO' },
        text: {
          fr: "Être trouvé par les clients de votre ville et de votre quartier — la recherche qui remplit les carnets de commande.",
          en: 'Be found by customers in your city and neighbourhood — the searches that fill order books.',
        },
      },
      {
        title: { fr: 'Rapport mensuel — et preuves publiques', en: 'Monthly report — and public proof' },
        text: {
          fr: 'Ce qui a bougé, ce qui vient — et nos mesures de citation IA publiées sur la page Preuves, absences comprises.',
          en: 'What moved, what is next — and our AI-citation measurements published on the Proof page, misses included.',
        },
      },
    ],
    proofSlugs: ['kermhosting', 'beldi-fusion', 'marche-de-mo'],
    proofsTitle: { fr: 'Des sites construits SEO-first', en: 'Sites built SEO-first' },
    faq: [
      {
        q: { fr: "Qu’est-ce que le GEO exactement ?", en: 'What exactly is GEO?' },
        a: {
          fr: "Le GEO (Generative Engine Optimization) consiste à rendre votre site compréhensible et citable par les moteurs de réponse IA — ChatGPT, Perplexity, les AI Overviews de Google — en plus du référencement classique.",
          en: "GEO (Generative Engine Optimization) makes your site understandable and citable by AI answer engines — ChatGPT, Perplexity, Google’s AI Overviews — on top of classic SEO.",
        },
      },
      {
        q: { fr: 'Combien ça coûte ?', en: 'How much does it cost?' },
        a: {
          fr: "L’accompagnement mensuel démarre à 300 € HT par mois. L’audit initial de votre site est gratuit.",
          en: 'Monthly support starts at €300 excl. VAT per month. The initial audit of your site is free.',
        },
      },
      {
        q: { fr: 'En combien de temps voit-on des résultats ?', en: 'How fast are results visible?' },
        a: {
          fr: 'Le référencement est un travail de fond : les premiers mouvements se mesurent en semaines, les positions solides en mois. Le rapport mensuel montre chaque progression — nous ne promettons jamais de position.',
          en: 'Search is a long game: first movements show in weeks, solid rankings in months. The monthly report shows every step — we never promise a position.',
        },
      },
    ],
  },
  {
    slug: 'refonte',
    sujet: 'refonte',
    bandIndex: 0,
    name: { fr: 'Refonte & performance', en: 'Rebuild & performance' },
    h1: {
      fr: 'Votre site existant, forgé à neuf.',
      en: 'Your existing site, forged anew.',
    },
    lead: {
      fr: "Un site lent ou daté coûte des clients chaque semaine. Nous reconstruisons l’existant : plus rapide, plus propre, mieux classé — sans perdre ce qui fonctionne.",
      en: 'A slow or dated site costs you customers every week. We rebuild what exists: faster, cleaner, better ranked — without losing what works.',
    },
    deliverables: [
      {
        title: { fr: 'Audit complet offert', en: 'Full audit included' },
        text: {
          fr: 'Performance, SEO, visibilité IA, sécurité : nous radiographions votre site avant de toucher une ligne.',
          en: 'Performance, SEO, AI visibility, security: we X-ray your site before touching a line.',
        },
      },
      {
        title: { fr: 'Migration sans casse', en: 'Migration without breakage' },
        text: {
          fr: 'Vos contenus, vos positions Google et vos liens sont préservés — redirections soignées comprises.',
          en: 'Your content, Google rankings and links are preserved — careful redirects included.',
        },
      },
      {
        title: { fr: 'Performance mesurable', en: 'Measurable performance' },
        text: {
          fr: 'Un site reconstruit chez nous se mesure : vitesse, accessibilité, sécurité des en-têtes.',
          en: 'A site we rebuild is measurable: speed, accessibility, header security.',
        },
      },
      {
        title: { fr: 'Design remis au niveau', en: 'Design brought up to standard' },
        text: {
          fr: "L’image de votre entreprise cesse d’être en retard sur la qualité de votre travail.",
          en: 'Your company’s image stops lagging behind the quality of your work.',
        },
      },
    ],
    proofSlugs: ['la-brigade-mobile', 'boxing-center-portet', 'box-plus'],
    proofsTitle: { fr: 'Des refontes que nous avons menées', en: 'Rebuilds we carried out' },
    faq: [
      {
        q: { fr: 'Combien coûte une refonte ?', en: 'How much does a rebuild cost?' },
        a: {
          fr: "À partir de 2 000 € HT selon l’existant. L’audit initial est gratuit et vous appartient, même si nous ne travaillons pas ensemble.",
          en: 'From €2,000 excl. VAT depending on the existing site. The initial audit is free and yours to keep, even if we never work together.',
        },
      },
      {
        q: { fr: 'Vais-je perdre mon référencement ?', en: 'Will I lose my rankings?' },
        a: {
          fr: 'Non — la préservation du SEO est un critère de la refonte : inventaire des pages, redirections, données structurées reconstruites.',
          en: 'No — SEO preservation is a rebuild requirement: page inventory, redirects, structured data rebuilt.',
        },
      },
      {
        q: { fr: 'Mon site restera-t-il en ligne pendant la refonte ?', en: 'Will my site stay online during the rebuild?' },
        a: {
          fr: 'Oui. La refonte se construit à côté ; la bascule se fait quand tout est prêt, en quelques minutes.',
          en: 'Yes. The rebuild happens alongside; the switch takes minutes, once everything is ready.',
        },
      },
    ],
  },
]

export const getServicePage = (slug: string) => servicePages.find((s) => s.slug === slug)
