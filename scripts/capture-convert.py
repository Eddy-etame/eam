"""Turn a sweep's PNGs (scripts/capture-sweep.mjs) into the house JPEGs:
<slug>.jpg from the desktop shot (2400 px wide, q82, progressive) and
<slug>-m.jpg stitched from the phone segments (860 px wide; each segment
pasted at twice its css scrollY; where two segments overlap, the seam is cut
at the rows where they agree best, so a block that animates in time is taken
whole from one shot — a fixed cut through clubmma.fr's rotating offers mixed
two slides, 2026-11-08; height capped at 4660 = 2.5 screens, never below 1864). Writes into <outDir>;
nothing touches public/thumbs here — copying is a separate, eyeballed step
(scripts/capture-sheets.py draws the OLD | NEW sheets). Run with -I.

usage: python -I scripts/capture-convert.py <sweepDir> <outDir> [slug ...]
"""
import json
import os
import sys

from PIL import Image, ImageChops, ImageStat

sweep, out = sys.argv[1], sys.argv[2]
only = set(sys.argv[3:])
os.makedirs(out, exist_ok=True)
facts = json.load(open(os.path.join(sweep, 'facts.json'), encoding='utf-8'))
SCREEN2X = 1864
MAX2X = 4660
report = []
gaps = []
seams = []
QUIET = 2  # a row where the two shots differ by less than this agrees


def row_costs(a, b):
    """Per-row mean absolute difference between two equally sized bands."""
    d = ImageChops.difference(a.convert('L'), b.convert('L'))
    return list(d.resize((1, d.size[1]), Image.BOX).tobytes())


def best_cut(prev_y, prev_im, y, im):
    """Canvas row where the later segment takes over: the middle of the longest
    stretch of the overlap where the two shots agree — a boundary between
    blocks, not a line gap inside one (clubmma.fr's rotating offers were still
    split by a 12 px gap between their price and their text). Falls back to
    the quietest 12-row window, and to the overlap's top when nothing overlaps."""
    prev_bottom = prev_y + prev_im.size[1]
    bottom = min(prev_bottom, y + im.size[1])
    if bottom - y < 24:
        return y, None
    costs = row_costs(prev_im.crop((0, y - prev_y, 860, bottom - prev_y)), im.crop((0, 0, 860, bottom - y)))
    runs, start = [], None
    for i, c in enumerate(costs + [255]):
        if c <= QUIET and start is None:
            start = i
        if c > QUIET and start is not None:
            runs.append((i - start, start, i))
            start = None
    if runs:
        length, s, e = max(runs)
        # Inside that stretch, the flattest row: a faint tint step between two
        # shots hides in plain background, not across a photo (Portet, 2026-11-08).
        band = im.crop((0, s, 860, e)).convert('L')
        flat = min(range(e - s), key=lambda r: ImageStat.Stat(band.crop((0, r, 860, r + 1))).stddev[0])
        return y + s + flat, (f'flattest row of the longest quiet stretch ({length} px at +{s}, row +{s + flat})', bottom - y)
    best, best_cost = 0, None
    for r in range(0, len(costs) - 12 + 1):
        c = sum(costs[r:r + 12]) / 12
        if best_cost is None or c < best_cost - 1e-9:
            best, best_cost = r, c
    return y + best, (f'quietest window at +{best} (cost {best_cost:.1f}, nothing agrees)', bottom - y)

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
    # Coverage guard: a segment pasted below the previous one's bottom leaves a
    # band of canvas — a dark bar across the capture (2026-11-08: the walk landed
    # ~70 px low on Lenis sites). Such a stitch is refused, never shipped.
    covered = 0
    for y, im in tiles:
        if y > covered:
            gaps.append(f'{slug}: {y - covered} px uncovered at {covered}')
        covered = max(covered, y + im.size[1])
    canvas = Image.new('RGB', (860, height), (7, 13, 24))
    prev = None
    for y, im in tiles:
        cut = y
        if prev is not None:
            cut, info = best_cut(prev[0], prev[1], y, im)
            if info:
                seams.append(f'{slug}: seam at {cut} — {info[0]} of a {info[1]} px overlap')
        canvas.paste(im.crop((0, cut - y, 860, im.size[1])), (0, cut))
        prev = (y, im)
    canvas.save(os.path.join(out, f'{slug}-m.jpg'), 'JPEG', quality=80, progressive=True, optimize=True)
    report.append((slug, f'd 2400x{d.size[1]} · m 860x{height} ({len(tiles)} seg)'))

for slug, line in report:
    print(f'{slug:28} {line}')
for s in seams:
    print('  ' + s)
print('converted', len(report))
if gaps:
    print('UNCOVERED BANDS — reshoot these, the stitch is not shippable:')
    for g in gaps:
        print('  ' + g)
    sys.exit(1)
