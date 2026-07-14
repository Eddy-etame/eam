'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * "Craftsmen's Mist" — a slow field of soft luminous motes that rises like fog
 * behind the team stage, giving the figures real atmospheric depth. Same cheap
 * one-draw-call points+shader recipe as GoldField, retuned: larger, softer,
 * lower-opacity particles, denser toward the ground, drifting upward with a
 * gentle sway and a whisper of cursor parallax. Colours read from the live
 * theme so the mist stays in key with whatever palette is active.
 */

const COUNT = 700
const SPAN_X = 22
const SPAN_Y = 12
const SPAN_Z = 7

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSeed;
  varying float vSeed;
  varying float vFade;

  void main() {
    vec3 p = position;
    float rise = uTime * (0.10 + aSeed * 0.16);
    // rise and wrap within the field so mist never runs out
    p.y = mod(position.y + rise + ${(SPAN_Y / 2).toFixed(1)}, ${SPAN_Y.toFixed(1)}) - ${(SPAN_Y / 2).toFixed(1)};
    p.x += sin(uTime * 0.14 + aSeed * 6.2831) * 0.6;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    vFade = clamp((dist - 2.0) / 16.0, 0.0, 1.0);
    vSeed = aSeed;

    gl_PointSize = uSize * (1.0 / dist) * (1.4 + aSeed * 3.2);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vSeed;
  varying float vFade;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uColorA, uColorB, vSeed);
    float a = soft * soft * (0.05 + vSeed * 0.07) * (1.0 - vFade);
    gl_FragColor = vec4(col, a);
  }
`

function readThemeColors() {
  if (typeof window === 'undefined') return { a: '#F5F0E8', b: '#C9A96E' }
  const cs = getComputedStyle(document.documentElement)
  const ink = cs.getPropertyValue('--c-ink').trim() || '#F5F0E8'
  const gold = cs.getPropertyValue('--c-gold').trim() || '#C9A96E'
  return { a: ink, b: gold }
}

export function TeamMist() {
  const points = useRef<THREE.Points>(null)
  const material = useRef<THREE.ShaderMaterial>(null)
  const mouse = useRef({ x: 0, y: 0 })

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPAN_X
      // bias toward the lower half → ground fog
      positions[i * 3 + 1] = (Math.random() ** 1.5 - 0.5) * SPAN_Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPAN_Z - 1
      seeds[i] = Math.random()
    }
    return { positions, seeds }
  }, [])

  const uniforms = useMemo(() => {
    const { a, b } = readThemeColors()
    return {
      uTime: { value: 0 },
      uSize: { value: 90 },
      uColorA: { value: new THREE.Color(a) },
      uColorB: { value: new THREE.Color(b) },
    }
  }, [])

  // Keep the mist in key if the theme changes while mounted.
  useEffect(() => {
    const sync = () => {
      if (!material.current) return
      const { a, b } = readThemeColors()
      material.current.uniforms.uColorA.value.set(a)
      material.current.uniforms.uColorB.value.set(b)
    }
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
      g.position.x = THREE.MathUtils.lerp(g.position.x, mouse.current.x * 1.1, 0.03)
      g.position.y = THREE.MathUtils.lerp(g.position.y, -mouse.current.y * 0.7, 0.03)
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
