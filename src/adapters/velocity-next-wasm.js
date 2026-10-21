import {createPlanner} from '../planner/wasm.js';
import {mountOptimized} from './optimized.js';
export const mount=(...args)=>mountOptimized(createPlanner,...args);
