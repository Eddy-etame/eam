import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { isLocale, locales, defaultLocale } from '@/i18n/config'
import { getProject, publicProjects, categoryLabels } from '@/lib/projects'
import { siteConfig } from '@/lib/site.config'

/**
 * The share card of a case study — two screens of the shipped site, the way
 * the case cover shows them (2026-11-08): the desktop capture in a browser
 * frame, the phone capture hanging on its corner, the name and the trade on
 * the heraldic ground of the root card. Every case gets its own image, which
 * the per-page metadata law demands (favicons, OG images and titles are never
 * identical from one page to the next). Captures are read from /public at
 * build time and embedded, so no network is needed to render.
 */

export const alt = 'EAM — étude de cas'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return locales.flatMap((locale) => publicProjects.map((p) => ({ locale, slug: p.slug })))
}

const crestSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 140'><path d='M60 8 L112 26 L112 70 C112 104 88 128 60 136 C32 128 8 104 8 70 L8 26 Z' fill='none' stroke='#C9A96E' stroke-width='3' stroke-linejoin='round'/><path d='M28 50 L60 74 L92 50' fill='none' stroke='#C9A96E' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/><path d='M60 28 L71 44 L60 60 L49 44 Z' fill='none' stroke='#C9A96E' stroke-width='3' stroke-linejoin='round'/></svg>`
const crest = `data:image/svg+xml,${encodeURIComponent(crestSvg)}`

async function embed(publicPath?: string): Promise<string | null> {
  if (!publicPath) return null
  try {
    const buf = await readFile(path.join(process.cwd(), 'public', publicPath))
    return `data:image/jpeg;base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

function initials(name: string): string {
  return name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function domainOf(url: string): string | null {
  if (!url || url === '#') return null
  return url
    .replace(/^[a-z][a-z0-9+.-]*:\/\//i, '')
    .replace(/^www\./i, '')
    .split(/[/?#]/)[0]
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const lang = isLocale(locale) ? locale : defaultLocale
  const project = getProject(slug)
  if (!project) return new Response('Not found', { status: 404 })

  const [desktop, phone] = await Promise.all([embed(project.thumb), embed(project.thumbM)])
  const domain = domainOf(project.liveUrl)
  const trade = categoryLabels[project.category][lang]
  const eyebrow = `${lang === 'fr' ? 'Étude de cas' : 'Case study'} · ${trade} · ${project.year}`
  const stage = `linear-gradient(135deg, ${project.color} 0%, #0D1F3C 82%)`

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          padding: 64,
          background: 'linear-gradient(135deg, #070D18 0%, #0D1F3C 100%)',
          color: '#F5F0E8',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 34,
            left: 34,
            right: 34,
            bottom: 34,
            border: '1px solid rgba(201,169,110,0.35)',
            borderRadius: 10,
            display: 'flex',
          }}
        />

        {/* ── Left column: crest, eyebrow, name, tagline, domain ── */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={crest} width={46} height={54} alt="" />
            <span style={{ fontSize: 28, letterSpacing: 10, color: '#C9A96E', fontWeight: 600 }}>EAM</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 20, letterSpacing: 5, color: '#C9A96E', textTransform: 'uppercase', marginBottom: 18 }}>
              {eyebrow}
            </span>
            <span style={{ display: 'flex', fontSize: project.name.length > 22 ? 48 : 58, lineHeight: 1.05, fontWeight: 600 }}>
              {project.name}
            </span>
            <span style={{ display: 'flex', fontSize: 24, lineHeight: 1.35, color: '#B7BFCC', marginTop: 18 }}>
              {project.tagline[lang]}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#8892A4' }}>
            <span>{domain ?? ''}</span>
            <span style={{ color: '#C9A96E' }}>{new URL(siteConfig.url).host}</span>
          </div>
        </div>

        {/* ── Right: the two screens ── */}
        <div style={{ position: 'relative', display: 'flex', flex: 1, height: '100%' }}>
          {/* Desktop frame */}
          <div
            style={{
              position: 'absolute',
              top: 32,
              left: 36,
              width: 540,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 12,
              border: '1px solid rgba(201,169,110,0.28)',
              overflow: 'hidden',
              background: '#0F1A2E',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', height: 30, padding: '0 14px', gap: 6, background: '#142238', borderBottom: '1px solid rgba(201,169,110,0.2)' }}>
              <span style={{ width: 7, height: 7, borderRadius: 7, background: '#4A5568' }} />
              <span style={{ width: 7, height: 7, borderRadius: 7, background: '#4A5568' }} />
              <span style={{ width: 7, height: 7, borderRadius: 7, background: '#4A5568' }} />
              {domain && (
                <span style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 12, letterSpacing: 1, color: '#8892A4' }}>{domain}</span>
              )}
            </div>
            <div style={{ display: 'flex', width: 540, height: 338, background: stage, position: 'relative' }}>
              {desktop ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={desktop} width={540} height={338} alt="" style={{ objectFit: 'cover', objectPosition: 'top' }} />
              ) : (
                <span style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: 120, color: 'rgba(255,255,255,0.1)', fontWeight: 700 }}>
                  {initials(project.name)}
                </span>
              )}
            </div>
          </div>
          {/* Phone frame, on the corner */}
          {phone && (
            <div
              style={{
                position: 'absolute',
                top: 206,
                left: 426,
                width: 156,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 22,
                border: '1px solid rgba(201,169,110,0.35)',
                overflow: 'hidden',
                background: '#070D18',
                boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 22, background: '#142238', borderBottom: '1px solid rgba(201,169,110,0.2)' }}>
                <span style={{ width: 34, height: 3, borderRadius: 3, background: '#4A5568' }} />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={phone} width={154} height={334} alt="" style={{ objectFit: 'cover', objectPosition: 'top' }} />
            </div>
          )}
        </div>
      </div>
    ),
    { ...size },
  )
}
