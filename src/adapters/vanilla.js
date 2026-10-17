export function mount(host, initial, dispatch) {
  const main=document.createElement('main');
  main.innerHTML='<p data-count></p><label>Search<input aria-label="Search"></label><output></output><section class="dashboard"></section><table><tbody></tbody></table>';
  host.append(main);
  const count=main.querySelector('p'),input=main.querySelector('input'),output=main.querySelector('output'),body=main.querySelector('tbody');
  input.addEventListener('input',e=>dispatch('text',e.target.value));
  const cells=initial.cells.map(()=>{const n=document.createElement('span');n.className='cell';main.querySelector('section').append(n);return n;});
  const entries=new Map();
  let previous;
  function update(s) {
    if(previous?.rows!==s.rows) {
      const keep=new Set(s.rows.map(r=>r.id));
      for(const [id,e] of entries) if(!keep.has(id)){e.node.remove();entries.delete(id);}
      let cursor=body.firstChild;
      for(const r of s.rows) {
        let e=entries.get(r.id);
        if(!e) {
          const node=document.createElement('tr');node.dataset.id=r.id;
          const id=document.createElement('td'),label=document.createElement('td'),value=document.createElement('td'),button=document.createElement('button');
          id.textContent=r.id;label.append(button);node.append(id,label,value);
          button.addEventListener('click',()=>dispatch('select',r.id));
          e={node,button,value};entries.set(r.id,e);
        }
        if(e.row!==r){e.button.textContent=r.label;e.value.textContent=r.value;e.row=r;}
        e.node.className=r.id===s.selected?'selected':'';
        if(e.node!==cursor)body.insertBefore(e.node,cursor);
        cursor=e.node.nextSibling;
      }
      count.textContent=s.rows.length;
    } else if(previous?.selected!==s.selected) {
      entries.get(previous?.selected)?.node.classList.remove('selected');entries.get(s.selected)?.node.classList.add('selected');
    }
    if(input.value!==s.text)input.value=s.text;
    if(previous?.text!==s.text)output.textContent=s.text;
    s.cells.forEach((v,i)=>{if(previous?.cells[i]!==v)cells[i].textContent=v;});
    previous=s;
  }
  update(initial);
  return {update,flush:()=>Promise.resolve(),destroy(){entries.clear();host.replaceChildren();}};
}
