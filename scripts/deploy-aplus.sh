#!/usr/bin/env bash
# A+ DEPLOY RITUAL — the ONLY way the hash-locked CSP reaches production.
# Run from Windows:  npm run deploy:aplus   (wraps this via WSL)
#
# Why WSL: `vercel build` is broken on Windows for i18n routes ("Unable to
# find lambda for route: /en/..." — vercel/vercel#10665), and server-side
# builds (`npx vercel --prod`) NEVER carry the per-route CSPs. Only a Linux
# prebuilt — hashes computed on the exact artifacts shipped — earns the A+.
# Verified live 2026-07-29: securityheaders.com grade A+ with this chain.
set -euo pipefail

export PATH=/root/node24/bin:$PATH
command -v node >/dev/null || { echo "Node missing in WSL — install nodejs.org linux-x64 into /root/node24"; exit 1; }

SRC="/mnt/c/Users/Mommy Jayce/Desktop/EAM/eam-portfolio"
DST=/root/eam
mkdir -p "$DST"
rsync -a --delete --exclude node_modules --exclude .next --exclude .vercel/cache --exclude .research "$SRC/" "$DST/"
cd "$DST"
[ -d node_modules ] || npm ci --no-audit --no-fund
npm ci --no-audit --no-fund >/dev/null 2>&1 || true

TOKEN=$(node -e '
const fs = require("fs");
const paths = [
  "/mnt/c/Users/Mommy Jayce/AppData/Roaming/xdg.data/com.vercel.cli/auth.json",
  "/mnt/c/Users/Mommy Jayce/AppData/Roaming/com.vercel.cli/Data/auth.json",
];
for (const p of paths) {
  try { const t = JSON.parse(fs.readFileSync(p, "utf8")).token; if (t) { console.log(t); process.exit(0); } } catch {}
}
console.error("No Vercel token found — log in with `npx vercel login` on Windows first.");
process.exit(1)
')

echo "=== vercel build (Linux) ==="
npx -y vercel build --prod --yes --token "$TOKEN"
echo "=== inject hash-locked CSPs ==="
node scripts/vercel-output-harden.mjs
echo "=== deploy prebuilt ==="
npx -y vercel deploy --prebuilt --prod --token "$TOKEN"
echo "=== done — rescan https://securityheaders.com/?q=https://eam-agency.vercel.app/fr ==="
