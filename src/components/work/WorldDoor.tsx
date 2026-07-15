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
      <article
        className="relative overflow-hidden rounded-lg border border-white/10"
        style={{ aspectRatio: '16 / 12.2', background: '#070D18' }}
      >
        {/* Stage — fixed navy, world glow, ghost count, inverted wordmark */}
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
          <span className="absolute inset-x-0 top-[38%] grid -translate-y-1/2 place-items-center px-10">
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

        {/* Chrome — printed on dark, immune to the chapter palette */}
        <div className="pointer-events-none absolute inset-0">
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
          />
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-7 sm:right-7">
            <p className="text-mono-label" style={{ color: '#C9A96E' }}>
              {dict.homeWorlds.eyebrow} · {copy.count}
            </p>
            <div className="mt-2 flex items-end justify-between gap-6">
              <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl">
                {copy.name}
              </h3>
              <span
                className="mb-1 flex shrink-0 items-center gap-2"
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
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">{copy.line}</p>
          </div>
          <span
            aria-hidden
            className="absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent transition-colors duration-500 group-hover:ring-[#C9A96E99] group-focus-visible:ring-[#C9A96E99]"
          />
        </div>
      </article>
    </Link>
  )
}
