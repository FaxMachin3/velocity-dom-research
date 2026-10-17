// Both experimental adapters share this exact renderer and template cloning.
export function mountWithPlanner(createPlanner,host,initial,dispatch){
 const planner=createPlanner(),main=document.createElement('main');
 main.innerHTML='<p data-count></p><label>Search<input aria-label="Search"></label><output></output><section class="dashboard"></section><table><tbody></tbody></table>';
 const template=document.createElement('template');template.innerHTML='<tr><td></td><td><button></button></td><td></td></tr>';
 host.append(main);
 const count=main.querySelector('p'),input=main.querySelector('input'),output=main.querySelector('output'),body=main.querySelector('tbody');
 const cells=initial.cells.map(()=>{const n=document.createElement('span');n.className='cell';main.querySelector('section').append(n);return n;});
 const onInput=e=>dispatch('text',e.target.value);
 const onClick=e=>{const button=e.target.closest('button');if(button&&body.contains(button))dispatch('select',Number(button.closest('tr').dataset.id));};
 input.addEventListener('input',onInput);body.addEventListener('click',onClick);
 let previous,entries=[],byId=new Map();
 function update(s){
  if(previous?.rows!==s.rows){
   const matches=planner.plan(previous?.rows||[],s.rows),used=new Uint8Array(entries.length),next=new Array(s.rows.length);
   for(let i=0;i<matches.length;i++)if(matches[i])used[matches[i]-1]=1;
   for(let i=0;i<entries.length;i++)if(!used[i]){entries[i].node.remove();byId.delete(entries[i].row.id);}
   let cursor=body.firstChild;
   for(let i=0;i<s.rows.length;i++){
    const r=s.rows[i];let entry=matches[i]?entries[matches[i]-1]:null;
    if(!entry){const node=template.content.firstChild.cloneNode(true);node.dataset.id=r.id;node.children[0].textContent=r.id;entry={node,button:node.querySelector('button'),value:node.children[2]};byId.set(r.id,entry);}
    if(entry.row!==r){entry.button.textContent=r.label;entry.value.textContent=r.value;entry.row=r;}
    entry.node.className=r.id===s.selected?'selected':'';
    if(entry.node!==cursor)body.insertBefore(entry.node,cursor);
    cursor=entry.node.nextSibling;next[i]=entry;
   }
   entries=next;count.textContent=s.rows.length;
  }else if(previous.selected!==s.selected){byId.get(previous.selected)?.node.classList.remove('selected');byId.get(s.selected)?.node.classList.add('selected');}
  if(input.value!==s.text)input.value=s.text;
  if(previous?.text!==s.text)output.textContent=s.text;
  s.cells.forEach((v,i)=>{if(previous?.cells[i]!==v)cells[i].textContent=v;});previous=s;
 }
 update(initial);
 return {update,flush:()=>Promise.resolve(),destroy(){planner.destroy();input.removeEventListener('input',onInput);body.removeEventListener('click',onClick);entries=[];byId.clear();previous=null;host.replaceChildren();}};
}
