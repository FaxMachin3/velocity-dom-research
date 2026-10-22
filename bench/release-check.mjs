// Validate the delivered example flows and every standalone report selector combination.
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {writeFile} from 'node:fs/promises';
import {launch} from './browser.mjs';
import {serve} from '../scripts/server.mjs';
const server=await serve(0),browser=await launch('chromium');
try {
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/examples.html`);
 const fields=page.locator('#host input');assert.equal(await fields.count(),50);
 await fields.nth(7).fill('retained user input');
 assert.equal(await page.locator('#host output').textContent(),'Edited Field 7');
 await page.evaluate(()=>{window.retainedExampleNode=document.querySelectorAll('#host input')[7];});
 await page.locator('#reverse').click();
 assert.equal(await fields.nth(42).inputValue(),'retained user input');
 assert.ok(await page.evaluate(()=>window.retainedExampleNode===document.querySelectorAll('#host input')[42]));
 await page.locator('#tree').click();assert.equal(await page.locator('#host output').count(),40);
 const first=await page.locator('#host section').first().textContent();
 await page.locator('#reverse').click();assert.equal(await page.locator('#host section').last().textContent(),first);
 await page.locator('#form').click();assert.equal(await fields.count(),50);assert.equal(await fields.nth(7).inputValue(),'');
 await page.goto(pathToFileURL(resolve('results/v04/report.html')).href);
 let reportViews=0;
 for(let batch=0;batch<4;batch++)for(const measure of ['layout','commit'])for(const stat of ['median','p95']){
  await page.selectOption('#batch',String(batch));await page.selectOption('#measure',measure);await page.selectOption('#stat',stat);
  assert.equal(await page.locator('#matrix tbody tr').count(),batch<2?3:20);
  assert.equal(await page.locator('#matrix thead th').count(),batch<2?5:batch===2?13:7);
  assert.ok(!/NaN|undefined/.test(await page.locator('#matrix').textContent()));reportViews++;
 }
 assert.equal(await page.locator('#apps tbody tr').count(),3);assert.deepEqual(errors,[]);
 const result={timestamp:new Date().toISOString(),browser:browser.version(),exampleFlows:'passed',reportViews,errors};
 await writeFile('results/v04/release-check.json',JSON.stringify(result,null,2));console.log(result);
} finally {await browser.close();await new Promise(r=>server.close(r));}
