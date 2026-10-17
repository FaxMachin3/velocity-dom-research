#!/usr/bin/env python3
"""Package source, prebuilt fixtures, docs and results; exclude dependencies/git."""
from pathlib import Path
import zipfile, hashlib
root = Path(__file__).resolve().parents[1]
out = root.parent / 'velocity-poc-v0.2.0.zip'
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root)
        if path.is_file() and not any(part in ('node_modules', '.git', '__pycache__', 'target') for part in relative.parts):
            z.write(path, Path(root.name) / relative)
print(out)
print('SHA256', hashlib.sha256(out.read_bytes()).hexdigest())
