// The list of sites to (re)capture, from the registry — one `slug=url` line per
// capture pair, for scripts/capture-sweep.mjs. Family deployments (sites[])
// are listed under their own capture slug. Entries without a live address
// cannot be reshot and are reported on stderr.
//
//   node scripts/capture-targets.mjs            every captured slug
//   node scripts/capture-targets.mjs --stale    only those older than 28 days
//                                               (src/lib/captures.json)
//   node scripts/capture-targets.mjs a b c      just these slugs
import fs from 'node:fs'
import path from 'node:path'

const STALE_DAYS = 28
const args = process.argv.slice(2)
const staleOnly = args.includes('--stale')
const wanted = new Set(args.filter((a) => !a.startsWith('--')))

const src = fs.readFileSync(path.resolve('src/lib/projects.ts'), 'utf8').replace(/\r\n/g, '\n')
const manifest = JSON.parse(fs.readFileSync(path.resolve('src/lib/captures.json'), 'utf8'))
const thumbed = new Set([...(/const THUMBED = new Set\(\[([\s\S]*?)\]\)/.exec(src)?.[1] ?? '').matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]))

const urls = new Map()
// Solo and world entries: the liveUrl that follows each slug.
for (const slug of thumbed) {
  const at = src.indexOf(`slug: '${slug}'`)
  if (at < 0) continue
  const m = /liveUrl: ['"]([^'"]+)['"]/.exec(src.slice(at, at + 3000))
  if (m && m[1] !== '#') urls.set(slug, m[1])
}
// Family deployments: { name, url, thumb: '/thumbs/<capture-slug>.jpg' }.
for (const m of src.matchAll(/url: '([^']+)', thumb: '\/thumbs\/([a-z0-9-]+)\.jpg'/g)) urls.set(m[2], m[1])
// A family entry whose own thumb is one of its deployments' is not a capture of its own.
for (const m of src.matchAll(/slug: '([a-z0-9-]+)'[\s\S]{0,2000}?thumb: '\/thumbs\/([a-z0-9-]+)\.jpg'/g)) {
  if (m[1] !== m[2]) urls.delete(m[1])
}

const today = Date.now()
const out = []
for (const slug of Object.keys(manifest).sort()) {
  if (wanted.size && !wanted.has(slug)) continue
  const url = urls.get(slug)
  if (!url) {
    if (!staleOnly || wanted.size) console.error(`no live address for ${slug} — cannot be reshot`)
    continue
  }
  if (staleOnly) {
    const age = Math.round((today - Date.parse(manifest[slug].shot)) / 86400000)
    if (age <= STALE_DAYS) continue
  }
  out.push(`${slug}=${url}`)
}
process.stdout.write(out.join('\n') + (out.length ? '\n' : ''))
console.error(`${out.length} target(s)`)
