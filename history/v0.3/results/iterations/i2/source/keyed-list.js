import {stablePositions} from './lis.js';
// Generic renderer-independent keyed list. Caller supplies immutable records,
// unique u32 IDs, node creation, patching and an identity planner.
export function keyedList(parent,planner,create,patch,createMany){
 let rows=[],entries=[];const byId=new Map();
 function make(row){const entry=create(row);byId.set(row.id,entry);return entry;}
 function many(next,start,end){
  const result=createMany?createMany(next,start,end):next.slice(start,end+1).map(create);
  for(let i=start;i<=end;i++)byId.set(next[i].id,result[i-start]);return result;
 }
 function update(next){
  if(next===rows)return;
  const active=document.activeElement;
  const focused=active&&parent.contains(active)?active:null;
  const oldLength=rows.length,length=next.length;
  if(!length){parent.replaceChildren();entries=[];byId.clear();rows=next;return;}
  let head=0,oldEnd=oldLength-1,newEnd=length-1;
  const output=new Array(length);
  while(head<=oldEnd&&head<=newEnd&&rows[head].id===next[head].id){output[head]=entries[head];patch(output[head],next[head]);head++;}
  while(head<=oldEnd&&head<=newEnd&&rows[oldEnd].id===next[newEnd].id){output[newEnd]=entries[oldEnd];patch(output[newEnd],next[newEnd]);oldEnd--;newEnd--;}
  if(head>oldEnd){
   if(head<=newEnd){const fragment=document.createDocumentFragment();const made=many(next,head,newEnd);for(let i=head;i<=newEnd;i++){output[i]=made[i-head];fragment.append(output[i].node);}parent.insertBefore(fragment,output[newEnd+1]?.node||null);}
  }else if(head>newEnd){
   for(let i=head;i<=oldEnd;i++){entries[i].node.remove();byId.delete(rows[i].id);}
  }else{
   const matches=planner.plan(rows,next),used=new Uint8Array(oldLength);
   let reused=0,last=0,ordered=true;
   for(let i=head;i<=newEnd;i++){const match=matches[i];if(match){used[match-1]=1;reused++;if(match<last)ordered=false;last=match;}}
   if(!reused&&head===0&&newEnd===length-1){
    // No retained nodes: one atomic child-list replacement. Preserve identities
    // whenever even one key remains; never rebuild a retained row as HTML.
    const made=many(next,0,length-1),fragment=document.createDocumentFragment();for(let i=0;i<length;i++){output[i]=made[i];fragment.append(made[i].node);}
    parent.replaceChildren(fragment);
    for(const row of rows)byId.delete(row.id);
   }else{
    for(let i=head;i<=newEnd;i++){if(matches[i]){output[i]=entries[matches[i]-1];patch(output[i],next[i]);}else output[i]=make(next[i]);}
    for(let i=head;i<=oldEnd;i++)if(!used[i]){entries[i].node.remove();byId.delete(rows[i].id);}
    const stable=ordered?null:stablePositions(matches.subarray(head,newEnd+1));
    let anchor=output[newEnd+1]?.node||null;
    for(let i=newEnd;i>=head;i--){const e=output[i];if(!matches[i]||(!ordered&&!stable[i-head]))parent.insertBefore(e.node,anchor);anchor=e.node;}
   }
  }
  rows=next;entries=output;
  if(focused&&focused.isConnected&&document.activeElement!==focused)focused.focus({preventScroll:true});
 }
 return {update,get:id=>byId.get(id),destroy(){planner.destroy();rows=[];entries=[];byId.clear();parent.replaceChildren();}};
}
