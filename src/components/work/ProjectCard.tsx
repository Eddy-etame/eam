'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { localizedPath } from '@/lib/seo'
import { categoryLabels } from '@/lib/taxonomy'
import type { Project } from '@/lib/projects'
import { gsap, useGSAP } from '@/lib/gsap'
import { BrowserFrame } from '@/components/ui/BrowserFrame'
import { PhoneCapture } from '@/components/ui/PhoneCapture'
import type { Locale } from '@/i18n/config'

function initials(name: string): string {
  return name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

/**
 * Public project card. Uses a branded gradient + initials tile rather than a
 * fragile hot-linked logo, so the gallery stays cohesive and never shows a
 * broken image. Links to the case study.
 *
 * Registre upgrades: optional aria-hidden inventory numeral (Fraunces,
 * half-behind the thumb), data-cursor="voir" for the custom cursor pill,
 * a subtle pointer-tilt on the thumb frame (hover-capable pointers only),
 * and data-gl-thumb attributes consumed by the WebGL GalleryField overlay.
 *
 * PHONE SCREENS (below `sm`, 2026-11-08): the card leads with the phone
 * capture — /thumbs/<slug>-m.jpg, a real 430×932 viewport — inside a
 * PhoneFrame (see PhoneCapture, which also draws the portrait poster for a
 * project without a phone twin). The desktop capture shrunk into a 4/3
 * strip was unreadable at card size (Eddy, on the case pages: "we can't even
 * see the images properly"). The desktop frame stays in the DOM
 * (`hidden sm:block`) and takes over from `sm` up, so the woven band, the
 * pinned rail and the WebGL overlay are untouched — a display:none twin is
 * never fetched. On a phone the trade, the Microdidact mark and the year move
 * from the capture (whose own header owns the top edge) to the caption, as a
 * mono line under the tagline. Cells narrower than 15rem (the registre's
 * two-up grid) take the smaller caption sizes through a container query.
 */
export function ProjectCard({
  project,
  locale,
  numeral,
  aspectClass = 'aspect-[4/3]',
}: {
  project: Project
  locale: Locale
  /** Inventory numeral, e.g. "N°07" — stable index in the visible registre. */
  numeral?: string
  /** Desktop thumb frame ratio — the woven solo band leads with a wide 16/10 panel. */
  aspectClass?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)

  // Pointer-tilt on the thumb frame — max ±5deg, springs back on leave.
  // Desktop pointers only; reduced-motion users get the static card.
  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    if (!window.matchMedia('(hover: hover)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.set(el, { transformPerspective: 700 })
    const toRx = gsap.quickTo(el, 'rotationX', { duration: 0.45, ease: 'eam-silk' })
    const toRy = gsap.quickTo(el, 'rotationY', { duration: 0.45, ease: 'eam-silk' })

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - r.left) / r.width - 0.5 // [-0.5, 0.5]
      const dy = (e.clientY - r.top) / r.height - 0.5
      toRy(dx * 10) // → max ±5deg
      toRx(dy * -10)
    }
    const onLeave = () => {
      toRx(0)
      toRy(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el, 'rotationX,rotationY')
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [])

  // The site under the glass — in the registre and any grid, the phone capture
  // scrolls through what was walked below its window (up to three fifths of a
  // screen) as the card crosses the viewport: scrub, transform-only. The home
  // rail drives its own drift from scrollLeft, so a card inside a rail strip is
  // skipped; a hidden twin (sm and up) has no box and is skipped too.
  useGSAP(
    () => {
      const el = frameRef.current
      if (!el || el.closest('[data-rail-strip]')) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const layer = el.querySelector<HTMLElement>('[data-rail-media="phone"] [data-rail-thumb]')
      const win = layer?.closest<HTMLElement>('[data-rail-window]')
      if (!layer || !win || layer.offsetParent === null) return
      const travel = () => -Math.min(Math.max(0, layer.offsetHeight - win.offsetHeight), win.offsetHeight * 0.6)
      gsap.fromTo(
        layer,
        { y: 0 },
        {
          y: travel,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        },
      )
    },
    { scope: frameRef },
  )

  const label = categoryLabels[project.category][locale]
  const url = project.liveUrl !== '#' ? project.liveUrl : undefined
  const alt = `${project.name} — ${label}`

  return (
    <Link
      href={localizedPath(locale, `work/${project.slug}`)}
      data-cursor="voir"
      className="group block"
    >
      <article className="@container relative">
        {numeral && (
          <span
            aria-hidden
            className="pointer-events-none absolute -top-9 -left-1 z-0 font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-none text-ink/[0.08] select-none"
          >
            {numeral}
          </span>
        )}
        <div ref={frameRef} className="@container relative z-[1] will-change-transform">
          {/* ── Below `sm`: the phone capture in its frame (or the portrait poster) ── */}
          <div className="sm:hidden">
            <PhoneCapture
              name={project.name}
              url={url}
              color={project.color}
              thumb={project.thumb}
              thumbM={project.thumbM}
              alt={alt}
            />
          </div>

          {/* ── From `sm`: the browser frame and the desktop capture (unchanged) ── */}
          <div className="hidden sm:block">
            <BrowserFrame url={url}>
              {/* GL contract: [data-gl-thumb] stays on the media area only —
                  the overlay twins THIS rect, not the chrome bar above it. */}
              <div
                data-gl-thumb={project.thumb ? '' : undefined}
                data-thumb-src={project.thumb || undefined}
                data-color={project.thumb ? project.color : undefined}
                className={`relative ${aspectClass} overflow-hidden`}
                style={{ background: `linear-gradient(135deg, ${project.color}, var(--c-navy) 82%)` }}
              >
                {project.thumb ? (
                  <Image
                    src={project.thumb}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute inset-0 grid place-items-center font-display text-[clamp(3rem,10vw,7rem)] text-white/10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  >
                    {initials(project.name)}
                  </span>
                )}
                <span className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="text-mono-label rounded bg-black/40 px-2 py-1 text-white/90 backdrop-blur-sm">
                    {label}
                  </span>
                  {project.underMicrodidact && (
                    <span className="text-mono-label rounded bg-black/40 px-2 py-1 text-gold-bright backdrop-blur-sm">
                      Microdidact
                    </span>
                  )}
                </span>
                <span className="text-mono-label absolute bottom-4 right-4 text-white/70 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
                  {project.year}
                </span>
              </div>
            </BrowserFrame>
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[clamp(18px,9cqi,30px)] ring-1 ring-inset ring-transparent transition-colors duration-500 group-hover:ring-gold/55 group-focus-visible:ring-gold/55 sm:rounded-lg"
          />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4 @max-[15rem]:mt-4">
          <div>
            <h3 className="font-display text-2xl text-ink transition-colors duration-300 group-hover:text-gold group-focus-visible:text-gold @max-[15rem]:text-xl">
              {project.name}
            </h3>
            <p className="mt-1 text-muted @max-[15rem]:text-sm">{project.tagline[locale]}</p>
            {/* Phone screens: what the chips say on the desktop capture */}
            <p className="text-mono-label mt-2.5 flex flex-wrap gap-x-2 text-faint sm:hidden">
              <span>{label}</span>
              {project.underMicrodidact && (
                <span className="text-gold-bright">
                  <span aria-hidden className="text-faint">· </span>Microdidact
                </span>
              )}
              <span>
                <span aria-hidden>· </span>
                {project.year}
              </span>
            </p>
          </div>
          <span
            aria-hidden
            className="mt-1.5 shrink-0 text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
          >
            →
          </span>
        </div>
      </article>
    </Link>
  )
}
