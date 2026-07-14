/**
 * Theme registry. Each theme is a palette defined in globals.css under a
 * matching [data-theme] block. "heraldic" is fully designed; the others are
 * alternate directions exposed through the floating ThemeSwitcher and refined
 * incrementally. Adding a theme = a new palette block + an entry here.
 */

export const THEME_IDS = ['heraldic', 'atelier', 'editorial', 'bold'] as const

export type ThemeId = (typeof THEME_IDS)[number]

export interface ThemeDef {
  id: ThemeId
  /** Short display name (FR). */
  name: string
  /** One-line vibe (FR). */
  tagline: string
  /** Light or dark — drives the Clair/Sombre grouping in the switcher. */
  mode: 'light' | 'dark'
  /** Swatch shown in the switcher: [background, accent, ink]. */
  swatch: [string, string, string]
}

export const themes: ThemeDef[] = [
  {
    id: 'heraldic',
    name: 'Heraldic Maison',
    tagline: 'Navy profond · or héraldique',
    mode: 'dark',
    swatch: ['#070D18', '#C9A96E', '#F5F0E8'],
  },
  {
    id: 'atelier',
    name: 'Precision Atelier',
    tagline: 'Acier · blueprint',
    mode: 'dark',
    swatch: ['#06090E', '#A9B7C4', '#E9EEF3'],
  },
  {
    id: 'editorial',
    name: 'Editorial',
    tagline: 'Papier · lumière',
    mode: 'light',
    swatch: ['#F4EFE6', '#8C6F3E', '#16110A'],
  },
  {
    id: 'bold',
    name: 'Bold Grotesk',
    tagline: 'Noir · contraste',
    mode: 'dark',
    swatch: ['#0A0A0A', '#C9A96E', '#FAFAF7'],
  },
]

export const defaultThemeId: ThemeId = 'heraldic'
export const THEME_STORAGE_KEY = 'eam-theme'

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && (THEME_IDS as readonly string[]).includes(value)
}
