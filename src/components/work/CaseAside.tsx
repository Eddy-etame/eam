'use client'

import { useEffect, useState } from 'react'
import { Magnetic } from '@/components/ui/Magnetic'

/**
 * Floating «Voir le site ↗» pill for case-study pages — Eddy's rule that the
 * go-to-the-site action stays ALWAYS visible somewhere. Fixed bottom-right,
 * revealed once the reader scrolls past the cover ([data-case-cover] sentinel
 * rendered by the page). Reduced motion renders it visible from the start;
 * no pill at all when the project has no live URL (liveUrl === '#').
 */
export function CaseAside({ liveUrl, label }: { liveUrl: string; label: string }) {
  const hasLink = liveUrl !== '#'
  const [shown, setShown] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (!hasLink) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      setShown(true)
      return
    }

    const cover = document.querySelector('[data-case-cover]')
    if (!cover) {
      // Fallback sentinel: reveal after one viewport of scroll.
      const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Visible only once the cover has scrolled up and out of the viewport.
          setShown(!entry.isIntersecting && entry.boundingClientRect.bottom < 0)
        }
      },
      { threshold: 0 },
    )
    io.observe(cover)
    return () => io.disconnect()
  }, [hasLink])

  if (!hasLink) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-40 md:bottom-10 md:right-10"
      style={
        reduced
          ? undefined
          : {
              opacity: shown ? 1 : 0,
              transform: shown ? 'translateY(0)' : 'translateY(1.25rem)',
              pointerEvents: shown ? 'auto' : 'none',
              transition:
                'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }
      }
      aria-hidden={!shown && !reduced}
    >
      <Magnetic>
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={shown || reduced ? 0 : -1}
          className="text-mono-label shadow-gold inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-deep transition-colors hover:bg-gold-bright"
        >
          {label}
          <span aria-hidden>↗</span>
        </a>
      </Magnetic>
    </div>
  )
}
