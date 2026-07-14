import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema, breadcrumbSchema } from '@/lib/schema'
import { ContactForm } from '@/components/sections/ContactForm'
import { CopyEmail } from '@/components/ui/CopyEmail'
import { siteConfig } from '@/lib/site.config'
import { team } from '@/lib/team'

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

            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/35 px-4 py-2 text-mono-label text-gold">
              <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              {dict.contact.responseChip}
            </p>

            <div className="mt-10">
              <p className="text-mono-label text-faint">{dict.contact.emailLabel}</p>
              <CopyEmail email={siteConfig.email} copiedLabel={dict.contact.copied} />
            </div>

            {/* Who answers — you write to the three craftsmen, not a mailbox. */}
            <div className="mt-10">
              <p className="text-mono-label text-faint">{dict.contact.whoAnswers}</p>
              <ul className="mt-4 flex flex-wrap gap-6">
                {team
                  .filter((m) => m.image)
                  .map((m) => (
                    <li key={m.id} className="flex items-center gap-3">
                      <span className="block h-12 w-12 overflow-hidden rounded-full border border-line-strong bg-surface">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.image as string}
                          alt={`${m.first} ${m.surname}`}
                          className="h-full w-full object-cover object-top grayscale"
                          loading="lazy"
                        />
                      </span>
                      <span>
                        <span className="block text-sm text-ink">
                          {m.first} {m.surname}
                        </span>
                        <span className="text-2xs uppercase tracking-[0.18em] text-faint">
                          {m.role[locale]}
                        </span>
                      </span>
                    </li>
                  ))}
              </ul>
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
