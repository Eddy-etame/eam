import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { clients } from '@/lib/clients'
import { localizedPath } from '@/lib/seo'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * "Ils nous font confiance" — a calm, slow marquee of real client logos.
 * Each brand sits on a uniform white plaque so colourful badges and clean
 * wordmarks read coherently across themes, and links straight to its case
 * study. Pure-CSS loop; pauses on hover; static + centred under reduced
 * motion (the repeated set is hidden).
 */
export function Clients({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.clients
  // Repeat the set so ONE half always overflows the widest viewport, then
  // duplicate that half → a seamless -50% loop with no trailing empty gap.
  const FILL = Math.max(2, Math.ceil(14 / Math.max(clients.length, 1)))
  const half = Array.from({ length: FILL }, () => clients).flat()
  const row = [...half, ...half]

  return (
    <section className="relative overflow-hidden border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-[1640px] px-6 md:px-12 lg:px-20">
        <Reveal className="max-w-3xl">
          <p className="text-mono-label text-gold/85">{t.eyebrow}</p>
          <h2 className="mt-5 text-3xl">{t.title}</h2>
        </Reveal>
      </div>

      <div className="eam-marquee group relative mt-12 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] md:mt-16">
        <ul className="eam-marquee-track" style={{ animationDuration: `${half.length * 4.5}s` }}>
          {row.map((c, i) => {
            const announced = i < clients.length
            return (
              <li
                key={`${c.slug}-${i}`}
                className={cn('group/plaque pr-5', announced ? 'eam-client-unique' : 'eam-client-repeat')}
                aria-hidden={!announced}
              >
                <Link
                  href={localizedPath(locale, `work/${c.slug}`)}
                  tabIndex={announced ? undefined : -1}
                  aria-label={c.name}
                  className="flex h-28 w-52 items-center justify-center rounded-2xl bg-white px-8 shadow-[0_12px_34px_rgba(0,0,0,0.18)] ring-1 ring-black/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-gold/60 group-hover/plaque:-translate-y-1.5 group-hover/plaque:shadow-[0_24px_56px_rgba(0,0,0,0.26)] group-hover/plaque:ring-2 group-hover/plaque:ring-gold/60"
                >
                  <span className="relative block h-16 w-full opacity-90 transition-opacity duration-500 group-hover/plaque:opacity-100">
                    <Image
                      src={c.logo}
                      alt={c.name}
                      fill
                      sizes="208px"
                      className="object-contain"
                      unoptimized={c.vector}
                    />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
