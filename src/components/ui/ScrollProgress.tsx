'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/** Gold hairline along the very top that fills with scroll progress. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.to(bar.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.4, invalidateOnRefresh: true },
    })
  })

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div
        ref={bar}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-gold-dim via-gold to-gold-bright"
      />
    </div>
  )
}
