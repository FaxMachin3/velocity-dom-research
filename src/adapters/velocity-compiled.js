import {App} from '../views/benchmark.view.jsx';
import {mount as render} from '../runtime/template.js';
export function mount(host,initial,dispatch){
 const choose=id=>dispatch('select',id),text=value=>dispatch('text',value);let selection={selected:initial.selected,choose};
 const props=state=>{if(selection.selected!==state.selected)selection={selected:state.selected,choose};return {state,selection,text};};
 const app=render(App,host,props(initial));return {...app,update:state=>app.update(props(state))};
}
