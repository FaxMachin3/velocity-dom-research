import {signal,batch,root} from '../poc/reactivity.js';
import {keyed} from '../poc/dom.js';
import {shell,rowView,cellView} from '../poc/views.jsx';
export function mount(host, initial, dispatch) {
  let set, dispose;
  root(stop => {
    dispose=stop;
    const list=signal(initial.rows), text=signal(initial.text), count=signal(initial.rows.length);
    const selected=signal(initial.selected), choices=new Map();
    const node=shell(count,text,e=>dispatch('text',e.target.value));
    host.append(node);
    keyed(node.querySelector('tbody'),()=>list.get(),r=>r.id,r=>{
      const item=signal(r), choice=signal(r.id===selected.get()); choices.set(r.id,choice);
      return {item,node:rowView(item,choice,()=>dispatch('select',r.id))};
    },(entry,r)=>entry.item.set(r));
    let previousRows=initial.rows;
    const cells=initial.cells.map(v=>signal(v));
    node.querySelector('section').append(...cells.map(cellView));
    set=next=>batch(()=>{
      const old=selected.get(); selected.set(next.selected);
      choices.get(old)?.set(false); choices.get(next.selected)?.set(true);
      list.set(next.rows); count.set(next.rows.length); text.set(next.text);
      if(previousRows!==next.rows){const keep=new Set(next.rows.map(r=>r.id)); for(const id of choices.keys()) if(!keep.has(id)) choices.delete(id);previousRows=next.rows;}
      next.cells.forEach((v,i)=>cells[i].set(v));
    });
  });
  return {update:set, flush:()=>Promise.resolve(), destroy(){dispose();host.replaceChildren();}};
}
