import { NextResponse, type NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/i18n/config'

/**
 * Locale routing (Next 16 `proxy` convention, replaces `middleware`). Every
 * page lives under /{locale}. Requests without a locale prefix are redirected
 * to the visitor's best match (Accept-Language) or the default. Metadata and
 * asset routes are excluded via the matcher below.
 */
function resolveLocale(request: NextRequest): string {
  const header = request.headers.get('accept-language')
  if (header) {
    const wanted = header
      .split(',')
      .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase())
    for (const code of wanted) {
      if ((locales as readonly string[]).includes(code)) return code
    }
  }
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocale) return NextResponse.next()

  const locale = resolveLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!_next/|api/|.*\\..*|opengraph-image|twitter-image|icon|apple-icon|sitemap|robots|llms|manifest).*)',
  ],
}
