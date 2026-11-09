import * as pdfjsLib from "./vendor/pdfjs/pdf.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "./vendor/pdfjs/pdf.worker.min.mjs";
const $ = (s) => document.querySelector(s);
const paper = $("#paper"),
  pages = $("#pages"),
  status = $("#status");
const CURRENT_PDF = "./innovation-final.pdf?v=c1b99ca34cfc";
const ARCHIVE_PDF = "./innovation-archive.pdf?v=45956dd887ba";
let pdfUrl = CURRENT_PDF;
const GAP = 8,
  PIXEL_BUDGET = 8_000_000;
let doc,
  mapping,
  ready = false,
  current = 1,
  zoom = 1;
let nativeWidth = 255,
  nativeHeight = 453.75,
  pageWidth = 0,
  pageHeight = 0;
let revision = 0,
  wanted = new Set(),
  pumping = false,
  frame = 0,
  urlTimer,
  resizeTimer;
const sections = [],
  records = new Map();

function show(message, error = false) {
  status.textContent = error ? message : "";
  status.setAttribute("aria-label", message);
  status.classList.toggle("error", error);
  status.hidden = false;
}
function tools(open) {
  $("#tools").hidden = !open;
  $("#tool-toggle").setAttribute("aria-expanded", String(open));
  if (!open && $("#tools").contains(document.activeElement))
    $("#tool-toggle").focus({ preventScroll: true });
}
function controls() {
  for (const id of ["page", "minus", "plus", "fit"])
    $("#" + id).disabled = !ready;
  $("#page").value = current;
  $("#page").max = doc?.numPages ?? 1;
  $("#total").textContent = doc?.numPages ?? "…";
  $("#prev").disabled = !ready || current <= 1;
  $("#next").disabled = !ready || current >= doc.numPages;
  $("#zoom").textContent = Math.round(zoom * 100) + "%";
  $("#full").href = pdfUrl + "#page=" + current;
}
function setUrl() {
  clearTimeout(urlTimer);
  const url = new URL(location.href);
  const id = Object.entries(mapping.idToPage).find(
    ([, page]) => page === current,
  )?.[0];
  url.searchParams.delete("page");
  if (id) url.searchParams.set("id", id);
  else {
    url.searchParams.delete("id");
    url.searchParams.set("page", String(current));
  }
  history.replaceState(null, "", url);
}
function positiveInteger(value) {
  if (!/^\d+$/.test(String(value ?? ""))) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}
function resolvePage() {
  const params = new URLSearchParams(location.search);
  if (params.has("id")) {
    const id = positiveInteger(params.get("id"));
    if (id === null) throw Error("รหัสผลงานไม่ถูกต้อง");
    const page = mapping.idToPage[String(id)];
    if (!page) throw Error("ไม่พบผลงาน ID " + id + " ใน PDF ฉบับนี้");
    return page;
  }
  const page = params.has("page") ? positiveInteger(params.get("page")) : 1;
  if (!page || page > doc.numPages) throw Error("เลขหน้าไม่ถูกต้อง");
  return page;
}
function release(n, record) {
  record.task?.cancel();
  records.delete(n);
  record.canvas.remove();
  record.canvas.width = record.canvas.height = 0;
  sections[n - 1].removeAttribute("data-rendered");
  sections[n - 1].removeAttribute("data-loading");
  if (!record.task) record.page?.cleanup();
}
function layout(preservePosition = true) {
  if (!ready) return;
  const fraction =
    preservePosition && pageHeight
      ? (paper.scrollTop - sections[current - 1].offsetTop) / pageHeight
      : 0;
  revision++;
  for (const [n, record] of records) release(n, record);
  const scale =
    Math.min(
      paper.clientWidth / nativeWidth,
      paper.clientHeight / nativeHeight,
    ) * zoom;
  pageWidth = nativeWidth * scale;
  pageHeight = nativeHeight * scale;
  pages.style.width = Math.max(paper.clientWidth, pageWidth) + "px";
  // Let the last QR target align at the top even when zoomed out.
  pages.style.paddingBottom =
    Math.max(0, paper.clientHeight - pageHeight) + "px";
  for (const section of sections) {
    section.style.width = pageWidth + "px";
    section.style.height = pageHeight + "px";
  }
  paper.scrollTop = sections[current - 1].offsetTop + fraction * pageHeight;
  refresh();
}
function refresh() {
  if (!ready) return;
  const pitch = pageHeight + GAP;
  const marker = Math.min(paper.clientHeight * 0.35, pageHeight * 0.5);
  const active = Math.max(
    1,
    Math.min(doc.numPages, Math.floor((paper.scrollTop + marker) / pitch) + 1),
  );
  if (active !== current) {
    current = active;
    controls();
    clearTimeout(urlTimer);
    urlTimer = setTimeout(setUrl, 120);
  }
  const first = Math.max(1, Math.floor(paper.scrollTop / pitch));
  const last = Math.min(
    doc.numPages,
    Math.floor((paper.scrollTop + paper.clientHeight) / pitch) + 2,
  );
  wanted = new Set(
    Array.from({ length: last - first + 1 }, (_, i) => first + i),
  );
  for (const [n, record] of records) if (!wanted.has(n)) release(n, record);
  if (records.get(current)?.done) status.hidden = true;
  void pump();
}
function schedule() {
  if (!frame)
    frame = requestAnimationFrame(() => {
      frame = 0;
      refresh();
    });
}
async function pump() {
  if (pumping || !ready) return;
  pumping = true;
  try {
    while (ready) {
      const rank = (n) => {
        if (n === current) return 0;
        const top = (n - 1) * (pageHeight + GAP);
        const visible =
          top < paper.scrollTop + paper.clientHeight &&
          top + pageHeight > paper.scrollTop;
        return (visible ? 100 : 200) + Math.abs(n - current);
      };
      const n = [...wanted]
        .filter((n) => !records.has(n))
        .sort((a, b) => rank(a) - rank(b))[0];
      if (!n) break;
      const canvas = document.createElement("canvas");
      canvas.hidden = true;
      canvas.dataset.page = String(n);
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "หน้า " + n + " จาก " + doc.numPages);
      const record = { canvas, revision, task: null, page: null, done: false };
      records.set(n, record);
      sections[n - 1].append(canvas);
      sections[n - 1].setAttribute("data-loading", "");
      try {
        const page = (record.page = await doc.getPage(n));
        if (record.revision !== revision || records.get(n) !== record) continue;
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: pageWidth / base.width });
        // A fixed quota per layout bounds the sum of retained canvas pixels.
        const slots = Math.ceil(paper.clientHeight / (pageHeight + GAP)) + 3;
        const quota = Math.min(1_500_000, Math.floor(PIXEL_BUDGET / slots));
        const ratio = Math.min(
          devicePixelRatio || 1,
          2,
          Math.sqrt(quota / (viewport.width * viewport.height)),
        );
        canvas.width = Math.floor(viewport.width * ratio);
        canvas.height = Math.floor(viewport.height * ratio);
        canvas.style.width = pageWidth + "px";
        canvas.style.height = pageHeight + "px";
        record.task = page.render({
          canvasContext: canvas.getContext("2d", { alpha: false }),
          viewport,
          transform: ratio === 1 ? null : [ratio, 0, 0, ratio, 0, 0],
        });
        await record.task.promise;
        if (record.revision !== revision || records.get(n) !== record) continue;
        record.done = true;
        canvas.hidden = false;
        sections[n - 1].setAttribute("data-rendered", "");
        if (n === current) status.hidden = true;
      } catch (error) {
        if (error?.name !== "RenderingCancelledException") {
          console.error("Page render failed", n, error);
          if (records.get(n) === record && n === current)
            show("แสดงหน้าไม่สำเร็จ กรุณาโหลดหน้าเว็บใหม่", true);
        }
      } finally {
        sections[n - 1].removeAttribute("data-loading");
        record.task = null;
        if (records.get(n) !== record) record.page?.cleanup();
      }
    }
  } finally {
    pumping = false;
  }
}
function go(value) {
  if (!ready) return;
  clearTimeout(urlTimer);
  current = Math.max(1, Math.min(doc.numPages, Math.floor(Number(value) || 1)));
  controls();
  tools(false);
  paper.scrollTop = sections[current - 1].offsetTop;
  setUrl();
  refresh();
}
function changeZoom(value) {
  zoom = Math.max(0.5, Math.min(2.5, value));
  controls();
  layout();
}
async function start() {
  try {
    const response = await fetch("./mapping.json", { cache: "no-cache" });
    if (!response.ok) throw Error("โหลด Mapping ไม่สำเร็จ");
    const currentMapping = await response.json();
    const id = positiveInteger(new URLSearchParams(location.search).get("id"));
    if (currentMapping.archive?.idToPage[id]) {
      mapping = currentMapping.archive;
      pdfUrl = ARCHIVE_PDF;
    } else {
      mapping = currentMapping;
    }
    doc = await pdfjsLib.getDocument({
      url: pdfUrl,
      disableAutoFetch: true,
      disableStream: true,
      rangeChunkSize: 262144,
    }).promise;
    const entries = Object.entries(mapping.idToPage || {});
    const sectionPages = mapping.sectionPages ?? [];
    if (!Array.isArray(sectionPages)) throw Error("Mapping ไม่ตรงกับเอกสาร");
    const assignedPages = [...entries.map(([, p]) => p), ...sectionPages];
    if (
      mapping.pageCount !== doc.numPages ||
      entries.length === 0 ||
      assignedPages.length !== doc.numPages ||
      new Set(assignedPages).size !== doc.numPages ||
      sectionPages.some(
        (p) => !Number.isInteger(p) || p < 1 || p > doc.numPages,
      ) ||
      entries.some(
        ([id, p]) =>
          positiveInteger(id) === null ||
          String(Number(id)) !== id ||
          !Number.isInteger(p) ||
          p < 1 ||
          p > doc.numPages,
      )
    )
      throw Error("Mapping ไม่ตรงกับเอกสาร");
    current = resolvePage();
    const first = await doc.getPage(current);
    const base = first.getViewport({ scale: 1 });
    nativeWidth = base.width;
    nativeHeight = base.height;
    const fragment = document.createDocumentFragment();
    for (let n = 1; n <= doc.numPages; n++) {
      const section = document.createElement("section");
      section.className = "pdf-page";
      section.dataset.page = String(n);
      section.setAttribute("aria-label", "หน้า " + n);
      sections.push(section);
      fragment.append(section);
    }
    pages.replaceChildren(fragment);
    pages.hidden = false;
    ready = true;
    controls();
    layout(false);
  } catch (error) {
    console.error("PDF load failed", error);
    ready = false;
    pages.hidden = true;
    controls();
    show(
      /^[ก-๙]/.test(error?.message || "")
        ? error.message
        : "เปิดเอกสารไม่สำเร็จ กรุณาโหลดหน้าเว็บใหม่",
      true,
    );
  }
}
$("#prev").onclick = () => go(current - 1);
$("#next").onclick = () => go(current + 1);
$("#page").onchange = () => go($("#page").value);
$("#page").onkeydown = (e) => {
  if (e.key === "Enter") {
    go($("#page").value);
    $("#page").blur();
  }
};
$("#minus").onclick = () => changeZoom(Math.round((zoom - 0.15) * 100) / 100);
$("#plus").onclick = () => changeZoom(Math.round((zoom + 0.15) * 100) / 100);
$("#fit").onclick = () => {
  changeZoom(1);
  tools(false);
};
$("#tool-toggle").onclick = () => tools($("#tools").hidden);
$("#full").addEventListener("click", () => tools(false));
document.addEventListener("pointerdown", (e) => {
  if (!$("#tool-dock").contains(e.target)) tools(false);
});
// Native touch/wheel scrolling replaces horizontal swipe-to-change-page.
paper.addEventListener("scroll", schedule, { passive: true });
addEventListener("keydown", (e) => {
  if (e.key === "Escape") tools(false);
  if (
    e.target instanceof HTMLInputElement ||
    e.ctrlKey ||
    e.metaKey ||
    e.altKey
  )
    return;
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    go(current - 1);
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    go(current + 1);
  }
  const distance =
    e.key === "ArrowDown"
      ? 60
      : e.key === "ArrowUp"
        ? -60
        : e.key === "PageDown"
          ? paper.clientHeight * 0.85
          : e.key === "PageUp"
            ? -paper.clientHeight * 0.85
            : e.key === " "
              ? (e.shiftKey ? -1 : 1) * paper.clientHeight * 0.85
              : 0;
  if (distance) {
    e.preventDefault();
    paper.scrollBy({ top: distance, behavior: "auto" });
  }
});
$("#fullscreen").hidden = !document.fullscreenEnabled;
$("#fullscreen").onclick = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
    tools(false);
  } catch (error) {
    console.warn("Fullscreen unavailable", error);
  }
};
function resize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => layout(), 150);
}
new ResizeObserver(resize).observe(paper);
addEventListener("resize", resize);
document.addEventListener("fullscreenchange", resize);
controls();
start();
