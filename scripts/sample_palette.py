"""Sample the color palette from the portrait + logo PNGs.

Reads pixels only — writes nothing back to the assets. Run from anywhere:
    python -I scripts/sample_palette.py "assets/Curly-Haired Portrait in Green Light.png"
"""
import sys
import colorsys
from collections import Counter
from PIL import Image

def hexof(rgb):
    return "#%02x%02x%02x" % rgb[:3]

def describe(path, regions):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    print(f"\n== {path} ({w}x{h}) ==")
    for label, (x0, y0, x1, y1) in regions.items():
        crop = im.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
        small = crop.resize((48, 48))
        px = list(small.getdata())
        avg = tuple(sum(c[i] for c in px) // len(px) for i in range(3))
        # brightest pixel (max luminance) and most saturated green
        lum = lambda c: 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
        sat_green = max(px, key=lambda c: c[1] / (sum(c) + 1) * (c[1] > c[0] and c[1] > c[2]))
        bright = max(px, key=lum)
        dark = min(px, key=lum)
        print(f"  {label:22s} avg {hexof(avg)}  brightest {hexof(bright)}  max-green {hexof(sat_green)}  darkest {hexof(dark)}")

def top_colors(path, n=14, bucket=24):
    im = Image.open(path).convert("RGB")
    im.thumbnail((220, 220))
    q = im.quantize(colors=n, method=Image.MEDIANCUT).convert("RGB")
    counts = Counter(q.getdata())
    print(f"\n-- dominant colors in {path}:")
    for c, k in counts.most_common(n):
        hh, ss, vv = colorsys.rgb_to_hsv(*[x / 255 for x in c])
        print(f"  {hexof(c)}  {k*100//len(list(q.getdata())):>3}%  hue={hh*360:5.1f} sat={ss:4.2f} val={vv:4.2f}")

portrait = sys.argv[1]
logo = sys.argv[2]

describe(portrait, {
    "bg glow (left of face)": (0.02, 0.30, 0.22, 0.62),
    "bg top-right (vignette)": (0.70, 0.02, 0.98, 0.25),
    "bg bottom-left": (0.02, 0.78, 0.25, 0.98),
    "hair rim light": (0.30, 0.10, 0.55, 0.22),
    "shirt/shoulder": (0.20, 0.80, 0.70, 0.98),
    "face midtones": (0.42, 0.38, 0.60, 0.55),
})
top_colors(portrait)
top_colors(logo, n=10)
