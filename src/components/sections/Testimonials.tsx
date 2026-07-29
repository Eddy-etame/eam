import Link from 'next/link'
import { testimonials } from '@/lib/testimonials'
import { localizedPath } from '@/lib/seo'
import { Reveal } from '@/components/ui/Reveal'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * Human proof — client-approved quotes only (see src/lib/testimonials.ts for
 * the DGCCRF red line). Every quote links to its case study: on this site a
 * testimonial is a receipt with a name, so the layout stays documentary —
 * hairlines and attribution, no star theater, no carousel.
 */
export function Testimonials({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="border-t border-line px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-[1640px]">
        <p className="text-mono-label text-gold/85">{dict.testimonials.eyebrow}</p>
        <h2 className="mt-5 text-3xl">{dict.testimonials.title}</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">{dict.testimonials.note}</p>

        <div className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.slug} delay={i * 80}>
              <figure className="flex h-full flex-col border-t border-gold/30 pt-6">
                <blockquote className="font-display text-xl leading-relaxed text-ink md:text-2xl">
                  {'« '}
                  {t.quote[locale]}
                  {' »'}
                </blockquote>
                <figcaption className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="text-mono-label text-gold">{t.org}</span>
                  <span className="text-sm text-muted">{t.who[locale]}</span>
                  <Link
                    href={localizedPath(locale, `work/${t.slug}`)}
                    className="text-mono-label text-faint underline-offset-4 transition-colors hover:text-gold hover:underline"
                  >
                    {dict.common.viewCase} <span aria-hidden>→</span>
                  </Link>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
