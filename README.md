# Velocity v0.4: compiler-generated templates and owned keyed blocks

**Experimental research preview.** APIs remain unstable. No peer review or external independent performance validation is claimed. Separate final batches are author-run replications, not third-party reproduction. See the [research overview](docs/RESEARCH.md), [contribution guidance](CONTRIBUTING.md), and [release notes](docs/RELEASE-v0.4.0.md). This project is unrelated to the Velocity animation library.

An experimental frontend runtime and benchmark repository. v0.4 connects static-template compilation to the minimal-move keyed renderer, adds owned cleanup, string/number keys and multi-node blocks, and tests normal component-style code against preserved hand-written controls. It is not a universally fastest or production-complete framework.

Start with `results/v04/DECISION.md` and `results/v04/report.html`. Raw data, diagnostic traces and machine-readable summaries are under `results/v04/`. Previous release evidence is preserved under `history/v0.3/results/` and older `results/v0.1/`, `results/v0.2/` directories.

## Run the prebuilt examples

```sh
python3 -m http.server 4173 --directory dist --bind 127.0.0.1
```

Open http://127.0.0.1:4173/explorer.html for the benchmark adapters, or http://127.0.0.1:4173/examples.html for an editable form and nested tree. Use HTTP for the fixtures; the standalone results report can be opened directly as a local file.

## Build and validate

Node 22+ is required. Dependencies are pinned.

```sh
npm ci
USE_PREBUILT_WASM=1 npm run build
npm test
npx playwright install chromium
npm run check
npm run check:runtime
npm run check:stress
npm run check:explorer
```

`USE_PREBUILT_WASM=1` verifies the recorded SHA-256 and reuses the unchanged Rust binary. To rebuild it instead, install Rust toolchain 1.85.0 and the wasm32-unknown-unknown target, then run `npm run build` without the flag. Native Rust tests are `npm run test:rust`; they were not rerun in the v0.4 environment, where the Rust toolchain was unavailable. The existing compiled Wasm artifact passed the Node oracle tests.

For the exact Chromium used here on Linux x64, `node scripts/setup-browser.mjs` extracts the pinned npm browser package. Set `BROWSER_EXECUTABLE` to the printed absolute executable path for every browser command. The setup helper does not change additional browser launch flags.

## Reproduce the v0.4 experiment

```sh
npm run bench:v04
npm run report
npm run check:release
```

Run sequentially with no other benchmarks/builds active. This is a long experiment and overwrites `results/v04` result files. The protocol is in `docs/V04_PROTOCOL.md`: 30 in-page-warmed and 15 fresh rounds for controlled ablations, 15 full validation rounds for 12 adapters, 15 independent rounds for six selected adapters, separate diagnostic traces, and 30 observations for each of three application workloads. It does not rerun CPU throttling. Historical CPU-throttled results belong to v0.3.

The existing `bench:deep` command is the older broad experiment and is not the v0.4 release protocol. Use `bench:v04` for this release. Reports verify frozen application fingerprints before accepting data.

## Public API and source

- `docs/V04_API.md`: template syntax, lifecycle, key contract and limitations.
- `src/poc/template-compiler.js`: compiler emitting hoisted templates and shared binding plans.
- `src/runtime/template.js`: block creation, patching, events, explicit cleanup and component wrapper.
- `src/runtime/list.js`: keyed single/multi-node reconciliation and ownership.
- `src/views/benchmark.view.jsx`: benchmark written with the public template language.
- `src/views/examples.view.jsx`: form, tree and range views.
- `bench/runtime-check.mjs`: lifecycle, ranges, keys, focus/caret, forms and nested lists.
- `bench/focused.mjs`: controlled fresh and in-page-warmed experiments.
- `bench/trace.mjs`: replacement diagnostic traces, separate from performance estimates.
- `docs/V04_STATUS.md`: implemented scope and remaining work.

The compiled v0.4 adapter is JavaScript-only. `velocity-next-wasm` is the preserved v0.3 Rust/Wasm control, not a new compiled-Wasm implementation. Mature framework adapters provide more features than this POC and are not claimed to be globally optimal implementations.

Package using `python3 scripts/manifests.py` followed by `python3 scripts/archive.py`. The archive includes source, prebuilt fixtures and evidence; it excludes dependencies, browser binaries and Rust build caches.
