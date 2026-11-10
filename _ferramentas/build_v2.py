"""Gera a versão web 2 (jogos) a partir de um config JSON. Uso: python3 build_v2.py config.json pasta_assets saida/"""
import json, os, re, sys
from PIL import Image
cfgf, assets, out = sys.argv[1:4]
here = os.path.dirname(os.path.abspath(__file__))
cfg = json.load(open(cfgf, encoding="utf-8"))
html = open(os.path.join(here, "app_v2.template.html"), encoding="utf-8").read()
for k, v in cfg["html"].items():
    html = html.replace(f"__{k}__", v)
html = html.replace("__CONFIG__", json.dumps(cfg["js"], ensure_ascii=False))
left = re.findall(r"__[A-Z0-9]+__", html)
assert not left, left
os.makedirs(os.path.join(out, "img"), exist_ok=True)
open(os.path.join(out, "index.html"), "w", encoding="utf-8").write(html)
js = json.dumps(cfg["js"], ensure_ascii=False)
names = set()
for r in cfg["js"]["ROUNDS"]:
    names.update([r.get("pic"), r.get("guide")])
    for it in r.get("items", []):
        if len(it) > 2 and it[2]: names.add(it[2])
    for p in r.get("pics", []):
        if p[0]: names.add(p[0])
for t in cfg["js"].get("TEAM", []) + cfg["js"].get("CERTTEAM", []):
    names.add(t[0])
names.discard(None)
for n in sorted(names):
    src = os.path.join(assets, n + ".png")
    if not os.path.exists(src):
        print("FALTA:", n); continue
    im = Image.open(src); im.thumbnail((280, 280)); im.save(os.path.join(out, "img", n + ".png"), optimize=True)
print("v2:", out, "imagens:", len(names))
