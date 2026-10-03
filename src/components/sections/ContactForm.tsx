'use client'

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { siteConfig } from '@/lib/site.config'
import { sujetLabels } from '@/lib/sujets'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * The contact form — the one conversion surface every offer leads to. POSTs
 * to /api/contact, which relays to Inlet. States: idle → sending → sent |
 * error, announced through aria-live. On failure the visitor is never left
 * with nothing: the message stays in the form and WhatsApp is one tap away.
 */
type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm({ dict }: { dict: Dictionary }) {
  const f = dict.contact.form
  const fr = dict.nav.home === 'Accueil'
  const [data, setData] = useState({ name: '', email: '', company: '', message: '', website: '' })
  const [status, setStatus] = useState<Status>('idle')

  // ?sujet= prefill — every service page, card and the Radiographie offer
  // arrive here with context; the lead should never retype it. Seeds the
  // message once, only while it is still empty (post-hydration, static-safe).
  useEffect(() => {
    const seedFor = (sujet: string | null) => {
      const label = sujet ? sujetLabels[sujet]?.[fr ? 'fr' : 'en'] : undefined
      return label ? `${fr ? 'Sujet' : 'Subject'} : ${label}\n\n` : null
    }

    const fromUrl = seedFor(new URLSearchParams(window.location.search).get('sujet'))
    if (fromUrl) setData((prev) => (prev.message ? prev : { ...prev, message: fromUrl }))

    // The offer bands on this very page: pick one and the form takes its
    // subject in place — a previous subject line is swapped, anything the
    // visitor already typed is kept — then the form comes to them.
    const onPick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[data-sujet]')
      const seed = seedFor(link?.dataset.sujet ?? null)
      if (!link || !seed) return
      e.preventDefault()
      setData((prev) => {
        const old = prev.message.match(/^(?:Sujet|Subject) : [^\n]*\n\n?/)
        if (old) return { ...prev, message: seed + prev.message.slice(old[0].length) }
        return prev.message ? prev : { ...prev, message: seed }
      })
      window.history.replaceState(null, '', link.getAttribute('href'))
      const form = document.getElementById('devis')
      // Ride the page's own smooth scroll when it runs (128px = scroll-mt-32).
      if (form && window.__eamLenis) window.__eamLenis.scrollTo(form, { offset: -128 })
      else form?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      document.getElementById('name')?.focus({ preventScroll: true })
    }
    document.addEventListener('click', onPick)
    return () => document.removeEventListener('click', onPick)
  }, [fr])

  const set =
    (key: keyof typeof data) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [key]: e.target.value }))

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    fr ? 'Bonjour EAM — je vous contacte au sujet de mon projet.' : "Hello EAM — I'm reaching out about my project.",
  )}`

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang: fr ? 'fr' : 'en' }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const field =
    'mt-2 w-full rounded-md border border-line bg-surface px-4 py-3 text-ink placeholder:text-faint transition-colors focus:border-gold focus:outline-none'

  if (status === 'sent') {
    return (
      <div role="status" aria-live="polite" className="rounded-lg border border-gold/30 bg-surface p-10">
        <p aria-hidden className="font-display text-5xl text-gold">
          ✓
        </p>
        <p className="mt-5 text-xl text-ink">{f.success}</p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-mono-label mt-6 inline-flex items-center gap-2 text-muted transition-colors hover:text-ink"
        >
          {dict.servicesPage.whatsappCta} <span aria-hidden>↗</span>
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* group: the label lights up while its field has the focus */}
      <div className="group">
        <label htmlFor="name" className="text-mono-label text-muted transition-colors duration-300 group-focus-within:text-gold">
          {f.name}
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          value={data.name}
          onChange={set('name')}
          placeholder={f.namePlaceholder}
          className={field}
        />
      </div>
      <div className="group">
        <label htmlFor="email" className="text-mono-label text-muted transition-colors duration-300 group-focus-within:text-gold">
          {f.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={data.email}
          onChange={set('email')}
          placeholder={f.emailPlaceholder}
          className={field}
        />
      </div>
      <div className="group">
        <label htmlFor="company" className="text-mono-label text-muted transition-colors duration-300 group-focus-within:text-gold">
          {f.company}
        </label>
        <input
          id="company"
          name="company"
          autoComplete="organization"
          value={data.company}
          onChange={set('company')}
          className={field}
        />
      </div>
      {/* Honeypot — invisible to humans, irresistible to bots. */}
      <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={data.website}
          onChange={set('website')}
        />
      </div>
      <div className="group">
        <label htmlFor="message" className="text-mono-label text-muted transition-colors duration-300 group-focus-within:text-gold">
          {f.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={data.message}
          onChange={set('message')}
          placeholder={f.messagePlaceholder}
          className={`${field} resize-none`}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="text-mono-label rounded-full bg-gold px-7 py-3.5 text-deep transition-colors hover:bg-gold-bright disabled:cursor-wait disabled:opacity-70"
      >
        {status === 'sending' ? f.sending : f.submit}
      </button>
      <p role="status" aria-live="polite" className="min-h-5 text-xs">
        {status === 'error' && (
          <span className="text-[#E5643E]">
            {f.error}{' '}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-gold/60 underline-offset-2"
            >
              WhatsApp ↗
            </a>
          </span>
        )}
      </p>
    </form>
  )
}
