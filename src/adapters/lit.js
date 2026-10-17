import {html,render} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
export function mount(host,initial,dispatch){
function update(s){render(html`<main><p data-count>${s.rows.length}</p><label>Search<input aria-label="Search" .value=${s.text} @input=${e=>dispatch('text',e.target.value)}></label><output>${s.text}</output><section class="dashboard">${repeat(s.cells,(_,i)=>i,v=>html`<span class="cell">${v}</span>`)}</section><table><tbody>${repeat(s.rows,r=>r.id,r=>html`<tr data-id=${r.id} class=${r.id===s.selected?'selected':''}><td>${r.id}</td><td><button @click=${()=>dispatch('select',r.id)}>${r.label}</button></td><td>${r.value}</td></tr>`)}</tbody></table></main>`,host);}
update(initial);return {update,flush:()=>Promise.resolve(),destroy(){render(null,host);host.replaceChildren();}};}
