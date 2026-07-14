import type { MetadataRoute } from 'next'

/**
 * PWA web app manifest. A studio that sells Progressive Web Apps ships one for
 * itself: installability + branded mobile chrome. proxy.ts already excludes
 * 'manifest' from locale routing, so /manifest.webmanifest resolves cleanly.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EAM — Agence digitale créative',
    short_name: 'EAM',
    description:
      'Atelier digital — sites sur-mesure, applications métier, SEO & GEO. Etame · Angoula · Mbosseu.',
    start_url: '/fr',
    lang: 'fr',
    display: 'standalone',
    background_color: '#070D18',
    theme_color: '#070D18',
    categories: ['business', 'design', 'productivity'],
    icons: [
      { src: '/logo-eam-square.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo-eam-square.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
  }
}
