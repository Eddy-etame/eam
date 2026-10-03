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
 *
 * Only the sections on (or next to) the screen tween: they carry .is-near,
 * which is what globals.css hangs the colour transitions on. Everything
 * further away switches instantly, unseen — a page-wide morph ran a style
 * pass over every heading and paragraph of the document on each frame, and
 * that was the hitch felt at every chapter boundary while scrolling.
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

    const near = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.classList.toggle('is-near', entry.isIntersecting)
      },
      { rootMargin: '60% 0px' },
    )
    document.querySelectorAll('main section').forEach((section) => near.observe(section))
    return () => near.disconnect()
  })
  return null
}
