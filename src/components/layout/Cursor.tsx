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
      const interactive = !!(e.target as HTMLElement).closest(
        'a, button, input, textarea, label, summary, [data-cursor]',
      )
      document.documentElement.classList.toggle('is-cursor-active', interactive)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.classList.remove('is-cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden lg:block">
      <div
        ref={ring}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-white/90 transition-[width,height] duration-300 ease-out [html.is-cursor-active_&]:h-14 [html.is-cursor-active_&]:w-14"
        style={{ translate: '-50% -50%', mixBlendMode: 'difference' }}
      />
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white [html.is-cursor-active_&]:opacity-0"
        style={{ translate: '-50% -50%', mixBlendMode: 'difference' }}
      />
    </div>
  )
}
