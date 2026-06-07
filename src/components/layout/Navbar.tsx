'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { localizedPath } from '@/lib/seo'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const links = [
    { href: localizedPath(locale, 'work'), label: dict.nav.work },
    { href: localizedPath(locale, 'about'), label: dict.nav.studio },
    { href: localizedPath(locale, 'contact'), label: dict.nav.contact },
  ]
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled || open
          ? 'border-b border-line bg-deep/80 backdrop-blur-md'
          : 'border-b border-transparent',
      )}
    >
      <nav
        aria-label={dict.nav.home}
        className="mx-auto flex h-16 max-w-[1640px] items-center justify-between gap-6 px-6 md:h-20 md:px-12"
      >
        <Link
          href={localizedPath(locale)}
          aria-label={`EAM — ${dict.nav.home}`}
          className="text-ink transition-colors duration-300 hover:text-gold"
        >
          <Logo className="h-9 md:h-10" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-9 md:flex">
          <ul className="flex items-center gap-9">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    'text-mono-label transition-colors duration-300',
                    isActive(l.href) ? 'text-gold' : 'text-muted hover:text-ink',
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <span aria-hidden className="h-4 w-px bg-line-strong" />
          <LanguageSwitcher locale={locale} />
          <Link
            href={localizedPath(locale, 'contact')}
            className="rounded-full border border-gold/40 px-5 py-2.5 text-mono-label text-ink transition-colors duration-300 hover:bg-gold hover:text-deep"
          >
            {dict.nav.startProject}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? dict.common.closeMenu : dict.common.openMenu}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={cn(
              'block h-px w-6 bg-ink transition-transform duration-300',
              open && 'translate-y-[3.5px] rotate-45',
            )}
          />
          <span
            className={cn(
              'block h-px w-6 bg-ink transition-transform duration-300',
              open && '-translate-y-[3.5px] -rotate-45',
            )}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'grid overflow-hidden border-line bg-deep/95 backdrop-blur-md transition-[grid-template-rows] duration-500 md:hidden',
          open ? 'grid-rows-[1fr] border-t' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0">
          <ul className="flex flex-col gap-1 px-6 py-6">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    'block py-3 font-display text-3xl',
                    isActive(l.href) ? 'text-gold' : 'text-ink',
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="mt-6 flex items-center justify-between border-t border-line pt-6">
              <LanguageSwitcher locale={locale} />
              <Link
                href={localizedPath(locale, 'contact')}
                className="rounded-full border border-gold/40 px-5 py-2.5 text-mono-label text-ink"
              >
                {dict.nav.startProject}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
