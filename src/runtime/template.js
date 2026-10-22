import {createList} from './list.js';
function set(node,name,value){
 if(name==='value'){const next=String(value??'');if(node.value!==next)node.value=next;}
 else if(name==='checked'||name==='selected'||name==='disabled'||name==='multiple')node[name]=!!value;
 else if(name==='className')node.setAttribute('class',value??'');
 else if(value==null||value===false&&!name.startsWith('aria-')&&!name.startsWith('data-'))node.removeAttribute(name);
 else node.setAttribute(name,value===true&&!name.startsWith('aria-')&&!name.startsWith('data-')?'':String(value));
}
// Markers are removed once at template definition; clones contain no bookkeeping attributes.
export function defineTemplate(html,bindings){
 const template=document.createElement('template');template.innerHTML=html;const paths=new Map();
 function walk(parent,path=[]){for(let i=0;i<parent.childNodes.length;i++){let n=parent.childNodes[i];const p=[...path,i];if(n.nodeType===8&&n.data.startsWith('v:')){paths.set(n.data.slice(2),p);const text=document.createTextNode('');n.replaceWith(text);n=text;}else if(n.nodeType===1&&n.hasAttribute('data-v-node')){paths.set(n.getAttribute('data-v-node'),p);n.removeAttribute('data-v-node');}walk(n,p);}}
 walk(template.content);
 const plans=bindings.map(b=>({...b,path:paths.get(String(b.id))}));if(plans.some(b=>!b.path))throw Error('Template binding path missing');
 return function instantiate(initial){
  const nodes=template.content.childNodes.length===1?[template.content.firstChild.cloneNode(true)]:[...template.content.cloneNode(true).childNodes];
  const targets=plans.map(b=>{let node={childNodes:nodes};for(const index of b.path)node=node.childNodes[index];return node;}),previous=new Array(plans.length).fill(Symbol('unset')),lists=new Array(plans.length),cleanups=[];let current=initial,alive=true;
  const onCleanup=fn=>{if(!alive)throw Error('Component disposed');cleanups.push(fn);return fn;};
  const block={nodes,update(next){if(!alive)throw Error('Component disposed');current=next;try{for(let i=0;i<plans.length;i++){const b=plans[i],node=targets[i];if(b.kind==='event')continue;if(b.kind==='list'){lists[i].update(b.read(next),b.context?b.context(next):undefined);continue;}const value=b.read(next);if(Object.is(value,previous[i]))continue;previous[i]=value;if(b.kind==='text')node.data=value==null?'':String(value);else set(node,b.name,value);}}catch(e){try{block.destroy();}catch{}throw e;}},onCleanup,destroy(detach=true){if(!alive)return;alive=false;const errors=[];for(const cleanup of cleanups.splice(0).reverse())try{cleanup();}catch(e){errors.push(e);}if(detach)for(const node of nodes)node.remove();previous.length=0;targets.length=0;lists.length=0;current=null;if(errors.length)throw new AggregateError(errors,'Component cleanup failed');}};
  try{for(let i=0;i<plans.length;i++){const b=plans[i],node=targets[i];
   if(b.kind==='event'){const listener=e=>b.read(current)?.(e);node.addEventListener(b.name,listener);onCleanup(()=>node.removeEventListener(b.name,listener));}
   else if(b.kind==='list'){const list=createList(node,b.view,{key:b.key,props:b.props,validate:true});lists[i]=list;onCleanup(()=>list.destroy());}
  }block.update(initial);return block;}catch(error){try{block.destroy();}catch{}throw error;}
 };
}
export function defineComponent(view,setup){return props=>{const block=view(props);try{setup?.(block,props);return block;}catch(error){try{block.destroy();}catch{}throw error;}};}
export function mount(view,host,props){const block=view(props);host.append(...block.nodes);return {update:next=>block.update(next),flush:()=>Promise.resolve(),destroy:()=>block.destroy()};}

export {createList} from "./list.js";
