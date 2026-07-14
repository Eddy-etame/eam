import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site.config'
import { locales, defaultLocale, ogLocales, type Locale } from '@/i18n/config'

const BASE_URL = siteConfig.url

/** hreflang codes per locale. */
const hreflang: Record<Locale, string> = { fr: 'fr-FR', en: 'en-US' }

/** Build a locale-prefixed path, e.g. localizedPath('fr', 'work') → '/fr/work'. */
export function localizedPath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+/, '')
  return clean ? `/${locale}/${clean}` : `/${locale}`
}

/** Absolute URL on the production domain. */
export function absoluteUrl(path = ''): string {
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

interface BuildMetadataArgs {
  locale: Locale
  title: string
  description: string
  /** Path without locale prefix, e.g. 'work' or 'work/beldi-fusion'. */
  path?: string
  /** Custom OG/Twitter images. Omit to let Next inject the file-based OG image. */
  images?: string[]
}

/**
 * Per-page metadata with canonical + full hreflang alternates. The title
 * template ('%s · EAM') is set once in the root [locale] layout; pages pass a
 * plain title string and inherit it.
 */
export function buildMetadata({
  locale,
  title,
  description,
  path = '',
  images,
}: BuildMetadataArgs): Metadata {
  const url = absoluteUrl(localizedPath(locale, path))

  const languages: Record<string, string> = {}
  for (const l of locales) languages[hreflang[l]] = absoluteUrl(localizedPath(l, path))
  languages['x-default'] = absoluteUrl(localizedPath(defaultLocale, path))

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: 'website',
      locale: ogLocales[locale],
      url,
      siteName: siteConfig.name,
      title,
      description,
      // When no explicit image is passed, omit it so Next's file-based
      // opengraph-image.tsx (per-locale, generated) is injected automatically.
      ...(images
        ? {
            images: images.map((img) => ({
              url: img,
              width: 1200,
              height: 630,
              alt: siteConfig.name,
            })),
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // Twitter falls back to og:image (the generated card) when unset.
      ...(images ? { images } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}
