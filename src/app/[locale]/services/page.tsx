import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, organizationSchema } from '@/lib/schema'
import { servicePages } from '@/lib/services-pages'
import { PricingBands } from '@/components/sections/PricingBands'
import { ConversionBand } from '@/components/ui/ConversionBand'
import { Reveal } from '@/components/ui/Reveal'
import { PageEntrance } from '@/components/ui/PageEntrance'

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
    title: dict.servicesPage.hub.metaTitle,
    description: dict.servicesPage.hub.metaDescription,
    path: 'services',
  })
}

/** Services hub — the commercial index: four doors, the floors, one ask. */
export default async function ServicesHubPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const hub = dict.servicesPage.hub

  return (
    <main id="content" className="px-6 pb-28 pt-36 md:px-12 md:pt-44 lg:px-20">
      <JsonLd
        data={[
          organizationSchema(locale, hub.metaDescription),
          breadcrumbSchema([
            { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
            { name: dict.nav.services, url: absoluteUrl(localizedPath(locale, 'services')) },
          ]),
        ]}
      />
      <div className="mx-auto max-w-[1640px]">
        <header className="max-w-3xl">
          <PageEntrance>
            <p data-pe="eyebrow" className="text-mono-label text-gold/85">{hub.eyebrow}</p>
            <h1 data-pe="title" className="mt-5 text-4xl">{hub.title}</h1>
            <p data-pe="lead" className="mt-6 text-lg leading-relaxed text-muted">{hub.lead}</p>
          </PageEntrance>
        </header>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {servicePages.map((page, i) => {
            const band = dict.pricing.bands[page.bandIndex]
            return (
              <Reveal key={page.slug} delay={i * 70}>
                <Link
                  href={localizedPath(locale, `services/${page.slug}`)}
                  data-cursor="voir"
                  className="group flex h-full flex-col justify-between rounded-lg border border-line p-8 transition-colors duration-500 hover:border-gold/50 md:p-10"
                >
                  <div>
                    <h2 className="font-display text-2xl text-ink transition-colors duration-300 group-hover:text-gold md:text-3xl">
                      {page.name[locale]}
                    </h2>
                    <p className="mt-4 leading-relaxed text-muted">{page.h1[locale]}</p>
                  </div>
                  <p className="mt-8 flex items-baseline justify-between gap-4">
                    <span className="text-mono-label text-faint">
                      {dict.servicesPage.floorLabel}{' '}
                      <span className="foil ml-1 whitespace-nowrap font-display text-xl">
                        {band.price}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="text-gold transition-transform duration-300 group-hover:translate-x-1.5"
                    >
                      →
                    </span>
                  </p>
                </Link>
              </Reveal>
            )
          })}
        </div>

        <PricingBands dict={dict} />

        <div className="mt-20">
          <ConversionBand locale={locale} dict={dict} variant="registre" />
        </div>
      </div>
    </main>
  )
}
