# Velocity v0.4 evidence

The compiled candidate uses public templates, owned cleanup, general string/number keys and multi-node blocks. Controls use the unchanged v0.3 and external adapters. These are shared-host Chromium measurements, not universal framework rankings. The new compiled candidate is JS-only; the unchanged Rust/Wasm renderer remains a control.

## focused-warm-90210.json

360 validated samples. Median commit + forced layout in milliseconds; lower is better.

| Workload | velocity-next-clone | velocity-next | velocity-direct-sibling | velocity-delegated-index |
|---|---:|---:|---:|---:|
| replace-1000 | 45.40 | 40.25 | 41.50 | 42.50 |
| shuffle-1000 | 42.50 | 46.60 | 42.15 | 44.75 |
| append-1000 | 40.95 | 41.05 | 41.20 | 40.40 |

## focused-fresh-19283.json

180 validated samples. Median commit + forced layout in milliseconds; lower is better.

| Workload | velocity-next-clone | velocity-next | velocity-direct-sibling | velocity-delegated-index |
|---|---:|---:|---:|---:|
| shuffle-1000 | 43.10 | 41.70 | 41.30 | 42.00 |
| append-1000 | 54.20 | 49.80 | 51.30 | 48.20 |
| replace-1000 | 49.90 | 47.20 | 46.90 | 48.50 |

## normal-a/run-chromium-cpu1.json

3600 validated samples. Median commit + forced layout in milliseconds; lower is better.

| Workload | velocity-compiled | velocity-next | velocity-next-wasm | velocity-next-clone | velocity-js | vanilla | react | preact | vue | solid | svelte | lit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| reverse-1000 | 41.10 | 41.00 | 40.10 | 40.80 | 40.50 | 39.40 | 41.80 | 47.30 | 41.10 | 46.00 | 75.30 | 45.20 |
| noop-1000 | 0.10 | 0.00 | 0.00 | 0.00 | 0.00 | 0.10 | 0.10 | 0.00 | 0.00 | 1.20 | 0.10 | 0.40 |
| create-10000 | 497.50 | 443.10 | 431.20 | 459.20 | 464.20 | 467.70 | 678.20 | 514.60 | 503.40 | 498.90 | 479.40 | 519.30 |
| click-event | 1.50 | 0.50 | 0.50 | 0.50 | 0.60 | 0.60 | 1.80 | 1.40 | 1.10 | 2.50 | 1.50 | 1.00 |
| shuffle-1000 | 39.10 | 38.30 | 36.70 | 38.90 | 39.40 | 45.10 | 44.00 | 41.80 | 39.10 | 42.80 | 51.80 | 47.30 |
| replace-1000 | 46.30 | 43.60 | 43.70 | 42.70 | 44.50 | 46.70 | 52.70 | 57.80 | 54.30 | 49.00 | 49.20 | 59.20 |
| swap-rows | 4.90 | 4.30 | 4.40 | 4.40 | 40.20 | 41.70 | 40.60 | 5.10 | 4.70 | 6.10 | 4.90 | 4.70 |
| select-row | 1.00 | 0.20 | 0.20 | 0.20 | 0.20 | 0.20 | 0.80 | 1.00 | 1.00 | 2.00 | 1.00 | 0.50 |
| clear-5000 | 26.10 | 20.60 | 20.80 | 20.80 | 27.00 | 28.10 | 33.50 | 31.60 | 37.10 | 23.40 | 24.60 | 274.40 |
| update-all | 28.10 | 26.00 | 23.60 | 24.90 | 30.80 | 28.60 | 32.20 | 30.40 | 38.90 | 30.90 | 27.10 | 25.50 |
| create-1000 | 40.90 | 34.60 | 33.50 | 35.20 | 35.70 | 36.80 | 38.80 | 41.40 | 39.90 | 40.00 | 36.40 | 37.50 |
| input-event | 0.70 | 0.70 | 0.70 | 0.70 | 0.70 | 0.70 | 2.40 | 1.50 | 1.30 | 1.80 | 1.80 | 1.20 |
| update-10pct | 6.50 | 6.10 | 5.60 | 6.00 | 6.90 | 6.60 | 9.10 | 7.00 | 9.70 | 7.70 | 7.60 | 6.40 |
| dashboard-tick | 1.00 | 0.80 | 0.80 | 0.90 | 1.00 | 1.10 | 1.70 | 1.80 | 1.60 | 2.20 | 1.80 | 1.40 |
| rotate-1000 | 4.80 | 4.60 | 4.60 | 4.30 | 39.90 | 36.20 | 5.30 | 4.80 | 4.90 | 6.40 | 5.60 | 4.60 |
| append-1000 | 50.50 | 42.10 | 41.70 | 45.90 | 45.70 | 47.70 | 50.00 | 53.80 | 51.60 | 51.10 | 50.30 | 54.60 |
| create-5000 | 270.50 | 226.30 | 211.70 | 222.50 | 224.80 | 223.80 | 295.60 | 252.20 | 257.10 | 260.00 | 219.50 | 248.00 |
| filter-half | 7.10 | 6.10 | 5.40 | 5.60 | 5.70 | 6.40 | 7.30 | 8.00 | 7.50 | 8.10 | 7.50 | 7.20 |
| sort-1000 | 38.90 | 41.70 | 37.50 | 40.10 | 39.80 | 39.50 | 44.20 | 43.90 | 38.50 | 42.90 | 59.10 | 42.30 |
| remove-row | 4.20 | 3.80 | 3.60 | 3.80 | 4.50 | 4.50 | 4.80 | 4.50 | 4.40 | 5.80 | 4.40 | 4.60 |

## normal-b/run-chromium-cpu1.json

1800 validated samples. Median commit + forced layout in milliseconds; lower is better.

| Workload | velocity-compiled | velocity-next | vanilla | react | solid | svelte |
|---|---:|---:|---:|---:|---:|---:|
| update-all | 29.00 | 26.40 | 30.20 | 36.30 | 36.40 | 31.80 |
| input-event | 0.70 | 0.80 | 0.80 | 2.40 | 2.00 | 1.50 |
| append-1000 | 57.00 | 48.60 | 50.20 | 55.40 | 52.30 | 47.90 |
| noop-1000 | 0.10 | 0.00 | 0.00 | 0.10 | 1.00 | 0.00 |
| create-5000 | 272.30 | 221.90 | 230.00 | 271.60 | 250.30 | 235.80 |
| create-1000 | 45.20 | 36.20 | 40.50 | 44.70 | 45.20 | 42.20 |
| click-event | 1.50 | 0.50 | 0.50 | 2.30 | 2.60 | 1.70 |
| remove-row | 4.40 | 3.60 | 5.00 | 5.30 | 5.80 | 5.20 |
| create-10000 | 541.10 | 474.70 | 475.80 | 742.90 | 554.60 | 476.60 |
| reverse-1000 | 41.40 | 40.00 | 46.60 | 44.70 | 46.00 | 77.20 |
| rotate-1000 | 4.90 | 4.60 | 44.50 | 5.60 | 6.80 | 5.50 |
| filter-half | 7.60 | 6.00 | 6.30 | 7.80 | 8.10 | 7.70 |
| dashboard-tick | 1.00 | 0.80 | 1.10 | 2.10 | 2.20 | 2.00 |
| shuffle-1000 | 40.90 | 38.00 | 44.20 | 44.40 | 42.60 | 46.60 |
| clear-5000 | 27.60 | 22.20 | 28.50 | 39.60 | 26.90 | 27.70 |
| swap-rows | 4.90 | 4.70 | 38.60 | 42.80 | 6.80 | 4.80 |
| select-row | 0.80 | 0.20 | 0.30 | 1.00 | 2.20 | 1.20 |
| update-10pct | 7.10 | 6.40 | 7.60 | 8.70 | 8.40 | 7.90 |
| sort-1000 | 44.40 | 39.80 | 42.80 | 47.80 | 44.50 | 63.70 |
| replace-1000 | 50.80 | 48.90 | 46.40 | 56.60 | 51.20 | 49.20 |

## Supplementary observations: normal-a/run-chromium-cpu1.json

Startup is localhost application-ready time (15 samples), not LCP or WAN loading. Animation and post-GC heap are single exploratory runs. Heap delta is not total memory or a leak verdict.

| Adapter | Startup median ms | Startup p95 ms | Tick work median ms | Frame interval p95 ms | Post-GC JS heap delta bytes |
|---|---:|---:|---:|---:|---:|
| velocity-compiled | 16.60 | 20.73 | 1.00 | 16.70 | 3364 |
| velocity-next | 16.30 | 20.79 | 0.90 | 16.71 | -103580 |
| velocity-next-wasm | 24.70 | 35.18 | 0.90 | 16.80 | -103532 |
| velocity-next-clone | 15.70 | 19.86 | 1.00 | 16.80 | -100016 |
| velocity-js | 14.70 | 23.15 | 1.05 | 16.80 | -70512 |
| vanilla | 15.80 | 19.91 | 1.10 | 16.70 | -114440 |
| react | 35.40 | 43.12 | 1.60 | 16.70 | -592320 |
| preact | 18.20 | 20.79 | 1.80 | 16.71 | -230912 |
| vue | 22.00 | 30.57 | 1.50 | 16.80 | -1954556 |
| solid | 18.30 | 22.33 | 2.00 | 16.80 | -1001516 |
| svelte | 21.50 | 26.63 | 1.50 | 16.80 | -288548 |
| lit | 19.70 | 30.11 | 1.20 | 16.71 | -655848 |

## Supplementary observations: normal-b/run-chromium-cpu1.json

Startup is localhost application-ready time (15 samples), not LCP or WAN loading. Animation and post-GC heap are single exploratory runs. Heap delta is not total memory or a leak verdict.

| Adapter | Startup median ms | Startup p95 ms | Tick work median ms | Frame interval p95 ms | Post-GC JS heap delta bytes |
|---|---:|---:|---:|---:|---:|
| velocity-compiled | 20.00 | 23.02 | 0.90 | 16.70 | 4536 |
| velocity-next | 17.10 | 22.68 | 0.90 | 16.80 | -103652 |
| vanilla | 14.90 | 21.09 | 0.90 | 16.80 | -114440 |
| react | 37.20 | 49.05 | 1.50 | 16.70 | 149184 |
| solid | 19.80 | 26.35 | 2.10 | 16.80 | 86064 |
| svelte | 23.40 | 27.15 | 1.60 | 16.70 | -283836 |

## Delivered fixture size

Includes fixture, model, benchmark interface and runtime; excludes CSS and source maps. Compiler dependencies are build-time only.

| Adapter | Raw JS bytes | Raw Wasm bytes | Combined gzip bytes |
|---|---:|---:|---:|
| velocity-direct-sibling | 6476 | 0 | 2709 |
| velocity-delegated-index | 6625 | 0 | 2761 |
| velocity-compiled | 8931 | 0 | 3769 |
| velocity-next-clone | 6462 | 0 | 2689 |
| velocity-next | 6624 | 0 | 2765 |
| velocity-next-wasm | 6813 | 19742 | 10983 |
| velocity | 6892 | 0 | 2596 |
| velocity-js | 5091 | 0 | 2104 |
| velocity-wasm | 5280 | 19742 | 10302 |
| vanilla | 4206 | 0 | 1746 |
| react | 226647 | 0 | 70394 |
| preact | 19874 | 0 | 8246 |
| vue | 59140 | 0 | 23424 |
| solid | 22660 | 0 | 8783 |
| svelte | 57247 | 0 | 21567 |
| lit | 20619 | 0 | 7993 |

## Interpretation

- Focused warm/fresh experiments cross event handling and node-binding choices on three prespecified workloads. They are not pooled with the final validation matrix.
- Normal A uses 12 adapters; normal B repeats a prespecified subset of six. Both retain the previous fresh-context mixed-workload protocol. The subset is disclosed, not treated as complete replication.
- Per-case p95 and bootstrap intervals are descriptive with small samples, shared-host noise and no multiple-comparison correction.
- Application workloads measure the compiled runtime alone, not comparative superiority. Traces are single diagnostic observations, not performance estimates.
- The release does not provide a full JSX component language, cached reactive memo implementation, concurrent scheduling, routing, SSR or hydration. The compiler emits fixed templates and explicit keyed-list directives.
- Old v0.3 reports are preserved in history/v0.3/results. Do not attribute cross-session changes to implementation.
