# Velocity v0.3: optimized keyed rendering, with measured evidence

**Experimental research preview.** APIs remain unstable. No peer review or external independent performance validation is claimed. The independent final batches described below are separate runs by the original experiment author on the same environment, not third-party reproduction. See the [research overview](docs/RESEARCH.md), [contribution guidance](CONTRIBUTING.md), and [release notes](docs/RELEASE-v0.3.0.md). This project is unrelated to the Velocity animation library.

This release contains the original POC, two v0.2 controls, three v0.3 variants, handwritten DOM and React/Preact/Vue/Solid/Svelte/Lit adapters. It is an experimental framework/runtime repository, not a claim of universally fastest performance or feature parity with mature frameworks.

Start with `results/DECISION.md` for the release decision and regressions, then `results/RELEASE.md` or open `results/release.html` for the independent final comparisons. `results/iterations/LOG.md` records the changes, correctness failure, rejected experiment and selection runs. Earlier results are preserved under `results/v0.1/` and `results/v0.2/`.

## What changed

- Reusable keyed-list primitive with prefix/suffix matching and LIS-based movement.
- Two DOM insertions for a distant two-row swap, instead of 997 in the previous renderer.
- Whole-list clear, retained text-node updates and snapshot fast paths.
- Focus restoration for a retained node moved by DOM operations.
- Delegated row events and sibling-pointer binding in the selected candidate.
- Rust/Wasm identity planner retained as an optional path; DOM and LIS remain JavaScript.
- Twenty workloads, randomized correctness tests, edge-case text tests, remount checks and independent final batches.
- Batch HTML construction was implemented and tested, then rejected after regressions. Its sources and results remain available.

## Build and inspect

Requires Node 22+ and Rust via rustup. Dependencies and Rust toolchain are pinned.

```sh
npm ci
rustup toolchain install 1.85.0 --profile minimal --target wasm32-unknown-unknown
npm run build
npm run test:rust
npm test
npx playwright install chromium
npm run check
npm run check:stress
npm run check:explorer
npm run serve
```

Open http://127.0.0.1:4173/explorer.html. Prebuilt fixtures work without npm/Rust using `python3 -m http.server 4173 --directory dist --bind 127.0.0.1`. Use HTTP, not file://, for the fixtures and Wasm fetches. The report itself is self-contained and can be opened directly.

## Reproduce the final experiment

```sh
npm run bench:deep
npm run bench:planner
npm run report
npm run report:release
```

`bench:deep` is a long-running sequential experiment: 15 measured rounds with seed 20261017, 15 independent rounds with seed 104729, and 10 rounds with 4× Chromium CPU throttling. Each batch discards three warmups and uses every registered adapter. Do not run other benchmarks/builds concurrently. It overwrites the current final-result files, so preserve a copy if you want to retain the delivered measurements.

The delivered runs used Chromium 153 through `BROWSER_EXECUTABLE=/absolute/path/to/chromium`; a normal Playwright installation may supply a different version. Always compare recorded browser/host metadata. Firefox downloaded here but its bounded correctness attempt timed out; no Firefox timing result is claimed.

If the normal browser download fails on Linux x64, an optional fallback extracts the pinned @sparticuz Chromium package already installed by npm:

```sh
node scripts/setup-browser.mjs
BROWSER_EXECUTABLE=/absolute/path/printed/by/the/script npm run check
BROWSER_EXECUTABLE=/absolute/path/printed/by/the/script npm run bench:deep
```

This helper is tested separately from performance runs. Extracted browsers stay outside the delivered archive. Other platforms should use their supported Playwright browser installation.

For shorter exploratory runs, use `FRAMEWORKS=velocity-next,velocity-next-wasm,vanilla SAMPLES=5 WARMUPS=2 RESULTS_DIR=results/my-experiment npm run bench`. Such runs are not the independent final batches. The correctness gate must match current JS/Wasm hashes before timing.

## Key files

- `src/poc/keyed-list.js`, `src/poc/lis.js`: reusable reconciliation primitives.
- `src/adapters/optimized.js`: selected fixture renderer.
- `src/adapters/optimized-clone.js`: retained i1 control with direct row handlers.
- `src/planner/`, `rust/planner/`: matching JS and Rust/Wasm identity planners.
- `bench/check.mjs`, `bench/stress.mjs`: semantic and lifecycle correctness.
- `bench/run.mjs`, `bench/deep.mjs`: timing and frozen-build replication.
- `scripts/release-report.mjs`: matrix validation, intervals and interactive report.
- `docs/V03_EXPERIMENT_PROTOCOL.md`: fairness rules and interpretation limits.

## Scope

Inputs are immutable snapshots with unique unsigned 32-bit keys. The table adapter is specialized to the fixture; the keyed-list primitive is reusable. This release does not provide routing, SSR/hydration, a complete component model, arbitrary keys, a Rust JSX compiler, a public hardened Wasm ABI or production accessibility certification. The comparison keeps full DOM output, including offscreen rows; it does not substitute virtualization or altered CSS.

Package the current checkout with `python3 scripts/manifests.py` and `python3 scripts/archive.py`. Source, prebuilt assets, historical results, experiments and final evidence are included; node_modules and Rust target artifacts are excluded.
