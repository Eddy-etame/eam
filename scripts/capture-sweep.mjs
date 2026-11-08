// Capture pairs from the live sites — the house recipe, kept in the repo so the
// Monday routine and anyone else shoot the same way (Eddy 2026-11-08: "you
// have to be renewing the shots from time to time because the websites
// change"). Per site:
// - desktop: msedge headless 1440×900 @2x, networkidle + 3 s, fonts ready, fixed
//   cookie/consent/chat/toast furniture hidden, in-view images eager and
//   awaited, viewport screenshot;
// - phone: 430×932 @2x isMobile, same settle, the pristine first screen — then
//   the page is walked screen by screen (wheel nudges, so smooth-scroll
//   libraries follow) and each screen shot as the visitor sees it, reveals
//   played, fixed/sticky furniture hidden from the second screen on; the
//   segments are stitched by scripts/capture-convert.py into the 2.5-screen
//   capture for the rail that really scrolls. Screens overlap by 200 px and
//   each is shot after a look one screen ahead, so a reveal that had not
//   played at the previous bottom edge is never lost at a seam.
// PNGs and facts.json land in the out dir; nothing touches public/thumbs here.
//
//   node scripts/capture-sweep.mjs <targets.txt> [outDir]
//   targets: slug=url per line (scripts/capture-targets.mjs writes them);
//   outDir defaults to .verify/captures/<today> (gitignored).
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const listFile = process.argv[2]
if (!listFile) throw new Error('usage: node scripts/capture-sweep.mjs <targets.txt> [outDir]')
const OUT = path.resolve(process.argv[3] ?? path.join('.verify', 'captures', new Date().toISOString().slice(0, 10)))
fs.mkdirSync(OUT, { recursive: true })
const targets = fs.readFileSync(listFile, 'utf8').split(/\r?\n/).filter(Boolean).map((l) => l.split('='))
const SCREEN = 932
const FULL_H = 2330 // 2.5 phone screens, css px
const OVERLAP = 200 // css px re-shot by the next screen (a reveal at the edge has played by then)

// Scroll position once it stops moving (smooth-scroll libraries glide for a while).
const still = async (page) => {
  let last = -1
  for (let i = 0; i < 14; i++) {
    const sy = await page.evaluate(() => Math.round(scrollY))
    if (sy === last) return sy
    last = sy
    await page.waitForTimeout(150)
  }
  return last
}

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const factsFile = path.join(OUT, 'facts.json')
const facts = fs.existsSync(factsFile) ? JSON.parse(fs.readFileSync(factsFile, 'utf8')) : {}

const FURNITURE = /cookie|consent|rgpd|gdpr|tarteaucitron|axeptio|crisp|whatsapp-float|chat-widget|chat-fab|chat-launcher|chat-root|bcp-chat|chatbot|livechat|tawk|intercom|hubspot-messages|chloe|bchatb|toast|saviez/i

const settle = async (page) => {
  await page.evaluate(async (furniture) => {
    const re = new RegExp(furniture, 'i')
    await document.fonts.ready
    for (const img of document.querySelectorAll('img')) { img.loading = 'eager'; img.decoding = 'sync' }
    for (const el of document.querySelectorAll('*')) {
      const cs = getComputedStyle(el)
      if (cs.position !== 'fixed' || !el.offsetWidth) continue
      const sig = el.className + ' ' + el.id + ' ' + (el.textContent || '').slice(0, 120)
      if (re.test(sig) && !/^(HEADER|NAV)$/.test(el.tagName)) el.style.display = 'none'
    }
    const imgs = [...document.querySelectorAll('img')].filter((i) => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight })
    await Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.onload = r; i.onerror = r; setTimeout(r, 8000) }))))
    await new Promise((r) => setTimeout(r, 1000))
  }, FURNITURE.source)
}

const read = (page) =>
  page.evaluate(() => {
    const txt = document.body.innerText
    return {
      title: document.title.slice(0, 90),
      h1: document.querySelector('h1')?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 90) ?? null,
      vw: innerWidth,
      docW: document.documentElement.scrollWidth,
      docH: document.documentElement.scrollHeight,
      euroHits: (txt.match(/\d+(?:[,.]\d+)?\s?€/g) || []).slice(0, 8),
      fixedLeft: [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'fixed' && e.offsetWidth && e.offsetHeight > 40).map((e) => e.tagName + '.' + String(e.className).slice(0, 24)).slice(0, 6),
    }
  })

async function shoot(slug, url) {
  const site = { url, shot: new Date().toISOString().slice(0, 10), desktop: null, phone: null, segments: [], failed: [] }
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'fr-FR' })
    const page = await ctx.newPage()
    page.on('response', (r) => { if (r.status() >= 400) site.failed.push(`d ${r.status()} ${r.url().slice(0, 100)}`) })
    try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }) } catch (e) { site.failed.push('d goto ' + String(e).slice(0, 80)) }
    await page.waitForTimeout(3000)
    await settle(page)
    site.desktop = await read(page)
    await page.screenshot({ path: path.join(OUT, `${slug}.png`), fullPage: false })
    await ctx.close()
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 430, height: SCREEN }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'fr-FR' })
    const page = await ctx.newPage()
    page.on('response', (r) => { if (r.status() >= 400) site.failed.push(`m ${r.status()} ${r.url().slice(0, 100)}`) })
    try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }) } catch (e) { site.failed.push('m goto ' + String(e).slice(0, 80)) }
    await page.waitForTimeout(3000)
    await settle(page)
    site.phone = await read(page)
    await page.screenshot({ path: path.join(OUT, `${slug}-m.png`), fullPage: false })
    site.segments.push({ file: `${slug}-m.png`, y: 0 })
    // The walk overlaps: every screen from the second on starts OVERLAP px above
    // where the previous one ended and is pasted over it, so whatever sat at the
    // previous bottom edge — a paragraph whose reveal had not played yet (L'Union,
    // 2026-11-08: two lines lost at a seam) — is re-shot well inside the viewport.
    // The pristine first screen keeps its own bottom band only when a fixed or
    // sticky bar lives there (the visitor sees it; the walk hides such furniture).
    const firstBandBusy = await page.evaluate(
      (bandTop) =>
        [...document.querySelectorAll('*')].some((el) => {
          const p = getComputedStyle(el).position
          if (p !== 'fixed' && p !== 'sticky') return false
          const r = el.getBoundingClientRect()
          return r.width > 0 && r.height > 0 && r.bottom > bandTop && r.top < innerHeight && el.offsetHeight < innerHeight * 0.6
        }),
      SCREEN - OVERLAP,
    )
    let covered = SCREEN
    let target = firstBandBusy ? SCREEN : SCREEN - OVERLAP
    while (covered < FULL_H) {
      let guard = 0
      while (guard++ < 30) {
        const sy = await page.evaluate(() => Math.round(scrollY))
        if (sy >= target - 2) break
        await page.mouse.wheel(0, Math.min(300, target - sy))
        await page.waitForTimeout(90)
      }
      // Look one screen ahead and come back: reveal libraries that play once
      // have then played for everything this screen will show.
      await page.evaluate((to) => window.scrollTo(0, to), target + SCREEN)
      await page.waitForTimeout(600)
      await page.evaluate((to) => window.scrollTo(0, to), target)
      await page.waitForTimeout(900)
      await still(page)
      await page.evaluate(async () => {
        for (const img of document.querySelectorAll('img')) { img.loading = 'eager' }
        const imgs = [...document.querySelectorAll('img')].filter((i) => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight })
        await Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.onload = r; i.onerror = r; setTimeout(r, 6000) }))))
        for (const el of document.querySelectorAll('*')) {
          const p = getComputedStyle(el).position
          if ((p === 'fixed' || p === 'sticky') && el.offsetHeight < innerHeight * 0.6) el.style.visibility = 'hidden'
        }
        await new Promise((r) => setTimeout(r, 400))
      })
      const sy = await still(page)
      const file = `${slug}-seg${site.segments.length}.png`
      await page.screenshot({ path: path.join(OUT, file), fullPage: false })
      site.segments.push({ file, y: sy })
      if (sy < target - 2) break // the page ended before the target
      covered = sy + SCREEN
      target = sy + SCREEN - OVERLAP
    }
    await ctx.close()
  }
  facts[slug] = site
  console.log(`shot ${slug.padEnd(28)} d:${site.desktop?.docW} m:${site.phone?.docW}/${site.phone?.vw} docH:${site.phone?.docH} segs:${site.segments.map((s) => s.y).join(',')} failed:${site.failed.length}`)
}

for (const [slug, url] of targets) {
  try { await shoot(slug, url) } catch (e) { console.log('FAILED', slug, String(e).slice(0, 160)); facts[slug] = { url, error: String(e).slice(0, 200) } }
  fs.writeFileSync(factsFile, JSON.stringify(facts, null, 2))
}
await browser.close()
console.log('DONE', Object.keys(facts).length, '→', OUT)
