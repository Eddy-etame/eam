import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { Hero } from '@/components/sections/Hero'
import { FeaturedWork } from '@/components/sections/FeaturedWork'
import { HomeWorlds } from '@/components/sections/HomeWorlds'
import { MarqueeStrip } from '@/components/sections/MarqueeStrip'
import { Clients } from '@/components/sections/Clients'
import { Services } from '@/components/sections/Services'
import { AboutTeaser } from '@/components/sections/AboutTeaser'
import { FAQ } from '@/components/sections/FAQ'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema, websiteSchema, faqSchema, serviceSchema } from '@/lib/schema'
import { absoluteUrl, localizedPath } from '@/lib/seo'
import { clients } from '@/lib/clients'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  // Client strip as machine-readable ItemList — each brand resolves to its
  // public case-study page (mapped from the data source, never hardcoded).
  const clientsListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.clients.title,
    itemListElement: clients.map((client, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Organization',
        name: client.name,
        url: absoluteUrl(localizedPath(locale, `work/${client.slug}`)),
      },
    })),
  }

  return (
    <main id="content">
      <JsonLd
        data={[
          organizationSchema(locale, dict.meta.home.description),
          websiteSchema(locale, dict.meta.home.description),
          serviceSchema(dict.services.items),
          faqSchema(dict.faq.items),
          clientsListSchema,
        ]}
      />
      {/* Chapters — the unified identity: the palette morphs as they scroll by */}
      <div data-chapter="heraldic">
        <Hero locale={locale} dict={dict} />
        <Clients locale={locale} dict={dict} />
      </div>
      <div data-chapter="atelier">
        <MarqueeStrip dict={dict} />
        <FeaturedWork locale={locale} dict={dict} />
        <HomeWorlds locale={locale} dict={dict} />
        <Services dict={dict} />
      </div>
      <div data-chapter="editorial">
        <AboutTeaser locale={locale} dict={dict} />
        <FAQ dict={dict} />
      </div>
      <div data-chapter="heraldic">
        <ContactCTA locale={locale} dict={dict} />
      </div>
    </main>
  )
}
