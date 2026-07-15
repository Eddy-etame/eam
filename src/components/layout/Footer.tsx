import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { localizedPath } from '@/lib/seo'
import { siteConfig } from '@/lib/site.config'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear()
  const links = [
    { href: localizedPath(locale), label: dict.nav.home },
    { href: localizedPath(locale, 'work'), label: dict.nav.work },
    { href: localizedPath(locale, 'about'), label: dict.nav.studio },
    { href: localizedPath(locale, 'contact'), label: dict.nav.contact },
  ]

  return (
    <footer data-theme="heraldic" className="relative border-t border-line bg-deep">
      <div className="mx-auto max-w-[1640px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Link href={localizedPath(locale)} aria-label={`EAM — ${dict.nav.home}`} className="text-ink">
              <Logo className="h-16" />
            </Link>
            <p className="mt-6 max-w-xs font-display text-2xl leading-tight text-ink">
              {dict.footer.tagline}
            </p>
          </div>

          <nav aria-label={dict.footer.navTitle}>
            <h2 className="text-mono-label mb-5 text-faint">{dict.footer.navTitle}</h2>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  {/* py + negative my: ~40px touch target, unchanged visual rhythm */}
                  <Link
                    href={l.href}
                    className="-my-2 inline-block py-2 text-muted transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-mono-label mb-5 text-faint">{dict.footer.contactTitle}</h2>
            <a
              href={`mailto:${siteConfig.email}`}
              className="-my-2 inline-block py-2 text-muted transition-colors hover:text-gold"
            >
              {siteConfig.email}
            </a>
            <p className="mt-4 text-sm text-faint">{siteConfig.location.areaServed.join(' · ')}</p>
          </div>
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col gap-3 text-sm text-faint md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. {dict.footer.rights} ·{' '}
            <Link
              href={localizedPath(locale, 'mentions-legales')}
              className="-my-3 inline-block py-3 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {dict.footer.legal}
            </Link>
          </p>
          <p>{dict.footer.madeBy}</p>
        </div>
      </div>
    </footer>
  )
}
