'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, SplitText } from '@/lib/gsap'

/**
 * Shared entrance for inner-page headers — the hero's grammar at ~60% of its
 * duration, so no page opens on a dead stage (audit 2026-07-29: the service
 * landing pages are the SEO doors and had zero ceremony). Children tag their
 * parts with data-pe="eyebrow" | "title" | "lead" | "cta"; the title gets a
 * masked line rise (SplitText by lines, reverted on cleanup), everything else
 * a soft rise. Plays after the preloader curtain via the same
 * __eamIntroDone / eam:intro-done handshake the hero uses; on client-side nav
 * the flag is already true and it plays right after the template rise.
 * Reduced motion: everything stays visible, nothing moves.
 */
export function PageEntrance({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const eyebrow = el.querySelectorAll<HTMLElement>('[data-pe="eyebrow"]')
      const title = el.querySelector<HTMLElement>('[data-pe="title"]')
      const rest = el.querySelectorAll<HTMLElement>('[data-pe="lead"], [data-pe="cta"]')

      // Masked line rise on the title — lines only, reverted on cleanup so the
      // DOM copy stays canonical for SEO and later re-renders.
      const split = title ? new SplitText(title, { type: 'lines', linesClass: 'pe-line' }) : null
      split?.lines.forEach((line) => {
        const mask = document.createElement('div')
        mask.style.overflow = 'hidden'
        line.parentNode?.insertBefore(mask, line)
        mask.appendChild(line)
      })

      gsap.set(eyebrow, { autoAlpha: 0, y: 14 })
      if (split) gsap.set(split.lines, { yPercent: 110 })
      gsap.set(rest, { autoAlpha: 0, y: 18 })

      const tl = gsap
        .timeline({ paused: true, defaults: { ease: 'eam-reveal' } })
        .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.5 }, 0)
        .to(split ? split.lines : [], { yPercent: 0, duration: 0.8, stagger: 0.08 }, 0.08)
        .to(rest, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.35)

      const win = window as Window & { __eamIntroDone?: boolean }
      const play = () => tl.play()
      if (win.__eamIntroDone) play()
      else window.addEventListener('eam:intro-done', play, { once: true })

      return () => {
        window.removeEventListener('eam:intro-done', play)
        // Unwrap the masks before reverting so SplitText restores clean DOM.
        split?.lines.forEach((line) => {
          const mask = line.parentElement
          if (mask && mask !== title) mask.replaceWith(line)
        })
        split?.revert()
      }
    },
    { scope: root },
  )

  return <div ref={root}>{children}</div>
}
