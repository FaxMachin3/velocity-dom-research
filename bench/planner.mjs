import {launch} from './browser.mjs';
import {serve} from '../scripts/server.mjs';
import {writeFile,readFile} from 'node:fs/promises';
const server=await serve(0),browser=await launch('chromium');
try{
 const page=await browser.newPage();await page.goto(`http://127.0.0.1:${server.address().port}/`);
 const samples=await page.evaluate(async()=>{
  const factories=await import('/planners.js'),out=[];
  for(const n of [1000,10000,100000]){
   const old=Array.from({length:n},(_,id)=>({id})),next=old.filter(r=>r.id%3!==0).reverse().concat(Array.from({length:n/10},(_,i)=>({id:n+i})));
   const oracle=new Map(old.map((r,i)=>[r.id,i+1])),expected=next.map(r=>oracle.get(r.id)||0);
   const instances={js:factories.js(),wasm:factories.wasm()};
   for(let round=-5;round<25;round++)for(const name of round%2?['js','wasm']:['wasm','js']){
    const p=instances[name],iterations=n===100000?10:100;let result;
    const start=performance.now();for(let i=0;i<iterations;i++)result=p.plan(old,next);const ms=(performance.now()-start)/iterations;
    if(result.length!==expected.length||result.some((v,i)=>v!==expected[i]))throw Error('Planner mismatch');
    if(round>=0)out.push({name,n,round,iterations,ms});
   }
   for(const p of Object.values(instances))p.destroy();
  }
  return out;
 });
 await writeFile('results/planner.json',JSON.stringify({meta:{timestamp:new Date().toISOString(),browser:browser.version(),wasmBuild:JSON.parse(await readFile('generated/wasm-build.json')),description:'Whole planner call including JS-to-Wasm ID copying, reusable buffers, no DOM. Alternating order, 5 warmup/25 measured rounds.'},samples},null,2));
 console.log('Planner benchmark:',samples.length,'validated samples');
}finally{await browser.close();await new Promise(r=>server.close(r));}
