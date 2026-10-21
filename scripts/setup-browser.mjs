// Optional pinned Linux x64 browser fallback when Playwright CDN setup fails.
// This does not change Playwright launch flags or disable additional protections.
import {mkdir,chmod} from 'node:fs/promises';
import {createReadStream,createWriteStream} from 'node:fs';
import {createBrotliDecompress} from 'node:zlib';
import {pipeline} from 'node:stream/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
if(process.platform!=='linux'||process.arch!=='x64')throw Error('This optional fallback is Linux x64 only; use npx playwright install chromium on other hosts.');
const directory=path.resolve(process.env.BROWSER_CACHE||'.browser-cache');
await mkdir(directory,{recursive:true});
const unpack=async(name,out)=>pipeline(createReadStream('node_modules/@sparticuz/chromium/bin/'+name),createBrotliDecompress(),createWriteStream(out));
const executable=path.join(directory,'chromium');await unpack('chromium.br',executable);await chmod(executable,0o755);
for(const name of ['swiftshader','fonts']){const tar=path.join(directory,name+'.tar');await unpack(name+'.tar.br',tar);execFileSync('tar',['--no-same-owner','-xf',tar,'-C',directory]);}
console.error(execFileSync(executable,['--version']).toString().trim());
console.log(executable);
