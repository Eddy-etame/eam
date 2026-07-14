import type { ReactNode } from 'react'
import type { ThemeId } from '@/lib/themes'
import { cn } from '@/lib/utils'

/**
 * Scopes a palette to a single section by setting [data-theme] on a wrapper.
 * CSS custom properties cascade, so the whole subtree adopts that palette —
 * letting us alternate dark (heraldic) and light (editorial) sections down one
 * page to create rhythm without confusing the eye. The seam between a dark and
 * a light section is the "switch" that signals a new chapter.
 */
export function ThemedSection({
  theme,
  children,
  className,
}: {
  theme: ThemeId
  children: ReactNode
  className?: string
}) {
  return (
    <div data-theme={theme} className={cn('bg-deep text-ink', className)}>
      {children}
    </div>
  )
}
