import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { ProjectCard } from '@/components/work/ProjectCard'
import { WorldDoor } from '@/components/work/WorldDoor'
import { FeaturedRail } from '@/components/work/FeaturedRail'
import { getProject } from '@/lib/projects'
import { localizedPath } from '@/lib/seo'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * The home showcase — Eddy's ruling (2026-07-15): the worlds are not a
 * separate band, they ride IN the sequence. Order of show: JCBO, the
 * Microdidact door, KermHosting, the Boxing Center door, then the heavyweight
 * individual sites from inside both worlds to give the walk its length.
 */
const SEQUENCE: (string | { door: 'microdidact' | 'boxingCenter' })[] = [
  'jcboyang-conseil',
  { door: 'microdidact' },
  'kermhosting',
  { door: 'boxingCenter' },
  'the-911',
  'boxing-center-portet',
  'la-brigade-mobile',
  'temps-dance',
  'mon-boum',
]

export function FeaturedWork({ locale, dict }: { locale: Locale; dict: Dictionary }) {
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
            className="text-mono-label -my-3 inline-flex items-center whitespace-nowrap py-3 text-gold transition-colors hover:text-gold-bright"
          >
            {dict.featured.cta} →
          </Link>
        </Reveal>

        <FeaturedRail>
          {SEQUENCE.map((item) => {
            if (typeof item !== 'string') {
              return <WorldDoor key={item.door} world={item.door} locale={locale} dict={dict} />
            }
            const project = getProject(item)
            return project ? (
              <ProjectCard key={project.slug} project={project} locale={locale} />
            ) : null
          })}
        </FeaturedRail>
      </div>
    </section>
  )
}
