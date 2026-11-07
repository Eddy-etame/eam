import type { ReactNode } from 'react'

/**
 * CSS-drawn phone chrome — BrowserFrame's sibling for the phone-shaped
 * captures (/thumbs/<slug>-m.jpg: a real 430×932 viewport at 2x). Same
 * credibility language: a slim top bar carrying the bare domain in a centred
 * pill (the phone's island), no fake status bar, no fake clock. The media
 * area belongs to the children — give it the capture's ratio
 * (aspect-[430/932]) so the frame never squashes a screenshot.
 *
 * - Pure presentational, zero hooks — safe in Server and Client components.
 * - Corners, bar and pill scale with the device width (container units), so
 *   a 160px phone hanging off a desktop frame and a 320px one leading a phone
 *   screen read as the same object.
 * - No URL → a speaker slit instead of an empty pill; never a fake address.
 */
export function PhoneFrame({
  url,
  className = '',
  children,
}: {
  /** Live URL — '#', empty, or undefined means "no real address" (pill omitted). */
  url?: string
  className?: string
  children: ReactNode
}) {
  const domain =
    url && url !== '#'
      ? url
          .replace(/^[a-z][a-z0-9+.-]*:\/\//i, '')
          .replace(/^www\./i, '')
          .split(/[/?#]/)[0]
      : null

  return (
    <div className={`@container ${className}`}>
      <div
        className="overflow-hidden rounded-[clamp(18px,9cqi,30px)] border border-line"
        style={{ background: 'var(--c-deep)' }}
      >
        <div
          aria-hidden
          className="relative flex h-[clamp(22px,11cqi,30px)] items-center justify-center border-b border-line px-3"
          style={{ background: 'color-mix(in srgb, var(--c-surface) 92%, var(--c-ink) 8%)' }}
        >
          {domain ? (
            <span
              className="max-w-[92%] truncate rounded-full px-2.5 py-0.5 font-[family-name:var(--font-mono),ui-monospace,monospace] text-[clamp(8px,3.6cqi,10px)] leading-none tracking-[0.08em] text-faint"
              style={{ background: 'color-mix(in srgb, var(--c-surface) 55%, transparent)' }}
            >
              {domain}
            </span>
          ) : (
            <span className="h-1 w-[22%] rounded-full bg-faint/60" />
          )}
        </div>
        {/* Media area — children own their aspect ratio */}
        <div className="relative">{children}</div>
      </div>
    </div>
  )
}
