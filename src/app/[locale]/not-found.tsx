'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { fallbackStrings } from '@/i18n/fallback-strings'
import { isLocale, type Locale } from '@/i18n/config'

/**
 * Branded 404. Client component: not-found receives no params, so the locale
 * is sniffed from the pathname. Uses fallback-strings, NEVER getDictionary —
 * this boundary rides in every route's shared client JS (see fallback-strings).
 */
export default function NotFound() {
  const pathname = usePathname()
  const seg = pathname.split('/')[1]
  const locale: Locale = isLocale(seg) ? seg : 'fr'
  const t = fallbackStrings[locale].notFound

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
        href={`/${locale}`}
        className="mt-10 rounded-full border border-gold/40 px-7 py-3.5 text-mono-label text-ink transition-colors hover:bg-gold hover:text-deep"
      >
        {t.cta} →
      </Link>
    </main>
  )
}
