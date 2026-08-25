/**
 * A+ ON VERCEL — run between `vercel build` and `vercel deploy --prebuilt`.
 *
 * Why: csp-harden's routes-manifest patch works under `next start` but breaks
 * @vercel/next's output conversion ("Unable to find lambda for route") and,
 * when deployed built-on-Vercel, never reaches the edge anyway (verified live
 * 2026-07-29 — production served the baseline CSP). So on Vercel builds
 * csp-harden skips the manifest and emits .next/csp-hashes.json instead; THIS
 * script injects those per-route hash-locked CSPs into the prebuilt edge
 * config (.vercel/output/config.json). Deploying with --prebuilt guarantees
 * the hashes match the exact artifacts shipped.
 *
 * Full ritual (logged-in terminal):  npm run deploy:aplus
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const CONFIG = path.join(ROOT, '.vercel', 'output', 'config.json')
const REPORT = path.join(ROOT, '.next', 'csp-hashes.json')

if (!existsSync(CONFIG)) {
  console.error('vercel-output-harden: .vercel/output/config.json not found — run `vercel build --prod` first.')
  process.exit(1)
}
if (!existsSync(REPORT)) {
  console.error('vercel-output-harden: .next/csp-hashes.json not found — did csp-harden run in the build?')
  process.exit(1)
}

const { routes: cspRoutes } = JSON.parse(readFileSync(REPORT, 'utf8'))
const config = JSON.parse(readFileSync(CONFIG, 'utf8'))
const entries = Object.entries(cspRoutes)
if (entries.length === 0) {
  console.error('vercel-output-harden: csp-hashes.json holds zero routes — refusing to deploy unhardened.')
  process.exit(1)
}

const routes = config.routes ?? []
if (routes.some((r) => r.headers?.['Content-Security-Policy']?.includes("'sha256-"))) {
  console.log('vercel-output-harden: config already hardened — nothing to do.')
  process.exit(0)
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// Vary must carry Accept (pages have a text/markdown twin via negotiation —
// acceptmarkdown.com) but Vercel's edge normalizes Vary on prerendered HTML,
// dropping the next.config value. Inject the full merged string here, keeping
// the framework's RSC values intact.
const VARY =
  'rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept'
const injected = entries.map(([route, csp]) => ({
  src: `^${escapeRegex(route)}/?$`,
  headers: { 'Content-Security-Policy': csp, Vary: VARY },
  continue: true,
  important: true,
}))

// Before the first handler phase so they run in the routing/header pass and
// `important` lets them override the config-level baseline header.
const handleIdx = routes.findIndex((r) => r.handle)
const insertAt = handleIdx === -1 ? routes.length : handleIdx
config.routes = [...routes.slice(0, insertAt), ...injected, ...routes.slice(insertAt)]

writeFileSync(CONFIG, JSON.stringify(config, null, 2))
console.log(
  `vercel-output-harden: injected ${injected.length} hash-locked CSP routes into the prebuilt edge config — deploy with \`vercel deploy --prebuilt --prod\`.`,
)
