import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createPlanner} from '../src/planner/js.js';
const bytes=readFileSync('generated/planner.wasm');
function wasm(){const e=new WebAssembly.Instance(new WebAssembly.Module(bytes)).exports,h=e.planner_new();return {plan(a,b){assert.equal(e.planner_prepare(h,a.length,b.length),1);new Uint32Array(e.memory.buffer,e.planner_old(h),a.length).set(a.map(x=>x.id));new Uint32Array(e.memory.buffer,e.planner_next(h),b.length).set(b.map(x=>x.id));return new Uint32Array(e.memory.buffer,e.planner_run(h),b.length);},destroy(){e.planner_free(h);}};}
test('Rust/Wasm and JavaScript planner match independent Map oracle through resizing',()=>{
 for(const factory of [createPlanner,wasm]){const p=factory();let seed=17;const random=()=>seed=(Math.imul(seed,1664525)+1013904223)>>>0;
 for(let round=0;round<100;round++){const n=round*13,old=Array.from({length:n},(_,id)=>({id:id*1024}));if(n)old[0].id=4294967295;
 const next=old.filter(()=>random()%3).reverse().concat([{id:3},{id:7}]);const map=new Map(old.map((r,i)=>[r.id,i+1]));assert.deepEqual([...p.plan(old,next)],next.map(r=>map.get(r.id)||0));}
 assert.deepEqual([...p.plan([],[])],[]);p.destroy();}
});
