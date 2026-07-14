import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { ProjectCard } from '@/components/work/ProjectCard'
import { FeaturedRail } from '@/components/work/FeaturedRail'
import { featuredProjects } from '@/lib/projects'
import { localizedPath } from '@/lib/seo'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

export function FeaturedWork({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const featured = featuredProjects.slice(0, 6)
  return (
    <section className="border-t border-line px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-[1640px]">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-mono-label text-gold/85">{dict.featured.eyebrow}</p>
            <h2 className="mt-5 text-3xl">{dict.featured.title}</h2>
          </div>
          <Link
            href={localizedPath(locale, 'work')}
            className="text-mono-label whitespace-nowrap text-gold transition-colors hover:text-gold-bright"
          >
            {dict.featured.cta} →
          </Link>
        </Reveal>

        <FeaturedRail>
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </FeaturedRail>
      </div>
    </section>
  )
}
