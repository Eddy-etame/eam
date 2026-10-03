import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  breadcrumbSchema,
  collectionPageSchema,
  creativeWorkSchema,
  organizationSchema,
} from '@/lib/schema'
import { BCWorld } from '@/components/work/BCWorld'
import { getProject, publicProjects } from '@/lib/projects'

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
    title: dict.bcWorld.meta.title,
    description: dict.bcWorld.meta.description,
    path: 'work/boxing-center',
    // Explicit segment card — same reason as the Microdidact world page.
    images: [absoluteUrl(`/${locale}/work/boxing-center/opengraph-image`)],
  })
  // Share-card copy, distinct from the <title>/meta description: the five
  // named salles, then the scale of the whole ecosystem.
  const ogTitle =
    locale === 'fr'
      ? 'Le monde Boxing Center — 5 salles, 19 pièces en ligne'
      : 'The Boxing Center world — 5 gyms, 19 live pieces'
  const ogDescription =
    locale === 'fr'
      ? "Cinq salles toulousaines — Portet, États-Unis, Minimes, St-Cyprien, Ramonville — un site par salle, jamais cloné, deux clubs de boxe anglaise, sept sites de proximité et trois boutiques. Forgé par EAM."
      : 'Five Toulouse gyms — Portet, États-Unis, Minimes, St-Cyprien, Ramonville — one site per gym, never cloned, two English-boxing clubs, seven proximity sites and three stores. Forged by EAM.'
  return {
    ...base,
    openGraph: { ...base.openGraph, title: ogTitle, description: ogDescription },
    twitter: { ...base.twitter, title: ogTitle, description: ogDescription },
  }
}

/**
 * The Boxing Center world — a literal route that takes precedence over
 * work/[slug]. EAM's richest direct engagement (gym sites, clubs, proximity
 * sites, stores, tools) rendered as a cinematic journey. All copy and every
 * real link stay in the DOM (SEO first); BCWorld layers the iris entrance,
 * the parallax bands and the proximity rail on top.
 */
export default async function BoxingCenterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  // The umbrella 'boxing-center' project is shadowed by this literal route, so
  // its CreativeWork #work node (referenced by /work's CollectionPage hasPart)
  // must be emitted HERE. Organization + CollectionPage bind every case study
  // of the world (gyms, clubs, proximity family, stores) to EAM for answer
  // engines.
  const umbrella = getProject('boxing-center')
  const salleSlugs = publicProjects
    .filter((p) => p.world === 'boxing-center' && p.slug !== 'boxing-center')
    .map((p) => p.slug)

  const schemas = [
    organizationSchema(locale, dict.bcWorld.meta.description),
    collectionPageSchema(locale, {
      name: dict.bcWorld.meta.title,
      description: dict.bcWorld.meta.description,
      path: 'work/boxing-center',
      slugs: salleSlugs,
    }),
    ...(umbrella ? [creativeWorkSchema(umbrella, locale)] : []),
    breadcrumbSchema([
      { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
      { name: dict.nav.work, url: absoluteUrl(localizedPath(locale, 'work')) },
      { name: dict.bcWorld.meta.title, url: absoluteUrl(localizedPath(locale, 'work/boxing-center')) },
    ]),
  ]

  return (
    <>
      <JsonLd data={schemas} />
      <BCWorld locale={locale} dict={dict} />
    </>
  )
}
