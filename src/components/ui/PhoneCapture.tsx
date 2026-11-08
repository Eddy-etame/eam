import Image from 'next/image'
import { PhoneFrame } from './PhoneFrame'
import captures from '@/lib/captures.json'

const PHONE_W = 860

/** Height of a phone capture at 2x, from the freshness manifest
 *  (src/lib/captures.json, kept by scripts/check-captures.mjs). One screen —
 *  1864 — when the slug is not registered yet. */
function phoneHeight(src: string): number {
  const m = /\/thumbs\/([a-z0-9-]+)-m\.jpg$/.exec(src)
  const entry = m ? (captures as Record<string, { m?: number[] }>)[m[1]] : undefined
  return entry?.m?.[1] ?? 1864
}

function initials(name: string): string {
  return name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

/**
 * The phone-sized view of a shipped site — what every card shows below `sm`
 * (2026-11-08), in the home rail, the registre's two-up grid and the service
 * pages' proofs. Pure presentational, zero hooks.
 *
 * - With a phone capture (/thumbs/<slug>-m.jpg: 860 px wide, one to two and a
 *   half screens tall, walked from the top): the capture inside a PhoneFrame,
 *   drawn at its real ratio as the `[data-rail-thumb]` layer, behind a window
 *   of 430/880 — the first screen. Whatever stands below the window is the
 *   page the drifts scroll through: the home rail from scrollLeft, and on its
 *   own when a card is the centred one, the registre from the page scroll. At
 *   rest the capture sits at its true top.
 * - Without one (any project before its capture pass): the PORTRAIT POSTER,
 *   the same silhouette so rails and grids keep one height — the desktop
 *   capture's centre column framed on the brand stage (a 9/10 crop of the
 *   16/10 capture keeps a centred hero headline whole and readable at card
 *   size), the initials as a ghost in the lower half.
 * - No chips over the capture: on a phone the site's own header owns the top
 *   edge, so the trade and the year belong to the card's caption.
 */
export function PhoneCapture({
  name,
  url,
  color,
  thumb,
  thumbM,
  alt,
  sizes = '62vw',
}: {
  name: string
  /** Live URL — '#', empty, or undefined means "no real address" (pill omitted). */
  url?: string
  /** Brand hex — the stage behind the capture and the poster's gradient. */
  color: string
  /** Desktop capture (16/10) — framed in the poster when no phone twin exists. */
  thumb?: string
  /** Phone capture (860 px wide at 2x). */
  thumbM?: string
  alt: string
  /** next/image `sizes` for the phone capture — the card's width on phone screens. */
  sizes?: string
}) {
  const stage = `linear-gradient(135deg, ${color}, var(--c-navy) 82%)`

  if (thumbM) {
    return (
      <div data-rail-media="phone">
        <PhoneFrame url={url && url !== '#' ? url : undefined}>
          <div data-rail-window className="relative aspect-[430/880] overflow-hidden" style={{ background: stage }}>
            {/* The whole capture at its real ratio, top-aligned — everything
                below the window is the slack the drifts scroll through. */}
            <div data-rail-thumb className="absolute inset-x-0 top-0 will-change-transform">
              <Image
                src={thumbM}
                alt={alt}
                width={PHONE_W}
                height={phoneHeight(thumbM)}
                sizes={sizes}
                className="block h-auto w-full"
              />
            </div>
          </div>
        </PhoneFrame>
      </div>
    )
  }

  return (
    <div data-rail-media="poster" className="@container">
      <div
        className="relative aspect-[430/880] overflow-hidden rounded-[clamp(18px,9cqi,30px)] border border-line"
        style={{ background: `linear-gradient(165deg, ${color} 0%, var(--c-navy) 58%, var(--c-deep) 100%)` }}
      >
        <span
          aria-hidden
          className="absolute -bottom-[0.16em] -left-[0.04em] font-display text-[clamp(6rem,62cqi,12rem)] leading-none text-white/[0.06] select-none"
        >
          {initials(name)}
        </span>
        {thumb && (
          <span className="absolute inset-x-[8%] top-[8%] block aspect-[9/10] overflow-hidden rounded-md border border-white/10 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.85)]">
            <Image src={thumb} alt={alt} fill sizes="54vw" className="object-cover object-center" />
          </span>
        )}
      </div>
    </div>
  )
}
