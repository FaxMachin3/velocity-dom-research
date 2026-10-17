import {createPlanner} from '../planner/wasm.js';
import {mountWithPlanner} from './hybrid.js';
export const mount=(...args)=>mountWithPlanner(createPlanner,...args);
