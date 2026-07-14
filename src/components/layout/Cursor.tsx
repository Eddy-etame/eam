'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

/**
 * EAM cursor — a lagging outer ring + near-instant inner dot, blended with
 * `difference` so it inverts against any chapter palette. Driven by
 * gsap.quickTo (one shared ticker with Lenis/ScrollTrigger — no private rAF),
 * and the blend region is the few px of ring/dot, not a full-screen layer.
 * Desktop-with-fine-pointer only; off for touch and reduced motion.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled || !ring.current || !dot.current) return

    const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' })
    const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })
    const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power2' })
    const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power2' })

    const onMove = (e: MouseEvent) => {
      ringX(e.clientX)
      ringY(e.clientY)
      dotX(e.clientX)
      dotY(e.clientY)
    }
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = !!target.closest('a, button, input, textarea, label, summary, [data-cursor]')
      const voir = !!target.closest('[data-cursor="voir"]')
      document.documentElement.classList.toggle('is-cursor-active', interactive && !voir)
      document.documentElement.classList.toggle('is-cursor-voir', voir)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.classList.remove('is-cursor-active', 'is-cursor-voir')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden lg:block">
      <div
        ref={ring}
        className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/90 transition-[width,height,background-color] duration-300 ease-out [html.is-cursor-active_&]:h-14 [html.is-cursor-active_&]:w-14 [html.is-cursor-voir_&]:h-16 [html.is-cursor-voir_&]:w-28 [html.is-cursor-voir_&]:bg-white"
        style={{ translate: '-50% -50%', mixBlendMode: 'difference' }}
      >
        {/* «Voir →» pill label — appears when hovering a project card */}
        <span className="text-mono-label select-none whitespace-nowrap text-black opacity-0 transition-opacity duration-200 [html.is-cursor-voir_&]:opacity-100">
          {typeof document !== 'undefined' && document.documentElement.lang === 'en'
            ? 'View →'
            : 'Voir →'}
        </span>
      </div>
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white [html.is-cursor-active_&]:opacity-0"
        style={{ translate: '-50% -50%', mixBlendMode: 'difference' }}
      />
    </div>
  )
}
