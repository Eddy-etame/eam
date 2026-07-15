import { ImageResponse } from 'next/og'
import { isLocale, locales, defaultLocale } from '@/i18n/config'
import { siteConfig } from '@/lib/site.config'

/**
 * Dynamic OG/social card (1200×630) generated at build time per locale via the
 * file convention — it auto-applies to every page under [locale] unless a route
 * sets its own `openGraph.images`. No custom font is loaded on purpose: next/og
 * ships a robust default, which keeps image generation deterministic offline.
 *
 * ⚠️ The crest is the same PLACEHOLDER mark as the Preloader — swap the <path>
 *    data for the real EAM griffon when the vector is provided.
 */
export const alt = 'EAM — Agence Digitale Créative'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const crestSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 140'><path d='M60 8 L112 26 L112 70 C112 104 88 128 60 136 C32 128 8 104 8 70 L8 26 Z' fill='none' stroke='#C9A96E' stroke-width='3' stroke-linejoin='round'/><path d='M28 50 L60 74 L92 50' fill='none' stroke='#C9A96E' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/><path d='M60 28 L71 44 L60 60 L49 44 Z' fill='none' stroke='#C9A96E' stroke-width='3' stroke-linejoin='round'/></svg>`
const crest = `data:image/svg+xml,${encodeURIComponent(crestSvg)}`

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const lang = isLocale(locale) ? locale : defaultLocale

  const eyebrow = lang === 'fr' ? 'Agence Digitale Créative' : 'Creative Digital Agency'
  const title =
    lang === 'fr'
      ? 'Sites web sur-mesure & applications métier.'
      : 'Bespoke websites & business applications.'
  // Truthful footprint only — HQ city is unconfirmed (site.config location.confirmed).
  const foot = 'France · Maroc · International'

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
              color: '#8892A4',
              textTransform: 'uppercase',
              marginBottom: 22,
            }}
          >
            {eyebrow}
          </span>
          <span style={{ display: 'flex', fontSize: 66, lineHeight: 1.05, maxWidth: 940, fontWeight: 600 }}>
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
          <span>{foot}</span>
          <span style={{ color: '#C9A96E' }}>{new URL(siteConfig.url).host}</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
