import Image from 'next/image'
import { PhoneFrame } from './PhoneFrame'

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
 * - With a phone capture (/thumbs/<slug>-m.jpg, a real 430×932 viewport): the
 *   capture inside a PhoneFrame. The window is 430/880, so 5.5% of the page
 *   is slack the card scrolls through — `[data-rail-thumb]` is the layer the
 *   drifts translate (the home rail from scrollLeft, the registre from the
 *   page scroll); at rest the capture sits at its true top.
 * - Without one (JCBO — pending while its domain answers a WordPress
 *   placeholder; any future project before its capture pass): the PORTRAIT
 *   POSTER, the same silhouette so rails and grids keep one height — the
 *   desktop capture's centre column framed on the brand stage (a 9/10 crop
 *   of the 16/10 capture keeps a centred hero headline whole and readable at
 *   card size), the initials as a ghost in the lower half.
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
  /** Phone capture (430×932 at 2x). */
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
          <div className="relative aspect-[430/880] overflow-hidden" style={{ background: stage }}>
            {/* The whole 430×932 capture, top-aligned — 5.5% taller than its
                window: the slack the drifts scroll through. */}
            <div data-rail-thumb className="absolute inset-x-0 top-0 aspect-[430/932] will-change-transform">
              <Image src={thumbM} alt={alt} fill sizes={sizes} className="object-cover object-top" />
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
