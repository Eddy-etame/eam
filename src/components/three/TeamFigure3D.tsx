'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Depth-map 3D founder — Lusion's real trick. The portrait is a plane whose
 * UVs are displaced by a pseudo-depth map (public/team/<id>_depth.webp), so the
 * face genuinely TURNS toward the cursor instead of merely tilting. The shader
 * also owns the mono duotone (luma → shadow/ink ramp) and a living grain, so
 * it replaces the DOM filter stack pixel-for-pixel when WebGL is on.
 * Mounted only under the TeamSection's desktop+motion gate.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform sampler2D uMap;
  uniform sampler2D uDepth;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform vec3 uShadow;
  uniform vec3 uInk;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // No crop: the textures carry their own transparent margin, so parallax
    // never reveals an edge and never cuts a head.
    float d = texture2D(uDepth, vUv).r;
    vec2 p = vUv + uMouse * d * vec2(0.032, 0.02);
    p = clamp(p, 0.001, 0.999);
    vec4 tex = texture2D(uMap, p);
    if (tex.a < 0.05) discard;

    // Mono duotone — same ramp as the DOM SVG filter (shadow → warm ink).
    float luma = dot(tex.rgb, vec3(0.2126, 0.7152, 0.0722));
    vec3 col = mix(uShadow, uInk, luma);

    // Living grain, screen-space so it shimmers like film.
    col += (hash(gl_FragCoord.xy + fract(uTime) * 97.0) - 0.5) * 0.09;

    gl_FragColor = vec4(col, tex.a);
  }
`

type Aim = { x: number; y: number }

function FigurePlane({ image, depth, aim }: { image: string; depth: string; aim: React.RefObject<Aim> }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const [map, dep] = useLoader(THREE.TextureLoader, [image, depth])
  map.colorSpace = THREE.SRGBColorSpace
  const { viewport } = useThree()

  const uniforms = useMemo(() => {
    const cs = getComputedStyle(document.documentElement)
    const ink = cs.getPropertyValue('--c-ink').trim() || '#F5F0E8'
    return {
      uMap: { value: map },
      uDepth: { value: dep },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uShadow: { value: new THREE.Color('#3E4A63') }, // matches the mono duotone shadow
      uInk: { value: new THREE.Color(ink) },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, dep])

  // Contain-fit the plane in the canvas, bottom-aligned like the DOM figure.
  const aspect = (map.image?.width ?? 1) / (map.image?.height ?? 1)
  const h = Math.min(viewport.height, viewport.width / aspect)
  const w = h * aspect

  useFrame((_, delta) => {
    const m = material.current
    if (!m) return
    m.uniforms.uTime.value += Math.min(delta, 0.05)
    const cur = m.uniforms.uMouse.value as THREE.Vector2
    cur.x = THREE.MathUtils.lerp(cur.x, aim.current?.x ?? 0, 0.06)
    cur.y = THREE.MathUtils.lerp(cur.y, aim.current?.y ?? 0, 0.06)
  })

  return (
    <mesh position={[0, -(viewport.height - h) / 2, 0]}>
      <planeGeometry args={[w, h]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

export default function TeamFigure3D({ image, depth }: { image: string; depth: string }) {
  const host = useRef<HTMLDivElement>(null)
  const aim = useRef<Aim>({ x: 0, y: 0 })

  // Aim follows the cursor anywhere near the figure, easing off with distance.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = host.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (!r.width) return
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      const dist = Math.hypot(nx, ny)
      const falloff = THREE.MathUtils.clamp(1.5 - dist * 0.55, 0, 1)
      // Tight clamp — beyond ±0.85 the displacement starts to read as smear.
      aim.current.x = THREE.MathUtils.clamp(nx, -0.85, 0.85) * falloff
      aim.current.y = THREE.MathUtils.clamp(-ny, -0.85, 0.85) * falloff
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div ref={host} aria-hidden className="absolute inset-0">
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 5], fov: 40 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <FigurePlane image={image} depth={depth} aim={aim} />
        </Suspense>
      </Canvas>
    </div>
  )
}
