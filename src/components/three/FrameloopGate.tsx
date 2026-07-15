'use client'

import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

/**
 * Offscreen pause for decorative canvases. Drop it inside any <Canvas>: it
 * flips the R3F frameloop between 'always' and 'never' from an
 * IntersectionObserver on the canvas element (plus document visibility), so
 * scenes the visitor scrolled past — or backgrounded tabs — stop burning GPU.
 * Purely additive: nothing changes while the canvas is on screen. All our
 * scenes accumulate uTime from useFrame deltas, so pausing never jumps them.
 */
export function FrameloopGate() {
  const gl = useThree((s) => s.gl)
  const setFrameloop = useThree((s) => s.setFrameloop)

  useEffect(() => {
    const el = gl.domElement
    let onScreen = true
    let current: 'always' | 'never' | null = null
    const apply = () => {
      const next = onScreen && !document.hidden ? 'always' : 'never'
      if (next === current) return
      current = next
      setFrameloop(next)
    }
    // Resume a little before the canvas re-enters so no blank frame is seen.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry?.isIntersecting ?? true
        apply()
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    document.addEventListener('visibilitychange', apply)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', apply)
      setFrameloop('always')
    }
  }, [gl, setFrameloop])

  return null
}
