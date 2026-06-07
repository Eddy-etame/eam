import { cn } from '@/lib/utils'

/**
 * EAM crest. Rendered as a CSS mask filled with `currentColor` so it adapts to
 * the active theme (warm-white on dark themes, dark ink on the light one) and
 * can recolour on hover — set the height via className, width follows the
 * crest's aspect ratio (330 × 459).
 */
export function Logo({ className, label = 'EAM' }: { className?: string; label?: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn('inline-block bg-current align-middle', className)}
      style={{
        aspectRatio: '330 / 459',
        width: 'auto',
        WebkitMaskImage: 'url(/logo-eam.png)',
        maskImage: 'url(/logo-eam.png)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  )
}
