/**
 * EAM — the three craftsmen behind the acronym (Etame · Angoula · Mbosseu).
 *
 * The About page renders these as grain-silhouette figures in fog (a Lusion-
 * inspired "team in the mist" stage). Portraits are transparent cutouts in
 * `public/team/`, recolored at runtime by the duotone color-mode toggle.
 *
 * ┌── DATA TO CONFIRM (client) ───────────────────────────────────────────────┐
 * │ • Eddy = Etame (confirmed). The glasses/graphic-tee portrait is BRAD       │
 * │   (corrected 2026-07-13). Raphael's own photo (the subway shot) is pending │
 * │   — drop it in public/team/raphael.webp + set image + status:'live'.        │
 * │ • first↔surname pairing (Raphael→Angoula, Brad→Mbosseu) is by E·A·M order  │
 * │   — CONFIRM.                                                               │
 * │ • role + manifesto are house-voice PLACEHOLDER copy — replace with each    │
 * │   founder's real discipline + words.                                       │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

export type TeamStatus = 'live' | 'pending'

export interface TeamMember {
  id: string
  first: string
  surname: string
  role: { fr: string; en: string }
  manifesto: { fr: string; en: string }
  image: string | null
  status: TeamStatus
}

export const team: TeamMember[] = [
  {
    id: 'eddy',
    first: 'Eddy',
    surname: 'Etame',
    role: { fr: 'Ingénieur', en: 'Engineer' },
    manifesto: {
      fr: 'Chaque milliseconde compte. Chaque pixel répond.',
      en: 'Every millisecond counts. Every pixel answers.',
    },
    image: '/team/eddy.webp',
    status: 'live',
  },
  {
    id: 'raphael',
    first: 'Raphaël',
    surname: 'Angoula',
    role: { fr: 'Ingénieur', en: 'Engineer' },
    manifesto: {
      fr: "La beauté qui ne convertit pas, c'est de la décoration. On n'en fait pas.",
      en: "Beauty that doesn't convert is decoration. We don't do decoration.",
    },
    image: '/team/raphael.webp',
    status: 'live',
  },
  {
    id: 'brad',
    first: 'Brad',
    surname: 'Mbosseu',
    role: { fr: 'Ingénieur', en: 'Engineer' },
    manifesto: {
      fr: 'On ne demande pas la première page. On la prend.',
      en: "We don't ask for page one. We take it.",
    },
    image: '/team/brad.webp',
    status: 'live',
  },
]
