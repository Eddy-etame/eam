"""Turn a sweep's PNGs (scripts/capture-sweep.mjs) into the house JPEGs:
<slug>.jpg from the desktop shot (2400 px wide, q82, progressive) and
<slug>-m.jpg stitched from the phone segments (860 px wide; each segment
pasted at twice its css scrollY, later segments over earlier ones; height
capped at 4660 = 2.5 screens, never below 1864). Writes into <outDir>;
nothing touches public/thumbs here — copying is a separate, eyeballed step
(scripts/capture-sheets.py draws the OLD | NEW sheets). Run with -I.

usage: python -I scripts/capture-convert.py <sweepDir> <outDir> [slug ...]
"""
import json
import os
import sys

from PIL import Image

sweep, out = sys.argv[1], sys.argv[2]
only = set(sys.argv[3:])
os.makedirs(out, exist_ok=True)
facts = json.load(open(os.path.join(sweep, 'facts.json'), encoding='utf-8'))
SCREEN2X = 1864
MAX2X = 4660
report = []

for slug, f in sorted(facts.items()):
    if only and slug not in only:
        continue
    if 'error' in f:
        report.append((slug, 'ERROR ' + f['error'][:60]))
        continue
    d = Image.open(os.path.join(sweep, f'{slug}.png')).convert('RGB')
    if d.size[0] != 2400:
        d = d.resize((2400, round(d.size[1] * 2400 / d.size[0])), Image.LANCZOS)
    d.save(os.path.join(out, f'{slug}.jpg'), 'JPEG', quality=82, progressive=True, optimize=True)
    segs = f.get('segments') or [{'file': f'{slug}-m.png', 'y': 0}]
    tiles = []
    for s in segs:
        p = os.path.join(sweep, s['file'])
        if not os.path.exists(p):
            continue
        im = Image.open(p).convert('RGB')
        if im.size[0] != 860:
            im = im.resize((860, round(im.size[1] * 860 / im.size[0])), Image.LANCZOS)
        tiles.append((s['y'] * 2, im))
    doc_h2x = int((f.get('phone') or {}).get('docH', 932)) * 2
    height = max(SCREEN2X, min(MAX2X, doc_h2x, max(y + im.size[1] for y, im in tiles)))
    canvas = Image.new('RGB', (860, height), (7, 13, 24))
    for y, im in tiles:
        canvas.paste(im, (0, y))
    canvas.save(os.path.join(out, f'{slug}-m.jpg'), 'JPEG', quality=80, progressive=True, optimize=True)
    report.append((slug, f'd 2400x{d.size[1]} · m 860x{height} ({len(tiles)} seg)'))

for slug, line in report:
    print(f'{slug:28} {line}')
print('converted', len(report))
