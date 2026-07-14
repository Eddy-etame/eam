import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, collectionPageSchema, organizationSchema } from '@/lib/schema'
import { ProjectGallery } from '@/components/work/ProjectGallery'
import { WorkOverture } from '@/components/work/WorkOverture'
import { publicProjects } from '@/lib/projects'

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

  const schemas = [
    organizationSchema(locale, dict.meta.work.description),
    collectionPageSchema(locale, {
      name: dict.meta.work.title,
      description: dict.meta.work.description,
      path: 'work',
      slugs: publicProjects.map((p) => p.slug),
    }),
    breadcrumbSchema([
      { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
      { name: dict.nav.work, url: absoluteUrl(localizedPath(locale, 'work')) },
    ]),
  ]

  return (
    <main id="content" className="px-6 pb-28 pt-36 md:px-12 md:pt-44 lg:px-20">
      <JsonLd data={schemas} />
      <div className="mx-auto max-w-[1640px]">
        <WorkOverture
          eyebrow={dict.work.eyebrow}
          title={dict.work.title}
          subtitle={dict.work.subtitle}
          count={publicProjects.length}
        />
        <div className="mt-16">
          <ProjectGallery locale={locale} dict={dict} />
        </div>
      </div>
    </main>
  )
}
