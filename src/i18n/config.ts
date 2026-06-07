/**
 * i18n configuration — EAM is bilingual (French default + English).
 * Routing is locale-prefixed (`/fr/...`, `/en/...`) for clean hreflang + GEO.
 */

export const locales = ['fr', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fr'

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
}

/** OpenGraph locale codes. */
export const ogLocales: Record<Locale, string> = {
  fr: 'fr_FR',
  en: 'en_US',
}

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}
