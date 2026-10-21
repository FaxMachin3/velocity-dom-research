import {keyedList} from '../poc/keyed-list.js';
export function mountOptimized(createPlanner,host,initial,dispatch){
 const main=document.createElement('main');
 main.innerHTML='<p data-count></p><label>Search<input aria-label="Search"></label><output></output><section class="dashboard"></section><table><tbody></tbody></table>';
 const template=document.createElement('template');template.innerHTML='<tr><td> </td><td><button> </button></td><td> </td></tr>';
 const count=main.querySelector('p'),countText=document.createTextNode('');count.append(countText);
 const input=main.querySelector('input'),output=main.querySelector('output'),outputText=document.createTextNode('');output.append(outputText);
 const body=main.querySelector('tbody'),section=main.querySelector('section');
 const cells=initial.cells.map(()=>{const node=document.createElement('span');node.className='cell';const text=document.createTextNode('');node.append(text);section.append(node);return text;});
 let selected=initial.selected,previous;
 const adopt=(node,row)=>{
  const button=node.children[1].firstChild;
  if(!button.firstChild)button.append(document.createTextNode(''));
  button.onclick=()=>dispatch('select',row.id);
  return {node,label:button.firstChild,value:node.children[2].firstChild,row};
 };
 const create=row=>{
  const node=template.content.firstChild.cloneNode(true),button=node.children[1].firstChild;
  node.dataset.id=row.id;node.children[0].firstChild.data=row.id;
  button.firstChild.data=row.label;node.children[2].firstChild.data=row.value;
  if(row.id===selected)node.className='selected';return adopt(node,row);
 };
 const entities={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','\r':'&#13;'};
 const escape=value=>String(value).replace(/[&<>"'\r]/g,c=>entities[c]);
 const batchTemplate=document.createElement('template');
 const createMany=(rows,start,end)=>{
  // General contiguous-insertion fast path. HTML parsing changes NUL characters,
  // so fall back to DOM creation when a label contains one.
  if(end-start<63||rows.slice(start,end+1).some(r=>r.label.includes('\0')))return rows.slice(start,end+1).map(create);
  let html='';
  for(let i=start;i<=end;i++){const r=rows[i],id=escape(r.id);html+='<tr data-id="'+id+'"'+(r.id===selected?' class="selected"':'')+'><td>'+id+'</td><td><button>'+escape(r.label)+'</button></td><td>'+escape(r.value)+'</td></tr>';}
  batchTemplate.innerHTML=html;
  const entries=[];let node=batchTemplate.content.firstChild;
  for(let i=start;i<=end;i++){entries.push(adopt(node,rows[i]));node=node.nextSibling;}
  return entries;
 };
 const list=keyedList(body,createPlanner(),create,(entry,row)=>{
  if(entry.row!==row){if(entry.row.label!==row.label)entry.label.data=row.label;if(entry.row.value!==row.value)entry.value.data=row.value;entry.row=row;}
 },createMany);
 input.oninput=e=>dispatch('text',e.target.value);
 function update(next){
  const oldSelected=selected;selected=next.selected;
  list.update(next.rows);
  if(oldSelected!==selected){const old=list.get(oldSelected),fresh=list.get(selected);if(old)old.node.className='';if(fresh)fresh.node.className='selected';}
  if(previous?.rows.length!==next.rows.length)countText.data=next.rows.length;
  if(previous?.text!==next.text){if(input.value!==next.text)input.value=next.text;outputText.data=next.text;}
  if(previous?.cells!==next.cells)for(let i=0;i<next.cells.length;i++)if(previous?.cells[i]!==next.cells[i])cells[i].data=next.cells[i];
  previous=next;
 }
 update(initial);host.append(main);
 return {update,flush:()=>Promise.resolve(),destroy(){list.destroy();input.oninput=null;previous=null;host.replaceChildren();}};
}
