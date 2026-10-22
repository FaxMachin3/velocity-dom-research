# Velocity v0.3 release evidence

Final binaries were frozen across all three batches. Selection runs are excluded from these estimates. These are shared-host headless measurements of specific adapters, not proof of universal framework superiority. Median commit + forced-layout milliseconds; lower is better.

**10,400 final UI measurements, zero recorded output failures.** The full matrix, p95, bootstrap intervals, startup and bundle sizes are in release.html and release-summary.json.

## run-chromium-cpu1.json

CPU multiplier 1, seed 20261017, 15 rounds after 3 warmups.

| Workload | v0.3 JS | v0.3 Wasm | i1 clone control | v0.2 JS | Lowest external median |
|---|---:|---:|---:|---:|---|
| append-1000 | 36.50 | 36.30 | 36.50 | 36.70 | vanilla: 37.20 |
| clear-5000 | 18.70 | 19.20 | 18.90 | 24.30 | solid: 21.00 |
| click-event | 0.50 | 0.40 | 0.40 | 0.50 | vanilla: 0.40 |
| create-1000 | 28.40 | 27.80 | 29.20 | 30.20 | svelte: 31.30 |
| create-10000 | 393.30 | 393.10 | 411.10 | 398.00 | vanilla: 403.10 |
| create-5000 | 186.60 | 195.30 | 192.70 | 184.60 | lit: 193.30 |
| dashboard-tick | 0.70 | 0.70 | 0.70 | 0.80 | vanilla: 0.90 |
| filter-half | 4.10 | 4.40 | 4.10 | 4.20 | vanilla: 3.80 |
| input-event | 0.60 | 0.50 | 0.60 | 0.60 | vanilla: 0.60 |
| noop-1000 | 0.00 | 0.00 | 0.00 | 0.10 | vanilla: 0.00 |
| remove-row | 2.90 | 2.50 | 2.80 | 3.00 | vanilla: 3.20 |
| replace-1000 | 38.20 | 33.90 | 36.00 | 35.90 | vanilla: 36.30 |
| reverse-1000 | 31.20 | 32.10 | 30.50 | 33.10 | vanilla: 30.80 |
| rotate-1000 | 3.50 | 3.40 | 3.20 | 28.90 | lit: 3.60 |
| select-row | 0.10 | 0.20 | 0.10 | 0.20 | vanilla: 0.20 |
| shuffle-1000 | 33.00 | 30.70 | 31.70 | 33.50 | vue: 32.40 |
| sort-1000 | 30.80 | 31.30 | 31.00 | 32.70 | vue: 31.70 |
| swap-rows | 3.30 | 3.10 | 3.40 | 29.40 | preact: 3.60 |
| update-10pct | 4.60 | 4.80 | 4.50 | 5.30 | lit: 5.00 |
| update-all | 21.10 | 20.20 | 20.00 | 21.70 | svelte: 22.30 |

## replication/run-chromium-cpu1.json

CPU multiplier 1, seed 104729, 15 rounds after 3 warmups.

| Workload | v0.3 JS | v0.3 Wasm | i1 clone control | v0.2 JS | Lowest external median |
|---|---:|---:|---:|---:|---|
| append-1000 | 35.30 | 36.80 | 36.90 | 36.10 | vanilla: 39.80 |
| clear-5000 | 18.90 | 18.80 | 18.70 | 22.90 | solid: 21.90 |
| click-event | 0.40 | 0.50 | 0.40 | 0.40 | vanilla: 0.40 |
| create-1000 | 30.80 | 31.20 | 30.60 | 27.90 | vanilla: 31.20 |
| create-10000 | 393.00 | 388.70 | 405.30 | 395.10 | vanilla: 388.50 |
| create-5000 | 182.20 | 179.90 | 196.70 | 192.00 | vanilla: 191.20 |
| dashboard-tick | 0.70 | 0.70 | 0.70 | 0.90 | vanilla: 0.80 |
| filter-half | 4.30 | 4.20 | 4.50 | 4.00 | vanilla: 4.30 |
| input-event | 0.60 | 0.50 | 0.60 | 0.60 | vanilla: 0.60 |
| noop-1000 | 0.00 | 0.00 | 0.00 | 0.10 | vanilla: 0.00 |
| remove-row | 3.00 | 2.80 | 2.90 | 3.00 | vue: 3.40 |
| replace-1000 | 39.50 | 36.10 | 37.10 | 36.70 | vanilla: 36.70 |
| reverse-1000 | 31.40 | 30.80 | 30.00 | 33.60 | vanilla: 32.10 |
| rotate-1000 | 3.50 | 3.40 | 3.50 | 29.00 | lit: 3.60 |
| select-row | 0.10 | 0.20 | 0.20 | 0.20 | vanilla: 0.20 |
| shuffle-1000 | 30.40 | 30.40 | 30.10 | 32.10 | vue: 31.40 |
| sort-1000 | 33.40 | 32.80 | 32.30 | 34.30 | vue: 33.10 |
| swap-rows | 3.20 | 3.50 | 3.10 | 30.70 | lit: 3.50 |
| update-10pct | 4.50 | 4.70 | 4.80 | 5.20 | vanilla: 5.50 |
| update-all | 19.10 | 19.30 | 19.20 | 23.20 | lit: 22.10 |

## run-chromium-cpu4.json

CPU multiplier 4, seed 65537, 10 rounds after 3 warmups.

| Workload | v0.3 JS | v0.3 Wasm | i1 clone control | v0.2 JS | Lowest external median |
|---|---:|---:|---:|---:|---|
| append-1000 | 195.80 | 185.50 | 189.60 | 181.95 | vanilla: 195.50 |
| clear-5000 | 85.80 | 86.80 | 87.35 | 111.30 | solid: 101.05 |
| click-event | 2.10 | 1.95 | 2.25 | 2.35 | vanilla: 2.30 |
| create-1000 | 157.05 | 152.05 | 160.80 | 148.90 | vanilla: 159.55 |
| create-10000 | 1840.60 | 1762.55 | 1769.80 | 1851.65 | vanilla: 1765.30 |
| create-5000 | 823.55 | 810.95 | 874.00 | 878.70 | vanilla: 879.50 |
| dashboard-tick | 3.20 | 3.55 | 3.05 | 4.10 | vanilla: 4.00 |
| filter-half | 23.40 | 23.55 | 23.15 | 23.70 | vanilla: 20.50 |
| input-event | 2.80 | 2.90 | 2.95 | 3.05 | vanilla: 2.65 |
| noop-1000 | 0.00 | 0.10 | 0.05 | 0.20 | preact: 0.05 |
| remove-row | 16.40 | 15.75 | 16.25 | 15.45 | vue: 16.85 |
| replace-1000 | 181.30 | 172.05 | 178.95 | 167.75 | vanilla: 173.70 |
| reverse-1000 | 170.60 | 153.45 | 180.25 | 174.45 | vanilla: 156.60 |
| rotate-1000 | 16.95 | 16.65 | 14.65 | 158.80 | preact: 17.80 |
| select-row | 0.90 | 0.90 | 0.80 | 0.75 | vanilla: 1.05 |
| shuffle-1000 | 178.95 | 158.60 | 151.10 | 169.35 | preact: 159.95 |
| sort-1000 | 158.50 | 178.65 | 168.80 | 172.45 | vue: 171.30 |
| swap-rows | 17.75 | 17.95 | 16.70 | 158.95 | lit: 19.40 |
| update-10pct | 25.90 | 25.80 | 24.25 | 29.15 | lit: 28.70 |
| update-all | 99.25 | 88.75 | 102.85 | 119.85 | svelte: 102.25 |

## Interpretation and remaining limits

- Use both independent normal-CPU batches to assess consistency; do not select the batch with the best result. CPU throttling is a separate sensitivity test.
- Differences near 0.1 ms and sub-millisecond no-op ratios are poorly resolved. Bootstrap intervals are descriptive, not multiple-comparison-corrected proof of leadership.
- The fixture uses immutable snapshots and unique u32 keys. New renderers specialize to the fixture while exposing a reusable keyed-list primitive. Routing, hydration, a full component system and mature-framework feature parity are absent.
- DOM output, retained identities, focus, escaping and lifecycle were checked. No virtualization, benchmark-name detection or deferred work was used to reduce measured work.
- Wasm handles unresolved identity matching only; DOM updates and LIS are JavaScript. Prefix/suffix fast paths can bypass the planner for creation, append, simple deletion and same-key updates, so a lower Wasm-labelled creation time is not a Rust kernel win. Startup includes Wasm fetch/compile, and size includes its binary.
- Firefox downloaded but the bounded correctness attempt timed out; no Firefox performance result is claimed. WebKit and physical devices were not measured.
- JS-heap lifecycle deltas do not measure total process/Wasm memory. Frame callbacks do not prove paint or INP.
- Rejected batch-HTML candidate and all selection measurements are retained under iterations/. See docs/V03_EXPERIMENT_PROTOCOL.md and iterations/LOG.md.
