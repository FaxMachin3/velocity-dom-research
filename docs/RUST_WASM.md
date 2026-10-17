# Rust/Wasm stage: architecture and experiment

## What runs where

Rust owns reusable old/new ID arrays, an open-addressed identity table, and the output match array. JavaScript copies IDs into Wasm linear memory, calls the planner once, reads old-index matches, and performs DOM updates. The model/reducer, strings, event handling, template cloning, selection and dashboard updates remain JavaScript. The JSX compiler is still JavaScript. This is a targeted runtime experiment, not a Rust rewrite of the whole framework.

`velocity-js` implements the same multiplicative hash/probing algorithm using typed arrays. Both new adapters use `src/adapters/hybrid.js`, including static template cloning and delegated row clicks. Comparing original Velocity with Wasm conflates renderer changes and Wasm; compare velocity-js with velocity-wasm to isolate the planner choice. For input, selection and dashboard-only changes neither planner runs; any difference there is noise or incidental runtime effects, not evidence of a Wasm algorithm advantage.

The Rust project has no external crate dependencies. Rust 1.85.0 and wasm32-unknown-unknown are pinned for reproducibility, not because this is the newest toolchain. Release uses opt-level 3, LTO, one codegen unit and abort-on-panic. Generated binary provenance is in generated/wasm-build.json. Source and prebuilt binary both ship.

## ABI and lifetime

Each mounted app owns a separate Wasm instance and boxed planner. `planner_prepare` resizes buffers, `planner_old/next` return writable pointers, and `planner_run` returns the result pointer. Output zero means create, otherwise old index + 1. Empty arrays and key zero are supported. JS reacquires memory views after preparation; returned views must not be retained across another call or disposal. Destroy is idempotent in the JS wrapper and frees the planner. Memory capacity is reusable; linear memory does not shrink within an instance. The instance becomes collectible on application teardown.

This internal ABI trusts its caller: forged handles, double-free at the raw ABI, or pointers used after disposal are invalid. Input keys must be unique unsigned 32-bit integers; the benchmark model satisfies this. It does not support arbitrary string/64-bit keys or duplicate keys. Rust caps each list at one million entries; it is not a public hardened API. Hash probing has expected linear behavior, not a worst-case linear guarantee under adversarial keys. Strings stay in JS, avoiding UTF-8 serialization but retaining JS model costs.

## Measurement

The browser suite times state transformation, copying, planner work, DOM mutation and forced layout together. Startup includes fetching/compiling Wasm; normal operations do not. Correctness hashes combine app.js and planner.wasm for the Wasm adapter. The standalone planner benchmark measures the full planner API including ID copying, with reusable buffers, at 1k/10k/100k old rows; it does not measure DOM or startup and cannot alone establish UI performance.

Bundle output separately accounts for JS and Wasm; compression is calculated, while the server sends uncompressed data. Existing CDP JS heap deltas are not total process memory and must not be interpreted as Wasm memory usage. No new claims about Wasm memory efficiency follow from them. Tests cover model semantics, retained DOM identity, remount/cleanup, escaping, and planner parity against an independent Map oracle with large IDs, collisions, empty lists, and buffer resizing.

## Next stages and decision gates

1. Use the matched-control results to decide whether this planner deserves a default path. Keep a JS fallback where Wasm overhead outweighs kernel savings; first benchmark an explicit row-count threshold instead of guessing one.
2. Profile large-grid workloads (100k+ data rows with 50–200 visible rows). Add Rust-owned filtering, sorting, aggregation and diff generation so data remains in Wasm across interactions. Benchmark equivalent JS/worker versions, including transfer and cancellation latency.
3. Move heavy kernels to a worker with batched messages. Measure main-thread responsiveness, event latency and cancellation; avoid per-row messages. Keep semantic DOM and accessibility on the main thread.
4. Prototype a Rust compiler producing the same DOM output. Evaluate cold/warm compilation, incremental rebuilds, diagnostics, source maps and binary distribution. Build-time Rust is a separate question from browser runtime speed.
5. Before adoption: dedicated hardware, Firefox/WebKit, real mobile devices, network profiles, INP/long tasks, memory including Wasm, production-like grids/forms/routes, accessibility and failure handling. Require repeatable gains with confidence intervals and no material startup/interaction regressions. No universal 'fastest' claim from this suite.

## Primary references consulted 2026-10-17

- https://doc.rust-lang.org/stable/rustc/platform-support/wasm32-unknown-unknown.html
- https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Concepts
- https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Memory
- https://blog.rust-lang.org/2025/04/04/c-abi-changes-for-wasm32-unknown-unknown/

The ABI uses only scalar pointers/integers rather than passing Rust aggregates across the boundary. Wasm uses JavaScript host integration for DOM access; selecting Rust does not remove DOM/layout work.
