# PDF Viewer — Final 53

Production: **https://focus-os-2026.github.io/pdf-viewer/**

## Current document

Source: [ผลงานนวัตกรรม ววน.pdf](https://drive.google.com/file/d/1UticHdyn0h7Etq8Vnb6vosYxOI8tCRsC/view), supplied by the user for this update. It contains 53 portrait pages (9:16), with expanded product information.

The original is 49,463,778 bytes. The served PDF is 14,344,625 bytes, reduced by lossless object deduplication, PNG prediction filters and Flate/object-stream compression. No image resampling, lossy re-encoding, content editing or QR redrawing was performed. All 53 pages render pixel-for-pixel identically to the source at the verification resolution; extracted text, document links and bookmarks are preserved.

- Original SHA-256: `a488545f73a4615de2c2f0127440a1163aaf2ef120281f59006a3e00af19b865`
- Served SHA-256: `4295e6c74e8e8a533ad475b55dca62850e9ba71208b444902fb7cef1b4c5334b`

The order of all 53 works matches the previous final. The original `mapping.json` is unchanged. Existing `?id=` QR links keep the same ID-to-work relationship; `?page=` remains supported. An ID takes precedence when both are supplied. Unknown IDs show an error and never silently open another work.

## Hosting and mobile behavior

`index.html`, `mapping.json`, `innovation-final.pdf` and `vendor/pdfjs/` are served directly by GitHub Pages. The active viewer does not call Cloud Run, Drive or a third-party CDN. PDF.js 4.10.38 is vendored with its Apache-2.0 license.

The 53 portrait pages are stacked vertically for native continuous scrolling, with narrow page gaps and no scroll snapping. Each page retains its 9:16 proportions. Existing QR IDs open directly at the top of their mapped page; scrolling updates the page counter and stable-ID URL. Native vertical touch, wheel and keyboard scrolling replace horizontal swipe-to-change-page.

Branding, instructions and Copy Link remain removed. Controls stay behind a small ellipsis button, with page jumps, zoom, fit and fullscreen where supported.

Only pages in or near the viewport have canvases. Fixed-size page placeholders prevent jumps while canvases are created or discarded. Visible pages take priority over prefetching, only one render runs at a time, obsolete tasks are cancelled and distant canvas buffers/page resources are released. The layout assigns pixel quotas with a combined eight-million-pixel canvas budget and device pixel ratio capped at 2.

PDF loading uses HTTP Range requests. The PDF and original mapping are unchanged by the scrolling update. `viewer.mjs` has a content revision in its script URL for cache-safe updates.

## Validation and maintenance

See [reports/TEST_REPORT.md](reports/TEST_REPORT.md) for all 53 ID results and [reports/pdf-checks.json](reports/pdf-checks.json) for source comparisons.

For local tests, serve this directory on port 8765 and run `node tests/viewer.cjs` with Playwright installed. Set `TEST_URL` and `CHROMIUM_PATH` as needed. `tests/interactions.cjs` checks native vertical touch, absence of horizontal page switching, hidden tools, fit, fullscreen, keyboard, rapid scroll reversals and error paths. Mobile tests use Chromium emulation, not physical iPhone/Android devices or native Safari.

For later exports, verify page order, update `mapping.json` when necessary and update the `PDF_URL` content revision. Publish the PDF, mapping and viewer together. The prior production version is commit `e34baec8dc2031b2b45bb641af9202fdacf3855f`; older Cloud Run files remain for rollback.
