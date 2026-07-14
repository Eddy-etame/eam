import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { Hero } from '@/components/sections/Hero'
import { FeaturedWork } from '@/components/sections/FeaturedWork'
import { MarqueeStrip } from '@/components/sections/MarqueeStrip'
import { Clients } from '@/components/sections/Clients'
import { Services } from '@/components/sections/Services'
import { AboutTeaser } from '@/components/sections/AboutTeaser'
import { FAQ } from '@/components/sections/FAQ'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema, websiteSchema, faqSchema, serviceSchema } from '@/lib/schema'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <main id="content">
      <JsonLd
        data={[
          organizationSchema(locale, dict.meta.home.description),
          websiteSchema(locale, dict.meta.home.description),
          serviceSchema(dict.services.items),
          faqSchema(dict.faq.items),
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
