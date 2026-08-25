import Link from 'next/link'
import { fallbackStrings } from '@/i18n/fallback-strings'

/**
 * The 404 screen — a SERVER component on purpose. The previous client
 * not-found (locale sniffing via hooks) left the 404 response without any
 * server-rendered markup: agents and no-JS crawlers got a bare shell (Is
 * Agentic audit, 2026-07-30). Server rendering guarantees the recovery links
 * live in the raw HTML. Copy renders in FR (the canonical locale); the
 * recovery links speak for themselves in both languages.
 * Shared by app/not-found.tsx (global) and app/[locale]/not-found.tsx.
 */
export function NotFoundScreen() {
  const t = fallbackStrings.fr.notFound

  return (
    <main
      id="content"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% -5%, rgb(13 31 60 / 0.75), transparent 70%)',
        }}
      />
      <p aria-hidden className="foil font-display text-[clamp(6rem,24vw,15rem)] leading-none">
        404
      </p>
      <h1 className="mt-5 text-3xl">{t.title}</h1>
      <p className="mt-5 max-w-md text-muted">{t.text}</p>
      <Link
        href="/fr"
        className="mt-10 rounded-full border border-gold/40 px-7 py-3.5 text-mono-label text-ink transition-colors hover:bg-gold hover:text-deep"
      >
        {t.cta} →
      </Link>

      {/* Recovery map — agents (and lost humans) get somewhere real to go
          instead of a dead end; machine indexes listed for crawlers. */}
      <nav aria-label={t.mapTitle} className="mt-12">
        <p className="text-mono-label text-faint">{t.mapTitle}</p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {t.links.map((link) => (
            <li key={link.path}>
              <Link
                href={`/fr${link.path}`}
                className="text-mono-label text-muted underline-offset-4 transition-colors hover:text-gold hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a href="/sitemap.xml" className="text-mono-label text-faint underline-offset-4 hover:underline">
              sitemap.xml
            </a>
          </li>
          <li>
            <a href="/llms.txt" className="text-mono-label text-faint underline-offset-4 hover:underline">
              llms.txt
            </a>
          </li>
        </ul>
      </nav>
    </main>
  )
}
