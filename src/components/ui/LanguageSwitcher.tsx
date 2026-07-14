'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

/** FR / EN toggle that preserves the current path. */
export function LanguageSwitcher({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname()

  const swapTo = (target: Locale) => {
    const parts = pathname.split('/')
    if (parts.length > 1) parts[1] = target
    const next = parts.join('/')
    return next || `/${target}`
  }

  return (
    <div className={cn('text-mono-label flex items-center gap-1.5', className)}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden className="text-faint">/</span>}
          <Link
            href={swapTo(l)}
            hrefLang={l}
            aria-current={l === locale ? 'true' : undefined}
            className={cn(
              '-my-1.5 inline-flex min-h-[24px] items-center px-2 py-1.5 transition-colors',
              l === locale ? 'text-ink' : 'text-muted hover:text-ink',
            )}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  )
}
