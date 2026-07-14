import type { ReactNode } from 'react'

/**
 * Minimal CSS-drawn browser chrome — the credibility frame. A slim top bar
 * (traffic dots + a readonly address pill in JetBrains mono) wraps any
 * imagery passed as children, signalling "this is a real, shipped site".
 *
 * - Pure presentational, zero hooks — safe in Server and Client components.
 * - The pill shows the bare domain (protocol/www stripped); when no real URL
 *   exists the pill is omitted entirely — dots only, no fake address.
 * - Mobile: the bar shrinks to dots only (the pill hides below `sm`).
 * - Aspect discipline: apply aspect ratios to the media area passed as
 *   children, NOT to this frame — the bar adds its own height on top so
 *   grids keep their rhythm from the media, and rows align because every
 *   frame's bar is the same height.
 */
export function BrowserFrame({
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
    <div className={`overflow-hidden rounded-lg border border-line ${className}`}>
      {/* Chrome bar — surface tone lifted a touch so it reads in every palette */}
      <div
        aria-hidden
        className="relative flex h-6 items-center border-b border-line px-3 sm:h-9"
        style={{ background: 'color-mix(in srgb, var(--c-surface) 92%, var(--c-ink) 8%)' }}
      >
        <span className="flex shrink-0 gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-faint" />
          <span className="h-1.5 w-1.5 rounded-full bg-faint" />
          <span className="h-1.5 w-1.5 rounded-full bg-faint" />
        </span>
        {domain && (
          <span className="pointer-events-none absolute inset-x-0 hidden justify-center sm:flex">
            <span
              className="max-w-[60%] truncate rounded-full px-3 py-0.5 font-[family-name:var(--font-mono),ui-monospace,monospace] text-[10px] tracking-[0.08em] text-faint"
              style={{ background: 'color-mix(in srgb, var(--c-surface) 55%, transparent)' }}
            >
              {domain}
            </span>
          </span>
        )}
      </div>
      {/* Media area — children own their aspect ratio */}
      <div className="relative">{children}</div>
    </div>
  )
}
