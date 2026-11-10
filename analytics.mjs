// Count only a validated initial QR landing, once per document load.
// Separate event names make per-work event counts available without custom dimensions.
const MEASUREMENT_ID = "G-9NX6LZX47F";
let recorded = false;
export function recordQrOpen(id, mapping, landingUrl) {
  if (recorded || !Number.isSafeInteger(id) || id < 1 ||
      !Object.hasOwn(mapping.idToPage ?? {}, String(id))) return;
  recorded = true;
  try {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    gtag("event", `qr_open_id_${id}`, {
      send_to: MEASUREMENT_ID,
      qr_id: String(id),
      page_location: landingUrl,
      transport_type: "beacon",
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.append(script);
  } catch {
    // Analytics must never interrupt PDF reading, including when blocked.
  }
}
