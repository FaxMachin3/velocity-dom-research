# Velocity v0.2 benchmark report

Generated from included raw measurements. This is an exploratory localhost/headless comparison of these adapters, not a universal ranking of frameworks.

## JavaScript bundle sizes

Includes fixture, shared model, benchmark API, and framework runtime. Excludes source maps and common CSS. Gzip/Brotli values are calculated, not the transfer encoding used in browser runs.

| Adapter | Raw bytes | Gzip bytes | Brotli bytes |
|---|---:|---:|---:|
| velocity | 6484 | 2453 | 2233 |
| velocity-js | 4683 | 1966 | 1762 |
| velocity-wasm | 4872 | 2054 | 1829 |
| vanilla | 3798 | 1599 | 1420 |
| react | 226239 | 70245 | 60437 |
| preact | 19466 | 8092 | 7374 |
| vue | 58732 | 23286 | 21212 |
| solid | 22252 | 8639 | 7864 |
| svelte | 56839 | 21419 | 19300 |
| lit | 20211 | 7847 | 7093 |

### Wasm-inclusive delivery

| Adapter | JS + Wasm raw bytes | Wasm raw bytes | Wasm gzip bytes |
|---|---:|---:|---:|
| velocity | 6484 | 0 | 0 |
| velocity-js | 4683 | 0 | 0 |
| velocity-wasm | 24614 | 19742 | 8101 |
| vanilla | 3798 | 0 | 0 |
| react | 226239 | 0 | 0 |
| preact | 19466 | 0 | 0 |
| vue | 58732 | 0 | 0 |
| solid | 22252 | 0 | 0 |
| svelte | 56839 | 0 | 0 |
| lit | 20211 | 0 | 0 |

## chromium, CPU multiplier 1

Browser: 153.0.8010.0. Node: v24.19.0. CPU: AMD EPYC 9V74 80-Core Processor. 10 measured rounds after 2 discarded warmup rounds. Failures: 0.

### Median commit + forced layout (milliseconds)

Lower is better. Includes shared state transformation and the adapter flush barrier. Layout is synchronously requested; these are not INP measurements.

| Workload | velocity | velocity-js | velocity-wasm | vanilla | react | preact | vue | solid | svelte | lit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| create-1000 | 35.85 | 31.05 | 30.45 | 30.15 | 33.70 | 36.80 | 36.00 | 34.45 | 30.95 | 34.00 |
| create-5000 | 224.40 | 198.90 | 198.00 | 205.75 | 247.60 | 231.85 | 211.40 | 218.55 | 210.95 | 212.05 |
| replace-1000 | 45.55 | 38.30 | 37.95 | 40.55 | 44.45 | 48.00 | 44.45 | 41.80 | 39.90 | 49.60 |
| append-1000 | 38.95 | 34.05 | 34.55 | 36.25 | 41.60 | 43.95 | 41.20 | 43.65 | 37.80 | 40.60 |
| update-10pct | 5.60 | 5.20 | 5.30 | 5.45 | 6.00 | 6.30 | 6.55 | 5.80 | 5.45 | 5.20 |
| select-row | 0.15 | 0.15 | 0.15 | 0.20 | 0.80 | 1.00 | 0.75 | 1.85 | 0.80 | 0.55 |
| swap-rows | 31.55 | 31.55 | 29.55 | 32.20 | 35.05 | 4.35 | 4.00 | 4.55 | 3.95 | 3.70 |
| remove-row | 3.35 | 3.05 | 3.15 | 3.25 | 4.30 | 3.40 | 3.70 | 4.35 | 3.85 | 3.75 |
| clear-5000 | 39.30 | 22.10 | 22.25 | 23.35 | 30.10 | 29.95 | 33.30 | 19.75 | 22.05 | 241.90 |
| filter-half | 6.15 | 4.10 | 4.10 | 4.00 | 5.45 | 5.60 | 5.95 | 5.90 | 5.00 | 4.90 |
| sort-1000 | 32.45 | 32.10 | 32.45 | 32.25 | 32.50 | 36.95 | 35.15 | 33.85 | 53.55 | 37.85 |
| input-event | 0.60 | 0.60 | 0.60 | 0.60 | 2.05 | 1.45 | 1.05 | 1.65 | 1.35 | 1.00 |
| click-event | 0.40 | 0.50 | 0.50 | 0.40 | 2.00 | 1.25 | 1.40 | 2.35 | 1.50 | 1.05 |
| dashboard-tick | 0.80 | 0.80 | 0.85 | 0.80 | 1.35 | 1.95 | 1.45 | 1.85 | 1.75 | 1.05 |

### Local cold-context startup and lifecycle observations

Startup ends at application-ready assignment, not paint. Fresh browser contexts do not clear operating-system or browser-process code caches. Memory is one post-GC JavaScript retained-heap delta after 20 cycles (not total process or Wasm memory); negative values are possible and do not imply negative allocations. Animation trace: one 120-tick sample per adapter, display pacing dependent.

| Adapter | Ready median ms | Retained heap delta bytes | Tick work median ms | Frame interval p95 ms |
|---|---:|---:|---:|---:|
| velocity | 12.25 | -29800 | 0.80 | 16.70 |
| velocity-js | 11.15 | -70512 | 0.80 | 16.80 |
| velocity-wasm | 15.85 | 23828 | 0.80 | 16.70 |
| vanilla | 11.20 | -136288 | 0.80 | 16.70 |
| react | 28.00 | -593288 | 1.10 | 16.80 |
| preact | 15.15 | -161684 | 1.10 | 16.70 |
| vue | 15.80 | -1823000 | 1.10 | 16.80 |
| solid | 14.25 | 34104 | 1.60 | 16.80 |
| svelte | 15.65 | -299728 | 1.00 | 16.70 |
| lit | 14.65 | -654132 | 0.90 | 16.70 |

## chromium, CPU multiplier 4

Browser: 153.0.8010.0. Node: v24.19.0. CPU: AMD EPYC 9V74 80-Core Processor. 10 measured rounds after 2 discarded warmup rounds. Failures: 0.

### Median commit + forced layout (milliseconds)

Lower is better. Includes shared state transformation and the adapter flush barrier. Layout is synchronously requested; these are not INP measurements.

| Workload | velocity | velocity-js | velocity-wasm | vanilla | react | preact | vue | solid | svelte | lit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| create-1000 | 186.25 | 159.85 | 162.95 | 149.90 | — | — | — | — | — | — |
| create-5000 | 1139.20 | 964.45 | 940.40 | 949.70 | — | — | — | — | — | — |
| replace-1000 | 225.40 | 187.00 | 187.30 | 202.25 | — | — | — | — | — | — |
| append-1000 | 215.80 | 177.40 | 169.80 | 193.15 | — | — | — | — | — | — |
| update-10pct | 28.95 | 28.60 | 29.90 | 28.20 | — | — | — | — | — | — |
| select-row | 0.75 | 0.75 | 0.75 | 1.20 | — | — | — | — | — | — |
| swap-rows | 154.50 | 165.55 | 165.80 | 167.45 | — | — | — | — | — | — |
| remove-row | 18.65 | 16.40 | 16.35 | 17.15 | — | — | — | — | — | — |
| clear-5000 | 198.40 | 103.15 | 107.50 | 110.80 | — | — | — | — | — | — |
| filter-half | 29.00 | 22.20 | 22.90 | 24.50 | — | — | — | — | — | — |
| sort-1000 | 174.70 | 173.60 | 176.85 | 171.90 | — | — | — | — | — | — |
| input-event | 3.05 | 3.05 | 2.90 | 3.15 | — | — | — | — | — | — |
| click-event | 2.60 | 2.20 | 2.40 | 2.15 | — | — | — | — | — | — |
| dashboard-tick | 4.20 | 3.95 | 3.95 | 4.35 | — | — | — | — | — | — |

### Local cold-context startup and lifecycle observations

Startup ends at application-ready assignment, not paint. Fresh browser contexts do not clear operating-system or browser-process code caches. Memory is one post-GC JavaScript retained-heap delta after 20 cycles (not total process or Wasm memory); negative values are possible and do not imply negative allocations. Animation trace: one 120-tick sample per adapter, display pacing dependent.

| Adapter | Ready median ms | Retained heap delta bytes | Tick work median ms | Frame interval p95 ms |
|---|---:|---:|---:|---:|
| velocity | 34.70 | 49180 | 3.40 | 16.70 |
| velocity-js | 34.90 | 25504 | 3.00 | 16.70 |
| velocity-wasm | 44.05 | 18456 | 3.20 | 16.70 |
| vanilla | 34.05 | -135784 | 3.75 | 16.70 |
| react | — | not measured | — | — |
| preact | — | not measured | — | — |
| vue | — | not measured | — | — |
| solid | — | not measured | — | — |
| svelte | — | not measured | — | — |
| lit | — | not measured | — | — |

## Interpretation limits

- All adapters render the same rows, input, and 128 dashboard cells. They use different idiomatic update strategies; source review is essential.
- React uses memoized rows/cells and a synchronous flush barrier, not React Compiler. Vue uses render functions, not SFC compilation. Lit measures lit-html rendering, not LitElement lifecycle. Solid uses keyed store reconciliation.
- The POC is a much smaller feature set than mature frameworks. Bundle size is not a feature-parity comparison.
- New browser contexts and seeded shuffled order reduce some bias but cannot remove shared-host noise.
- Double requestAnimationFrame is only a frame-opportunity proxy; it does not prove that content was painted.
- No real mobile devices, slow-network tests, SSR, hydration, GPU, or accessibility certification are included.
- Median bootstrap intervals and p95 values are in summary.json. Small samples and shared-host correlations limit statistical confidence. There is no aggregate winner score.

Velocity and vanilla use a per-row selection registry; competing adapters use different selection propagation strategies. The targeted-update advantage is partly an adapter design choice, not proof of an unavoidable framework limitation. See docs/METHODOLOGY.md and results/FINDINGS.md.
