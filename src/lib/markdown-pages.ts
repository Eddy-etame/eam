import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, type Locale } from '@/i18n/config'
import { publicProjects, getProject } from '@/lib/projects'
import { servicePages, getServicePage } from '@/lib/services-pages'
import { testimonials } from '@/lib/testimonials'
import { siteConfig } from '@/lib/site.config'

/**
 * Markdown twins of the public pages — served on the SAME URLs via
 * `Accept: text/markdown` content negotiation (acceptmarkdown.com; wired in
 * src/proxy.ts → /api/md). Everything here is derived from the exact same
 * sources the HTML pages render (dicts, registry, service defs), so the two
 * representations can never drift. Returns null for unknown paths — the route
 * answers those with a markdown 404 that points agents at the site map.
 */

const abs = (path: string) => `${siteConfig.url}${path}`

function frontmatter(locale: Locale, path: string, title: string): string {
  return [
    `# ${title}`,
    '',
    `> ${siteConfig.name} — ${locale === 'fr' ? 'agence digitale créative' : 'creative digital agency'} · ${abs(`/${locale}${path === '/' ? '' : path}`)}`,
    '',
  ].join('\n')
}

function footerLinks(locale: Locale): string {
  const l = (p: string) => abs(`/${locale}${p}`)
  return [
    '',
    '---',
    '',
    locale === 'fr' ? '**Aller plus loin :**' : '**Go further:**',
    `- ${locale === 'fr' ? 'Réalisations' : 'Work'}: ${l('/work')}`,
    `- Services: ${l('/services')}`,
    `- ${locale === 'fr' ? 'Preuves (citations IA mesurées)' : 'Proof (measured AI citations)'}: ${l('/preuves')}`,
    `- Contact: ${l('/contact')} · ${siteConfig.email} · WhatsApp https://wa.me/${siteConfig.whatsapp}`,
    `- Machine index: ${abs('/llms.txt')} · ${abs('/sitemap.xml')}`,
  ].join('\n')
}

function homeMarkdown(locale: Locale): string {
  const dict = getDictionary(locale)
  const lines: string[] = [
    frontmatter(locale, '/', dict.hero.titleLines.join(' ')),
    dict.hero.subtitle,
    '',
    `## ${dict.services.title}`,
    '',
    ...dict.services.items.map((s) => `- **${s.title}** — ${s.description}`),
    '',
    `## ${dict.testimonials.title}`,
    '',
    ...testimonials.map(
      (t) => `> ${t.quote[locale]}\n> — **${t.org}**, ${t.who[locale]} (${abs(`/${locale}/work/${t.slug}`)})`,
    ),
    '',
    `## FAQ`,
    '',
    ...dict.faq.items.flatMap((item) => [`### ${item.q}`, '', item.a, '']),
    footerLinks(locale),
  ]
  return lines.join('\n')
}

function workMarkdown(locale: Locale): string {
  const dict = getDictionary(locale)
  const lines: string[] = [
    frontmatter(locale, '/work', dict.meta.work.title),
    dict.meta.work.description,
    '',
    `## ${locale === 'fr' ? 'Projets' : 'Projects'} (${publicProjects.length})`,
    '',
    ...publicProjects.map((p) => {
      const live = p.liveUrl !== '#' ? ` · ${locale === 'fr' ? 'site' : 'live'}: ${p.liveUrl}` : ''
      return `- **${p.name}** — ${p.tagline[locale]} (${abs(`/${locale}/work/${p.slug}`)})${live}`
    }),
    footerLinks(locale),
  ]
  return lines.join('\n')
}

function caseMarkdown(locale: Locale, slug: string): string | null {
  const p = getProject(slug)
  if (!p || p.isInternal) return null
  const dict = getDictionary(locale)
  const cs = p.caseStudy
  const lines: string[] = [
    frontmatter(locale, `/work/${slug}`, `${p.name} — ${p.tagline[locale]}`),
    p.description[locale],
    '',
    `- ${dict.common.category}: ${p.category}`,
    `- ${dict.common.year}: ${p.year}`,
    `- ${dict.common.stack}: ${p.techStack?.join(', ') ?? '—'}`,
    ...(p.liveUrl !== '#' ? [`- ${dict.common.visitSite}: ${p.liveUrl}`] : []),
  ]
  if (cs) {
    lines.push(
      '',
      `## ${locale === 'fr' ? 'Le problème' : 'The problem'}`,
      '',
      cs.problem[locale],
      '',
      `## ${locale === 'fr' ? 'La réponse' : 'The answer'}`,
      '',
      cs.solution[locale],
      '',
      `## ${locale === 'fr' ? 'Le résultat' : 'The outcome'}`,
      '',
      cs.outcome[locale],
    )
  }
  lines.push(footerLinks(locale))
  return lines.join('\n')
}

function servicesHubMarkdown(locale: Locale): string {
  const dict = getDictionary(locale)
  const lines: string[] = [
    frontmatter(locale, '/services', dict.servicesPage.hub.title),
    dict.servicesPage.hub.lead,
    '',
    ...servicePages.map((s) => {
      const band = dict.pricing.bands[s.bandIndex]
      return `- **${s.name[locale]}** — ${s.h1[locale]} (${locale === 'fr' ? 'à partir de' : 'from'} ${band.price}) → ${abs(`/${locale}/services/${s.slug}`)}`
    }),
    footerLinks(locale),
  ]
  return lines.join('\n')
}

function servicePageMarkdown(locale: Locale, slug: string): string | null {
  const page = getServicePage(slug)
  if (!page) return null
  const dict = getDictionary(locale)
  const band = dict.pricing.bands[page.bandIndex]
  const lines: string[] = [
    frontmatter(locale, `/services/${slug}`, `${page.name[locale]} — ${band.price}`),
    page.h1[locale],
    '',
    page.lead[locale],
    '',
    `## ${dict.servicesPage.deliverablesTitle}`,
    '',
    ...page.deliverables.map((d) => `- **${d.title[locale]}** — ${d.text[locale]}`),
    '',
    `## ${page.proofsTitle[locale]}`,
    '',
    ...page.proofSlugs.map((s) => `- ${getProject(s)?.name ?? s}: ${abs(`/${locale}/work/${s}`)}`),
    '',
    `## FAQ`,
    '',
    ...page.faq.flatMap((f) => [`### ${f.q[locale]}`, '', f.a[locale], '']),
    footerLinks(locale),
  ]
  return lines.join('\n')
}

function preuvesMarkdown(locale: Locale): string {
  const dict = getDictionary(locale)
  const p = dict.preuves
  const lines: string[] = [
    frontmatter(locale, '/preuves', p.title),
    p.lead,
    '',
    `## ${p.method.title}`,
    '',
    ...p.method.steps.map((s, i) => `${i + 1}. ${s}`),
    '',
    `${locale === 'fr' ? 'Relevés complets, captures comprises' : 'Full log with screenshots'}: ${abs(`/${locale}/preuves`)}`,
    footerLinks(locale),
  ]
  return lines.join('\n')
}

function aboutMarkdown(locale: Locale): string {
  const dict = getDictionary(locale)
  const lines: string[] = [
    frontmatter(locale, '/about', dict.about.title),
    dict.about.lead,
    '',
    ...dict.about.body,
    '',
    `## ${dict.about.valuesTitle}`,
    '',
    ...dict.about.values.map((v) => `- **${v.title}** — ${v.text}`),
    footerLinks(locale),
  ]
  return lines.join('\n')
}

function contactMarkdown(locale: Locale): string {
  const dict = getDictionary(locale)
  const lines: string[] = [
    frontmatter(locale, '/contact', dict.contact.title),
    dict.contact.lead,
    '',
    `- Email: ${siteConfig.email}`,
    `- WhatsApp: https://wa.me/${siteConfig.whatsapp}`,
    `- ${dict.contact.responseChip}`,
    '',
    `## ${locale === 'fr' ? 'Tarifs planchers (HT)' : 'Price floors (excl. VAT)'}`,
    '',
    ...dict.pricing.bands.map((b) => `- ${b.name}: ${b.price}`),
    footerLinks(locale),
  ]
  return lines.join('\n')
}

/** Path (locale-prefixed, e.g. /fr/services/seo-geo) → markdown, or null. */
export function renderMarkdown(fullPath: string): string | null {
  const clean = fullPath.replace(/\/+$/, '') || '/'
  const [, maybeLocale, ...rest] = clean.split('/')
  if (!isLocale(maybeLocale)) return null
  const locale = maybeLocale
  const path = rest.join('/')

  if (path === '') return homeMarkdown(locale)
  if (path === 'work') return workMarkdown(locale)
  if (path === 'services') return servicesHubMarkdown(locale)
  if (path === 'preuves') return preuvesMarkdown(locale)
  if (path === 'about') return aboutMarkdown(locale)
  if (path === 'contact') return contactMarkdown(locale)
  if (path.startsWith('services/')) return servicePageMarkdown(locale, path.slice('services/'.length))
  if (path.startsWith('work/')) return caseMarkdown(locale, path.slice('work/'.length))
  return null
}

/** Markdown 404 — the recovery map fix 1 asks for (also used by /api/md). */
export function notFoundMarkdown(locale: Locale = 'fr'): string {
  const l = (p: string) => abs(`/${locale}${p}`)
  return [
    `# 404 — ${locale === 'fr' ? 'page introuvable' : 'page not found'}`,
    '',
    locale === 'fr'
      ? 'Cette adresse n’existe pas sur le site EAM. Points de reprise :'
      : 'This path does not exist on the EAM site. Recovery points:',
    '',
    `- ${locale === 'fr' ? 'Accueil' : 'Home'}: ${abs(`/${locale}`)}`,
    `- ${locale === 'fr' ? 'Réalisations' : 'Work'}: ${l('/work')}`,
    `- Services: ${l('/services')}`,
    `- ${locale === 'fr' ? 'Preuves' : 'Proof'}: ${l('/preuves')}`,
    `- Contact: ${l('/contact')}`,
    `- Machine index: ${abs('/llms.txt')} · ${abs('/sitemap.xml')}`,
  ].join('\n')
}
