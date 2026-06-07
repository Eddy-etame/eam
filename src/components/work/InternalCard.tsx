import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { localizedPath } from '@/lib/seo'
import { categoryLabels, type Project } from '@/lib/projects'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * NDA / internal project card. No live URL, no real screenshot — a branded
 * gradient with the EAM crest as a watermark, a "Confidential" badge, the
 * case-study text in clear, and a CTA to the contact page.
 */
export function InternalCard({
  project,
  locale,
  dict,
}: {
  project: Project
  locale: Locale
  dict: Dictionary
}) {
  const cs = project.caseStudy
  const blocks = [
    { label: dict.caseStudy.problemLabel, text: cs.problem[locale] },
    { label: dict.caseStudy.solutionLabel, text: cs.solution[locale] },
    { label: dict.caseStudy.outcomeLabel, text: cs.outcome[locale] },
  ]

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gold/25 bg-surface">
      <div
        className="relative grid h-44 place-items-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${project.color}, #0D1F3C 85%)` }}
      >
        <Logo className="h-20 text-white opacity-25" />
        <span className="text-mono-label absolute left-4 top-4 rounded-full border border-gold/50 bg-deep/50 px-3 py-1 text-gold backdrop-blur-sm">
          {dict.common.confidential}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <span className="text-mono-label text-faint">{categoryLabels[project.category][locale]}</span>
        <h3 className="mt-3 font-display text-2xl text-ink">{project.name}</h3>
        <p className="mt-1 text-muted">{project.tagline[locale]}</p>

        <dl className="mt-5 space-y-3 text-sm">
          {blocks.map((block) => (
            <div key={block.label}>
              <dt className="text-mono-label text-gold/80">{block.label}</dt>
              <dd className="mt-1 leading-relaxed text-muted">{block.text}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={localizedPath(locale, 'contact')}
          className="text-mono-label mt-auto inline-flex pt-6 text-gold transition-colors hover:text-gold-bright"
        >
          {dict.common.requestAccess} →
        </Link>
      </div>
    </article>
  )
}
