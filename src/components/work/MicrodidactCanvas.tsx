'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GlBoundary } from '@/components/three/GlBoundary'
import { FrameloopGate } from '@/components/three/FrameloopGate'

/**
 * "Atelier Sparks" — the particle weather of the Microdidact world. Same cheap
 * one-draw-call points+shader recipe as TeamMist/GoldField, retuned into a
 * slow constellation: fine steel motes orbiting a quiet vortex around the
 * wordmark, each with its own twinkle phase, plus a whisper of cursor
 * parallax. Colours read from the live palette so the field snaps in key with
 * the atelier chapter. Mounted via next/dynamic (ssr:false) from
 * MicrodidactWorld, desktop + motion only — pure enhancement.
 */

const COUNT = 950
const SPAN_X = 24
const SPAN_Y = 13
const SPAN_Z = 8

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSeed;
  varying float vSeed;
  varying float vTwinkle;
  varying float vFade;

  void main() {
    vec3 p = position;

    // slow personal drift — every mote wanders on its own beat
    float beat = uTime * (0.05 + aSeed * 0.09);
    p.x += sin(beat + aSeed * 6.2831) * 0.9;
    p.y += cos(beat * 0.8 + aSeed * 12.566) * 0.7;

    // quiet vortex around the stage centre
    float ang = uTime * 0.02 * (0.4 + aSeed);
    float cosA = cos(ang);
    float sinA = sin(ang);
    p = vec3(p.x * cosA - p.z * sinA, p.y, p.x * sinA + p.z * cosA);

    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.7) + aSeed * 40.0);
    vSeed = aSeed;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    vFade = clamp((dist - 2.0) / 18.0, 0.0, 1.0);
    gl_PointSize = uSize * (1.0 / dist) * (0.8 + aSeed * 2.6);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vSeed;
  varying float vTwinkle;
  varying float vFade;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uColorA, uColorB, vSeed);
    float a = soft * soft * (0.10 + vSeed * 0.16) * vTwinkle * (1.0 - vFade);
    gl_FragColor = vec4(col, a);
  }
`

function readPaletteColors() {
  if (typeof window === 'undefined') return { a: '#E9EEF3', b: '#D6E0E9' }
  const cs = getComputedStyle(document.documentElement)
  const ink = cs.getPropertyValue('--c-ink').trim() || '#E9EEF3'
  const bright = cs.getPropertyValue('--c-gold-bright').trim() || '#D6E0E9'
  return { a: ink, b: bright }
}

function MicrodidactSparks() {
  const points = useRef<THREE.Points>(null)
  const material = useRef<THREE.ShaderMaterial>(null)
  const mouse = useRef({ x: 0, y: 0 })

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPAN_X
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPAN_Y
      // denser toward the back so the wordmark floats in front of the field
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPAN_Z - 1.5
      seeds[i] = Math.random()
    }
    return { positions, seeds }
  }, [])

  const uniforms = useMemo(() => {
    const { a, b } = readPaletteColors()
    return {
      uTime: { value: 0 },
      uSize: { value: 105 },
      uColorA: { value: new THREE.Color(a) },
      uColorB: { value: new THREE.Color(b) },
    }
  }, [])

  // Stay in key when ChapterPalette swaps the root theme while mounted.
  useEffect(() => {
    const sync = () => {
      if (!material.current) return
      const { a, b } = readPaletteColors()
      material.current.uniforms.uColorA.value.set(a)
      material.current.uniforms.uColorB.value.set(b)
    }
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      obs.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += Math.min(delta, 0.05)
    const g = points.current
    if (g) {
      g.position.x = THREE.MathUtils.lerp(g.position.x, mouse.current.x * 1.2, 0.03)
      g.position.y = THREE.MathUtils.lerp(g.position.y, -mouse.current.y * 0.8, 0.03)
    }
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function MicrodidactCanvas() {
  return (
    <GlBoundary>
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 7], fov: 55 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <MicrodidactSparks />
        <FrameloopGate />
      </Canvas>
    </GlBoundary>
  )
}
