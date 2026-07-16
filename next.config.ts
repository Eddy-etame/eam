import type { NextConfig } from 'next'

// Pin the workspace root to this project dir — silences the multiple-lockfile
// warning caused by a stray lockfile higher up the tree.
const projectRoot = process.cwd() // pinned workspace root

const isDev = process.env.NODE_ENV === 'development'

/**
 * Content-Security-Policy — the site is fully static (SSG): per-request nonces
 * are impossible and Next's build-generated inline bootstrap scripts make
 * hashes brittle, so script-src carries 'unsafe-inline' (the policy still
 * blocks every FOREIGN origin — the main XSS exfiltration vector). Everything
 * is self-hosted by design: no external scripts, styles, fonts or trackers.
 * blob: serves three.js textures/workers; data: covers inline SVG images.
 * Dev additions: 'unsafe-eval' (source maps) + ws: (HMR).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
  "media-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
]

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // All imagery is self-hosted (public/thumbs, public/team, public/logos) —
    // no remotePatterns: every entry widens the image-optimizer trust surface.
  },
  experimental: {
    optimizePackageImports: [
      'gsap',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'motion',
      'lenis',
    ],
  },
}

export default nextConfig

