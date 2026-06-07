'use client'

import { useMemo, useState } from 'react'
import { ProjectCard } from './ProjectCard'
import { InternalCard } from './InternalCard'
import {
  publicProjects,
  internalProjects,
  categoryLabels,
  type ProjectCategory,
} from '@/lib/projects'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

export function ProjectGallery({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const categories = useMemo(() => {
    const seen: ProjectCategory[] = []
    for (const project of publicProjects) {
      if (!seen.includes(project.category)) seen.push(project.category)
    }
    return seen
  }, [])

  const [active, setActive] = useState<ProjectCategory | 'all'>('all')
  const filtered =
    active === 'all' ? publicProjects : publicProjects.filter((p) => p.category === active)

  const chip = (isActive: boolean) =>
    cn(
      'text-mono-label rounded-full border px-4 py-2 transition-colors duration-300',
      isActive
        ? 'border-gold bg-gold text-deep'
        : 'border-line text-muted hover:border-gold/50 hover:text-ink',
    )

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setActive('all')} aria-pressed={active === 'all'} className={chip(active === 'all')}>
          {dict.work.filterAll}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            aria-pressed={active === category}
            className={chip(active === category)}
          >
            {categoryLabels[category][locale]}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} />
        ))}
      </div>

      {internalProjects.length > 0 && (
        <section className="mt-28 border-t border-line pt-16">
          <h2 className="text-3xl">{dict.work.internalSectionTitle}</h2>
          <p className="mt-4 max-w-2xl text-muted">{dict.work.internalNote}</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {internalProjects.map((project) => (
              <InternalCard key={project.slug} project={project} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
