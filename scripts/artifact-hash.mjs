import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
export async function artifactHash(f){const hash=createHash('sha256').update(await readFile(`dist/${f}/app.js`));if(f.endsWith('wasm'))hash.update(await readFile(`dist/${f}/planner.wasm`));return hash.digest('hex');}
