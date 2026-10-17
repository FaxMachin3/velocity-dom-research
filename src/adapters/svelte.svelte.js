import {mount as mountSvelte,unmount,tick,flushSync} from 'svelte';
import App from './App.svelte';
export function mount(host,initial,dispatch){let props=$state.raw(initial);
const app=mountSvelte(App,{target:host,props:{get state(){return props;},dispatch}});flushSync();
return {update:s=>{props=s;},flush:tick,destroy:()=>unmount(app)};}
