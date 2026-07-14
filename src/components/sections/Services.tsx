import { Reveal } from '@/components/ui/Reveal'
import type { Dictionary } from '@/i18n/dictionaries'

export function Services({ dict }: { dict: Dictionary }) {
  const { services } = dict
  return (
    <section id="services" className="relative border-t border-line px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-[1640px]">
        <Reveal className="max-w-3xl">
          <p className="text-mono-label text-gold/85">{services.eyebrow}</p>
          <h2 className="mt-5 text-3xl">{services.title}</h2>
          <p className="mt-6 text-lg text-muted">{services.intro}</p>
        </Reveal>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item, i) => (
            <li key={item.title} className="bg-surface">
              <Reveal
                delay={(i % 3) * 80}
                className="svc-card group h-full p-8 transition-colors duration-500 hover:bg-surface-2 md:p-10"
              >
                <span className="text-mono-label text-faint transition-colors group-hover:text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 font-display text-2xl text-ink">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{item.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
