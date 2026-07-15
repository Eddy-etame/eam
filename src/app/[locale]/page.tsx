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
import { CategoryChips } from '@/components/work/CategoryChips'
import { organizationSchema, websiteSchema, faqSchema, serviceSchema } from '@/lib/schema'
import { absoluteUrl, localizedPath } from '@/lib/seo'
import { clients } from '@/lib/clients'
import { microdidactProjects } from '@/lib/projects'
import { categories, categorySlugs } from '@/lib/taxonomy'
import type { ProjectCategory } from '@/lib/taxonomy'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  // Client strip as machine-readable ItemList — each brand resolves to its
  // public case-study page (mapped from the data source, never hardcoded).
  // Category chips — same routing as the registre: Sport & Bien-être enters
  // the Boxing Center world; every sector present among the sixteen enters the
  // Microdidact traversée pre-filtered (?cat=<slug>). Derived from data.
  const worldCategories = categories.filter(
    (c) => c === 'Sport & Bien-être' || microdidactProjects.some((p) => p.category === c),
  )
  const hrefFor = (category: ProjectCategory) =>
    category === 'Sport & Bien-être'
      ? localizedPath(locale, 'work/boxing-center')
      : `${localizedPath(locale, 'work/microdidact')}?cat=${categorySlugs[category]}`

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
        {/* Worlds ride INSIDE the showcase sequence (Eddy 2026-07-15) */}
        <FeaturedWork locale={locale} dict={dict} />
        {/* Explore by trade — every chip lands in a world already filtered */}
        <section className="border-t border-line px-6 py-12 md:px-12 lg:px-20">
          <div className="mx-auto flex max-w-[1640px] flex-col gap-4 md:flex-row md:items-baseline md:gap-8">
            <p className="text-mono-label shrink-0 text-gold/85">{dict.filters.eyebrow}</p>
            <CategoryChips dict={dict} categories={worldCategories} hrefFor={hrefFor} />
          </div>
        </section>
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
