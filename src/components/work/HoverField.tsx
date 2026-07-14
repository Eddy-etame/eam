'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Shared pointer state written by the gallery (one object, no React re-renders
 * per frame). pos/size are normalised [0..1] within the grid container.
 */
export interface HoverState {
  x: number
  y: number
  hover: number
  cx: number
  cy: number
  w: number
  h: number
  color: THREE.Color
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform vec2 uPos;
  uniform vec2 uSize;
  uniform vec3 uColor;

  // cheap value noise
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = vUv - uPos;
    p.x *= aspect;
    vec2 halfSize = uSize * 0.5; // 'half' is a reserved word in GLSL ES — never use it
    halfSize.x *= aspect;

    // displaced distance field of the hovered card
    vec2 flow = vec2(noise(vUv*4.0 + uTime*0.15), noise(vUv*4.0 - uTime*0.12)) - 0.5;
    p += flow * 0.06 * uHover;
    vec2 d = abs(p) - halfSize;
    float box = length(max(d, 0.0));
    float glow = smoothstep(0.34, 0.0, box) * uHover;

    // pointer-following sheen + grain
    float toMouse = 1.0 - clamp(length((vUv - uMouse) * vec2(aspect,1.0)) * 1.4, 0.0, 1.0);
    float sheen = pow(toMouse, 2.0) * 0.5;
    float grain = noise(vUv * uRes * 0.5 + uTime) * 0.08;

    vec3 col = uColor * (0.55 + sheen + grain);
    float a = glow * (0.5 + sheen);
    gl_FragColor = vec4(col, a);
  }
`

function FieldMesh({ state }: { state: React.MutableRefObject<HoverState> }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uPos: { value: new THREE.Vector2(0.5, 0.5) },
      uSize: { value: new THREE.Vector2(0.2, 0.2) },
      uColor: { value: new THREE.Color('#C9A96E') },
    }),
    [],
  )

  useFrame((rs, delta) => {
    const u = mat.current?.uniforms
    if (!u) return
    const s = state.current
    u.uTime.value += Math.min(delta, 0.05)
    u.uRes.value.set(rs.size.width, rs.size.height)
    u.uMouse.value.x += (s.x - u.uMouse.value.x) * 0.12
    u.uMouse.value.y += (1 - s.y - u.uMouse.value.y) * 0.12
    u.uHover.value += (s.hover - u.uHover.value) * 0.1
    u.uPos.value.set(s.cx, 1 - s.cy)
    u.uSize.value.set(s.w, s.h)
    ;(u.uColor.value as THREE.Color).lerp(s.color, 0.1)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/** Single full-bleed canvas overlaying the grid. One WebGL context, decorative. */
export default function HoverField({ state }: { state: React.MutableRefObject<HoverState> }) {
  return (
    <Canvas
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.6]}
      orthographic
      camera={{ position: [0, 0, 1] }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <FieldMesh state={state} />
    </Canvas>
  )
}
