import type { Locale } from '@/i18n/config'

/**
 * Project taxonomy — split out of projects.ts so CLIENT components can import
 * the category labels without dragging the whole project registry (~1000
 * lines of case copy) into their JS chunk. Client code imports from HERE;
 * server code may keep using the re-exports in projects.ts.
 */

export type Localized<T = string> = Record<Locale, T>

export type ProjectCategory =
  | 'Restauration & F&B'
  | 'Services Automobiles'
  | 'Commerce & Services'
  | 'Corporate & Formation'
  | 'Tech & SaaS'
  | 'Culture & Associatif'
  | 'Agence Créative'
  | 'Sport & Bien-être'
  | 'Outil Interne'

export const categoryLabels: Record<ProjectCategory, Localized> = {
  'Restauration & F&B': { fr: 'Restauration & F&B', en: 'Restaurants & F&B' },
  'Services Automobiles': { fr: 'Services Automobiles', en: 'Automotive Services' },
  'Commerce & Services': { fr: 'Commerce & Services', en: 'Retail & Services' },
  'Corporate & Formation': { fr: 'Corporate & Formation', en: 'Corporate & Training' },
  'Tech & SaaS': { fr: 'Tech & SaaS', en: 'Tech & SaaS' },
  'Culture & Associatif': { fr: 'Culture & Associatif', en: 'Culture & Nonprofit' },
  'Agence Créative': { fr: 'Agence Créative', en: 'Creative Agency' },
  'Sport & Bien-être': { fr: 'Sport & Bien-être', en: 'Sport & Wellness' },
  'Outil Interne': { fr: 'Outil Interne', en: 'Internal Tool' },
}

export const categories: ProjectCategory[] = [
  'Restauration & F&B',
  'Services Automobiles',
  'Commerce & Services',
  'Corporate & Formation',
  'Tech & SaaS',
  'Culture & Associatif',
  'Agence Créative',
  'Sport & Bien-être',
  'Outil Interne',
]
