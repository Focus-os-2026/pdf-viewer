# Thailand Innovation Showcase

Production: **https://focus-os-2026.github.io/pdf-viewer/**

## Current edition

The 51-page PDF supplied on 2026-11-09 is served byte-for-byte from GitHub Pages as `innovation-final.pdf`. It contains 48 works and three divider pages at pages 1, 17 and 26. Its SHA-256 is `c1b99ca34cfc2511d324d92824c8716d01e7fe4bf859e25dd9207ba5f3299d23`.

All 53 stable QR IDs still open their original works. `mapping.json` maps 48 IDs to the current PDF. IDs 25, 61, 64, 65 and 66 open the same works from the previous edition in `innovation-archive.pdf`. The archive is reached by ID and the main viewer opens the current edition by default. If both `id` and `page` are present, the ID takes precedence.

The viewer, PDFs, mapping and PDF.js are hosted on GitHub Pages. Publish the PDFs, mapping and cache revisions together.

## Reader and validation

Continuous vertical scrolling, 9:16 proportions, hidden icon tools and the Thailand Innovation Showcase tab title are retained. Nearby pages are painted on demand; distant canvases are released. Render tasks are serialized and retained canvases share an eight-million-pixel budget. HTTP Range loading and a fixed PDF revision support mobile opening.

See [validation results](reports/TEST_REPORT.md), [PDF comparisons](reports/pdf-checks.json) and [all ID mappings](reports/id-crosswalk.json). The linked reports document the previous 56-page edition. Mobile emulation is not a physical-device or native Safari test.

Serve this directory locally on port 8765 and run `node tests/viewer.cjs` and `node tests/interactions.cjs` with Playwright installed. Set `TEST_URL` and `CHROMIUM_PATH` as needed.

The previous 56-page production version is `613a8dd2211497b5ba42c7777625511caf2610ea`.
