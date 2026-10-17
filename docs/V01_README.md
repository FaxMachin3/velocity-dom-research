# Velocity v0.1: compiled DOM proof of concept

A small experimental UI runtime, a restricted JSX-to-DOM compiler, and a reproducible browser benchmark repository comparing eight implementations. **This is research code, not a production framework or a claim of universal superiority.**

## Quick start

Requires Node.js 22+ and npm. Tested dependency versions are pinned in package-lock.json.

```sh
npm ci
npx playwright install --with-deps chromium firefox
npm test
npm run build
npm run check
npm run bench
npm run report
```

Read **results/FINDINGS.md** for the conclusions and **results/REPORT.md** for the included measured results, **docs/METHODOLOGY.md** for interpretation, and **docs/ARCHITECTURE.md** for the POC implementation.

Open `results/report.html` directly for an offline report. The `dist/` directory contains prebuilt browser fixtures. Use `npm run serve`, then visit http://127.0.0.1:4173/explorer.html for interactive controls, or http://127.0.0.1:4173 for fixture links. Do not open fixture HTML using file:// because it loads ES modules.

## Inspect the prebuilt demo without installing Node dependencies

```sh
python3 -m http.server 4173 --directory dist --bind 127.0.0.1
```

Open http://127.0.0.1:4173/explorer.html. This serves the included prebuilt fixtures; it does not run the automated benchmark suite.

## Additional runs

```sh
# Short smoke run (not sufficient for performance claims)
SAMPLES=3 WARMUPS=1 npm run bench

# More repetitions
SAMPLES=30 WARMUPS=5 npm run bench

# Chromium CPU throttling: a synthetic stress profile, not a real mobile device
CPU_RATE=4 SAMPLES=15 npm run bench

# Firefox
BROWSER=firefox npm run check
BROWSER=firefox SAMPLES=15 npm run bench

# Optional WebKit (not necessarily measured in supplied results)
npx playwright install --with-deps webkit
BROWSER=webkit npm run check
BROWSER=webkit npm run bench

# Focused comparison
FRAMEWORKS=velocity,solid,vanilla SAMPLES=30 npm run bench
```

Environment-variable syntax above is POSIX shell; use `$env:SAMPLES="30"` in PowerShell. Each engine/CPU profile overwrites its own `results/run-ENGINE-cpuRATE.json`; copy a run first if you want to retain it. `npm run report` combines all matching run files.

## Included implementations

- **Velocity:** new reactive core + restricted compile-time JSX lowering + keyed DOM reconciliation.
- **Vanilla:** explicit handwritten DOM baseline.
- **React:** memoized rows and dashboard cells; explicit synchronous commit barrier.
- **Preact:** memoized rows and cells.
- **Vue:** shallow state and keyed component/render functions.
- **Solid:** compiler-generated DOM + keyed store reconciliation.
- **Svelte:** compiled Svelte components using runes.
- **Lit:** lit-html templates and keyed `repeat` (not a LitElement component benchmark).

This is a concrete representative set, not every framework in existence. Angular, Qwik, Marko, Astro, Leptos, Dioxus, and Flutter are not implemented in this version. SSR/startup architectures and custom graphics systems need distinct fair workload contracts rather than being forced into this DOM-only suite.

## Benchmark families

Fourteen operation workloads cover creation, replacement, append, sparse update, selection, keyed movement, removal, clearing, filtering, sorting, real synthetic DOM input/click event dispatch, and 128-cell dashboard updates. Additional suites capture localhost startup, 120-frame dashboard traces, Chromium post-GC lifecycle observations, and compressed bundle sizes.

All measured operation samples receive an untimed DOM-output assertion. Dedicated correctness tests additionally check key identity, mixed action sequences, escaping, disposal, and remounting. These do not certify full browser behavior, IME handling, screen-reader support, or production readiness.

## Package contents

- `src/poc/`: reactive runtime, DOM bindings, JSX compiler, authored views.
- `src/adapters/`: all competing implementations.
- `src/model.js`: common deterministic data and state transformations.
- `bench/`: runner, correctness checks, report generation.
- `tests/`: semantic and compiler unit tests.
- `generated/`: readable compiler output and source map.
- `dist/`: prebuilt fixtures and source maps.
- `results/`: raw runs, correctness results, JSON/CSV summaries, and report.
- `docs/`: architecture, methodology, limitations, roadmap, sources.

## Why no Rust/Wasm yet?

The first hypothesis concerns DOM execution and compilation, not numeric kernels. This POC deliberately uses a JavaScript compiler implementation so runtime and semantics can be inspected and changed quickly. It includes **no Rust compiler and no Wasm acceleration**. A Rust compiler port would improve the development toolchain, not automatically improve generated UI performance. Worker/Wasm kernels are a later, separately measured experiment.

## Reproducibility and licensing

The source is MIT licensed. Dependencies retain their own licenses. `npm ci` installs exact locked versions. Source maps are included for inspection; do not publish them blindly for applications containing proprietary source. No dependencies or browsers are bundled in the archive. Full browser installation requires network access and system dependencies.

### Custom browser executable

If Playwright's browser download is unavailable, the runner accepts an explicitly selected executable:

```sh
BROWSER_EXECUTABLE=/absolute/path/to/chromium npm run check
BROWSER_EXECUTABLE=/absolute/path/to/chromium npm run bench
```

The supplied Chromium results use the Linux Chromium executable distributed by `@sparticuz/chromium`; see raw run metadata for its browser version. This is not the standard Playwright Chromium download. Reproduce on your own browser before drawing deployment conclusions. `SERVERLESS_CHROMIUM=1` is also supported where that package's normal extraction works. The package is a harness dependency, not part of any app bundle.
