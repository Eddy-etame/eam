import Image from 'next/image'
import Link from 'next/link'
import { localizedPath } from '@/lib/seo'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * A world door — the threshold card for Microdidact / Boxing Center, usable
 * inside the featured rail or any grid. LEGIBILITY LAW (Eddy 2026-07-15): a
 * door is a framed dark artwork — every colour on it is a FIXED hex, never a
 * theme token, so the chapter palette can morph around it while its text
 * stays printed-on-dark legible in all four themes.
 *
 * SAME SIZE AS THE CARDS (Eddy 2026-11-07): the door now shares the project
 * card's anatomy exactly — a chrome-height band on top (h-6 / sm:h-9, like
 * BrowserFrame), a 4/3 stage, then the caption below the frame — so in the
 * rail and in any grid its frame edges line up with the neighbouring cards.
 * The caption sits outside the artwork and uses the page tokens, as the
 * cards' captions do.
 */

const DOORS = {
  microdidact: {
    slug: 'work/microdidact',
    logo: '/logos/microdidact.png',
    logoW: 640,
    logoH: 131,
    logoClass: 'w-[56%] max-w-[340px] opacity-95 [filter:brightness(0)_invert(0.96)]',
    stage: 'linear-gradient(168deg, #0E1F3D 0%, #0A1524 58%, #070D18 100%)',
    glow: 'radial-gradient(70% 90% at 50% 38%, rgb(201 169 110 / 0.10), transparent 70%)',
  },
  boxingCenter: {
    slug: 'work/boxing-center',
    logo: '/logos/boxing-center.png',
    logoW: 640,
    logoH: 299,
    logoClass: 'w-[38%] max-w-[220px] opacity-95 [filter:brightness(0)_invert(1)]',
    stage: 'linear-gradient(168deg, #1E2044 0%, #131630 55%, #070D18 100%)',
    glow: 'radial-gradient(ellipse 62% 46% at 50% 66%, rgb(232 0 28 / 0.16), transparent 70%)',
  },
} as const

export function WorldDoor({
  world,
  locale,
  dict,
}: {
  world: keyof typeof DOORS
  locale: Locale
  dict: Dictionary
}) {
  const door = DOORS[world]
  const copy = dict.homeWorlds.doors[world]

  return (
    <Link href={localizedPath(locale, door.slug)} data-cursor="voir" className="group block">
      <article className="relative">
        {/* Frame — the same silhouette as BrowserFrame + a 4/3 media area */}
        <div
          className="relative z-[1] overflow-hidden rounded-lg border border-white/10"
          style={{ background: '#070D18' }}
        >
          {/* Band — the door's "chrome": fixed dark, three dots, the path it opens */}
          <div
            aria-hidden
            className="relative flex h-6 items-center border-b border-white/10 px-3 sm:h-9"
            style={{ background: '#0C1526' }}
          >
            <span className="flex shrink-0 gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgb(255 255 255 / 0.22)' }} />
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgb(255 255 255 / 0.22)' }} />
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgb(255 255 255 / 0.22)' }} />
            </span>
            <span className="pointer-events-none absolute inset-x-0 hidden justify-center sm:flex">
              <span
                className="max-w-[60%] truncate rounded-full px-3 py-0.5 font-[family-name:var(--font-mono),ui-monospace,monospace] text-[10px] tracking-[0.08em]"
                style={{ color: '#C9A96E', background: 'rgb(255 255 255 / 0.06)' }}
              >
                {dict.homeWorlds.eyebrow.toLowerCase()} / {door.slug.split('/')[1]}
              </span>
            </span>
          </div>

          {/* Stage — 4/3 like the cards' media: fixed navy, world glow, ghost count, inverted wordmark */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
              <span aria-hidden className="absolute inset-0" style={{ background: door.stage }} />
              <span
                aria-hidden
                className="absolute inset-0 opacity-80 transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: door.glow }}
              />
              <span
                aria-hidden
                className="absolute -right-2 -top-[0.12em] select-none font-display text-[clamp(7rem,11vw,10rem)] leading-none text-white/[0.06]"
              >
                {copy.count}
              </span>
              <span className="absolute inset-x-0 top-1/2 grid -translate-y-1/2 place-items-center px-10">
                <Image
                  src={door.logo}
                  alt=""
                  width={door.logoW}
                  height={door.logoH}
                  sizes="(max-width: 1024px) 90vw, 640px"
                  className={door.logoClass}
                />
              </span>
            </div>

            {/* Chrome printed on dark — the card's pill and corner slots, immune to the palette */}
            <span className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
              <span
                className="text-mono-label rounded px-2 py-1 backdrop-blur-sm"
                style={{ background: 'rgb(0 0 0 / 0.4)', color: '#E8C987' }}
              >
                {dict.homeWorlds.eyebrow} · {copy.count}
              </span>
            </span>
            <span
              className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]"
              style={{ color: '#E8C987' }}
            >
              <span className="text-mono-label">{dict.homeWorlds.enter}</span>
              <span
                aria-hidden
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
              >
                →
              </span>
            </span>
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent transition-colors duration-500 group-hover:ring-[#C9A96E99] group-focus-visible:ring-[#C9A96E99]"
          />
        </div>

        {/* Caption — below the frame, on the page, exactly like a project card */}
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-ink transition-colors duration-300 group-hover:text-gold group-focus-visible:text-gold">
              {copy.name}
            </h3>
            <p className="mt-1 text-muted">{copy.line}</p>
          </div>
          <span
            aria-hidden
            className="mt-1.5 shrink-0 text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
          >
            →
          </span>
        </div>
      </article>
    </Link>
  )
}
