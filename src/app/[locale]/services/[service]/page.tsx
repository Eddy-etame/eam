import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, faqSchema, organizationSchema } from '@/lib/schema'
import { servicePages, getServicePage } from '@/lib/services-pages'
import { getProject } from '@/lib/projects'
import { testimonialFor } from '@/lib/testimonials'
import { siteConfig } from '@/lib/site.config'
import { Reveal } from '@/components/ui/Reveal'
import { Magnetic } from '@/components/ui/Magnetic'
import { ConversionBand } from '@/components/ui/ConversionBand'
import { PageEntrance } from '@/components/ui/PageEntrance'

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) => servicePages.map((s) => ({ locale, service: s.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; service: string }>
}): Promise<Metadata> {
  const { locale, service } = await params
  if (!isLocale(locale)) return {}
  const page = getServicePage(service)
  if (!page) return {}
  const dict = getDictionary(locale)
  const floor = dict.pricing.bands[page.bandIndex].price
  // Intent-led SERP title: service + floor — what a searching owner scans for.
  const title =
    locale === 'fr' ? `${page.name.fr} — ${floor}` : `${page.name.en} — ${floor}`
  return buildMetadata({
    locale,
    title,
    description: page.lead[locale],
    path: `services/${service}`,
  })
}

/**
 * Commercial landing page — the lead engine (conversion audit 2026-07-16).
 * Outcome-led copy, the floor, three real proofs, mini-FAQ with schema, the
 * free X-ray offer and a prefilled path to the form. Fully static, hash-CSP'd.
 */
export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; service: string }>
}) {
  const { locale, service } = await params
  if (!isLocale(locale)) notFound()
  const page = getServicePage(service)
  if (!page) notFound()
  const dict = getDictionary(locale)
  const sp = dict.servicesPage
  const band = dict.pricing.bands[page.bandIndex]
  const proofs = page.proofSlugs.map((slug) => getProject(slug)).filter((p) => p !== undefined)
  const contactHref = `${localizedPath(locale, 'contact')}?sujet=${page.sujet}`
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    locale === 'fr'
      ? `Bonjour EAM — je vous contacte au sujet de : ${page.name.fr}`
      : `Hello EAM — I'm reaching out about: ${page.name.en}`,
  )}`

  return (
    <main id="content" className="px-6 pb-28 pt-36 md:px-12 md:pt-44 lg:px-20">
      <JsonLd
        data={[
          organizationSchema(locale, page.lead[locale]),
          faqSchema(page.faq.map((f) => ({ q: f.q[locale], a: f.a[locale] }))),
          breadcrumbSchema([
            { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
            { name: dict.nav.services, url: absoluteUrl(localizedPath(locale, 'services')) },
            { name: page.name[locale], url: absoluteUrl(localizedPath(locale, `services/${service}`)) },
          ]),
        ]}
      />

      <div className="mx-auto max-w-[1640px]">
        {/* ── Outcome-led opening — their gain, the floor, zero friction ──── */}
        <nav aria-label="Breadcrumb" className="text-mono-label text-faint">
          <Link href={localizedPath(locale)} className="hover:text-ink">
            {dict.nav.home}
          </Link>
          <span className="px-2" aria-hidden>
            /
          </span>
          <Link href={localizedPath(locale, 'services')} className="hover:text-ink">
            {dict.nav.services}
          </Link>
          <span className="px-2" aria-hidden>
            /
          </span>
          <span className="text-muted">{page.name[locale]}</span>
        </nav>

        <header className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <PageEntrance>
            <p data-pe="eyebrow" className="text-mono-label text-gold/85">{page.name[locale]}</p>
            <h1 data-pe="title" className="mt-4 max-w-3xl text-4xl md:text-5xl">{page.h1[locale]}</h1>
            <p data-pe="lead" className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{page.lead[locale]}</p>

            <div data-pe="cta" className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  href={contactHref}
                  className="cta-shine shadow-gold group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold px-8 py-4 font-medium text-deep transition-colors duration-300 hover:bg-gold-bright"
                >
                  {sp.quoteCta}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </Magnetic>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mono-label inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-muted transition-colors duration-300 hover:border-gold/50 hover:text-ink"
              >
                {sp.whatsappCta} <span aria-hidden>↗</span>
              </a>
            </div>
            <p data-pe="cta" className="text-mono-label mt-4 text-faint">{sp.quoteNote}</p>
          </PageEntrance>

          {/* The floor — honest anchor, never a cage */}
          <Reveal dir="right">
            <div className="rounded-lg border border-line bg-deep p-8">
              <p className="text-mono-label text-faint">{sp.floorLabel}</p>
              <p className="foil mt-2 whitespace-nowrap font-display text-4xl leading-none">
                {band.price}
              </p>
              <p className="text-mono-label mt-3 text-faint">{sp.floorNote}</p>
            </div>
          </Reveal>
        </header>

        {/* ── What you get — concrete deliverables, no adjectives ─────────── */}
        <section className="mt-20 md:mt-24">
          <h2 className="text-mono-label text-faint">{sp.deliverablesTitle}</h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {page.deliverables.map((d, i) => (
              <li key={d.title[locale]}>
                <Reveal delay={i * 70} className="border-t border-gold/30 pt-5">
                  <h3 className="font-display text-xl text-ink">{d.title[locale]}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{d.text[locale]}</p>
                </Reveal>
              </li>
            ))}
          </ul>
          {/* Every service page claims AI visibility somewhere — every one gets
              the receipts link (claim + proof is the doctrine, not a feature). */}
          <Link
            href={localizedPath(locale, 'preuves')}
            className="text-mono-label mt-8 inline-flex items-center gap-2 text-gold underline-offset-4 hover:underline"
          >
            {sp.receiptsCta} <span aria-hidden>→</span>
          </Link>
        </section>

        {/* ── Three real proofs with captures ─────────────────────────────── */}
        <section className="mt-20 md:mt-24">
          <h2 className="text-mono-label text-faint">{page.proofsTitle[locale]}</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {proofs.map((project, i) => (
              <Reveal key={project.slug} delay={i * 80}>
                <Link
                  href={localizedPath(locale, `work/${project.slug}`)}
                  data-cursor="voir"
                  className="group block"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden rounded-lg border border-line">
                    {project.thumb ? (
                      <Image
                        src={project.thumb}
                        alt={`${project.name} — ${page.name[locale]}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(135deg, ${project.color}, var(--c-navy) 82%)` }}
                      />
                    )}
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent transition-colors duration-500 group-hover:ring-gold/60"
                    />
                  </span>
                  <span className="mt-4 block font-display text-xl text-ink transition-colors duration-300 group-hover:text-gold">
                    {project.name}
                  </span>
                  <span className="text-mono-label mt-1 inline-flex items-center gap-2 text-muted">
                    {sp.proofsCta} <span aria-hidden>→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          {(() => {
            const t = testimonialFor(page.sujet)
            if (!t) return null
            return (
              <Reveal>
                <figure className="mt-12 max-w-3xl border-l-2 border-gold/50 pl-6">
                  <blockquote className="font-display text-xl leading-relaxed text-ink">
                    {'« '}
                    {t.quote[locale]}
                    {' »'}
                  </blockquote>
                  <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-4">
                    <span className="text-mono-label text-gold">{t.org}</span>
                    <span className="text-sm text-muted">{t.who[locale]}</span>
                  </figcaption>
                </figure>
              </Reveal>
            )
          })()}
        </section>

        {/* ── The free X-ray — the lead magnet ────────────────────────────── */}
        <section className="mt-20 md:mt-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-lg border border-gold/30 p-8 md:p-12">
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(70% 120% at 15% 50%, color-mix(in srgb, var(--c-gold) 9%, transparent), transparent 70%)',
                }}
              />
              <div className="relative flex flex-wrap items-end justify-between gap-8">
                <div className="max-w-xl">
                  <p className="text-mono-label text-gold/85">{sp.radio.eyebrow}</p>
                  <h2 className="mt-3 text-3xl">{sp.radio.title}</h2>
                  <p className="mt-4 leading-relaxed text-muted">{sp.radio.text}</p>
                </div>
                <Magnetic strength={0.22}>
                  <Link
                    href={`${localizedPath(locale, 'contact')}?sujet=radiographie`}
                    className="text-mono-label inline-flex items-center gap-2 rounded-full border border-gold/40 px-7 py-3.5 text-ink transition-colors duration-300 hover:bg-gold hover:text-deep"
                  >
                    {sp.radio.cta} <span aria-hidden>→</span>
                  </Link>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Mini-FAQ (schema emitted above) ─────────────────────────────── */}
        <section className="mt-20 md:mt-24">
          <h2 className="text-mono-label text-faint">{sp.faqTitle}</h2>
          <div className="mt-6 max-w-3xl border-t border-line">
            {page.faq.map((item, i) => (
              <details key={item.q[locale]} open={i === 0} className="faq-item group border-b border-line py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
                  <h3 className="font-display text-lg text-ink transition-colors group-hover:text-gold group-open:text-gold">
                    {item.q[locale]}
                  </h3>
                  <span
                    aria-hidden
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong text-gold transition-all duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">{item.a[locale]}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Closing ask — the FAQ answers land at peak intent; never end a
            commercial page without a next action. ─────────────────────────── */}
        <div className="mt-20">
          <ConversionBand locale={locale} dict={dict} variant="registre" />
        </div>
      </div>
    </main>
  )
}
