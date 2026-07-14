'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { ChapterPalette } from '@/components/providers/ChapterPalette'
import { ScrollProgress } from '@/components/ui/ScrollProgress'

/**
 * Route transition — every navigation re-mounts this template, which plays a
 * short heraldic enter (rise + un-clip). The very first paint is skipped so it
 * never fights the preloader ceremony; reduced motion renders instantly.
 */
let firstMount = true

export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (firstMount) {
        firstMount = false
        return
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const el = ref.current
      if (!el) return
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 26, clipPath: 'inset(3.5% 0 0 0)' },
        {
          autoAlpha: 1,
          y: 0,
          clipPath: 'inset(0% 0 0 0)',
          duration: 0.65,
          ease: 'eam-reveal',
          clearProps: 'all',
        },
      )
    },
    { scope: ref },
  )

  return (
    <>
      <ChapterPalette />
      <ScrollProgress />
      <div ref={ref}>{children}</div>
    </>
  )
}
