'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectCard } from './ProjectCard'
import { InternalCard } from './InternalCard'
import { ConversionBand } from '@/components/ui/ConversionBand'
import {
  publicProjects,
  soloProjects,
  microdidactProjects,
  internalProjects,
} from '@/lib/projects'
import { localizedPath } from '@/lib/seo'
import { gsap } from '@/lib/gsap'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

// Single shared WebGL gallery layer — client-only, never SSR'd. Reads the
// [data-gl-thumb] frames in the DOM (CONTRACT: data-thumb-src + data-color).
const GalleryField = dynamic(() => import('./GalleryField'), { ssr: false })

/** Lightened tint target for the page-palette morph (matches --c-gold-bright). */
const GOLD_TINT = '#F3DCA6'

function expandHex(hex: string): string {
  const h = hex.replace('#', '')
  return h.length === 3 ? h.split('').map((c) => c + c).join('') : h
}

/** Mix two hex colours — t=0 → a, t=1 → b. */
function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(expandHex(a), 16)
  const pb = parseInt(expandHex(b), 16)
  const ch = (shift: number) =>
    Math.round(((pa >> shift) & 255) * (1 - t) + ((pb >> shift) & 255) * t)
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`
}

function hexToRgba(hex: string, alpha: number): string {
  const p = parseInt(expandHex(hex), 16)
  return `rgba(${(p >> 16) & 255}, ${(p >> 8) & 255}, ${p & 255}, ${alpha})`
}

/** GSAP-safe colour: normalise modern `rgb(r g b / a)` syntax to rgba(). */
function normalizeColor(value: string): string {
  const m = value.match(
    /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[/,]\s*([\d.]+%?))?\s*\)/,
  )
  if (!m) return value
  const a = m[4] ? (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4])) : 1
  return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${a})`
}

const pad2 = (n: number) => String(n).padStart(2, '0')

/** Deep navy used for the Microdidact door's palette morph (no screenshot to sample). */
const MICRODIDACT_NAVY = '#1B2559'

/** Editorial order for the solo band — the SaaS with real scale leads. */
const SOLO_RANK: Record<string, number> = { kermhosting: 0, inlet: 1, 'jcboyang-conseil': 2 }

/**
 * MAIN REGISTRE v2 — no leak. The 16 Microdidact projects and the Boxing
 * Center salle pages live inside their worlds; the registre shows exactly:
 * two monumental world doors, the solo works, and the Coffre.
 */
export function ProjectGallery({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [enableFx, setEnableFx] = useState(false)
  const [enablePalette, setEnablePalette] = useState(false)

  // CONTRACT (Agent B): dict.work.enterWorld — fr «Entrer» / en “Enter”.
  // Tolerant read so this file typechecks whichever change lands first.
  const enterWorld =
    (dict.work as typeof dict.work & { enterWorld?: string }).enterWorld ??
    (locale === 'fr' ? 'Entrer' : 'Enter')

  const bc = publicProjects.find((p) => p.slug === 'boxing-center')

  // Solo works only — the Boxing Center entries are doors/world content now.
  const solos = soloProjects
    .filter((p) => !p.slug.startsWith('boxing-center'))
    .sort((a, b) => (SOLO_RANK[a.slug] ?? 99) - (SOLO_RANK[b.slug] ?? 99))

  // Registre inventory: 2 world doors + the solos, numbered in visible order.
  const totalEntries = 2 + solos.length

  // Gate the WebGL overlay to pointer-capable desktops with motion allowed;
  // the palette morph only needs a real hover pointer + motion allowed.
  useEffect(() => {
    const hover = window.matchMedia('(hover: hover)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnableFx(window.matchMedia('(min-width: 768px)').matches && hover && !reduced)
    setEnablePalette(hover && !reduced)
  }, [])

  // Clean up any in-flight palette override if the gallery unmounts mid-hover.
  useEffect(() => {
    return () => {
      const root = document.documentElement
      gsap.killTweensOf(root, '--c-gold,--c-line-strong')
      root.style.removeProperty('--c-gold')
      root.style.removeProperty('--c-line-strong')
    }
  }, [])

  // ── Page-palette morph (Lusion mechanism) ────────────────────────────────
  // On card/door hover, tint the root gold toward the project colour; on
  // leave, tween back to whatever the ACTIVE chapter theme defines, release.
  function onPaletteEnter(color: string) {
    const root = document.documentElement
    const tint = mixHex(color, GOLD_TINT, 0.35)
    gsap.killTweensOf(root, '--c-gold,--c-line-strong')
    gsap.to(root, {
      '--c-gold': tint,
      '--c-line-strong': hexToRgba(tint, 0.4),
      duration: 0.5,
      ease: 'eam-silk',
      overwrite: 'auto',
    })
  }

  function onPaletteLeave() {
    const root = document.documentElement
    gsap.killTweensOf(root, '--c-gold,--c-line-strong')
    // Read the values the active theme defines by lifting the inline override.
    const inlineGold = root.style.getPropertyValue('--c-gold')
    const inlineLine = root.style.getPropertyValue('--c-line-strong')
    root.style.removeProperty('--c-gold')
    root.style.removeProperty('--c-line-strong')
    const cs = getComputedStyle(root)
    const themeGold = normalizeColor(cs.getPropertyValue('--c-gold').trim())
    const themeLine = normalizeColor(cs.getPropertyValue('--c-line-strong').trim())
    if (inlineGold) root.style.setProperty('--c-gold', inlineGold)
    if (inlineLine) root.style.setProperty('--c-line-strong', inlineLine)
    gsap.to(root, {
      '--c-gold': themeGold,
      '--c-line-strong': themeLine,
      duration: 0.5,
      ease: 'eam-silk',
      overwrite: 'auto',
      onComplete: () => {
        root.style.removeProperty('--c-gold')
        root.style.removeProperty('--c-line-strong')
      },
    })
  }

  const paletteProps = (color: string) =>
    enablePalette
      ? { onMouseEnter: () => onPaletteEnter(color), onMouseLeave: onPaletteLeave }
      : {}

  // Shared door chrome — everything that must stay legible ABOVE the WebGL
  // plane (z-20 beats the field's z-10 overlay; no transformed ancestor here,
  // so the stacking holds while the stage beneath scales/gets its GL twin).
  const doorSweep = (
    <span
      aria-hidden
      className="absolute inset-y-0 left-0 w-1/3 -translate-x-[130%] -skew-x-12 opacity-0 transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[330%] group-hover:opacity-100"
      style={{
        background:
          'linear-gradient(90deg, transparent, color-mix(in srgb, var(--c-gold) 22%, transparent) 50%, transparent)',
      }}
    />
  )

  const doorRing = (
    <span
      aria-hidden
      className="absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent transition-colors duration-500 group-hover:ring-gold/60 group-focus-visible:ring-gold/60"
    />
  )

  const doorFrame = (
    <span aria-hidden className="absolute inset-3 rounded-md border border-line/60 sm:inset-4" />
  )

  const doorEnter = (
    <span className="absolute bottom-5 right-5 flex translate-y-3 items-center gap-2 text-gold opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:bottom-7 sm:right-7">
      <span className="text-mono-label">{enterWorld}</span>
      <span aria-hidden>→</span>
    </span>
  )

  return (
    <div>
      {/* ── Inventory line — the registre's index, no chips ───────────────── */}
      <div className="flex items-center gap-5">
        <span aria-hidden className="hairline flex-1" />
        <span className="text-mono-label shrink-0 tabular-nums text-muted">
          N°01 — N°{pad2(totalEntries)}
        </span>
      </div>

      <div className="relative mt-12">
        {/* ── THE TWO DOORS — monumental thresholds into the worlds ───────── */}
        {/* Heading order (audit P2): the door/card h3s need an h2 ancestor. */}
        <h2 className="sr-only">{dict.work.doorsHeading}</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Door N°01 — MICRODIDACT. A navy stage: aura, ghost numeral,
              inverted wordmark. Hover = the door opens. */}
          <div {...paletteProps(MICRODIDACT_NAVY)}>
            <Link
              href={localizedPath(locale, 'work/microdidact')}
              data-cursor="voir"
              className="group block"
            >
              <article className="relative min-h-[48vh] overflow-hidden rounded-lg border border-line bg-navy lg:min-h-[60vh]">
                {/* Stage — scales when the door opens (GL-free: wordmark only). */}
                <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(70% 90% at 50% 40%, color-mix(in srgb, var(--c-gold) 11%, transparent), transparent 70%)',
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute -bottom-[0.14em] -right-3 select-none font-display text-[clamp(13rem,24vw,22rem)] leading-none text-ink/[0.05]"
                  >
                    {microdidactProjects.length}
                  </span>
                  <span className="absolute inset-0 grid place-items-center px-10">
                    <Image
                      src="/logos/microdidact.png"
                      alt="Microdidact"
                      width={640}
                      height={131}
                      className="w-[62%] max-w-[440px] opacity-90 [filter:brightness(0)_invert(0.94)]"
                    />
                  </span>
                </div>

                {/* Chrome — above the field overlay so it never drowns. */}
                <div className="pointer-events-none absolute inset-0 z-20">
                  {doorFrame}
                  {doorSweep}
                  <span className="text-mono-label absolute left-5 top-5 rounded bg-black/40 px-2 py-1 text-gold-bright backdrop-blur-sm sm:left-7 sm:top-7">
                    {dict.work.microdidactBadge}
                  </span>
                  <span
                    aria-hidden
                    className="text-mono-label absolute right-5 top-5 tabular-nums text-muted sm:right-7 sm:top-7"
                  >
                    N°01
                  </span>
                  <div className="absolute bottom-5 left-5 right-24 sm:bottom-7 sm:left-7">
                    <span
                      aria-hidden
                      className="block font-display text-[clamp(3.5rem,7vw,6rem)] leading-[0.9] text-ink transition-colors duration-500 group-hover:text-gold"
                    >
                      {pad2(microdidactProjects.length)}
                    </span>
                    <p className="mt-3 hidden max-w-md text-sm text-muted sm:block">
                      {dict.work.microdidactNote}
                    </p>
                  </div>
                  {doorEnter}
                  {doorRing}
                </div>
              </article>
            </Link>
          </div>

          {/* Door N°02 — BOXING CENTER. A brand stage (navy, ring-light red,
              ghost crest) — never a salle screenshot: every capture we own
              belongs to ONE salle's site, and the door speaks for the network. */}
          {bc && (
            <div {...paletteProps(bc.color)}>
              <Link
                href={localizedPath(locale, 'work/boxing-center')}
                data-cursor="voir"
                className="group block"
              >
                <article className="relative min-h-[48vh] overflow-hidden rounded-lg border border-line bg-deep lg:min-h-[60vh]">
                  {/* Stage — house navy, low red glow, oversized ghost crest. */}
                  <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                    <span
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(165deg, ${bc.color} 0%, #131630 52%, var(--c-deep) 100%)`,
                      }}
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-80 transition-opacity duration-700 group-hover:opacity-100"
                      style={{
                        background:
                          'radial-gradient(ellipse 62% 46% at 50% 68%, #E8001C2E 0%, transparent 70%)',
                      }}
                    />
                    {/* Curated, not stuffy: the crest breathes in negative space
                        like the Microdidact door's wordmark (Eddy 2026-07-15) */}
                    <span className="absolute left-1/2 top-[42%] w-[min(46%,300px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.85]">
                      <Image
                        src="/logos/boxing-center.png"
                        alt=""
                        width={640}
                        height={299}
                        sizes="(max-width: 1024px) 46vw, 300px"
                        className="h-auto w-full"
                        style={{ filter: 'brightness(0) invert(1)', opacity: 0.92 }}
                      />
                    </span>
                  </div>

                  {/* Chrome — gradient + copy live ABOVE the GL plane. */}
                  <div className="pointer-events-none absolute inset-0 z-20">
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10"
                    />
                    {doorFrame}
                    {doorSweep}
                    <span
                      aria-hidden
                      className="text-mono-label absolute right-5 top-5 tabular-nums text-white/70 sm:right-7 sm:top-7"
                    >
                      N°02
                    </span>
                    <span
                      aria-hidden
                      className="absolute -bottom-[0.14em] -right-2 select-none font-display text-[clamp(9rem,16vw,15rem)] leading-none text-white/[0.06]"
                    >
                      05
                    </span>
                    <div className="absolute bottom-5 left-5 right-24 sm:bottom-7 sm:left-7">
                      <span
                        aria-hidden
                        className="text-mono-label tabular-nums text-gold-bright"
                      >
                        5 salles + boutique · Toulouse — {bc.year}
                      </span>
                      <h3 className="mt-2 font-display text-3xl text-white sm:text-4xl">
                        {bc.name}
                      </h3>
                      <p className="mt-2 max-w-md text-sm text-white/75">
                        {bc.tagline[locale]}
                      </p>
                    </div>
                    {doorEnter}
                    {doorRing}
                  </div>
                </article>
              </Link>
            </div>
          )}
        </div>

        {/* ── LES SOLOS — asymmetric woven band, not a uniform grid ─────────
            First solo spans wide (16/10); the others stack offset at 5/12. */}
        {solos.length > 0 && <h2 className="sr-only">{dict.work.solosHeading}</h2>}
        {solos.length > 0 && (
          <div className="mt-20 grid gap-x-8 gap-y-14 md:grid-cols-12">
            <div className="md:col-span-7" {...paletteProps(solos[0].color)}>
              <ProjectCard
                project={solos[0]}
                locale={locale}
                numeral="N°03"
                aspectClass="aspect-[16/10]"
              />
            </div>
            <div className="flex flex-col gap-y-14 md:col-span-5 md:mt-24">
              {solos.slice(1).map((project, index) => (
                <div key={project.slug} {...paletteProps(project.color)}>
                  <ProjectCard
                    project={project}
                    locale={locale}
                    numeral={`N°${pad2(index + 4)}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {enableFx && (
          <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
            <GalleryField />
          </div>
        )}
      </div>

      {/* ── The registre's one ask — after the works, before the vault ────── */}
      <div className="mt-24">
        <ConversionBand locale={locale} dict={dict} variant="registre" />
      </div>

      {/* ── LE COFFRE — internal & confidential tools (unchanged) ─────────── */}
      {internalProjects.length > 0 && (
        <section data-chapter="atelier" className="mt-28 border-t border-line pt-16">
          <h2 className="foil text-3xl">{dict.work.internalSectionTitle}</h2>
          <p className="mt-4 max-w-2xl text-muted">{dict.work.internalNote}</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {internalProjects.map((project) => (
              <InternalCard key={project.slug} project={project} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
