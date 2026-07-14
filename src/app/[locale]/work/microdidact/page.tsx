import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'
import { MicrodidactWorld } from '@/components/work/MicrodidactWorld'
import { microdidactProjects } from '@/lib/projects'

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
    title: dict.microdidact.meta.title,
    description: dict.microdidact.meta.description,
    path: 'work/microdidact',
  })
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

  const breadcrumb = breadcrumbSchema([
    { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
    { name: dict.nav.work, url: absoluteUrl(localizedPath(locale, 'work')) },
    { name: dict.microdidact.meta.title, url: absoluteUrl(localizedPath(locale, 'work/microdidact')) },
  ])

  return (
    <>
      <JsonLd data={breadcrumb} />
      <MicrodidactWorld locale={locale} dict={dict} projects={microdidactProjects} />
    </>
  )
}
