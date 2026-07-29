/**
 * ?sujet= → human label, split out of services-pages.ts so CLIENT components
 * (ContactForm) can resolve the prefill without dragging all 15 KB of
 * landing-page copy into their chunk — same doctrine as taxonomy.ts.
 * KEEP IN SYNC with servicePages[].sujet/name and the extras used by the
 * Radiographie / application / identité entry points.
 */
export const sujetLabels: Record<string, { fr: string; en: string }> = {
  'site-vitrine': { fr: 'Site vitrine sur-mesure', en: 'Bespoke showcase website' },
  'e-commerce': { fr: 'E-commerce', en: 'E-commerce' },
  'seo-geo': { fr: 'SEO & GEO', en: 'SEO & GEO' },
  refonte: { fr: 'Refonte & performance', en: 'Rebuild & performance' },
  application: { fr: 'Application métier / SaaS', en: 'Business application / SaaS' },
  identite: { fr: 'Identité & design', en: 'Brand & design' },
  radiographie: {
    fr: 'Radiographie gratuite\nAdresse de mon site : ',
    en: 'Free website X-ray\nMy site address: ',
  },
}
