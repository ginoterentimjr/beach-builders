"""Teste automático das duas versões web. Uso: python3 test_sites.py site_v1 site_v2 campos.json pasta_screens"""
import asyncio, json, sys, urllib.parse
from playwright.async_api import async_playwright

V1, V2, CAMPOS, OUT = sys.argv[1:5]
F = json.load(open(CAMPOS))["fields"]


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        # ---------- v1: responde todos os desafios com as respostas certas ----------
        pg = await b.new_page(viewport={"width": 1280, "height": 900})
        errs, sent = [], []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        async def h(route):
            sent.append(urllib.parse.parse_qs(route.request.post_data or ""))
            await route.fulfill(status=200, body="ok")
        await pg.route("**/formResponse", h)
        await pg.goto(f"file://{V1}/index.html"); await pg.wait_for_timeout(400)
        await pg.locator("input.tx").first.fill("Isabel Teste")
        pages = sorted({f["p"] for f in F if f.get("g")})
        for pnum in pages:
            await pg.click(f"#dots button:nth-child({pnum})"); await pg.wait_for_timeout(150)
            ids = [i for i, f in enumerate(F) if f["p"] == pnum]
            cbs = [i for i in ids if F[i]["t"] == "cb"]
            for k, i in enumerate(cbs):
                if F[i].get("ok"):
                    await pg.locator(".cb").nth(k).click()
            await pg.click("#check"); await pg.wait_for_timeout(250)
            print("v1 página", pnum, "→", (await pg.inner_text("#result")).split("\n")[0])
        await pg.click(f"#dots button:nth-child({pages[0]})")
        await pg.screenshot(path=f"{OUT}/v1_desafio.png")
        print("v1 envios:", len(sent), "| erros JS:", errs)
        if sent: print("   exemplo:", {k: v[0][:90] for k, v in sent[0].items()})
        # ---------- v2: abre todas as salas, confere duas vezes ----------
        pg = await b.new_page(viewport={"width": 820, "height": 1180})
        errs2, sent2 = [], []
        pg.on("pageerror", lambda e: errs2.append(str(e)))
        async def h2(route):
            sent2.append(urllib.parse.parse_qs(route.request.post_data or ""))
            await route.fulfill(status=200, body="ok")
        await pg.route("**/formResponse", h2)
        await pg.goto(f"file://{V2}/index.html"); await pg.wait_for_timeout(400)
        await pg.fill("#nm", "Isabel Teste")
        await pg.screenshot(path=f"{OUT}/v2_home.png", full_page=True)
        n = await pg.locator(".stop").count()
        for i in range(n):
            await pg.locator(".stop").nth(i).click(); await pg.wait_for_timeout(200)
            # algumas interações genéricas: tocar a primeira opção de cada grupo, a primeira carta e a primeira caixa
            chips = pg.locator(".pic .chip, .tf .chip")
            if await chips.count(): await chips.nth(0).click()
            if await pg.locator("#pool .chip").count():
                await pg.locator("#pool .chip").nth(0).click(); await pg.locator(".bin h3").nth(0).click()
            if await pg.locator(".tiles .tile").count(): await pg.locator(".tiles .tile").nth(0).click()
            if await pg.locator(".bar div, .setg span").count(): await pg.locator(".bar div, .setg span").nth(0).click()
            if await pg.locator(".coins .coin").count(): await pg.locator(".coins .coin").nth(0).click()
            chk = pg.locator("button.orange")
            await chk.click(); await pg.wait_for_timeout(150); await chk.click(); await pg.wait_for_timeout(250)
            await pg.screenshot(path=f"{OUT}/v2_r{i + 1}.png", full_page=True)
            print("v2 sala", i + 1, "→", (await pg.inner_text(".feedback")).split("\n")[0][:80])
            await pg.locator("button.ghost").first.click(); await pg.wait_for_timeout(150)
        print("v2 envios:", len(sent2), "| erros JS:", errs2)
        if sent2: print("   exemplo:", {k: v[0][:90] for k, v in sent2[0].items()})
        await b.close()

asyncio.run(main())
