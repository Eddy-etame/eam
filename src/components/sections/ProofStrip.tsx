import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { localizedPath } from '@/lib/seo'
import { siteConfig } from '@/lib/site.config'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * The receipts row — every figure is verifiable, every chip links to its
 * evidence (Vector B doctrine: one signature line of poetry, everything else
 * proof). 'scan' opens the live securityheaders report for THIS origin;
 * internal links land on the pages that carry the numbers.
 */
export function ProofStrip({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const scanUrl = `https://securityheaders.com/?q=${encodeURIComponent(siteConfig.url)}&followRedirects=on`
  const hrefFor = (link: string) =>
    link === 'scan' ? scanUrl : link === 'work' ? localizedPath(locale, 'work') : localizedPath(locale, 'contact')

  return (
    <section aria-label={dict.proofs.aria} className="border-y border-line">
      <Reveal>
        <ul className="mx-auto flex max-w-[1640px] flex-wrap items-stretch justify-center gap-x-0 gap-y-0 px-6 md:px-12 lg:justify-between lg:px-20">
          {dict.proofs.items.map((item) => {
            const external = item.link === 'scan'
            const inner = (
              <>
                <span className="foil whitespace-nowrap font-display text-2xl leading-none transition-transform duration-500 group-hover:-translate-y-0.5 lg:text-[1.75rem]">
                  {item.value}
                </span>
                <span className="text-mono-label text-faint transition-colors duration-500 group-hover:text-muted">
                  {item.label}
                  {external && (
                    <span aria-hidden className="ml-1.5">
                      ↗
                    </span>
                  )}
                </span>
              </>
            )
            const cls =
              'group flex items-baseline gap-2.5 px-4 py-5 transition-colors duration-500 md:px-5 md:py-6'
            return (
              <li key={item.label} className="flex">
                {external ? (
                  <a href={hrefFor(item.link)} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={hrefFor(item.link)} className={cls}>
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </Reveal>
    </section>
  )
}
