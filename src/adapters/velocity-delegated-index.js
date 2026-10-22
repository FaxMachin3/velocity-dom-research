import {createPlanner} from '../planner/js.js';
import {mountOptimized} from './ablation-delegated-index.js';
export const mount=(...args)=>mountOptimized(createPlanner,...args);
