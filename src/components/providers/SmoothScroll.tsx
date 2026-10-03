'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

declare global {
  interface Window {
    /** The live Lenis instance — for in-page jumps that must ride the same scroll. */
    __eamLenis?: Lenis
  }
}

/**
 * Premium smooth scroll (Lenis) driven by GSAP's ticker and synced to
 * ScrollTrigger. Disabled entirely when the visitor prefers reduced motion.
 * Renders nothing — mounted once at the layout root.
 *
 * Lerp, not duration: a fixed-duration ease restarts on every wheel event, so
 * a trackpad's stream of small deltas turns into a swimmy, re-accelerating
 * scroll. A frame-rate-independent lerp chases the target continuously — the
 * same glide on a wheel, a trackpad and a 120 Hz screen. Touch keeps native
 * scrolling (the platform's own inertia is the smooth one there).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    })
    window.__eamLenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
      delete window.__eamLenis
    }
  }, [])

  return null
}
