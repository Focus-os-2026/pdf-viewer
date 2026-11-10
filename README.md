# Thailand Innovation Showcase

Production: **https://focus-os-2026.github.io/pdf-viewer/**

## Final supplied on 2026-11-10

The current PDF is the user's final `Infographic_1080x1920_7_รวม_32MB.pdf`, served byte-for-byte as `innovation-final.pdf` with no recompression, resampling or content changes.

- Size: 31,464,258 bytes.
- Pages: 51 (48 works and 3 category dividers at pages 1, 17 and 26).
- SHA-256: `f314ac32ccea2d93018bc810db99a7f46914867898c9362de934fbf104163ad3`.

All 48 embedded QR codes in this final were decoded and agree with the existing work IDs and current page mapping. The final's ordering matches the currently published 51-page mapping, so no work identities are renumbered.

## Existing QR links

All 53 original `?id=` links continue to open their works. As in the previous production version, IDs 25, 61, 64, 65 and 66 open the same five works from `innovation-archive.pdf`; that file is unchanged. The homepage and normal page navigation use the new 51-page final. IDs have priority over `?page=`.

Main-document QR checks: 48/48. Archive QR checks: 5/5. [Routing evidence](reports/id-crosswalk.json).

## Viewer and publication

Continuous vertical scrolling, 9:16 proportions, hidden tools and the Thailand Innovation Showcase tab title are retained. Canvases are virtualized with an eight-million-pixel budget. PDFs, PDF.js, mapping and viewer are loaded directly from GitHub Pages; Drive is not a runtime source.

The current PDF and viewer URLs use content revisions to avoid serving the previous final from cache. Future Drive updates still require a validated publication of the static website.

[Validation report](reports/TEST_REPORT.md) · [PDF/QR evidence](reports/pdf-checks.json).

Tests include all 53 IDs in both main/archive modes, the three divider routes, scrolling, zoom, fullscreen, rotation and errors. Mobile testing uses Chromium emulation, not physical iOS/Android devices or native Safari. Serve locally on port 8765 and run `node tests/viewer.cjs` and `node tests/interactions.cjs` with Playwright installed; use `TEST_URL`/`CHROMIUM_PATH` as needed.

Previous production commit: `959c0bfd8d4caaf4dca3e886742f13b0d048ab29`.
