'use client'

import { Canvas } from '@react-three/fiber'
import { GoldField } from './GoldField'

/**
 * Isolated WebGL layer for the hero. Loaded via next/dynamic (ssr:false) so it
 * never runs on the server, never blocks first paint, and stays out of the
 * rest of the bundle. Transparent canvas so the themed page shows through.
 */
export default function HeroCanvas() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.8]}
      camera={{ position: [0, 1.5, 8.5], fov: 48 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <GoldField />
    </Canvas>
  )
}
