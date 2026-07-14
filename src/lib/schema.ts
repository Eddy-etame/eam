import { siteConfig } from '@/lib/site.config'
import { absoluteUrl, localizedPath } from '@/lib/seo'
import { team } from '@/lib/team'
import type { Locale } from '@/i18n/config'
import type { Project } from '@/lib/projects'

/** Stable @id anchors so nodes can reference each other across the graph. */
const ORG_ID = `${siteConfig.url}/#organization`
const WEBSITE_ID = `${siteConfig.url}/#website`
const MICRODIDACT_ID = 'https://microdidact.com/#organization'

/** Microdidact — the Toulouse agency where the founders built 16 of the
 *  portfolio projects. Modeled as alumniOf/sourceOrganization ONLY (public
 *  record); never as a parent/subsidiary of EAM. */
const MICRODIDACT_ORG = {
  '@type': 'Organization',
  '@id': MICRODIDACT_ID,
  name: 'Microdidact',
  url: 'https://microdidact.com/',
  address: { '@type': 'PostalAddress', addressLocality: 'Toulouse', addressCountry: 'FR' },
} as const

type Json = Record<string, unknown>

const inLanguage = (locale: Locale) => (locale === 'fr' ? 'fr-FR' : 'en-US')

function sameAs(): string[] {
  return Object.values(siteConfig.social as Record<string, string>).filter((v) => v.length > 0)
}

/** Organization — founders, expertise and area served power entity recognition. */
export function organizationSchema(locale: Locale, description: string): Json {
  const links = sameAs()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: siteConfig.name,
    alternateName: siteConfig.founders.join(' '),
    url: absoluteUrl(localizedPath(locale)),
    email: siteConfig.email,
    logo: absoluteUrl('/logo-eam-square.png'),
    image: absoluteUrl('/logo-eam-navy.jpg'),
    description,
    foundingDate: String(siteConfig.founded),
    // Full founder Person nodes (embedded so they resolve on every page the Org appears).
    founder: team.map((m) => ({
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person-${m.id}`,
      name: `${m.first} ${m.surname}`.trim(),
      jobTitle: m.role[locale],
      ...(m.image ? { image: absoluteUrl(m.image) } : {}),
      alumniOf: MICRODIDACT_ORG,
    })),
    knowsAbout: [
      'Web design',
      'Web development',
      'Next.js',
      'SEO',
      'Generative Engine Optimization',
      'Branding',
      'E-commerce',
      'Progressive Web Apps',
    ],
    areaServed: siteConfig.location.areaServed.map((name) => ({ '@type': 'Place', name })),
    ...(links.length ? { sameAs: links } : {}),
  }
}

/** Service catalogue — a machine-readable list of exactly what the agency offers. */
export function serviceSchema(items: { title: string; description: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: siteConfig.name,
    itemListElement: items.map((s) => ({
      '@type': 'Service',
      name: s.title,
      description: s.description,
      serviceType: s.title,
      provider: { '@id': ORG_ID },
      areaServed: siteConfig.location.areaServed.map((name) => ({ '@type': 'Place', name })),
    })),
  }
}

export function websiteSchema(locale: Locale, description: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl(localizedPath(locale)),
    name: siteConfig.name,
    description,
    inLanguage: inLanguage(locale),
    publisher: { '@id': ORG_ID },
  }
}

/** FAQPage — the highest-leverage schema for AI Overviews + answer engines. */
export function faqSchema(items: { q: string; a: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

/** CollectionPage — binds a set of case studies to their index/world page. */
export function collectionPageSchema(
  locale: Locale,
  opts: { name: string; description: string; path: string; slugs: string[] },
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(localizedPath(locale, opts.path))}#collection`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(localizedPath(locale, opts.path)),
    inLanguage: inLanguage(locale),
    isPartOf: { '@id': WEBSITE_ID },
    hasPart: opts.slugs.map((slug) => ({
      '@id': `${absoluteUrl(localizedPath(locale, `work/${slug}`))}#work`,
    })),
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** CreativeWork per case study. Internal projects point at the portfolio page. */
export function creativeWorkSchema(project: Project, locale: Locale): Json {
  // The CreativeWork lives ON its case-study page — url/@id must be that page,
  // never liveUrl (which is '#' for in-production work). The live site, when
  // real, is exposed separately as sameAs.
  const pageUrl = absoluteUrl(localizedPath(locale, `work/${project.slug}`))
  const hasLive = !project.isInternal && project.liveUrl !== '#'
  // Inlet is a real SaaS product — dual-typed so engines see the application.
  const isApp = project.slug === 'inlet'
  return {
    '@context': 'https://schema.org',
    '@type': isApp ? ['CreativeWork', 'SoftwareApplication'] : 'CreativeWork',
    ...(isApp ? { applicationCategory: 'BusinessApplication', operatingSystem: 'Web' } : {}),
    ...(project.underMicrodidact ? { sourceOrganization: MICRODIDACT_ORG } : {}),
    '@id': `${pageUrl}#work`,
    name: project.name,
    headline: project.tagline[locale],
    description: project.description[locale],
    url: pageUrl,
    inLanguage: inLanguage(locale),
    dateCreated: String(project.year),
    keywords: project.tags.join(', '),
    about: project.category,
    creator: { '@id': ORG_ID },
    ...(project.thumb ? { image: absoluteUrl(project.thumb) } : {}),
    ...(hasLive ? { sameAs: project.liveUrl } : {}),
  }
}
