import {createPlanner} from '../planner/js.js';
import {mountWithPlanner} from './hybrid.js';
export const mount=(...args)=>mountWithPlanner(createPlanner,...args);
