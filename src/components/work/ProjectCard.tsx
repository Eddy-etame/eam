'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { localizedPath } from '@/lib/seo'
import { categoryLabels } from '@/lib/taxonomy'
import type { Project } from '@/lib/projects'
import { gsap } from '@/lib/gsap'
import { BrowserFrame } from '@/components/ui/BrowserFrame'
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
  /** Thumb frame ratio — the woven solo band leads with a wide 16/10 panel. */
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

  return (
    <Link
      href={localizedPath(locale, `work/${project.slug}`)}
      data-cursor="voir"
      className="group block"
    >
      <article className="relative">
        {numeral && (
          <span
            aria-hidden
            className="pointer-events-none absolute -top-9 -left-1 z-0 font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-none text-ink/[0.08] select-none"
          >
            {numeral}
          </span>
        )}
        <div ref={frameRef} className="relative z-[1] will-change-transform">
          <BrowserFrame url={project.liveUrl !== '#' ? project.liveUrl : undefined}>
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
                  alt={`${project.name} — ${categoryLabels[project.category][locale]}`}
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
                  {categoryLabels[project.category][locale]}
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
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent transition-colors duration-500 group-hover:ring-gold/55 group-focus-visible:ring-gold/55"
          />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-ink transition-colors duration-300 group-hover:text-gold group-focus-visible:text-gold">
              {project.name}
            </h3>
            <p className="mt-1 text-muted">{project.tagline[locale]}</p>
          </div>
          <span
            aria-hidden
            className="mt-1.5 shrink-0 text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            →
          </span>
        </div>
      </article>
    </Link>
  )
}
