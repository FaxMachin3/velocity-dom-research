# v0.4 release decision

**Ship as an experimental compiler/runtime milestone. Do not promote it as a speed upgrade or the fastest framework.** Retain the smaller v0.3 renderer as the speed control. The new runtime makes ordinary reusable template code possible, but its creation, disposal and context-update overhead remains material.

## What was built

The public `.view.jsx` compiler emits hoisted HTML templates and shared dynamic binding plans. The runtime supports explicit snapshot updates, text/property bindings, events, owned cleanup, finite-number/string keys, multi-node keyed blocks, nested lists and component setup. The benchmark candidate is built through this API rather than a bespoke table renderer. Form and tree examples exercise the same API.

The reconciler matches common prefixes/suffixes, indexes only the unresolved middle and uses longest-increasing-subsequence planning to avoid unnecessary retained-node moves. Bulk replacement and clearing still invoke owned cleanup. Removal disposes components; reordering preserves identity. Cleanup exceptions are aggregated and errors fail closed.

This is not full React JSX, a complete reactive framework or a production-ready application platform. Detailed boundaries are in `docs/V04_API.md` and `docs/V04_STATUS.md`.

## Completed evidence

| Track | Matrix | Measured operations |
|---|---|---:|
| Focused, in-page warmed | 4 variants × 3 workloads × 30 rounds | 360 |
| Focused, fresh | 4 variants × 3 workloads × 15 rounds | 180 |
| Normal A | 12 adapters × 20 workloads × 15 rounds | 3,600 |
| Normal B | 6 prespecified adapters × 20 workloads × 15 rounds | 1,800 |
| Application workloads | 3 workloads × 30 observations | 90 |
| **Release campaign total** | Excludes warmups and diagnostic traces | **6,030** |

A separate initial selection screen contains 180 observations and is not included in release estimates. Total measured operations produced in this increment: 6,210. The normal batches also contain 270 startup observations, 18 animation runs and 18 post-GC heap observations. Five replacement traces are diagnostics only. Animation frames are not counted as independent benchmark samples.

The Node suite passed 21 tests, including existing JS/Wasm oracle tests. Chromium correctness gates cover 16 adapters and current binary fingerprints. Runtime checks include 1,000 randomized multi-node range updates and 100 remounts. Compiled-fixture stress checks include 600 randomized updates, 617 state checks, focus retention, a two-move swap and 100 remounts. The examples, all 16 report selector combinations and all 16 explorer adapters passed. See the raw validation files, not just these counts.

All 13 preserved controls match the previous archive's binaries. App binaries were frozen throughout the final timing campaign. Builds and other browser checks were not run concurrently with timing. Small documentation/report-source edits were made while it ran.

## New compiled runtime versus current-session v0.3 JS

Median commit plus forced layout, milliseconds; lower is better. A and B are independent batches and are not pooled. These are descriptive medians, not significance declarations. The report includes per-cell p95 and bootstrap intervals.

| Workload | Compiled A | v0.3 JS A | Compiled B | v0.3 JS B |
|---|---:|---:|---:|---:|
| append-1000 | 50.50 | 42.10 | 57.00 | 48.60 |
| clear-5000 | 26.10 | 20.60 | 27.60 | 22.20 |
| click-event | 1.50 | 0.50 | 1.50 | 0.50 |
| create-1000 | 40.90 | 34.60 | 45.20 | 36.20 |
| create-10000 | 497.50 | 443.10 | 541.10 | 474.70 |
| create-5000 | 270.50 | 226.30 | 272.30 | 221.90 |
| dashboard-tick | 1.00 | 0.80 | 1.00 | 0.80 |
| filter-half | 7.10 | 6.10 | 7.60 | 6.00 |
| input-event | 0.70 | 0.70 | 0.70 | 0.80 |
| noop-1000 | 0.10 | 0.00 | 0.10 | 0.00 |
| remove-row | 4.20 | 3.80 | 4.40 | 3.60 |
| replace-1000 | 46.30 | 43.60 | 50.80 | 48.90 |
| reverse-1000 | 41.10 | 41.00 | 41.40 | 40.00 |
| rotate-1000 | 4.80 | 4.60 | 4.90 | 4.60 |
| select-row | 1.00 | 0.20 | 0.80 | 0.20 |
| shuffle-1000 | 39.10 | 38.30 | 40.90 | 38.00 |
| sort-1000 | 38.90 | 41.70 | 44.40 | 39.80 |
| swap-rows | 4.90 | 4.30 | 4.90 | 4.70 |
| update-10pct | 6.50 | 6.10 | 7.10 | 6.40 |
| update-all | 28.10 | 26.00 | 29.00 | 26.40 |

Creating 1,000 rows is approximately 18–25% slower than v0.3 JS across the two batches; creating 5,000 is 20–23% slower; clearing 5,000 is 24–27% slower. Selection adds roughly 0.6–0.8 ms and clicks roughly 1.0 ms. These sub-millisecond baselines make percentage ratios misleading, so absolute differences matter more there.

Swap and rotation retain the low-move behavior, but are not established wins over v0.3. Sorting looks better in A (38.9 versus 41.7 ms) and worse in B (44.4 versus 39.8 ms): this is a useful example of why one batch cannot establish an optimization win. Confidence intervals overlap in many cells. No-op readings at or near zero are timer-resolution observations, not zero-cost execution.

## External-framework comparison

Selected workloads from normal A, same session. The complete 20-workload, 12-adapter table is in `REPORT.md`, with interactive medians/p95 in `report.html` and raw values in JSON. React, Preact, Vue, Solid, Svelte and Lit are included; the old Velocity variants are controls, not additional external frameworks.

| Workload | Compiled | Vanilla | React | Preact | Vue | Solid | Svelte | Lit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| create-1000 | 40.90 | 36.80 | 38.80 | 41.40 | 39.90 | 40.00 | 36.40 | 37.50 |
| create-10000 | 497.50 | 467.70 | 678.20 | 514.60 | 503.40 | 498.90 | 479.40 | 519.30 |
| replace-1000 | 46.30 | 46.70 | 52.70 | 57.80 | 54.30 | 49.00 | 49.20 | 59.20 |
| clear-5000 | 26.10 | 28.10 | 33.50 | 31.60 | 37.10 | 23.40 | 24.60 | 274.40 |
| swap-rows | 4.90 | 41.70 | 40.60 | 5.10 | 4.70 | 6.10 | 4.90 | 4.70 |
| rotate-1000 | 4.80 | 36.20 | 5.30 | 4.80 | 4.90 | 6.40 | 5.60 | 4.60 |
| select-row | 1.00 | 0.20 | 0.80 | 1.00 | 1.00 | 2.00 | 1.00 | 0.50 |
| update-all | 28.10 | 28.60 | 32.20 | 30.40 | 38.90 | 30.90 | 27.10 | 25.50 |

The compiled candidate has competitive results in some workloads and loses in others. For example, its 4.9 ms swap compares favorably with this React adapter's 40.6 ms, but Preact, Vue, Svelte and Lit also achieve roughly 4.7–5.1 ms. Fast reordering is therefore not a unique capability. Creation and clearing expose meaningful gaps. Mature frameworks also provide capabilities this POC lacks.

## Event-handling/node-binding investigation

Median commit plus forced layout, milliseconds. “Direct/indexed” is the old clone control; “delegated/sibling” is the old selected renderer. The other two variants cross one factor at a time.

| Track / workload | Direct/indexed | Delegated/sibling | Direct/sibling | Delegated/indexed |
|---|---:|---:|---:|---:|
| Warm / replace-1000 | 45.40 | 40.25 | 41.50 | 42.50 |
| Warm / shuffle-1000 | 42.50 | 46.60 | 42.15 | 44.75 |
| Warm / append-1000 | 40.95 | 41.05 | 41.20 | 40.40 |
| Fresh / shuffle-1000 | 43.10 | 41.70 | 41.30 | 42.00 |
| Fresh / append-1000 | 54.20 | 49.80 | 51.30 | 48.20 |
| Fresh / replace-1000 | 49.90 | 47.20 | 46.90 | 48.50 |

No combination wins consistently across both tracks and all three workloads. Warm replacement favors delegated/sibling over direct/indexed (40.25 versus 45.40 ms), whereas warm shuffle favors direct/sibling (42.15 ms) over delegated/sibling (46.60 ms). Fresh shuffle has much closer medians. These results do not support attributing the earlier replacement regression to one universally harmful event strategy or binding strategy.

The five single replacement traces attribute substantial time to style/layout, but one trace per variant cannot explain the distribution or prove a cause. Raw compressed traces and event-duration summaries are retained. Warm and fresh tracks ran separately; their differences also include execution-order and host effects.

## Likely costs and what is established

Selection has a directly observable structural cause: the compiled adapter changes list context, and the generic list refreshes every retained row's props. The hand-written control updates only selected rows. That establishes extra work, not an exact decomposition of elapsed time.

Creation allocates generic blocks, target/previous-value arrays, per-instance event cleanup and validated keys. Disposal invokes cleanup even in the bulk DOM-removal path. These are plausible sources of the measured overhead; the present traces do not isolate each contribution. Removing lifecycle work or key checks only from the benchmark would change the contract and is not an acceptable optimization.

The delivered compiled fixture is 8,931 raw JS bytes / 3,769 gzip bytes versus v0.3 JS at 6,624 / 2,765. These include the fixture and benchmark interface, not just a standalone runtime package. Compiler dependencies are not shipped to the browser.

## Rust/Wasm position

No new Rust kernel was added in v0.4. The existing Wasm planner and adapter remain an explicit control; the binary hash was verified and its Node oracle tests passed. Native Rust tests were not rerun because this environment lacked the toolchain. Generic compiled keys currently use JavaScript Map.

The Wasm control adds 19,742 raw / 8,101 gzip Wasm bytes. Its timings are in normal A; it was not included in the six-adapter normal B subset, so this campaign does not independently replicate any Rust advantage. Historical standalone-planner timings are not new measurements. A compiled-Wasm path should be pursued only after profiling and an end-to-end crossover experiment including key interning, transfer, compilation/startup and DOM work.

## Application workloads

Compiled runtime only, 30 observations after three discarded warmups per workload. Fresh mount before each observation; mount/destruction are outside the operation timer. These establish exercised behavior and absolute timings, not superiority over other frameworks.

| Workload | Median commit + layout ms |
|---|---:|
| form-250-edit | 0.90 |
| range-1000-reverse | 18.00 |
| tree-80x20-leaf-edit | 0.30 |

## Next optimization order

1. Add a general dependency/selector mechanism so context changes can invalidate affected bindings without refreshing every row. Keep arbitrary expressions on a correct fallback path. Validate it on forms, trees and list selection, not only this table.
2. Profile creation/allocation and cleanup separately. Evaluate compiler-emitted target paths, lazy cleanup storage and safe batching while preserving exactly-once disposal, key validation and DOM identity.
3. Promote a change only after correctness, independent A/B batches and an explicit regression budget. Reject an apparent win that fails replication or changes semantics. Keep both candidate and control results.
4. Add an official JS Framework Benchmark-compatible implementation and review external adapters, including React Compiler/Vue SFC variants. The current custom harness cannot substitute for that evidence.
5. Then test optional Rust/Wasm planning on sufficiently large batches, including general-key interning. Choose a threshold from end-to-end measurements; do not make Wasm a mandatory startup cost without evidence.
6. Establish Firefox/WebKit and real-device behavior, user-interaction latency and realistic loading before production claims. Complete broader framework features separately from performance work.

## Limits and reproduction

Chromium 153.0.8010.0, shared Linux host, headless, localhost, 1280×900 viewport, no CPU/network throttling in v0.4. Normal A used seed 22102026; B used 104729. Each has three discarded fresh-context warmup rounds and 15 measured rounds. Fresh-context warmups do not make every operation steady-state. Raw metadata includes CPU, dependencies, browser and timestamps. Dedicated-hardware results may differ.

Commit+layout forces a layout read; double-rAF is only a frame opportunity, not confirmed paint or INP. Input events are synthetic. Startup is local ready time, not LCP. Post-GC JS heap excludes total browser/Wasm memory. p95 with 15 samples and bootstrap intervals are descriptive; no multiple-comparison correction or universal ranking is claimed. React uses flushSync, Vue uses render functions, and the adapters are not certified as globally optimal.

Firefox downloaded but the bounded runtime attempt timed out; WebKit and devices were not checked. No new CPU-throttled campaign, standalone planner rerun, SSR/hydration, scheduler, cached reactive-memo implementation, routing, complete JSX language or public benchmark submission is included. Historical results remain clearly separated.

Run instructions are in README.md. `npm run bench:v04` reproduces the sequential campaign; `npm run report` verifies counts/fingerprints and rebuilds summaries. `npm run check:release` validates the delivered examples/report. The archive contains all source, generated templates, prebuilt fixtures, raw measurements, diagnostic traces, reports and pinned dependency manifests.
