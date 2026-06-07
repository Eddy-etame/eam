import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema, breadcrumbSchema, faqSchema } from '@/lib/schema'
import { Reveal } from '@/components/ui/Reveal'
import { FAQ } from '@/components/sections/FAQ'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { siteConfig } from '@/lib/site.config'

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
  const role = locale === 'fr' ? 'Cofondateur' : 'Co-founder'

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

      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-[1640px]">
          <div className="hairline mb-12" />
          <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
            {siteConfig.founders.map((name, i) => (
              <li key={name} className="bg-deep">
                <Reveal delay={i * 80} className="flex h-full flex-col items-start p-10">
                  <span aria-hidden className="font-display text-6xl text-gold">
                    {name[0]}
                  </span>
                  <span className="mt-6 font-display text-2xl text-ink">{name}</span>
                  <span className="text-mono-label mt-1 text-faint">{role}</span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-[1640px]">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4">
            {about.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 60} className="bg-deep p-8 text-center">
                <p className="foil font-display text-4xl leading-none">{stat.value}</p>
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
      <ContactCTA locale={locale} dict={dict} />
    </main>
  )
}
