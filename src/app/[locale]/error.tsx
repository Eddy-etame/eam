'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { fallbackStrings } from '@/i18n/fallback-strings'
import { isLocale, type Locale } from '@/i18n/config'

/**
 * Route error boundary — a WebGL/GSAP throw becomes an on-brand recovery
 * instead of Next's bare crash screen. Client by contract (needs reset()).
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()
  const seg = pathname.split('/')[1]
  const locale: Locale = isLocale(seg) ? seg : 'fr'
  const strings = fallbackStrings[locale]
  const t = strings.errorPage

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
      <p aria-hidden className="font-display text-6xl text-gold">
        ⚠
      </p>
      <h1 className="mt-6 text-3xl">{t.title}</h1>
      <p className="mt-5 max-w-md text-muted">{t.text}</p>
      {error.digest && (
        <p className="text-mono-label mt-3 text-faint">ref · {error.digest}</p>
      )}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-gold px-7 py-3.5 text-mono-label text-deep transition-colors hover:bg-gold-bright"
        >
          {t.retry}
        </button>
        <Link
          href={`/${locale}`}
          className="text-mono-label text-muted transition-colors hover:text-ink"
        >
          {strings.notFound.cta} →
        </Link>
      </div>
    </main>
  )
}
