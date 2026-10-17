from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[1]
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
source={}
for folder in ('src','bench','scripts','tests','rust'):
 for p in sorted((root/folder).rglob('*')):
  if p.is_file() and 'target' not in p.parts: source[str(p.relative_to(root))]=digest(p)
for name in ('package.json','package-lock.json','rust-toolchain.toml'):
 source[name]=digest(root/name)
(root/'results/source-manifest.json').write_text(json.dumps(source,indent=2)+'\n')
binaries={str(p.relative_to(root)):digest(p) for p in sorted((root/'dist').rglob('*')) if p.is_file() and p.suffix in ('.js','.wasm')}
(root/'results/bundle-hashes.json').write_text(json.dumps(binaries,indent=2)+'\n')
print(len(source),'source files;',len(binaries),'binary files hashed')
