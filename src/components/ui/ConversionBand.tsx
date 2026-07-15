import Link from 'next/link'
import { localizedPath } from '@/lib/seo'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * CONVERSION BAND — the single ask of a surface. One bordered moment, three
 * voices: 'case' (after a case study's proof), 'world' (after a world's
 * crossing), 'registre' (after the registre's inventory). Doctrine: exactly
 * ONE band per surface — contextual, never spammy.
 *
 * Server-safe (no hooks), so it renders identically from server pages and
 * client worlds. It sits on the page background, so theme tokens apply — the
 * chapter palette carries it between dark and cream.
 */
export function ConversionBand({
  locale,
  dict,
  variant = 'case',
}: {
  locale: Locale
  dict: Dictionary
  variant?: 'case' | 'world' | 'registre'
}) {
  const c = dict.conversion
  const v = c[variant]
  return (
    <aside
      data-conversion-band={variant}
      aria-label={v.title}
      className="relative overflow-hidden rounded-lg border border-line px-6 py-14 text-center sm:px-10 md:py-16"
    >
      {/* A quiet gold breath at the top edge — invitation, not alarm */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 90% at 50% 0%, color-mix(in srgb, var(--c-gold) 9%, transparent), transparent 72%)',
        }}
      />
      <div className="relative mx-auto max-w-2xl">
        <p className="text-mono-label text-gold/85">{v.eyebrow}</p>
        <p className="mt-5 font-display text-3xl leading-tight text-ink md:text-4xl">{v.title}</p>
        <p className="mt-4 text-lg leading-relaxed text-muted">{v.text}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <Link
            href={localizedPath(locale, 'contact')}
            className="shadow-gold rounded-full bg-gold px-8 py-4 font-medium text-deep transition-colors duration-300 hover:bg-gold-bright"
          >
            {c.button}
          </Link>
          <Link
            href={localizedPath(locale, 'about')}
            className="text-mono-label text-muted transition-colors duration-300 hover:text-ink"
          >
            {c.secondary} →
          </Link>
        </div>
      </div>
    </aside>
  )
}
