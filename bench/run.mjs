import {artifactHash} from '../scripts/artifact-hash.mjs';
import {launch} from './browser.mjs';
import {serve} from '../scripts/server.mjs';
import {frameworks,scenarios,shuffle} from './config.mjs';
import {assertScenario} from './assert.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import os from 'node:os';
import {createHash} from 'node:crypto';
const engine=process.env.BROWSER||'chromium', samples=Number(process.env.SAMPLES||15),warmups=Number(process.env.WARMUPS||3),cpuRate=Number(process.env.CPU_RATE||1);
const resultsDir=process.env.RESULTS_DIR||'results',seed=Number(process.env.SEED||1729);
const selected=process.env.FRAMEWORKS?process.env.FRAMEWORKS.split(','):frameworks;
for(const f of selected)if(!frameworks.includes(f))throw Error('Unknown framework '+f);
if(cpuRate!==1 && engine!=='chromium')throw Error('CPU throttling supported only for Chromium');
const correctness=JSON.parse(await readFile(`results/correctness-${engine}.json`,'utf8'));
for(const f of selected){const hash=await artifactHash(f);if(!correctness.results.some(r=>r.framework===f&&r.status==='passed'&&r.bundleSha256===hash))throw Error('Correctness gate missing or stale for '+f+'; run npm run check again');}
const server=await serve(0),port=server.address().port;
const browser=await launch(engine);
const pkg=JSON.parse(await readFile('package.json','utf8'));
const result={schemaVersion:1,meta:{timestamp:new Date().toISOString(),engine,browserVersion:browser.version(),samples,warmups,cpuRate,headless:true,serverlessChromium:process.env.SERVERLESS_CHROMIUM==='1',customExecutable:!!process.env.BROWSER_EXECUTABLE,viewport:{width:1280,height:900},platform:os.platform(),arch:os.arch(),cpu:os.cpus()[0]?.model,logicalCpus:os.cpus().length,node:process.version,dependencies:pkg.dependencies,seed,artifactHashes:Object.fromEntries(await Promise.all(selected.map(async f=>[f,await artifactHash(f)]))),notes:['Localhost, uncompressed delivery, no network throttling.','Commit+layout is forced-layout wall time; frame opportunity is a double-rAF proxy, not confirmed paint or INP.','Shared host and headless browser; exploratory, not product rankings.']},samples:[],startup:[],memory:[],animation:[],failures:[]};
const filename=`${resultsDir}/run-${engine}-cpu${cpuRate}.json`;
async function save(){await writeFile(filename,JSON.stringify(result,null,2));}
await mkdir(resultsDir,{recursive:true});
try{
 for(let round=-warmups;round<samples;round++){
  for(const f of shuffle(selected,seed+round+warmups)){
   const context=await browser.newContext({viewport:result.meta.viewport});const page=await context.newPage();const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
   if(cpuRate!==1){const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:cpuRate});}
   try{
    await page.goto(`http://127.0.0.1:${port}/${f}/`);await page.waitForFunction(()=>window.ready);
    const startup=await page.evaluate(()=>({readyMs:performance.now(),navigation:performance.getEntriesByType('navigation')[0].toJSON(),resources:performance.getEntriesByType('resource').map(e=>({name:new URL(e.name).pathname,encodedBodySize:e.encodedBodySize,decodedBodySize:e.decodedBodySize,duration:e.duration}))}));
    // Ready timestamp captured by the app, avoiding Playwright polling overhead.
    startup.readyMs=await page.evaluate(()=>window.readyAt);
    if(round>=0)result.startup.push({framework:f,round,...startup});
    for(const s of shuffle(scenarios,seed+97+round+warmups)){
     await page.evaluate(n=>window.bench.reset(n),s.initial);
     await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
     const timings=await page.evaluate(async s=>{
      const begin=performance.now();
      if(s.action==='input')await window.bench.input(s.arg);else if(s.action==='click')await window.bench.click(s.arg);else await window.bench.act(s.action,s.arg);
      const committed=performance.now();const height=document.getElementById('app').offsetHeight;const laidOut=performance.now();
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      return {commitMs:committed-begin,commitLayoutMs:laidOut-begin,frameOpportunityMs:performance.now()-begin,height};
     },s);
     await assertScenario(page,s);
     if(round>=0)result.samples.push({framework:f,scenario:s.name,round,...timings});
    }
    if(pageErrors.length)throw Error(pageErrors.join('\n'));
   }catch(e){result.failures.push({framework:f,round,error:e.stack});console.error('ERROR',f,round,e.message.slice(0,500));}
   finally{await context.close();}
  }
  console.log(`Round ${round<0?'warmup '+(round+warmups+1):round+1+'/'+samples}: ${result.samples.length} measured operations`);await save();
 }
 // One animation trace and one memory lifecycle trace per framework; exploratory only.
 for(const f of process.env.SKIP_TRACES==='1'?[]:selected){
  const context=await browser.newContext({viewport:result.meta.viewport});const page=await context.newPage();await page.goto(`http://127.0.0.1:${port}/${f}/`);await page.waitForFunction(()=>window.ready);
  let cdp;if(engine==='chromium'){cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');if(cpuRate!==1)await cdp.send('Emulation.setCPUThrottlingRate',{rate:cpuRate});}
  await page.evaluate(()=>window.bench.reset(1000));
  const animation=await page.evaluate(async()=>{const intervals=[],work=[];let last;for(let i=0;i<120;i++){const timestamp=await new Promise(requestAnimationFrame);if(last!==undefined)intervals.push(timestamp-last);last=timestamp;const t=performance.now();await window.bench.act('tick');document.getElementById('app').offsetHeight;work.push(performance.now()-t);}return {intervals,work};});
  result.animation.push({framework:f,...animation});
  if(cdp){
   await page.evaluate(()=>window.bench.reset(0));await cdp.send('HeapProfiler.collectGarbage');
   const metrics=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
   const before=await metrics();
   for(let i=0;i<20;i++){await page.evaluate(()=>window.bench.reset(1000));await page.evaluate(()=>window.bench.act('update'));await page.evaluate(()=>window.bench.act('clear'));}
   await page.evaluate(()=>window.bench.reset(0));await cdp.send('HeapProfiler.collectGarbage');const after=await metrics();
   result.memory.push({framework:f,cycles:20,before,after,heapDeltaBytes:after.JSHeapUsedSize-before.JSHeapUsedSize,note:'Single post-GC retained heap delta, not allocation rate or proof of a leak.'});
  }
  await context.close();await save();
 }
}finally{result.meta.completedAt=new Date().toISOString();await save();await browser.close();await new Promise(r=>server.close(r));}
console.log('Saved',filename);if(result.failures.length)process.exitCode=1;
