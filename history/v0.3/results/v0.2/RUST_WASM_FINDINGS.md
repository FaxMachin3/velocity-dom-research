# Rust/Wasm v0.2: measured findings

This is a targeted experiment, not proof of a universally faster frontend. The paired control uses the same renderer and identity algorithm; only the planner implementation/boundary differs.

**Decision:** Keep Rust/Wasm optional. The 100k-row planner median is lower in this run, but smaller planners are effectively tied and full UI results are mixed. Next test Rust-resident large datasets with filtering/sorting/aggregation, equivalent JS controls and complete interaction costs. No default-path promotion yet.

## Browser CPU multiplier 1

1400 validated operation samples; 0 failures. 10 measured rounds after 2 warmup rounds. Browser 153.0.8010.0. Lower commit-plus-forced-layout milliseconds is better.

| Workload | Original Velocity | JS control | Rust/Wasm | Wasm vs JS median |
|---|---:|---:|---:|---:|
| append-1000 | 38.95 | 34.05 | 34.55 | 1.5% |
| clear-5000 | 39.30 | 22.10 | 22.25 | 0.7% |
| click-event | 0.40 | 0.50 | 0.50 | 0.0% |
| create-1000 | 35.85 | 31.05 | 30.45 | -1.9% |
| create-5000 | 224.40 | 198.90 | 198.00 | -0.5% |
| dashboard-tick | 0.80 | 0.80 | 0.85 | 6.2% |
| filter-half | 6.15 | 4.10 | 4.10 | -0.0% |
| input-event | 0.60 | 0.60 | 0.60 | 0.0% |
| remove-row | 3.35 | 3.05 | 3.15 | 3.3% |
| replace-1000 | 45.55 | 38.30 | 37.95 | -0.9% |
| select-row | 0.15 | 0.15 | 0.15 | 0.0% |
| sort-1000 | 32.45 | 32.10 | 32.45 | 1.1% |
| swap-rows | 31.55 | 31.55 | 29.55 | -6.3% |
| update-10pct | 5.60 | 5.20 | 5.30 | 1.9% |
## Browser CPU multiplier 4

560 validated operation samples; 0 failures. 10 measured rounds after 2 warmup rounds. Browser 153.0.8010.0. Lower commit-plus-forced-layout milliseconds is better.

| Workload | Original Velocity | JS control | Rust/Wasm | Wasm vs JS median |
|---|---:|---:|---:|---:|
| append-1000 | 215.80 | 177.40 | 169.80 | -4.3% |
| clear-5000 | 198.40 | 103.15 | 107.50 | 4.2% |
| click-event | 2.60 | 2.20 | 2.40 | 9.1% |
| create-1000 | 186.25 | 159.85 | 162.95 | 1.9% |
| create-5000 | 1139.20 | 964.45 | 940.40 | -2.5% |
| dashboard-tick | 4.20 | 3.95 | 3.95 | 0.0% |
| filter-half | 29.00 | 22.20 | 22.90 | 3.2% |
| input-event | 3.05 | 3.05 | 2.90 | -4.9% |
| remove-row | 18.65 | 16.40 | 16.35 | -0.3% |
| replace-1000 | 225.40 | 187.00 | 187.30 | 0.2% |
| select-row | 0.75 | 0.75 | 0.75 | -0.0% |
| sort-1000 | 174.70 | 173.60 | 176.85 | 1.9% |
| swap-rows | 154.50 | 165.55 | 165.80 | 0.2% |
| update-10pct | 28.95 | 28.60 | 29.90 | 4.5% |

## Planner-only experiment

Full planner API includes ID copying into Wasm, but excludes DOM, startup and state reduction. 25 measured rounds after 5 warmup rounds; alternating implementation order. Each observation averages 100 calls (1k/10k) or 10 calls (100k), so these are throughput-style repeated workloads, not individual user-interaction latency. Timer quantization limits interpretation of the smallest values; this is one shared-host run.

| Old rows | JS median ms/call | Rust/Wasm median ms/call | Wasm vs JS |
|---|---:|---:|---:|
| 1000 | 0.0040 | 0.0040 | 0.0% |
| 10000 | 0.0470 | 0.0470 | 0.0% |
| 100000 | 0.6500 | 0.5700 | -12.3% |

## Delivery cost

| Adapter | JS bytes | Wasm bytes | Total raw bytes |
|---|---:|---:|---:|
| velocity | 6484 | 0 | 6484 |
| velocity-js | 4683 | 0 | 4683 |
| velocity-wasm | 4872 | 19742 | 24614 |

## How to interpret this

- Negative percentages mean a lower Wasm median, not demonstrated statistical significance. Small differences on a shared host can be noise; consult results/summary.json for bootstrap intervals. Do not pool CPU profiles or historical runs.
- Both new variants also change DOM creation and events relative to original Velocity. Improvements shared by both are not attributable to Rust.
- Selection, typing and dashboard-only updates do not invoke either planner. Differences in those rows are not evidence for Wasm.
- The planner passes an ID list across the boundary on every structural update. Keeping large application datasets resident in Rust is a separate experiment, not implemented here.
- No real mobile, Firefox/WebKit, slow-network, INP, SSR/hydration or total-process-memory results are included. JS heap measurements exclude some Wasm costs.
- See docs/RUST_WASM.md for architecture, ABI limitations and next-stage gates. Retain the JS implementation until repeatable workload-specific evidence justifies choosing Wasm.
