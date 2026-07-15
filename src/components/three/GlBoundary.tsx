'use client'

import { Component, type ReactNode } from 'react'

/**
 * Last-resort guard around every decorative <Canvas>. If WebGL context
 * creation still throws after the quality gate (blocklisted GPU, remote
 * desktop, context limit exhausted), render nothing instead of letting the
 * crash bubble to the route-level error screen and take the whole page —
 * including all the DOM/SEO fallback content — down with it.
 */
export class GlBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
