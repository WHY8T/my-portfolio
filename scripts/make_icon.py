"""Make app/icon.png — a square favicon crop from the logo wordmark.

Crops the "f" + word area, pads to square on the page's near-black green,
and writes a 512x512 PNG. Run from the project root:
    python -I scripts/make_icon.py
"""
from PIL import Image

SRC = "public/assets/portfolio-logo.png"
OUT = "app/icon.png"
BG = (2, 13, 5, 255)  # --bg #020d05

im = Image.open(SRC).convert("RGBA")
w, h = im.size

# the wordmark band sits in the vertical middle ~55% of the canvas
crop = im.crop((0, int(h * 0.22), w, int(h * 0.78)))

# pad to square on brand background
side = max(crop.size)
sq = Image.new("RGBA", (side, side), BG)
sq.paste(crop, ((side - crop.width) // 2, (side - crop.height) // 2), crop)

sq.resize((512, 512), Image.LANCZOS).save(OUT, "PNG")
print("wrote", OUT)
