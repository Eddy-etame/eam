'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { CREST_PATHS, CREST_VIEWBOX } from './crest-paths'

/**
 * Heraldic intro — the REAL griffon crest builds itself line by line
 * (28 vector-traced subpaths, stroke-dashoffset with pathLength=1 so every
 * path draws length-independent), the fills breathe in, one heat-glow, and
 * the curtain lifts. Total ceremony ≈ 2.1s (was 3.2s); any pointer/key
 * fast-forwards at 4×; reduced motion gets a 0.6s fade.
 *
 * Plays once per browsing session. The overlay is SSR'd so it covers the very
 * first paint — and the inline <script> below hides it BEFORE paint on
 * repeat visits (the old version flashed "0%" for a frame on refresh).
 * A <noscript> rule hides it when JS is off so content stays reachable.
 */
const SESSION_KEY = 'eam:intro-shown'

/** Runs during HTML parse: repeat visits never paint the overlay at all. */
const NO_FLASH_JS = `try{if(sessionStorage.getItem('${SESSION_KEY}')){var s=document.currentScript;if(s&&s.parentElement)s.parentElement.style.display='none'}}catch(e){}`

export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      const finish = () => {
        el.style.display = 'none'
        document.documentElement.classList.remove('is-loading')
        // Handshake: the Hero holds its entrance until the curtain is gone.
        ;(window as Window & { __eamIntroDone?: boolean }).__eamIntroDone = true
        window.dispatchEvent(new Event('eam:intro-done'))
      }

      // Only the first load of a session gets the ceremony (the inline script
      // already hid the overlay pre-paint on repeat visits — just release).
      if (sessionStorage.getItem(SESSION_KEY)) {
        finish()
        return
      }
      sessionStorage.setItem(SESSION_KEY, '1')
      document.documentElement.classList.add('is-loading')

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (countRef.current) countRef.current.textContent = '100'
        gsap.set('[data-crest-fill]', { opacity: 1 })
        gsap.to(el, { autoAlpha: 0, duration: 0.4, delay: 0.2, onComplete: finish })
        return
      }

      const counter = { v: 0 }
      const tl = gsap
        .timeline({ defaults: { ease: 'eam-gold' }, onComplete: finish })
        // 1 — the lines of the crest forge themselves, wing to letterform
        .to(
          '[data-crest-draw]',
          {
            strokeDashoffset: 0,
            duration: 0.85,
            ease: 'eam-silk',
            stagger: { amount: 0.55 },
          },
          0,
        )
        .to(
          counter,
          {
            v: 100,
            duration: 1.15,
            ease: 'eam-snap',
            onUpdate: () => {
              if (countRef.current) countRef.current.textContent = String(Math.round(counter.v))
            },
          },
          0.05,
        )
        // 2 — the mark fills like poured metal; the scaffolding lines recede
        .to('[data-crest-fill]', { opacity: 1, duration: 0.45, stagger: { amount: 0.15 } }, 1.05)
        .to('[data-crest-draw]', { opacity: 0.25, duration: 0.4 }, 1.15)
        // 3 — one heat-glow off the forge
        .to(
          '[data-preloader-svg]',
          { filter: 'drop-shadow(0 0 20px rgb(243 220 166 / 0.8))', duration: 0.22, ease: 'power2.in' },
          1.3,
        )
        .to(
          '[data-preloader-svg]',
          { filter: 'drop-shadow(0 0 5px rgb(201 169 110 / 0.25))', duration: 0.3, ease: 'power2.out' },
          1.52,
        )
        // 4 — the curtain lifts into the site
        .to('[data-preloader-inner]', { autoAlpha: 0, y: -14, duration: 0.3, ease: 'eam-reveal' }, 1.62)
        .to(el, { yPercent: -100, duration: 0.6, ease: 'eam-reveal' }, 1.72)

      // Impatience is allowed: any click/keypress fast-forwards the ceremony.
      const skip = () => tl.timeScale(4)
      window.addEventListener('pointerdown', skip, { once: true })
      window.addEventListener('keydown', skip, { once: true })
      return () => {
        window.removeEventListener('pointerdown', skip)
        window.removeEventListener('keydown', skip)
      }
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      data-preloader
      data-theme="heraldic"
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-deep text-ink"
    >
      {/* Pre-paint gate for repeat visits — must be the FIRST child. */}
      <script dangerouslySetInnerHTML={{ __html: NO_FLASH_JS }} />

      <noscript>
        <style>{`[data-preloader]{display:none!important}`}</style>
      </noscript>

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[62vmin] w-[62vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgb(201 169 110 / 0.10), transparent 70%)' }}
      />

      <div data-preloader-inner className="relative flex flex-col items-center gap-8">
        <svg
          data-preloader-svg
          width="188"
          height="188"
          viewBox={CREST_VIEWBOX}
          fill="none"
          className="overflow-visible"
        >
          {/* Fills first (painted under the strokes), then the drawing lines */}
          {CREST_PATHS.map((d, i) => (
            <path key={`f${i}`} data-crest-fill d={d} fill="var(--c-ink)" style={{ opacity: 0 }} />
          ))}
          {CREST_PATHS.map((d, i) => (
            <path
              key={`s${i}`}
              data-crest-draw
              d={d}
              pathLength={1}
              fill="none"
              stroke="var(--c-gold)"
              strokeWidth={2.4}
              strokeLinejoin="round"
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          ))}
        </svg>

        <div className="flex items-baseline gap-1 font-mono text-xs tracking-widest text-gold">
          <span ref={countRef}>0</span>
          <span className="text-muted">%</span>
        </div>
      </div>
    </div>
  )
}
