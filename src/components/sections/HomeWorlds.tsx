import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { localizedPath } from '@/lib/seo'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * HOME WORLDS — a compact two-door band echoing the registre's monumental
 * thresholds (/work): Microdidact and Boxing Center each get a stage, a ghost
 * numeral and an inverted wordmark. Pure CSS/Tailwind — no GL, no client JS.
 */
export function HomeWorlds({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { homeWorlds } = dict

  const doors = [
    {
      key: 'microdidact',
      href: localizedPath(locale, 'work/microdidact'),
      ...homeWorlds.doors.microdidact,
      logo: '/logos/microdidact.png',
      logoWidth: 640,
      logoHeight: 131,
      logoClass: 'w-[58%] max-w-[380px] opacity-90 [filter:brightness(0)_invert(0.94)]',
      stage: 'linear-gradient(165deg, #0E1F3D 0%, var(--c-deep) 100%)',
      glow: 'radial-gradient(70% 90% at 50% 40%, color-mix(in srgb, var(--c-gold) 10%, transparent), transparent 70%)',
      dir: 'left' as const,
    },
    {
      key: 'boxing-center',
      href: localizedPath(locale, 'work/boxing-center'),
      ...homeWorlds.doors.boxingCenter,
      logo: '/logos/boxing-center.png',
      logoWidth: 640,
      logoHeight: 299,
      logoClass: 'w-[46%] max-w-[300px] opacity-90 [filter:brightness(0)_invert(1)]',
      stage: 'linear-gradient(165deg, #1E2044 0%, var(--c-deep) 100%)',
      glow: 'radial-gradient(ellipse 62% 46% at 50% 68%, #E8001C2E 0%, transparent 70%)',
      dir: 'right' as const,
    },
  ]

  return (
    <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-20">
      <div className="mx-auto max-w-[1640px]">
        <Reveal>
          <p className="text-mono-label text-gold/85">{homeWorlds.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl text-3xl md:text-4xl">{homeWorlds.title}</h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {doors.map((door, i) => (
            <Reveal key={door.key} delay={i * 90} dir={door.dir}>
              <Link href={door.href} data-cursor="voir" className="group block">
                <article className="relative min-h-[38vh] overflow-hidden rounded-lg border border-line bg-deep">
                  {/* Stage — gradient, glow, ghost numeral, inverted wordmark. */}
                  <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                    <span aria-hidden className="absolute inset-0" style={{ background: door.stage }} />
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-80 transition-opacity duration-700 group-hover:opacity-100"
                      style={{ background: door.glow }}
                    />
                    <span
                      aria-hidden
                      className="absolute -bottom-[0.14em] -right-2 select-none font-display text-[clamp(8rem,14vw,12rem)] leading-none text-ink/[0.06]"
                    >
                      {door.count}
                    </span>
                    <span className="absolute inset-0 grid place-items-center px-10">
                      <Image
                        src={door.logo}
                        alt={door.name}
                        width={door.logoWidth}
                        height={door.logoHeight}
                        className={door.logoClass}
                      />
                    </span>
                  </div>

                  {/* Chrome — copy and cues above the stage. */}
                  <div className="pointer-events-none absolute inset-0">
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                    />
                    <div className="absolute bottom-5 left-5 right-28 sm:bottom-7 sm:left-7">
                      <h3 className="font-display text-2xl text-ink sm:text-3xl">{door.name}</h3>
                      <p className="mt-2 max-w-md text-sm text-muted">{door.line}</p>
                    </div>
                    <span className="absolute bottom-5 right-5 flex items-center gap-2 text-gold sm:bottom-7 sm:right-7">
                      <span className="text-mono-label">{homeWorlds.enter}</span>
                      <span
                        aria-hidden
                        className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
                      >
                        →
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent transition-colors duration-500 group-hover:ring-gold/60 group-focus-visible:ring-gold/60"
                    />
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
