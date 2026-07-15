import { isLocale, locales, defaultLocale } from '@/i18n/config'
import { worldOgImage, WORLD_OG_SIZE } from '@/lib/world-og'

export const alt = 'EAM — Le monde Microdidact'
export const size = WORLD_OG_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const lang = isLocale(locale) ? locale : defaultLocale
  return worldOgImage({
    eyebrow: lang === 'fr' ? 'Le monde Microdidact' : 'The Microdidact world',
    title:
      lang === 'fr'
        ? 'Seize projets. Une traversée au scroll.'
        : 'Sixteen projects. One scroll-driven crossing.',
  })
}
