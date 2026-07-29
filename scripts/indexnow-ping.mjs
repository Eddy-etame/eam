/**
 * INDEXNOW — pushes every sitemap URL to the IndexNow API so Bing (and the
 * engines that share its ecosystem, ChatGPT search included), Yandex and
 * Seznam discover changes INSTANTLY instead of waiting for a crawl.
 *
 * Run AFTER each production deploy (the key file must be live first):
 *   npm run seo:indexnow
 *
 * The key file public/<key>.txt proves domain ownership — no account needed.
 * Google ignores IndexNow: Google discovery goes through Search Console
 * (manual, Eddy's account) + the sitemap reference in robots.txt.
 */
const KEY = '6adf59d966164b7525ff93c7e8620ebb'
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://eam-agency.vercel.app'
const host = new URL(ORIGIN).host

// 1 — the key file must be reachable, else every submission is rejected.
const keyLocation = `${ORIGIN}/${KEY}.txt`
const keyRes = await fetch(keyLocation)
if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
  console.error(`indexnow: key file not live at ${keyLocation} — deploy first, then re-run.`)
  process.exit(1)
}

// 2 — collect every <loc> plus hreflang alternates from the live sitemap.
const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text()
const urls = [...new Set([...xml.matchAll(/(?:<loc>|href=")(https?:\/\/[^<"]+)/g)].map((m) => m[1]))]
if (urls.length === 0) {
  console.error('indexnow: no URLs found in the live sitemap — is the deploy healthy?')
  process.exit(1)
}

// 3 — one POST covers every engine that implements IndexNow.
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key: KEY, keyLocation, urlList: urls }),
})
console.log(`indexnow: submitted ${urls.length} URLs for ${host} → HTTP ${res.status} ${res.statusText}`)
if (!res.ok && res.status !== 202) process.exit(1)
