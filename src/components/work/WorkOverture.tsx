'use client'

import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { CountUp } from '@/components/ui/CountUp'

/**
 * The registre's overture — masked line-by-line title reveal, eyebrow
 * letter-spacing ease, a gold hairline that draws itself, and the live
 * inventory count. Server passes plain strings; reduced motion renders still.
 */
export function WorkOverture({
  eyebrow,
  title,
  subtitle,
  count,
  countLabel,
}: {
  eyebrow: string
  title: string
  subtitle: string
  count: number
  countLabel: string
}) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const split = new SplitText('[data-overture-title]', { type: 'lines' })
      split.lines.forEach((line) => {
        const wrap = document.createElement('span')
        wrap.style.display = 'block'
        wrap.style.overflow = 'hidden'
        line.parentNode?.insertBefore(wrap, line)
        wrap.appendChild(line)
      })

      gsap
        .timeline({ defaults: { ease: 'eam-reveal' } })
        .from('[data-overture-eyebrow]', { autoAlpha: 0, letterSpacing: '0.42em', duration: 0.8 })
        .from(split.lines, { yPercent: 112, duration: 0.9, stagger: 0.09 }, '-=0.5')
        .from('[data-overture-sub]', { autoAlpha: 0, y: 18, duration: 0.7 }, '-=0.5')
        .fromTo(
          '[data-overture-rule]',
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: 'left', duration: 1.1, ease: 'eam-gold' },
          '-=0.55',
        )

      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <header ref={root} className="max-w-3xl">
      <p data-overture-eyebrow className="text-mono-label text-gold/85">
        {eyebrow}
      </p>
      <h1 data-overture-title className="mt-5 text-4xl">
        {title}
      </h1>
      <p data-overture-sub className="mt-6 text-lg text-muted">
        {subtitle}
      </p>
      {/* Portfolio-depth stat — NOT a "N°01 —" range (that read as a 23-tile
          sequence and collided with the registre's own N°01–N°05 index). */}
      <div className="mt-8 flex items-center gap-5">
        <span className="text-mono-label text-gold [font-variant-numeric:tabular-nums]">
          <CountUp value={String(count)} />
          <span className="ml-2 text-muted">{countLabel}</span>
        </span>
        <span data-overture-rule className="hairline flex-1" />
      </div>
    </header>
  )
}
