import type { Locale } from '@/i18n/config'

/**
 * The ONLY strings the client-side error surfaces (error.tsx / not-found.tsx)
 * are allowed to know. Those boundaries are bundled into every route's shared
 * client JS — importing getDictionary there shipped BOTH full dictionaries
 * (and, through fr.ts → publicProjects, the entire project registry) to every
 * visitor (~50 kB gz, caught by the 2026-07-15 build audit).
 *
 * Keep the copy in sync with the `notFound` / `errorPage` blocks in
 * dictionaries/fr.ts + en.ts — these four screens are the one sanctioned
 * duplication in the i18n system.
 */
export const fallbackStrings: Record<
  Locale,
  {
    notFound: { title: string; text: string; cta: string }
    errorPage: { title: string; text: string; retry: string }
  }
> = {
  fr: {
    notFound: {
      title: 'Page introuvable',
      text: "Cette page s'est égarée hors du blason. Revenons en terrain connu.",
      cta: "Retour à l'accueil",
    },
    errorPage: {
      title: "Un incident à l'atelier.",
      text: "Quelque chose s'est brisé en cours de forge. Réessayez — ou revenez en terrain connu.",
      retry: 'Réessayer',
    },
  },
  en: {
    notFound: {
      title: 'Page not found',
      text: "This page wandered off the crest. Let's head back to familiar ground.",
      cta: 'Back home',
    },
    errorPage: {
      title: 'A mishap at the atelier.',
      text: 'Something broke mid-forge. Try again — or head back to familiar ground.',
      retry: 'Try again',
    },
  },
}
