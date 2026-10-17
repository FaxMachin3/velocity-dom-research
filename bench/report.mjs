import {readdir,readFile,writeFile} from 'node:fs/promises';
import {frameworks,scenarios} from './config.mjs';
const quantile=(a,q)=>{const s=[...a].sort((x,y)=>x-y);if(!s.length)return NaN;const p=(s.length-1)*q,i=Math.floor(p);return s[i]+(s[Math.min(i+1,s.length-1)]-s[i])*(p-i);};
function summary(values){if(!values.length)return null;let seed=42;const boots=[];for(let b=0;b<1000;b++){const sample=[];for(let i=0;i<values.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;sample.push(values[seed%values.length]);}boots.push(quantile(sample,.5));}return {n:values.length,median:quantile(values,.5),p95:quantile(values,.95),min:Math.min(...values),max:Math.max(...values),medianCI95:[quantile(boots,.025),quantile(boots,.975)]};}
const sizes=JSON.parse(await readFile('results/bundle-sizes.json','utf8'));
let md='# Velocity v0.1 benchmark report\n\nGenerated from included raw measurements. This is an exploratory localhost/headless comparison of these adapters, not a universal ranking of frameworks.\n\n';
md+='## JavaScript bundle sizes\n\nIncludes fixture, shared model, benchmark API, and framework runtime. Excludes source maps and common CSS. Gzip/Brotli values are calculated, not the transfer encoding used in browser runs.\n\n| Adapter | Raw bytes | Gzip bytes | Brotli bytes |\n|---|---:|---:|---:|\n';
for(const r of sizes)md+=`| ${r.framework} | ${r.jsBytes} | ${r.gzipBytes} | ${r.brotliBytes} |\n`;
const summaries=[];
for(const file of (await readdir('results')).filter(n=>/^run-.*\.json$/.test(n)).sort()){
 const run=JSON.parse(await readFile('results/'+file,'utf8'));const m=run.meta;
 md+=`\n## ${m.engine}, CPU multiplier ${m.cpuRate}\n\nBrowser: ${m.browserVersion}. Node: ${m.node}. CPU: ${m.cpu}. ${m.samples} measured rounds after ${m.warmups} discarded warmup rounds. Failures: ${run.failures.length}.\n\n`;
 md+='### Median commit + forced layout (milliseconds)\n\nLower is better. Includes shared state transformation and the adapter flush barrier. Layout is synchronously requested; these are not INP measurements.\n\n| Workload | '+frameworks.join(' | ')+' |\n|---|'+frameworks.map(()=> '---:').join('|')+'|\n';
 const groups=[];
 for(const s of scenarios){md+=`| ${s.name} |`;for(const f of frameworks){const rows=run.samples.filter(x=>x.framework===f&&x.scenario===s.name);const stat=summary(rows.map(x=>x.commitLayoutMs));groups.push({framework:f,scenario:s.name,commitLayout:stat,commit:summary(rows.map(x=>x.commitMs)),frameOpportunity:summary(rows.map(x=>x.frameOpportunityMs))});md+=stat?` ${stat.median.toFixed(2)} |`:' — |';}md+='\n';}
 md+='\n### Local cold-context startup and lifecycle observations\n\nStartup ends at application-ready assignment, not paint. Fresh browser contexts do not clear operating-system or browser-process code caches. Memory is one post-GC retained-heap delta after 20 cycles; negative values are possible and do not imply negative allocations. Animation trace: one 120-tick sample per adapter, display pacing dependent.\n\n| Adapter | Ready median ms | Retained heap delta bytes | Tick work median ms | Frame interval p95 ms |\n|---|---:|---:|---:|---:|\n';
 for(const f of frameworks){const ready=summary(run.startup.filter(x=>x.framework===f).map(x=>x.readyMs));const memory=run.memory.find(x=>x.framework===f);const animation=run.animation.find(x=>x.framework===f);md+=`| ${f} | ${ready?.median.toFixed(2)??'—'} | ${memory?.heapDeltaBytes??'not measured'} | ${animation?quantile(animation.work,.5).toFixed(2):'—'} | ${animation?quantile(animation.intervals,.95).toFixed(2):'—'} |\n`;}
 summaries.push({file,meta:m,groups});
 if(run.failures.length)md+='\n**This run contains failures. Inspect raw results before interpreting any comparison.**\n';
}
md+='\n## Interpretation limits\n\n- All adapters render the same rows, input, and 128 dashboard cells. They use different idiomatic update strategies; source review is essential.\n- React uses memoized rows/cells and a synchronous flush barrier, not React Compiler. Vue uses render functions, not SFC compilation. Lit measures lit-html rendering, not LitElement lifecycle. Solid uses keyed store reconciliation.\n- The POC is a much smaller feature set than mature frameworks. Bundle size is not a feature-parity comparison.\n- New browser contexts and seeded shuffled order reduce some bias but cannot remove shared-host noise.\n- Double requestAnimationFrame is only a frame-opportunity proxy; it does not prove that content was painted.\n- No real mobile devices, slow-network tests, SSR, hydration, GPU, Wasm, or accessibility certification are included.\n- Median bootstrap intervals and p95 values are in summary.json. Small samples and shared-host correlations limit statistical confidence. There is no aggregate winner score.\n';
md+='\nVelocity and vanilla use a per-row selection registry; competing adapters use different selection propagation strategies. The targeted-update advantage is partly an adapter design choice, not proof of an unavoidable framework limitation. See docs/METHODOLOGY.md and results/FINDINGS.md.\n';
await writeFile('results/REPORT.md',md);await writeFile('results/summary.json',JSON.stringify(summaries,null,2));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function renderMarkdown(text){
 const lines=text.split('\n');let out='',inTable=false,inList=false;
 const inline=x=>escape(x).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');
 for(const line of lines){
  if(line.startsWith('|')){
   if(/^\|[-:| ]+\|$/.test(line))continue;
   const cells=line.split('|').slice(1,-1).map(x=>x.trim());
   if(!inTable){out+='<div class="table-wrap"><table><thead><tr>'+cells.map(x=>'<th>'+inline(x)+'</th>').join('')+'</tr></thead><tbody>';inTable=true;}
   else out+='<tr>'+cells.map(x=>'<td>'+inline(x)+'</td>').join('')+'</tr>';
   continue;
  }
  if(inTable){out+='</tbody></table></div>';inTable=false;}
  if(line.startsWith('- ')){if(!inList){out+='<ul>';inList=true;}out+='<li>'+inline(line.slice(2))+'</li>';continue;}
  if(inList){out+='</ul>';inList=false;}
  const heading=/^(#{1,3}) (.*)$/.exec(line);
  if(heading)out+=`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`;
  else if(line.trim())out+='<p>'+inline(line)+'</p>';
 }
 if(inTable)out+='</tbody></table></div>';if(inList)out+='</ul>';return out;
}
await writeFile('results/report.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Velocity benchmark report</title><style>body{font:15px system-ui;color:#1d2939;background:#f7f9fc;margin:0;padding:32px}main{max-width:1400px;margin:auto}h1{font-size:34px}h2{margin-top:42px;border-top:1px solid #d8e0ed;padding-top:24px}p,li{max-width:1050px;line-height:1.65}li{margin:8px 0}.table-wrap{overflow:auto;background:white;border:1px solid #dbe3ef;border-radius:10px}table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}td,th{padding:12px;text-align:right;white-space:nowrap;border-bottom:1px solid #e7ecf4}td:first-child,th:first-child{text-align:left}th{background:#173b61;color:white}tr:nth-child(even){background:#f3f7fc}code{background:#e7edf7;padding:2px 5px;border-radius:4px}@media(max-width:600px){body{padding:16px}h1{font-size:27px}}</style><main>${renderMarkdown(md)}</main></html>`);
console.log('Wrote results/REPORT.md, report.html, summary.json');
const csvCell=x=>'"'+String(x??'').replaceAll('"','""')+'"';
const csvRows=[['engine','cpuRate','framework','scenario','n','medianCommitLayoutMs','p95CommitLayoutMs','ci95Low','ci95High','medianCommitMs','medianFrameOpportunityMs']];
for(const run of summaries)for(const g of run.groups)if(g.commitLayout)csvRows.push([run.meta.engine,run.meta.cpuRate,g.framework,g.scenario,g.commitLayout.n,g.commitLayout.median,g.commitLayout.p95,...g.commitLayout.medianCI95,g.commit.median,g.frameOpportunity.median]);
await writeFile('results/summary.csv',csvRows.map(row=>row.map(csvCell).join(',')).join('\n')+'\n');
