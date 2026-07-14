'use client'

import { useState } from 'react'
import { themes } from '@/lib/themes'
import { useTheme } from '@/components/providers/ThemeProvider'
import { cn } from '@/lib/utils'

/**
 * Floating control to switch design directions at runtime. "Heraldic Maison"
 * is the finished default; the others are alternate palettes wired through
 * [data-theme]. Personalised, not a generic widget.
 */
export function ThemeSwitcher({ label = 'Thème' }: { label?: string }) {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div data-theme="heraldic" className="fixed bottom-4 left-4 z-50 print:hidden">
      {open && (
        <div className="mb-3 w-64 overflow-hidden rounded-lg border border-line-strong bg-surface/95 p-1.5 shadow-[0_16px_50px_rgba(0,0,0,0.55)] backdrop-blur">
          <p className="px-2.5 py-2 text-mono-label text-muted">{label}</p>
          {[
            { key: 'light', title: 'Clair' },
            { key: 'dark', title: 'Sombre' },
          ].map((group) => (
            <div key={group.key} className="mb-1 last:mb-0">
              <p className="px-2.5 pb-1 pt-2 text-2xs uppercase tracking-[0.22em] text-faint">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {themes
                  .filter((t) => t.mode === group.key)
                  .map((t) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => setTheme(t.id)}
                        aria-pressed={theme === t.id}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors',
                          theme === t.id ? 'bg-gold/10' : 'hover:bg-ink/[0.06]',
                        )}
                      >
                        <span
                          aria-hidden
                          className="h-7 w-7 shrink-0 rounded-full border border-line-strong"
                          style={{
                            background: `conic-gradient(from 210deg, ${t.swatch[0]}, ${t.swatch[2]} 40%, ${t.swatch[1]} 70%, ${t.swatch[0]})`,
                          }}
                        />
                        <span className="flex-1 leading-tight">
                          <span className="block text-sm text-ink">{t.name}</span>
                          <span className="block text-xs text-muted">{t.tagline}</span>
                        </span>
                        {theme === t.id && <span className="text-gold">✦</span>}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={label}
        className="flex items-center gap-2.5 rounded-full border border-line-strong bg-surface/90 px-4 py-2.5 text-mono-label text-ink shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur transition-colors hover:border-gold"
      >
        <span className="flex gap-1" aria-hidden>
          {themes.map((t) => (
            <span
              key={t.id}
              className={cn(
                'h-2.5 w-2.5 rounded-full transition-transform duration-300',
                theme === t.id && 'scale-[1.35]',
              )}
              style={{ backgroundColor: t.swatch[1] }}
            />
          ))}
        </span>
        <span>{label}</span>
      </button>
    </div>
  )
}
