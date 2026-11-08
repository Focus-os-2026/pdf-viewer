# Thailand Innovation Showcase

Production: **https://focus-os-2026.github.io/pdf-viewer/**

## Current final: 56 pages sorted by category

Source: [ผลงานนวัตกรรม ววน.pdf](https://drive.google.com/file/d/1RQ41C80w-62om_GpyjUd1PksJesIP02y/view), supplied on 2026-11-08. This is byte-identical to the latest version in the previously supplied Drive folder.

The final contains 53 existing works and three category divider pages: page 1 (Preventive Health), page 18 (Medical Innovation) and page 27 (Wellness & Longevity). Canva metadata also confirms 56 pages. The supplied PDF remains the publication source; Canva has not been edited by this update.

## Stable QR identities

The user explicitly chose to retain the existing IDs and have QR codes follow their works. **An ID is not a PDF page number.** All 53 original IDs are preserved. `mapping.json` moves each to the new page. For example, `?id=1` opens Young Rice Jelly on page 28; `?id=12` opens the ginger beverage on page 32; `?id=77` opens KORA on page 56.

All 53 QR codes embedded in the new PDF were decoded and checked against this mapping. Every QR points to the same original ID for that work. No QR was redrawn, regenerated or redirected. [ID crosswalk](reports/id-crosswalk.json).

`sectionPages` explicitly declares the three divider pages without legacy IDs. They can be reached by scrolling or `?page=1`, `?page=18`, `?page=27`. The reader verifies that ID targets and section pages are disjoint and cover the PDF exactly. Unknown IDs show an error. If both parameters are supplied, `?id=` takes precedence.

## File quality and hosting

The source is 132,574,187 bytes; the served PDF is 27,192,217 bytes (79.5% smaller). Optimization uses lossless object deduplication, PNG prediction and Flate/object-stream compression. No image resampling or lossy re-encoding was performed. All 56 pages have pixel-identical renders at the validation resolution and identical extracted text, links and bookmarks.

- Source SHA-256: `e094e886cf987ad4bbe28727e37b8430f767f9660b726ffdc056a4eed1f5c6b1`
- Served SHA-256: `570141e033420ace3909f863d4dfe6d5cebf1c840e684fffa92fc0627aaed16e`

PDF, mapping, PDF.js and the reader are hosted directly on GitHub Pages. Reading does not call Drive, Cloud Run or an external CDN. **Replacing a file version in Drive does not automatically update this static website.** A publication must update the PDF, mapping and cache revision together after validation. Never replace the PDF alone when page order changes.

## Reader and validation

Continuous vertical scrolling, 9:16 proportions, hidden icon tools and the Thailand Innovation Showcase tab title are retained. Nearby pages are painted on demand; distant canvases are released. Render tasks are serialized and retained canvases share an eight-million-pixel budget. HTTP Range loading and a fixed PDF revision support mobile opening.

See [validation results](reports/TEST_REPORT.md), [PDF comparisons](reports/pdf-checks.json) and [all ID mappings](reports/id-crosswalk.json). Tests cover all 53 legacy IDs plus all three divider pages on desktop and Chromium mobile emulation. Mobile emulation is not a physical-device or native Safari test.

Serve this directory locally on port 8765 and run `node tests/viewer.cjs` and `node tests/interactions.cjs` with Playwright installed. Set `TEST_URL` and `CHROMIUM_PATH` as needed.

Rollback to the previous 53-page production version: `45e2ce25b8709d52cf4b79b4bf15362dc717e049`.
