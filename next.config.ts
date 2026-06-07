import type { NextConfig } from 'next'

// Pin the workspace root to this project dir — silences the multiple-lockfile
// warning caused by a stray lockfile higher up the tree.
const projectRoot = process.cwd() // pinned workspace root

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'beldifusion-toulouse.fr' },
      { protocol: 'https', hostname: 'www.chickenbens.fr' },
      { protocol: 'https', hostname: 'f2mconsulting.fr' },
      { protocol: 'https', hostname: 'marchedemov2.vercel.app' },
      { protocol: 'https', hostname: 'c-chez-toi-2.vercel.app' },
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: '**.r2.dev' },
    ],
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

