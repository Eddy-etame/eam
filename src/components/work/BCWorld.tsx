'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { BrowserFrame } from '@/components/ui/BrowserFrame'
import { localizedPath } from '@/lib/seo'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/** Boxing Center house accents — local to this world, never global tokens. */
const BC_NAVY = '#1E2044'
const BC_RED = '#E8001C'

/** The five salles — captures of the delivered maquettes. Order = the tour. */
const SALLES: { img: string; href?: string; numeral: string }[] = [
  { img: '/thumbs/bc-portet.jpg', href: 'work/boxing-center-portet', numeral: 'I' },
  { img: '/thumbs/bc-etats-unis.jpg', href: 'work/boxing-center-etats-unis', numeral: 'II' },
  { img: '/thumbs/bc-minimes.jpg', numeral: 'III' },
  { img: '/thumbs/bc-st-cyprien.jpg', numeral: 'IV' },
  { img: '/thumbs/bc-ramonville.jpg', numeral: 'V' },
]

/** The official e-boutique — live, EAM-built (Stripe + PrestaShop bridge + Deciplus sync). */
const BOUTIQUE_URL = 'https://box-plus.vercel.app/'

/**
 * The Boxing Center world — EAM's richest direct engagement as a cinematic
 * journey, not a grid. An iris entrance over the Colosse monolith, five
 * full-bleed salle bands with inner parallax, a foil stat band and a
 * provenance close. Web and code only — the print work is out of scope.
 *
 * Doctrine: every string comes from dict.bcWorld; all copy and links live in
 * the DOM (SEO). Reduced motion renders the whole page static and readable —
 * the vertical full-bleed path stays dignified on mobile. Local accents
 * (BC navy + fight-red) stay inline; the chapter palette remains heraldic.
 */
export function BCWorld({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const root = useRef<HTMLElement>(null)
  const d = dict.bcWorld

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // ── ENTRANCE — the arena opens like an iris ─────────────────────────
      const split = new SplitText('[data-bc-title]', { type: 'lines' })
      split.lines.forEach((line) => {
        const wrap = document.createElement('span')
        wrap.style.display = 'block'
        wrap.style.overflow = 'hidden'
        line.parentNode?.insertBefore(wrap, line)
        wrap.appendChild(line)
      })

      gsap
        .timeline({ defaults: { ease: 'eam-reveal' } })
        .fromTo(
          '[data-bc-cover]',
          { autoAlpha: 0, scale: 1.12, clipPath: 'circle(10% at 50% 42%)' },
          {
            autoAlpha: 1,
            scale: 1,
            clipPath: 'circle(140% at 50% 42%)',
            duration: 1.5,
            ease: 'eam-gold',
            clearProps: 'clipPath,scale',
          },
        )
        .fromTo(
          '[data-bc-logo]',
          { autoAlpha: 0, y: -36, scale: 1.18 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.0, ease: 'eam-gold' },
          '-=0.75',
        )
        .from('[data-bc-eyebrow]', { autoAlpha: 0, letterSpacing: '0.45em', duration: 0.8 }, '-=0.7')
        .from(split.lines, { yPercent: 114, duration: 0.9, stagger: 0.09 }, '-=0.45')
        .from('[data-bc-lead]', { autoAlpha: 0, y: 18, duration: 0.7 }, '-=0.5')
        .fromTo(
          '[data-bc-rule]',
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: 'left', duration: 1.1, ease: 'eam-gold' },
          '-=0.55',
        )
        .from('[data-bc-hint]', { autoAlpha: 0, y: -8, duration: 0.6 }, '-=0.4')
        .from('[data-bc-back]', { autoAlpha: 0, y: 16, duration: 0.6 }, '-=0.3')

      // ── CINQ SALLES — inner image parallax per band ─────────────────────
      gsap.utils.toArray<HTMLElement>('[data-bc-band]').forEach((band) => {
        const img = band.querySelector<HTMLElement>('[data-bc-band-img]')
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: 'none',
              scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        }
        const numeral = band.querySelector<HTMLElement>('[data-bc-numeral]')
        if (numeral) {
          gsap.fromTo(
            numeral,
            { yPercent: 24 },
            {
              yPercent: -24,
              ease: 'none',
              scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        }
        const content = band.querySelector<HTMLElement>('[data-bc-band-copy]')
        if (content) {
          gsap.fromTo(
            content,
            { autoAlpha: 0, y: 48 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: 'eam-reveal',
              scrollTrigger: { trigger: band, start: 'top 62%' },
            },
          )
        }
      })

      // ── Generic scroll reveals ───────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('[data-bc-reveal]').forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'eam-reveal',
            scrollTrigger: { trigger: item, start: 'top 84%' },
          },
        )
      })

      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <main id="content" ref={root} className="relative">
      <div data-chapter="heraldic">
        {/* ── ENTRANCE — a pure brand stage. No screenshot here: EAM did not
            build boxingcenter.fr itself; the world opens on the house colours,
            and the sites we DID build carry the chapters below. ───────────── */}
        <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-32 text-center md:px-12">
          <div data-bc-cover aria-hidden className="absolute inset-0">
            {/* House navy falling into the page deep */}
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(180deg, ${BC_NAVY} 0%, #131630 46%, var(--c-deep) 96%)` }}
            />
            {/* Ring light — a low red glow, like the arena before the bout */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 58% 40% at 50% 64%, ${BC_RED}2E 0%, transparent 68%)`,
              }}
            />
            {/* Ghost crest — the mark as matter, not a photograph */}
            <div className="absolute left-1/2 top-[40%] w-[min(150vw,1400px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]">
              <Image
                src="/logos/boxing-center.png"
                alt=""
                width={1400}
                height={648}
                priority
                sizes="150vw"
                className="h-auto w-full"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_52%_at_50%_42%,transparent_0%,var(--c-deep)_96%)]" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
            <p data-bc-eyebrow className="text-mono-label" style={{ color: BC_RED }}>
              {d.eyebrow}
            </p>

            {/* The BC mark lands over the arena — navy asset whited-out for the night stage */}
            <div data-bc-logo className="mt-10 w-[min(64vw,380px)]">
              <Image
                src="/logos/boxing-center.png"
                alt={d.logoAlt}
                width={640}
                height={296}
                priority
                sizes="(max-width: 768px) 64vw, 380px"
                className="h-auto w-full"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.94 }}
              />
            </div>

            <h1 data-bc-title className="mt-10 text-4xl md:text-5xl">
              {d.title}
            </h1>
            <p data-bc-lead className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/85">
              {d.lead}
            </p>

            <div className="mt-10 flex w-full max-w-md items-center gap-5">
              <span className="text-mono-label [font-variant-numeric:tabular-nums]" style={{ color: BC_RED }}>
                5 × 1
              </span>
              <span data-bc-rule className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${BC_RED}, transparent)` }} />
              <span className="text-mono-label text-gold">Toulouse</span>
            </div>
          </div>

          <div
            data-bc-hint
            aria-hidden
            className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
          >
            <span className="text-mono-label text-faint">{d.scrollHint}</span>
            <span className="block h-10 w-px animate-pulse" style={{ background: `${BC_RED}99` }} />
          </div>
        </section>

        {/* ── CHAPTER I — CINQ SALLES, full-bleed bands, never a grid ────── */}
        <section className="border-t border-line">
          <header data-bc-reveal className="mx-auto max-w-[1640px] px-6 py-20 md:px-12 md:py-24 lg:px-20">
            <p className="text-mono-label" style={{ color: BC_RED }}>
              {d.salles.eyebrow}
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl">
              <span className="foil">{d.salles.title}</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-muted">{d.salles.intro}</p>
          </header>

          {d.salles.items.map((salle, i) => {
            const meta = SALLES[i]
            const right = i % 2 === 1
            const inner = (
              <>
                {/* Oversized inner frame — the parallax travel never shows edges.
                    These captures ARE content (the sites EAM built) — real alts. */}
                <div data-bc-band-img className="absolute -inset-y-[9%] inset-x-0">
                  <Image
                    src={meta.img}
                    alt={`Boxing Center ${salle.name} — capture du site conçu par EAM`}
                    fill
                    sizes="100vw"
                    className="object-cover object-top"
                  />
                </div>
                {/* Legibility scrim, anchored to the copy side */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${right ? '270deg' : '90deg'}, ${BC_NAVY}E6 0%, rgba(7,13,24,0.55) 46%, transparent 78%), linear-gradient(0deg, rgba(7,13,24,0.72) 0%, transparent 38%)`,
                  }}
                />
                {/* Ghost numeral — Fraunces, drifting against the scroll */}
                <span
                  data-bc-numeral
                  aria-hidden
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 select-none font-display leading-none text-white/[0.07] ${right ? 'left-6 md:left-16' : 'right-6 md:right-16'}`}
                  style={{ fontSize: 'clamp(9rem, 26vw, 24rem)' }}
                >
                  {meta.numeral}
                </span>

                <div
                  data-bc-band-copy
                  className={`absolute bottom-0 flex max-w-xl flex-col gap-4 p-8 md:p-14 ${right ? 'right-0 items-end text-right' : 'left-0 items-start text-left'}`}
                >
                  <p className="text-mono-label text-ink/70">
                    <span style={{ color: BC_RED }}>{`Salle 0${i + 1}`}</span>
                    <span className="px-2 text-faint" aria-hidden>
                      ·
                    </span>
                    {salle.place}
                  </p>
                  <p className="font-display text-3xl leading-none text-ink md:text-[clamp(2.75rem,5.5vw,4.5rem)]">
                    {salle.name}
                  </p>
                  <p className="text-base leading-relaxed text-ink/80 md:text-lg">{salle.line}</p>
                  {meta.href && (
                    <span className="text-mono-label mt-2 inline-flex items-center gap-2 text-gold transition-colors duration-300 group-hover:text-gold-bright">
                      {d.salles.caseCta} <span aria-hidden>→</span>
                    </span>
                  )}
                </div>
              </>
            )

            const bandClass =
              'group relative block h-[80vh] min-h-[520px] w-full overflow-hidden border-t border-line'

            return meta.href ? (
              <Link
                key={salle.name}
                data-bc-band
                data-cursor="voir"
                href={localizedPath(locale, meta.href)}
                className={bandClass}
                aria-label={`Boxing Center ${salle.name} — ${salle.place}`}
              >
                {inner}
              </Link>
            ) : (
              <div key={salle.name} data-bc-band className={bandClass}>
                {inner}
              </div>
            )
          })}
        </section>

        {/* ── CHAPTER II — BOX PLUS, the official e-boutique (live) ──────── */}
        <section className="border-t border-line px-6 py-20 md:px-12 md:py-28 lg:px-20">
          <div className="mx-auto max-w-[1640px]">
            <header data-bc-reveal>
              <p className="text-mono-label" style={{ color: BC_RED }}>
                {d.boutique.eyebrow}
              </p>
              <div className="mt-5 flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
                <h2 className="font-display text-3xl leading-none text-ink md:text-[clamp(2.75rem,5.5vw,4.5rem)]">
                  {d.boutique.name}
                </h2>
                <p className="text-mono-label text-muted">{d.boutique.tag}</p>
              </div>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{d.boutique.line}</p>
            </header>

            <div data-bc-reveal className="mt-12">
              <BrowserFrame url={BOUTIQUE_URL}>
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/thumbs/bc-box-plus.jpg"
                    alt={`Box Plus — ${d.boutique.tag}`}
                    fill
                    sizes="(max-width: 1640px) 100vw, 1640px"
                    className="object-cover object-top"
                  />
                </div>
              </BrowserFrame>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a
                  href={BOUTIQUE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mono-label inline-flex items-center gap-2 rounded-full border px-6 py-3 text-ink transition-colors duration-300 hover:text-deep"
                  style={{ borderColor: `${BC_RED}66` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = BC_RED)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {d.boutique.visit} <span aria-hidden>↗</span>
                </a>
                <Link
                  href={localizedPath(locale, 'work/box-plus')}
                  className="text-mono-label inline-flex items-center gap-2 py-3 text-muted transition-colors duration-300 hover:text-ink"
                >
                  {d.salles.caseCta} <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAND — the craft facts, in living foil ───────────────── */}
        <section className="border-t border-line px-6 py-20 md:px-12 md:py-24 lg:px-20">
          <div className="mx-auto max-w-[1640px]">
            <p data-bc-reveal className="text-mono-label text-gold/85">
              {d.stats.eyebrow}
            </p>
            <div
              data-bc-reveal
              className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4"
            >
              {d.stats.items.map((stat) => (
                <div key={stat.label} className="bg-deep p-8 text-center md:p-10">
                  <p className="foil foil-anim font-display text-3xl leading-none">{stat.value}</p>
                  <p className="text-mono-label mt-4 text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLOSE — provenance + the next commission ───────────────────── */}
        <section className="border-t border-line px-6 py-24 text-center md:px-12 md:py-32">
          <div data-bc-reveal className="mx-auto max-w-2xl">
            <p
              className="text-mono-label mx-auto max-w-xl border-l-2 pl-5 text-left normal-case tracking-normal text-muted"
              style={{ borderColor: `${BC_RED}66` }}
            >
              {d.close.provenance}
            </p>
            <h2 className="mt-12 text-3xl">
              <span className="foil">{d.close.title}</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">{d.close.text}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
              <Link
                href={localizedPath(locale, 'contact')}
                className="shadow-gold rounded-full bg-gold px-8 py-4 font-medium text-deep transition-colors duration-300 hover:bg-gold-bright"
              >
                {d.close.button}
              </Link>
              <Link
                href={localizedPath(locale, 'work')}
                className="text-mono-label text-muted transition-colors duration-300 hover:text-ink"
              >
                {dict.common.backToWork} →
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Persistent way back to the registre — hidden on phones (it sat on top
          of body copy); mobile relies on the in-flow exits instead */}
      <Link
        data-bc-back
        href={localizedPath(locale, 'work')}
        className="text-mono-label fixed bottom-6 left-6 z-40 hidden rounded-full border border-line bg-surface/80 px-5 py-3 text-muted backdrop-blur-md transition-colors duration-300 hover:border-gold/50 hover:text-ink sm:inline-flex"
      >
        ← {d.back}
      </Link>
    </main>
  )
}
