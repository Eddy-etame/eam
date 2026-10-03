/**
 * Site verification rig — the way to PROVE a change on this site.
 * Real wheel events (→ Lenis → ScrollTrigger: the only scroll path that works
 * headless), desktop + phone, console errors, horizontal overflow, the offer
 * bands → contact prefill, every Boxing Center link, frame pacing while
 * scrolling the home page, and a throttled first visit (the curtain must
 * never hold the page). Screenshots land in .verify/ (gitignored) — look at
 * them: a passing assertion does not prove a page looks right.
 *
 *   npm run build && npx next start -p 3030
 *   node scripts/verify-site.mjs http://localhost:3030            # every suite
 *   node scripts/verify-site.mjs http://localhost:3030 world home # chosen ones
 *
 * Suites: prices · offers · pages · world · home · slow. Uses system Edge
 * (channel msedge) through the playwright devDependency.
 */
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const ORIGIN = process.argv[2] ?? 'http://localhost:3030'
const SUITES = process.argv.slice(3)
const OUT = path.join(process.cwd(), '.verify')
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const results = []
const log = (ok, name, detail = '') => {
  results.push({ ok, name, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`)
}

async function open(mode, url, { intro = false } = {}) {
  const ctx = await browser.newContext(
    mode === 'd'
      ? { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'fr-FR' }
      : {
          viewport: { width: 390, height: 844 },
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          locale: 'fr-FR',
        },
  )
  // Skip the preloader ceremony unless the suite is about it.
  if (!intro) await ctx.addInitScript(() => sessionStorage.setItem('eam:intro-shown', '1'))
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)))
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)))
  await page.goto(ORIGIN + url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1200)
  return { ctx, page, errors }
}

const overflow = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

async function wheelTo(page, y, step = 500) {
  // Real wheel events → Lenis → ScrollTrigger (the only path that works headless).
  let cur = await page.evaluate(() => window.scrollY)
  let guard = 0
  while (cur < y - 40 && guard++ < 200) {
    await page.mouse.wheel(0, step)
    await page.waitForTimeout(110)
    cur = await page.evaluate(() => window.scrollY)
  }
  await page.waitForTimeout(1400) // Lenis momentum settles
  return cur
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name + '.jpg'), quality: 72, type: 'jpeg' })
}

// ── SUITE: prices ────────────────────────────────────────────────────────────
async function prices() {
  const pricey = /\d[\s\u00A0\u202F]?000[\s\u00A0\u202F]?€|€\s?\d,000/
  for (const url of [
    '/fr', '/en', '/fr/services', '/en/services', '/fr/contact', '/en/contact',
    '/fr/services/site-vitrine', '/fr/services/e-commerce', '/fr/services/refonte', '/fr/services/seo-geo',
    '/en/services/site-vitrine', '/en/services/seo-geo',
  ]) {
    const { ctx, page, errors } = await open('d', url)
    const text = await page.evaluate(() => document.documentElement.outerHTML)
    const hit = text.match(pricey)
    log(!hit, `no website price on ${url}`, hit ? hit[0] : '')
    if (url.includes('seo-geo') || url.endsWith('/services') || url.endsWith('/contact'))
      log(/300[\s\u00A0]?€|€300/.test(text), `SEO & GEO keeps 300 on ${url}`)
    log(errors.length === 0, `console clean ${url}`, errors.join(' | '))
    await ctx.close()
  }
  for (const [url, re] of [['/llms.txt', pricey]]) {
    const r = await fetch(ORIGIN + url)
    const t = await r.text()
    log(!re.test(t), `no website price in ${url}`)
  }
  for (const url of ['/fr/services', '/fr/contact', '/fr/services/site-vitrine']) {
    const r = await fetch(ORIGIN + url, { headers: { Accept: 'text/markdown' } })
    const t = await r.text()
    log(r.headers.get('content-type')?.includes('markdown') && !pricey.test(t), `markdown twin clean ${url}`)
  }
}

// ── SUITE: offers (bands → contact prefill) ──────────────────────────────────
async function offers() {
  for (const mode of ['d', 'm']) {
    // From the services hub: a band is an ordinary navigation to ?sujet=…#devis
    let { ctx, page, errors } = await open(mode, '/fr/services')
    const band = page.locator('a[data-sujet="e-commerce"]').first()
    await band.scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    await shot(page, `offers-hub-${mode}`)
    await Promise.all([page.waitForURL(/\/fr\/contact\?sujet=e-commerce/), band.click()])
    await page.waitForTimeout(1500)
    const msg = await page.locator('#message').inputValue()
    log(/Sujet : E-commerce/.test(msg), `[${mode}] hub band → contact prefilled`, JSON.stringify(msg))
    log(errors.length === 0, `[${mode}] console clean hub→contact`, errors.join(' | '))
    await ctx.close()

    // On the contact page: a band prefills IN PLACE and brings the form into view
    ;({ ctx, page, errors } = await open(mode, '/fr/contact'))
    await page.locator('#message').fill('')
    const b2 = page.locator('a[data-sujet="site-vitrine"]').first()
    await b2.scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    await shot(page, `offers-contact-${mode}`)
    await b2.click()
    await page.waitForTimeout(2200)
    const m2 = await page.locator('#message').inputValue()
    const inView = await page.evaluate(() => {
      const r = document.getElementById('devis').getBoundingClientRect()
      return r.top > -40 && r.top < innerHeight * 0.6
    })
    log(/Sujet : Site vitrine sur-mesure/.test(m2), `[${mode}] contact band prefills in place`, JSON.stringify(m2))
    log(inView, `[${mode}] form scrolled into view after band click`)
    log(page.url().includes('sujet=site-vitrine'), `[${mode}] URL carries the subject`)
    // Switch subject: previous subject line swapped, typed text kept
    await page.locator('#message').fill(m2 + 'Bonjour, voici mon projet.')
    const b3 = page.locator('a[data-sujet="seo-geo"]').first()
    await b3.scrollIntoViewIfNeeded()
    await page.waitForTimeout(700)
    await b3.click()
    await page.waitForTimeout(1800)
    const m3 = await page.locator('#message').inputValue()
    log(/^Sujet : SEO & GEO\n\nBonjour, voici mon projet\.$/.test(m3), `[${mode}] subject swap keeps typed text`, JSON.stringify(m3))
    await shot(page, `offers-contact-after-${mode}`)
    log((await overflow(page)) <= 0, `[${mode}] no horizontal overflow /fr/contact`)
    log(errors.length === 0, `[${mode}] console clean contact`, errors.join(' | '))
    await ctx.close()
  }
}

// ── SUITE: pages (screenshots + overflow + console) ─────────────────────────
async function pages() {
  const list = [
    ['/fr/services/site-vitrine', 'svc-vitrine'],
    ['/fr/services/seo-geo', 'svc-seo'],
    ['/fr/services', 'svc-hub'],
    ['/fr/work', 'work'],
    ['/fr/work/boxing-center-proximite', 'case-proximite'],
    ['/fr/work/boutique-de-boxe', 'case-boutique'],
    ['/fr/work/tmbc', 'case-tmbc'],
    ['/fr/work/boxing-center-ramonville', 'case-ramonville'],
    ['/en/work/club-boxe-blagnac', 'case-blagnac-en'],
  ]
  for (const mode of ['d', 'm']) {
    for (const [url, name] of list) {
      const { ctx, page, errors } = await open(mode, url)
      await shot(page, `${name}-${mode}-top`)
      log((await overflow(page)) <= 0, `[${mode}] no horizontal overflow ${url}`, String(await overflow(page)))
      log(errors.length === 0, `[${mode}] console clean ${url}`, errors.join(' | '))
      if (name === 'case-proximite') {
        const n = await page.locator('a[href^="https://www.boxingcenter-"]').count()
        log(n >= 7, `[${mode}] proximity case lists the 7 sites`, String(n))
        await page.locator('a[href^="https://www.boxingcenter-muret"]').first().scrollIntoViewIfNeeded()
        await page.waitForTimeout(1200)
        await shot(page, `${name}-${mode}-sites`)
      }
      await ctx.close()
    }
  }
}

// ── SUITE: world (the Boxing Center journey, wheel-driven) ──────────────────
async function world() {
  for (const mode of ['d', 'm']) {
    const { ctx, page, errors } = await open(mode, '/fr/work/boxing-center')
    await shot(page, `world-${mode}-00-entrance`)
    const links = await page.evaluate(() => [...document.querySelectorAll('a[href^="http"]')].map((a) => a.href))
    const must = [
      'boxing-center-portet.fr', 'clubmma.fr', 'boxe-toulouse.com', 'club-boxe-toulouse.com', 'mmatoulouse.com',
      'toulouse-minimes-boxing-club.fr', 'club-boxe-blagnac.fr', 'boxingcenter-colomiers.fr', 'boxingcenter-muret.fr',
      'boxingcenter-cugnaux.fr', 'boxingcenter-tournefeuille.fr', 'boxingcenter-labege.fr', 'boxingcenter-lunion.fr',
      'boxingcenter-castelginest.fr', 'boutique.boxingcenter.fr', 'boutique-de-boxe.com', 'matos-de-boxe.fr',
    ]
    for (const host of must) log(links.some((l) => l.includes(host)), `[${mode}] world links ${host}`)
    for (const banned of ['concours.boxingcenter.fr', 'materiel-de-boxe.fr', 'etas-unis.vercel.app', 'bc-minimes.vercel.app', 'box-plus.vercel.app'])
      log(!links.some((l) => l.includes(banned)), `[${mode}] world does NOT link ${banned}`)

    const total = await page.evaluate(() => document.documentElement.scrollHeight)
    const vh = mode === 'd' ? 900 : 844
    let i = 1
    if (mode === 'd') {
      for (let y = vh; y < total; y += Math.round(vh * 1.15)) {
        await wheelTo(page, y)
        await shot(page, `world-d-${String(i++).padStart(2, '0')}`)
        if (i > 34) break
      }
    } else {
      // Touch: native scroll (Lenis leaves touch alone) — scrollTo drives ScrollTrigger fine.
      for (let y = vh; y < total; y += Math.round(vh * 1.2)) {
        await page.evaluate((to) => window.scrollTo(0, to), y)
        await page.waitForTimeout(900)
        await shot(page, `world-m-${String(i++).padStart(2, '0')}`)
        if (i > 34) break
      }
    }
    const invisible = await page.evaluate(() =>
      [...document.querySelectorAll('[data-bc-reveal],[data-bc-band-copy]')].filter((el) => {
        const r = el.getBoundingClientRect()
        return r.bottom < 0 && getComputedStyle(el).opacity === '0'
      }).length,
    )
    log(invisible === 0, `[${mode}] no block left invisible after passing it`, String(invisible))
    log((await overflow(page)) <= 0, `[${mode}] no horizontal overflow on the world`, String(await overflow(page)))
    log(errors.length === 0, `[${mode}] console clean on the world`, errors.join(' | '))
    await ctx.close()
  }
}

// ── SUITE: home (rail + chapters + frame pacing) ─────────────────────────────
async function home() {
  for (const mode of ['d', 'm']) {
    const { ctx, page, errors } = await open(mode, '/fr')
    await shot(page, `home-${mode}-00`)
    const cards = await page.evaluate(() => ({
      etats: !!document.querySelector('a[href$="/work/boxing-center-etats-unis"]'),
      portet: !!document.querySelector('a[href$="/work/boxing-center-portet"]'),
    }))
    log(cards.etats && cards.portet, `[${mode}] rail carries Portet and États-Unis`)
    if (mode === 'd') {
      // Frame pacing while wheeling the whole page.
      await page.evaluate(() => {
        window.__frames = []
        window.__janks = []
        let last = performance.now()
        const tick = (t) => {
          window.__frames.push(t - last)
          if (t - last > 50) window.__janks.push([Math.round(window.scrollY), Math.round(t - last), document.documentElement.dataset.theme])
          last = t
          window.__raf = requestAnimationFrame(tick)
        }
        window.__raf = requestAnimationFrame(tick)
      })
      const total = await page.evaluate(() => document.documentElement.scrollHeight)
      let i = 1
      for (let y = 900; y < total; y += 1000) {
        await wheelTo(page, y, 400)
        if (i <= 16) await shot(page, `home-d-${String(i++).padStart(2, '0')}`)
      }
      const stats = await page.evaluate(() => {
        cancelAnimationFrame(window.__raf)
        const f = window.__frames.slice(5).sort((a, b) => a - b)
        const q = (p) => f[Math.min(f.length - 1, Math.floor(f.length * p))]
        return { n: f.length, p50: q(0.5), p95: q(0.95), p99: q(0.99), max: f[f.length - 1], over50: f.filter((x) => x > 50).length }
      })
      console.log('FRAMES', JSON.stringify(stats))
      console.log('JANKS [scrollY, ms, theme]', JSON.stringify(await page.evaluate(() => window.__janks)))
      log(stats.p95 < 34, '[d] home scroll p95 frame under 34ms', JSON.stringify(stats))
      const theme = await page.evaluate(() => document.documentElement.dataset.theme)
      log(theme === 'heraldic', '[d] page ends on the heraldic chapter (CTA)', String(theme))
    } else {
      const total = await page.evaluate(() => document.documentElement.scrollHeight)
      let i = 1
      for (let y = 844; y < total; y += 1000) {
        await page.evaluate((to) => window.scrollTo(0, to), y)
        await page.waitForTimeout(800)
        if (i <= 14) await shot(page, `home-m-${String(i++).padStart(2, '0')}`)
      }
    }
    log((await overflow(page)) <= 0, `[${mode}] no horizontal overflow on home`, String(await overflow(page)))
    log(errors.length === 0, `[${mode}] console clean on home`, errors.join(' | '))
    await ctx.close()
  }
}

// ── SUITE: slow (throttled first visit — the curtain must never hold the page) ─
async function slow() {
  for (const [label, down, lat] of [['slow-3g', 50e3, 400], ['fast-3g', 180e3, 150], ['4g', 1.2e6, 60]]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    // A modest phone: the heavy-GL gate must refuse it (no three.js on this path).
    await ctx.addInitScript(() => {
      Object.defineProperty(navigator, 'deviceMemory', { get: () => 2 })
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 })
    })
    const page = await ctx.newPage()
    const cdp = await ctx.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.emulateNetworkConditions', { offline: false, downloadThroughput: down, uploadThroughput: down / 3, latency: lat })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    const t0 = Date.now()
    page.goto(ORIGIN + '/fr', { waitUntil: 'commit', timeout: 120000 }).catch(() => {})
    const marks = {}
    for (let s = 0; s < 60; s++) {
      await page.waitForTimeout(500)
      const st = await page
        .evaluate(() => {
          const p = document.querySelector('[data-preloader]')
          if (!p) return { html: false }
          const cs = getComputedStyle(p)
          return {
            html: true,
            h1: !!document.querySelector('h1'),
            curtainGone: cs.display === 'none' || cs.visibility === 'hidden' || p.getBoundingClientRect().bottom <= 0,
            live: p.hasAttribute('data-live'),
            hydrated: !!window.__eamIntroDone,
          }
        })
        .catch(() => ({ html: false }))
      const t = Date.now() - t0
      if (st.html && !marks.html) marks.html = t
      if (st.live && !marks.jsLive) marks.jsLive = t
      if (st.curtainGone && !marks.curtainGone) {
        marks.curtainGone = t
        await page.screenshot({ path: path.join(OUT, `slow-${label}-revealed.jpg`), quality: 70, type: 'jpeg' })
      }
      if (st.hydrated && !marks.introDone) marks.introDone = t
      if (!marks.s3 && t > 3000 && st.html) {
        marks.s3 = t
        await page.screenshot({ path: path.join(OUT, `slow-${label}-at3s.jpg`), quality: 70, type: 'jpeg' })
      }
      if (marks.curtainGone && marks.introDone) break
    }
    console.log('SLOW', label, JSON.stringify(marks))
    const budget = label === 'slow-3g' ? 10000 : 7000
    log(!!marks.curtainGone && marks.curtainGone < budget, `[${label}] content visible within ${budget / 1000}s`, JSON.stringify(marks))
    await ctx.close()
  }
}

const all = { prices, offers, pages, world, home, slow }
for (const s of SUITES.length ? SUITES : Object.keys(all)) {
  console.log(`\n===== ${s} =====`)
  try {
    await all[s]()
  } catch (e) {
    log(false, `suite ${s} crashed`, String(e).slice(0, 300))
  }
}
await browser.close()
const fails = results.filter((r) => !r.ok)
console.log(`\n${results.length - fails.length}/${results.length} passed`)
for (const f of fails) console.log('  FAIL', f.name, '—', f.detail)
