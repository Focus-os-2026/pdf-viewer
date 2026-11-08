# Validation — Category-sorted 56-page final

Date: 2026-11-08 (Asia/Bangkok). Source: [latest supplied Drive file](https://drive.google.com/file/d/1RQ41C80w-62om_GpyjUd1PksJesIP02y/view).

## Identity and file checks

- The latest Drive link and the earlier folder's current PDF are byte-identical (132,574,187 bytes).
- 56 portrait pages: the same 53 works, reordered, plus category dividers at pages 1, 18 and 27. Canva metadata confirms 56 pages.
- User decision: preserve all 53 existing IDs, following the same works after reordering. Do not renumber IDs to match physical pages.
- All 53 embedded QR codes decode to the original website URLs and match the remapped work/page. No QR or public URL was edited.
- ID 12's title, author, organization and embedded QR confirm the ginger beverage on page 32; its supplied description was updated, so matching is not based solely on unchanged body text.
- Lossless PDF size: 27,192,217 bytes, 79.5% smaller than the source.
- Every source/optimized page renders identically at scale 3 (216 DPI). Text, links and bookmarks match across all 56 pages.
- The stable-ID targets and explicit divider pages cover all 56 pages exactly, with no duplicate or missing page assignments.

## Before publication

**112/112 entry checks PASS**: 53 legacy ID routes plus 3 divider-page routes in each of desktop and mobile emulation. Tests check mapped-page alignment, nonblank rendering, original ID preservation, hidden tools, the 56-page count and bounded canvas allocation.

Native vertical touch, wheel scrolling across page boundaries, stable-ID URL updates, far jumps, offscreen eviction, constant scroll height, zoom, fit, fullscreen, rotation and invalid-ID/page error handling pass. Header text, instructions and Copy Link remain absent.

Mobile profiles are Chromium emulation, not physical iOS/Android or native Safari tests.

## Legacy ID crosswalk

| ID | Previous page | New page | Embedded QR | Desktop | Mobile |
|---:|---:|---:|:---:|:---:|:---:|
| 1 | 1 | 28 | PASS | PASS | PASS |
| 2 | 2 | 19 | PASS | PASS | PASS |
| 3 | 3 | 20 | PASS | PASS | PASS |
| 4 | 4 | 21 | PASS | PASS | PASS |
| 5 | 5 | 29 | PASS | PASS | PASS |
| 6 | 6 | 30 | PASS | PASS | PASS |
| 7 | 7 | 2 | PASS | PASS | PASS |
| 8 | 8 | 31 | PASS | PASS | PASS |
| 12 | 9 | 32 | PASS | PASS | PASS |
| 13 | 10 | 22 | PASS | PASS | PASS |
| 14 | 11 | 3 | PASS | PASS | PASS |
| 15 | 12 | 4 | PASS | PASS | PASS |
| 16 | 13 | 33 | PASS | PASS | PASS |
| 17 | 14 | 5 | PASS | PASS | PASS |
| 18 | 15 | 34 | PASS | PASS | PASS |
| 19 | 16 | 6 | PASS | PASS | PASS |
| 20 | 17 | 7 | PASS | PASS | PASS |
| 21 | 18 | 23 | PASS | PASS | PASS |
| 22 | 19 | 35 | PASS | PASS | PASS |
| 23 | 20 | 8 | PASS | PASS | PASS |
| 25 | 21 | 9 | PASS | PASS | PASS |
| 26 | 22 | 10 | PASS | PASS | PASS |
| 27 | 23 | 36 | PASS | PASS | PASS |
| 30 | 24 | 11 | PASS | PASS | PASS |
| 33 | 25 | 37 | PASS | PASS | PASS |
| 42 | 26 | 38 | PASS | PASS | PASS |
| 45 | 27 | 39 | PASS | PASS | PASS |
| 49 | 28 | 24 | PASS | PASS | PASS |
| 51 | 29 | 25 | PASS | PASS | PASS |
| 52 | 30 | 40 | PASS | PASS | PASS |
| 53 | 31 | 41 | PASS | PASS | PASS |
| 54 | 32 | 42 | PASS | PASS | PASS |
| 55 | 33 | 43 | PASS | PASS | PASS |
| 56 | 34 | 26 | PASS | PASS | PASS |
| 57 | 35 | 44 | PASS | PASS | PASS |
| 58 | 36 | 45 | PASS | PASS | PASS |
| 59 | 37 | 46 | PASS | PASS | PASS |
| 60 | 38 | 12 | PASS | PASS | PASS |
| 61 | 39 | 47 | PASS | PASS | PASS |
| 62 | 40 | 48 | PASS | PASS | PASS |
| 64 | 41 | 49 | PASS | PASS | PASS |
| 65 | 42 | 50 | PASS | PASS | PASS |
| 66 | 43 | 51 | PASS | PASS | PASS |
| 68 | 44 | 52 | PASS | PASS | PASS |
| 69 | 45 | 13 | PASS | PASS | PASS |
| 70 | 46 | 14 | PASS | PASS | PASS |
| 71 | 47 | 15 | PASS | PASS | PASS |
| 72 | 48 | 16 | PASS | PASS | PASS |
| 73 | 49 | 17 | PASS | PASS | PASS |
| 74 | 50 | 53 | PASS | PASS | PASS |
| 75 | 51 | 54 | PASS | PASS | PASS |
| 76 | 52 | 55 | PASS | PASS | PASS |
| 77 | 53 | 56 | PASS | PASS | PASS |

Divider pages 1, 18 and 27: PASS in both profiles.

## After publication

Runtime commit: `fa95030231c8decd55285e74f9a4d18f3a70339b`.

- GitHub Pages [deployment](https://github.com/Focus-os-2026/pdf-viewer/actions/runs/42451290157): success.
- Published HTML, reader module, 56-page PDF and remapped stable IDs match the tested files byte-for-byte.
- PDF HTTP Range: `206`, `Content-Range: bytes 0-1023/27192217`, 1,024 bytes returned.
- Live native touch, scrolling, zoom, fullscreen, rotation and error handling checks pass.
- Live desktop: **53/53 legacy IDs + 3/3 divider routes PASS**.
- Live mobile emulation: **53/53 legacy IDs + 3/3 divider routes PASS**.
- Live total: **112/112 entry checks PASS**, plus scrolling, zoom, page jumps, eviction, stable document height, first/last boundaries, ID precedence, invalid IDs and error cases.
- `?id=1` opens Young Rice Jelly on page 28; `?id=77` opens KORA on page 56. All original QR URLs retain their original work identities.

Managed Chromium uses `TEST_IGNORE_HTTPS_ERRORS=1` for the environment's TLS inspection. Independent HTTPS downloads use inherited CA trust with certificate verification enabled. Application TLS settings were not changed.

[Live HTTP checks](live-http-checks.json).

[Browser results](browser-results.json) · [Source PDF checks](pdf-checks.json) · [ID identity evidence](id-crosswalk.json)
