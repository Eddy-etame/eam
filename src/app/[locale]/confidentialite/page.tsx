import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

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
    title: dict.privacy.meta.title,
    description: dict.privacy.meta.description,
    path: 'confidentialite',
  })
}

/** Trust-anchor page — agents check /privacy before recommending a business. */
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const { privacy } = dict

  return (
    <main id="content">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
            { name: privacy.title, url: absoluteUrl(localizedPath(locale, 'confidentialite')) },
          ]),
        ]}
      />

      <div data-chapter="editorial">
        <section className="px-6 pb-28 pt-36 md:px-12 md:pb-32 md:pt-44 lg:px-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-mono-label text-gold/85">{privacy.eyebrow}</p>
            <h1 className="mt-5 text-4xl">{privacy.title}</h1>
            <p className="mt-8 text-lg leading-relaxed text-muted">{privacy.intro}</p>

            {privacy.sections.map((section) => (
              <section key={section.heading} className="mt-14 border-t border-line pt-8">
                <h2 className="font-display text-2xl text-ink">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
