'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import dynamic from 'next/dynamic'
import { gsap, useGSAP } from '@/lib/gsap'
import { team } from '@/lib/team'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { TeamDuotoneDefs } from '@/components/three/TeamDuotoneDefs'

const TeamCanvas = dynamic(() => import('@/components/three/TeamCanvas'), { ssr: false })
const TeamFigure3D = dynamic(() => import('@/components/three/TeamFigure3D'), { ssr: false })

export function TeamSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const root = useRef<HTMLElement>(null)
  const { team: t } = dict
  const [enable3D, setEnable3D] = useState(false)

  // WebGL mist only on desktop with motion allowed (same gate as the Hero).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 767px)').matches
    if (!reduce && !small) setEnable3D(true)
  }, [])

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const bands = gsap.utils.toArray<HTMLElement>('[data-band]')
      bands.forEach((band) => {
        gsap
          .timeline({
            scrollTrigger: { trigger: band, start: 'top 72%' },
            defaults: { ease: 'eam-reveal' },
          })
          .from(band.querySelectorAll('[data-portrait]'), {
            autoAlpha: 0,
            y: 44,
            scale: 0.98,
            duration: 1.1,
          })
          .from(band.querySelectorAll('[data-ordinal]'), { autoAlpha: 0, y: 20, duration: 0.7 }, '-=0.85')
          .from(
            band.querySelectorAll('[data-name-inner]'),
            { yPercent: 118, duration: 0.9, stagger: 0.05 },
            '-=0.7',
          )
          .from(
            band.querySelectorAll('[data-meta]'),
            { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.12 },
            '-=0.5',
          )
      })
    },
    { scope: root },
  )

  // Interactive 3D parallax — each figure leans toward the cursor, fog drifts behind
  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cleanups: Array<() => void> = []
    el.querySelectorAll<HTMLElement>('[data-band]').forEach((band) => {
      const tilt = band.querySelector<HTMLElement>('[data-tilt]')
      if (!tilt) return
      const fog = band.querySelector<HTMLElement>('.team-fog')
      const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.7, ease: 'power3' })
      const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.7, ease: 'power3' })
      const fx = fog ? gsap.quickTo(fog, 'xPercent', { duration: 0.9, ease: 'power3' }) : null
      const onMove = (e: PointerEvent) => {
        const r = band.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width - 0.5
        const ny = (e.clientY - r.top) / r.height - 0.5
        ry(nx * 13)
        rx(-ny * 9)
        fx?.(-nx * 5)
      }
      const onLeave = () => {
        ry(0)
        rx(0)
        fx?.(0)
      }
      band.addEventListener('pointermove', onMove)
      band.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        band.removeEventListener('pointermove', onMove)
        band.removeEventListener('pointerleave', onLeave)
      })
    })
    return () => cleanups.forEach((c) => c())
  }, [])

  return (
    <section
      ref={root}
      data-team-mode="mono"
      className="team-stage relative border-t border-line px-6 py-24 md:px-12 md:py-28 lg:px-20"
    >
      <TeamDuotoneDefs />

      {/* WebGL atmosphere — sticky mist that persists through the stage scroll */}
      {enable3D && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <div className="sticky top-0 h-screen w-full">
            <TeamCanvas />
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-[1640px]">
        {/* Header */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-mono-label text-gold/85">{t.eyebrow}</p>
            <h2 className="mt-5 text-3xl">{t.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">{t.intro}</p>
          </div>
        </div>

        {/* The three craftsmen, each a numbered chapter — pinned to the
            heraldic mist (the shade toggle served its review purpose). */}
        <div className="mt-2">
          {team.map((m, i) => {
            const ordinal = String(i + 1).padStart(3, '0')
            const left = i % 2 === 0
            const cutout = m.image ? ({ ['--cutout']: `url(${m.image})` } as CSSProperties) : undefined
            return (
              <article
                key={m.id}
                data-band
                className="relative grid items-center gap-8 py-16 md:min-h-[78svh] md:grid-cols-12 md:gap-12 md:py-10"
              >
                {/* Ghost ordinal */}
                <span
                  data-ordinal
                  aria-hidden
                  className="pointer-events-none absolute -top-2 -z-10 select-none font-mono text-[22vw] leading-none text-line md:text-[12vw] lg:text-[9rem]"
                  style={left ? { left: '1%' } : { right: '1%' }}
                >
                  {ordinal}
                </span>

                {/* Portrait */}
                <figure
                  data-portrait
                  className={`team-portrait relative flex h-[46vh] items-end justify-center md:col-span-6 md:h-[64vh] ${
                    left ? 'md:order-1' : 'md:order-2'
                  }`}
                >
                  <span className="team-fog" aria-hidden />
                  {m.image ? (
                    <div data-tilt className="team-tilt">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="team-figure"
                        src={m.image}
                        alt={`${m.first} ${m.surname}`}
                        loading="lazy"
                        decoding="async"
                        style={{
                          height: '100%',
                          width: '100%',
                          objectFit: 'contain',
                          objectPosition: 'bottom',
                          // The shader plane replaces the pixels when WebGL is on;
                          // the img keeps layout, SEO and the no-WebGL fallback.
                          opacity: enable3D ? 0 : undefined,
                          ...cutout,
                        }}
                      />
                      {!enable3D && <span className="team-grain" aria-hidden style={cutout} />}
                      {!enable3D && <span className="team-iri" aria-hidden style={cutout} />}
                      {enable3D && (
                        <TeamFigure3D
                          image={m.image}
                          depth={m.image.replace('.webp', '_depth.webp')}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="team-figure--pending">
                      <span className="text-center">
                        <span className="block font-display text-7xl text-gold/60">{m.surname[0]}</span>
                        <span className="text-mono-label mt-3 block text-faint">{t.pending}</span>
                      </span>
                    </div>
                  )}
                  <span className="team-shadow" aria-hidden />
                </figure>

                {/* Meta */}
                <div
                  className={`relative z-10 md:col-span-6 ${
                    left ? 'md:order-2 md:pl-6' : 'md:order-1 md:pr-6'
                  }`}
                >
                  <p data-meta className="text-mono-label text-gold/70">
                    {`— ${ordinal}`}
                  </p>
                  <h3 className="mt-3 overflow-hidden text-4xl">
                    <span data-name-inner className="block">
                      {m.first ? (
                        <>
                          {m.first} <span className="foil">{m.surname}</span>
                        </>
                      ) : (
                        <span className="foil">{m.surname}</span>
                      )}
                    </span>
                  </h3>
                  <p data-meta className="text-mono-label mt-4 text-muted">
                    {m.role[locale]}
                  </p>
                  <p data-meta className="mt-6 max-w-md text-xl leading-relaxed text-ink/90">
                    <span className="text-gold/60">“</span>
                    {m.manifesto[locale]}
                    <span className="text-gold/60">”</span>
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
