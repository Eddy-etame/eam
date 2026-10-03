import { Reveal } from '@/components/ui/Reveal'
import { localizedPath } from '@/lib/seo'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * The offers — what we build, and one door per offer into the conversation.
 * Eddy's ruling 2026-10-03: website prices leave the site (the quote is free
 * and fitted to each project); every band opens the contact form with its
 * subject already filled. Only the monthly SEO & GEO retainer keeps its
 * public figure. Plain anchors on purpose: on the contact page itself the
 * form intercepts [data-sujet] clicks and prefills in place; anywhere else
 * (and without JS) they are ordinary navigations to ?sujet=…#devis.
 */
export function PricingBands({
  locale,
  dict,
  offer = true,
}: {
  locale: Locale
  dict: Dictionary
  /** The standing offer line — off where the page already states it. */
  offer?: boolean
}) {
  const p = dict.pricing
  const contact = localizedPath(locale, 'contact')
  return (
    <section className="mt-24 border-t border-line pt-16 md:mt-32 md:pt-20">
      <Reveal className="max-w-2xl">
        <p className="text-mono-label text-gold/85">{p.eyebrow}</p>
        <h2 className="mt-5 text-3xl">{p.title}</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">{p.intro}</p>
        {offer && (
          <p className="mt-7 border-l-2 border-gold/50 pl-4 text-ink">
            <span className="text-mono-label block text-gold/85">{p.offer.label}</span>
            <span className="mt-1.5 block leading-relaxed">{p.offer.text}</span>
          </p>
        )}
      </Reveal>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {p.bands.map((band, i) => (
          <Reveal key={band.name} delay={i * 70} className="flex bg-deep">
            <a
              href={`${contact}?sujet=${band.sujet}#devis`}
              data-sujet={band.sujet}
              className="group flex flex-1 flex-col p-8 transition-colors duration-500 hover:bg-surface focus-visible:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold md:p-9"
            >
              <span aria-hidden className="text-mono-label tabular-nums text-faint">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-[1.6rem] leading-[1.12] text-ink transition-colors duration-500 group-hover:text-gold group-focus-visible:text-gold">
                {band.name}
              </h3>
              <ul className="mt-6 space-y-2.5">
                {band.includes.map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-gold/70" />
                    {line}
                  </li>
                ))}
              </ul>
              <span className="mt-auto block pt-8">
                {band.price && (
                  <span className="mb-5 block">
                    <span className="text-mono-label block text-faint">{p.from}</span>
                    <span className="foil mt-1.5 block whitespace-nowrap font-display text-[1.75rem] leading-none">
                      {band.price}
                    </span>
                  </span>
                )}
                <span className="text-mono-label inline-flex items-center gap-2 text-gold">
                  {p.cta}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
                  >
                    →
                  </span>
                </span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="text-mono-label mt-6 text-faint">{p.note}</p>
      </Reveal>
    </section>
  )
}
