// Capture pairs law — every /public/thumbs/<slug>.jpg (desktop, 16:10, 1600 px
// wide or more) has a /thumbs/<slug>-m.jpg twin (phone: 860 px wide, a real
// 430 px viewport at 2x, from one screen — 1864 px — up to two and a half
// screens — 4660 px — walked from the top, for the rail that really scrolls).
// Case covers, the cards, the family sites grid and galleries pick the twin on
// phone screens, so a missing twin would be a 404 inside a device frame.
//
// Freshness manifest (src/lib/captures.json, Eddy 2026-11-08: "you have to be
// renewing the shots from time to time because the websites change"): one
// entry per slug — the shot date, and [width, height, bytes] of each file.
// A file whose size or dimensions changed since the manifest was written is a
// new capture: it is stamped with today's date. Entries older than 28 days
// are listed as stale (a warning — the Monday routine reshoots them), never a
// failure. PhoneCapture reads the phone height from the manifest to size the
// scrolling layer, so the manifest is committed with the captures.
//
// Runs before `next build`; exits 1 with every fault listed.
// Usage: node scripts/check-captures.mjs [--today YYYY-MM-DD]
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.resolve('public/thumbs')
const MANIFEST = path.resolve('src/lib/captures.json')
const STALE_DAYS = 28
const todayArg = process.argv.indexOf('--today')
const TODAY = todayArg > -1 ? process.argv[todayArg + 1] : new Date().toISOString().slice(0, 10)

// Deliberate exceptions — each with its reason and date. Keep in step with
// PHONE_CAPTURE_PENDING in src/lib/projects.ts. (JCBO sat here 2026-11-07 →
// 2026-11-08: its live domain answered a WordPress placeholder; the twin was
// shot from the delivered site's repository instead.)
const PENDING = new Map([])

/** Width/height from the first SOF marker — no image library needed. */
function jpegSize(file) {
  const buf = fs.readFileSync(file)
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null
  let i = 2
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i++
      continue
    }
    const marker = buf[i + 1]
    if (marker === 0xff) {
      i++
      continue
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2
      continue
    }
    const len = buf.readUInt16BE(i + 2)
    const sof =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    if (sof) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7), bytes: buf.length }
    i += 2 + len
  }
  return null
}

const faults = []
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.jpg'))
const desktop = files.filter((f) => !f.endsWith('-m.jpg')).sort()
const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {}
const next = {}
let pairs = 0
let stamped = 0

for (const f of desktop) {
  const slug = f.slice(0, -4)
  const d = jpegSize(path.join(DIR, f))
  if (!d) {
    faults.push(`${f}: not a readable JPEG`)
    continue
  }
  if (d.w < 1600) faults.push(`${f}: desktop capture is only ${d.w} px wide (1600 minimum)`)
  const ratio = d.w / d.h
  if (Math.abs(ratio - 1.6) > 0.02) faults.push(`${f}: desktop capture is ${d.w}×${d.h}, not 16:10`)

  const twin = `${slug}-m.jpg`
  let m = null
  if (!files.includes(twin)) {
    if (!PENDING.has(slug)) faults.push(`${f}: no phone twin ${twin}`)
  } else {
    m = jpegSize(path.join(DIR, twin))
    if (!m) faults.push(`${twin}: not a readable JPEG`)
    else if (m.w !== 860 || m.h < 1864 || m.h > 4660) faults.push(`${twin}: phone capture is ${m.w}×${m.h}, expected 860 wide and 1864–4660 tall`)
    else pairs++
  }

  // Manifest: keep the date while the files are the ones it describes;
  // a changed file is a fresh capture, stamped today.
  const prev = manifest[slug]
  const same = (a, b) => !!a && !!b && a[0] === b.w && a[1] === b.h && a[2] === b.bytes
  const unchanged = prev && same(prev.d, d) && (m ? same(prev.m, m) : !prev.m)
  if (!unchanged) stamped++
  next[slug] = {
    shot: unchanged ? prev.shot : TODAY,
    d: [d.w, d.h, d.bytes],
    ...(m ? { m: [m.w, m.h, m.bytes] } : {}),
  }
}

// Orphan phone captures — a twin whose desktop capture is gone.
for (const f of files.filter((x) => x.endsWith('-m.jpg'))) {
  if (!files.includes(f.replace(/-m\.jpg$/, '.jpg'))) faults.push(`${f}: phone capture without a desktop capture`)
}

for (const [slug, why] of PENDING) {
  if (files.includes(`${slug}-m.jpg`)) faults.push(`${slug}: listed as pending but its phone twin exists — drop it from PENDING (here and in projects.ts)`)
  else console.log(`  pending  ${slug} — ${why}`)
}

if (faults.length) {
  console.error(`captures: ${faults.length} fault(s)`)
  for (const f of faults) console.error('  ✗ ' + f)
  process.exit(1)
}

const serialized = JSON.stringify(next, null, 2) + '\n'
if (!fs.existsSync(MANIFEST) || fs.readFileSync(MANIFEST, 'utf8') !== serialized) {
  fs.writeFileSync(MANIFEST, serialized)
  console.log(`captures: manifest written (${stamped} entr${stamped === 1 ? 'y' : 'ies'} stamped ${TODAY}) — commit src/lib/captures.json with the captures`)
}

const dayMs = 86400000
const stale = Object.entries(next)
  .map(([slug, e]) => [slug, Math.round((Date.parse(TODAY) - Date.parse(e.shot)) / dayMs)])
  .filter(([, age]) => age > STALE_DAYS)
  .sort((a, b) => b[1] - a[1])
if (stale.length) {
  console.log(`captures: ${stale.length} older than ${STALE_DAYS} days — to reshoot: ${stale.map(([s, a]) => `${s} (${a} d)`).join(', ')}`)
}
console.log(`captures: ${pairs} desktop+phone pairs, ${desktop.length} desktop captures, ${PENDING.size} pending — OK`)
