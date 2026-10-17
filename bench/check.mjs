import {launch} from './browser.mjs';
import {serve} from '../scripts/server.mjs';
import {frameworks,scenarios} from './config.mjs';
import {assertScenario,perform,expected} from './assert.mjs';
import {initial,reduce} from '../src/model.js';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const engine=process.env.BROWSER||'chromium';const server=await serve(0),port=server.address().port;
const browser=await launch(engine);const results=[];
try{
for(const f of frameworks){const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(`http://127.0.0.1:${port}/${f}/`);await page.waitForFunction(()=>window.ready);
 for(const s of scenarios){await page.evaluate(n=>window.bench.reset(n),s.initial);await perform(page,s);await assertScenario(page,s);}
 await page.evaluate(()=>window.bench.reset(1000));
 await page.evaluate(()=>{window.savedRow=document.querySelector('tr[data-id="2"]');window.savedButton=window.savedRow.querySelector('button');window.savedButton.focus();});
 await page.evaluate(()=>window.bench.act('swap'));
 assert.ok(await page.evaluate(()=>window.savedRow===document.querySelector('tr[data-id="2"]')),'keyed identity on reorder');
 await page.evaluate(()=>window.bench.act('update'));
 assert.ok(await page.evaluate(()=>window.savedRow===document.querySelector('tr[data-id="2"]')),'keyed identity on update');
 // Sequence catches stale selection, replacement, and disposal bugs.
 let state=initial(1000);
 await page.evaluate(()=>window.bench.reset(1000));
 for(const [action,arg] of [['select',2],['update'],['swap'],['remove',2],['clear'],['append',100],['select',1001],['tick'],['text','<unsafe>&value']]){
   state=reduce(state,action,arg);await page.evaluate(([a,v])=>window.bench.act(a,v),[action,arg]);assert.deepEqual(await page.evaluate(()=>window.bench.snapshot()),expected(state));
 }
 await page.evaluate(()=>window.bench.destroy());assert.equal(await page.locator('#app').evaluate(n=>n.childElementCount),0);
 for(let i=0;i<5;i++){await page.evaluate(()=>window.bench.reset(100));await page.evaluate(()=>window.bench.act('tick'));}
 assert.deepEqual(errors,[]);
 results.push({framework:f,bundleSha256:createHash('sha256').update(await readFile(`dist/${f}/app.js`)).digest('hex'),status:'passed',scenarios:scenarios.length,sequenceSteps:10,identity:true,disposal:true});console.log('PASS',f);
}catch(e){results.push({framework:f,status:'failed',error:e.stack});console.error('FAIL',f,e.message.slice(0,1000));}
await page.close();}
}finally{await browser.close();await new Promise(r=>server.close(r));await mkdir('results',{recursive:true});await writeFile(`results/correctness-${engine}.json`,JSON.stringify({engine,timestamp:new Date().toISOString(),results},null,2));}
if(results.some(r=>r.status==='failed'))process.exitCode=1;
