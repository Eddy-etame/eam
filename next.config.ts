import type { NextConfig } from 'next'

// Pin the workspace root to this project dir — silences the multiple-lockfile
// warning caused by a stray lockfile higher up the tree.
const projectRoot = process.cwd() // pinned workspace root

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
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

