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
//   capture for the rail that really scrolls. Screens overlap by 200 px, so a
//   reveal that had not played at the previous bottom edge is re-shot inside
//   the next screen and never lost at a seam; every programmatic scroll waits
//   for rest and checks its landing (smooth-scroll glides), and a shot is kept
//   only when a second one agrees with it.
// PNGs and facts.json land in the out dir; nothing touches public/thumbs here.
//
//   node scripts/capture-sweep.mjs <targets.txt> [outDir]
//   targets: slug=url per line (scripts/capture-targets.mjs writes them);
//   outDir defaults to .verify/captures/<today> (gitignored).
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

// Next's sharp decodes the shots for the tile comparison; without it two
// shots must be byte-identical to agree.
let sharp = null
try {
  sharp = (await import('sharp')).default
} catch {
  /* byte equality then */
}

const listFile = process.argv[2]
if (!listFile) throw new Error('usage: node scripts/capture-sweep.mjs <targets.txt> [outDir]')
const OUT = path.resolve(process.argv[3] ?? path.join('.verify', 'captures', new Date().toISOString().slice(0, 10)))
fs.mkdirSync(OUT, { recursive: true })
const targets = fs.readFileSync(listFile, 'utf8').split(/\r?\n/).filter(Boolean).map((l) => l.split('='))
const SCREEN = 932
const FULL_H = 2330 // 2.5 phone screens, css px
const OVERLAP = 200 // css px re-shot by the next screen (a reveal at the edge has played by then)

// From the second screen on, fixed/sticky furniture (header, bars, bubbles)
// is hidden — the page content is what the capture shows. Run again right
// before each shot: a header a framework re-renders comes back without it.
const hideFurniture = () => {
  for (const el of document.querySelectorAll('*')) {
    const p = getComputedStyle(el).position
    if ((p === 'fixed' || p === 'sticky') && el.offsetHeight < innerHeight * 0.6) {
      // Opacity, not only visibility: a child can set its own visibility back
      // (clubmma.fr's logo stayed visible under a hidden header, 2026-11-08).
      el.style.setProperty('opacity', '0', 'important')
      el.style.setProperty('visibility', 'hidden', 'important')
      el.style.setProperty('transition', 'none', 'important')
    }
  }
}

// Two shots agree when no 40 px tile moved by more than a few levels:
// particles and a blinking cursor pass, a block mid-transition does not.
async function agree(a, b) {
  if (a.equals(b)) return true
  if (!sharp) return false
  const [A, B] = await Promise.all([a, b].map((buf) => sharp(buf).raw().toBuffer({ resolveWithObject: true })))
  if (A.info.width !== B.info.width || A.info.height !== B.info.height) return false
  const { width, height, channels } = A.info
  const T = 40
  for (let ty = 0; ty < height; ty += T) {
    for (let tx = 0; tx < width; tx += T) {
      let sum = 0
      let n = 0
      const yEnd = Math.min(height, ty + T)
      const xEnd = Math.min(width, tx + T)
      for (let y = ty; y < yEnd; y++) {
        let i = (y * width + tx) * channels
        for (let x = tx; x < xEnd; x++, i += channels) {
          sum += Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2])
          n += 3
        }
      }
      if (sum / n > 6) return false
    }
  }
  return true
}

// A shot is kept only when the next one, 1.5 s later, agrees with it — a
// block caught mid-transition (clubmma.fr's offers rotate every 5.5 s and
// stagger their text, 2026-11-08) never survives that; up to five shots span
// such a cycle. Pages that never stand still (video heroes) keep the last.
const steadyShot = async (page, file) => {
  let last = await page.screenshot({ fullPage: false })
  for (let k = 0; k < 4; k++) {
    await page.waitForTimeout(1500)
    const next = await page.screenshot({ fullPage: false })
    const same = await agree(last, next)
    last = next
    if (same) break
  }
  fs.writeFileSync(file, last)
}

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
    await steadyShot(page, path.join(OUT, `${slug}.png`))
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
    await steadyShot(page, path.join(OUT, `${slug}-m.png`))
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
      // Smooth-scroll libraries (Lenis on the Boxing Center sites) glide on after
      // the nudges and ignore a scrollTo issued mid-glide — the walk then landed
      // ~70 px low and left a dark band at the first seam (2026-11-08). So: rest
      // before every programmatic scroll, and check the landing.
      await still(page)
      // No look-ahead scroll: leaving a block and re-entering it restarts its
      // timers (clubmma.fr's offers block showed two slides at once, 2026-11-08);
      // the overlap alone re-shoots whatever had not revealed at the edge.
      const want = Math.min(target, await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight)))
      for (let tries = 0; tries < 3; tries++) {
        await page.evaluate((to) => window.scrollTo(0, to), target)
        await page.waitForTimeout(900)
        if (Math.abs((await still(page)) - want) <= 2) break
      }
      await page.evaluate(async () => {
        for (const img of document.querySelectorAll('img')) { img.loading = 'eager' }
        const imgs = [...document.querySelectorAll('img')].filter((i) => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight })
        await Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.onload = r; i.onerror = r; setTimeout(r, 6000) }))))
        for (const el of document.querySelectorAll('*')) {
          const p = getComputedStyle(el).position
          if ((p === 'fixed' || p === 'sticky') && el.offsetHeight < innerHeight * 0.6) {
            el.style.setProperty('opacity', '0', 'important')
            el.style.setProperty('visibility', 'hidden', 'important')
            el.style.setProperty('transition', 'none', 'important')
          }
        }
        await new Promise((r) => setTimeout(r, 400))
      })
      // The shot counts only if nothing moved during it: the position is read
      // before and after, and the shot is redone once if they differ (a glide
      // still creeping lost a title line at a seam on 2026-11-08).
      let sy = -1
      for (let attempt = 0; attempt < 2; attempt++) {
        sy = await still(page)
        await page.evaluate(hideFurniture)
        const file = `${slug}-seg${site.segments.length}.png`
        await steadyShot(page, path.join(OUT, file))
        const after = await page.evaluate(() => Math.round(scrollY))
        if (after === sy || attempt === 1) {
          if (after !== sy) site.failed.push(`m segment moved during the shot ${sy}→${after}`)
          site.segments.push({ file, y: after })
          sy = after
          break
        }
      }
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
