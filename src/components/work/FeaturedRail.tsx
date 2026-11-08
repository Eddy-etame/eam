'use client'

import { Children, useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { useMediaFlags } from '@/lib/use-media'

type RailMode = 'static' | 'carousel' | 'pinned'

/**
 * Featured work as a rail — ONE DOM for every device (2026-11-08).
 *
 * The server renders the strip itself: a native scroll-snap row with its
 * counter and gold hairline. Phones get the rail from the first byte, nothing
 * flashes as a grid before the script arrives, and the script never
 * re-renders the twelve cards — it only adds instruments:
 * - carousel (touch, or under 1024px): counter + hairline from scrollLeft,
 *   depth (the centred card at full size, its neighbours a step back) and the
 *   drift (a phone capture scrolls under its glass, a desktop thumb slides).
 * - pinned (fine pointer, 1024px up, motion allowed): the section pins and the
 *   same row scrubs sideways under the page scroll, with the velocity skew —
 *   the flagship treatment. Its geometry (44vw cards, no snap, no bleed) is
 *   CSS under the `fine-wide` variant, so the first paint already matches.
 * - static (reduced motion): the row stays a plain swipeable strip; counter
 *   and hairline still follow, without transforms.
 * Below `sm` the cards are the phone captures (60vw, see ProjectCard) and the
 * counter sits ABOVE the strip, so it never falls below the fold while a card
 * is being swiped (Eddy 2026-11-08).
 */
export function FeaturedRail({ children }: { children: ReactNode }) {
  const items = Children.toArray(children)
  const scope = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  // Which instruments this device gets — read on the client, 'static' on the
  // server and during hydration (useMediaFlags: no setState in a mount effect).
  const mode = useMediaFlags<RailMode>(
    (mq) =>
      mq('(prefers-reduced-motion: reduce)')
        ? 'static'
        : mq('(hover: hover) and (pointer: fine)') && mq('(min-width: 1024px)')
          ? 'pinned'
          : 'carousel',
    'static',
  )
  const [idx, setIdx] = useState(1)

  // ── Pinned: the row scrubs under the page scroll ─────────────────────────
  useGSAP(
    () => {
      if (mode !== 'pinned') return
      const wrap = scope.current
      const strip = stripRef.current
      const track = trackRef.current
      const bar = barRef.current
      if (!wrap || !strip || !track || !bar) return
      const dist = () => Math.max(0, track.scrollWidth - strip.clientWidth)
      // Velocity skew — the rail leans into the scroll like film pulled fast.
      const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power2' })
      const toBar = gsap.quickTo(bar, 'scaleX', { duration: 0.35, ease: 'eam-silk' })
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
            toBar(self.progress)
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

  // ── Carousel / static: instruments from scrollLeft ───────────────────────
  // One rAF per scroll burst — reads are scrollLeft/offsetLeft only
  // (transforms never dirty layout), writes are transform-only. Static
  // (reduced motion) keeps the counter and the hairline, nothing moves.
  useEffect(() => {
    if (mode === 'pinned') return
    const strip = stripRef.current
    const track = trackRef.current
    const bar = barRef.current
    if (!strip || !track || !bar) return
    const motion = mode === 'carousel'

    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-rail-card]'))
    // One drifting layer per card — whichever capture is laid out: below `sm`
    // the phone capture's tall inner layer (it scrolls DOWN its window — the
    // page moving under the glass), from `sm` the desktop thumb (sideways
    // drift). A display:none twin has no box and is never picked.
    const layers = motion
      ? cards.map((card) => {
          const phone = card.querySelector<HTMLElement>('[data-rail-media="phone"] [data-rail-thumb]')
          if (phone && phone.offsetParent !== null) return { el: phone, phone: true }
          const img = card.querySelector<HTMLElement>('[data-gl-thumb] img')
          return img && img.offsetParent !== null ? { el: img, phone: false } : null
        })
      : []
    layers.forEach((layer) => {
      if (!layer || layer.phone) return
      // The desktop thumb ships a 700ms hover transition — mute it so parallax
      // writes land raw, and over-scan so the drift never shows the frame edge.
      layer.el.style.transition = 'none'
      gsap.set(layer.el, { scale: 1.12 })
    })

    const toBar = motion ? gsap.quickTo(bar, 'scaleX', { duration: 0.35, ease: 'eam-silk' }) : (p: number) => gsap.set(bar, { scaleX: p })
    let raf = 0
    const measure = () => {
      raf = 0
      const max = Math.max(1, strip.scrollWidth - strip.clientWidth)
      const p = gsap.utils.clamp(0, 1, strip.scrollLeft / max)
      setIdx(1 + Math.round(p * (items.length - 1)))
      toBar(p)
      if (!motion) return
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

  return (
    <div ref={scope} className="mt-10 flex flex-col sm:mt-14">
      {/* The strip — full-bleed past the section's responsive padding on touch
          sizes, back inside it under `fine-wide` where the pinned row lives.
          Side padding on the track centres the first and last card for the
          snap (60vw phones below sm, 86vw frames above). */}
      <div
        ref={stripRef}
        data-rail-strip
        className="-mx-6 snap-x snap-mandatory overflow-x-auto pb-2 [scrollbar-width:none] md:-mx-12 lg:-mx-20 fine-wide:mx-0 fine-wide:snap-none motion-safe:fine-wide:overflow-hidden [&::-webkit-scrollbar]:hidden"
      >
        <div
          ref={trackRef}
          data-rail-track
          className="flex w-max gap-4 px-[calc((100vw-min(60vw,272px))/2)] sm:px-[calc((100vw-min(86vw,560px))/2)] fine-wide:gap-8 fine-wide:px-0"
        >
          {items.map((child, i) => (
            <div
              key={i}
              data-rail-card
              className="w-[60vw] max-w-[272px] shrink-0 snap-center sm:w-[86vw] sm:max-w-[560px] fine-wide:w-[min(44vw,640px)] fine-wide:max-w-none"
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      {/* Counter + gold hairline — above the strip on phones, below from sm */}
      <div className="order-first mb-5 flex items-center gap-5 sm:order-none sm:mt-7 sm:mb-0 fine-wide:mt-8">
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
