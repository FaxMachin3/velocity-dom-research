import {mount} from 'ADAPTER';
import {initial,reduce} from './model.js';
let state=initial(), app;
const host=document.getElementById('app');
function createApp(){const container=document.createElement('div');host.append(container);return mount(container,state,dispatch);}
function dispatch(action,arg){state=reduce(state,action,arg);app.update(state);}
app=createApp();
window.bench={
  async reset(n=0){await app.destroy();host.replaceChildren();state=initial(n);app=createApp();await app.flush();},
  async act(action,arg){dispatch(action,arg);await app.flush();},
  async input(text){const el=host.querySelector('input');el.value=text;el.dispatchEvent(new Event('input',{bubbles:true}));await app.flush();},
  async click(id){host.querySelector(`tr[data-id="${id}"] button`).click();await app.flush();},
  state:()=>state,
  async destroy(){await app.destroy();host.replaceChildren();},
  snapshot(){return {rows:[...host.querySelectorAll('tbody tr')].map(r=>({id:Number(r.dataset.id),label:r.querySelector('button').textContent,value:Number(r.children[2].textContent),selected:r.classList.contains('selected')})),text:host.querySelector('output')?.textContent,input:host.querySelector('input')?.value,cells:[...host.querySelectorAll('.cell')].map(n=>Number(n.textContent)),count:Number(host.querySelector('[data-count]')?.textContent)};}
};
window.ready=true;
window.readyAt=performance.now();
