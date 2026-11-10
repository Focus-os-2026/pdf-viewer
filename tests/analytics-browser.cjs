const {chromium} = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,ignoreHTTPSErrors:true});
 // All tests intercept analytics so QA does not inflate production counts.
 await context.route('https://www.googletagmanager.com/**', route=>route.abort());
 const page=await context.newPage();
 const base=process.env.TEST_URL || 'http://127.0.0.1:8771/';
 for(const id of [1,25]) {
  await page.goto(`${base}?id=${id}`);
  await page.waitForFunction(()=>document.querySelector('#pages canvas')?.width>0,{},{timeout:90000});
  await page.waitForFunction(()=>window.dataLayer?.some(x=>x[0]==='event'));
  const events=()=>page.evaluate(()=>window.dataLayer.filter(x=>x[0]==='event').map(x=>x[1]));
  assert.deepEqual(await events(),[`qr_open_id_${id}`]);
  await page.mouse.wheel(0,1800);
  await page.waitForTimeout(700);
  assert.deepEqual(await events(),[`qr_open_id_${id}`]);
  assert.equal(await page.locator('#pages').isVisible(),true);
 }
 for (const query of ['?page=2','?id=999']) {
  await page.goto(base+query);
  await page.waitForTimeout(1800);
  assert.equal(await page.evaluate(()=>window.dataLayer?.filter(x=>x[0]==='event').length||0),0);
 }
 await browser.close();
 console.log('PASS: mobile current/archive rendering; initial ID counted once; scroll excluded; page-only/invalid excluded; blocked analytics does not break viewer.');
})().catch(e=>{console.error(e);process.exit(1)});
