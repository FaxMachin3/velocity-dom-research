import {launch} from './browser.mjs';
import {serve} from '../scripts/server.mjs';
import {frameworks} from './config.mjs';
import {writeFile} from 'node:fs/promises';
const server=await serve(0),browser=await launch('chromium'),results=[];
try {
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/explorer.html`);
 for(const name of frameworks){
  await page.selectOption('#framework',name);
  const frame=await (await page.$('#fixture')).contentFrame();
  await frame.waitForURL(`**/${name}/`);await frame.waitForFunction(()=>window.ready);
  await page.locator('[data-action="create"][data-arg="1000"]').click();
  await frame.waitForFunction(()=>window.bench.snapshot().count===1000);
  await page.locator('[data-action="filter"]').click();
  await frame.waitForFunction(()=>window.bench.snapshot().count===500);
  await frame.getByLabel('Search').fill('explorer test');
  await frame.waitForFunction(()=>window.bench.snapshot().text==='explorer test');
  results.push({framework:name,status:'passed'});console.log('Explorer PASS',name);
 }
 if(errors.length)throw Error(errors.join('\n'));
 await writeFile('results/explorer-check.json',JSON.stringify({timestamp:new Date().toISOString(),results},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}
