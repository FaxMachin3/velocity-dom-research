import {render} from 'solid-js/web';
import {For,batch} from 'solid-js';
import {createStore,reconcile} from 'solid-js/store';
export function mount(host,initial,dispatch){const [s,set]=createStore(initial);
const dispose=render(()=><main><p data-count="">{s.rows.length}</p><label>Search<input aria-label="Search" value={s.text} onInput={e=>dispatch('text',e.target.value)}/></label><output>{s.text}</output><section class="dashboard"><For each={Array.from({length:initial.cells.length},(_,i)=>i)}>{i=><span class="cell">{s.cells[i]}</span>}</For></section><table><tbody><For each={s.rows}>{r=><tr data-id={r.id} class={r.id===s.selected?'selected':''}><td>{r.id}</td><td><button onClick={()=>dispatch('select',r.id)}>{r.label}</button></td><td>{r.value}</td></tr>}</For></tbody></table></main>,host);
return {update:next=>batch(()=>set(reconcile(next,{key:'id'}))),flush:()=>Promise.resolve(),destroy:dispose};}
