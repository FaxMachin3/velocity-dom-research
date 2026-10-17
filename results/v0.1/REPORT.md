# Velocity v0.1 benchmark report

Generated from included raw measurements. This is an exploratory localhost/headless comparison of these adapters, not a universal ranking of frameworks.

## JavaScript bundle sizes

Includes fixture, shared model, benchmark API, and framework runtime. Excludes source maps and common CSS. Gzip/Brotli values are calculated, not the transfer encoding used in browser runs.

| Adapter | Raw bytes | Gzip bytes | Brotli bytes |
|---|---:|---:|---:|
| velocity | 6484 | 2453 | 2233 |
| vanilla | 3798 | 1599 | 1420 |
| react | 226239 | 70245 | 60437 |
| preact | 19466 | 8092 | 7374 |
| vue | 58732 | 23286 | 21212 |
| solid | 22252 | 8639 | 7864 |
| svelte | 56839 | 21419 | 19300 |
| lit | 20211 | 7847 | 7093 |

## chromium, CPU multiplier 1

Browser: 153.0.8010.0. Node: v24.19.0. CPU: AMD EPYC 9V74 80-Core Processor. 15 measured rounds after 3 discarded warmup rounds. Failures: 0.

### Median commit + forced layout (milliseconds)

Lower is better. Includes shared state transformation and the adapter flush barrier. Layout is synchronously requested; these are not INP measurements.

| Workload | velocity | vanilla | react | preact | vue | solid | svelte | lit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| create-1000 | 49.80 | 46.80 | 48.90 | 51.60 | 59.70 | 58.70 | 44.10 | 53.70 |
| create-5000 | 363.60 | 281.30 | 347.10 | 339.30 | 352.50 | 380.90 | 301.30 | 323.40 |
| replace-1000 | 60.70 | 60.20 | 62.50 | 70.60 | 68.90 | 58.30 | 60.60 | 83.10 |
| append-1000 | 62.80 | 54.20 | 66.20 | 66.40 | 56.30 | 68.30 | 59.60 | 61.80 |
| update-10pct | 9.80 | 8.60 | 10.30 | 9.40 | 10.70 | 8.90 | 10.60 | 8.50 |
| select-row | 0.30 | 0.20 | 1.10 | 1.40 | 1.30 | 2.70 | 1.30 | 1.00 |
| swap-rows | 48.20 | 54.30 | 53.40 | 5.90 | 6.50 | 7.90 | 7.40 | 6.30 |
| remove-row | 5.90 | 5.00 | 6.70 | 6.00 | 5.90 | 6.90 | 5.90 | 6.10 |
| clear-5000 | 57.10 | 33.00 | 42.20 | 38.40 | 48.30 | 27.90 | 31.70 | 293.30 |
| filter-half | 9.90 | 7.20 | 9.30 | 9.20 | 10.20 | 9.80 | 8.60 | 9.60 |
| sort-1000 | 54.00 | 50.00 | 66.50 | 60.60 | 50.60 | 52.70 | 80.50 | 57.70 |
| input-event | 1.00 | 1.00 | 2.60 | 1.80 | 1.80 | 2.30 | 2.00 | 1.60 |
| click-event | 0.70 | 0.60 | 4.20 | 2.00 | 2.10 | 3.60 | 2.10 | 1.50 |
| dashboard-tick | 1.20 | 1.20 | 2.30 | 2.50 | 2.70 | 2.80 | 2.50 | 1.60 |

### Local cold-context startup and lifecycle observations

Startup ends at application-ready assignment, not paint. Fresh browser contexts do not clear operating-system or browser-process code caches. Memory is one post-GC retained-heap delta after 20 cycles; negative values are possible and do not imply negative allocations. Animation trace: one 120-tick sample per adapter, display pacing dependent.

| Adapter | Ready median ms | Retained heap delta bytes | Tick work median ms | Frame interval p95 ms |
|---|---:|---:|---:|---:|
| velocity | 21.10 | -27636 | 1.10 | 16.70 |
| vanilla | 18.90 | -132832 | 1.40 | 16.70 |
| react | 40.30 | 148800 | 2.10 | 16.80 |
| preact | 21.40 | -51036 | 1.85 | 16.71 |
| vue | 26.30 | 357200 | 2.00 | 16.71 |
| solid | 22.30 | 47740 | 2.50 | 16.80 |
| svelte | 25.90 | -287408 | 1.70 | 16.80 |
| lit | 22.60 | 92924 | 1.60 | 16.80 |

## chromium, CPU multiplier 4

Browser: 153.0.8010.0. Node: v24.19.0. CPU: AMD EPYC 9V74 80-Core Processor. 10 measured rounds after 2 discarded warmup rounds. Failures: 0.

### Median commit + forced layout (milliseconds)

Lower is better. Includes shared state transformation and the adapter flush barrier. Layout is synchronously requested; these are not INP measurements.

| Workload | velocity | vanilla | react | preact | vue | solid | svelte | lit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| create-1000 | 275.90 | 228.60 | 235.10 | 293.60 | 282.20 | 273.65 | 223.15 | 289.20 |
| create-5000 | 2154.90 | 1902.00 | 1971.90 | 2031.55 | 2239.95 | 1950.90 | 1592.70 | 1763.95 |
| replace-1000 | 357.95 | 299.50 | 394.30 | 496.00 | 362.00 | 416.50 | 343.05 | 372.25 |
| append-1000 | 293.85 | 266.30 | 326.75 | 331.90 | 346.35 | 368.25 | 304.90 | 314.85 |
| update-10pct | 55.90 | 48.70 | 56.10 | 52.25 | 54.45 | 47.95 | 51.55 | 56.90 |
| select-row | 1.30 | 1.25 | 6.20 | 5.30 | 5.35 | 13.15 | 5.55 | 4.45 |
| swap-rows | 318.00 | 268.70 | 290.35 | 32.60 | 35.35 | 34.85 | 36.55 | 35.15 |
| remove-row | 28.05 | 29.50 | 30.95 | 30.80 | 30.70 | 34.55 | 31.00 | 31.05 |
| clear-5000 | 295.20 | 152.05 | 220.90 | 216.90 | 242.65 | 135.70 | 143.90 | 1653.10 |
| filter-half | 50.05 | 41.50 | 48.70 | 50.45 | 58.20 | 43.90 | 48.50 | 45.80 |
| sort-1000 | 360.50 | 250.10 | 315.60 | 479.65 | 294.35 | 300.90 | 391.25 | 371.80 |
| input-event | 6.50 | 4.35 | 13.30 | 8.80 | 9.50 | 12.15 | 11.85 | 7.70 |
| click-event | 3.15 | 3.00 | 10.20 | 7.65 | 7.80 | 14.45 | 10.75 | 7.00 |
| dashboard-tick | 5.90 | 5.50 | 11.10 | 11.25 | 13.35 | 13.05 | 13.30 | 9.25 |

### Local cold-context startup and lifecycle observations

Startup ends at application-ready assignment, not paint. Fresh browser contexts do not clear operating-system or browser-process code caches. Memory is one post-GC retained-heap delta after 20 cycles; negative values are possible and do not imply negative allocations. Animation trace: one 120-tick sample per adapter, display pacing dependent.

| Adapter | Ready median ms | Retained heap delta bytes | Tick work median ms | Frame interval p95 ms |
|---|---:|---:|---:|---:|
| velocity | 74.20 | 49448 | 5.90 | 33.40 |
| vanilla | 59.75 | 14620 | 5.90 | 50.00 |
| react | 139.15 | 129036 | 9.15 | 50.00 |
| preact | 76.60 | 17096 | 8.50 | 33.41 |
| vue | 90.00 | 467908 | 9.55 | 50.10 |
| solid | 69.55 | 49380 | 13.05 | 50.10 |
| svelte | 83.60 | 108996 | 8.20 | 33.40 |
| lit | 79.35 | 21284 | 9.60 | 50.10 |

## Interpretation limits

- All adapters render the same rows, input, and 128 dashboard cells. They use different idiomatic update strategies; source review is essential.
- React uses memoized rows/cells and a synchronous flush barrier, not React Compiler. Vue uses render functions, not SFC compilation. Lit measures lit-html rendering, not LitElement lifecycle. Solid uses keyed store reconciliation.
- The POC is a much smaller feature set than mature frameworks. Bundle size is not a feature-parity comparison.
- New browser contexts and seeded shuffled order reduce some bias but cannot remove shared-host noise.
- Double requestAnimationFrame is only a frame-opportunity proxy; it does not prove that content was painted.
- No real mobile devices, slow-network tests, SSR, hydration, GPU, Wasm, or accessibility certification are included.
- Median bootstrap intervals and p95 values are in summary.json. Small samples and shared-host correlations limit statistical confidence. There is no aggregate winner score.

Velocity and vanilla use a per-row selection registry; competing adapters use different selection propagation strategies. The targeted-update advantage is partly an adapter design choice, not proof of an unavoidable framework limitation. See docs/METHODOLOGY.md and results/FINDINGS.md.
