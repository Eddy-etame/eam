import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { localizedPath } from '@/lib/seo'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

export function AboutTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { about, nav } = dict
  return (
    <section className="relative border-t border-line px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-[1640px]">
        <div className="grid gap-16 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <p className="text-mono-label text-gold/85">{about.eyebrow}</p>
            <h2 className="mt-5 text-3xl">{about.title}</h2>
            <p className="mt-6 text-xl leading-relaxed text-ink">{about.lead}</p>
            {about.body.map((paragraph) => (
              <p key={paragraph} className="mt-4 leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
            <Link
              href={localizedPath(locale, 'about')}
              className="mt-8 inline-flex items-center gap-2 text-mono-label text-gold transition-colors hover:text-gold-bright"
            >
              {nav.studio} →
            </Link>
          </Reveal>

          <div className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-lg border border-line bg-line">
            {about.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 70} className="bg-deep p-8">
                <p className="foil font-display text-4xl leading-none">{stat.value}</p>
                <p className="mt-3 text-mono-label text-muted">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <Reveal>
            <h3 className="text-mono-label text-faint">{about.valuesTitle}</h3>
          </Reveal>
          <ul className="mt-8 grid gap-8 md:grid-cols-3">
            {about.values.map((value, i) => (
              <li key={value.title}>
                <Reveal delay={i * 80} className="border-t border-gold/30 pt-6">
                  <h4 className="font-display text-2xl text-ink">{value.title}</h4>
                  <p className="mt-3 leading-relaxed text-muted">{value.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
