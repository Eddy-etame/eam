'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { MicrodidactTraversee } from './MicrodidactTraversee'
import { CategoryChips } from './CategoryChips'
import { ConversionBand } from '@/components/ui/ConversionBand'
import { localizedPath } from '@/lib/seo'
import { canRunHeavyGL } from '@/lib/quality'
import { categorySlugs } from '@/lib/taxonomy'
import type { ProjectCategory } from '@/lib/taxonomy'
import type { Project } from '@/lib/projects'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

// WebGL atmosphere — client-only, desktop + motion, pure enhancement.
const MicrodidactCanvas = dynamic(() => import('./MicrodidactCanvas'), { ssr: false })

/**
 * The Microdidact world — a full space of its own inside the registre.
 * Cinematic entrance (iris expand + curtain-wiped wordmark + masked SplitText
 * headline) over a particle constellation, then LA TRAVERSÉE — the sixteen
 * forged projects crossed as full-bleed cinematic panels on a pinned rail
 * (vertical immersive bands on touch/PRM) — a persistent way back, and a CTA.
 *
 * Doctrine: every string comes from the dictionaries; all copy and links live
 * in the DOM (SEO). Reduced motion and no-JS render the whole page static and
 * readable; the canvas mounts only on desktops that allow motion. The whole
 * world sits in the "atelier" chapter, so the root palette snaps to steel.
 */
export function MicrodidactWorld({
  locale,
  dict,
  projects,
  allCategories,
  totalProjects,
  activeCat = null,
}: {
  locale: Locale
  dict: Dictionary
  /** The projects crossed by the traversée — MAY be a `?cat=` filtered subset. */
  projects: Project[]
  /** Categories present among the FULL sixteen — the chip row (subset-independent). */
  allCategories?: ProjectCategory[]
  /** Full-world project count — the story stats stay factual under a filter. */
  totalProjects?: number
  /** Category the traversée is currently filtered to (null = all). */
  activeCat?: ProjectCategory | null
}) {
  const root = useRef<HTMLElement>(null)
  const [enableFx, setEnableFx] = useState(false)
  const d = dict.microdidact

  const chipCategories =
    allCategories ?? [...new Set(projects.map((p) => p.category))]
  const sectorCount = chipCategories.length
  const worldCount = totalProjects ?? projects.length
  const worldPath = localizedPath(locale, 'work/microdidact')

  // Same gate as the team stage: WebGL only on desktop with motion allowed,
  // on hardware that can afford it (quality gate + WebGL2 probe).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 767px)').matches
    if (!reduce && !small && canRunHeavyGL()) setEnableFx(true)
  }, [])

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // ── The entrance — the world opens like an iris ─────────────────────
      const split = new SplitText('[data-mw-title]', { type: 'lines' })
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
          '[data-mw-stage]',
          { autoAlpha: 0, scale: 1.06, clipPath: 'circle(12% at 50% 44%)' },
          {
            autoAlpha: 1,
            scale: 1,
            clipPath: 'circle(135% at 50% 44%)',
            duration: 1.4,
            ease: 'eam-gold',
            clearProps: 'clipPath,scale',
          },
        )
        .fromTo(
          '[data-mw-logo]',
          { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0 },
          { clipPath: 'inset(0 0% 0 0)', autoAlpha: 1, duration: 1.1, ease: 'eam-gold', clearProps: 'clipPath' },
          '-=0.7',
        )
        .from('[data-mw-eyebrow]', { autoAlpha: 0, letterSpacing: '0.42em', duration: 0.8 }, '-=0.8')
        .from(split.lines, { yPercent: 112, duration: 0.9, stagger: 0.09 }, '-=0.45')
        .from('[data-mw-lead]', { autoAlpha: 0, y: 18, duration: 0.7 }, '-=0.5')
        .fromTo(
          '[data-mw-rule]',
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: 'left', duration: 1.1, ease: 'eam-gold' },
          '-=0.55',
        )
        .from('[data-mw-hint]', { autoAlpha: 0, y: -8, duration: 0.6 }, '-=0.4')
        .from('[data-mw-back]', { autoAlpha: 0, y: 16, duration: 0.6 }, '-=0.3')

      // ── Scroll choreography — story, stats, constellation, CTA ──────────
      gsap.utils.toArray<HTMLElement>('[data-mw-reveal]').forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'eam-reveal',
            scrollTrigger: { trigger: item, start: 'top 82%' },
          },
        )
      })

      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <main id="content" ref={root} className="relative">
      <div data-chapter="atelier">
        {/* ── ENTRANCE STAGE — another world opens ─────────────────────── */}
        <section
          data-mw-stage
          className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-center md:px-12"
        >
          {enableFx && (
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
              <MicrodidactCanvas />
            </div>
          )}
          {/* Vignette pulls the eye to the wordmark */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_44%,transparent_0%,var(--c-deep)_92%)]"
          />

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
            <p data-mw-eyebrow className="text-mono-label text-gold/85">
              {d.eyebrow}
            </p>

            {/* Wordmark — dark-on-light asset, inverted to silver for the stage */}
            <div data-mw-logo className="mt-10 w-[min(78vw,540px)]">
              <Image
                src="/logos/microdidact.png"
                alt={d.logoAlt}
                width={640}
                height={131}
                priority
                sizes="(max-width: 768px) 78vw, 540px"
                className="h-auto w-full opacity-95"
                style={{ filter: 'invert(1) grayscale(1) brightness(1.55)' }}
              />
            </div>

            <h1 data-mw-title className="mt-10 text-4xl md:text-5xl">
              {d.title}
            </h1>
            <p data-mw-lead className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {d.lead}
            </p>

            <div className="mt-10 flex w-full max-w-md items-center gap-5">
              <span className="text-mono-label text-gold [font-variant-numeric:tabular-nums]">
                N°01 — N°{String(projects.length).padStart(2, '0')}
              </span>
              <span data-mw-rule className="hairline flex-1" />
            </div>
          </div>

          <div
            data-mw-hint
            aria-hidden
            className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
          >
            <span className="text-mono-label text-faint">{d.scrollHint}</span>
            <span className="block h-10 w-px animate-pulse bg-gold/50" />
          </div>
        </section>

        {/* ── THE STORY — what Microdidact is, in the DOM for SEO ───────── */}
        <section className="border-t border-line px-6 py-24 md:px-12 md:py-28 lg:px-20">
          <div className="mx-auto grid max-w-[1640px] gap-12 lg:grid-cols-12">
            <div data-mw-reveal className="lg:col-span-5">
              <p className="text-mono-label text-gold/85">{d.story.eyebrow}</p>
              <h2 className="mt-5 text-3xl">
                <span className="foil">{d.story.title}</span>
              </h2>
              {/* flex-wrap (not a rigid 3-col grid): 'Toulouse' at display size is
                  wider than a phone-width column and would blow the layout viewport */}
              <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-line pt-8">
                {/* DOM order dt→dd (valid HTML); col-reverse paints the value on top */}
                <div className="flex flex-col-reverse gap-2">
                  <dt className="text-mono-label text-muted">{d.stats.projects}</dt>
                  <dd className="font-display text-4xl text-gold [font-variant-numeric:tabular-nums]">
                    {worldCount}
                  </dd>
                </div>
                <div className="flex flex-col-reverse gap-2">
                  <dt className="text-mono-label text-muted">{d.stats.sectors}</dt>
                  <dd className="font-display text-4xl text-gold [font-variant-numeric:tabular-nums]">
                    {sectorCount}
                  </dd>
                </div>
                <div className="flex flex-col-reverse gap-2">
                  <dt className="text-mono-label text-muted">{d.stats.city}</dt>
                  <dd className="font-display text-4xl text-gold">{d.stats.cityValue}</dd>
                </div>
              </dl>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              {d.story.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  data-mw-reveal
                  className={`text-lg leading-relaxed text-ink/90 ${i > 0 ? 'mt-6' : ''}`}
                >
                  {paragraph}
                </p>
              ))}
              <p data-mw-reveal className="mt-10 border-l-2 border-gold/40 pl-5 text-muted">
                {dict.work.microdidactNote}
              </p>
            </div>
          </div>
        </section>

        {/* ── LA TRAVERSÉE — the sixteen forged pieces, crossed ─────────── */}
        <section className="border-t border-line">
          <header
            data-mw-reveal
            className="mx-auto max-w-[1640px] px-6 pt-24 pb-10 md:px-12 md:pt-28 lg:px-20"
          >
            <div className="max-w-3xl">
              <p className="text-mono-label text-gold/85">{d.constellation.eyebrow}</p>
              <h2 className="mt-5 text-3xl">{d.constellation.title}</h2>
              <p className="mt-6 text-lg text-muted">{d.constellation.intro}</p>
            </div>
          </header>

          {/* Filter chips — plain links (?cat=<slug>), so a visitor narrows the
              traversée BEFORE scrolling in. Dark stage → fixed hex (tone). */}
          <div data-mw-reveal className="mx-auto max-w-[1640px] px-6 pb-14 md:px-12 lg:px-20">
            <CategoryChips
              dict={dict}
              categories={chipCategories}
              hrefFor={(category) => `${worldPath}?cat=${categorySlugs[category]}`}
              activeSlug={activeCat ? categorySlugs[activeCat] : null}
              allHref={worldPath}
              tone="stage"
            />
          </div>

          <MicrodidactTraversee locale={locale} dict={dict} projects={projects} />
        </section>

        {/* ── THE WORLD'S ONE ASK — after the traversée and its index ────── */}
        <section className="border-t border-line px-6 py-24 md:px-12 md:py-28 lg:px-20">
          <div data-mw-reveal className="mx-auto max-w-[1640px]">
            <ConversionBand locale={locale} dict={dict} variant="world" />
          </div>
        </section>
      </div>

      {/* Persistent way back to the registre — hidden on phones (it sat on top
          of body copy); mobile relies on the in-flow exits instead */}
      <Link
        data-mw-back
        href={localizedPath(locale, 'work')}
        className="text-mono-label fixed bottom-6 left-6 z-40 hidden rounded-full border border-line bg-surface/80 px-5 py-3 text-muted backdrop-blur-md transition-colors duration-300 hover:border-gold/50 hover:text-ink sm:inline-flex"
      >
        ← {d.back}
      </Link>
    </main>
  )
}
