import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata, absoluteUrl, localizedPath } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, organizationSchema } from '@/lib/schema'
import { getProject } from '@/lib/projects'
import { Reveal } from '@/components/ui/Reveal'
import { Magnetic } from '@/components/ui/Magnetic'
import geoQueries from '@/data/geo-queries.json'
import geoLog from '@/data/geo-log.json'
import { PageEntrance } from '@/components/ui/PageEntrance'

/**
 * /preuves — the receipts page (Vector B's blade). Renders the probe log
 * VERBATIM: hits, misses and blocked probes alike, each linking to its
 * screenshot. The credibility of this page comes precisely from the misses —
 * an agency publishing "pas encore" next to its own name cannot be accused
 * of theater. Data: src/data/geo-log.json, appended by `npm run geo:probe`
 * (run locally, monthly). ChatGPT rows are manual entries with screenshots.
 */

interface GeoResult {
  queryId: string
  engine: string
  method?: string
  status: string
  matchedTerms: string[]
  screenshot: string | null
  error?: string
}
interface GeoRun {
  runId: string
  date: string
  results: GeoResult[]
}
const RUNS = (geoLog as { runs: GeoRun[] }).runs

const ENGINE_LABELS: Record<string, string> = {
  perplexity: 'Perplexity',
  google: 'Google',
  bing: 'Bing',
  chatgpt: 'ChatGPT',
}
// Bing first: the most complete column leads, so the receipts are the first
// thing visible when the table is swiped on mobile (70% of traffic).
const ENGINE_ORDER = ['bing', 'google', 'perplexity', 'chatgpt']

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
    title: dict.preuves.meta.title,
    description: dict.preuves.meta.description,
    path: 'preuves',
  })
}

export default async function PreuvesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const p = dict.preuves

  const latest = RUNS.length > 0 ? RUNS[RUNS.length - 1] : null
  const resultFor = (queryId: string, engine: string) =>
    latest?.results.find((r) => r.queryId === queryId && r.engine === engine) ?? null

  const targetLabel = (target: string) => {
    if (target === 'eam') return p.table.targetEam
    const slug = target.replace('client:', '')
    return getProject(slug)?.name ?? slug
  }

  return (
    <main id="content" className="px-6 pb-28 pt-36 md:px-12 md:pt-44 lg:px-20">
      <JsonLd
        data={[
          organizationSchema(locale, p.meta.description),
          breadcrumbSchema([
            { name: dict.nav.home, url: absoluteUrl(localizedPath(locale)) },
            { name: p.eyebrow, url: absoluteUrl(localizedPath(locale, 'preuves')) },
          ]),
        ]}
      />
      <div className="mx-auto max-w-[1640px]">
        <header className="max-w-3xl">
          <PageEntrance>
            <p data-pe="eyebrow" className="text-mono-label text-gold/85">{p.eyebrow}</p>
            <h1 data-pe="title" className="mt-5 text-4xl">{p.title}</h1>
            <p data-pe="lead" className="mt-6 text-lg leading-relaxed text-muted">{p.lead}</p>
          </PageEntrance>
        </header>

        {/* ── The method — four honest steps ──────────────────────────────── */}
        <section className="mt-16">
          <h2 className="text-mono-label text-faint">{p.method.title}</h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {p.method.steps.map((step, i) => (
              <li key={step}>
                <Reveal delay={i * 70} className="border-t border-gold/30 pt-4">
                  <span className="foil font-display text-2xl leading-none">{i + 1}</span>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{step}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        {/* ── The measurements — verbatim, misses included ────────────────── */}
        <section className="mt-16 md:mt-20">
          {latest ? (
            <>
              <p className="text-mono-label text-faint">
                {p.lastRun} · {latest.runId}
              </p>
              <div className="mt-6 overflow-x-auto rounded-lg border border-line">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="text-mono-label px-5 py-4 font-normal text-faint">{p.table.query}</th>
                      <th className="text-mono-label px-5 py-4 font-normal text-faint">{p.table.target}</th>
                      {ENGINE_ORDER.map((e) => (
                        <th key={e} className="text-mono-label px-5 py-4 font-normal text-faint">
                          {ENGINE_LABELS[e]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {geoQueries.queries.map((query) => (
                      <tr key={query.id} className="border-b border-line/60 last:border-0">
                        <td className="px-5 py-4 text-sm leading-relaxed text-ink">
                          {'« '}
                          {query.q}
                          {' »'}
                        </td>
                        <td className="text-mono-label px-5 py-4 text-muted">{targetLabel(query.target)}</td>
                        {ENGINE_ORDER.map((engine) => {
                          const r = resultFor(query.id, engine)
                          if (!r || r.status === 'blocked' || r.error)
                            return (
                              <td key={engine} className="px-5 py-4">
                                {r?.screenshot ? (
                                  <a
                                    href={r.screenshot}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-mono-label text-faint underline-offset-4 hover:underline"
                                    title={p.table.blocked}
                                  >
                                    —
                                  </a>
                                ) : (
                                  <span className="text-mono-label text-faint">—</span>
                                )}
                              </td>
                            )
                          const cited = r.status === 'cited'
                          return (
                            <td key={engine} className="px-5 py-4">
                              {r.screenshot ? (
                                <a
                                  href={r.screenshot}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-mono-label inline-flex items-center gap-1.5 whitespace-nowrap underline-offset-4 hover:underline ${cited ? 'text-gold' : 'text-muted'}`}
                                  title={p.table.evidence}
                                >
                                  {cited ? `✓ ${p.table.cited}` : p.table.notCited}
                                </a>
                              ) : (
                                <span className={`text-mono-label whitespace-nowrap ${cited ? 'text-gold' : 'text-muted'}`}>
                                  {cited ? `✓ ${p.table.cited}` : p.table.notCited}
                                </span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-faint">{p.footnote}</p>
            </>
          ) : (
            <Reveal>
              <p className="rounded-lg border border-line p-8 text-lg leading-relaxed text-muted">
                {p.empty}
              </p>
            </Reveal>
          )}
        </section>

        {/* ── One ask ─────────────────────────────────────────────────────── */}
        <section className="mt-16">
          <Magnetic>
            <Link
              href={`${localizedPath(locale, 'contact')}?sujet=radiographie`}
              className="cta-shine shadow-gold group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold px-8 py-4 font-medium text-deep transition-colors duration-300 hover:bg-gold-bright"
            >
              {p.cta}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </Magnetic>
        </section>
      </div>
    </main>
  )
}
