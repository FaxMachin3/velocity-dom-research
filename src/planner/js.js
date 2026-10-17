export function createPlanner() {
 let keys=new Uint32Array(1),slots=new Uint32Array(1),out=new Uint32Array(0);
 return {plan(old,next){
  let cap=1;while(cap<old.length*2+1)cap*=2;
  if(keys.length!==cap){keys=new Uint32Array(cap);slots=new Uint32Array(cap);}else slots.fill(0);
  if(out.length!==next.length)out=new Uint32Array(next.length);
  const mask=cap-1;
  for(let i=0;i<old.length;i++){const key=old[i].id;let pos=Math.imul(key,2654435761)&mask;while(slots[pos])pos=(pos+1)&mask;keys[pos]=key;slots[pos]=i+1;}
  for(let i=0;i<next.length;i++){const key=next[i].id;let pos=Math.imul(key,2654435761)&mask;while(slots[pos]&&keys[pos]!==key)pos=(pos+1)&mask;out[i]=slots[pos];}
  return out;
 },destroy(){keys=slots=out=null;}};
}
