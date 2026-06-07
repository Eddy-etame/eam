import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, creativeWorkSchema } from '@/lib/schema'
import { getProject, publicProjects, categoryLabels } from '@/lib/projects'

export const revalidate = 86400
export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) => publicProjects.map((project) => ({ locale, slug: project.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const project = getProject(slug)
  if (!project || project.isInternal) return {}
  return buildMetadata({
    locale,
    title: `${project.name} — ${project.tagline[locale]}`,
    description: project.description[locale],
    path: `work/${slug}`,
  })
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const project = getProject(slug)
  if (!project || project.isInternal) notFound()

  const dict = getDictionary(locale)
  const cs = project.caseStudy
  const idx = publicProjects.findIndex((p) => p.slug === slug)
  const next = publicProjects[(idx + 1) % publicProjects.length]
  const initials = project.name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const blocks = [
    { label: dict.caseStudy.problemLabel, text: cs.problem[locale] },
    { label: dict.caseStudy.solutionLabel, text: cs.solution[locale] },
    { label: dict.caseStudy.outcomeLabel, text: cs.outcome[locale], note: dict.caseStudy.draftNote },
  ]

  return (
    <main id="content" className="pt-28 md:pt-32">
      <JsonLd
        data={[
          creativeWorkSchema(project, locale),
          breadcrumbSchema([
            { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
            { name: dict.nav.work, url: absoluteUrl(localizedPath(locale, 'work')) },
            { name: project.name, url: absoluteUrl(localizedPath(locale, `work/${slug}`)) },
          ]),
        ]}
      />

      <div className="px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1640px]">
          <nav aria-label="Breadcrumb" className="text-mono-label text-faint">
            <Link href={localizedPath(locale)} className="hover:text-ink">
              {dict.nav.home}
            </Link>
            <span className="px-2" aria-hidden>
              /
            </span>
            <Link href={localizedPath(locale, 'work')} className="hover:text-ink">
              {dict.nav.work}
            </Link>
            <span className="px-2" aria-hidden>
              /
            </span>
            <span className="text-muted">{project.name}</span>
          </nav>

          <header className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <p className="text-mono-label text-gold/85">
                {categoryLabels[project.category][locale]} · {project.year}
              </p>
              <h1 className="mt-4 text-4xl">{project.name}</h1>
              <p className="mt-5 max-w-xl text-xl text-muted">{project.tagline[locale]}</p>
            </div>
            <ul className="flex flex-wrap gap-2 lg:justify-end">
              {project.techStack.map((tech) => (
                <li key={tech} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">
                  {tech}
                </li>
              ))}
            </ul>
          </header>
        </div>
      </div>

      <div className="mt-12 px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1640px]">
          <div
            className="relative grid aspect-[16/7] place-items-center overflow-hidden rounded-xl border border-line grain"
            style={{ background: `linear-gradient(135deg, ${project.color}, var(--c-navy) 82%)` }}
          >
            <span aria-hidden className="font-display text-[clamp(4rem,18vw,12rem)] text-white/10">
              {initials}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto grid max-w-[1640px] gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-mono-label text-faint">{dict.caseStudy.overview}</h2>
            <p className="mt-5 text-2xl leading-relaxed text-ink">{project.description[locale]}</p>
            {project.liveUrl !== '#' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mono-label mt-8 inline-flex rounded-full border border-gold/40 px-6 py-3 text-ink transition-colors hover:bg-gold hover:text-deep"
              >
                {dict.caseStudy.visitLabel} ↗
              </a>
            )}
          </div>

          <div className="space-y-10">
            {blocks.map((block) => (
              <div key={block.label} className="border-t border-gold/30 pt-6">
                <h3 className="font-display text-2xl text-ink">{block.label}</h3>
                <p className="mt-3 leading-relaxed text-muted">{block.text}</p>
                {block.note && <p className="mt-2 text-xs italic text-faint">{block.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1640px]">
          <Link
            href={localizedPath(locale, `work/${next.slug}`)}
            className="group flex items-center justify-between gap-6"
          >
            <span>
              <span className="text-mono-label block text-faint">{dict.caseStudy.nextLabel}</span>
              <span className="mt-2 block font-display text-3xl text-ink transition-colors group-hover:text-gold">
                {next.name}
              </span>
            </span>
            <span aria-hidden className="text-2xl text-gold">
              →
            </span>
          </Link>
        </div>
      </div>
    </main>
  )
}
