import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site.config'

/**
 * Shared OG-card factory for the WORLD pages (Microdidact / Boxing Center) —
 * same heraldic frame as the root [locale]/opengraph-image.tsx so shares stay
 * on-brand, with world-specific eyebrow/title. File-based segment images
 * override the locale default card that buildMetadata attaches everywhere.
 */

const crestSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 140'><path d='M60 8 L112 26 L112 70 C112 104 88 128 60 136 C32 128 8 104 8 70 L8 26 Z' fill='none' stroke='#C9A96E' stroke-width='3' stroke-linejoin='round'/><path d='M28 50 L60 74 L92 50' fill='none' stroke='#C9A96E' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/><path d='M60 28 L71 44 L60 60 L49 44 Z' fill='none' stroke='#C9A96E' stroke-width='3' stroke-linejoin='round'/></svg>`
const crest = `data:image/svg+xml,${encodeURIComponent(crestSvg)}`

export const WORLD_OG_SIZE = { width: 1200, height: 630 }

export function worldOgImage({
  eyebrow,
  title,
  accent = '#C9A96E',
}: {
  eyebrow: string
  title: string
  accent?: string
}) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 76,
          background: 'linear-gradient(135deg, #070D18 0%, #0D1F3C 100%)',
          color: '#F5F0E8',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            border: '1px solid rgba(201,169,110,0.35)',
            borderRadius: 10,
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={crest} width={58} height={68} alt="" />
          <span style={{ fontSize: 34, letterSpacing: 12, color: '#C9A96E', fontWeight: 600 }}>
            EAM
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 26,
              letterSpacing: 8,
              color: accent,
              textTransform: 'uppercase',
              marginBottom: 22,
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{ display: 'flex', fontSize: 64, lineHeight: 1.06, maxWidth: 960, fontWeight: 600 }}
          >
            {title}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 26,
            color: '#8892A4',
          }}
        >
          <span>France · Maroc · International</span>
          <span style={{ color: '#C9A96E' }}>{new URL(siteConfig.url).host}</span>
        </div>
      </div>
    ),
    { ...WORLD_OG_SIZE },
  )
}
