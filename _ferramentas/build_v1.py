"""Gera a versão web 1 (páginas da aventura com toques) e o PDF preenchível a partir do PDF do deck e do campos.json.
Uso: python3 build_v1.py deck.pdf campos.json saida_site/ config.json saida_preenchivel.pdf
"""
import json
import os
import subprocess
import sys

import fitz  # PyMuPDF

deck, campos, outdir, cfgfile, fillable = sys.argv[1:6]
here = os.path.dirname(os.path.abspath(__file__))
cfg = json.load(open(cfgfile, encoding="utf-8"))
data = json.load(open(campos, encoding="utf-8"))

# 1. páginas em JPG
os.makedirs(os.path.join(outdir, "pages"), exist_ok=True)
subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=82", "-scale-to-x", "1600", "-scale-to-y", "-1", deck,
                os.path.join(outdir, "pages", "p")], check=True)
for f in os.listdir(os.path.join(outdir, "pages")):
    num = f.split("-")[-1].split(".")[0]
    os.rename(os.path.join(outdir, "pages", f), os.path.join(outdir, "pages", f"p-{int(num):02d}.jpg"))

# 2. página web
html = open(os.path.join(here, "app_v1.template.html"), encoding="utf-8").read()
for k, v in cfg["html"].items():
    html = html.replace(f"__{k}__", v)
html = html.replace("__CONFIG__", json.dumps(cfg["js"], ensure_ascii=False))
html = html.replace("__DATA__", json.dumps(data, ensure_ascii=False))
assert "__" not in html.replace("__proto__", ""), [l for l in html.splitlines() if "__" in l][:3]
open(os.path.join(outdir, "index.html"), "w", encoding="utf-8").write(html)

# 3. PDF preenchível
doc = fitz.open(deck)
W, H = data["W"], data["H"]
for i, f in enumerate(data["fields"]):
    page = doc[f["p"] - 1]
    sx, sy = page.rect.width / W, page.rect.height / H
    r = fitz.Rect(f["x"] * sx, f["y"] * sy, (f["x"] + f["w"]) * sx, (f["y"] + f["h"]) * sy)
    w = fitz.Widget()
    w.rect = r
    w.field_name = f"campo_{i}"
    if f["t"] == "cb":
        w.field_type = fitz.PDF_WIDGET_TYPE_CHECKBOX
        w.field_value = False
        w.text_color = (0.11, 0.37, 0.53)
    else:
        w.field_type = fitz.PDF_WIDGET_TYPE_TEXT
        w.text_fontsize = 0
        w.text_color = (0.11, 0.37, 0.53)
    page.add_widget(w)
doc.save(fillable, garbage=3, deflate=True)
print("site:", outdir, "· preenchível:", fillable, "· campos:", len(data["fields"]))
