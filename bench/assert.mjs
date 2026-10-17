import assert from 'node:assert/strict';
import {initial,reduce} from '../src/model.js';
export function expected(state){return {rows:state.rows.map(r=>({...r,selected:r.id===state.selected})),text:state.text,input:state.text,cells:state.cells,count:state.rows.length};}
export function nextState(state,scenario){return reduce(state,scenario.action==='input'?'text':scenario.action==='click'?'select':scenario.action,scenario.arg);}
export async function assertScenario(page,scenario){const got=await page.evaluate(()=>window.bench.snapshot());assert.deepEqual(got,expected(nextState(initial(scenario.initial),scenario)),scenario.name);}
export async function perform(page,s){return page.evaluate(async s=>{if(s.action==='input')await window.bench.input(s.arg);else if(s.action==='click')await window.bench.click(s.arg);else await window.bench.act(s.action,s.arg);},s);}
