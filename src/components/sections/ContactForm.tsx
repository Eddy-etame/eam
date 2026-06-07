'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { siteConfig } from '@/lib/site.config'
import type { Dictionary } from '@/i18n/dictionaries'

/**
 * Backend-free contact form: composes a pre-filled mailto on submit. When EAM
 * wires a real endpoint, only the submit handler changes.
 */
export function ContactForm({ dict }: { dict: Dictionary }) {
  const f = dict.contact.form
  const [data, setData] = useState({ name: '', email: '', company: '', message: '' })

  const set =
    (key: keyof typeof data) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [key]: e.target.value }))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = `[EAM] ${data.name || 'Projet'}`
    const who = [data.name, data.company].filter(Boolean).join(' — ')
    const body = `${who}\n${data.email}\n\n${data.message}`
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  const field =
    'mt-2 w-full rounded-md border border-line bg-surface px-4 py-3 text-ink placeholder:text-faint transition-colors focus:border-gold focus:outline-none'

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
        className="text-mono-label rounded-full bg-gold px-7 py-3.5 text-deep transition-colors hover:bg-gold-bright"
      >
        {f.submit}
      </button>
      <p className="text-xs text-faint">{f.note}</p>
    </form>
  )
}
