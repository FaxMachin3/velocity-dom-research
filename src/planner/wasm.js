// One module compilation per page; each mounted app owns a separate instance.
const response=await fetch('./planner.wasm');
if(!response.ok)throw Error('Cannot load Rust planner: '+response.status);
const compiled=await WebAssembly.compile(await response.arrayBuffer());
export function createPlanner(){
 const e=new WebAssembly.Instance(compiled).exports,handle=e.planner_new();let alive=true;
 return {plan(old,next){
  if(!alive)throw Error('Planner disposed');
  if(!e.planner_prepare(handle,old.length,next.length))throw RangeError('Planner capacity exceeded');
  // Prepare can grow memory. Never retain a view across allocation or dispose.
  const a=new Uint32Array(e.memory.buffer,e.planner_old(handle),old.length);
  const b=new Uint32Array(e.memory.buffer,e.planner_next(handle),next.length);
  for(let i=0;i<old.length;i++)a[i]=old[i].id;
  for(let i=0;i<next.length;i++)b[i]=next[i].id;
  const ptr=e.planner_run(handle);
  return new Uint32Array(e.memory.buffer,ptr,next.length);
 },destroy(){if(alive){e.planner_free(handle);alive=false;}}};
}
