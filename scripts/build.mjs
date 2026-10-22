import './build-wasm.mjs';
import {build} from 'esbuild';
import {transformAsync} from '@babel/core';
import {compile as svelteCompile,compileModule} from 'svelte/compiler';
import {compile} from '../src/poc/compiler.js';
import {compileTemplate} from '../src/poc/template-compiler.js';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {gzipSync,brotliCompressSync} from 'node:zlib';
export const frameworks=['velocity-direct-sibling','velocity-delegated-index','velocity-compiled','velocity-next-clone','velocity-next','velocity-next-wasm','velocity','velocity-js','velocity-wasm','vanilla','react','preact','vue','solid','svelte','lit'];
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await mkdir('generated',{recursive:true});
const entry=await readFile('src/entry.js','utf8');
const sizes=[];
for(const framework of frameworks){
 const start=performance.now();
 const adapter=framework==='svelte'?'svelte.svelte.js':['react','preact','solid'].includes(framework)?framework+'.jsx':framework+'.js';
 const plugins=[{name:'compile',setup(b){
  b.onLoad({filter:/\.view\.jsx$/},async args=>{const r=compileTemplate(await readFile(args.path,'utf8'),args.path);await writeFile('generated/'+path.basename(args.path)+'.js',r.code);return {contents:r.code,loader:'js'};});
  b.onLoad({filter:/views\.jsx$/},async args=>{const result=compile(await readFile(args.path,'utf8'),args.path);await writeFile('generated/views.js',result.code);await writeFile('generated/views.js.map',JSON.stringify(result.map));return {contents:result.code,loader:'js'};});
  b.onLoad({filter:/solid\.jsx$/},async args=>{const r=await transformAsync(await readFile(args.path,'utf8'),{filename:args.path,presets:[['babel-preset-solid',{generate:'dom',hydratable:false}]]});return {contents:r.code,loader:'js'};});
  b.onLoad({filter:/\.svelte$/},async args=>({contents:svelteCompile(await readFile(args.path,'utf8'),{filename:args.path,generate:'client',dev:false}).js.code,loader:'js'}));
  b.onLoad({filter:/\.svelte\.js$/},async args=>({contents:compileModule(await readFile(args.path,'utf8'),{filename:args.path,generate:'client',dev:false}).js.code,loader:'js'}));
 }}];
 const result=await build({stdin:{contents:entry.replace('ADAPTER','./adapters/'+adapter),resolveDir:path.resolve('src'),sourcefile:'entry.js'},bundle:true,minify:true,sourcemap:true,format:'esm',target:'es2022',outfile:`dist/${framework}/app.js`,metafile:true,conditions:['browser','production'],define:{'process.env.NODE_ENV':'"production"',__VUE_OPTIONS_API__:'false',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},jsxFactory:framework==='preact'?'h':'React.createElement',plugins,logLevel:'warning'});
 await writeFile(`dist/${framework}/index.html`,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${framework} benchmark</title><link rel="stylesheet" href="/style.css"><body><div id="app"></div><script type="module" src="./app.js"></script></body></html>`);
 if(framework.endsWith('wasm'))await writeFile(`dist/${framework}/planner.wasm`,await readFile('generated/planner.wasm'));
 const bytes=await readFile(`dist/${framework}/app.js`);const wasm=framework.endsWith('wasm')?await readFile('generated/planner.wasm'):Buffer.alloc(0);sizes.push({framework,wasmBytes:wasm.length,wasmGzipBytes:wasm.length?gzipSync(wasm).length:0,totalBytes:bytes.length+wasm.length,jsBytes:bytes.length,gzipBytes:gzipSync(bytes).length,brotliBytes:brotliCompressSync(bytes).length,buildMs:performance.now()-start});
 await writeFile(`dist/${framework}/meta.json`,JSON.stringify(result.metafile,null,2));
 console.log('Built',framework,sizes.at(-1).jsBytes,'bytes');
}
await writeFile('dist/style.css','body{font:14px system-ui;margin:16px}table{border-collapse:collapse;width:650px}td{border-bottom:1px solid #ddd;padding:3px 8px}td:first-child{width:70px}button{font:inherit;border:0;background:none;color:#245da8;cursor:pointer}.selected{background:#dbebff}.dashboard{display:grid;grid-template-columns:repeat(16,40px);gap:2px;margin:12px 0}.cell{padding:2px;background:#eef2f6}input{margin:8px}output{display:inline-block;min-width:200px}');
await writeFile('dist/index.html',`<!doctype html><html lang="en"><meta charset="utf-8"><title>Velocity POC</title><body><h1>Velocity benchmark implementations</h1><p>Open a fixture, then use window.bench in developer tools. Run npm run bench for measurements.</p>${frameworks.map(f=>`<p><a href="/${f}/">${f}</a></p>`).join('')}</body></html>`);
await writeFile('results/bundle-sizes.json',JSON.stringify(sizes,null,2));

await writeFile('dist/explorer.html',await readFile('src/explorer.html','utf8'));

await build({stdin:{contents:"export {createPlanner as js} from './planner/js.js';export {createPlanner as wasm} from './planner/wasm.js';",resolveDir:path.resolve('src')},bundle:true,minify:true,format:'esm',target:'es2022',outfile:'dist/planners.js'});
await writeFile('dist/planner.wasm',await readFile('generated/planner.wasm'));
await build({stdin:{contents:"import {mountOptimized} from './adapters/optimized.js';import {createPlanner as js} from './planner/js.js';import {createPlanner as wasm} from './planner/wasm.js';export const mountJS=(...a)=>mountOptimized(js,...a);export const mountWasm=(...a)=>mountOptimized(wasm,...a);",resolveDir:path.resolve('src')},bundle:true,minify:true,format:'esm',target:'es2022',outfile:'dist/testing.js'});

await build({entryPoints:['src/runtime/template.js'],bundle:true,format:'esm',outfile:'dist/runtime.js'});
await build({entryPoints:['src/views/examples.view.jsx'],bundle:true,format:'esm',outfile:'dist/examples.js',plugins:[{name:'public-templates',setup(b){b.onLoad({filter:/\.view\.jsx$/},async args=>({contents:compileTemplate(await readFile(args.path,'utf8'),args.path).code,loader:'js'}));}}]});

await build({stdin:{contents:"export {mount} from './adapters/velocity-compiled.js';",resolveDir:path.resolve('src')},bundle:true,format:'esm',outfile:'dist/compiled-testing.js',plugins:[{name:'public-templates',setup(b){b.onLoad({filter:/\.view\.jsx$/},async args=>({contents:compileTemplate(await readFile(args.path,'utf8'),args.path).code,loader:'js'}));}}]});

await writeFile('dist/examples.html',await readFile('src/examples.html','utf8'));
