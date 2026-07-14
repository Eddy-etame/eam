import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site.config'

/**
 * Real contact submission. Validates + honeypots, then sends via Resend's REST
 * API (no SDK dependency) when RESEND_API_KEY is set. Without the key it
 * returns 501 and the client falls back to a prefilled mailto — visibly, never
 * silently. ⚠️ TODO(client): set RESEND_API_KEY (+ optional CONTACT_FROM with a
 * verified domain) in the deployment env to activate direct sending.
 */
const MAX = { name: 120, email: 200, company: 160, message: 5000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, error: 'bad-json' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim().slice(0, MAX.name)
  const email = String(body.email ?? '').trim().slice(0, MAX.email)
  const company = String(body.company ?? '').trim().slice(0, MAX.company)
  const message = String(body.message ?? '').trim().slice(0, MAX.message)
  const honeypot = String(body.website ?? '')

  // Bots fill the invisible field; let them believe they succeeded.
  if (honeypot) return NextResponse.json({ ok: true })

  if (!name || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 422 })
  }

  const key = process.env.RESEND_API_KEY
  if (!key) return NextResponse.json({ ok: false, error: 'not-configured' }, { status: 501 })

  const who = company ? `${name} — ${company}` : name
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? 'EAM <onboarding@resend.dev>',
      to: [siteConfig.email],
      reply_to: email,
      subject: `[EAM] ${who}`,
      text: `${who}\n${email}\n\n${message}`,
    }),
  })

  if (!res.ok) return NextResponse.json({ ok: false, error: 'send-failed' }, { status: 502 })
  return NextResponse.json({ ok: true })
}
