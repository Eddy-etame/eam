import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site.config'

/** AI answer-engine crawlers, explicitly welcomed (GEO): being crawled by
 *  ChatGPT, Claude, Perplexity, Gemini et al. is how the agency gets cited. */
const AI_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
