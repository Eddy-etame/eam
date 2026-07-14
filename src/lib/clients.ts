/**
 * Client brands for the "Trusted by" strip. Every entry maps to a PUBLIC
 * (non-NDA) project so the logo links to its case study. Logos are local
 * assets (public/logos) shown in their natural colours on light plaques —
 * the colourful badges (DecoShop, Pièces Auto) would vanish on dark otherwise.
 *
 * HelloPhone is intentionally omitted: its only project is internal/NDA.
 */
export interface Client {
  name: string
  /** Path under /public. */
  logo: string
  /** Public project slug — links to the case study. */
  slug: string
  /** SVG asset: serve as-is (skip the image optimiser). */
  vector?: boolean
}

export const clients: Client[] = [
  { name: 'ID SKILLZ', logo: '/logos/id-skillz.png', slug: 'id-skillz' },
  { name: "Marché de Mo'", logo: '/logos/marche-de-mo.png', slug: 'marche-de-mo' },
  { name: 'Mon Boum', logo: '/logos/mon-boum.png', slug: 'mon-boum' },
  { name: 'Pièces Auto Colomiers', logo: '/logos/pieces-auto-colomiers.png', slug: 'pieces-auto-colomiers' },
  { name: 'DecoShop', logo: '/logos/decoshop.svg', slug: 'decoshop-vitrine', vector: true },
]
