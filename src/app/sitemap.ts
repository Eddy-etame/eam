import type { MetadataRoute } from 'next'
import { locales, type Locale } from '@/i18n/config'
import { absoluteUrl, localizedPath } from '@/lib/seo'
import { publicProjects } from '@/lib/projects'

/** hreflang codes must match the <link rel="alternate"> tags from buildMetadata. */
const hreflang = (locale: Locale) => (locale === 'fr' ? 'fr-FR' : 'en-US')
/** Bump when static content meaningfully changes — truthful lastmod beats new Date(). */
const BUILD_DATE = new Date('2026-07-14')

/**
 * Bilingual sitemap. One entry per path (French URL as the canonical), each
 * with hreflang `alternates`. Internal/NDA projects are intentionally excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const, lastModified: BUILD_DATE },
    { path: 'work', priority: 0.9, changeFrequency: 'weekly' as const, lastModified: BUILD_DATE },
    { path: 'about', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: BUILD_DATE },
    { path: 'contact', priority: 0.6, changeFrequency: 'monthly' as const, lastModified: BUILD_DATE },
  ]

  const projectPaths = publicProjects.map((project) => ({
    path: `work/${project.slug}`,
    priority: project.isFeatured ? 0.9 : 0.7,
    changeFrequency: 'monthly' as const,
    lastModified: new Date(project.year, 0, 1),
  }))

  return [...staticPaths, ...projectPaths].map((entry) => {
    const languages: Record<string, string> = {
      'x-default': absoluteUrl(localizedPath('fr', entry.path)),
    }
    for (const locale of locales) {
      languages[hreflang(locale)] = absoluteUrl(localizedPath(locale, entry.path))
    }
    return {
      url: absoluteUrl(localizedPath('fr', entry.path)),
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: { languages },
    }
  })
}
