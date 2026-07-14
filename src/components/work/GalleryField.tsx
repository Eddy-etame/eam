'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from '@/lib/gsap'

/**
 * GalleryField — shared-canvas WebGL layer for the work gallery.
 *
 * Contract: the gallery renders <GalleryField /> as a sibling overlay inside a
 * relatively-positioned container, and marks each thumbnail wrapper with
 * `[data-gl-thumb]` + `data-thumb-src` (texture url) + `data-color` (hex).
 * One plane per node is textured from the screenshot and synced per frame to
 * the node's bounding rect — the DOM <img> stays in the tree for SEO and is
 * only faded out once its GL twin is live (class `gl-live` + inline tween).
 *
 * The gallery may re-render on filter changes: nodes are re-discovered via a
 * MutationObserver on the positioned ancestor and via the window event
 * 'eam:gallery-changed'.
 *
 * Decorative enhancement only — reduced-motion and touch devices get nothing
 * (the component renders null and the DOM images remain untouched).
 */

const GALLERY_EVENT = 'eam:gallery-changed'
const FALLBACK_TINT = '#C9A96E'

/* NOTE: never use GLSL reserved words (half, filter, sample, …) as identifiers. */
const vertexShader = /* glsl */ `
  uniform float uVel;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 bent = position;
    // Bow the plane with scroll velocity — strongest mid-plane, pinned edges.
    bent.y += sin(uv.x * 3.14159265) * uVel * 0.12;
    bent.x += sin(uv.y * 3.14159265) * uVel * 0.02;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(bent, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform vec2 uUvScale;
  uniform float uHover;
  uniform float uVel;
  uniform float uTime;
  uniform vec3 uTint;
  uniform float uAlpha;

  float hashN(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    // cover-fit + slight zoom-in on hover
    float zoomAmt = 1.0 - 0.055 * uHover;
    vec2 uvc = (vUv - 0.5) * uUvScale * zoomAmt + 0.5;

    // RGB shift proportional to scroll velocity (vertical, matching scroll axis)
    float aber = uVel * 0.02;
    float sr = texture2D(uMap, uvc + vec2(0.0, aber)).r;
    float sg = texture2D(uMap, uvc).g;
    float sb = texture2D(uMap, uvc - vec2(0.0, aber)).b;
    vec3 col = vec3(sr, sg, sb);

    // subtle screen-space grain
    float grain = (hashN(gl_FragCoord.xy + fract(uTime) * 61.7) - 0.5) * 0.05;
    col += grain;

    // hover tint toward the project's accent colour
    col = mix(col, col * mix(vec3(1.0), uTint * 1.4, 0.55) + uTint * 0.04, uHover * 0.4);

    gl_FragColor = vec4(col, uAlpha);
  }
`

interface PlaneUniforms {
  uMap: { value: THREE.Texture | null }
  uUvScale: { value: THREE.Vector2 }
  uHover: { value: number }
  uVel: { value: number }
  uTime: { value: number }
  uTint: { value: THREE.Color }
  uAlpha: { value: number }
  [uniform: string]: { value: unknown }
}

interface PlaneEntry {
  mesh: THREE.Mesh
  uniforms: PlaneUniforms
}

type Registry = Map<HTMLElement, PlaneEntry>

function GlPlane({
  node,
  registry,
}: {
  node: HTMLElement
  registry: React.RefObject<Registry>
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo<PlaneUniforms>(
    () => ({
      uMap: { value: null },
      uUvScale: { value: new THREE.Vector2(1, 1) },
      uHover: { value: 0 },
      uVel: { value: 0 },
      uTime: { value: Math.random() * 100 }, // desync grain across planes
      uTint: { value: new THREE.Color(node.dataset.color || FALLBACK_TINT) },
      uAlpha: { value: 0 },
    }),
    [node],
  )

  // Register with the scene's single frame loop.
  useEffect(() => {
    const mesh = meshRef.current
    const reg = registry.current
    if (!mesh || !reg) return
    reg.set(node, { mesh, uniforms })
    return () => {
      reg.delete(node)
    }
  }, [node, registry, uniforms])

  // Async screenshot texture; on load, hand the visual over from DOM to GL.
  useEffect(() => {
    const src = node.dataset.thumbSrc
    if (!src) return
    let alive = true
    let tex: THREE.Texture | null = null

    new THREE.TextureLoader().load(src, (loaded) => {
      if (!alive) {
        loaded.dispose()
        return
      }
      tex = loaded
      loaded.colorSpace = THREE.SRGBColorSpace
      const u = matRef.current?.uniforms as PlaneUniforms | undefined
      if (u) {
        u.uMap.value = loaded
        gsap.to(u.uAlpha, { value: 1, duration: 0.6, ease: 'power2.out' })
      }
      // 'gl-live' lets CSS react if it wants to; the inline tween is the
      // guaranteed path (this component may not edit globals.css).
      node.classList.add('gl-live')
      const img = node.querySelector('img')
      if (img) gsap.to(img, { opacity: 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
    })

    return () => {
      alive = false
      tex?.dispose()
      node.classList.remove('gl-live')
      const img = node.querySelector('img')
      if (img) {
        gsap.killTweensOf(img)
        gsap.set(img, { clearProps: 'opacity' })
      }
    }
  }, [node])

  return (
    <mesh ref={meshRef} visible={false} frustumCulled={false}>
      {/* segmented so the velocity bend has vertices to move; R3F auto-disposes */}
      <planeGeometry args={[1, 1, 24, 24]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

function Scene({
  nodes,
  hoveredRef,
  keyFor,
}: {
  nodes: HTMLElement[]
  hoveredRef: React.RefObject<HTMLElement | null>
  keyFor: (el: HTMLElement) => number
}) {
  const registry = useRef<Registry>(new Map())
  const lastY = useRef(0)
  const rawVel = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
  }, [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)

    // Scroll velocity: px/frame delta, lerped, then normalised for the shader.
    const y = window.scrollY
    rawVel.current += (y - lastY.current - rawVel.current) * 0.12
    lastY.current = y
    const vel = THREE.MathUtils.clamp(rawVel.current * 0.0045, -0.4, 0.4)

    const canvasRect = state.gl.domElement.getBoundingClientRect()
    if (canvasRect.width === 0 || canvasRect.height === 0) return
    const centerX = canvasRect.left + canvasRect.width / 2
    const centerY = canvasRect.top + canvasRect.height / 2

    registry.current.forEach(({ mesh, uniforms: u }, node) => {
      const rect = node.getBoundingClientRect()
      // hidden by a filter (display:none) or collapsed — skip entirely
      if (rect.width < 1 || rect.height < 1) {
        mesh.visible = false
        return
      }
      mesh.visible = true

      // Ortho camera is sized to canvas pixels (zoom 1): world unit == px,
      // origin at canvas centre, +y up.
      mesh.position.set(
        rect.left + rect.width / 2 - centerX,
        centerY - (rect.top + rect.height / 2),
        0,
      )
      mesh.scale.set(rect.width, rect.height, 1)

      u.uTime.value += dt
      u.uVel.value += (vel - u.uVel.value) * 0.2
      const hoverTarget = hoveredRef.current === node ? 1 : 0
      u.uHover.value += (hoverTarget - u.uHover.value) * (hoverTarget ? 0.09 : 0.06)

      // background-size: cover in UV space
      const image = u.uMap.value?.image as { width?: number; height?: number } | undefined
      if (image?.width && image?.height) {
        const planeRatio = rect.width / rect.height
        const imageRatio = image.width / image.height
        if (planeRatio > imageRatio) u.uUvScale.value.set(1, imageRatio / planeRatio)
        else u.uUvScale.value.set(planeRatio / imageRatio, 1)
      }
    })
  })

  return (
    <>
      {nodes.map((node) => (
        <GlPlane key={keyFor(node)} node={node} registry={registry} />
      ))}
    </>
  )
}

export default function GalleryField() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const hoveredRef = useRef<HTMLElement | null>(null)
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [nodes, setNodes] = useState<HTMLElement[]>([])

  // Stable React keys for DOM nodes across re-discovery.
  const idsRef = useRef(new WeakMap<Element, number>())
  const nextIdRef = useRef(1)
  const keyFor = (el: HTMLElement) => {
    let id = idsRef.current.get(el)
    if (id === undefined) {
      id = nextIdRef.current++
      idsRef.current.set(el, id)
    }
    return id
  }

  // Enhancement gate: no reduced-motion, hover-capable pointer only.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setEnabled(!reduced && hoverFine)
  }, [])

  // Node discovery + hover delegation on the closest positioned ancestor.
  useEffect(() => {
    if (!enabled) return
    const wrap = wrapRef.current
    if (!wrap) return

    let ancestor: HTMLElement | null = wrap.parentElement
    while (
      ancestor &&
      ancestor !== document.body &&
      getComputedStyle(ancestor).position === 'static'
    ) {
      ancestor = ancestor.parentElement
    }
    const root: HTMLElement = ancestor ?? document.body

    const discover = () => {
      const found = Array.from(root.querySelectorAll<HTMLElement>('[data-gl-thumb]'))
      setNodes((prev) =>
        prev.length === found.length && prev.every((n, i) => n === found[i]) ? prev : found,
      )
    }
    discover()

    // The gallery re-renders on filter changes — requery on mutations and on
    // the contract event, coalesced to one pass per frame.
    let raf = 0
    const queueDiscover = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        discover()
      })
    }
    const observer = new MutationObserver(queueDiscover)
    observer.observe(root, { childList: true, subtree: true })
    window.addEventListener(GALLERY_EVENT, queueDiscover)

    // Delegated hover (pointerenter/leave don't bubble, so use over/out).
    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as Element | null
      hoveredRef.current = (target?.closest?.('[data-gl-thumb]') as HTMLElement | null) ?? null
    }
    const onPointerOut = (e: PointerEvent) => {
      const related = e.relatedTarget as Element | null
      if (!related || !related.closest?.('[data-gl-thumb]')) hoveredRef.current = null
    }
    root.addEventListener('pointerover', onPointerOver, { passive: true })
    root.addEventListener('pointerout', onPointerOut, { passive: true })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener(GALLERY_EVENT, queueDiscover)
      root.removeEventListener('pointerover', onPointerOver)
      root.removeEventListener('pointerout', onPointerOut)
      hoveredRef.current = null
      setNodes([])
    }
  }, [enabled])

  if (enabled === false) return null

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none absolute inset-0">
      {enabled && nodes.length > 0 && (
        <Canvas
          orthographic
          camera={{ position: [0, 0, 10], zoom: 1, near: 0.1, far: 100 }}
          dpr={[1, 1.6]}
          flat
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <Scene nodes={nodes} hoveredRef={hoveredRef} keyFor={keyFor} />
        </Canvas>
      )}
    </div>
  )
}
