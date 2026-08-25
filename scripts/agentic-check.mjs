/**
 * AGENT-READINESS CHECKS — verifies every behavior of the Is-Agentic sprint
 * (2026-07-30) against a running origin. Run against the local prod build
 * before pushing, and against production after each deploy:
 *   node scripts/agentic-check.mjs http://localhost:3030
 *   node scripts/agentic-check.mjs https://eam-agency.vercel.app
 * Exits non-zero on any failure.
 */
const ORIGIN = (process.argv[2] ?? 'https://eam-agency.vercel.app').replace(/\/$/, '')
let pass = 0
let fail = 0

function check(name, ok, detail = '') {
  if (ok) {
    pass++
    console.log(`  OK   ${name}`)
  } else {
    fail++
    console.error(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

async function get(path, headers = {}) {
  const res = await fetch(`${ORIGIN}${path}`, { headers, redirect: 'manual' })
  const body = await res.text()
  return { res, body }
}

console.log(`agentic-check → ${ORIGIN}\n`)

// 1 — HTML 404: real status + recovery links in the body
{
  const { res, body } = await get('/fr/cette-page-nexiste-pas', {
    accept: 'text/html',
    'user-agent': 'agentic-check',
  })
  check('404 status on unknown path', res.status === 404, `got ${res.status}`)
  check('404 body links sitemap.xml', body.includes('sitemap.xml'))
  check('404 body links llms.txt', body.includes('llms.txt'))
}

// 2 — markdown negotiation on a real page
{
  const { res, body } = await get('/fr', { accept: 'text/markdown' })
  check('Accept: text/markdown → 200', res.status === 200, `got ${res.status}`)
  check(
    'markdown content-type',
    (res.headers.get('content-type') ?? '').includes('text/markdown'),
    res.headers.get('content-type') ?? 'none',
  )
  check(
    'Vary includes Accept (md)',
    (res.headers.get('vary') ?? '').toLowerCase().includes('accept'),
    res.headers.get('vary') ?? 'none',
  )
  check('markdown body is markdown', body.trimStart().startsWith('# '))
  check('markdown body carries services', body.includes('SEO & GEO'))
}

// 3 — markdown twin of a case page + a service page
{
  const { res, body } = await get('/fr/work/kermhosting', { accept: 'text/markdown' })
  check('case-page markdown 200', res.status === 200, `got ${res.status}`)
  check('case-page markdown has outcome', body.includes('## Le résultat'))
  const svc = await get('/en/services/seo-geo', { accept: 'text/markdown' })
  check('service-page markdown 200 (en)', svc.res.status === 200, `got ${svc.res.status}`)
}

// 4 — markdown 404 with recovery map
{
  const { res, body } = await get('/fr/nexiste-pas', { accept: 'text/markdown' })
  check('markdown 404 status', res.status === 404, `got ${res.status}`)
  check('markdown 404 recovery links', body.includes('llms.txt') && body.includes('# 404'))
}

// 5 — HTML responses carry Vary: Accept (CDN safety for the negotiation)
{
  const { res } = await get('/fr', { accept: 'text/html' })
  check(
    'Vary includes Accept (html)',
    (res.headers.get('vary') ?? '').toLowerCase().includes('accept'),
    res.headers.get('vary') ?? 'none',
  )
}

// 6 — privacy trust anchor + /privacy convention redirect
{
  const { res, body } = await get('/fr/confidentialite', { accept: 'text/html' })
  check('privacy page 200', res.status === 200, `got ${res.status}`)
  check('privacy content ≥ 500 chars', body.replace(/<[^>]+>/g, '').length >= 500)
  const redir = await get('/privacy', { accept: 'text/html' })
  check(
    '/privacy redirects to confidentialite',
    [301, 307, 308].includes(redir.res.status) &&
      (redir.res.headers.get('location') ?? '').includes('confidentialite'),
    `${redir.res.status} → ${redir.res.headers.get('location')}`,
  )
}

// 7 — Organization schema completeness
{
  const { body } = await get('/fr', { accept: 'text/html' })
  check('Organization contactPoint', body.includes('"contactPoint"'))
  check('contactPoint email present', body.includes('"contactType":"sales"'))
}

// 8 — llms.txt agent guidance
{
  const { res, body } = await get('/llms.txt')
  check('llms.txt 200', res.status === 200, `got ${res.status}`)
  check('llms.txt when-to-use section', body.includes('Quand faire appel'))
  check('llms.txt machine resources', body.includes('Ressources machine'))
  check('llms.txt markdown negotiation documented', body.includes('Accept: text/markdown'))
}

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail > 0 ? 1 : 0)
