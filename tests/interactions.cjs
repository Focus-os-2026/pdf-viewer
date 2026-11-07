const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const context = await b.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    ignoreHTTPSErrors: process.env.TEST_IGNORE_HTTPS_ERRORS === "1",
  });
  const p = await context.newPage();
  let errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  const url = process.env.TEST_URL || "http://127.0.0.1:8765/";
  const wait = (n) =>
    p.locator(`canvas[data-page="${n}"]`).waitFor({ state: "visible" });
  await p.goto(url + "?id=12");
  await wait(9);
  assert.equal(await p.locator("#copy,header,.hint,.brand").count(), 0);
  assert(await p.locator("#tools").isHidden());
  await p.locator("#tool-toggle").click();
  assert(await p.locator("#tools").isVisible());
  await p.locator("#plus").click();
  await p.waitForFunction(
    () =>
      document.querySelector("#zoom").textContent === "115%" &&
      !document.querySelector("canvas").hidden,
  );
  await p.locator("#fit").click();
  await wait(9);
  assert.equal(await p.locator("#zoom").textContent(), "100%");
  assert(await p.locator("#tools").isHidden());
  if (await p.evaluate(() => document.fullscreenEnabled)) {
    await p.locator("#tool-toggle").click();
    await p.locator("#fullscreen").click();
    await p.waitForFunction(() => !!document.fullscreenElement);
    await p.locator("#tool-toggle").click();
    await p.locator("#fullscreen").click();
    await p.waitForFunction(() => !document.fullscreenElement);
  }
  await p.locator("#tool-toggle").click();
  await p.locator("canvas").click({ position: { x: 30, y: 30 } });
  assert(await p.locator("#tools").isHidden());
  await p.locator("canvas").evaluate((c) => {
    const touch = (x, y) =>
      new Touch({ identifier: 1, target: c, clientX: x, clientY: y });
    c.dispatchEvent(
      new TouchEvent("touchstart", { touches: [touch(300, 200)] }),
    );
    c.dispatchEvent(
      new TouchEvent("touchend", { changedTouches: [touch(100, 205)] }),
    );
  });
  await wait(10);
  await p.keyboard.press("ArrowRight");
  await wait(11);
  await p.evaluate(() => {
    for (let i = 0; i < 8; i++) document.querySelector("#next").click();
  });
  await wait(19);
  await p.setViewportSize({ width: 844, height: 390 });
  await wait(19);
  await p.waitForFunction(() => {
    const c = document.querySelector("canvas").getBoundingClientRect();
    return (
      !document.querySelector("canvas").hidden &&
      c.width <= innerWidth + 0.5 &&
      c.height <= innerHeight + 0.5
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
  await p.goto(url + "?id=1");
  await p.locator("#status.error").waitFor();
  assert(await p.locator("#next").isDisabled());
  await p.unroute("**/mapping.json");
  await p.route("**/innovation-final.pdf*", (r) =>
    r.fulfill({ status: 404, body: "Missing" }),
  );
  await p.goto(url + "?id=1");
  await p.locator("#status.error").waitFor();
  assert(await p.locator("canvas").isHidden());
  console.log(
    "Hidden tools, fit, fullscreen, swipe, keyboard, rotation and error handling: PASS",
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
