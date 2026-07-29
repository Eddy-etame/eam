/**
 * THE RECEIPTS ENGINE — probes answer engines for the tracked queries and
 * logs whether EAM (or a client) is cited, WITH screenshot evidence.
 *
 * Run LOCALLY (residential IP survives bot-walls far better than CI):
 *   npm run geo:probe
 *
 * Engines: Perplexity, Google, Bing, ChatGPT (logged-out chatgpt.com/?q=
 * answers since 2024). Manual entries remain allowed in geo-log.json
 * (method "manual", screenshot required). Partial runs:
 *   npm run geo:probe -- --engines=google --queries=boxe-toulouse
 * NEVER accept a "cited" without eyeballing its screenshot — walls, entity
 * collisions (another "EAM") and query echoes all fake matches.
 *
 * DOCTRINE: the log records misses as faithfully as hits — /preuves publishes
 * both. Never edit a result to look better; the page's credibility IS the
 * product. Screenshots land in public/preuves/<runId>/ so every claim on the
 * page links to its pixel evidence.
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
// Partial runs: --engines=google,chatgpt --queries=boxe-toulouse,… (comma lists).
const argOf = (name) =>
  (process.argv.find((a) => a.startsWith(`--${name}=`)) ?? '').split('=')[1]?.split(',').filter(Boolean) ?? null
const ONLY_ENGINES = argOf('engines')
const ONLY_QUERIES = argOf('queries')
const QUERIES = JSON.parse(readFileSync(path.join(ROOT, 'src/data/geo-queries.json'), 'utf8')).queries.filter(
  (q) => !ONLY_QUERIES || ONLY_QUERIES.includes(q.id),
)
const LOG_PATH = path.join(ROOT, 'src/data/geo-log.json')
const log = JSON.parse(readFileSync(LOG_PATH, 'utf8'))

// GUARD: a query containing its own brand term is a tautology, not a citation
// test ("search JCBO, find JCBO"). Caught the hard way on run 2026-07-28.
for (const query of QUERIES) {
  const leak = query.brandTerms.find((t) => query.q.toLowerCase().includes(t.toLowerCase()))
  if (leak) {
    console.error(`geo-probe: query "${query.id}" contains its own brand term "${leak}" — rewrite it non-branded. Aborting.`)
    process.exit(1)
  }
}

// Bot-walls that pass the text-length check but are NOT results pages. Any of
// these in the page text ⇒ blocked, whatever else matched (run 2026-07-28:
// Google served reCAPTCHA, Perplexity a login wall — both >400 chars).
const WALL_MARKERS = [
  'je ne suis pas un robot',
  'trafic exceptionnel',
  'unusual traffic from',
  'g-recaptcha',
  'connectez-vous pour',
  'sign in to continue',
]

const now = new Date()
const runId = now.toISOString().slice(0, 10)
const shotsDir = path.join(ROOT, 'public', 'preuves', runId)
mkdirSync(shotsDir, { recursive: true })

const ENGINES = [
  {
    id: 'perplexity',
    url: (q) => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}`,
    settle: 15000,
  },
  {
    id: 'google',
    url: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}&hl=fr`,
    settle: 6000,
    // Google trips reCAPTCHA on rapid successive queries — pace it.
    cooldown: () => 20000 + Math.floor(Math.random() * 15000),
  },
  {
    id: 'bing',
    url: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}&setlang=fr`,
    settle: 8000,
  },
  {
    id: 'chatgpt',
    // chatgpt.com answers logged-out since 2024; ?q= auto-submits. Login-wall
    // markers excluded here — the logged-out footer always says "Log in".
    url: (q) => `https://chatgpt.com/?q=${encodeURIComponent(q)}`,
    settle: 30000,
    walls: ['je ne suis pas un robot', 'verify you are human', 'trafic exceptionnel', 'unusual traffic'],
  },
].filter((e) => !ONLY_ENGINES || ONLY_ENGINES.includes(e.id))

async function dismissConsent(page) {
  // Google/Bing consent walls — click the reject/accept button if present.
  for (const text of ['Tout refuser', 'Reject all', 'Tout accepter', 'Accept all', 'Refuser tout', 'Rester déconnecté', 'Stay logged out']) {
    try {
      const btn = page.getByRole('button', { name: text }).first()
      if (await btn.isVisible({ timeout: 1200 })) {
        await btn.click()
        await page.waitForTimeout(1500)
        return
      }
    } catch {
      /* not present — fine */
    }
  }
}

const browser = await chromium.launch({ channel: 'msedge', headless: false }) // headed = fewer bot-walls
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR' })

const results = []
for (const query of QUERIES) {
  for (const engine of ENGINES) {
    const page = await context.newPage()
    const entry = {
      queryId: query.id,
      engine: engine.id,
      method: 'auto',
      status: 'blocked',
      matchedTerms: [],
      screenshot: null,
    }
    try {
      await page.goto(engine.url(query.q), { waitUntil: 'domcontentloaded', timeout: 45000 })
      await dismissConsent(page)
      await page.waitForTimeout(engine.settle)
      // Some walls pop AFTER the answer streams (ChatGPT's login nag) — clear
      // them again so the published screenshot shows the answer, not a modal.
      await dismissConsent(page)
      const text = await page.evaluate(() => document.body.innerText || '')
      const html = await page.content()
      const lower = (text + ' ' + html).toLowerCase()
      if (text.length < 400 || (engine.walls ?? WALL_MARKERS).some((m) => lower.includes(m))) {
        entry.status = 'blocked' // bot-wall / captcha / login wall / empty shell
      } else {
        // Word-boundary match — 'EAM' must NOT match inside 'team'/'streaming'.
        const matched = query.brandTerms.filter((t) =>
          new RegExp(`(^|[^\\p{L}\\p{N}])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}\\p{N}]|$)`, 'iu').test(text),
        )
        entry.matchedTerms = matched
        entry.status = matched.length > 0 ? 'cited' : 'not_cited'
      }
      const shot = `${engine.id}-${query.id}.png`
      await page.screenshot({ path: path.join(shotsDir, shot), timeout: 15000 })
      entry.screenshot = `/preuves/${runId}/${shot}`
    } catch (e) {
      entry.error = String(e).slice(0, 120)
    } finally {
      await page.close().catch(() => {})
    }
    results.push(entry)
    console.log(`${entry.status.padEnd(10)} ${engine.id.padEnd(11)} ${query.id} ${entry.matchedTerms.join(',')}`)
    if (engine.cooldown) await new Promise((r) => setTimeout(r, engine.cooldown()))
  }
}

await browser.close()
// Same-day runs MERGE (partial re-probes replace their queryId+engine cells);
// pushing a second run with the same runId would make /preuves drop the rest.
const existing = log.runs.find((r) => r.runId === runId)
if (existing) {
  for (const res of results) {
    const i = existing.results.findIndex((r) => r.queryId === res.queryId && r.engine === res.engine)
    if (i >= 0) existing.results[i] = res
    else existing.results.push(res)
  }
  existing.date = now.toISOString()
} else {
  log.runs.push({ runId, date: now.toISOString(), results })
}
writeFileSync(LOG_PATH, JSON.stringify(log, null, 1))
console.log(`\ngeo-probe: run ${runId} logged — ${results.length} probes. Rebuild the site to publish /preuves.`)
