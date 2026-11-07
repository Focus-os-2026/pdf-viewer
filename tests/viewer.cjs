const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const assert = require("node:assert/strict");
const mapping = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../mapping.json")),
);
const base = process.env.TEST_URL || "http://127.0.0.1:8765/";
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const results = [];
  for (const profile of [
    {
      name: "desktop",
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    },
    {
      name: "mobile",
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    },
  ]) {
    const { name, ...options } = profile;
    const context = await browser.newContext({
      ...options,
      ignoreHTTPSErrors: process.env.TEST_IGNORE_HTTPS_ERRORS === "1",
    });
    const p = await context.newPage();
    const errors = [];
    const requests = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("request", (r) => requests.push(r.url()));
    async function tools() {
      if (await p.locator("#tools").isHidden())
        await p.locator("#tool-toggle").click();
    }
    async function fits() {
      await p.waitForFunction(() => {
        const c = document.querySelector("canvas"),
          paper = document.querySelector("#paper");
        if (c.hidden) return false;
        const a = c.getBoundingClientRect(),
          b = paper.getBoundingClientRect();
        return (
          a.left >= b.left - 0.5 &&
          a.top >= b.top - 0.5 &&
          a.right <= b.right + 0.5 &&
          a.bottom <= b.bottom + 0.5 &&
          Math.min(b.width - a.width, b.height - a.height) < 1
        );
      });
    }
    async function rendered(n) {
      await p
        .locator(`canvas[data-page="${n}"]`)
        .waitFor({ state: "visible", timeout: 30000 });
      assert.equal(await p.locator("#page").inputValue(), String(n));
      assert.equal(await p.locator("#total").textContent(), "53");
      const state = await p.locator("canvas").evaluate((c) => {
        const data = c
          .getContext("2d")
          .getImageData(0, 0, c.width, c.height).data;
        let ink = 0;
        for (let i = 0; i < data.length; i += 400)
          if (data[i] < 220 || data[i + 1] < 220 || data[i + 2] < 220) ink++;
        return { ink, pixels: c.width * c.height };
      });
      assert(state.ink > 30);
      assert(state.pixels <= 4000000);
    }
    for (const [id, n] of Object.entries(mapping.idToPage)) {
      const start = Date.now();
      await p.goto(base + "?id=" + id);
      await rendered(n);
      await fits();
      assert(await p.locator("#tools").isHidden());
      assert.equal(await p.locator("header,.brand,.hint,#copy").count(), 0);
      assert.equal((await p.locator("body").innerText()).trim(), "⋯");
      assert.equal(new URL(p.url()).searchParams.get("id"), id);
      results.push({
        profile: name,
        id,
        page: n,
        result: "PASS",
        elapsedMs: Date.now() - start,
      });
    }
    await p.goto(base + "?id=12&source=qr");
    await rendered(9);
    await tools();
    await p.locator("#next").click();
    await rendered(10);
    assert.equal(new URL(p.url()).searchParams.get("id"), "13");
    assert.equal(new URL(p.url()).searchParams.get("source"), "qr");
    await tools();
    await p.locator("#prev").click();
    await rendered(9);
    const width = await p
      .locator("canvas")
      .evaluate((c) => c.getBoundingClientRect().width);
    await tools();
    await p.locator("#plus").click();
    await p.waitForFunction(
      (w) => document.querySelector("canvas").getBoundingClientRect().width > w,
      width,
    );
    await rendered(9);
    assert.equal(await p.locator("#zoom").textContent(), "115%");
    await p.locator("#minus").click();
    await rendered(9);
    await p.locator("#page").fill("53");
    await p.locator("#page").press("Enter");
    await rendered(53);
    assert.equal(new URL(p.url()).searchParams.get("id"), "77");
    assert(await p.locator("#next").isDisabled());
    assert.match(await p.locator("#full").getAttribute("href"), /#page=53$/);
    await tools();
    await p.locator("#page").fill("1");
    await p.locator("#page").press("Enter");
    await rendered(1);
    assert(await p.locator("#prev").isDisabled());
    await p.goto(base + "?page=30");
    await rendered(30);
    assert.equal(new URL(p.url()).searchParams.get("page"), "30");
    for (const query of [
      "id=9",
      "id=999",
      "id=0",
      "id=abc",
      "id=",
      "page=54",
      "page=-1",
      "page=1.2",
    ]) {
      await p.goto(base + "?" + query);
      await p.locator("#status.error").waitFor({ timeout: 30000 });
      assert(await p.locator("canvas").isHidden());
      assert(await p.locator("#next").isDisabled());
      assert(await p.locator("#plus").isDisabled());
    }
    await p.goto(base + "?id=77&page=1");
    await rendered(53);
    await p.setViewportSize({ width: 320, height: 640 });
    await rendered(53);
    await fits();
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.deepEqual(errors, []);
    assert(requests.every((u) => u.startsWith(base)));
    await context.close();
    console.log(name + ": 53 ID renders and UI/error cases PASS");
  }
  fs.writeFileSync(
    path.join(__dirname, "../reports/browser-results.json"),
    JSON.stringify({ base, results, uiChecks: "PASS" }, null, 2),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
