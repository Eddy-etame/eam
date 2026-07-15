import Link from 'next/link'
import { categorySlugs } from '@/lib/taxonomy'
import type { ProjectCategory } from '@/lib/taxonomy'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * Reusable category filter chips — plain links (SSR-crawlable, zero client JS).
 * Each chip routes the visitor into the world that owns the category, already
 * filtered (`?cat=<slug>`). Horizontal scroll row on mobile, wrapping on md+.
 *
 * `tone`: 'theme' rides the chapter palette tokens (registre, home band);
 * 'stage' uses FIXED hex (white / #C9A96E) — LEGIBILITY LAW for chips sitting
 * on dark stages whose imagery never follows the theme morph.
 */
export function CategoryChips({
  dict,
  categories,
  hrefFor,
  activeSlug,
  allHref,
  tone = 'theme',
}: {
  dict: Dictionary
  categories: ProjectCategory[]
  hrefFor: (category: ProjectCategory) => string
  /** Slug of the active category — highlights its chip (and “Tous” when unset). */
  activeSlug?: string | null
  /** When set, renders a leading “Tous / All” chip clearing the filter. */
  allHref?: string
  tone?: 'theme' | 'stage'
}) {
  const base =
    'text-mono-label shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 transition-colors duration-300'
  const styles =
    tone === 'stage'
      ? {
          idle: 'border-white/25 text-white/75 hover:border-[#C9A96E]/70 hover:text-white',
          active: 'border-[#C9A96E] text-[#C9A96E] ring-1 ring-[#C9A96E]',
        }
      : {
          idle: 'border-line text-muted hover:border-gold/60 hover:text-ink',
          active: 'border-gold text-gold ring-1 ring-gold',
        }

  return (
    <nav aria-label={dict.filters.eyebrow}>
      <ul className="flex snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
        {allHref && (
          <li className="shrink-0">
            <Link
              href={allHref}
              aria-current={!activeSlug ? 'true' : undefined}
              className={`${base} ${!activeSlug ? styles.active : styles.idle}`}
            >
              {dict.filters.all}
            </Link>
          </li>
        )}
        {categories.map((category) => {
          const slug = categorySlugs[category]
          const isActive = activeSlug === slug
          return (
            <li key={slug} className="shrink-0">
              <Link
                href={hrefFor(category)}
                aria-current={isActive ? 'true' : undefined}
                className={`${base} ${isActive ? styles.active : styles.idle}`}
              >
                {dict.filters.labels[category]}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
