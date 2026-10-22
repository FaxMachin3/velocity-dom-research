import {stablePositions} from '../poc/lis.js';
// List owns each block's lifetime. A block owns one or more sibling DOM nodes.
export function createList(parent,view,{key=x=>x.id,props=x=>x,validate=true}={}){
 let rows=[],entries=[],context,alive=true;const registry=new Map();
 const readKey=(x,i)=>{const k=key(x,i);if(validate&&!(typeof k==='string'||typeof k==='number'&&Number.isFinite(k)))throw TypeError('Keys must be finite numbers or strings');return k;};
 const remove=(e,detach=true)=>{try{e.block.destroy(detach);}finally{if(detach)for(const n of e.block.nodes)n.remove();registry.delete(e.key);}};
 function update(next,ctx){
  if(!alive)throw Error('List disposed');
  if(next===rows&&ctx===context)return;
  const keys=next.map(readKey);if(validate&&new Set(keys).size!==keys.length)throw Error('Duplicate list key');
  const active=document.activeElement,focus=active&&parent.contains(active)?active:null;
  const selection=focus&&'selectionStart'in focus?{start:focus.selectionStart,end:focus.selectionEnd,direction:focus.selectionDirection}:null;
  const output=new Array(next.length),created=[];let head=0,oldEnd=entries.length-1,newEnd=next.length-1;
  const patch=(e,i)=>{if(e.row!==next[i]||ctx!==context)e.block.update(props(next[i],ctx));e.row=next[i];output[i]=e;};
  try{
   while(head<=oldEnd&&head<=newEnd&&entries[head].key===keys[head]){patch(entries[head],head);head++;}
   while(head<=oldEnd&&head<=newEnd&&entries[oldEnd].key===keys[newEnd]){patch(entries[oldEnd],newEnd);oldEnd--;newEnd--;}
   const positions=new Uint32Array(Math.max(0,newEnd-head+1));
   // Only index the unresolved middle; matched prefix/suffix never enter this map.
   const oldPositions=new Map();for(let i=head;i<=oldEnd;i++)oldPositions.set(entries[i].key,i);
   let last=-1,ordered=true;
   for(let i=head;i<=newEnd;i++){
    const index=oldPositions.get(keys[i]);
    if(index!==undefined){positions[i-head]=index+1;if(index<last)ordered=false;last=index;patch(entries[index],i);oldPositions.delete(keys[i]);}
    else{const block=view(props(next[i],ctx));if(!block?.nodes?.length)throw Error('List view must return a nonempty block');const e={key:keys[i],row:next[i],block};created.push(e);output[i]=e;}
   }
   const bulk=head===0&&oldEnd===entries.length-1&&!positions.some(Boolean);
   const cleanupErrors=[];for(const index of oldPositions.values())try{remove(entries[index],!bulk);}catch(e){cleanupErrors.push(e);}
   if(bulk){const fragment=document.createDocumentFragment();for(const e of output)fragment.append(...e.block.nodes);parent.replaceChildren(fragment);}
   else{const stable=ordered?null:stablePositions(positions);let anchor=output[newEnd+1]?.block.nodes[0]||null;
   for(let i=newEnd;i>=head;i--){const e=output[i];if(!positions[i-head]||(!ordered&&!stable[i-head]))for(const node of e.block.nodes)parent.insertBefore(node,anchor);anchor=e.block.nodes[0];}}
   for(const e of created)registry.set(e.key,e);rows=next;entries=output;context=ctx;
   if(focus?.isConnected&&document.activeElement!==focus){focus.focus({preventScroll:true});if(selection&&selection.start!==null)focus.setSelectionRange(selection.start,selection.end,selection.direction);}
   if(cleanupErrors.length)throw new AggregateError(cleanupErrors,'List cleanup failed');
  }catch(error){
   // Fail closed: release all owned blocks. No rollback guarantee for user effects.
   const owned=new Set([...entries,...created]);alive=false;entries=[];rows=[];registry.clear();for(const e of owned)try{e.block.destroy();}catch{}parent.replaceChildren();throw error;
  }
 }
 return {update,get:k=>registry.get(k)?.block,destroy(){if(!alive)return;alive=false;const errors=[];for(const e of entries)try{remove(e);}catch(e){errors.push(e);}entries=[];rows=[];registry.clear();parent.replaceChildren();if(errors.length)throw new AggregateError(errors,'List disposal failed');}};
}
