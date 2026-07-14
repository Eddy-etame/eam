import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'
import { BCWorld } from '@/components/work/BCWorld'

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
    title: dict.bcWorld.meta.title,
    description: dict.bcWorld.meta.description,
    path: 'work/boxing-center',
  })
}

/**
 * The Boxing Center world — a literal route that takes precedence over
 * work/[slug]. EAM's richest direct engagement (five immersive sites, a print
 * campaign, coach plannings) rendered as a cinematic journey. All copy and
 * every real link stay in the DOM (SEO first); BCWorld layers the iris
 * entrance, parallax salle bands and print spread on top.
 */
export default async function BoxingCenterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  const breadcrumb = breadcrumbSchema([
    { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
    { name: dict.nav.work, url: absoluteUrl(localizedPath(locale, 'work')) },
    { name: dict.bcWorld.meta.title, url: absoluteUrl(localizedPath(locale, 'work/boxing-center')) },
  ])

  return (
    <>
      <JsonLd data={breadcrumb} />
      <BCWorld locale={locale} dict={dict} />
    </>
  )
}
