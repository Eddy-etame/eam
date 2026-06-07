import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { absoluteUrl, localizedPath } from '@/lib/seo'
import { publicProjects } from '@/lib/projects'

/**
 * Bilingual sitemap. One entry per path (French URL as the canonical), each
 * with hreflang `alternates`. Internal/NDA projects are intentionally excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: 'work', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: 'contact', priority: 0.6, changeFrequency: 'monthly' as const },
  ]

  const projectPaths = publicProjects.map((project) => ({
    path: `work/${project.slug}`,
    priority: project.isFeatured ? 0.9 : 0.7,
    changeFrequency: 'monthly' as const,
  }))

  return [...staticPaths, ...projectPaths].map((entry) => {
    const languages: Record<string, string> = {}
    for (const locale of locales) {
      languages[locale] = absoluteUrl(localizedPath(locale, entry.path))
    }
    return {
      url: absoluteUrl(localizedPath('fr', entry.path)),
      lastModified: new Date(),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: { languages },
    }
  })
}
