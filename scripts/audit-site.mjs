/**
 * Site audit — measure, don't eyeball. Crawls every URL of the sitemap and
 * reports what a visitor, Google or an answer engine would trip on:
 *
 *   HTTP      status of every page, internal link and external link
 *   META      title / description length and uniqueness, canonical, h1 count,
 *             og:image, heading-level skips
 *   BROWSER   (desktop + phone, a representative set of routes) console
 *             errors, horizontal overflow, images without alt, tap targets
 *             under 40px on the phone, text contrast below AA on a solid
 *             ground, blocks still invisible after the whole page was scrolled
 *
 *   npm run build && npx next start -p 3030
 *   node scripts/audit-site.mjs http://localhost:3030 > .verify/audit.txt
 *
 * Findings are printed grouped by kind; exit code is always 0 — this is a
 * reading instrument, the judgement stays with whoever reads it.
 */
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const ORIGIN = (process.argv[2] ?? 'http://localhost:3030').replace(/\/$/, '')
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'
const OUT = path.join(process.cwd(), '.verify')
mkdirSync(OUT, { recursive: true })

const findings = {}
const add = (kind, where, detail) => ((findings[kind] ??= []).push(`${where}  —  ${detail}`))
const text = (html, re) => (html.match(re)?.[1] ?? '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').trim()
const get = async (url, opts = {}) => {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(20000), ...opts })
    return { status: res.status, body: opts.method === 'HEAD' ? '' : await res.text(), url: res.url }
  } catch (e) {
    return { status: 0, body: '', error: String(e).slice(0, 80) }
  }
}

// ── 1. every page of the sitemap ────────────────────────────────────────────
const sitemap = await get(`${ORIGIN}/sitemap.xml`)
// The sitemap carries the canonical origin; audit the same paths on ORIGIN.
const paths = [...new Set([...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))]
console.log(`sitemap: ${paths.length} paths`)

const pages = []
const internal = new Map() // path → first page that links it
const external = new Map()
for (const p of paths) {
  const r = await get(ORIGIN + p)
  if (r.status !== 200) {
    add('HTTP page', p, `status ${r.status}`)
    continue
  }
  const html = r.body
  const title = text(html, /<title[^>]*>([^<]*)<\/title>/i)
  const desc = text(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i)
  const canonical = text(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)
  const h1 = (html.match(/<h1[\s>]/gi) ?? []).length
  const og = /<meta[^>]+property="og:image"/i.test(html)
  pages.push({ p, title, desc })
  if (!title) add('META title', p, 'missing')
  else if (title.length > 62) add('META title', p, `${title.length} chars: ${title}`)
  if (!desc) add('META description', p, 'missing')
  else if (desc.length > 160) add('META description', p, `${desc.length} chars`)
  else if (desc.length < 70) add('META description', p, `only ${desc.length} chars: ${desc}`)
  if (!canonical) add('META canonical', p, 'missing')
  else if (new URL(canonical).pathname.replace(/\/$/, '') !== p.replace(/\/$/, '')) add('META canonical', p, `points to ${canonical}`)
  if (h1 !== 1) add('META h1', p, `${h1} h1`)
  if (!og) add('META og:image', p, 'missing')
  // heading-level skips (h2 → h4 …), in document order
  const levels = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]))
  for (let i = 1; i < levels.length; i++)
    if (levels[i] - levels[i - 1] > 1) {
      add('META heading skip', p, `h${levels[i - 1]} → h${levels[i]}`)
      break
    }
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"#][^"]*)"/gi)) {
    const href = m[1].replace(/&amp;/g, '&')
    if (href.startsWith('/')) {
      const clean = href.split('#')[0]
      if (!internal.has(clean)) internal.set(clean, p)
    } else if (/^https?:/.test(href) && !external.has(href)) external.set(href, p)
  }
}

for (const key of ['title', 'desc']) {
  const seen = new Map()
  for (const pg of pages) {
    if (!pg[key]) continue
    // /fr and /en twins legitimately differ; a duplicate is same text on two paths.
    if (seen.has(pg[key])) add(`META duplicate ${key}`, pg.p, `same as ${seen.get(pg[key])}`)
    else seen.set(pg[key], pg.p)
  }
}

// ── 2. links ────────────────────────────────────────────────────────────────
console.log(`internal links: ${internal.size} · external links: ${external.size}`)
for (const [href, from] of internal) {
  if (href.startsWith('/_next') || href.startsWith('/api')) continue
  const r = await get(ORIGIN + href, { method: 'HEAD' })
  if (r.status !== 200) add('HTTP internal link', href, `status ${r.status} (linked from ${from})`)
}
for (const [href, from] of external) {
  if (/wa\.me|securityheaders|google\.com\/maps/.test(href)) continue
  let r = await get(href, { method: 'HEAD' })
  if (r.status === 0 || r.status >= 400) r = await get(href) // some hosts refuse HEAD
  if (r.status !== 200) add('HTTP external link', href, `status ${r.status}${r.error ? ' ' + r.error : ''} (linked from ${from})`)
}

// ── 3. the browser pass ─────────────────────────────────────────────────────
const ROUTES = [
  '/fr', '/en', '/fr/work', '/fr/work/microdidact', '/fr/work/boxing-center', '/fr/work/kermhosting',
  '/fr/work/boutique-de-boxe', '/fr/work/the-911', '/fr/services', '/fr/services/site-vitrine',
  '/fr/services/seo-geo', '/fr/preuves', '/fr/about', '/fr/contact', '/fr/mentions-legales',
  '/fr/confidentialite', '/fr/une-page-qui-n-existe-pas',
]
const browser = await chromium.launch({ channel: 'msedge', headless: true })
for (const mode of ['desktop', 'phone']) {
  const ctx = await browser.newContext(
    mode === 'desktop'
      ? { viewport: { width: 1440, height: 900 }, locale: 'fr-FR' }
      : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'fr-FR' },
  )
  await ctx.addInitScript(() => sessionStorage.setItem('eam:intro-shown', '1'))
  for (const route of ROUTES) {
    const page = await ctx.newPage()
    const errors = []
    page.on('console', (m) => m.type() === 'error' && !/404 \(Not Found\)/.test(m.text()) && errors.push(m.text().slice(0, 160)))
    page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 160)))
    try {
      await page.goto(ORIGIN + route, { waitUntil: 'networkidle', timeout: 60000 })
    } catch (e) {
      add('BROWSER load', `[${mode}] ${route}`, String(e).slice(0, 100))
      await page.close()
      continue
    }
    await page.waitForTimeout(900)
    // Walk the whole page so every reveal has had its chance.
    const total = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < total; y += 700) {
      if (mode === 'desktop') {
        await page.mouse.wheel(0, 700)
        await page.waitForTimeout(140)
      } else {
        await page.evaluate((to) => window.scrollTo(0, to), y)
        await page.waitForTimeout(220)
      }
    }
    await page.waitForTimeout(1200)
    const report = await page.evaluate((isPhone) => {
      const out = { overflow: 0, noAlt: [], small: [], contrast: [], hidden: [] }
      out.overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth
      const visible = (el) => {
        const r = el.getBoundingClientRect()
        const cs = getComputedStyle(el)
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'
      }
      for (const img of document.images)
        if (!img.hasAttribute('alt')) out.noAlt.push((img.currentSrc || img.src).slice(-60))
      if (isPhone)
        for (const el of document.querySelectorAll('a, button, summary, input, textarea')) {
          if (!visible(el) || el.closest('[aria-hidden="true"]') || el.tabIndex < 0) continue
          if (el.classList.contains('sr-only')) continue // the skip link, shown on focus only
          const r = el.getBoundingClientRect()
          // The hit area may be widened by a ::before (globals.css, pointer: coarse).
          const before = getComputedStyle(el, '::before')
          const grown = before.content !== 'none' && before.position === 'absolute' ? -2 * parseFloat(before.top || '0') : 0
          // Inline links inside running text are exempt (WCAG 2.5.8).
          if (el.tagName === 'A' && getComputedStyle(el).display === 'inline' && !grown) continue
          if (r.height + grown < 40 && r.width < 200) out.small.push(`${el.tagName.toLowerCase()} "${(el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`)
        }
      // Contrast, only where the ground is a solid colour we can read.
      const lum = (c) => {
        const [r, g, b] = c.map((v) => {
          v /= 255
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }
      const rgba = (s) => {
        const m = s.match(/rgba?\(([^)]+)\)/)
        if (!m) return null
        const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number)
        return { c: p.slice(0, 3), a: p[3] ?? 1 }
      }
      const ground = (el) => {
        for (let n = el; n; n = n.parentElement) {
          const cs = getComputedStyle(n)
          if (cs.backgroundImage !== 'none') return null // gradient / image: not judged here
          const bg = rgba(cs.backgroundColor)
          if (bg && bg.a > 0.98) return bg.c
          if (bg && bg.a > 0.02) return null
        }
        return null
      }
      const seen = new Set()
      const walker = document.createTreeWalker(document.querySelector('main') ?? document.body, NodeFilter.SHOW_TEXT)
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const t = node.textContent.trim()
        const el = node.parentElement
        if (t.length < 3 || !el || !visible(el) || el.closest('[aria-hidden="true"]')) continue
        const cs = getComputedStyle(el)
        if (cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)' || cs.color === 'rgba(0, 0, 0, 0)' || Number(cs.opacity) < 0.99) continue
        const fg = rgba(cs.color)
        const bg = ground(el)
        if (!fg || !bg || fg.a < 0.99) continue
        const [l1, l2] = [lum(fg.c), lum(bg)].sort((a, b) => b - a)
        const ratio = (l1 + 0.05) / (l2 + 0.05)
        const size = parseFloat(cs.fontSize)
        const need = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700) ? 3 : 4.5
        const key = `${cs.color}|${bg}|${need}`
        if (ratio < need && !seen.has(key)) {
          seen.add(key)
          out.contrast.push(`${ratio.toFixed(2)}:1 (needs ${need}) "${t.slice(0, 40)}" ${cs.color} on rgb(${bg})`)
        }
      }
      for (const el of document.querySelectorAll('[data-reveal], [data-bc-reveal], [data-bc-band-copy]'))
        if (Number(getComputedStyle(el).opacity) < 0.05 && el.getBoundingClientRect().height > 0)
          out.hidden.push((el.innerText || '').trim().slice(0, 50) || el.className.slice(0, 50))
      return out
    }, mode === 'phone')
    const where = `[${mode}] ${route}`
    if (report.overflow > 0) add('BROWSER horizontal overflow', where, `${report.overflow}px`)
    for (const e of errors.slice(0, 3)) add('BROWSER console error', where, e)
    for (const a of report.noAlt.slice(0, 3)) add('BROWSER image without alt', where, a)
    for (const s of report.small.slice(0, 6)) add('BROWSER small tap target', where, s)
    for (const c of report.contrast.slice(0, 5)) add('BROWSER contrast', where, c)
    for (const h of report.hidden.slice(0, 4)) add('BROWSER still invisible after full scroll', where, h)
    await page.close()
  }
  await ctx.close()
}
await browser.close()

// ── report ──────────────────────────────────────────────────────────────────
const kinds = Object.keys(findings).sort()
console.log(`\n${kinds.reduce((n, k) => n + findings[k].length, 0)} findings in ${kinds.length} kinds\n`)
for (const k of kinds) {
  console.log(`## ${k} (${findings[k].length})`)
  for (const f of findings[k]) console.log('  - ' + f)
  console.log('')
}
