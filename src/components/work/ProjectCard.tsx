import Image from 'next/image'
import Link from 'next/link'
import { localizedPath } from '@/lib/seo'
import { categoryLabels, type Project } from '@/lib/projects'
import type { Locale } from '@/i18n/config'

function initials(name: string): string {
  return name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

/**
 * Public project card. Uses a branded gradient + initials tile rather than a
 * fragile hot-linked logo, so the gallery stays cohesive and never shows a
 * broken image. Links to the case study.
 */
export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  return (
    <Link href={localizedPath(locale, `work/${project.slug}`)} className="group block">
      <article>
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line"
          style={{ background: `linear-gradient(135deg, ${project.color}, var(--c-navy) 82%)` }}
        >
          {project.thumb ? (
            <Image
              src={project.thumb}
              alt={`${project.name} — ${categoryLabels[project.category][locale]}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          ) : (
            <span
              aria-hidden
              className="absolute inset-0 grid place-items-center font-display text-[clamp(3rem,10vw,7rem)] text-white/10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            >
              {initials(project.name)}
            </span>
          )}
          <span className="text-mono-label absolute left-4 top-4 rounded bg-black/40 px-2 py-1 text-white/90 backdrop-blur-sm">
            {categoryLabels[project.category][locale]}
          </span>
          <span className="text-mono-label absolute bottom-4 right-4 text-white/70 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
            {project.year}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent transition-colors duration-500 group-hover:ring-gold/55 group-focus-visible:ring-gold/55"
          />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-ink transition-colors duration-300 group-hover:text-gold group-focus-visible:text-gold">
              {project.name}
            </h3>
            <p className="mt-1 text-muted">{project.tagline[locale]}</p>
          </div>
          <span
            aria-hidden
            className="mt-1.5 shrink-0 text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            →
          </span>
        </div>
      </article>
    </Link>
  )
}
