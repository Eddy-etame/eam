'use client'

import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Scroll-driven chapter palettes — the unified identity. Sections declare
 * data-chapter="heraldic | atelier | editorial" and the ROOT palette morphs as
 * each chapter takes the viewport (CSS transitions on background/text tween
 * the change). One brand, chapters of navy, steel and paper inside it — no
 * visitor-facing theme switcher anymore; the narrative chooses.
 * Mounted from template.tsx so triggers rebuild on every route.
 */
export function ChapterPalette() {
  useGSAP(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', 'heraldic') // every route opens on the master key
    gsap.utils.toArray<HTMLElement>('[data-chapter]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) root.setAttribute('data-theme', el.dataset.chapter ?? 'heraldic')
        },
      })
    })
  })
  return null
}
