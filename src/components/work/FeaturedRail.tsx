'use client'

import { Children, useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Featured work as a pinned horizontal rail: on fine-pointer desktops the
 * section pins and the cards scrub sideways with an 01/06 counter — the
 * flagship treatment. Touch, narrow viewports and reduced-motion keep the
 * original two-column grid with directional reveals.
 */
export function FeaturedRail({ children }: { children: ReactNode }) {
  const items = Children.toArray(children)
  const scope = useRef<HTMLDivElement>(null)
  const [enhanced, setEnhanced] = useState(false)
  const [idx, setIdx] = useState(1)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const wide = window.matchMedia('(min-width: 1024px)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (fine && wide && !reduce) setEnhanced(true)
  }, [])

  useGSAP(
    () => {
      if (!enhanced) return
      const wrap = scope.current
      const track = wrap?.querySelector<HTMLElement>('[data-rail-track]')
      if (!wrap || !track) return
      const dist = () => Math.max(0, track.scrollWidth - wrap.clientWidth)
      // Velocity skew — the rail leans into the scroll like film pulled fast.
      const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power2' })
      gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          pin: true,
          scrub: 1,
          start: 'top 15%',
          end: () => `+=${dist()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setIdx(1 + Math.round(self.progress * (items.length - 1)))
            skewTo(gsap.utils.clamp(-3.5, 3.5, -self.getVelocity() / 350))
          },
        },
      })
    },
    { scope, dependencies: [enhanced], revertOnUpdate: true },
  )

  if (!enhanced) {
    return (
      <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
        {items.map((child, i) => (
          <Reveal key={i} delay={(i % 2) * 90} dir={i % 2 === 0 ? 'left' : 'right'}>
            {child}
          </Reveal>
        ))}
      </div>
    )
  }

  return (
    <div ref={scope} className="mt-14">
      <div className="overflow-hidden">
        <div data-rail-track className="flex gap-8">
          {items.map((child, i) => (
            <div key={i} className="w-[min(44vw,640px)] shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center gap-5">
        <span className="text-mono-label text-gold [font-variant-numeric:tabular-nums]">
          {String(idx).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <span className="hairline flex-1 opacity-60" />
      </div>
    </div>
  )
}
