import {h,render} from 'preact';
import {useState} from 'preact/hooks';
import {memo} from 'preact/compat';
const Row=memo(function Row({row,selected,dispatch}) {return <tr data-id={row.id} className={selected?'selected':''}><td>{row.id}</td><td><button onClick={()=>dispatch('select',row.id)}>{row.label}</button></td><td>{row.value}</td></tr>;});
const Cell=memo(function Cell({value}){return <span className="cell">{value}</span>;});
export function mount(host,initial,dispatch){let set;
function App(){const [s,update]=useState(initial);set=update;return <main><p data-count="">{s.rows.length}</p><label>Search<input aria-label="Search" value={s.text} onInput={e=>dispatch('text',e.target.value)}/></label><output>{s.text}</output><section className="dashboard">{s.cells.map((v,i)=><Cell key={i} value={v}/>)}</section><table><tbody>{s.rows.map(r=><Row key={r.id} row={r} selected={r.id===s.selected} dispatch={dispatch}/>)}</tbody></table></main>;}
render(<App/>,host);return {update:s=>set(s),flush:async()=>{await Promise.resolve();await Promise.resolve();},destroy:()=>render(null,host)};}
