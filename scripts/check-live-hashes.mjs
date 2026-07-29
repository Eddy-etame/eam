/**
 * Determinism probe: do the LIVE deployment's inline scripts hash to the same
 * values as the local build's csp-hashes.json? If yes, per-route CSPs
 * generated locally are safe to serve via vercel.json against a server-built
 * deploy. If no, the vercel.json path would brick script execution — abort.
 */
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://eam-agency.vercel.app'
const report = JSON.parse(readFileSync('.next/csp-hashes.json', 'utf8'))
const SAMPLE = process.argv[2] === '--all' ? Object.keys(report.routes) : [
  '/fr', '/en', '/fr/services', '/fr/preuves', '/en/about', '/fr/work', '/fr/work/kermhosting',
]

const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
function inlineHashes(html) {
  const hashes = new Set()
  for (const m of html.matchAll(SCRIPT_RE)) {
    if (/\bsrc\s*=/i.test(m[1])) continue
    const type = /\btype\s*=\s*["']([^"']+)["']/i.exec(m[1])?.[1]?.toLowerCase()
    if (type && type !== 'text/javascript' && type !== 'module') continue
    if (m[2].length === 0) continue
    hashes.add(`'sha256-${createHash('sha256').update(m[2], 'utf8').digest('base64')}'`)
  }
  return hashes
}

let mismatches = 0
for (const route of SAMPLE) {
  const csp = report.routes[route]
  if (!csp) { console.log(`SKIP ${route} (not in report)`); continue }
  const res = await fetch(`${ORIGIN}${route}`, { headers: { 'user-agent': 'Mozilla/5.0 csp-determinism-check' } })
  if (!res.ok) { console.log(`FAIL ${route} HTTP ${res.status}`); mismatches++; continue }
  const live = inlineHashes(await res.text())
  const missing = [...live].filter((h) => !csp.includes(h))
  if (missing.length) {
    mismatches++
    console.log(`MISMATCH ${route}: ${missing.length}/${live.size} live hashes absent from local allowlist`)
  } else {
    console.log(`OK ${route}: ${live.size} inline scripts all allowlisted`)
  }
}
console.log(mismatches === 0 ? '\nDETERMINISTIC — vercel.json path is safe.' : `\n${mismatches} route(s) diverge — DO NOT ship local hashes.`)
process.exit(mismatches === 0 ? 0 : 1)
