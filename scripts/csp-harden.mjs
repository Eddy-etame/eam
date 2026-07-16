/**
 * CSP HARDENER — runs after `next build` and removes 'unsafe-inline' from
 * script-src by hashing every executable inline <script> the build actually
 * emitted, per page, and patching .next/routes-manifest.json with per-route
 * Content-Security-Policy headers (exact SHA-256 allowlists).
 *
 * Why this shape: the site is fully static (SSG) — per-request nonces are
 * impossible, and hashes can't be known before the build exists, so the
 * config-time headers() carries a baseline CSP and THIS script tightens it
 * against the real artifacts being deployed. Vercel and `next start` both
 * read routes-manifest.json from the build output, so the patch ships as-is.
 *
 * Non-executable <script> types (application/ld+json, application/json) are
 * CSP data blocks — never executed, never hashed. The catch-all /:path*
 * entry keeps the config baseline ('unsafe-inline') because it serves the
 * DYNAMIC routes (404 catch-all, /api) whose per-request inline scripts can
 * never be pre-hashed; every prerendered page overrides it with hashes.
 *
 * A verify pass re-scans every page and fails the build loudly if any inline
 * script is missing from its route's allowlist — broken hydration must never
 * reach production silently.
 */
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const APP_DIR = path.join(ROOT, '.next', 'server', 'app')
const MANIFEST = path.join(ROOT, '.next', 'routes-manifest.json')

if (!existsSync(APP_DIR) || !existsSync(MANIFEST)) {
  console.error('csp-harden: no build output found — run `next build` first.')
  process.exit(1)
}

/** Recursively list .html files under dir. */
function htmlFiles(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name)
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p))
    else if (name.endsWith('.html')) out.push(p)
  }
  return out
}

/** Executable inline scripts of an HTML string → sha256-base64 hashes. */
const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
function inlineHashes(html) {
  const hashes = new Set()
  for (const match of html.matchAll(SCRIPT_RE)) {
    const attrs = match[1]
    const body = match[2]
    if (/\bsrc\s*=/i.test(attrs)) continue // external — covered by 'self'
    const type = /\btype\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1]?.toLowerCase()
    // Data blocks (ld+json etc.) are not executable — CSP ignores them.
    if (type && type !== 'text/javascript' && type !== 'module') continue
    if (body.length === 0) continue
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`)
  }
  return hashes
}

/** File path → public route ( .next/server/app/fr/work/x.html → /fr/work/x ). */
function routeOf(file) {
  const rel = path.relative(APP_DIR, file).replace(/\\/g, '/').replace(/\.html$/, '')
  return '/' + rel
}

// ── Scan ────────────────────────────────────────────────────────────────────
const perRoute = new Map() // route → Set(hashes)
const allHashes = new Set()
for (const file of htmlFiles(APP_DIR)) {
  const route = routeOf(file)
  const hashes = inlineHashes(readFileSync(file, 'utf8'))
  for (const h of hashes) allHashes.add(h)
  perRoute.set(route, hashes)
}

// Routable pages get their own entry; internal ones (_not-found …) ride the
// catch-all union.
const routable = [...perRoute.keys()].filter((r) => !r.split('/').some((s) => s.startsWith('_')))

// ── Patch the manifest ──────────────────────────────────────────────────────
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
const headers = manifest.headers ?? []

const catchAll = headers.find((h) => h.source === '/:path*')
if (!catchAll) {
  console.error('csp-harden: baseline /:path* header entry not found.')
  process.exit(1)
}
const cspOf = (entry) => entry.headers.find((h) => h.key === 'Content-Security-Policy')
const baseCsp = cspOf(catchAll)?.value
if (!baseCsp) {
  console.error('csp-harden: baseline CSP not found on /:path*.')
  process.exit(1)
}

const withScriptSrc = (csp, hashes) =>
  csp.replace(/script-src [^;]+/, `script-src 'self' ${[...hashes].sort().join(' ')}`)

// The catch-all KEEPS the baseline 'unsafe-inline' script-src: it serves the
// DYNAMIC routes (the [...rest] 404 on arbitrary URLs, /api) whose inline
// scripts are rendered per-request and can never be pre-hashed. Hashes and
// 'unsafe-inline' cannot be mixed — CSP2 browsers ignore 'unsafe-inline' the
// moment a hash is present, which is exactly what broke the 404 page when the
// first version of this script put the union here. Every real content page
// gets its own hash-locked entry below (that is what security scanners and
// visitors' entry documents see).

// Per-route entries (override the catch-all CSP by coming later in the list).
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const patched = headers.filter((h) => h.source === '/:path*' || !perRoute.has(h.source))
for (const route of routable.sort()) {
  patched.push({
    source: route,
    regex: `^${escapeRegex(route)}(?:/)?$`,
    headers: [
      { key: 'Content-Security-Policy', value: withScriptSrc(baseCsp, perRoute.get(route)) },
    ],
  })
}
manifest.headers = patched
writeFileSync(MANIFEST, JSON.stringify(manifest))

// ── Verify — every emitted inline script must be allowlisted for its route ──
let failures = 0
for (const file of htmlFiles(APP_DIR)) {
  const route = routeOf(file)
  const entry = patched.find((h) => h.source === route) ?? catchAll
  const allowed = cspOf(entry).value
  // Internal pages riding the catch-all are covered by its 'unsafe-inline'.
  if (/script-src [^;]*'unsafe-inline'/.test(allowed)) continue
  for (const h of inlineHashes(readFileSync(file, 'utf8'))) {
    if (!allowed.includes(h)) {
      console.error(`csp-harden VERIFY FAIL: ${route} inline script ${h} not allowlisted`)
      failures++
    }
  }
}
if (failures > 0) process.exit(1)

console.log(
  `csp-harden: ${routable.length} routes hash-locked (${allHashes.size} unique inline-script hashes, no 'unsafe-inline' in their script-src); dynamic routes keep the baseline via /:path*. Verify pass clean.`,
)
