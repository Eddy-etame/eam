'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { siteConfig } from '@/lib/site.config'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * Real contact form. POSTs to /api/contact (Resend-backed once RESEND_API_KEY
 * is set); while the endpoint is unconfigured (501) it falls back to a
 * prefilled mailto — visibly, with status feedback, never a silent failure.
 * States: idle → sending → sent | fallback | error. aria-live announces them.
 */
type Status = 'idle' | 'sending' | 'sent' | 'fallback' | 'error'

export function ContactForm({ dict }: { dict: Dictionary }) {
  const f = dict.contact.form
  const [data, setData] = useState({ name: '', email: '', company: '', message: '', website: '' })
  const [status, setStatus] = useState<Status>('idle')

  const set =
    (key: keyof typeof data) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [key]: e.target.value }))

  const mailtoHref = () => {
    const subject = `[EAM] ${data.name || 'Projet'}`
    const who = [data.name, data.company].filter(Boolean).join(' — ')
    const body = `${who}\n${data.email}\n\n${data.message}`
    return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('sent')
      } else if (res.status === 501) {
        // Endpoint not configured yet → open the visitor's mail client, visibly.
        setStatus('fallback')
        window.location.href = mailtoHref()
      } else {
        setStatus('error')
      }
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
          href={`mailto:${siteConfig.email}`}
          className="text-mono-label mt-6 inline-block text-muted transition-colors hover:text-ink"
        >
          {siteConfig.email}
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="text-mono-label text-muted">
          {f.name}
        </label>
        <input
          id="name"
          name="name"
          required
          value={data.name}
          onChange={set('name')}
          placeholder={f.namePlaceholder}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="email" className="text-mono-label text-muted">
          {f.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={data.email}
          onChange={set('email')}
          placeholder={f.emailPlaceholder}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="company" className="text-mono-label text-muted">
          {f.company}
        </label>
        <input
          id="company"
          name="company"
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
      <div>
        <label htmlFor="message" className="text-mono-label text-muted">
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
            <a href={mailtoHref()} className="underline decoration-gold/60 underline-offset-2">
              {siteConfig.email}
            </a>
          </span>
        )}
        {status === 'fallback' && <span className="text-faint">{f.note}</span>}
      </p>
    </form>
  )
}
