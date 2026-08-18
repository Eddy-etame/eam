'use client'

import { Children, useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { Reveal } from '@/components/ui/Reveal'

type RailMode = 'static' | 'carousel' | 'pinned'

/**
 * Featured work as a pinned horizontal rail: on fine-pointer desktops the
 * section pins and the cards scrub sideways with an 01/06 counter — the
 * flagship treatment. Touch and narrow viewports get the same rail grammar
 * as a native scroll-snap carousel (86vw cards, live counter, gold progress
 * hairline, inner-thumb parallax). Reduced-motion and SSR keep the original
 * two-column grid.
 */
export function FeaturedRail({ children }: { children: ReactNode }) {
  const items = Children.toArray(children)
  const scope = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const [mode, setMode] = useState<RailMode>('static')
  const [idx, setIdx] = useState(1)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const wide = window.matchMedia('(min-width: 1024px)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    setMode(fine && wide ? 'pinned' : 'carousel')
  }, [])

  useGSAP(
    () => {
      if (mode !== 'pinned') return
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
    { scope, dependencies: [mode], revertOnUpdate: true },
  )

  // Touch rail instruments: counter + gold hairline from scrollLeft, plus a
  // per-card inner-thumb parallax. One rAF per scroll burst — reads are
  // scrollLeft/offsetLeft only (transforms never dirty layout), writes are
  // transform-only.
  useEffect(() => {
    if (mode !== 'carousel') return
    const strip = stripRef.current
    const bar = barRef.current
    if (!strip || !bar) return

    const cards = Array.from(strip.querySelectorAll<HTMLElement>('[data-rail-card]'))
    const thumbs = cards.map((card) => card.querySelector<HTMLElement>('[data-gl-thumb] img'))
    thumbs.forEach((img) => {
      if (!img) return
      // The card thumb ships a 700ms hover transition — mute it so parallax
      // writes land raw, and over-scan so the drift never shows the frame edge.
      img.style.transition = 'none'
      gsap.set(img, { scale: 1.12 })
    })

    const toBar = gsap.quickTo(bar, 'scaleX', { duration: 0.35, ease: 'eam-silk' })
    let raf = 0
    const measure = () => {
      raf = 0
      const max = Math.max(1, strip.scrollWidth - strip.clientWidth)
      const p = gsap.utils.clamp(0, 1, strip.scrollLeft / max)
      setIdx(1 + Math.round(p * (items.length - 1)))
      toBar(p)
      const mid = strip.scrollLeft + strip.clientWidth / 2
      cards.forEach((card, i) => {
        const img = thumbs[i]
        if (!img) return
        const off = (card.offsetLeft + card.offsetWidth / 2 - mid) / strip.clientWidth
        // ±6 xPercent stays inside the 1.12 over-scan (6% slack per side).
        gsap.set(img, { xPercent: gsap.utils.clamp(-1, 1, off) * 6 })
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    strip.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      strip.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
      gsap.killTweensOf(bar)
      thumbs.forEach((img) => {
        if (!img) return
        img.style.transition = ''
        gsap.set(img, { clearProps: 'transform' })
      })
    }
  }, [mode, items.length])

  if (mode === 'carousel') {
    return (
      <div className="mt-14">
        {/* Full-bleed past the section's responsive padding; side padding
            centers the 86vw-capped cards so first/last snap dead-center too. */}
        <div
          ref={stripRef}
          data-rail-strip
          className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc((100vw-min(86vw,560px))/2)] pb-2 [scrollbar-width:none] md:-mx-12 lg:-mx-20 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((child, i) => (
            <div key={i} data-rail-card className="w-[86vw] max-w-[560px] shrink-0 snap-center">
              {child}
            </div>
          ))}
        </div>
        <div className="mt-7 flex items-center gap-5">
          <span className="text-mono-label text-gold [font-variant-numeric:tabular-nums]">
            {String(idx).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
          <span className="relative flex-1">
            <span className="hairline block opacity-60" />
            <span
              ref={barRef}
              data-rail-progress
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-gold"
            />
          </span>
        </div>
      </div>
    )
  }

  if (mode !== 'pinned') {
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
