'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/**
 * Heraldic intro. The crest is STROKE-DRAWN (stroke-dashoffset, pathLength=1 so
 * it's length-independent) while a 0→100 counter runs, then the crest fills gold
 * and the curtain lifts. Plays once per browsing session (sessionStorage).
 *
 * The overlay is rendered server-side too (identical markup → no hydration
 * mismatch) so it covers the page from the very first paint; GSAP removes it on
 * mount. A <noscript> rule hides it when JS is off so content stays reachable.
 *
 * ⚠️ PLACEHOLDER CREST — swap the <path> data below for the real EAM griffon
 *    vector when the client provides the SVG (keep `data-crest-draw` /
 *    `data-crest-fill` + `pathLength={1}` and the animation just works).
 */
const SESSION_KEY = 'eam:intro-shown'

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

      // Only the first load of a session gets the full ceremony.
      if (sessionStorage.getItem(SESSION_KEY)) {
        finish()
        return
      }
      sessionStorage.setItem(SESSION_KEY, '1')
      document.documentElement.classList.add('is-loading')

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (countRef.current) countRef.current.textContent = '100'
        gsap.to(el, { autoAlpha: 0, duration: 0.4, delay: 0.3, onComplete: finish })
        return
      }

      const counter = { v: 0 }
      const tl = gsap
        .timeline({ defaults: { ease: 'eam-gold' }, onComplete: finish })
        .fromTo(
          '[data-crest-draw]',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.05, ease: 'eam-silk', stagger: 0.09 },
          0,
        )
        .to(
          counter,
          {
            v: 100,
            duration: 1.2,
            ease: 'eam-snap',
            onUpdate: () => {
              if (countRef.current) countRef.current.textContent = String(Math.round(counter.v))
            },
          },
          0.08,
        )
        .to('[data-crest-fill]', { autoAlpha: 1, duration: 0.4 }, 0.95)
        // Heat-glow finale — the crest flashes like steel drawn from the forge.
        .to(
          '[data-preloader-svg]',
          { filter: 'drop-shadow(0 0 22px rgb(243 220 166 / 0.85))', duration: 0.28, ease: 'power2.in' },
          1.3,
        )
        .to(
          '[data-preloader-svg]',
          { filter: 'drop-shadow(0 0 6px rgb(201 169 110 / 0.25))', duration: 0.4, ease: 'power2.out' },
          1.58,
        )
        .fromTo(
          '[data-preloader-mark]',
          { autoAlpha: 0, letterSpacing: '0.2em' },
          { autoAlpha: 1, letterSpacing: '0.5em', duration: 0.45 },
          0.95,
        )
        .to('[data-preloader-inner]', { autoAlpha: 0, y: -14, duration: 0.4, ease: 'eam-reveal' }, '+=0.1')
        .to(el, { yPercent: -100, duration: 0.85, ease: 'eam-reveal' }, '-=0.1')

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
      <noscript>
        <style>{`[data-preloader]{display:none!important}`}</style>
      </noscript>

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[62vmin] w-[62vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgb(201 169 110 / 0.10), transparent 70%)' }}
      />

      <div data-preloader-inner className="relative flex flex-col items-center gap-7">
        <svg data-preloader-svg width="96" height="112" viewBox="0 0 120 140" fill="none" className="overflow-visible">
          <path
            data-crest-fill
            d="M60 8 L112 26 L112 70 C112 104 88 128 60 136 C32 128 8 104 8 70 L8 26 Z"
            fill="rgb(201 169 110 / 0.07)"
            style={{ opacity: 0 }}
          />
          <path
            data-crest-draw
            d="M60 8 L112 26 L112 70 C112 104 88 128 60 136 C32 128 8 104 8 70 L8 26 Z"
            pathLength={1}
            fill="none"
            stroke="var(--c-gold)"
            strokeWidth={1.4}
            strokeLinejoin="round"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
          <path
            data-crest-draw
            d="M28 50 L60 74 L92 50"
            pathLength={1}
            fill="none"
            stroke="var(--c-gold)"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
          <path
            data-crest-draw
            d="M60 28 L71 44 L60 60 L49 44 Z"
            pathLength={1}
            fill="none"
            stroke="var(--c-gold)"
            strokeWidth={1.4}
            strokeLinejoin="round"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
        </svg>

        <span
          data-preloader-mark
          className="font-display text-sm uppercase text-gold"
          style={{ letterSpacing: '0.2em', opacity: 0 }}
        >
          EAM
        </span>

        <div className="flex items-baseline gap-1 font-mono text-xs tracking-widest text-gold">
          <span ref={countRef}>0</span>
          <span className="text-muted">%</span>
        </div>
      </div>
    </div>
  )
}
