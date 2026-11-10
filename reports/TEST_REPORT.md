# Validation — Final PDF, 2026-11-10

## Supplied final

- File: `Infographic_1080x1920_7_รวม_32MB.pdf`.
- 31,464,258 bytes; 51 portrait pages; served exactly as supplied, without recompression or resampling.
- SHA-256: `f314ac32ccea2d93018bc810db99a7f46914867898c9362de934fbf104163ad3`.
- All 48 embedded QR codes match their existing work IDs and page positions.
- The existing archive remains unchanged (SHA-256 `45956dd887bac17c2d31b139105f3eb37ba0a0a47b2f0da18d7e61dacf399dfa`); all 5 embedded archive QR codes match their original IDs.
- The previously deployed main/archive routing is preserved: 48 IDs in the final, 5 IDs in the archive, and 3 current divider pages. No ID is reused or renumbered.

## Before publication

**112/112 entry checks PASS** across Chromium desktop and mobile emulation: 96 current-PDF ID entries, 10 archive-PDF ID entries, and 6 divider-page entries. Tests verify nonblank mapped pages, initial scroll alignment, original URL/ID preservation, correct document selection and page count, hidden tools, bounded canvases and the correct Full PDF target.

Native vertical touch, wheel scrolling, page/ID updates, archive scrolling, rapid jumps, eviction, constant document height, zoom/fit, fullscreen, rotation, first/last pages, ID precedence and error cases pass. Mobile emulation is not physical iOS/Android or native Safari testing.

## All stable IDs

| ID | Document | Page | Desktop | Mobile |
|---:|:---|---:|:---:|:---:|
| 1 | Final | 27 | PASS | PASS |
| 2 | Final | 18 | PASS | PASS |
| 3 | Final | 19 | PASS | PASS |
| 4 | Final | 20 | PASS | PASS |
| 5 | Final | 28 | PASS | PASS |
| 6 | Final | 29 | PASS | PASS |
| 7 | Final | 2 | PASS | PASS |
| 8 | Final | 30 | PASS | PASS |
| 12 | Final | 31 | PASS | PASS |
| 13 | Final | 21 | PASS | PASS |
| 14 | Final | 3 | PASS | PASS |
| 15 | Final | 4 | PASS | PASS |
| 16 | Final | 32 | PASS | PASS |
| 17 | Final | 5 | PASS | PASS |
| 18 | Final | 33 | PASS | PASS |
| 19 | Final | 6 | PASS | PASS |
| 20 | Final | 7 | PASS | PASS |
| 21 | Final | 22 | PASS | PASS |
| 22 | Final | 34 | PASS | PASS |
| 23 | Final | 8 | PASS | PASS |
| 26 | Final | 9 | PASS | PASS |
| 27 | Final | 35 | PASS | PASS |
| 30 | Final | 10 | PASS | PASS |
| 33 | Final | 36 | PASS | PASS |
| 42 | Final | 37 | PASS | PASS |
| 45 | Final | 38 | PASS | PASS |
| 49 | Final | 23 | PASS | PASS |
| 51 | Final | 24 | PASS | PASS |
| 52 | Final | 39 | PASS | PASS |
| 53 | Final | 40 | PASS | PASS |
| 54 | Final | 41 | PASS | PASS |
| 55 | Final | 42 | PASS | PASS |
| 56 | Final | 25 | PASS | PASS |
| 57 | Final | 43 | PASS | PASS |
| 58 | Final | 44 | PASS | PASS |
| 59 | Final | 45 | PASS | PASS |
| 60 | Final | 11 | PASS | PASS |
| 62 | Final | 46 | PASS | PASS |
| 68 | Final | 47 | PASS | PASS |
| 69 | Final | 12 | PASS | PASS |
| 70 | Final | 13 | PASS | PASS |
| 71 | Final | 14 | PASS | PASS |
| 72 | Final | 15 | PASS | PASS |
| 73 | Final | 16 | PASS | PASS |
| 74 | Final | 48 | PASS | PASS |
| 75 | Final | 49 | PASS | PASS |
| 76 | Final | 50 | PASS | PASS |
| 77 | Final | 51 | PASS | PASS |
| 25 | Archive | 1 | PASS | PASS |
| 61 | Archive | 2 | PASS | PASS |
| 64 | Archive | 3 | PASS | PASS |
| 65 | Archive | 4 | PASS | PASS |
| 66 | Archive | 5 | PASS | PASS |

Divider pages 1, 17 and 26 pass in both profiles.

## After publication

Production verification will be recorded after deployment.

[Browser results](browser-results.json) · [File and embedded QR evidence](pdf-checks.json) · [ID routes](id-crosswalk.json)
