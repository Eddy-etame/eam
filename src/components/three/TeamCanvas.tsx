'use client'

import { Canvas } from '@react-three/fiber'
import { TeamMist } from './TeamMist'

/**
 * WebGL atmosphere for the team stage — loaded via next/dynamic (ssr:false)
 * from TeamSection, mounted only on desktop with motion allowed. Transparent
 * so the themed page and the DOM figures show through; the mist sits behind.
 */
export default function TeamCanvas() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 7], fov: 55 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <TeamMist />
    </Canvas>
  )
}
