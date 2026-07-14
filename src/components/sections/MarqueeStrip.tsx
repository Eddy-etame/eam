import { cn } from '@/lib/utils'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * Giant word-strip — the atelier's vocabulary drifting across the page in
 * alternating foil and ghost ink. Decorative (aria-hidden): the words repeat
 * the services copy, so nothing is lost to assistive tech. Pure-CSS loop,
 * pauses on hover, repeats hidden under reduced motion.
 */
export function MarqueeStrip({ dict }: { dict: Dictionary }) {
  const words = dict.marquee
  const row = [...words, ...words]
  return (
    <section aria-hidden className="eam-marquee overflow-hidden border-y border-line py-6 md:py-8">
      <ul className="eam-marquee-track" style={{ animationDuration: '55s' }}>
        {row.map((word, i) => (
          <li
            key={`${word}-${i}`}
            className={cn('flex items-center gap-8 pr-8', i >= words.length && 'eam-client-repeat')}
          >
            <span
              className={cn(
                'whitespace-nowrap font-display text-4xl md:text-5xl',
                i % 2 ? 'foil' : 'text-ink/20',
              )}
            >
              {word}
            </span>
            <span className="text-xl text-gold/50">✦</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
