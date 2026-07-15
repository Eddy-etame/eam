'use client'

import { useState } from 'react'

/** Email as a copy-to-clipboard chip — click copies, confirms, then resets. */
export function CopyEmail({ email, copiedLabel }: { email: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${email}` // clipboard blocked → mail client
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="group/copy mt-2 inline-flex flex-wrap items-baseline gap-3 font-display text-xl [overflow-wrap:anywhere] text-ink transition-colors hover:text-gold sm:text-2xl"
    >
      {email}
      <span className="text-mono-label text-faint transition-colors group-hover/copy:text-gold">
        {copied ? copiedLabel : '⧉'}
      </span>
    </button>
  )
}
