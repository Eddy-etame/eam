import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'
import { ProjectGallery } from '@/components/work/ProjectGallery'

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
    title: dict.meta.work.title,
    description: dict.meta.work.description,
    path: 'work',
  })
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  const breadcrumb = breadcrumbSchema([
    { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
    { name: dict.nav.work, url: absoluteUrl(localizedPath(locale, 'work')) },
  ])

  return (
    <main id="content" className="px-6 pb-28 pt-36 md:px-12 md:pt-44 lg:px-20">
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-[1640px]">
        <header className="max-w-3xl">
          <p className="text-mono-label text-gold/85">{dict.work.eyebrow}</p>
          <h1 className="mt-5 text-4xl">{dict.work.title}</h1>
          <p className="mt-6 text-lg text-muted">{dict.work.subtitle}</p>
        </header>
        <div className="mt-16">
          <ProjectGallery locale={locale} dict={dict} />
        </div>
      </div>
    </main>
  )
}
