import type { Locale } from '@/i18n/config'
import { fr } from './fr'
import { en } from './en'

/** Canonical dictionary shape, derived from the French source. */
export type Dictionary = typeof fr

// The Record assignment type-checks `en` against the canonical shape: if a key
// is missing or mistyped in en.ts, this line fails to compile.
const dictionaries: Record<Locale, Dictionary> = { fr, en }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.fr
}
