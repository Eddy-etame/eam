import { isLocale, locales, defaultLocale } from '@/i18n/config'
import { worldOgImage, WORLD_OG_SIZE } from '@/lib/world-og'

export const alt = 'EAM — Le monde Boxing Center'
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
    eyebrow: lang === 'fr' ? 'Le monde Boxing Center' : 'The Boxing Center world',
    title:
      lang === 'fr'
        ? 'Cinq salles, une boutique. Une seule obsession.'
        : 'Five gyms, one store. One obsession.',
    accent: '#E8001C',
  })
}
