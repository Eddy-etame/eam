'use client'

import { Children, useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { Reveal } from '@/components/ui/Reveal'

type RailMode = 'static' | 'carousel' | 'pinned'

/**
 * Featured work as a pinned horizontal rail: on fine-pointer desktops the
 * section pins and the cards scrub sideways with an 01/06 counter — the
 * flagship treatment. Touch and narrow viewports get the same rail grammar
 * as a native scroll-snap carousel (86vw cards, live counter, gold progress
 * hairline, inner-thumb parallax). Below `sm` the cards ARE the phone
 * captures (2026-11-08): 60vw phones, the neighbours peeking and a step back
 * in scale, each site scrolling under its glass as it crosses the centre.
 * Reduced-motion and SSR keep the original grid — two phones a row below
 * `sm`, two columns from `md`.
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
      // The pin inserts its spacer after the triggers further down the page
      // were measured (chapter palette, world bands) — put every trigger back
      // in page order and re-measure, so nothing below fires a rail too early.
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
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
    // One drifting layer per card — whichever capture is laid out: below `sm`
    // the phone capture's tall inner layer (it scrolls DOWN its window — the
    // page moving under the glass), from `sm` the desktop thumb (sideways
    // drift). A display:none twin has no box and is never picked.
    const layers = cards.map((card) => {
      const phone = card.querySelector<HTMLElement>('[data-rail-media="phone"] [data-rail-thumb]')
      if (phone && phone.offsetParent !== null) return { el: phone, phone: true }
      const img = card.querySelector<HTMLElement>('[data-gl-thumb] img')
      return img && img.offsetParent !== null ? { el: img, phone: false } : null
    })
    layers.forEach((layer) => {
      if (!layer || layer.phone) return
      // The desktop thumb ships a 700ms hover transition — mute it so parallax
      // writes land raw, and over-scan so the drift never shows the frame edge.
      layer.el.style.transition = 'none'
      gsap.set(layer.el, { scale: 1.12 })
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
        const off = gsap.utils.clamp(-1, 1, (card.offsetLeft + card.offsetWidth / 2 - mid) / strip.clientWidth)
        // Depth: the centred card stands at full size, its neighbours a step back.
        gsap.set(card, { scale: 1 - Math.abs(off) * 0.06 })
        const layer = layers[i]
        if (!layer) return
        if (layer.phone) {
          // The phone window shows 430×880 of a 430×932 capture — 5.5% of slack:
          // at the top of the page when centred, scrolled down at the sides.
          gsap.set(layer.el, { yPercent: -5.5 * Math.abs(off) })
        } else {
          // ±6 xPercent stays inside the 1.12 over-scan (6% slack per side).
          gsap.set(layer.el, { xPercent: off * 6 })
        }
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    strip.addEventListener('scroll', onScroll, { passive: true })
    // The server rendered these cards as a tall stacked grid; the strip is a
    // fraction of that height. Every trigger below was measured against the
    // tall version — re-measure, or sections further down reveal thousands of
    // pixels late (or never, past the end of the page).
    ScrollTrigger.refresh()
    return () => {
      strip.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
      gsap.killTweensOf(bar)
      if (cards.length) gsap.set(cards, { clearProps: 'transform' })
      layers.forEach((layer) => {
        if (!layer) return
        layer.el.style.transition = ''
        gsap.set(layer.el, { clearProps: 'transform' })
      })
    }
  }, [mode, items.length])

  if (mode === 'carousel') {
    return (
      <div className="mt-14">
        {/* Full-bleed past the section's responsive padding; side padding
            centers the cards (60vw phones below sm, 86vw frames above) so
            first/last snap dead-center too. */}
        <div
          ref={stripRef}
          data-rail-strip
          className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc((100vw-min(60vw,272px))/2)] pb-2 [scrollbar-width:none] sm:px-[calc((100vw-min(86vw,560px))/2)] md:-mx-12 lg:-mx-20 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((child, i) => (
            <div key={i} data-rail-card className="w-[60vw] max-w-[272px] shrink-0 snap-center sm:w-[86vw] sm:max-w-[560px]">
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
      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-1 sm:gap-x-8 sm:gap-y-14 md:grid-cols-2">
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
