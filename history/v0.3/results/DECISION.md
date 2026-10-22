# v0.3 release decision

Ship the minimal-move reconciliation architecture as the next POC, retaining both JS and Rust/Wasm variants and the i1 control. Do not market this build as fastest in every case. The clearest gain is the reduction in DOM moves, not a blanket benefit from rewriting the frontend in Rust.

## Validation completed

- Three selection iterations: 2,480 measured UI operations. The batch-HTML implementation was rejected after large-creation regressions.
- Three frozen-build final batches: 10,400 measured UI operations across 13 adapters and 20 workloads, with zero recorded output failures. Two normal batches use 15 measured rounds each; CPU x4 uses 10. Each discards three warmup rounds.
- 520 startup observations, 39 exploratory animation traces and 39 lifecycle traces across the final batches.
- 150 additional planner measurements, 16 Node tests and two native Rust tests.
- Both release variants passed 600 seeded randomized updates each, edge cases, retained identity, focus retention, two-move swap assertions and 100 remounts each.

The frozen final UI experiment ran from 08:10:16 to 09:21:37 UTC on 17 October 2026 (about 71 minutes). This duration excludes implementation, selection runs, correctness tests, planner measurement, reporting and packaging.

## Replication and regressions

Median commit plus forced-layout milliseconds. Values compare the previous v0.2 JS-planner adapter with the new JS-planner adapter running under the same batch conditions. All adapter results, including the Wasm version, remain in RELEASE.md and release.html.

| Workload | Normal A: previous → new JS | Normal B: previous → new JS | CPU x4: previous → new JS |
|---|---:|---:|---:|
| swap-rows | 29.40 → 3.30 | 30.70 → 3.20 | 158.95 → 17.75 |
| rotate-1000 | 28.90 → 3.50 | 29.00 → 3.50 | 158.80 → 16.95 |
| clear-5000 | 24.30 → 18.70 | 22.90 → 18.90 | 111.30 → 85.80 |
| update-all | 21.70 → 21.10 | 23.20 → 19.10 | 119.85 → 99.25 |
| update-10pct | 5.30 → 4.60 | 5.20 → 4.50 | 29.15 → 25.90 |
| create-1000 | 30.20 → 28.40 | 27.90 → 30.80 | 148.90 → 157.05 |
| create-5000 | 184.60 → 186.60 | 192.00 → 182.20 | 878.70 → 823.55 |
| create-10000 | 398.00 → 393.30 | 395.10 → 393.00 | 1851.65 → 1840.60 |
| append-1000 | 36.70 → 36.50 | 36.10 → 35.30 | 181.95 → 195.80 |
| replace-1000 | 35.90 → 38.20 | 36.70 → 39.50 | 167.75 → 181.30 |
| shuffle-1000 | 33.50 → 33.00 | 32.10 → 30.40 | 169.35 → 178.95 |

Swap and rotation gains replicate in both normal batches and the throttled batch. Clear, sparse update and full-row update also improve across these batches. Creation and mixed edits do not uniformly improve. In particular, JS replacement regresses in all three batches, and throttled append/shuffle also regress. These are remaining tradeoffs, not excluded data.

For replacement, normal-A commit medians decrease from 7.6 to 7.3 ms while median layout increments increase from 28.1 to 31.4 ms. In normal B, commit decreases from 8.0 to 7.2 ms while layout increments increase from 29.3 to 32.9 ms. Medians of components do not necessarily sum to the median total. The renderer shared by the Wasm candidate does not show the same normal-CPU total regression; the reason for that difference is not established. The Wasm candidate also fails to lead every throttled workload. Do not label these unexplained differences as proven Rust acceleration.

The clone control remains better on several cases, especially throttled rotation/shuffle. The selected delegated renderer is a tradeoff rather than a strict improvement over that control. No per-benchmark switching or selection of the best variant per result is presented as a real implementation.

## Rust/Wasm decision

The standalone identity-planner benchmark includes JS-to-Wasm copying and reusable buffers but no DOM. Median whole-call times are approximately:

| Entries | JS ms | Rust/Wasm ms |
|---|---:|---:|
| 1,000 | 0.004 | 0.004 |
| 10,000 | 0.046 | 0.047 |
| 100,000 | 0.650 | 0.560 |

The large planner workload is about 13.8% faster with Wasm in this run. Smaller sizes show no useful advantage. In the UI, prefix/suffix fast paths often skip the planner entirely. Keep Wasm optional rather than claim every UI operation benefits from Rust.

The JS fixture is 6,624 raw bytes (2,765 gzip). The Wasm fixture totals 26,555 raw bytes including a 19,742-byte Wasm module (10,983 combined gzip bytes). These sizes include the benchmark fixture/API; they are not feature-equivalent framework bundle comparisons. The explorer defaults to the JS candidate for the smaller delivery footprint, with the Wasm candidate available for comparison.

## What remains unresolved

This release does not achieve the requested universal-best timing. It is a tested next POC with strong repeatable reorder gains and explicit remaining losses. Timing is Chromium-only on a shared host; Firefox correctness timed out and WebKit/mobile were not measured. Framework adapters differ in subscriptions, scheduling barriers and feature sets. No claim covers all applications or market frameworks.

The next defensible investigation is a separate matched replacement/creation profile, followed by real application workloads and additional browser/device testing. Any new runtime change should restart frozen-build validation rather than reuse these measurements. Full component lifecycle, routing, SSR/hydration and general key support are product work outside this POC.
