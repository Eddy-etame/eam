'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/**
 * Case-study cover with a scroll parallax — the artwork drifts inside its
 * frame as the page scrolls, so the proof-of-craft surface breathes instead
 * of sitting static. Reduced motion renders it still.
 */
export function CaseCover({ color, children }: { color: string; children: ReactNode }) {
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
    <div
      ref={frame}
      className="grain relative aspect-[16/7] overflow-hidden rounded-xl border border-line"
      style={style}
    >
      <div data-cover-inner className="absolute -inset-y-[8%] inset-x-0 grid place-items-center">
        {children}
      </div>
    </div>
  )
}
