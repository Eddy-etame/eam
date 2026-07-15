/**
 * Device-quality gate for the decorative WebGL layers (GoldField, TeamMist,
 * TeamFigure3D, GalleryField, HoverField, MicrodidactCanvas).
 *
 * Client-only: always false during SSR. Answers one question — can this
 * device run the heavy GL without degrading the experience? Low-memory or
 * low-core hardware, data-saver users, reduced-motion users and browsers
 * that cannot actually create a WebGL2 context all keep the DOM fallbacks
 * that every canvas mount already ships.
 */

interface NavigatorWithQualityHints extends Navigator {
  /** Chromium-only hint, in GiB (absent on Firefox/Safari → assume capable). */
  deviceMemory?: number
  /** Network Information API (Chromium-only). */
  connection?: { saveData?: boolean }
}

let cached: boolean | null = null

/** Probe: can a WebGL2 context really be created? (Created, then released.) */
function webgl2Creatable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

export function canRunHeavyGL(): boolean {
  if (typeof window === 'undefined') return false
  if (cached !== null) return cached
  const nav = navigator as NavigatorWithQualityHints
  cached =
    (nav.deviceMemory ?? 8) > 4 &&
    (nav.hardwareConcurrency ?? 8) > 4 &&
    !nav.connection?.saveData &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    webgl2Creatable() // last — it is the only expensive check
  return cached
}
