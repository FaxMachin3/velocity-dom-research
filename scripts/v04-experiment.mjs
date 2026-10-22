import {execFileSync} from 'node:child_process';
const base={...process.env};delete base.FRAMEWORKS;delete base.SCENARIOS;
const run=(file,extra={})=>execFileSync(process.execPath,[file],{stdio:'inherit',env:{...base,...extra}});
run('bench/focused.mjs',{SAMPLES:'30',SEED:'90210',IN_PAGE_WARMUPS:'3'});
run('bench/focused.mjs',{SAMPLES:'15',SEED:'19283',IN_PAGE_WARMUPS:'0'});
run('bench/trace.mjs');
run('bench/run.mjs',{FRAMEWORKS:'velocity-compiled,velocity-next,velocity-next-wasm,velocity-next-clone,velocity-js,vanilla,react,preact,vue,solid,svelte,lit',SAMPLES:'15',WARMUPS:'3',CPU_RATE:'1',SEED:'22102026',RESULTS_DIR:'results/v04/normal-a'});
run('bench/run.mjs',{FRAMEWORKS:'velocity-compiled,velocity-next,vanilla,react,solid,svelte',SAMPLES:'15',WARMUPS:'3',CPU_RATE:'1',SEED:'104729',RESULTS_DIR:'results/v04/normal-b'});
run('bench/apps.mjs');
