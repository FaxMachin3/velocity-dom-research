export const CELL_COUNT = 128;
export function rows(n, start = 1) { return Array.from({length:n}, (_,i) => ({id:start+i,label:`Item ${start+i}`,value:(start+i)*7%1000})); }
export function initial(n=0) { return {rows:rows(n),selected:-1,text:'',cells:Array.from({length:CELL_COUNT},(_,i)=>i),nextId:n+1}; }
export function reduce(s, action, arg) {
  switch(action) {
    case 'create': return {...s,rows:rows(arg),nextId:arg+1,selected:-1};
    case 'replace': return {...s,rows:rows(arg,s.nextId),nextId:s.nextId+arg,selected:-1};
    case 'append': return {...s,rows:[...s.rows,...rows(arg,s.nextId)],nextId:s.nextId+arg};
    case 'update': return {...s,rows:s.rows.map((r,i)=>i%10===0?{...r,label:r.label+'!',value:r.value+1}:r)};
    case 'select': return {...s,selected:arg};
    case 'swap': {const rs=s.rows.slice(); if(rs.length>998) [rs[1],rs[998]]=[rs[998],rs[1]]; return {...s,rows:rs};}
    case 'remove': return {...s,rows:s.rows.filter(r=>r.id!==arg)};
    case 'clear': return {...s,rows:[],selected:-1};
    case 'filter': return {...s,rows:s.rows.filter(r=>r.id%2===0)};
    case 'sort': return {...s,rows:[...s.rows].sort((a,b)=>b.value-a.value||a.id-b.id)};
    case 'text': return {...s,text:arg};
    case 'tick': return {...s,cells:s.cells.map((v,i)=>v+(i%7)+1)};
    default: throw new Error('Unknown action '+action);
  }
}
