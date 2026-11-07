'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import Image from 'next/image'
import { gsap, useGSAP } from '@/lib/gsap'
import { BrowserFrame } from '@/components/ui/BrowserFrame'
import { PhoneFrame } from '@/components/ui/PhoneFrame'

/**
 * Case-study cover — the proof of craft, shown on the two screens the site
 * was built for.
 *
 * - The browser frame carries the desktop capture: 16/9 from md up, 16/10
 *   below, so the whole hero shows instead of a top strip.
 * - When a phone capture exists (/thumbs/<slug>-m.jpg — a real 430×932
 *   viewport), a phone device joins it. From md up it hangs over the frame's
 *   bottom-right corner. On a phone screen it LEADS, close to the size the
 *   visitor's own phone would show the site, and the desktop frame follows
 *   underneath: a visitor on a phone sees the site the way they would open
 *   it, never a desktop screenshot shrunk four times (Eddy, 2026-11-07).
 * - Scroll parallax: the frame's artwork drifts slowly, the phone a little
 *   faster — it is the nearer object. Reduced motion renders both still.
 * - No desktop capture → `children` is the fallback artwork (initials, or
 *   the Boxing Center brand stage) inside the browser frame, as before.
 */
export function CaseCover({
  color,
  url,
  name,
  desktop,
  phone,
  children,
}: {
  color: string
  /** Live URL — '#'/undefined hides the address pills (chrome stays). */
  url?: string
  /** Project name — the captures' alt text. */
  name: string
  /** Desktop capture (/thumbs/<slug>.jpg). */
  desktop?: string
  /** Phone capture (/thumbs/<slug>-m.jpg) — adds the phone device. */
  phone?: string
  /** Fallback artwork when there is no desktop capture. */
  children?: ReactNode
}) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const scrollTrigger = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.fromTo('[data-cover-inner]', { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger })
      if (phone) gsap.fromTo('[data-cover-phone]', { y: 36 }, { y: -36, ease: 'none', scrollTrigger })
    },
    { scope: root, dependencies: [phone] },
  )

  const stage: CSSProperties = {
    background: `linear-gradient(135deg, ${color}, var(--c-navy) 82%)`,
  }
  // The phone hangs 14% of its height below the frame from md up — the cover
  // reserves that room so the stat band underneath keeps its distance.
  const ratio = desktop ? 'aspect-[16/10] md:aspect-[16/9]' : 'aspect-[16/10] md:aspect-[16/7]'

  return (
    <div ref={root} className={`relative flex flex-col-reverse gap-5 md:block ${phone ? 'md:pb-[7%]' : ''}`}>
      {/* The desktop screen */}
      <div className="relative z-[1]">
        <BrowserFrame url={url}>
          {/* Aspect lives on the media area, not the frame — the chrome bar
              adds its own height on top so the artwork keeps its ratio. */}
          <div className={`grain relative overflow-hidden ${ratio}`} style={stage}>
            <div data-cover-inner className="absolute -inset-y-[8%] inset-x-0 grid place-items-center">
              {desktop ? (
                <Image
                  src={desktop}
                  alt={name}
                  fill
                  sizes="(max-width: 1640px) 100vw, 1640px"
                  // Preloaded when it is the only capture; beside a phone
                  // capture it still fetches first, without a second preload.
                  priority={!phone}
                  loading={phone ? 'eager' : undefined}
                  fetchPriority={phone ? 'high' : undefined}
                  className="object-cover object-top"
                />
              ) : (
                children
              )}
            </div>
          </div>
        </BrowserFrame>
      </div>

      {/* The phone screen — leads below md, hangs off the frame from md up */}
      {phone && (
        <div className="relative z-[2] mx-auto w-[min(76%,340px)] md:absolute md:right-[4%] md:bottom-0 md:mx-0 md:w-[clamp(150px,19%,280px)] md:translate-y-[14%]">
          <div data-cover-phone className="rounded-[clamp(18px,9cqi,30px)] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]">
            <PhoneFrame url={url}>
              <div className="relative aspect-[430/932]">
                <Image
                  src={phone}
                  alt={`${name} — mobile`}
                  fill
                  sizes="(max-width: 767px) 76vw, 280px"
                  priority
                  className="object-cover object-top"
                />
              </div>
            </PhoneFrame>
          </div>
        </div>
      )}
    </div>
  )
}
