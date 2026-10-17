import {createApp,h,shallowRef,nextTick,defineComponent} from 'vue';
const Row=defineComponent({props:['row','selected','dispatch'],setup:p=>()=>h('tr',{'data-id':p.row.id,class:p.selected?'selected':''},[h('td',p.row.id),h('td',[h('button',{onClick:()=>p.dispatch('select',p.row.id)},p.row.label)]),h('td',p.row.value)])});
export function mount(host,initial,dispatch){const state=shallowRef(initial);
const app=createApp({setup:()=>()=>{const s=state.value;return h('main',[h('p',{'data-count':''},s.rows.length),h('label',['Search',h('input',{'aria-label':'Search',value:s.text,onInput:e=>dispatch('text',e.target.value)})]),h('output',s.text),h('section',{class:'dashboard'},s.cells.map((v,i)=>h('span',{class:'cell',key:i},v))),h('table',[h('tbody',s.rows.map(r=>h(Row,{key:r.id,row:r,selected:r.id===s.selected,dispatch})))])]);}});app.mount(host);
return {update:s=>state.value=s,flush:nextTick,destroy:()=>app.unmount()};}
