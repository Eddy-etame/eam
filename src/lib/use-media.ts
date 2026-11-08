'use client'

import { useSyncExternalStore } from 'react'

const subscribeNever = () => () => {}

/**
 * Read media-query flags on the client — `fallback` on the server and during
 * hydration — without a "setState in a mount effect" (the React lint rule
 * `react-hooks/set-state-in-effect`). `compute` receives a `mq(query)` helper
 * and returns a primitive (string, boolean, number): primitives are stable
 * snapshots, which is what useSyncExternalStore needs.
 *
 * Deliberately not live: nothing subscribes to the media queries, so a resize
 * is seen at the next render only — exactly what the mount effects it
 * replaces did (they never saw a resize at all), so no component changes
 * behaviour. A component that needs live tracking should subscribe itself.
 */
export function useMediaFlags<T extends string | boolean | number>(
  compute: (mq: (query: string) => boolean) => T,
  fallback: T,
): T {
  return useSyncExternalStore(
    subscribeNever,
    () => compute((query) => window.matchMedia(query).matches),
    () => fallback,
  )
}
