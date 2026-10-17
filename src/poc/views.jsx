import {bindText,bindProp,setProp,listen} from './dom.js';
export function shell(count,text,onInput) {
  return <main><p data-count="">{count.get()}</p><label>Search<input aria-label="Search" value={text.get()} onInput={onInput}/></label><output>{text.get()}</output><section className="dashboard"></section><table><tbody></tbody></table></main>;
}
export function rowView(item, selected, choose) {
  return <tr data-id={item.get().id} className={selected.get()?'selected':''}><td>{item.get().id}</td><td><button onClick={choose}>{item.get().label}</button></td><td>{item.get().value}</td></tr>;
}
export function cellView(value) {return <span className="cell">{value.get()}</span>;}
