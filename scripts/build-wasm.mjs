import {execFileSync} from 'node:child_process';
import {copyFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
const cargo=process.env.CARGO||'cargo';
if(process.env.USE_PREBUILT_WASM==='1'){
 const meta=JSON.parse(await readFile('generated/wasm-build.json'));const hash=createHash('sha256').update(await readFile('generated/planner.wasm')).digest('hex');if(hash!==meta.sha256)throw Error('Prebuilt Wasm hash mismatch');console.log('Using verified unchanged Wasm binary',hash);
}else{
execFileSync(cargo,['build','--manifest-path','rust/planner/Cargo.toml','--target','wasm32-unknown-unknown','--release','--locked'],{stdio:'inherit'});
await mkdir('generated',{recursive:true});
await copyFile('rust/planner/target/wasm32-unknown-unknown/release/velocity_planner.wasm','generated/planner.wasm');
const bytes=await readFile('generated/planner.wasm');
await writeFile('generated/wasm-build.json',JSON.stringify({rustc:execFileSync(process.env.RUSTC||'rustc',['--version']).toString().trim(),sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length},null,2));

}
