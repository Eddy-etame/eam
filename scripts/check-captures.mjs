// Capture pairs law — every /public/thumbs/<slug>.jpg (desktop, 16:10) has a
// /thumbs/<slug>-m.jpg twin (phone: 860×1864, a 430×932 viewport at 2x), shot
// in the same pass. Case covers, the family sites grid and galleries pick the
// twin on phone screens, so a missing twin would be a 404 inside a device
// frame. Runs before `next build`; exits 1 with every fault listed.
//
// Usage: node scripts/check-captures.mjs
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.resolve('public/thumbs')

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
    if (sof) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }
    i += 2 + len
  }
  return null
}

const faults = []
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.jpg'))
const desktop = files.filter((f) => !f.endsWith('-m.jpg'))
let pairs = 0

for (const f of desktop) {
  const slug = f.slice(0, -4)
  const d = jpegSize(path.join(DIR, f))
  if (!d) faults.push(`${f}: not a readable JPEG`)
  else if (d.w < 1600 || Math.abs(d.w / d.h - 1.6) > 0.02) faults.push(`${f}: desktop capture is ${d.w}×${d.h}, expected ≥1600 wide at 16:10`)

  const twin = `${slug}-m.jpg`
  if (!files.includes(twin)) {
    if (PENDING.has(slug)) continue
    faults.push(`${f}: no phone twin ${twin}`)
    continue
  }
  const m = jpegSize(path.join(DIR, twin))
  if (!m) faults.push(`${twin}: not a readable JPEG`)
  else if (m.w !== 860 || m.h !== 1864) faults.push(`${twin}: phone capture is ${m.w}×${m.h}, expected 860×1864`)
  else pairs++
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
console.log(`captures: ${pairs} desktop+phone pairs, ${desktop.length} desktop captures, ${PENDING.size} pending — OK`)
