import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, creativeWorkSchema, organizationSchema } from '@/lib/schema'
import { getProject, publicProjects, categoryLabels } from '@/lib/projects'
import { CaseCover } from '@/components/work/CaseCover'
import { CaseAside } from '@/components/work/CaseAside'
import { ConversionBand } from '@/components/ui/ConversionBand'
import { Reveal } from '@/components/ui/Reveal'

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
  // Clamp: name + tagline must stay within a ~60-char SERP title budget.
  const base = project.name
  const tagline = project.tagline[locale]
  // 54-char budget: the layout template appends ' · EAM' (6 chars) to every
  // title — the old 60 budget produced 65-66 char SERP titles (audit P2).
  const room = 54 - base.length - 3
  const title =
    room > 12 ? `${base} — ${tagline.length > room ? `${tagline.slice(0, room - 1).trimEnd()}…` : tagline}` : base
  return buildMetadata({
    locale,
    title,
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
    {
      label: dict.caseStudy.outcomeLabel,
      text: cs.outcome[locale],
      // The provisional note only shows while the outcome awaits client sign-off.
      note: cs.outcomeVerified ? undefined : dict.caseStudy.draftNote,
    },
  ]

  return (
    <main id="content" className="pt-28 md:pt-32">
      <JsonLd
        data={[
          organizationSchema(locale, dict.meta.studio.description),
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
                {project.underMicrodidact && (
                  <span className="ml-3 rounded border border-gold/30 px-2 py-0.5 text-gold-bright">
                    {dict.work.microdidactBadge}
                  </span>
                )}
              </p>
              <h1 className="mt-4 text-4xl">{project.name}</h1>
              <p className="mt-5 max-w-xl text-xl text-muted">{project.tagline[locale]}</p>
            </div>
            <Reveal dir="right">
              <ul className="flex flex-wrap gap-2 lg:justify-end">
                {project.techStack.map((tech) => (
                  <li key={tech} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          </header>

          {project.underMicrodidact && (
            <p className="mt-6 max-w-2xl border-l-2 border-gold/40 pl-4 text-sm italic text-faint">
              {dict.work.microdidactNote}
            </p>
          )}
        </div>
      </div>

      <div className="mt-12 px-6 md:px-12 lg:px-20">
        <div data-case-cover className="mx-auto max-w-[1640px]">
          <CaseCover color={project.color} url={project.liveUrl !== '#' ? project.liveUrl : undefined}>
            {project.thumb ? (
              <Image
                src={project.thumb}
                alt={project.name}
                fill
                sizes="(max-width: 1640px) 100vw, 1640px"
                priority
                className="object-cover object-top"
              />
            ) : slug === 'boxing-center' ? (
              /* The network umbrella carries NO salle screenshot on purpose —
                 every capture belongs to ONE salle's site. Brand stage instead. */
              <span aria-hidden className="absolute inset-0 overflow-hidden">
                <span
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(165deg, ${project.color} 0%, #131630 52%, var(--c-deep) 100%)`,
                  }}
                />
                <span
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(ellipse 62% 46% at 50% 68%, #E8001C2E 0%, transparent 70%)',
                  }}
                />
                <span className="absolute left-1/2 top-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]">
                  <Image
                    src="/logos/boxing-center.png"
                    alt=""
                    width={1200}
                    height={556}
                    sizes="70vw"
                    className="h-auto w-full"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </span>
                <span className="absolute inset-0 grid place-items-center">
                  <Image
                    src="/logos/boxing-center.png"
                    alt="Boxing Center"
                    width={380}
                    height={176}
                    sizes="380px"
                    className="h-auto w-[min(48vw,380px)]"
                    style={{ filter: 'brightness(0) invert(1)', opacity: 0.94 }}
                  />
                </span>
              </span>
            ) : (
              <span aria-hidden className="font-display text-[clamp(4rem,18vw,12rem)] text-white/10">
                {initials}
              </span>
            )}
          </CaseCover>
        </div>
      </div>

      {/* Stat band — craft-level / self-reported figures only, in living foil */}
      {cs.metrics && (
        <div className="mt-10 px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1640px]">
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
              {cs.metrics.map((m) => (
                <div key={m.label[locale]} className="bg-deep p-8 text-center">
                  <p className="foil foil-anim font-display text-3xl leading-none">{m.value}</p>
                  <p className="text-mono-label mt-3 text-muted">{m.label[locale]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
            {blocks.map((block, i) => (
              <Reveal key={block.label} dir={i % 2 === 0 ? 'left' : 'right'} delay={i * 90}>
                <div className="border-t border-gold/30 pt-6">
                  <h3 className="font-display text-2xl text-ink">{block.label}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{block.text}</p>
                  {block.note && <p className="mt-2 text-xs italic text-faint">{block.note}</p>}
                </div>
              </Reveal>
            ))}

            {cs.testimonial && (
              <figure className="border-t border-gold/30 pt-6">
                <blockquote className="font-display text-2xl leading-snug text-ink">
                  <span className="text-gold/60">“</span>
                  {cs.testimonial.quote[locale]}
                  <span className="text-gold/60">”</span>
                </blockquote>
                <figcaption className="text-mono-label mt-4 text-muted">
                  {cs.testimonial.author}
                  {cs.testimonial.role ? ` — ${cs.testimonial.role[locale]}` : ''}
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>

      {/* Screenshot gallery — renders as soon as gallery assets exist */}
      {cs.gallery?.length ? (
        <div className="px-6 pb-24 md:px-12 lg:px-20">
          <div className="mx-auto grid max-w-[1640px] gap-6 md:grid-cols-2">
            {cs.gallery.map((src) => (
              <div
                key={src}
                className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line"
              >
                <Image
                  src={src}
                  alt={project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* The one ask of the page — after the proof, before the next piece */}
      <div className="px-6 pb-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1640px]">
          <ConversionBand locale={locale} dict={dict} variant="case" />
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

      <CaseAside liveUrl={project.liveUrl} label={dict.common.visitSite} />
    </main>
  )
}
