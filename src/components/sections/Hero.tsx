'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap'
import { Magnetic } from '@/components/ui/Magnetic'
import { localizedPath } from '@/lib/seo'
import { canRunHeavyGL } from '@/lib/quality'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

const HeroCanvas = dynamic(() => import('@/components/three/HeroCanvas'), { ssr: false })

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const root = useRef<HTMLElement>(null)
  const { hero } = dict
  const [enable3D, setEnable3D] = useState(false)
  const [goldDust, setGoldDust] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Capability gate, not viewport gate — capable phones get the field too
    // (GoldField self-selects a phone preset). Desktop path is unchanged.
    if (canRunHeavyGL()) setEnable3D(true)
    // Phones the gate refuses still deserve atmosphere: CSS gold dust, no GL.
    else if (window.matchMedia('(max-width: 767px)').matches) setGoldDust(true)
  }, [])

  useGSAP(
    () => {
      const section = root.current
      if (!section) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // ── Entrance — word-level masked reveal (lines clip their rising words) ──
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]', section)
      const splits = lines.map((line) => new SplitText(line, { type: 'words' }))

      // The foil gradient must live on each WORD so it survives per-word motion
      // (and so the cursor light-sweep below can move it).
      const em = section.querySelector('h1 em')
      if (em) {
        em.classList.remove('foil')
        splits[splits.length - 1]?.words.forEach((word) => {
          word.classList.add('foil')
          ;(word as HTMLElement).style.backgroundSize = '220% 100%'
          word.setAttribute('data-foil-word', '')
        })
      }
      const words = splits.flatMap((s) => s.words)

      const tl = gsap
        .timeline({ paused: true, defaults: { ease: 'eam-reveal' } })
        .from('[data-hero-eyebrow]', { autoAlpha: 0, y: 16, duration: 0.6 })
        .from(words, { yPercent: 122, duration: 0.9, stagger: 0.045 }, '-=0.2')
        .from('[data-hero-sub]', { autoAlpha: 0, y: 22, duration: 0.7 }, '-=0.55')
        .from('[data-hero-cta]', { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.1 }, '-=0.4')
        .from('[data-hero-foot]', { autoAlpha: 0, duration: 0.8 }, '-=0.3')

      // Hold the entrance until the preloader curtain is gone — it used to play
      // (and finish) behind it, so no first-time visitor ever saw it.
      const win = window as Window & { __eamIntroDone?: boolean }
      let fallback: ReturnType<typeof setTimeout> | undefined
      const play = () => tl.play()
      if (win.__eamIntroDone) {
        play()
      } else {
        window.addEventListener('eam:intro-done', play, { once: true })
        fallback = setTimeout(play, 5000) // never strand the hero
      }

      // ── Crest parallax — the watermark drifts as the visitor scrolls ──
      gsap.to('[data-hero-crest]', {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
      })

      // ── Scroll-out — the hero recedes into depth as you leave it ──
      gsap.to('[data-hero-body]', {
        yPercent: -9,
        autoAlpha: 0.3,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: '80% top', scrub: true },
      })

      // ── Cursor light-sweep — the gold catches the visitor's light ──
      let onMove: ((e: PointerEvent) => void) | undefined
      if (window.matchMedia('(hover: hover)').matches) {
        const foilWords = gsap.utils.toArray<HTMLElement>('[data-foil-word]', section)
        onMove = (e) => {
          const x = (e.clientX / window.innerWidth) * 100
          for (const word of foilWords) word.style.backgroundPosition = `${x}% 50%`
        }
        section.addEventListener('pointermove', onMove, { passive: true })
      }

      return () => {
        if (fallback) clearTimeout(fallback)
        window.removeEventListener('eam:intro-done', play)
        if (onMove) section.removeEventListener('pointermove', onMove)
        splits.forEach((s) => s.revert())
      }
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-28 pt-36 md:px-12 lg:px-20"
    >
      {/* Heraldic backdrop: navy wash + faint gold crest watermark */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 55% at 50% -5%, rgb(13 31 60 / 0.75), transparent 70%)',
          }}
        />
        {/* Mobile: top-right watermark so the crest parallax animates a visible
            element (the section's overflow-hidden clips the right-edge bleed).
            lg: values reproduce the previous desktop rendering exactly. */}
        <div
          data-hero-crest
          className="absolute -right-[14%] -top-[2%] h-[80vw] w-[80vw] bg-gold/[0.04] lg:-right-[6%] lg:top-1/2 lg:h-[150%] lg:w-[55%] lg:-translate-y-1/2 lg:bg-gold/[0.05]"
          style={{
            WebkitMaskImage: 'url(/logo-eam.png)',
            maskImage: 'url(/logo-eam.png)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      </div>

      {enable3D && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <HeroCanvas />
        </div>
      )}
      {goldDust && (
        <div aria-hidden className="hero-dust pointer-events-none absolute inset-0 -z-10" />
      )}

      <div data-hero-body>
      <p data-hero-eyebrow className="text-mono-label mb-8 text-gold/85">
        {hero.eyebrow}
      </p>

      <h1 className="text-hero leading-[0.9]">
        {hero.titleLines.map((line, i) => (
          <span key={line} className="block overflow-hidden pb-[0.08em]">
            <span data-hero-line className="block">
              {i === hero.titleLines.length - 1 ? (
                <em className="foil not-italic">{line}</em>
              ) : (
                line
              )}
            </span>
          </span>
        ))}
      </h1>

      <p data-hero-sub className="mt-8 max-w-2xl text-lg text-muted">
        {hero.subtitle}
      </p>

      {/* Hierarchy: the commission is the primary act — gold, lit, magnetic.
          The registre is the supporting path. (Eddy: the old text link hid it.) */}
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Magnetic>
          <Link
            data-hero-cta
            href={localizedPath(locale, 'contact')}
            className="cta-shine shadow-gold group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold px-8 py-4 font-medium text-deep transition-colors duration-300 hover:bg-gold-bright"
          >
            {hero.ctaSecondary}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </Magnetic>
        <Magnetic strength={0.22}>
          <Link
            data-hero-cta
            href={localizedPath(locale, 'work')}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-3.5 text-mono-label text-muted transition-colors duration-300 hover:border-gold/50 hover:text-ink"
          >
            {hero.ctaPrimary}
          </Link>
        </Magnetic>
      </div>
      {/* Risk-reducer — the check-writer's hesitation, answered at the button */}
      <p data-hero-cta className="text-mono-label mt-4 text-faint">
        {hero.riskNote}
      </p>
      </div>

      <div
        data-hero-foot
        className="absolute inset-x-6 bottom-8 flex items-center gap-6 md:inset-x-12 lg:inset-x-20"
      >
        <span className="text-mono-label text-faint">{hero.scrollHint}</span>
        <span className="hairline flex-1 opacity-50" />
      </div>
    </section>
  )
}
