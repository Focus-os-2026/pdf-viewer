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
    permissions: ["clipboard-read", "clipboard-write"],
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
  await p.locator("#copy").click();
  assert.equal(
    await p.evaluate(() => navigator.clipboard.readText()),
    url + "?id=12",
  );
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
    "Copy, swipe, keyboard, rapid navigation, rotation, corrupt mapping and missing PDF: PASS",
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
