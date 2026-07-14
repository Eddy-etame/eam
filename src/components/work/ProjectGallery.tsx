'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import * as THREE from 'three'
import { ProjectCard } from './ProjectCard'
import { InternalCard } from './InternalCard'
import type { HoverState } from './HoverField'
import {
  publicProjects,
  internalProjects,
  categoryLabels,
  type ProjectCategory,
} from '@/lib/projects'
import { cn } from '@/lib/utils'
import { gsap, Flip, useGSAP } from '@/lib/gsap'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

// Single shared WebGL hover layer — client-only, never SSR'd.
const HoverField = dynamic(() => import('./HoverField'), { ssr: false })

export function ProjectGallery({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const categories = useMemo(() => {
    const seen: ProjectCategory[] = []
    for (const project of publicProjects) {
      if (!seen.includes(project.category)) seen.push(project.category)
    }
    return seen
  }, [])

  const [active, setActive] = useState<ProjectCategory | 'all'>('all')
  const [enableFx, setEnableFx] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null)

  // Pointer/hover state for the shader, mutated without re-rendering.
  const state = useRef<HoverState>({
    x: 0.5,
    y: 0.5,
    hover: 0,
    cx: 0.5,
    cy: 0.5,
    w: 0.22,
    h: 0.22,
    color: new THREE.Color('#C9A96E'),
  })

  // Gate the WebGL overlay to pointer-capable desktops with motion allowed.
  useEffect(() => {
    setEnableFx(
      window.matchMedia('(min-width: 768px)').matches &&
        window.matchMedia('(hover: hover)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
  }, [])

  // Capture layout BEFORE the filter changes the DOM, so Flip can tween it.
  function select(next: ProjectCategory | 'all') {
    if (next === active) return
    const cards = gridRef.current?.querySelectorAll('[data-card]')
    if (cards?.length) flipState.current = Flip.getState(cards)
    setActive(next)
  }

  useGSAP(
    () => {
      if (!flipState.current) return
      Flip.from(flipState.current, {
        duration: 0.6,
        ease: 'eam-silk',
        absolute: true,
        scale: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' },
          ),
        onLeave: (els) =>
          gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.35, ease: 'power2.in' }),
      })
    },
    { dependencies: [active], scope: gridRef },
  )

  function onMove(e: React.MouseEvent) {
    const cont = gridRef.current?.getBoundingClientRect()
    if (!cont) return
    state.current.x = (e.clientX - cont.left) / cont.width
    state.current.y = (e.clientY - cont.top) / cont.height
  }

  function onEnterCard(e: React.MouseEvent, color: string) {
    const cont = gridRef.current?.getBoundingClientRect()
    if (!cont) return
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    state.current.cx = (r.left - cont.left + r.width / 2) / cont.width
    state.current.cy = (r.top - cont.top + r.height / 2) / cont.height
    state.current.w = r.width / cont.width
    state.current.h = r.height / cont.height
    state.current.color.set(color)
    state.current.hover = 1
  }

  const chip = (isActive: boolean) =>
    cn(
      'text-mono-label rounded-full border px-4 py-2 transition-colors duration-300',
      isActive
        ? 'border-gold bg-gold text-deep'
        : 'border-line text-muted hover:border-gold/50 hover:text-ink',
    )

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => select('all')} aria-pressed={active === 'all'} className={chip(active === 'all')}>
          {dict.work.filterAll}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => select(category)}
            aria-pressed={active === category}
            className={chip(active === category)}
          >
            {categoryLabels[category][locale]}
          </button>
        ))}
      </div>

      <div
        ref={gridRef}
        onMouseMove={enableFx ? onMove : undefined}
        onMouseLeave={enableFx ? () => (state.current.hover = 0) : undefined}
        className="relative mt-12"
      >
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {publicProjects.map((project) => {
            const shown = active === 'all' || project.category === active
            return (
              <div
                key={project.slug}
                data-card
                onMouseEnter={enableFx ? (e) => onEnterCard(e, project.color) : undefined}
                style={shown ? undefined : { display: 'none' }}
              >
                <ProjectCard project={project} locale={locale} />
              </div>
            )
          })}
        </div>

        {enableFx && (
          <div className="pointer-events-none absolute inset-0 z-10 mix-blend-screen" aria-hidden>
            <HoverField state={state} />
          </div>
        )}
      </div>

      {internalProjects.length > 0 && (
        <section className="mt-28 border-t border-line pt-16">
          <h2 className="text-3xl">{dict.work.internalSectionTitle}</h2>
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
