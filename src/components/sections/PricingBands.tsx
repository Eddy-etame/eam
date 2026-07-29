import { Reveal } from '@/components/ui/Reveal'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * Pricing floors — negotiation starting points, not a rigid grid (Eddy's
 * ruling 2026-07-16: floors at half the market-anchored bands so nobody is
 * scared away; the quote conversation does the rest). Lives on the contact
 * page where intent is high — deliberately not shouted from the home page.
 * The FAQ carries the same numbers in prose (the GEO citation surface).
 */
export function PricingBands({ dict }: { dict: Dictionary }) {
  const p = dict.pricing
  return (
    <section className="mt-24 border-t border-line pt-16 md:mt-32 md:pt-20">
      <Reveal className="max-w-2xl">
        <p className="text-mono-label text-gold/85">{p.eyebrow}</p>
        <h2 className="mt-5 text-3xl">{p.title}</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">{p.intro}</p>
      </Reveal>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {p.bands.map((band, i) => (
          <Reveal key={band.name} delay={i * 70} className="group bg-deep p-8 transition-colors duration-500 hover:bg-surface md:p-9">
            <h3 className="text-mono-label font-body text-muted transition-colors duration-500 group-hover:text-ink">
              {band.name}
            </h3>
            <p className="mt-5">
              <span className="text-mono-label block text-faint">{p.from}</span>
              <span className="foil mt-1.5 block whitespace-nowrap font-display text-3xl leading-none md:text-[2.35rem]">
                {band.price}
              </span>
            </p>
            <ul className="mt-6 space-y-2.5">
              {band.includes.map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-gold/70" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="text-mono-label mt-6 text-faint">{p.note}</p>
      </Reveal>
    </section>
  )
}
