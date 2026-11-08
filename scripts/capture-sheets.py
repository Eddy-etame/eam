"""OLD | NEW contact sheets before new captures replace the files in
public/thumbs — every capture is eyeballed, none is copied blind. Desktop
sheets pair the current JPEG with the new one; phone sheets pair the current
twin with the new stitched twin (first screen on top, the walk below). Run
with -I.

usage: python -I scripts/capture-sheets.py <newJpegDir> <publicThumbs> <outDir>
"""
import os
import sys

from PIL import Image, ImageDraw

new, thumbs, out = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
slugs = sorted(f[:-4] for f in os.listdir(new) if f.endswith('.jpg') and not f.endswith('-m.jpg'))


def load(path, size):
    try:
        im = Image.open(path).convert('RGB')
    except Exception:
        im = Image.new('RGB', size, (40, 20, 20))
        ImageDraw.Draw(im).text((10, 10), 'missing', fill=(255, 120, 120))
        return im
    im.thumbnail(size)
    canvas = Image.new('RGB', size, (7, 13, 24))
    canvas.paste(im, (0, 0))
    return canvas


def sheet(kind, per_row, cell, rows_per_sheet, picker):
    n = per_row * rows_per_sheet
    for pi, chunk in enumerate(slugs[i:i + n] for i in range(0, len(slugs), n)):
        w = per_row * (cell[0] * 2 + 24) + 24
        h = rows_per_sheet * (cell[1] + 44) + 24
        board = Image.new('RGB', (w, h), (14, 20, 32))
        d = ImageDraw.Draw(board)
        for i, slug in enumerate(chunk):
            r, c = divmod(i, per_row)
            x = 24 + c * (cell[0] * 2 + 24)
            y = 24 + r * (cell[1] + 44)
            old, fresh = picker(slug)
            board.paste(load(old, cell), (x, y + 22))
            board.paste(load(fresh, cell), (x + cell[0] + 4, y + 22))
            d.text((x, y + 4), f'{slug}  OLD | NEW', fill=(201, 169, 110))
        p = os.path.join(out, f'sheet-{kind}-{pi + 1}.jpg')
        board.save(p, 'JPEG', quality=72)
        print('wrote', p, len(chunk))


sheet('desktop', 2, (560, 350), 4, lambda s: (os.path.join(thumbs, f'{s}.jpg'), os.path.join(new, f'{s}.jpg')))
sheet('phone', 4, (215, 1166), 1, lambda s: (os.path.join(thumbs, f'{s}-m.jpg'), os.path.join(new, f'{s}-m.jpg')))
