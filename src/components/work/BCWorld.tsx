'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { BrowserFrame } from '@/components/ui/BrowserFrame'
import { FeaturedRail } from '@/components/work/FeaturedRail'
import { localizedPath } from '@/lib/seo'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/** Boxing Center house accents — local to this world, never global tokens. */
const BC_NAVY = '#1E2044'
const BC_RED = '#E8001C'

/** A full-bleed site band: desktop capture, phone-shaped capture below `sm`
 *  (so a band never squishes a desktop screenshot on mobile), the case-study
 *  route and the LIVE site on its own bought domain (all probed 2026-10-03). */
interface BandMeta {
  img: string
  imgM: string
  href: string
  site: string
  numeral: string
}

const band = (slug: string, site: string, numeral: string): BandMeta => ({
  img: `/thumbs/${slug}.jpg`,
  imgM: `/thumbs/${slug}-m.jpg`,
  href: `work/${slug}`,
  site,
  numeral,
})

/** Order = the tour; each array mirrors its dict.bcWorld.*.items order. */
const SALLES = [
  band('boxing-center-portet', 'https://boxing-center-portet.fr/', 'I'),
  band('boxing-center-etats-unis', 'https://clubmma.fr/', 'II'),
  band('boxing-center-minimes', 'https://boxe-toulouse.com/', 'III'),
  band('boxing-center-st-cyprien', 'https://club-boxe-toulouse.com/', 'IV'),
  band('boxing-center-ramonville', 'https://mmatoulouse.com/', 'V'),
]

const CLUBS = [
  band('tmbc', 'https://toulouse-minimes-boxing-club.fr/', 'VI'),
  band('club-boxe-blagnac', 'https://www.club-boxe-blagnac.fr/', 'VII'),
]

const STORES = [
  band('boutique-de-boxe', 'https://www.boutique-de-boxe.com/', 'II'),
  band('matos-de-boxe', 'https://www.matos-de-boxe.fr/', 'III'),
]

/** The seven proximity sites — one per town, each on its own domain. */
const PROXIMITE = ['colomiers', 'muret', 'cugnaux', 'tournefeuille', 'labege', 'lunion', 'castelginest'].map(
  (town) => ({
    img: `/thumbs/bc-sat-${town}.jpg`,
    imgM: `/thumbs/bc-sat-${town}-m.jpg`,
    site: `https://www.boxingcenter-${town}.fr/`,
    domain: `boxingcenter-${town}.fr`,
  }),
)

/** The official e-boutique — live, EAM-built (Stripe + PrestaShop bridge + Deciplus sync). */
const BOUTIQUE_URL = 'https://boutique.boxingcenter.fr/'

function SiteBand({
  locale,
  meta,
  label,
  index,
  copy,
  caseCta,
  visitCta,
  right,
  prefix = '',
}: {
  locale: Locale
  meta: BandMeta
  /** "Salle" / "Club" / "Boutique" — printed with the running number. */
  label: string
  index: number
  copy: { name: string; place: string; line: string }
  caseCta: string
  visitCta: string
  /** Copy block on the right (alternates down the tour). */
  right: boolean
  /** Spoken before the name in alt/aria only — the band prints the bare name big. */
  prefix?: string
}) {
  const fullName = `${prefix}${copy.name}`
  const alt =
    locale === 'fr'
      ? `${fullName} — capture du site conçu par EAM`
      : `${fullName} — capture of the site built by EAM`
  return (
    // The whole band is the door to the case study (a stretched link); the
    // caption sits above it and carries both doors side by side — the case
    // study and the LIVE site. Siblings, never nested anchors.
    <div
      data-bc-band
      className="group relative h-[80vh] min-h-[520px] w-full overflow-hidden border-t border-line"
    >
      {/* Oversized inner frame — the parallax travel never shows edges.
          These captures ARE content (the sites EAM built) — real alts. */}
      <div data-bc-band-img className="absolute -inset-y-[9%] inset-x-0">
        <Image src={meta.imgM} alt={alt} fill sizes="100vw" className="object-cover object-top sm:hidden" />
        <Image src={meta.img} alt={alt} fill sizes="100vw" className="hidden object-cover object-top sm:block" />
      </div>
      {/* Legibility scrim (desktop): solid house navy under the caption, so
          the capture's own headline never shows through our words, then a
          long fall-off that leaves the other half of the site untouched. */}
      <div
        aria-hidden
        className="absolute inset-0 hidden sm:block"
        style={{
          background: `linear-gradient(${right ? '270deg' : '90deg'}, ${BC_NAVY} 0%, ${BC_NAVY} 27%, ${BC_NAVY}E0 39%, rgba(13,17,40,0.5) 54%, transparent 74%), linear-gradient(0deg, rgba(7,13,24,0.6) 0%, transparent 32%)`,
        }}
      />
      {/* Mobile: a bottom-weighted scrim — the phone capture reads up top
          (the striking visual), the caption sits on darkness so it never
          fights the capture's own hero text. */}
      <div
        aria-hidden
        className="absolute inset-0 sm:hidden"
        style={{
          background:
            'linear-gradient(0deg, rgb(7,13,24) 0%, rgb(7,13,24) 34%, rgba(7,13,24,0.9) 43%, rgba(7,13,24,0.45) 55%, transparent 74%)',
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

      <Link
        href={localizedPath(locale, meta.href)}
        data-cursor="voir"
        tabIndex={-1}
        aria-hidden
        className="absolute inset-0 z-10"
      />

      <div
        data-bc-band-copy
        className={`pointer-events-none absolute bottom-0 z-20 flex max-w-xl flex-col gap-4 p-8 md:p-14 ${right ? 'right-0 items-end text-right' : 'left-0 items-start text-left'}`}
      >
        <p className="text-mono-label text-ink/70">
          <span style={{ color: BC_RED }}>{`${label} 0${index}`}</span>
          <span className="px-2 text-faint" aria-hidden>
            ·
          </span>
          {copy.place}
        </p>
        <p className="font-display text-3xl leading-none text-ink md:text-[clamp(2.75rem,5.5vw,4.5rem)]">
          {copy.name}
        </p>
        {/* The long line stays off-screen on mobile — the phone capture is
            the hero there, the caption is a compact label. */}
        <p className="hidden text-base leading-relaxed text-ink/80 sm:block md:text-lg">{copy.line}</p>
        <div
          className={`pointer-events-auto mt-2 flex flex-wrap items-center gap-x-6 gap-y-3 ${right ? 'justify-end' : ''}`}
        >
          <Link
            href={localizedPath(locale, meta.href)}
            aria-label={`${caseCta} — ${fullName}`}
            className="text-mono-label -my-3 inline-flex items-center gap-2 py-3 text-gold transition-colors duration-300 hover:text-gold-bright group-hover:text-gold-bright"
          >
            {caseCta} <span aria-hidden>→</span>
          </Link>
          <a
            href={meta.site}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${visitCta} — ${fullName}`}
            className="text-mono-label inline-flex items-center gap-2 rounded-full border border-line-strong bg-deep/60 px-4 py-2 text-ink backdrop-blur-sm transition-colors duration-300 hover:border-gold/60 hover:text-gold sm:px-5 sm:py-2.5"
          >
            {visitCta} <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}

/**
 * The Boxing Center world — EAM's richest direct engagement as a cinematic
 * journey, not a grid. An iris entrance on the house colours, full-bleed
 * bands with inner parallax for the salles, the clubs and the stores, a
 * pinned rail for the seven proximity sites, a foil stat band and a
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

      // ── THE BANDS — inner image parallax per band ───────────────────────
      gsap.utils.toArray<HTMLElement>('[data-bc-band]').forEach((bandEl) => {
        const img = bandEl.querySelector<HTMLElement>('[data-bc-band-img]')
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: 'none',
              scrollTrigger: { trigger: bandEl, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        }
        const numeral = bandEl.querySelector<HTMLElement>('[data-bc-numeral]')
        if (numeral) {
          gsap.fromTo(
            numeral,
            { yPercent: 24 },
            {
              yPercent: -24,
              ease: 'none',
              scrollTrigger: { trigger: bandEl, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        }
        const content = bandEl.querySelector<HTMLElement>('[data-bc-band-copy]')
        if (content) {
          gsap.fromTo(
            content,
            { autoAlpha: 0, y: 48 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: 'eam-reveal',
              scrollTrigger: { trigger: bandEl, start: 'top 62%' },
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

          {d.salles.items.map((salle, i) => (
            <SiteBand
              key={salle.name}
              locale={locale}
              meta={SALLES[i]}
              label={d.salles.label}
              index={i + 1}
              copy={salle}
              prefix="Boxing Center "
              caseCta={d.caseCta}
              visitCta={d.visitCta}
              right={i % 2 === 1}
            />
          ))}
        </section>

        {/* ── CHAPTER II — the two English-boxing clubs, same band grammar ── */}
        <section className="border-t border-line">
          <header data-bc-reveal className="mx-auto max-w-[1640px] px-6 py-20 md:px-12 md:py-24 lg:px-20">
            <p className="text-mono-label" style={{ color: BC_RED }}>
              {d.clubs.eyebrow}
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl">
              <span className="foil">{d.clubs.title}</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-muted">{d.clubs.intro}</p>
          </header>

          {d.clubs.items.map((club, i) => (
            <SiteBand
              key={club.name}
              locale={locale}
              meta={CLUBS[i]}
              label={d.clubs.label}
              index={i + 1}
              copy={club}
              caseCta={d.caseCta}
              visitCta={d.visitCta}
              // Keeps alternating after the five salles (the fifth sat left).
              right={i % 2 === 0}
            />
          ))}
        </section>

        {/* ── CHAPTER III — the seven proximity sites: a rail you travel, town
            by town (pinned scrub on desktop, snap carousel on touch) ──────── */}
        <section className="border-t border-line px-6 py-20 md:px-12 md:py-28 lg:px-20">
          <div className="mx-auto max-w-[1640px]">
            <header data-bc-reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
              <div className="max-w-3xl">
                <p className="text-mono-label" style={{ color: BC_RED }}>
                  {d.proximite.eyebrow}
                </p>
                <h2 className="mt-5 text-3xl">
                  <span className="foil">{d.proximite.title}</span>
                </h2>
                <p className="mt-6 max-w-2xl text-lg text-muted">{d.proximite.intro}</p>
              </div>
              <Link
                href={localizedPath(locale, 'work/boxing-center-proximite')}
                className="text-mono-label -my-3 inline-flex items-center gap-2 py-3 text-gold transition-colors hover:text-gold-bright"
              >
                {d.caseCta} <span aria-hidden>→</span>
              </Link>
            </header>

            <FeaturedRail>
              {d.proximite.items.map((town, i) => {
                const meta = PROXIMITE[i]
                const alt =
                  locale === 'fr'
                    ? `Boxing Center — site de proximité ${town.name}, conçu par EAM`
                    : `Boxing Center — ${town.name} proximity site, built by EAM`
                return (
                  <a
                    key={town.name}
                    href={meta.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="voir"
                    className="group block"
                  >
                    <BrowserFrame url={meta.site}>
                      <div className="relative aspect-[4/5] w-full sm:hidden">
                        <Image src={meta.imgM} alt={alt} fill sizes="86vw" className="object-cover object-top" />
                      </div>
                      <div className="relative hidden aspect-[16/10] w-full overflow-hidden sm:block">
                        <Image
                          src={meta.img}
                          alt={alt}
                          fill
                          sizes="(max-width: 1024px) 86vw, 44vw"
                          className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        />
                      </div>
                    </BrowserFrame>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-mono-label">
                          <span className="tabular-nums" style={{ color: BC_RED }}>{`0${i + 1}`}</span>
                          <span className="px-2 text-faint" aria-hidden>
                            ·
                          </span>
                          <span className="text-muted">{meta.domain}</span>
                        </p>
                        <h3 className="mt-2 font-display text-2xl text-ink transition-colors duration-300 group-hover:text-gold">
                          {town.name}
                        </h3>
                        <p lang="fr" className="mt-1 text-muted">
                          {town.line}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="mt-1.5 shrink-0 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </div>
                  </a>
                )
              })}
            </FeaturedRail>
          </div>
        </section>

        {/* ── CHAPTER IV — the three stores: Box Plus in its frame, then the
            two catalogue stores as full-bleed bands ─────────────────────── */}
        <section className="border-t border-line">
          <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
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
                  {/* Phone-shaped store capture on mobile (taller frame), the
                      desktop capture at sm+ (16/10). */}
                  <div className="relative aspect-[3/4] w-full sm:hidden">
                    <Image
                      src="/thumbs/box-plus-m.jpg"
                      alt={`Box Plus — ${d.boutique.tag}`}
                      fill
                      sizes="100vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="relative hidden aspect-[16/10] w-full sm:block">
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
                    {d.caseCta} <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {d.boutique.others.map((store, i) => (
            <SiteBand
              key={store.name}
              locale={locale}
              meta={STORES[i]}
              label={d.boutique.label}
              index={i + 2}
              copy={store}
              caseCta={d.caseCta}
              visitCta={d.visitCta}
              right={i % 2 === 1}
            />
          ))}
        </section>

        {/* ── CHAPTER V — the backstage tools (live, 2026) ───────────────── */}
        <section className="border-t border-line px-6 py-20 md:px-12 md:py-24 lg:px-20">
          <div className="mx-auto max-w-[1640px]">
            <header data-bc-reveal>
              <p className="text-mono-label" style={{ color: BC_RED }}>
                {d.outils.eyebrow}
              </p>
              <h2 className="mt-5 max-w-3xl text-3xl">{d.outils.title}</h2>
              <p className="mt-6 max-w-2xl text-lg text-muted">{d.outils.intro}</p>
            </header>
            <div data-bc-reveal className="mt-10 grid gap-8 md:grid-cols-2">
              {d.outils.items.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col justify-between rounded-lg border border-line p-8 transition-colors duration-300 hover:border-gold/50 md:p-10"
                >
                  <div>
                    <h3 className="font-display text-2xl text-ink transition-colors duration-300 group-hover:text-gold">
                      {tool.name}
                    </h3>
                    <p className="mt-3 leading-relaxed text-muted">{tool.line}</p>
                  </div>
                  <span className="text-mono-label mt-6 inline-flex items-center gap-2 text-gold">
                    {d.outils.open} <span aria-hidden>↗</span>
                  </span>
                </a>
              ))}
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
