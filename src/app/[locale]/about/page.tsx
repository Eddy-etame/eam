import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema, breadcrumbSchema, faqSchema } from '@/lib/schema'
import { Reveal } from '@/components/ui/Reveal'
import { CountUp } from '@/components/ui/CountUp'
import { FAQ } from '@/components/sections/FAQ'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { TeamSection } from '@/components/sections/TeamSection'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return buildMetadata({
    locale,
    title: dict.meta.studio.title,
    description: dict.meta.studio.description,
    path: 'about',
  })
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const { about } = dict

  return (
    <main id="content">
      <JsonLd
        data={[
          organizationSchema(locale, dict.meta.studio.description),
          breadcrumbSchema([
            { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
            { name: dict.nav.studio, url: absoluteUrl(localizedPath(locale, 'about')) },
          ]),
          faqSchema(dict.faq.items),
        ]}
      />

      <div data-chapter="heraldic">
      <section className="px-6 pt-36 md:px-12 md:pt-44 lg:px-20">
        <div className="mx-auto max-w-[1640px]">
          <p className="text-mono-label text-gold/85">{about.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-4xl">{about.title}</h1>
          <p className="mt-8 max-w-3xl text-2xl leading-relaxed text-ink">{about.lead}</p>
          <div className="mt-6 max-w-2xl">
            {about.body.map((paragraph) => (
              <p key={paragraph} className="mt-4 leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <TeamSection locale={locale} dict={dict} />
      </div>

      <div data-chapter="editorial">
      <section className="border-t border-line px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-[1640px]">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4">
            {about.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 60} className="bg-deep p-8 text-center">
                <p className="foil foil-anim font-display text-4xl leading-none">
                  <CountUp value={stat.value} />
                </p>
                <p className="text-mono-label mt-3 text-muted">{stat.label}</p>
              </Reveal>
            ))}
          </div>

          <h2 className="text-mono-label mt-16 text-faint">{about.valuesTitle}</h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-3">
            {about.values.map((value, i) => (
              <li key={value.title}>
                <Reveal delay={i * 80} className="border-t border-gold/30 pt-6">
                  <h3 className="font-display text-2xl text-ink">{value.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{value.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQ dict={dict} />
      </div>

      <div data-chapter="heraldic">
        <ContactCTA locale={locale} dict={dict} />
      </div>
    </main>
  )
}
