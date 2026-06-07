import type { Locale } from '@/i18n/config'

/**
 * EAM — Central site configuration. Single source of truth for business facts.
 *
 * ┌── CONFIRMED (2026-06-07) ────────────────────────────────────────────────┐
 * │ • EAM = Etame · Angoula · Mbosseu — a team of 3 founders.                 │
 * │ • Email:  eam.agency@gmail.com  (temporary)                              │
 * │ • Domain: https://eam.vercel.app                                        │
 * │ • Languages: FR (default) + EN                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * ⚠️  TODO(client): anything marked `PLACEHOLDER` is NOT yet confirmed. Update
 *     the value and flip the related `confirmed` flag — schema, footer and the
 *     contact page all read from here, so nothing else needs editing.
 */
export const siteConfig = {
  name: 'EAM',
  /** The acronym is the founders' names. */
  founders: ['Etame', 'Angoula', 'Mbosseu'] as const,
  url: 'https://eam.vercel.app',
  email: 'eam.agency@gmail.com',

  /** ⚠️ PLACEHOLDER — confirm a public phone number (leave empty to hide). */
  phone: '',

  /**
   * ⚠️ Location is UNCONFIRMED. Most client projects are Toulouse-based, but EAM's
   * own HQ is not verified. While `confirmed` is false, schema emits a generic
   * Organization with `areaServed` only — no fabricated PostalAddress.
   */
  location: {
    confirmed: false,
    city: 'Toulouse',
    region: 'Occitanie',
    country: 'FR',
    areaServed: ['France', 'Maroc', 'Afrique francophone', 'International'],
  },

  /** ⚠️ PLACEHOLDER — no social profiles confirmed yet (empty = hidden). */
  social: {
    instagram: '',
    linkedin: '',
    x: '',
    github: '',
    behance: '',
  },

  founded: 2024,
  defaultLocale: 'fr' as Locale,
  locales: ['fr', 'en'] as Locale[],
} as const

export type SiteConfig = typeof siteConfig
