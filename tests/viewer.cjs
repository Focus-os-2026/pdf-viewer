const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("fs"),
  path = require("path");
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
  await Promise.all(
    [
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
    ].map(async ({ name, ...options }) => {
      const context = await browser.newContext({
        ...options,
        ignoreHTTPSErrors: process.env.TEST_IGNORE_HTTPS_ERRORS === "1",
      });
      const p = await context.newPage(),
        errors = [],
        requests = [];
      p.on("pageerror", (e) => errors.push(e.message));
      p.on("request", (r) => requests.push(r.url()));
      async function tools() {
        if (await p.locator("#tools").isHidden())
          await p.locator("#tool-toggle").click();
      }
      async function rendered(n) {
        await p
          .locator(`canvas[data-page="${n}"]`)
          .waitFor({ state: "visible", timeout: 30000 });
        assert.equal(await p.locator("#page").inputValue(), String(n));
        const state = await p
          .locator(`canvas[data-page="${n}"]`)
          .evaluate((c) => {
            const pixels = c
              .getContext("2d")
              .getImageData(0, 0, c.width, c.height).data;
            let ink = 0;
            for (let i = 0; i < pixels.length; i += 400)
              if (pixels[i] < 220 || pixels[i + 1] < 220 || pixels[i + 2] < 220)
                ink++;
            const paper = document.querySelector("#paper"),
              section = document.querySelector(".pdf-page");
            return {
              ink,
              pixels: [...document.querySelectorAll("canvas")].reduce(
                (sum, c) => sum + c.width * c.height,
                0,
              ),
              canvases: document.querySelectorAll("canvas").length,
              slots:
                Math.ceil(
                  paper.clientHeight /
                    (section.getBoundingClientRect().height + 8),
                ) + 3,
            };
          });
        assert(state.ink > 30);
        assert(state.pixels <= 8000000);
        assert(state.canvases <= state.slots);
        assert.equal(await p.locator(".pdf-page").count(), 53);
      }
      for (const [id, page] of Object.entries(mapping.idToPage)) {
        const start = Date.now();
        await p.goto(base + "?id=" + id);
        await rendered(page);
        await p.waitForFunction(
          (n) =>
            Math.abs(
              document.querySelector("#paper").scrollTop -
                document.querySelector(`.pdf-page[data-page="${n}"]`).offsetTop,
            ) < 1.1,
          page,
        );
        assert.equal(new URL(p.url()).searchParams.get("id"), id);
        assert(await p.locator("#tools").isHidden());
        assert.equal(await p.locator("header,.brand,.hint,#copy").count(), 0);
        assert.equal((await p.locator("body").innerText()).trim(), "⋯");
        results.push({
          profile: name,
          id,
          page,
          result: "PASS",
          elapsedMs: Date.now() - start,
        });
        if (page % 10 === 0) console.log(name + ": " + page + "/53 IDs pass");
      }
      await p.goto(base + "?id=12&source=qr");
      await rendered(9);
      const height = await p.locator("#paper").evaluate((e) => e.scrollHeight);
      // Native wheel scroll crosses a page boundary without pressing Next.
      const pitch = await p
        .locator('.pdf-page[data-page="9"]')
        .evaluate((e) => e.getBoundingClientRect().height + 8);
      await p.mouse.move(190, 300);
      await p.mouse.wheel(0, pitch);
      await p.waitForFunction(
        () => document.querySelector("#page").value === "10",
      );
      await rendered(10);
      await p.waitForFunction(
        () => new URL(location.href).searchParams.get("id") === "13",
      );
      assert.equal(new URL(p.url()).searchParams.get("source"), "qr");
      await p
        .locator("#paper")
        .evaluate(
          (e) =>
            (e.scrollTop = document.querySelector(
              '.pdf-page[data-page="50"]',
            ).offsetTop),
        );
      await rendered(50);
      await p.waitForFunction(
        () => new URL(location.href).searchParams.get("id") === "74",
      );
      assert.equal(await p.locator('canvas[data-page="9"]').count(), 0);
      assert.equal(
        await p.locator("#paper").evaluate((e) => e.scrollHeight),
        height,
      );
      await tools();
      await p.locator("#prev").click();
      await rendered(49);
      await tools();
      const width = await p
        .locator('canvas[data-page="49"]')
        .evaluate((c) => c.getBoundingClientRect().width);
      await p.locator("#plus").click();
      await rendered(49);
      assert(
        (await p
          .locator('canvas[data-page="49"]')
          .evaluate((c) => c.getBoundingClientRect().width)) > width,
      );
      await p.locator("#fit").click();
      await rendered(49);
      assert(await p.locator("#tools").isHidden());
      await tools();
      await p.locator("#page").fill("53");
      await p.locator("#page").press("Enter");
      await rendered(53);
      assert.equal(new URL(p.url()).searchParams.get("id"), "77");
      assert(await p.locator("#next").isDisabled());
      assert.match(await p.locator("#full").getAttribute("href"), /#page=53$/);
      await p.setViewportSize({ width: 320, height: 640 });
      await p.waitForFunction(() => {
        const s = document.querySelector('.pdf-page[data-page="53"]'),
          p = document.querySelector("#paper");
        return (
          !!s.querySelector("canvas:not([hidden])") &&
          s.clientWidth <= p.clientWidth + 0.5
        );
      });
      await rendered(53);
      await tools();
      await p.locator("#page").fill("1");
      await p.locator("#page").press("Enter");
      await rendered(1);
      assert(await p.locator("#prev").isDisabled());
      await p.goto(base + "?page=30");
      await rendered(30);
      assert.equal(new URL(p.url()).searchParams.get("page"), "30");
      await p.goto(base + "?id=77&page=1");
      await rendered(53);
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
        await p.locator("#status.error").waitFor();
        assert(await p.locator("#pages").isHidden());
        assert(await p.locator("#next").isDisabled());
      }
      assert.deepEqual(errors, []);
      assert(requests.every((u) => u.startsWith(base)));
      await context.close();
      console.log(
        name +
          ": all 53 IDs, continuous scrolling, navigation, zoom and errors PASS",
      );
    }),
  );
  fs.writeFileSync(
    path.join(__dirname, "../reports/browser-results.json"),
    JSON.stringify(
      { base, mode: "continuous-vertical-scroll", results, uiChecks: "PASS" },
      null,
      2,
    ),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
