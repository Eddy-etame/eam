import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema, breadcrumbSchema } from '@/lib/schema'
import { ContactForm } from '@/components/sections/ContactForm'
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
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
    path: 'contact',
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <main id="content" className="px-6 pb-28 pt-36 md:px-12 md:pt-44 lg:px-20">
      <JsonLd
        data={[
          organizationSchema(locale, dict.meta.contact.description),
          breadcrumbSchema([
            { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
            { name: dict.nav.contact, url: absoluteUrl(localizedPath(locale, 'contact')) },
          ]),
        ]}
      />
      <div className="mx-auto max-w-[1640px]">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-mono-label text-gold/85">{dict.contact.eyebrow}</p>
            <h1 className="mt-5 text-4xl">{dict.contact.title}</h1>
            <p className="mt-6 max-w-md text-lg text-muted">{dict.contact.lead}</p>
            <div className="mt-10">
              <p className="text-mono-label text-faint">{dict.contact.emailLabel}</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-2 inline-block font-display text-2xl text-ink transition-colors hover:text-gold"
              >
                {siteConfig.email}
              </a>
            </div>
            <p className="text-mono-label mt-10 text-faint">
              {siteConfig.location.areaServed.join(' · ')}
            </p>
          </div>
          <ContactForm dict={dict} />
        </div>
      </div>
    </main>
  )
}
