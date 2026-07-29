import type { MetadataRoute } from 'next'
import { locales, type Locale } from '@/i18n/config'
import { absoluteUrl, localizedPath } from '@/lib/seo'
import { publicProjects } from '@/lib/projects'

/** hreflang codes must match the <link rel="alternate"> tags from buildMetadata. */
const hreflang = (locale: Locale) => (locale === 'fr' ? 'fr-FR' : 'en-US')
/** Bump when static content meaningfully changes — truthful lastmod beats new Date(). */
const BUILD_DATE = new Date('2026-07-29')

/**
 * Bilingual sitemap. One entry per path (French URL as the canonical), each
 * with hreflang `alternates`. Internal/NDA projects are intentionally excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const, lastModified: BUILD_DATE },
    { path: 'work', priority: 0.9, changeFrequency: 'weekly' as const, lastModified: BUILD_DATE },
    // Commercial landing pages — the highest-intent surface on the site.
    { path: 'services', priority: 0.9, changeFrequency: 'monthly' as const, lastModified: BUILD_DATE },
    { path: 'services/site-vitrine', priority: 0.9, changeFrequency: 'monthly' as const, lastModified: BUILD_DATE },
    { path: 'services/e-commerce', priority: 0.9, changeFrequency: 'monthly' as const, lastModified: BUILD_DATE },
    { path: 'services/seo-geo', priority: 0.9, changeFrequency: 'monthly' as const, lastModified: BUILD_DATE },
    { path: 'services/refonte', priority: 0.9, changeFrequency: 'monthly' as const, lastModified: BUILD_DATE },
    { path: 'preuves', priority: 0.8, changeFrequency: 'monthly' as const, lastModified: BUILD_DATE },
    { path: 'work/microdidact', priority: 0.8, changeFrequency: 'monthly' as const, lastModified: BUILD_DATE },
    { path: 'work/boxing-center', priority: 0.8, changeFrequency: 'monthly' as const, lastModified: BUILD_DATE },
    { path: 'about', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: BUILD_DATE },
    { path: 'contact', priority: 0.6, changeFrequency: 'monthly' as const, lastModified: BUILD_DATE },
    { path: 'mentions-legales', priority: 0.3, changeFrequency: 'yearly' as const, lastModified: BUILD_DATE },
  ]

  // 'boxing-center' is owned by the literal world route listed above (the
  // static segment shadows work/[slug]) — emitting it here would duplicate
  // the URL with a conflicting priority/lastmod.
  const projectPaths = publicProjects
    .filter((project) => project.slug !== 'boxing-center')
    .map((project) => ({
      path: `work/${project.slug}`,
      priority: project.isFeatured ? 0.9 : 0.7,
      changeFrequency: 'monthly' as const,
      lastModified: new Date(project.year, 0, 1),
    }))

  // One <url> entry PER LOCALE per path — both /fr/* and /en/* are canonical
  // indexable URLs, and Google's sitemap-hreflang guidance expects each member
  // of a cluster to carry its own entry with the full set of annotations.
  return [...staticPaths, ...projectPaths].flatMap((entry) => {
    const languages: Record<string, string> = {
      'x-default': absoluteUrl(localizedPath('fr', entry.path)),
    }
    for (const locale of locales) {
      languages[hreflang(locale)] = absoluteUrl(localizedPath(locale, entry.path))
    }
    return locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, entry.path)),
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: { languages },
    }))
  })
}
