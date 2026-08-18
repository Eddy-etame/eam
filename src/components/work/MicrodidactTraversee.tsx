'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap'
import { localizedPath } from '@/lib/seo'
import { rundowns } from '@/lib/rundowns'
import { categoryLabels } from '@/lib/taxonomy'
import type { Project } from '@/lib/projects'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * LA TRAVERSÉE — the crossing of the sixteen Microdidact projects, with the
 * rooms INSIDE the scroll.
 *
 * Eddy's spec, verbatim intent: the horizontal rail stays, but reaching a
 * project you do NOT scroll past it — you scroll INTO it. The panel's image
 * swells until it owns the viewport, the room's content (rundown, screenshots)
 * plays through under the same scroll, then the image warps back into its
 * panel and the rail resumes toward the next project. One gesture, zero
 * clicks, as smooth as the scrub allows.
 *
 * Implementation: ONE pinned ScrollTrigger + ONE master timeline whose
 * duration is measured in pixels. Per project: [move] rail slides the panel
 * to centre → [enter] the room clips open from the panel's exact rect
 * (inset() scrub — reversible, GPU-friendly) → [through] the room's column
 * translates through hero / rundown / shots / closing frame → [exit] the
 * room clips back down to the panel rect. Deep links (#salle-<slug>) and
 * ←/→ jump straight to a room's open state. Visited rooms seal their panels
 * with a gold tick (localStorage).
 *
 * Touch / narrow: the same idea rotated vertical, on NATURAL scroll (no pin,
 * no Lenis) — each band clip-opens from its rounded rect to full bleed around
 * viewport centre, reveals its copy, then seals shut as it exits; a fixed
 * chip carries the 01/16 counter + gold hairline, and #salle-<slug> links
 * land on the open band. Reduced-motion: the static vertical crossing.
 * Both modes keep every word and link in the server-rendered DOM (SEO), plus
 * the plain <ol> index at the end.
 */

// ── Visited-rooms persistence ────────────────────────────────────────────────
const SEEN_KEY = 'eam-rooms-seen'
const ROOMS_SEEN_EVENT = 'eam:rooms-seen'

function readRoomsSeen(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((s): s is string => typeof s === 'string') : []
  } catch {
    return []
  }
}

function markSeen(slug: string) {
  try {
    const cur = readRoomsSeen()
    if (cur.includes(slug)) return
    localStorage.setItem(SEEN_KEY, JSON.stringify([...cur, slug]))
    window.dispatchEvent(new Event(ROOMS_SEEN_EVENT))
  } catch {
    /* storage unavailable (private mode) — ticks are a nicety, not a right */
  }
}

// ── Assets ──────────────────────────────────────────────────────────────────
/** Slugs with retina multi-shots at public/shots/<slug>/{hero,s2,s3}.webp. */
const SHOT_SLUGS = new Set([
  'beldi-fusion',
  'c-chez-toit',
  'chicken-bens',
  'decoshop-vitrine',
  'drive-pneu',
  'id-skillz',
  'inlet',
  'jcboyang-conseil',
  'kermhosting',
  'la-brigade-mobile',
  'marche-de-mo',
  'mon-boum',
  'nyc-cookies',
  'pieces-auto-colomiers',
  'temps-dance',
  'the-911',
  'un-rire-pour-un-enfant',
])

const heroOf = (p: Project): string | null =>
  SHOT_SLUGS.has(p.slug) ? `/shots/${p.slug}/hero.webp` : (p.thumb ?? null)

const stripOf = (p: Project): string[] =>
  SHOT_SLUGS.has(p.slug) ? [`/shots/${p.slug}/s2.webp`, `/shots/${p.slug}/s3.webp`] : []

/** Slugs with a PHONE-SHAPED capture at /thumbs/<slug>-m.jpg — served on small
 *  screens so the journey bands never show a squished desktop screenshot. */
const MOBILE_SHOTS = new Set([
  'beldi-fusion',
  'c-chez-toit',
  'chicken-bens',
  'decoshop-vitrine',
  'drive-pneu',
  'id-skillz',
  'la-brigade-mobile',
  'marche-de-mo',
  'mon-boum',
  'nyc-cookies',
  'pieces-auto-colomiers',
  'temps-dance',
  'the-911',
  'un-rire-pour-un-enfant',
])
const mobileThumbOf = (p: Project): string | null =>
  MOBILE_SHOTS.has(p.slug) ? `/thumbs/${p.slug}-m.jpg` : null

function initials(name: string): string {
  return name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Deep wash: the project's colour bleeding down into --c-deep. */
const washOf = (color: string) =>
  `linear-gradient(178deg, ${color}59 0%, ${color}24 34%, var(--c-deep) 76%)`

// ── Journey pacing (pixels of scroll per phase) ─────────────────────────────
const ENTER_VH = 0.55 // room clip-open, in viewport-heights of scroll
const EXIT_VH = 0.45 // room clip-close
const THROUGH_RATE = 0.6 // room content px advanced per scrolled px (>0.5 = brisk)
const MIN_MOVE = 260 // approach beat even when panels are adjacent

export function MicrodidactTraversee({
  locale,
  dict,
  projects,
}: {
  locale: Locale
  dict: Dictionary
  projects: Project[]
}) {
  const scope = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const [enhanced, setEnhanced] = useState(false)
  const [rebuild, setRebuild] = useState(0)
  const [idx, setIdx] = useState(1)
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set())

  useEffect(() => {
    const sync = () => setSeen(new Set(readRoomsSeen()))
    sync()
    window.addEventListener(ROOMS_SEEN_EVENT, sync)
    return () => window.removeEventListener(ROOMS_SEEN_EVENT, sync)
  }, [])

  // The pinned journey is a fine-pointer, wide-viewport, motion-allowed
  // privilege. Everyone else gets the dignified vertical crossing.
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const wide = window.matchMedia('(min-width: 1024px)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (fine && wide && !reduce) setEnhanced(true)
  }, [])

  // Rebuild the measured timeline when the viewport meaningfully resizes.
  useEffect(() => {
    if (!enhanced) return
    let w = window.innerWidth
    let t: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        if (Math.abs(window.innerWidth - w) > 64) {
          w = window.innerWidth
          setRebuild((n) => n + 1)
        }
      }, 300)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [enhanced])

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // ── Vertical traversée — the rooms open under the thumb ─────────────
      // Natural touch scroll, zero pin: each band scrubs its OWN crossing —
      // rounded rect → full bleed around viewport centre → sealed again on
      // exit. clip-path + transforms only (PRM keeps the static CSS rect).
      if (!enhanced) {
        if (reduce) return

        const bands = gsap.utils.toArray<HTMLElement>('[data-tv-band]', root)
        const seq = root.querySelector<HTMLElement>('[data-tv-seq]')
        const chip = root.querySelector<HTMLElement>('[data-tv-chip]')
        if (!bands.length || bands.length !== projects.length) return

        // The closed rect mirrors the CSS default (16px / sm:24px gutters).
        const gutter = window.matchMedia('(min-width: 640px)').matches ? 24 : 16
        const CLOSED = `inset(0px ${gutter}px 0px ${gutter}px round 12px)`
        const OPEN = 'inset(0px 0px 0px 0px round 0px)'

        let active = -1
        let urlTimer: ReturnType<typeof setTimeout> | undefined
        // Same debounce contract as the pinned journey below: never write the
        // URL mid-scroll — a pending <Link> navigation must commit first.
        const writeUrl = (hash: string | null) => {
          clearTimeout(urlTimer)
          urlTimer = setTimeout(() => {
            try {
              history.replaceState(null, '', hash ?? location.pathname + location.search)
            } catch {
              /* some browsers rate-limit replaceState — cosmetic only */
            }
          }, 250)
        }

        bands.forEach((band, i) => {
          const project = projects[i]
          const media = band.querySelector<HTMLElement>('[data-tv-media]')
          const ring = band.querySelector<HTMLElement>('[data-tv-ring]')
          const reveals = band.querySelectorAll<HTMLElement>('[data-tv-reveal]')

          // Progress 0.42–0.58 = fully open, which lands at viewport centre
          // for a 70vh band under this start/end pair.
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: band,
              start: 'top 85%',
              end: 'bottom 15%',
              scrub: true,
              // will-change only while this band actually animates
              onToggle: (self) => {
                gsap.set(band, { willChange: self.isActive ? 'clip-path' : 'auto' })
                if (media) gsap.set(media, { willChange: self.isActive ? 'transform' : 'auto' })
              },
              onUpdate: (self) => {
                if (self.progress > 0.3 && self.progress < 0.72 && active !== i) {
                  active = i
                  setIdx(i + 1)
                  writeUrl(`#salle-${project.slug}`)
                }
              },
            },
          })

          // [opening] rounded rect → full bleed; the media settles from a zoom
          tl.fromTo(band, { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.42, ease: 'eam-silk' }, 0)
          if (media) {
            tl.fromTo(
              media,
              { scale: 1.12, yPercent: -4 },
              { scale: 1, yPercent: 0, duration: 0.45, ease: 'eam-silk' },
              0,
            )
          }
          if (ring) tl.to(ring, { autoAlpha: 0, duration: 0.24 }, 0.12)
          if (reveals.length) {
            tl.from(
              reveals,
              { autoAlpha: 0, y: 26, duration: 0.2, stagger: 0.055, ease: 'eam-reveal' },
              0.16,
            )
          }
          tl.call(() => markSeen(project.slug), [], 0.5)
          // [closing] full bleed → sealed rect as the band leaves overhead
          tl.to(band, { clipPath: CLOSED, duration: 0.42, ease: 'eam-silk' }, 0.58)
          if (media) tl.to(media, { scale: 1.08, yPercent: 4, duration: 0.42, ease: 'eam-silk' }, 0.58)
          if (ring) tl.to(ring, { autoAlpha: 1, duration: 0.24 }, 0.72)
        })

        // Instrument chip — counter + gold hairline, alive only in-sequence.
        if (seq && chip && progressRef.current) {
          gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' })
          const progressTo = gsap.quickSetter(progressRef.current, 'scaleX')
          ScrollTrigger.create({
            trigger: seq,
            start: 'top 60%',
            end: 'bottom 60%',
            onUpdate: (self) => progressTo(self.progress),
            onToggle: (self) => {
              gsap.to(chip, {
                autoAlpha: self.isActive ? 1 : 0,
                duration: 0.35,
                ease: 'eam-snap',
                overwrite: 'auto',
              })
              if (!self.isActive) {
                active = -1
                writeUrl(null)
              }
            },
          })
        }

        // #salle-<slug> deep links land with the band centred (fully open).
        const jumpToHash = () => {
          const m = /^#salle-(.+)$/.exec(location.hash)
          if (!m) return
          const target = bands[projects.findIndex((p) => p.slug === m[1])]
          if (!target) return
          const r = target.getBoundingClientRect()
          window.scrollTo({
            top: window.scrollY + r.top - (window.innerHeight - r.height) / 2,
            behavior: 'auto',
          })
        }
        requestAnimationFrame(() => requestAnimationFrame(jumpToHash))
        window.addEventListener('hashchange', jumpToHash)

        return () => {
          clearTimeout(urlTimer)
          window.removeEventListener('hashchange', jumpToHash)
        }
      }

      // ── THE JOURNEY — one pinned master timeline ─────────────────────────
      const wrap = root.querySelector<HTMLElement>('[data-tr-pin]')
      const track = root.querySelector<HTMLElement>('[data-tr-track]')
      if (!wrap || !track) return

      const vw = wrap.clientWidth
      const vh = wrap.clientHeight
      const wrapRect = wrap.getBoundingClientRect()
      const dist = Math.max(0, track.scrollWidth - vw)

      const panels = gsap.utils.toArray<HTMLElement>('[data-tr-panel]', root)
      const stages = panels.map((p) => p.querySelector<HTMLElement>('[data-tr-stage]'))
      const rooms = gsap.utils.toArray<HTMLElement>('[data-tr-room]', root)
      if (panels.length !== projects.length || rooms.length !== projects.length) return

      // Panel geometry at focus time (track x = -focusX): the clip rect each
      // room opens from and warps back into.
      const geo = stages.map((stage) => {
        const r = (stage as HTMLElement).getBoundingClientRect()
        const focusX = gsap.utils.clamp(0, dist, r.left - wrapRect.left + r.width / 2 - vw / 2)
        const left = r.left - wrapRect.left - focusX
        const top = r.top - wrapRect.top
        const clip = `inset(${top}px ${vw - left - r.width}px ${vh - top - r.height}px ${left}px round 12px)`
        return { focusX, clip }
      })

      const ENTER = vh * ENTER_VH
      const EXIT = vh * EXIT_VH

      // Segment bookkeeping for the counter, hash and arrow keys.
      const segs: { start: number; open: number; close: number; end: number }[] = []
      const splits: SplitText[] = []

      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      let cursor = 0
      let prevX = 0

      projects.forEach((project, i) => {
        const room = rooms[i]
        const col = room.querySelector<HTMLElement>('[data-room-col]')
        const stage = stages[i]
        const { focusX, clip } = geo[i]

        // [MOVE] — the rail carries the next panel to centre.
        const moveDist = Math.max(MIN_MOVE, Math.abs(focusX - prevX))
        const moveStart = cursor
        tl.to(track, { x: -focusX, duration: moveDist }, moveStart)

        // Panel choreography rides the approach — masked name, rising meta,
        // media drift. All scrubbed: deterministic in both directions.
        const name = panels[i].querySelector<HTMLElement>('[data-tr-name]')
        if (name) {
          const split = new SplitText(name, { type: 'chars' })
          splits.push(split)
          tl.from(
            split.chars,
            {
              yPercent: 145,
              duration: moveDist * 0.4,
              stagger: { each: moveDist * 0.012 },
              ease: 'eam-reveal',
            },
            moveStart + moveDist * 0.35,
          )
        }
        const metas = panels[i].querySelectorAll<HTMLElement>('[data-tr-meta]')
        if (metas.length) {
          tl.from(
            metas,
            { autoAlpha: 0, y: 22, duration: moveDist * 0.35, stagger: moveDist * 0.06, ease: 'eam-reveal' },
            moveStart + moveDist * 0.42,
          )
        }
        const media = stage?.querySelector<HTMLElement>('[data-tr-media]')
        if (media) {
          tl.fromTo(
            media,
            { xPercent: -4, scale: 1.08 },
            { xPercent: 3, scale: 1.03, duration: moveDist },
            moveStart,
          )
        }
        const numeral = stage?.querySelector<HTMLElement>('[data-tr-numeral]')
        if (numeral) {
          tl.fromTo(numeral, { xPercent: -12 }, { xPercent: 10, duration: moveDist }, moveStart)
        }
        cursor += moveDist

        // [ENTER] — the image swells into the room. clip-path from the
        // panel's exact rect to the full viewport; the hero settles from a
        // slight zoom; the room name rises out of its mask.
        tl.set(room, { visibility: 'visible' }, cursor)
        tl.fromTo(
          room,
          { clipPath: clip },
          { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: ENTER },
          cursor,
        )
        const roomHero = room.querySelector<HTMLElement>('[data-room-hero-media]')
        if (roomHero) {
          tl.fromTo(roomHero, { scale: 1.14 }, { scale: 1, duration: ENTER + vh * 0.2 }, cursor)
        }
        const roomName = room.querySelector<HTMLElement>('[data-room-name]')
        if (roomName) {
          tl.fromTo(
            roomName,
            { yPercent: 118 },
            { yPercent: 0, duration: ENTER * 0.7, ease: 'eam-reveal' },
            cursor + ENTER * 0.35,
          )
        }
        const open = cursor + ENTER
        tl.call(() => markSeen(project.slug), [], open)

        // [THROUGH] — the room's column plays under the same scroll.
        const colScroll = col ? Math.max(0, col.scrollHeight - vh) : 0
        const through = colScroll / THROUGH_RATE
        if (col && colScroll > 0) {
          tl.fromTo(col, { y: 0 }, { y: -colScroll, duration: through }, open)
        }
        cursor = open + through

        // [EXIT] — the image warps back into its panel; the rail resumes.
        tl.to(room, { clipPath: clip, duration: EXIT }, cursor)
        tl.set(room, { visibility: 'hidden' }, cursor + EXIT)
        cursor += EXIT

        segs.push({ start: moveStart, open, close: cursor - EXIT, end: cursor })
        prevX = focusX
      })

      // Tail — a short drift so the last room releases with air.
      tl.to(track, { x: -(prevX + vw * 0.08), duration: vh * 0.35 }, cursor)
      cursor += vh * 0.35

      const total = cursor
      const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power2' })
      if (progressRef.current)
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' })
      const progressTo = progressRef.current
        ? gsap.quickSetter(progressRef.current, 'scaleX')
        : null

      let lastActive = -1
      let lastInRoom = false
      let urlWriteTimer: ReturnType<typeof setTimeout> | undefined
      const st = ScrollTrigger.create({
        animation: tl,
        trigger: wrap,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: `+=${Math.round(total)}`,
        anticipatePin: 1,
        onUpdate: (self) => {
          const px = self.progress * total
          let active = 0
          for (let i = 0; i < segs.length; i++) if (px >= segs[i].start) active = i
          const inRoom =
            px >= segs[active].open - ENTER * 0.4 && px <= segs[active].close + EXIT * 0.4
          if (active !== lastActive) {
            lastActive = active
            setIdx(active + 1)
          }
          // The URL follows the walk — DEBOUNCED. Writing synchronously inside
          // onUpdate raced the app router: during a <Link> transition one last
          // scroll frame still read "in room", re-wrote the hash and dragged
          // the OLD query string back with it — silently reverting the
          // navigation (caught: the «Tous» filter chip did nothing). Writing
          // only after 250ms of scroll calm means a pending navigation always
          // commits first, and the calm-time write reads the NEW location.
          if (inRoom !== lastInRoom || (inRoom && !location.hash.endsWith(projects[active].slug))) {
            lastInRoom = inRoom
            const targetHash = inRoom ? `#salle-${projects[active].slug}` : null
            clearTimeout(urlWriteTimer)
            urlWriteTimer = setTimeout(() => {
              try {
                history.replaceState(
                  null,
                  '',
                  targetHash ?? location.pathname + location.search,
                )
              } catch {
                /* some browsers rate-limit replaceState — cosmetic only */
              }
            }, 250)
          }
          if (progressTo) progressTo(self.progress)
          skewTo(gsap.utils.clamp(-3.5, 3.5, -self.getVelocity() / 350))
        },
      })

      // Deep links + arrow keys land on a room's open state.
      const scrollYFor = (i: number) =>
        st.start + segs[i].open + (segs[i].close - segs[i].open) * 0.05

      const jumpToHash = () => {
        const m = /^#salle-(.+)$/.exec(location.hash)
        if (!m) return
        const i = projects.findIndex((p) => p.slug === m[1])
        if (i >= 0) window.scrollTo({ top: scrollYFor(i), behavior: 'auto' })
      }
      // After layout settles (pin spacers in place), honour an arriving hash.
      requestAnimationFrame(() => requestAnimationFrame(jumpToHash))
      window.addEventListener('hashchange', jumpToHash)

      const onKey = (e: KeyboardEvent) => {
        if (!st.isActive || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return
        const dir = e.key === 'ArrowRight' ? 1 : -1
        const next = gsap.utils.clamp(0, projects.length - 1, lastActive + dir)
        if (next !== lastActive) {
          e.preventDefault()
          window.scrollTo({ top: scrollYFor(next), behavior: 'auto' })
        }
      }
      window.addEventListener('keydown', onKey)

      return () => {
        clearTimeout(urlWriteTimer)
        window.removeEventListener('hashchange', jumpToHash)
        window.removeEventListener('keydown', onKey)
        splits.forEach((s) => s.revert())
      }
    },
    { scope, dependencies: [enhanced, rebuild], revertOnUpdate: true },
  )

  return (
    <div ref={scope}>
      {enhanced ? (
        /* ── LA TRAVERSÉE — rail + rooms under one scroll ───────────────── */
        <div data-tr-pin className="relative h-svh overflow-hidden">
          <div className="flex h-full items-center overflow-hidden">
            <div
              data-tr-track
              className="flex items-center gap-[5vw] pl-[10vw] pr-[16vw] will-change-transform"
            >
              {projects.map((project, i) => (
                <Panel
                  key={project.slug}
                  project={project}
                  locale={locale}
                  dict={dict}
                  i={i}
                  seen={seen.has(project.slug)}
                />
              ))}
            </div>
          </div>

          {/* The rooms — one per project, clipped shut until their moment */}
          <div className="pointer-events-none absolute inset-0 z-30">
            {projects.map((project, i) => (
              <Room
                key={project.slug}
                project={project}
                next={projects[(i + 1) % projects.length]}
                isLast={i === projects.length - 1}
                locale={locale}
                dict={dict}
                i={i}
                total={projects.length}
                eager={i === 0}
              />
            ))}
          </div>

          {/* The crossing's instruments — tabular counter + gold progress */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-8 right-6 z-40 flex w-[min(38vw,460px)] items-center gap-5 md:right-12"
          >
            {/* The arrows work — tell people (fixed hex: rides over the rooms) */}
            <span className="text-mono-label hidden lg:inline" style={{ color: '#8892A466' }}>
              ← →
            </span>
            <span className="hairline relative flex-1">
              <span
                ref={progressRef}
                className="absolute inset-0 bg-gold"
                style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
              />
            </span>
            <span className="text-mono-label text-gold [font-variant-numeric:tabular-nums]">
              {pad(idx)} / {pad(projects.length)}
            </span>
          </div>
        </div>
      ) : (
        /* ── Vertical journey — band + room digest per project ──────────── */
        <div data-tv-seq className="flex flex-col gap-16 py-4 sm:gap-24">
          {projects.map((project, i) => (
            <article key={project.slug} id={`salle-${project.slug}`}>
              <Band
                project={project}
                locale={locale}
                dict={dict}
                i={i}
                seen={seen.has(project.slug)}
              />
              <div className="px-4 sm:px-6">
                <RoomDigest project={project} locale={locale} dict={dict} />
              </div>
            </article>
          ))}

          {/* The crossing's instruments, phone edition — counter + hairline.
              Hidden until the sequence trigger wakes it (PRM: never shows). */}
          <div
            data-tv-chip
            aria-hidden
            /* w-max: fixed-position shrink-to-fit under-measures this flex row
               on mobile Chromium and wraps the counter — max-content is exact */
            className="pointer-events-none fixed bottom-5 left-4 z-40 flex w-max items-center gap-4 rounded-full border border-line/60 bg-black/45 px-4 py-2.5 backdrop-blur-sm"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <span className="text-mono-label whitespace-nowrap text-gold [font-variant-numeric:tabular-nums]">
              {pad(idx)} / {pad(projects.length)}
            </span>
            <span className="hairline relative w-14">
              <span
                ref={progressRef}
                className="absolute inset-0 bg-gold"
                style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
              />
            </span>
          </div>
        </div>
      )}

      {/* ── The registre footnote — plain-DOM index of all sixteen ───────── */}
      <section className="border-t border-line px-6 py-14 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1640px]">
          <p className="text-mono-label text-faint">{dict.common.allProjects}</p>
          <ol className="mt-6 grid gap-x-10 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project, i) => (
              <li key={project.slug} className="flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="text-mono-label text-faint [font-variant-numeric:tabular-nums]"
                >
                  {pad(i + 1)}
                </span>
                <Link
                  href={localizedPath(locale, `work/${project.slug}`)}
                  className="text-mono-label text-muted transition-colors duration-300 hover:text-gold"
                >
                  {project.name}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}

/** Rundown text for a project — fetched-fact rundowns with case-study fallback. */
function rundownOf(project: Project, locale: Locale) {
  const r = rundowns[project.slug]
  return {
    projet: r?.projet[locale] ?? project.caseStudy.problem[locale],
    travail: r?.travail[locale] ?? project.caseStudy.solution[locale],
  }
}

/** Shared stage internals — media, colour wash, legibility, ghost numeral. */
function Stage({
  project,
  locale,
  i,
  mediaAttr,
  numeralAttr,
  sizes,
  seen,
  seenClass = 'right-4 top-4',
  mobileThumb,
}: {
  project: Project
  locale: Locale
  i: number
  mediaAttr: string
  numeralAttr?: string
  sizes: string
  seen: boolean
  /** Tick position — Band pulls it inside its closed clip rect. */
  seenClass?: string
  /** Phone-shaped capture; when set, shown below `sm` and the desktop thumb above. */
  mobileThumb?: string | null
}) {
  const left = i % 2 === 0
  const mediaProps = { [mediaAttr]: '' }
  const numeralProps = numeralAttr ? { [numeralAttr]: '' } : {}
  const alt = `${project.name} — ${categoryLabels[project.category][locale]}`
  return (
    <>
      <div {...mediaProps} className="absolute -inset-[7%]">
        {project.thumb && mobileThumb ? (
          <>
            {/* Phone screenshot below sm, desktop capture at sm+ (art direction) */}
            <Image
              src={mobileThumb}
              alt={alt}
              fill
              sizes={sizes}
              className="object-cover object-top sm:hidden"
            />
            <Image
              src={project.thumb}
              alt={alt}
              fill
              sizes={sizes}
              className="hidden object-cover object-top sm:block"
            />
          </>
        ) : project.thumb ? (
          <Image
            src={project.thumb}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover object-top"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center font-display text-[clamp(5rem,16vw,12rem)] text-white/10"
            style={{ background: `linear-gradient(135deg, ${project.color}, var(--c-navy) 82%)` }}
          >
            {initials(project.name)}
          </span>
        )}
      </div>

      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${left ? '150deg' : '210deg'}, ${project.color}A6 0%, transparent 42%)`,
        }}
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
      />

      <span
        {...numeralProps}
        aria-hidden
        className={`pointer-events-none absolute top-[-0.16em] font-display leading-none text-white/[0.14] select-none ${
          left ? 'left-[-0.07em]' : 'right-[-0.07em]'
        } text-[clamp(8rem,26vh,15rem)]`}
      >
        {pad(i + 1)}
      </span>

      {seen && (
        <span
          aria-hidden
          className={`absolute ${seenClass} z-10 grid size-7 place-items-center rounded-full border border-gold/50 bg-black/45 text-xs text-gold backdrop-blur-sm`}
        >
          ✓
        </span>
      )}
    </>
  )
}

/** One full-bleed panel of the pinned crossing. The <a> stays a real case-page
 *  link (SEO + deliberate intent); the journey itself is pure scroll. */
function Panel({
  project,
  locale,
  dict,
  i,
  seen,
}: {
  project: Project
  locale: Locale
  dict: Dictionary
  i: number
  seen: boolean
}) {
  return (
    <article
      data-tr-panel
      className={`w-[min(76vw,1500px)] shrink-0 ${i % 2 === 1 ? 'translate-y-[3vh]' : '-translate-y-[2vh]'}`}
    >
      <Link
        href={localizedPath(locale, `work/${project.slug}`)}
        data-cursor="voir"
        className="group block"
      >
        <div data-tr-stage className="relative h-[78vh] overflow-hidden rounded-xl border border-line">
          <Stage
            project={project}
            locale={locale}
            i={i}
            mediaAttr="data-tr-media"
            numeralAttr="data-tr-numeral"
            sizes="76vw"
            seen={seen}
          />

          <div className={`absolute inset-x-0 bottom-0 p-8 md:p-12 ${i % 2 === 0 ? '' : 'text-right'}`}>
            <p data-tr-meta className="text-mono-label text-white/75">
              {categoryLabels[project.category][locale]} · {project.year}
            </p>
            <h3
              data-tr-name
              className="-mb-[0.14em] mt-3 overflow-hidden pb-[0.14em] font-display text-[clamp(2.5rem,5vw,4.75rem)] leading-[1.06] text-white"
            >
              {project.name}
            </h3>
            <p
              data-tr-meta
              className="text-mono-label mt-5 inline-flex items-center gap-2 text-gold-bright"
            >
              {dict.rooms.scrollHint}
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}

/** One room of the journey — clipped shut until the scroll opens it. Its
 *  column: full-bleed hero → rundown → shots → closing frame (the same image
 *  the visitor leaves through). All content is real DOM at all times. */
function Room({
  project,
  next,
  isLast,
  locale,
  dict,
  i,
  total,
  eager,
}: {
  project: Project
  next: Project
  isLast: boolean
  locale: Locale
  dict: Dictionary
  i: number
  total: number
  eager: boolean
}) {
  const hero = heroOf(project)
  const strip = stripOf(project)
  const { projet, travail } = rundownOf(project, locale)
  const alt = `${project.name} — ${categoryLabels[project.category][locale]}`

  const bleed = (dim: boolean) =>
    hero ? (
      <Image
        src={hero}
        alt={dim ? '' : alt}
        fill
        priority={eager && !dim}
        sizes="100vw"
        className={`object-cover object-top ${dim ? 'opacity-30' : ''}`}
      />
    ) : (
      <span
        aria-hidden
        className="absolute inset-0 grid place-items-center font-display text-[clamp(6rem,20vw,16rem)] text-white/10"
        style={{ background: `linear-gradient(135deg, ${project.color}, var(--c-navy) 82%)` }}
      >
        {initials(project.name)}
      </span>
    )

  return (
    <section
      data-tr-room
      aria-label={project.name}
      className="pointer-events-auto absolute inset-0 overflow-hidden"
      style={{
        visibility: 'hidden',
        background: 'var(--c-deep)',
        willChange: 'clip-path',
      }}
    >
      {/* The wash — the project's colour owns the room */}
      <div aria-hidden className="absolute inset-0" style={{ background: washOf(project.color) }} />

      <div data-room-col className="absolute inset-x-0 top-0 will-change-transform">
        {/* 1 — the image you entered through, now the whole world */}
        <div className="relative h-svh overflow-hidden">
          <div data-room-hero-media className="absolute inset-0">{bleed(false)}</div>
          {/* Double scrim: page-wide falloff + a hard local band under the plate
              so the room name never fights the capture's own hero copy. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10"
          />
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black/80 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-14">
            <p className="text-mono-label text-white/75">
              {categoryLabels[project.category][locale]} · {project.year}
            </p>
            <div className="mt-3 overflow-hidden">
              <h3
                data-room-name
                className="-mb-[0.12em] pb-[0.12em] font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.98] text-white"
              >
                {project.name}
              </h3>
            </div>
          </div>
          <span
            aria-hidden
            className="text-mono-label absolute right-8 top-8 tabular-nums text-white/70 md:right-14"
          >
            {pad(i + 1)} / {pad(total)}
          </span>
        </div>

        {/* 2 — the rundown: what it was / what we did */}
        <div className="mx-auto grid min-h-[88svh] w-full max-w-[1440px] content-center gap-12 px-6 py-[8svh] md:px-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h4 className="text-mono-label font-body text-gold">{dict.rooms.projet}</h4>
            <p className="mt-6 text-xl leading-relaxed text-white/90 md:text-2xl">{projet}</p>
          </div>
          <div>
            <h4 className="text-mono-label font-body text-gold">{dict.rooms.travail}</h4>
            <p className="mt-6 text-xl leading-relaxed text-white/90 md:text-2xl">{travail}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              {project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mono-label inline-flex items-center gap-2 text-gold-bright transition-colors duration-300 hover:text-gold"
                >
                  {dict.rooms.visit} <span aria-hidden>↗</span>
                </a>
              )}
              <Link
                href={localizedPath(locale, `work/${project.slug}`)}
                className="text-mono-label text-white/60 transition-colors duration-300 hover:text-white"
              >
                {dict.common.viewCase} →
              </Link>
              {/* Dark stage → fixed hex, never theme tokens (legibility law) */}
              <Link
                href={localizedPath(locale, 'contact')}
                className="text-mono-label text-[#E8C987] transition-colors duration-300 hover:text-white"
              >
                {dict.conversion.roomAsk} →
              </Link>
            </div>
          </div>
        </div>

        {/* 3 — deeper screens, full-width plates */}
        {strip.map((src, s) => (
          <div key={src} className="relative mx-auto w-[min(90vw,1560px)] py-[4svh]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10">
              <Image
                src={src}
                alt={`${alt} — ${pad(s + 2)}`}
                fill
                sizes="90vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        ))}

        {/* 4 — the frame you leave through: the same image, and what's next */}
        <div className="relative flex h-svh items-center justify-center overflow-hidden">
          <div aria-hidden className="absolute inset-0">{bleed(true)}</div>
          <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          <div className="relative px-6 text-center">
            <p className="text-mono-label text-gold">
              {isLast ? dict.rooms.back : dict.rooms.next}
            </p>
            <p className="mt-5 font-display text-[clamp(2.25rem,5.5vw,5rem)] leading-[1.02] text-white">
              {isLast ? 'Microdidact ✓' : next.name}
            </p>
            <p className="text-mono-label mt-8 text-white/50">{dict.rooms.scrollHint} ↓</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** One immersive band of the vertical journey (touch / narrow / PRM). */
function Band({
  project,
  locale,
  dict,
  i,
  seen,
}: {
  project: Project
  locale: Locale
  dict: Dictionary
  i: number
  seen: boolean
}) {
  return (
    <Link
      href={localizedPath(locale, `work/${project.slug}`)}
      data-cursor="voir"
      className="group block"
    >
      {/* The closed rect is CSS (matches the old px-4 card exactly), so PRM /
          no-JS keep today's static look; the scrub opens it to full bleed. */}
      <div
        data-tv-band
        className="relative h-[70vh] overflow-hidden [clip-path:inset(0px_16px_0px_16px_round_12px)] sm:[clip-path:inset(0px_24px_0px_24px_round_12px)]"
      >
        <Stage
          project={project}
          locale={locale}
          i={i}
          mediaAttr="data-tv-media"
          sizes="100vw"
          seen={seen}
          seenClass="right-8 top-4 sm:right-10"
          mobileThumb={mobileThumbOf(project)}
        />
        {/* The frame — drawn on the closed rect, dissolves while open */}
        <span
          data-tv-ring
          aria-hidden
          className="pointer-events-none absolute inset-x-4 inset-y-0 z-10 rounded-xl border border-line sm:inset-x-6"
        />
        <div className={`absolute inset-x-4 bottom-0 p-6 sm:inset-x-6 sm:p-9 ${i % 2 === 0 ? '' : 'text-right'}`}>
          <p data-tv-reveal className="text-mono-label text-white/75">
            {categoryLabels[project.category][locale]} · {project.year}
          </p>
          <h3
            data-tv-reveal
            className="mt-2.5 font-display text-[clamp(2rem,8vw,3.25rem)] leading-[1.08] text-white"
          >
            {project.name}
          </h3>
          <p data-tv-reveal className="text-mono-label mt-4 inline-flex items-center gap-2 text-gold-bright">
            {dict.common.viewCase} <span aria-hidden>→</span>
          </p>
        </div>
      </div>
    </Link>
  )
}

/** The room's content in document flow — the vertical journey's interior. */
function RoomDigest({
  project,
  locale,
  dict,
}: {
  project: Project
  locale: Locale
  dict: Dictionary
}) {
  const strip = stripOf(project)
  const { projet, travail } = rundownOf(project, locale)
  const alt = `${project.name} — ${categoryLabels[project.category][locale]}`
  return (
    <div className="mt-6 rounded-xl border border-line/60 p-6 sm:p-9" style={{ background: `${project.color}14` }}>
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
        <div>
          <h4 className="text-mono-label font-body text-gold">{dict.rooms.projet}</h4>
          <p className="mt-4 leading-relaxed text-muted">{projet}</p>
        </div>
        <div>
          <h4 className="text-mono-label font-body text-gold">{dict.rooms.travail}</h4>
          <p className="mt-4 leading-relaxed text-muted">{travail}</p>
        </div>
      </div>

      {strip.length > 0 && (
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {strip.map((src, s) => (
            <div
              key={src}
              className="relative aspect-[16/10] w-[78vw] shrink-0 snap-center overflow-hidden rounded-lg border border-line/60 sm:w-[46%]"
            >
              <Image
                src={src}
                alt={`${alt} — ${pad(s + 2)}`}
                fill
                sizes="(max-width: 640px) 78vw, 40vw"
                className="object-cover object-top"
              />
            </div>
          ))}
        </div>
      )}

      {/* py + negative my: ~44px touch targets, unchanged visual rhythm */}
      <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
        {project.liveUrl !== '#' && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mono-label -my-3 inline-flex items-center gap-2 py-3 text-gold transition-colors duration-300 hover:text-gold-bright"
          >
            {dict.rooms.visit} <span aria-hidden>↗</span>
          </a>
        )}
        <Link
          href={localizedPath(locale, `work/${project.slug}`)}
          className="text-mono-label -my-3 inline-flex items-center py-3 text-muted transition-colors duration-300 hover:text-ink"
        >
          {dict.common.viewCase} →
        </Link>
        <Link
          href={localizedPath(locale, 'contact')}
          className="text-mono-label -my-3 inline-flex items-center py-3 text-gold transition-colors duration-300 hover:text-gold-bright"
        >
          {dict.conversion.roomAsk} →
        </Link>
      </div>
    </div>
  )
}
