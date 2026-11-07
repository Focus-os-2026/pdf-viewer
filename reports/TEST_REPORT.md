# Validation report — Final 53

Date: 2026-11-07 (Asia/Bangkok).

## Before publication

- All four supplied ZIP files inspected: index.html, mapping.json, innovation-final.pdf, README.txt.
- PDF: 53 pages, 2,260,586 bytes; PDF and mapping are byte-for-byte identical to the supplied originals.
- Mapping: 53 unique IDs, bijection onto pages 1–53.
- Chromium desktop (1440×900) and mobile emulation (390×844, DPR 3): all 53 IDs render the mapped page with nonblank canvas; 106/106 pass.
- Navigation, page jumps, boundary buttons, legacy `?page=`, ID precedence, unrelated query preservation, zoom and 320px layout pass.
- Invalid IDs and invalid/out-of-range page numbers show an error and do not render a fallback work.
- Copy link, synthetic touch swipe, keyboard arrows, rapid navigation, rotation, corrupt mapping and missing-PDF errors pass.
- All browser requests are to the viewer origin. One canvas, capped at 4 million pixels.
- Mobile emulation is not a physical iPhone/Android or native Safari test.

## Embedded QR finding

All 53 PDF QR images decode to `https://www.canvaqr.com/RGW79QqjiH`, redirecting to `https://focus-os-2026.github.io/pdf-viewer/?id=52`. This agrees with the supplied mapping only on page 30. The user explicitly confirmed publication of the supplied PDF unchanged and retention of all QR codes. This finding is not counted as a QR matching pass. No QR image, original URL or Canva redirect was changed.

## All 53 ID routing results

| ID | PDF page | Desktop | Mobile emulation |
|---:|---:|:---:|:---:|
| 1 | 1 | PASS | PASS |
| 2 | 2 | PASS | PASS |
| 3 | 3 | PASS | PASS |
| 4 | 4 | PASS | PASS |
| 5 | 5 | PASS | PASS |
| 6 | 6 | PASS | PASS |
| 7 | 7 | PASS | PASS |
| 8 | 8 | PASS | PASS |
| 12 | 9 | PASS | PASS |
| 13 | 10 | PASS | PASS |
| 14 | 11 | PASS | PASS |
| 15 | 12 | PASS | PASS |
| 16 | 13 | PASS | PASS |
| 17 | 14 | PASS | PASS |
| 18 | 15 | PASS | PASS |
| 19 | 16 | PASS | PASS |
| 20 | 17 | PASS | PASS |
| 21 | 18 | PASS | PASS |
| 22 | 19 | PASS | PASS |
| 23 | 20 | PASS | PASS |
| 25 | 21 | PASS | PASS |
| 26 | 22 | PASS | PASS |
| 27 | 23 | PASS | PASS |
| 30 | 24 | PASS | PASS |
| 33 | 25 | PASS | PASS |
| 42 | 26 | PASS | PASS |
| 45 | 27 | PASS | PASS |
| 49 | 28 | PASS | PASS |
| 51 | 29 | PASS | PASS |
| 52 | 30 | PASS | PASS |
| 53 | 31 | PASS | PASS |
| 54 | 32 | PASS | PASS |
| 55 | 33 | PASS | PASS |
| 56 | 34 | PASS | PASS |
| 57 | 35 | PASS | PASS |
| 58 | 36 | PASS | PASS |
| 59 | 37 | PASS | PASS |
| 60 | 38 | PASS | PASS |
| 61 | 39 | PASS | PASS |
| 62 | 40 | PASS | PASS |
| 64 | 41 | PASS | PASS |
| 65 | 42 | PASS | PASS |
| 66 | 43 | PASS | PASS |
| 68 | 44 | PASS | PASS |
| 69 | 45 | PASS | PASS |
| 70 | 46 | PASS | PASS |
| 71 | 47 | PASS | PASS |
| 72 | 48 | PASS | PASS |
| 73 | 49 | PASS | PASS |
| 74 | 50 | PASS | PASS |
| 75 | 51 | PASS | PASS |
| 76 | 52 | PASS | PASS |
| 77 | 53 | PASS | PASS |

Detailed data: [browser-results.json](browser-results.json), [pdf-checks.json](pdf-checks.json).

Live-site verification will be recorded after deployment.
