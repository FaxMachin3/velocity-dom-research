// Frozen-build validation runs. Never rebuild or alter adapters between batches.
import {execFileSync} from 'node:child_process';
const baseEnv={...process.env};delete baseEnv.FRAMEWORKS;delete baseEnv.SKIP_TRACES;
const run=(extra)=>execFileSync(process.execPath,['bench/run.mjs'],{stdio:'inherit',env:{...baseEnv,WARMUPS:'3',...extra}});
run({RESULTS_DIR:'results',SAMPLES:'15',CPU_RATE:'1',SEED:'20261017'});
run({RESULTS_DIR:'results/replication',SAMPLES:'15',CPU_RATE:'1',SEED:'104729'});
run({RESULTS_DIR:'results',SAMPLES:'10',CPU_RATE:'4',SEED:'65537'});
