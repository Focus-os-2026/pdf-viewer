# Per-work QR opening counts

GA4 property measurement ID: `G-9NX6LZX47F`.

Each valid initial `?id=N` landing emits one event named `qr_open_id_N` after PDF setup succeeds. All 53 legacy IDs, including archived works, are supported. Reloads and shared-link openings count as another opening; these are not unique people or verified physical scans. No historical data can be recovered.

Scrolling, page navigation, zoom, URL replacement, plain root/page-only links and invalid IDs do not emit this event. Analytics loads asynchronously and failure/blocking cannot prevent PDF reading. Automatic initial page views and advertising signals are disabled by this integration. Use only `qr_open_id_` events for the requested counts, regardless of other GA4 automatic events.

## View counts

In Google Analytics, open Reports → Engagement → Events (or search for the Events report). Filter event names containing `qr_open_id_`. The Event count beside `qr_open_id_1` is the opening count for work ID 1, and so on. No custom dimension is required. If the Events report is absent from the traffic-focused navigation, open Explore → Free form, use Event name as rows and Event count as values, filtered to Event name begins with `qr_open_id_`.

Realtime can show recent events; standard reports can take 24–48 hours. Counts can be lower when visitors block analytics. GA4 property access is required to view reports. Measurement ID is public configuration, not an account credential.

## Validation

- `node tests/analytics.cjs`: all 53 mapped IDs; exactly one event; invalid/missing IDs excluded; asynchronous tag; failure isolation.
- `node tests/analytics-browser.cjs`: mobile current/archive PDF rendering, scrolling without duplicate event, invalid/page-only links excluded, blocked analytics does not break viewer.
- Browser QA intercepts Google Analytics requests to avoid inflating real production counts.
- The PDF files and mapping are unchanged.
