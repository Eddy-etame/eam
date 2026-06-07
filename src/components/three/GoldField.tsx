'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * "Living Gold Field" — an undulating field of gold motes on the GPU.
 * A flowing landscape of light that parallaxes to the cursor, fading into the
 * dark for depth. Pure shader work; cheap (one draw call). Mounted only when
 * motion is allowed (the parent gates it), so no reduced-motion concern here.
 */

const GRID = 140 // 140 x 140 ≈ 19.6k points, one buffer, one draw call
const EXTENT = 34 // world size of the field

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSeed;
  varying float vMix;
  varying float vFade;

  void main() {
    vec3 p = position;
    float t = uTime * 0.35;

    // Layered sine swells — organic without an expensive noise function
    float e =
        sin(p.x * 0.30 + t) * cos(p.z * 0.26 + t * 0.9) * 1.5
      + sin((p.x + p.z) * 0.16 - t * 0.7) * 0.9
      + sin(p.z * 0.55 + t * 1.2 + aSeed * 6.2831) * 0.30;

    p.y += e;
    vMix = clamp(e * 0.32 + 0.5, 0.0, 1.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    vFade = clamp((dist - 3.0) / 18.0, 0.0, 1.0);

    gl_PointSize = uSize * (1.0 / dist) * (0.55 + aSeed * 0.9);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vMix;
  varying float vFade;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uColorA, uColorB, vMix);
    float a = soft * (0.18 + vMix * 0.6) * (1.0 - vFade * 0.92);
    gl_FragColor = vec4(col, a);
  }
`

export function GoldField() {
  const points = useRef<THREE.Points>(null)
  const material = useRef<THREE.ShaderMaterial>(null)
  const mouse = useRef({ x: 0, y: 0 })

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(GRID * GRID * 3)
    const seeds = new Float32Array(GRID * GRID)
    let i = 0
    for (let x = 0; x < GRID; x++) {
      for (let z = 0; z < GRID; z++) {
        positions[i * 3] = (x / (GRID - 1) - 0.5) * EXTENT
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = (z / (GRID - 1) - 0.5) * EXTENT
        seeds[i] = Math.random()
        i++
      }
    }
    return { positions, seeds }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 52 },
      uColorA: { value: new THREE.Color('#8C6F3E') },
      uColorB: { value: new THREE.Color('#F3DCA6') },
    }),
    [],
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += Math.min(delta, 0.05)
    const group = points.current
    if (group) {
      group.position.x = THREE.MathUtils.lerp(group.position.x, mouse.current.x * 1.4, 0.04)
      group.position.y = THREE.MathUtils.lerp(group.position.y, -mouse.current.y * 0.9 - 2.4, 0.04)
      group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, mouse.current.x * 0.05, 0.04)
    }
  })

  return (
    <points ref={points} rotation={[-1.2, 0, 0]} position={[0, -2.4, 0]} frustumCulled={false}>
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
