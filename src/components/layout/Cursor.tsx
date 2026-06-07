'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * EAM cursor — a lagging outer ring + instant inner dot, blended with
 * `difference` so it inverts against any theme. Expands over interactive
 * elements. Desktop-with-fine-pointer only; off for touch and reduced motion.
 * Deliberately restrained — not the generic "magnetic blob".
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setEnabled(true)

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px)`
    }
    const onOver = (e: MouseEvent) => {
      const interactive = !!(e.target as HTMLElement).closest(
        'a, button, input, textarea, label, [data-cursor]',
      )
      document.documentElement.classList.toggle('is-cursor-active', interactive)
    }

    let raf = 0
    const loop = () => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.classList.remove('is-cursor-active')
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] hidden lg:block"
      style={{ mixBlendMode: 'difference' }}
    >
      <div
        ref={ring}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-white/90 transition-[width,height] duration-300 ease-out [html.is-cursor-active_&]:h-14 [html.is-cursor-active_&]:w-14"
        style={{ translate: '-50% -50%' }}
      />
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white [html.is-cursor-active_&]:opacity-0"
        style={{ translate: '-50% -50%' }}
      />
    </div>
  )
}
