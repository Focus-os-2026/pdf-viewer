# PDF Viewer — Final 53

Static PDF.js viewer for **https://focus-os-2026.github.io/pdf-viewer/**.
Existing `?id=` links are resolved using the supplied `mapping.json`; `?page=` remains supported. An ID takes precedence when both are present. Unknown IDs produce an error and never silently open a different work.

## Source and deployment

The supplied `pdf-viewer-final-53-ready.zip` contains the template, mapping and final PDF. The PDF and mapping are preserved byte-for-byte. PDF SHA-256: `3b0bf97ed14da10e0b00d08eee80cfd9893d34055987d3c0a79b167a25d370f4` (2,260,586 bytes, 53 pages).

`index.html`, `mapping.json`, `innovation-final.pdf` and `vendor/pdfjs/` are served directly by GitHub Pages. PDF.js 4.10.38 and its Apache-2.0 license are included locally; the active viewer makes no Cloud Run, Drive or third-party CDN requests. `index-cloud-run.html` and the older files remain available for rollback.

The viewer renders a single page, limits device pixel ratio to 2 and the canvas to 4 million pixels, supports horizontal scrolling when zoomed, cancels superseded renders and debounces resize. PDF loading uses range chunks where the server supports them. A fixed content revision enables caching without random cache-busting on each visit.

## Validation

- Require 53 unique IDs and a one-to-one mapping onto pages 1–53.
- Open every ID in Chromium desktop and mobile emulation, confirm the requested page renders nonblank, preserves the initial URL and stays within the pixel budget.
- Check navigation, page jumps, zoom, resize, legacy page links, invalid IDs and page limits.
- Run `python -m http.server 8765` here, then run `node tests/viewer.cjs` with Playwright installed. Set `CHROMIUM_PATH` and `TEST_URL` when needed. This is mobile emulation, not a test on physical iOS/Android devices.
- See `reports/` for detailed results.

## Supplied PDF QR finding — accepted by the user

All 53 embedded QR codes decode to the same Canva URL, `https://www.canvaqr.com/RGW79QqjiH`, which redirects to `https://focus-os-2026.github.io/pdf-viewer/?id=52`. Therefore the embedded QR destination agrees with the supplied per-page mapping only on page 30 (ID 52); the other 52 pages differ. This is a finding in the supplied PDF, not a change made by the viewer. The PDF, QR images, redirect configuration and original URLs have not been edited.

The user explicitly confirmed publication of the supplied PDF unchanged, retaining all embedded QR codes. This finding is recorded separately from viewer ID-routing checks; it is not counted as a successful QR-to-content match.

For later final exports, verify the mapping against the actual page order, update the PDF_URL content revision in index.html, and publish the PDF, viewer and mapping in the same commit. Prior production commit: `4dc0f14c1e755d4282930b792ff773fc479e8e44`.
