# Reproducing v0.2

Normal setup is in README.md. Rust standard library is downloaded once by rustup; cargo needs no registry packages for this crate. Build invokes cargo with --locked. To select alternate toolchain executables, set CARGO and RUSTC consistently. Build does not silently fall back to stale Wasm.

The delivered dist/ directory is ready to serve without a compiler. Never open it via file://; Wasm must be fetched from an HTTP server. Missing/failed Wasm fetch or compilation fails startup visibly via the browser console; this prototype has no automatic JS fallback.

Commands used in this environment (custom Chromium 153 extracted from pinned @sparticuz/chromium):

```sh
npm run build
npm run test:rust
npm test
BROWSER_EXECUTABLE=/absolute/path/to/chromium npm run check
BROWSER_EXECUTABLE=/absolute/path/to/chromium SAMPLES=10 WARMUPS=2 npm run bench
BROWSER_EXECUTABLE=/absolute/path/to/chromium FRAMEWORKS=velocity,velocity-js,velocity-wasm,vanilla CPU_RATE=4 SAMPLES=10 WARMUPS=2 npm run bench
BROWSER_EXECUTABLE=/absolute/path/to/chromium npm run bench:planner
BROWSER_EXECUTABLE=/absolute/path/to/chromium npm run check:explorer
npm run report
```

Run performance jobs sequentially with no concurrent builds or other benchmark browsers. CPU_RATE=4 is browser CPU throttling, not an emulated mobile device. Baseline uses all ten adapters; the throttled follow-up focuses on the four relevant controls. Each has 14 scenarios. The raw metadata records exact browser, CPU, dependency versions, timestamps, samples and failures.

results/v0.1 contains historical results, not a concurrent comparator. v0.2 source/binary manifests identify delivered code. The correctness report's bundleSha256 is SHA256(app.js || planner.wasm) for velocity-wasm and SHA256(app.js) otherwise; standalone file hashes remain in bundle-hashes.json. No WASM code changed between correctness and timing runs.

Browser setup here: the restored previous Chromium file crashed. Re-extracting the pinned package's chromium.br produced a working Chromium 153 binary. Playwright's normal Chromium download returned an invalid archive, so the custom binary was used. Firefox and WebKit were not measured. Do not infer cross-browser or physical-device speed from this execution.
