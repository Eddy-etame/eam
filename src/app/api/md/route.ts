import { NextResponse, type NextRequest } from 'next/server'
import { renderMarkdown, notFoundMarkdown } from '@/lib/markdown-pages'
import { isLocale } from '@/i18n/config'

/**
 * Markdown content negotiation (acceptmarkdown.com) — src/proxy.ts rewrites
 * any page request carrying `Accept: text/markdown` here with ?path=<original
 * locale-prefixed path>. Same URL, second representation: the markdown twin is
 * generated from the exact sources the HTML renders. `Vary: Accept` on every
 * response so CDNs never cross-serve the two variants.
 */
const MD_HEADERS = {
  'Content-Type': 'text/markdown; charset=utf-8',
  Vary: 'Accept',
  'Cache-Control': 'public, max-age=0, must-revalidate',
}

export function GET(request: NextRequest) {
  const path =
    request.headers.get('x-md-path') ?? request.nextUrl.searchParams.get('path') ?? '/'
  const md = renderMarkdown(path)
  if (md) return new NextResponse(md, { status: 200, headers: MD_HEADERS })

  const maybeLocale = path.split('/')[1]
  const locale = isLocale(maybeLocale) ? maybeLocale : 'fr'
  return new NextResponse(notFoundMarkdown(locale), { status: 404, headers: MD_HEADERS })
}
