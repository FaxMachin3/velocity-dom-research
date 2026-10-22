import {createPlanner} from '../planner/js.js';
import {mountOptimized} from './ablation-direct-sibling.js';
export const mount=(...args)=>mountOptimized(createPlanner,...args);
