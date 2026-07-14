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
    role: { fr: 'Développement & Ingénierie', en: 'Development & Engineering' },
    manifesto: {
      fr: 'Je forge le code comme une lame : léger, tranchant, sans une bavure.',
      en: 'I forge code like a blade — light, sharp, not one burr.',
    },
    image: '/team/eddy.webp',
    status: 'live',
  },
  {
    id: 'raphael',
    first: 'Raphaël',
    surname: 'Angoula',
    role: { fr: 'Design & Direction artistique', en: 'Design & Art Direction' },
    manifesto: {
      fr: 'Le beau qui ne vend pas est du gâchis. Je dessine pour convertir.',
      en: "Beauty that doesn't sell is waste. I design to convert.",
    },
    image: '/team/raphael.webp',
    status: 'live',
  },
  {
    id: 'brad',
    first: 'Brad',
    surname: 'Mbosseu',
    role: { fr: 'SEO & Stratégie', en: 'SEO & Strategy' },
    manifesto: {
      fr: "La première page ne se gagne pas au hasard. Elle se fabrique.",
      en: "Page one isn't won by luck. It's manufactured.",
    },
    image: '/team/brad.webp',
    status: 'live',
  },
]
