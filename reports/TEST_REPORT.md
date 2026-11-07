# Validation report — Updated Drive PDF

Source: [ผลงานนวัตกรรม ววน.pdf](https://drive.google.com/file/d/1UticHdyn0h7Etq8Vnb6vosYxOI8tCRsC/view).

## PDF and stable mapping

- 53 portrait pages (9:16). All 53 works remain in the original order; `mapping.json` is unchanged.
- Original size: 49,463,778 bytes. Losslessly optimized size: 14,344,625 bytes (71.0% reduction).
- Every source page and served page has identical rendered pixels at scale 3 (216 DPI) and identical extracted text.
- Links and bookmarks are preserved. No images were resampled or re-encoded lossily; no QR was redrawn or redirected.
- All 53 pages were scanned for decodable QR codes; results are recorded per page in `pdf-checks.json`. This is a record of the supplied document, not a replacement QR set.
- Served PDF SHA-256: `4295e6c74e8e8a533ad475b55dca62850e9ba71208b444902fb7cef1b4c5334b`.

## Full-viewport interface

- No visible website heading, instructions, Copy Link or Full PDF text button.
- One small ellipsis toggle; controls are hidden on first load and after page navigation.
- Artwork fits entirely within the available viewport, centered without cropping or distortion. The layout uses dynamic viewport height and safe-area insets.
- Icon controls retain accessible labels. Fit-to-screen, zoom and supported browser fullscreen are available in the popup.
- All 53 IDs in both desktop/mobile profiles pass whole-page fit and hidden-controls checks: no cropping, no header/instructions/Copy Link and no page overflow.
- Hidden tools, fit, fullscreen entry/exit, touch swipes, keyboard, rotation and error handling pass.

## Before publication

Chromium desktop (1440×900) and mobile emulation (390×844, DPR 3): **106/106 ID renders pass**, with 53/53 in each profile. Tests confirm the mapped page renders nonblank, retains the initial ID and stays within the canvas memory budget. Navigation, page jumps, zoom, first/last boundaries, legacy page links, invalid IDs, ID precedence and 320px layout pass. All requests stay on the viewer origin.

Mobile emulation is not a physical-device or native Safari test.

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

## After publication

Production verification will be appended after the new PDF is deployed.

[Detailed browser results](browser-results.json) · [Source PDF checks](pdf-checks.json)
