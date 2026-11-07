const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    ignoreHTTPSErrors: process.env.TEST_IGNORE_HTTPS_ERRORS === "1",
  });
  const p = await context.newPage(),
    errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  const base = process.env.TEST_URL || "http://127.0.0.1:8765/";
  const rendered = (n) =>
    p
      .locator(`canvas[data-page="${n}"]`)
      .waitFor({ state: "visible", timeout: 30000 });
  await p.goto(base + "?id=12");
  await rendered(9);
  assert(await p.locator("#tools").isHidden());
  assert.equal(await p.locator("#copy,header,.brand,.hint").count(), 0);
  await p.locator("#tool-toggle").click();
  await p.locator("#plus").click();
  await rendered(9);
  assert.equal(await p.locator("#zoom").textContent(), "115%");
  await p.locator("#fit").click();
  await rendered(9);
  assert(await p.locator("#tools").isHidden());
  if (await p.evaluate(() => document.fullscreenEnabled)) {
    await p.locator("#tool-toggle").click();
    await p.locator("#fullscreen").click();
    await p.waitForFunction(() => !!document.fullscreenElement);
    await p.locator("#tool-toggle").click();
    await p.locator("#fullscreen").click();
    await p.waitForFunction(() => !document.fullscreenElement);
    await rendered(9);
  }
  const cdp = await context.newCDPSession(p);
  const top = await p.locator("#paper").evaluate((e) => e.scrollTop);
  async function drag(from, to) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [from],
    });
    for (let i = 1; i <= 10; i++) {
      const point = {
        x: from.x + ((to.x - from.x) * i) / 10,
        y: from.y + ((to.y - from.y) * i) / 10,
      };
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [point],
      });
      await p.waitForTimeout(30);
    }
    await p.waitForTimeout(100);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  }
  await drag({ x: 330, y: 400 }, { x: 130, y: 400 });
  assert(
    Math.abs((await p.locator("#paper").evaluate((e) => e.scrollTop)) - top) <
      2,
  );
  assert.equal(await p.locator("#page").inputValue(), "9");
  await drag({ x: 195, y: 650 }, { x: 195, y: 100 });
  await p.waitForFunction(
    (start) => document.querySelector("#paper").scrollTop > start + 100,
    top,
  );
  assert(Number(await p.locator("#page").inputValue()) >= 10);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 195, y: 400 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  // Rapid scroll reversals cancel obsolete renders and release offscreen canvases.
  for (const n of [40, 3, 50, 1, 53]) {
    await p.locator("#paper").evaluate((e, n) => {
      e.scrollTop = document.querySelector(
        `.pdf-page[data-page="${n}"]`,
      ).offsetTop;
    }, n);
    await p.evaluate(() => new Promise(requestAnimationFrame));
  }
  await rendered(53);
  await p.waitForFunction(
    () => new URL(location.href).searchParams.get("id") === "77",
  );
  assert.equal(await p.locator('canvas[data-page="9"]').count(), 0);
  await p.keyboard.press("ArrowLeft");
  await rendered(52);
  const before = await p.locator("#paper").evaluate((e) => e.scrollTop);
  await p.keyboard.press("PageUp");
  await p.waitForFunction(
    (v) => document.querySelector("#paper").scrollTop < v,
    before,
  );
  await p.setViewportSize({ width: 844, height: 390 });
  await p.waitForFunction(() => {
    const n = document.querySelector("#page").value,
      c = document.querySelector(`canvas[data-page="${n}"]`),
      paper = document.querySelector("#paper");
    return (
      !!c &&
      !c.hidden &&
      c.getBoundingClientRect().width <= paper.clientWidth + 0.5 &&
      c.getBoundingClientRect().height <= paper.clientHeight + 0.5
    );
  });
  assert.deepEqual(errors, []);
  await p.route("**/mapping.json", (r) =>
    r.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ pageCount: 53, idToPage: { 1: 1, 2: 1 } }),
    }),
  );
  await p.goto(base + "?id=1");
  await p.locator("#status.error").waitFor();
  assert(await p.locator("#pages").isHidden());
  assert(await p.locator("#next").isDisabled());
  await p.unroute("**/mapping.json");
  await p.route("**/innovation-final.pdf*", (r) =>
    r.fulfill({ status: 404, body: "Missing" }),
  );
  await p.goto(base + "?id=1");
  await p.locator("#status.error").waitFor();
  assert(await p.locator("#pages").isHidden());
  console.log(
    "Native vertical touch, no horizontal page switching, rapid scrolling, zoom, fullscreen, rotation and errors: PASS",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
