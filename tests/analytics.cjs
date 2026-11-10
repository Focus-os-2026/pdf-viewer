const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'analytics.mjs'), 'utf8').replace('export function', 'function');
const mapping = JSON.parse(fs.readFileSync(path.join(root, 'mapping.json')));
function create(blocked = false) {
  const scripts = [];
  const context = vm.createContext({window: {}, document: {
    createElement: () => ({}), head: {append: script => {if(blocked) throw Error('blocked'); scripts.push(script);}}
  }});
  vm.runInContext(source, context);
  return {scripts, context, record: context.recordQrOpen};
}
let count = 0;
for (const map of [mapping, mapping.archive]) for (const raw of Object.keys(map.idToPage)) {
  const id = Number(raw), t = create();
  const url = `https://focus-os-2026.github.io/pdf-viewer/?id=${id}`;
  t.record(id, map, url);
  // A subsequent page selection must never create another QR-open event.
  t.record(Number(Object.keys(map.idToPage)[0]), map, url);
  const events = t.context.window.dataLayer.filter(x => x[0] === 'event');
  assert.equal(events.length, 1);
  assert.equal(events[0][1], `qr_open_id_${id}`);
  assert.equal(events[0][2].page_location, url);
  assert.equal(events[0][2].send_to, 'G-9NX6LZX47F');
  assert.equal(t.context.window.dataLayer[1][2].send_page_view, false);
  assert.equal(t.scripts.length, 1);
  assert.equal(t.scripts[0].async, true);
  count++;
}
for (const id of [null, undefined, 0, -1, 999, NaN, 1.5, '1']) {
  const t = create(); t.record(id, mapping, 'invalid');
  assert.equal(t.scripts.length, 0);
  assert.equal(t.context.window.dataLayer, undefined);
}
assert.doesNotThrow(() => create(true).record(1, mapping, 'blocked'));
console.log(`PASS: ${count} mapped IDs; exactly once; invalid/root/page-only excluded; analytics failure isolated.`);
