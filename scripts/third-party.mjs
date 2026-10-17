import {readFile,writeFile} from 'node:fs/promises';
const pkg=JSON.parse(await readFile('package.json','utf8'));
let md='# Direct third-party dependencies\n\nDependencies retain their original licenses. Install with npm ci to obtain their license texts. The archive contains prebuilt bundles and source maps for inspection; this inventory is not a replacement for upstream license notices.\n\n| Package | Version | License | Role |\n|---|---|---|---|\n';
for(const name of Object.keys(pkg.dependencies).sort()){
 const dep=JSON.parse(await readFile('node_modules/'+name+'/package.json','utf8'));
 const role=['react','react-dom','preact','vue','solid-js','svelte','lit'].includes(name)?'Comparison implementation':'Build/test tooling';
 md+=`| ${name} | ${dep.version} | ${typeof dep.license==='string'?dep.license:JSON.stringify(dep.license)} | ${role} |\n`;
}
await writeFile('docs/THIRD_PARTY.md',md);
