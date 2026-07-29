import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { localizedPath } from '@/lib/seo'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/** Card index → destination. Four map to the commercial landing pages; the
 *  two without a dedicated page prefill the contact form instead (conversion
 *  audit 2026-07-16: no card may be a dead end). */
const TARGETS = [
  'services/site-vitrine',
  'contact?sujet=application',
  'services/seo-geo',
  'contact?sujet=identite',
  'services/e-commerce',
  'services/refonte',
]

export function Services({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { services } = dict
  return (
    <section id="services" className="relative border-t border-line px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-[1640px]">
        <Reveal className="max-w-3xl">
          <p className="text-mono-label text-gold/85">{services.eyebrow}</p>
          <h2 className="mt-5 text-3xl">{services.title}</h2>
          <p className="mt-6 text-lg text-muted">{services.intro}</p>
        </Reveal>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item, i) => {
            const [path, query] = TARGETS[i].split('?')
            const href = `${localizedPath(locale, path)}${query ? `?${query}` : ''}`
            return (
              <li key={item.title} className="bg-surface">
                <Reveal delay={(i % 3) * 80} className="h-full">
                  <Link
                    href={href}
                    data-cursor="voir"
                    className="svc-card group flex h-full flex-col p-8 transition-colors duration-500 hover:bg-surface-2 md:p-10"
                  >
                    <span className="text-mono-label text-faint transition-colors group-hover:text-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-6 font-display text-2xl text-ink">{item.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted">{item.description}</p>
                    <span className="text-mono-label mt-auto inline-flex items-center gap-2 pt-6 text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      {dict.common.viewProject}
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
