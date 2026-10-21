export const frameworks=['velocity-next-clone','velocity-next','velocity-next-wasm','velocity','velocity-js','velocity-wasm','vanilla','react','preact','vue','solid','svelte','lit'];
export const scenarios=[
 {name:'create-10000',initial:0,action:'create',arg:10000},
 {name:'update-all',initial:1000,action:'update-all'},
 {name:'reverse-1000',initial:1000,action:'reverse'},
 {name:'rotate-1000',initial:1000,action:'rotate'},
 {name:'shuffle-1000',initial:1000,action:'shuffle'},
 {name:'noop-1000',initial:1000,action:'noop'},
 {name:'create-1000',initial:0,action:'create',arg:1000},
 {name:'create-5000',initial:0,action:'create',arg:5000},
 {name:'replace-1000',initial:1000,action:'replace',arg:1000},
 {name:'append-1000',initial:1000,action:'append',arg:1000},
 {name:'update-10pct',initial:1000,action:'update'},
 {name:'select-row',initial:1000,action:'select',arg:500},
 {name:'swap-rows',initial:1000,action:'swap'},
 {name:'remove-row',initial:1000,action:'remove',arg:500},
 {name:'clear-5000',initial:5000,action:'clear'},
 {name:'filter-half',initial:1000,action:'filter'},
 {name:'sort-1000',initial:1000,action:'sort'},
 {name:'input-event',initial:1000,action:'input',arg:'typed benchmark query'},
 {name:'click-event',initial:1000,action:'click',arg:500},
 {name:'dashboard-tick',initial:1000,action:'tick'}
];
export function shuffle(items,seed){const out=[...items];let s=seed>>>0;for(let i=out.length-1;i>0;i--){s=(Math.imul(s,1664525)+1013904223)>>>0;const j=s%(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;}
