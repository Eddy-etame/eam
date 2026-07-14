import { Reveal } from '@/components/ui/Reveal'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * GEO-critical section: native <details> keeps every question and answer in the
 * server-rendered DOM (answer engines read it without JS), and the page emits a
 * matching FAQPage JSON-LD node.
 *
 * Defaults to the service FAQ (dict.faq); pass `items`/`title`/`eyebrow` to
 * render another set (e.g. the brand FAQ on /about). Google allows one FAQPage
 * instance per FAQ set — keep the JSON-LD emitted by the page in sync with the
 * items rendered here.
 */
export function FAQ({
  dict,
  items,
  title,
  eyebrow,
}: {
  dict: Dictionary
  items?: { q: string; a: string }[]
  title?: string
  eyebrow?: string
}) {
  const faq = {
    eyebrow: eyebrow ?? dict.faq.eyebrow,
    title: title ?? dict.faq.title,
    items: items ?? dict.faq.items,
  }
  return (
    <section id="faq" className="border-t border-line px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto grid max-w-[1640px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="text-mono-label text-gold/85">{faq.eyebrow}</p>
          <h2 className="mt-5 text-3xl">{faq.title}</h2>
        </Reveal>

        <div className="border-t border-line">
          {faq.items.map((item, i) => (
            <details
              key={item.q}
              open={i === 0}
              className="faq-item group -mx-4 border-b border-line px-4 py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
                <h3 className="font-display text-xl text-ink transition-colors group-hover:text-gold group-open:text-gold">
                  {item.q}
                </h3>
                <span
                  aria-hidden
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong text-gold transition-all duration-300 group-open:rotate-45 group-open:border-gold/60 group-open:bg-gold/10"
                >
                  +
                </span>
              </summary>
              <p className="faq-answer mt-4 max-w-2xl leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
