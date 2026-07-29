import type { Locale } from '@/i18n/config'

/**
 * CLIENT-APPROVED testimonials — sign-off confirmed by Eddy 2026-07-29
 * («validés par les clients»), drafts + grounding kept in
 * .research/testimonial-drafts-2026-07-16.md. DGCCRF red line: NOTHING enters
 * this file without the named client's recorded approval; the FR wording is
 * the approved text verbatim (EN is a faithful translation of it).
 * `slug` links each quote to its verifiable case study — a testimonial on this
 * site is a receipt with a name, never decoration.
 */
export interface Testimonial {
  slug: string
  org: string
  who: Record<Locale, string>
  quote: Record<Locale, string>
  /** Which service landing page carries this quote (matching proof). */
  sujet?: string
}

export const testimonials: Testimonial[] = [
  {
    slug: 'jcboyang-conseil',
    org: 'JCBO Conseil',
    who: { fr: 'M. Boyang — fondateur', en: 'M. Boyang — founder' },
    quote: {
      fr: 'EAM a transformé notre présence en ligne — le site porte enfin le niveau du cabinet, et les demandes arrivent par le site.',
      en: 'EAM transformed our online presence — the site finally carries the standing of the firm, and enquiries now come through it.',
    },
    sujet: 'site-vitrine',
  },
  {
    slug: 'boxing-center',
    org: 'Boxing Center',
    who: { fr: 'Direction du réseau — Toulouse', en: 'Network management — Toulouse' },
    quote: {
      fr: 'Cinq salles, une boutique en ligne, une seule équipe : EAM a construit notre écosystème digital comme on prépare un combat — sérieusement.',
      en: 'Five gyms, an online store, one team: EAM built our digital ecosystem the way you prepare for a fight — seriously.',
    },
    sujet: 'e-commerce',
  },
  {
    slug: 'la-brigade-mobile',
    org: 'La Brigade Mobile',
    who: { fr: 'Gérant — Toulouse', en: 'Owner — Toulouse' },
    quote: {
      fr: 'La refonte a tout changé : le site est rapide, clair, et nos clients prennent rendez-vous sans nous appeler.',
      en: 'The rebuild changed everything: the site is fast, clear, and our customers book without calling us.',
    },
    sujet: 'refonte',
  },
  {
    slug: 'mon-boum',
    org: 'Mon Boum',
    who: { fr: 'Direction — 10 restaurants, Toulouse', en: 'Management — 10 restaurants, Toulouse' },
    quote: {
      fr: 'Dix restaurants, une seule vitrine — commandes en ligne reliées, image enfin à la hauteur de l’enseigne.',
      en: 'Ten restaurants, one storefront — online ordering linked up, an image finally worthy of the brand.',
    },
  },
]

export const testimonialFor = (sujet: string): Testimonial | undefined =>
  testimonials.find((t) => t.sujet === sujet)
