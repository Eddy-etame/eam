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

/** acceptmarkdown.com: agents asking for text/markdown get the page's
 *  markdown twin on the SAME URL (rewritten to /api/md, which sets
 *  Vary: Accept). Browsers never send this Accept value. */
function wantsMarkdown(request: NextRequest): boolean {
  return (request.headers.get('accept') ?? '').includes('text/markdown')
}

function markdownRewrite(request: NextRequest, localePath: string) {
  const url = request.nextUrl.clone()
  url.pathname = '/api/md'
  url.searchParams.set('path', localePath)
  // Belt + braces: query params have proven lossy through rewrites in this
  // runtime, so the path ALSO travels as a request header.
  const headers = new Headers(request.headers)
  headers.set('x-md-path', localePath)
  return NextResponse.rewrite(url, { request: { headers } })
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocale) {
    if (wantsMarkdown(request)) return markdownRewrite(request, pathname)
    return NextResponse.next()
  }

  const locale = resolveLocale(request)
  const localePath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  if (wantsMarkdown(request)) return markdownRewrite(request, localePath)
  const url = request.nextUrl.clone()
  url.pathname = localePath
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!_next/|api/|.*\\..*|opengraph-image|twitter-image|icon|apple-icon|sitemap|robots|llms|manifest).*)',
  ],
}
