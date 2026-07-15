/**
 * Client brands for the "Trusted by" strip. Every entry maps to a PUBLIC
 * (non-NDA) page under /work — a case study, or a world door (Microdidact) —
 * so the logo links straight to it. Logos are local assets (public/logos)
 * shown in their natural colours on light plaques — the colourful badges
 * (DecoShop, Pièces Auto) would vanish on dark otherwise.
 *
 * Order alternates visual families (dark roundels, badges, wordmarks,
 * greens) so no two similar plaques ride side by side — including across
 * the marquee loop seam (last → first).
 *
 * HelloPhone is intentionally omitted: its only project is internal/NDA.
 * KermHosting and Drive Pneu have no usable mark: KermHosting's only brand
 * image is an AI photo banner (header is icon-font + text), and Drive Pneu's
 * sole logo is a white-on-dark wordmark that disappears on white plaques.
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
  { name: 'Boxing Center', logo: '/logos/boxing-center.png', slug: 'boxing-center' },
  { name: "Chicken Ben's", logo: '/logos/chicken-bens.png', slug: 'chicken-bens' },
  { name: 'JCBoyang Conseil', logo: '/logos/jcboyang-conseil.png', slug: 'jcboyang-conseil' },
  { name: "Marché de Mo'", logo: '/logos/marche-de-mo.png', slug: 'marche-de-mo' },
  { name: 'THE 911', logo: '/logos/the-911.svg', slug: 'the-911', vector: true },
  { name: 'La Brigade Mobile', logo: '/logos/la-brigade-mobile.png', slug: 'la-brigade-mobile' },
  { name: 'Mon Boum', logo: '/logos/mon-boum.png', slug: 'mon-boum' },
  { name: 'Beldi Fusion', logo: '/logos/beldi-fusion.png', slug: 'beldi-fusion' },
  { name: 'ID SKILLZ', logo: '/logos/id-skillz.png', slug: 'id-skillz' },
  { name: 'Temps Dance', logo: '/logos/temps-dance.png', slug: 'temps-dance' },
  { name: 'NYC Cookies Casablanca', logo: '/logos/nyc-cookies.png', slug: 'nyc-cookies' },
  { name: 'Un Rire Pour un Enfant', logo: '/logos/un-rire-pour-un-enfant.png', slug: 'un-rire-pour-un-enfant' },
  // Microdidact (provenance, not a client — and its multicolor wordmark loses
  // its white letters on white plaques) and Inlet (house product, no one
  // "chose us" there) are deliberately NOT in this strip: it is client trust.
  { name: 'Pièces Auto Colomiers', logo: '/logos/pieces-auto-colomiers.png', slug: 'pieces-auto-colomiers' },
  { name: 'DecoShop', logo: '/logos/decoshop.svg', slug: 'decoshop-vitrine', vector: true },
]
