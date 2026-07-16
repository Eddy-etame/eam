import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, collectionPageSchema, organizationSchema } from '@/lib/schema'
import { MicrodidactWorld } from '@/components/work/MicrodidactWorld'
import { microdidactProjects } from '@/lib/projects'
import { categories } from '@/lib/taxonomy'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const base = buildMetadata({
    locale,
    title: dict.microdidact.meta.title,
    description: dict.microdidact.meta.description,
    path: 'work/microdidact',
  })
  // Share-card copy, distinct from the <title>/meta description: sell the
  // traversée itself — sixteen rooms crossed in one scroll.
  const ogTitle =
    locale === 'fr'
      ? 'Le monde Microdidact — 16 projets, une traversée au scroll'
      : 'The Microdidact world — 16 projects, one scroll journey'
  const ogDescription =
    locale === 'fr'
      ? "Seize projets forgés chez Microdidact (Toulouse), traversés en un seul voyage scroll-piloté — on entre dans chaque pièce : restaurants, garages, commerces, outils métier. Chaque salle mène à son étude de cas."
      : 'Sixteen projects forged at Microdidact (Toulouse), crossed in a single scroll-driven journey — you step into each room: restaurants, garages, shops, business tools. Every room leads to its case study.'
  return {
    ...base,
    openGraph: { ...base.openGraph, title: ogTitle, description: ogDescription },
    twitter: { ...base.twitter, title: ogTitle, description: ogDescription },
  }
}

/**
 * The Microdidact world — the origin chapter of the registre. All copy and the
 * full project list live in the DOM (SEO first); MicrodidactWorld layers the
 * cinematic entrance, particle atmosphere and scroll choreography on top.
 */
export default async function MicrodidactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  // ?cat= filtering is CLIENT-side (MicrodidactWorld's SearchParamsBridge):
  // reading searchParams here had silently turned this flagship route DYNAMIC
  // — losing SSG and breaking the hash-locked CSP. The page prerenders the
  // complete sixteen (SEO stays whole); the filter applies after hydration.

  // Chip row = the categories actually present among the sixteen, in
  // canonical taxonomy order — derived from data, never hardcoded.
  const worldCategories = categories.filter((c) =>
    microdidactProjects.some((p) => p.category === c),
  )

  // Organization + CollectionPage bind the sixteen case studies to EAM for
  // answer engines (llms.txt cites this page as the canonical Microdidact URL).
  const schemas = [
    organizationSchema(locale, dict.microdidact.meta.description),
    collectionPageSchema(locale, {
      name: dict.microdidact.meta.title,
      description: dict.microdidact.meta.description,
      path: 'work/microdidact',
      slugs: microdidactProjects.map((p) => p.slug),
    }),
    breadcrumbSchema([
      { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
      { name: dict.nav.work, url: absoluteUrl(localizedPath(locale, 'work')) },
      { name: dict.microdidact.meta.title, url: absoluteUrl(localizedPath(locale, 'work/microdidact')) },
    ]),
  ]

  return (
    <>
      <JsonLd data={schemas} />
      <MicrodidactWorld
        locale={locale}
        dict={dict}
        projects={microdidactProjects}
        allCategories={worldCategories}
        totalProjects={microdidactProjects.length}
      />
    </>
  )
}
