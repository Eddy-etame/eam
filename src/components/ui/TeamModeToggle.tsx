'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'

export const TEAM_MODES = ['mono', 'gold', 'iridescent', 'paper'] as const
export type TeamMode = (typeof TEAM_MODES)[number]

export const TEAM_MODE_STORAGE_KEY = 'eam-team-mode'

/** Small two-tone (or prism) preview swatch per mode. */
const SWATCH: Record<TeamMode, string> = {
  mono: 'linear-gradient(135deg, #070D18 0 50%, #F5F0E8 50% 100%)',
  gold: 'linear-gradient(135deg, #070D18 0 50%, #C9A96E 50% 100%)',
  iridescent: 'conic-gradient(from 210deg, #ff004c, #ffe600, #14ff72, #00e0ff, #b400ff, #ff004c)',
  paper: 'linear-gradient(135deg, #16110A 0 50%, #FBF8F1 50% 100%)',
}

export function isTeamMode(v: unknown): v is TeamMode {
  return typeof v === 'string' && (TEAM_MODES as readonly string[]).includes(v)
}

interface Props {
  value: TeamMode
  onChange: (mode: TeamMode) => void
  labels: { label: string; aria: string; modes: Record<TeamMode, string> }
}

export function TeamModeToggle({ value, onChange, labels }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function move(delta: number) {
    const i = TEAM_MODES.indexOf(value)
    const next = TEAM_MODES[(i + delta + TEAM_MODES.length) % TEAM_MODES.length]
    onChange(next)
    refs.current[TEAM_MODES.indexOf(next)]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={labels.aria}
      className="inline-flex items-center gap-1 rounded-full border border-line-strong bg-surface/70 p-1 backdrop-blur"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          move(1)
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          move(-1)
        }
      }}
    >
      <span className="px-2 text-2xs uppercase tracking-[0.22em] text-faint">{labels.label}</span>
      {TEAM_MODES.map((mode, i) => {
        const active = value === mode
        return (
          <button
            key={mode}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(mode)}
            title={labels.modes[mode]}
            className={cn(
              'flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5 text-xs transition-colors',
              active ? 'bg-gold/12 text-ink' : 'text-muted hover:text-ink',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'h-4 w-4 rounded-full ring-1 transition-transform',
                active ? 'scale-110 ring-gold/70' : 'ring-line-strong',
              )}
              style={{ background: SWATCH[mode] }}
            />
            <span className={cn('leading-none', !active && 'sr-only sm:not-sr-only')}>
              {labels.modes[mode]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
