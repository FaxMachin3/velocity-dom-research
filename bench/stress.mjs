import {launch} from './browser.mjs';
import {serve} from '../scripts/server.mjs';
import {writeFile} from 'node:fs/promises';
const server=await serve(0),browser=await launch('chromium'),results=[];
try{
 for(const variant of (process.env.STRESS_VARIANTS||'js,wasm,compiled').split(',')){
  const page=await browser.newPage();await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const report=await page.evaluate(async variant=>{
   const {mountJS,mountWasm}=await import('/testing.js'),mount=variant==='compiled'?(await import('/compiled-testing.js')).mount:variant==='js'?mountJS:mountWasm;
   const host=document.createElement('div');document.body.append(host);
   let state={rows:[],selected:-1,text:'',cells:Array.from({length:128},(_,i)=>i)};
   const app=mount(host,state,()=>{});let seed=811,nextId=1,checks=0;
   const rand=()=>seed=(Math.imul(seed,1664525)+1013904223)>>>0;
   const verify=(oldNodes)=>{
    const nodes=[...host.querySelectorAll('tbody tr')];if(nodes.length!==state.rows.length)throw Error('row count');
    nodes.forEach((node,i)=>{const r=state.rows[i];if(+node.dataset.id!==r.id||node.querySelector('button').textContent!==r.label||+node.children[2].textContent!==r.value||node.classList.contains('selected')!==(r.id===state.selected))throw Error('snapshot at '+i);if(oldNodes.has(r.id)&&oldNodes.get(r.id)!==node)throw Error('retained identity');});
    if(host.querySelector('output').textContent!==state.text)throw Error('escaping/text');checks++;
   };
   for(let round=0;round<600;round++){
    const oldNodes=new Map([...host.querySelectorAll('tr')].map(n=>[+n.dataset.id,n]));let rows=state.rows.slice();
    switch(rand()%8){
     case 0: for(let j=0,n=rand()%25;j<n;j++){const id=nextId++;rows.splice(rand()%(rows.length+1),0,{id,label:'<&😀'+id,value:id%17});}break;
     case 1: rows=rows.filter(()=>rand()%3!==0);break;
     case 2: rows.reverse();break;
     case 3: for(let i=rows.length-1;i>0;i--){const j=rand()%(i+1);[rows[i],rows[j]]=[rows[j],rows[i]];}break;
     case 4: rows=rows.map(r=>rand()%3?r:{...r,label:r.label+'!',value:r.value+1});break;
     case 5: rows=[];break;
     case 6: if(rows.length)state={...state,selected:rows[rand()%rows.length].id};break;
     case 7: state={...state,text:'<script>&😀'+round};break;
    }
    state={...state,rows};app.update(state);await app.flush();verify(oldNodes);
   }
   // Exercise the batch parser with empty labels, CR, markup and quotes.
   for(const count of [63,64,65,100])for(const nul of [false,true]){
    const labels=['',"<&>\"'",'line\rreturn','😀','<img src=x onerror=alert(1)>',nul?'\0':'normal'];
    state={...state,rows:Array.from({length:count},(_,i)=>({id:10000+i,label:labels[i%labels.length],value:i}))};app.update(state);verify(new Map());
    state={...state,rows:state.rows.map(r=>({...r,label:r.label+'updated'}))};app.update(state);verify(new Map());
   }
   // Keys at u32 boundaries and retained focused node through reorder.
   state={...state,rows:Array.from({length:1000},(_,i)=>({id:i,label:'row'+i,value:i})),selected:0};app.update(state);
   const focused=host.querySelector('tr[data-id="1"] button');focused.focus();
   const proto=Node.prototype,insert=proto.insertBefore;let moves=0;
   proto.insertBefore=function(...args){if(this.nodeName==='TBODY')moves++;return insert.apply(this,args);};
   const rows=state.rows.slice();[rows[1],rows[998]]=[rows[998],rows[1]];state={...state,rows};
   try{app.update(state);}finally{proto.insertBefore=insert;}
   if(moves!==2)throw Error('swap moved '+moves+' nodes; expected 2');
   if(document.activeElement!==focused)throw Error('focused retained button lost focus on swap');
   state={...state,rows:[{id:4294967295,label:'max',value:1},{id:0,label:'zero',value:0}]};app.update(state);verify(new Map());
   app.destroy();app.destroy();if(host.childElementCount)throw Error('destroy');
   for(let i=0;i<100;i++){const a=mount(host,state,()=>{});a.destroy();if(host.childElementCount)throw Error('remount');}
   host.remove();return {variant,randomizedUpdates:600,totalStateChecks:checks,swapMoves:moves,focus:true,remounts:100};
  },variant);
  results.push(report);console.log('Stress PASS',JSON.stringify(report));await page.close();
 }
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile('results/stress.json',JSON.stringify(results,null,2));}
