import {createPlanner} from '../planner/js.js';
import {mountOptimized} from './optimized-clone.js';
export const mount=(...args)=>mountOptimized(createPlanner,...args);
