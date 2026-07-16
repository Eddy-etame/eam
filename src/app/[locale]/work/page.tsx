import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, collectionPageSchema, organizationSchema } from '@/lib/schema'
import { ProjectGallery } from '@/components/work/ProjectGallery'
import { WorkOverture } from '@/components/work/WorkOverture'
import { CategoryChips } from '@/components/work/CategoryChips'
import { publicProjects, microdidactProjects } from '@/lib/projects'
import { categories, categorySlugs } from '@/lib/taxonomy'
import type { ProjectCategory } from '@/lib/taxonomy'

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

  // Chips = the categories a world genuinely owns pre-filtered, in canonical
  // order: Sport & Bien-être → the Boxing Center world; every category present
  // among the sixteen → the Microdidact traversée (?cat=<slug>). Derived from
  // data — a category with no world destination never renders a chip.
  const worldCategories = categories.filter(
    (c) => c === 'Sport & Bien-être' || microdidactProjects.some((p) => p.category === c),
  )
  const hrefFor = (category: ProjectCategory) =>
    category === 'Sport & Bien-être'
      ? localizedPath(locale, 'work/boxing-center')
      : `${localizedPath(locale, 'work/microdidact')}?cat=${categorySlugs[category]}`

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
          countLabel={dict.work.countLabel}
        />
        {/* Filter chips — each one enters the owning world already filtered */}
        <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-baseline md:gap-8">
          <p className="text-mono-label shrink-0 text-gold/85">{dict.filters.eyebrow}</p>
          <CategoryChips dict={dict} categories={worldCategories} hrefFor={hrefFor} />
        </div>
        <div className="mt-16">
          <ProjectGallery locale={locale} dict={dict} />
        </div>
      </div>
    </main>
  )
}
