'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { BrowserFrame } from '@/components/ui/BrowserFrame'

/**
 * Case-study cover with a scroll parallax — the artwork drifts inside its
 * frame as the page scrolls, so the proof-of-craft surface breathes instead
 * of sitting static. Reduced motion renders it still.
 *
 * The media now sits inside a BrowserFrame (credibility chrome): pass `url`
 * (the project's live URL) to show its domain in the address pill; omit it
 * and the bar renders dots only. Optional so existing call-sites compile.
 */
export function CaseCover({
  color,
  url,
  children,
}: {
  color: string
  /** Live URL — '#'/undefined hides the address pill (chrome stays). */
  url?: string
  children: ReactNode
}) {
  const frame = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.fromTo(
        '[data-cover-inner]',
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    },
    { scope: frame },
  )

  const style: CSSProperties = {
    background: `linear-gradient(135deg, ${color}, var(--c-navy) 82%)`,
  }
  return (
    <div ref={frame}>
      <BrowserFrame url={url}>
        {/* Aspect lives on the media area, not the frame — the chrome bar
            adds its own height on top so the artwork keeps its ratio. */}
        <div className="grain relative aspect-[16/7] overflow-hidden" style={style}>
          <div data-cover-inner className="absolute -inset-y-[8%] inset-x-0 grid place-items-center">
            {children}
          </div>
        </div>
      </BrowserFrame>
    </div>
  )
}
