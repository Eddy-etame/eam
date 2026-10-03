import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site.config'

/**
 * Contact submission → Inlet, the studio's own form backend (the same relay
 * the Boxing Center sites run). Validates + honeypots here, solves Inlet's
 * proof-of-work on the server, forwards as JSON. Server-to-server, so CORS
 * never applies and the browser ships no hashing code. Where the lead lands
 * (inbox, dashboard) is configured in Inlet, not in this repo.
 */
const INLET = 'https://inlett.vercel.app'
/** EAM's form on Inlet — a public submit-endpoint id, not a secret (the BC
 *  relays carry theirs the same way). INLET_FORM_ID overrides it per deploy. */
const FORM_ID = process.env.INLET_FORM_ID ?? '5659bb2f-3e79-4109-8b52-d67a8a48512b'

const MAX = { name: 120, email: 200, company: 160, message: 5000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TIMEOUT_MS = 9000

interface Challenge {
  challenge?: string
  difficulty?: number
  timestamp?: number | string
}

/** A nonce whose sha256("challenge:nonce") starts with `difficulty` hex zeros.
 *  The colon is part of Inlet's contract — without it: POW_SOLUTION_INVALID. */
function solve(challenge: string, difficulty: number): string | null {
  const prefix = '0'.repeat(Math.max(0, difficulty))
  for (let nonce = 0; nonce < 5_000_000; nonce++) {
    if (createHash('sha256').update(`${challenge}:${nonce}`).digest('hex').startsWith(prefix)) {
      return String(nonce)
    }
  }
  return null
}

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
  const lang = body.lang === 'en' ? 'en' : 'fr'

  // Bots fill the invisible field; let them believe they succeeded.
  if (honeypot) return NextResponse.json({ ok: true })

  if (!name || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 422 })
  }

  const payload: Record<string, string> = {
    name,
    email,
    entreprise: company,
    message,
    origine: new URL(siteConfig.url).hostname,
    _lang: lang,
    _gotcha: '',
  }

  // The proof-of-work is best-effort on our side: if the challenge cannot be
  // fetched we still try the submission — a lead must never be lost to an
  // anti-bot step we impose on ourselves.
  try {
    const res = await fetch(`${INLET}/api/challenge`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (res.ok) {
      const c = (await res.json()) as Challenge
      if (c.challenge) {
        const nonce = solve(c.challenge, Number(c.difficulty ?? 4))
        if (nonce !== null) {
          payload.pow_challenge = c.challenge
          payload.pow_timestamp = String(c.timestamp ?? Date.now())
          payload.pow_nonce = nonce
        }
      }
    }
  } catch {
    /* continue without the proof */
  }

  try {
    const res = await fetch(`${INLET}/api/submit/${FORM_ID}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) {
      console.error('Inlet refused the submission:', res.status, (await res.text()).slice(0, 300))
      return NextResponse.json({ ok: false, error: 'send-failed' }, { status: 502 })
    }
  } catch (error) {
    console.error('Inlet unreachable:', error)
    return NextResponse.json({ ok: false, error: 'send-failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
