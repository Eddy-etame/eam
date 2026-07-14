'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/**
 * Rolls a numeric stat from 0 to its value when it scrolls into view (same
 * counter recipe as the preloader). Non-numeric prefixes bail out gracefully;
 * suffixes ('+', '%') are preserved. Reduced motion renders the final value.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const match = value.match(/^(\d+)(.*)$/)
      if (!match) return
      const target = Number(match[1])
      const suffix = match[2] ?? ''
      const proxy = { v: 0 }
      gsap.to(proxy, {
        v: target,
        duration: 1.6,
        ease: 'eam-snap',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        onStart: () => {
          el.textContent = `0${suffix}`
        },
        onUpdate: () => {
          el.textContent = `${Math.round(proxy.v)}${suffix}`
        },
      })
    },
    { scope: ref },
  )

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
