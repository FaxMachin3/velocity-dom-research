# Velocity v0.3 benchmark report

Generated from included raw measurements. This is an exploratory localhost/headless comparison of these adapters, not a universal ranking of frameworks.

## JavaScript bundle sizes

Includes fixture, shared model, benchmark API, and framework runtime. Excludes source maps and common CSS. Gzip/Brotli values are calculated, not the transfer encoding used in browser runs.

| Adapter | Raw bytes | Gzip bytes | Brotli bytes |
|---|---:|---:|---:|
| velocity-next-clone | 6462 | 2689 | 2431 |
| velocity-next | 6624 | 2765 | 2491 |
| velocity-next-wasm | 6813 | 2882 | 2586 |
| velocity | 6892 | 2596 | 2364 |
| velocity-js | 5091 | 2104 | 1889 |
| velocity-wasm | 5280 | 2201 | 1964 |
| vanilla | 4206 | 1746 | 1559 |
| react | 226647 | 70394 | 60538 |
| preact | 19874 | 8246 | 7521 |
| vue | 59140 | 23424 | 21315 |
| solid | 22660 | 8783 | 8030 |
| svelte | 57247 | 21567 | 19434 |
| lit | 20619 | 7993 | 7215 |

### Wasm-inclusive delivery

| Adapter | JS + Wasm raw bytes | Wasm raw bytes | Wasm gzip bytes |
|---|---:|---:|---:|
| velocity-next-clone | 6462 | 0 | 0 |
| velocity-next | 6624 | 0 | 0 |
| velocity-next-wasm | 26555 | 19742 | 8101 |
| velocity | 6892 | 0 | 0 |
| velocity-js | 5091 | 0 | 0 |
| velocity-wasm | 25022 | 19742 | 8101 |
| vanilla | 4206 | 0 | 0 |
| react | 226647 | 0 | 0 |
| preact | 19874 | 0 | 0 |
| vue | 59140 | 0 | 0 |
| solid | 22660 | 0 | 0 |
| svelte | 57247 | 0 | 0 |
| lit | 20619 | 0 | 0 |

## run-chromium-cpu1.json: chromium, CPU multiplier 1

Browser: 153.0.8010.0. Node: v24.19.0. CPU: AMD EPYC 9V74 80-Core Processor. 15 measured rounds after 3 discarded warmup rounds. Failures: 0.

### Median commit + forced layout (milliseconds)

Lower is better. Includes shared state transformation and the adapter flush barrier. Layout is synchronously requested; these are not INP measurements.

| Workload | velocity-next-clone | velocity-next | velocity-next-wasm | velocity | velocity-js | velocity-wasm | vanilla | react | preact | vue | solid | svelte | lit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| create-10000 | 411.10 | 393.30 | 393.10 | 435.80 | 398.00 | 394.50 | 403.10 | 586.00 | 456.80 | 457.60 | 444.00 | 421.80 | 433.20 |
| update-all | 20.00 | 21.10 | 20.20 | 27.80 | 21.70 | 22.20 | 23.40 | 27.20 | 29.70 | 33.80 | 23.30 | 22.30 | 22.60 |
| reverse-1000 | 30.50 | 31.20 | 32.10 | 32.20 | 33.10 | 32.50 | 30.80 | 35.50 | 35.40 | 31.40 | 32.00 | 65.70 | 33.50 |
| rotate-1000 | 3.20 | 3.50 | 3.40 | 32.50 | 28.90 | 29.50 | 29.50 | 4.00 | 4.10 | 4.10 | 5.10 | 4.20 | 3.60 |
| shuffle-1000 | 31.70 | 33.00 | 30.70 | 31.60 | 33.50 | 30.60 | 34.30 | 37.30 | 36.50 | 32.40 | 34.20 | 34.30 | 37.20 |
| noop-1000 | 0.00 | 0.00 | 0.00 | 0.10 | 0.10 | 0.00 | 0.00 | 0.10 | 0.00 | 0.00 | 0.80 | 0.00 | 0.40 |
| create-1000 | 29.20 | 28.40 | 27.80 | 33.30 | 30.20 | 28.30 | 32.00 | 32.50 | 36.50 | 33.40 | 34.30 | 31.30 | 32.10 |
| create-5000 | 192.70 | 186.60 | 195.30 | 215.60 | 184.60 | 186.60 | 200.40 | 225.60 | 223.90 | 209.10 | 211.30 | 200.50 | 193.30 |
| replace-1000 | 36.00 | 38.20 | 33.90 | 44.20 | 35.90 | 37.90 | 36.30 | 42.60 | 47.40 | 46.10 | 42.00 | 38.40 | 49.20 |
| append-1000 | 36.50 | 36.50 | 36.30 | 37.90 | 36.70 | 37.30 | 37.20 | 41.40 | 42.00 | 40.40 | 40.00 | 39.60 | 40.20 |
| update-10pct | 4.50 | 4.60 | 4.80 | 5.70 | 5.30 | 5.10 | 5.30 | 5.90 | 5.80 | 6.40 | 5.60 | 5.70 | 5.00 |
| select-row | 0.10 | 0.10 | 0.20 | 0.20 | 0.20 | 0.20 | 0.20 | 0.90 | 0.80 | 0.70 | 1.90 | 0.80 | 0.60 |
| swap-rows | 3.40 | 3.30 | 3.10 | 31.60 | 29.40 | 29.00 | 29.90 | 34.10 | 3.60 | 3.90 | 4.90 | 3.90 | 3.60 |
| remove-row | 2.80 | 2.90 | 2.50 | 3.30 | 3.00 | 3.00 | 3.20 | 3.70 | 3.70 | 3.60 | 4.50 | 3.70 | 3.60 |
| clear-5000 | 18.90 | 18.70 | 19.20 | 40.70 | 24.30 | 23.80 | 25.40 | 31.50 | 29.60 | 33.70 | 21.00 | 22.90 | 245.90 |
| filter-half | 4.10 | 4.10 | 4.40 | 6.50 | 4.20 | 4.30 | 3.80 | 5.80 | 6.00 | 5.60 | 5.70 | 4.80 | 5.20 |
| sort-1000 | 31.00 | 30.80 | 31.30 | 32.20 | 32.70 | 33.70 | 31.80 | 34.50 | 37.80 | 31.70 | 33.40 | 47.80 | 34.20 |
| input-event | 0.60 | 0.60 | 0.50 | 0.60 | 0.60 | 0.60 | 0.60 | 1.90 | 1.30 | 1.10 | 1.70 | 1.40 | 0.90 |
| click-event | 0.40 | 0.50 | 0.40 | 0.40 | 0.50 | 0.50 | 0.40 | 1.50 | 1.30 | 1.30 | 2.40 | 1.40 | 0.90 |
| dashboard-tick | 0.70 | 0.70 | 0.70 | 0.80 | 0.80 | 0.80 | 0.90 | 1.50 | 1.30 | 1.40 | 1.90 | 1.40 | 1.00 |

### Local cold-context startup and lifecycle observations

Startup ends at application-ready assignment, not paint. Fresh browser contexts do not clear operating-system or browser-process code caches. Memory is one post-GC JavaScript retained-heap delta after 20 cycles (not total process or Wasm memory); negative values are possible and do not imply negative allocations. Animation trace: one 120-tick sample per adapter, display pacing dependent.

| Adapter | Ready median ms | Retained heap delta bytes | Tick work median ms | Frame interval p95 ms |
|---|---:|---:|---:|---:|
| velocity-next-clone | 11.80 | -100016 | 0.60 | 16.80 |
| velocity-next | 11.50 | 40420 | 0.70 | 16.80 |
| velocity-next-wasm | 16.80 | -103532 | 0.70 | 16.80 |
| velocity | 12.60 | -27596 | 0.70 | 16.70 |
| velocity-js | 12.30 | 25488 | 0.70 | 16.80 |
| velocity-wasm | 17.00 | -72156 | 0.80 | 16.80 |
| vanilla | 11.90 | -111308 | 0.80 | 16.70 |
| react | 29.10 | -592836 | 1.10 | 16.70 |
| preact | 14.50 | -160504 | 1.20 | 16.70 |
| vue | 17.60 | -1821056 | 1.20 | 16.70 |
| solid | 14.50 | -974752 | 1.60 | 16.71 |
| svelte | 17.20 | -292116 | 1.10 | 16.70 |
| lit | 17.10 | -599992 | 0.90 | 16.71 |

## run-chromium-cpu4.json: chromium, CPU multiplier 4

Browser: 153.0.8010.0. Node: v24.19.0. CPU: AMD EPYC 9V74 80-Core Processor. 10 measured rounds after 3 discarded warmup rounds. Failures: 0.

### Median commit + forced layout (milliseconds)

Lower is better. Includes shared state transformation and the adapter flush barrier. Layout is synchronously requested; these are not INP measurements.

| Workload | velocity-next-clone | velocity-next | velocity-next-wasm | velocity | velocity-js | velocity-wasm | vanilla | react | preact | vue | solid | svelte | lit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| create-10000 | 1769.80 | 1840.60 | 1762.55 | 2050.25 | 1851.65 | 1856.15 | 1765.30 | 2448.25 | 1934.35 | 2083.15 | 1897.50 | 1819.25 | 2068.70 |
| update-all | 102.85 | 99.25 | 88.75 | 137.45 | 119.85 | 114.05 | 123.35 | 119.20 | 115.15 | 159.25 | 121.85 | 102.25 | 105.60 |
| reverse-1000 | 180.25 | 170.60 | 153.45 | 175.70 | 174.45 | 175.95 | 156.60 | 183.30 | 193.90 | 160.00 | 162.00 | 311.15 | 160.40 |
| rotate-1000 | 14.65 | 16.95 | 16.65 | 151.50 | 158.80 | 152.90 | 153.55 | 19.20 | 17.80 | 18.50 | 24.35 | 18.60 | 17.90 |
| shuffle-1000 | 151.10 | 178.95 | 158.60 | 172.05 | 169.35 | 169.30 | 171.55 | 180.90 | 159.95 | 160.90 | 176.00 | 162.10 | 195.50 |
| noop-1000 | 0.05 | 0.00 | 0.10 | 0.40 | 0.20 | 0.25 | 0.30 | 0.70 | 0.05 | 0.10 | 4.05 | 0.35 | 2.45 |
| create-1000 | 160.80 | 157.05 | 152.05 | 167.00 | 148.90 | 153.05 | 159.55 | 178.15 | 186.00 | 177.20 | 169.70 | 167.90 | 175.40 |
| create-5000 | 874.00 | 823.55 | 810.95 | 968.40 | 878.70 | 869.20 | 879.50 | 1137.75 | 1011.30 | 958.50 | 991.15 | 931.15 | 1013.15 |
| replace-1000 | 178.95 | 181.30 | 172.05 | 197.70 | 167.75 | 178.25 | 173.70 | 206.75 | 217.30 | 194.10 | 189.90 | 184.30 | 247.70 |
| append-1000 | 189.60 | 195.80 | 185.50 | 211.65 | 181.95 | 189.00 | 195.50 | 212.65 | 212.10 | 206.35 | 208.40 | 195.90 | 209.00 |
| update-10pct | 24.25 | 25.90 | 25.80 | 28.55 | 29.15 | 28.60 | 30.20 | 30.55 | 32.40 | 35.35 | 31.95 | 29.45 | 28.70 |
| select-row | 0.80 | 0.90 | 0.90 | 0.85 | 0.75 | 0.80 | 1.05 | 3.25 | 4.30 | 4.10 | 8.15 | 3.60 | 2.20 |
| swap-rows | 16.70 | 17.75 | 17.95 | 165.30 | 158.95 | 160.70 | 161.25 | 158.45 | 20.40 | 21.70 | 26.05 | 20.50 | 19.40 |
| remove-row | 16.25 | 16.40 | 15.75 | 17.80 | 15.45 | 17.20 | 17.45 | 19.70 | 17.40 | 16.85 | 22.80 | 20.45 | 19.70 |
| clear-5000 | 87.35 | 85.80 | 86.80 | 184.00 | 111.30 | 106.45 | 117.60 | 153.20 | 145.85 | 161.50 | 101.05 | 101.10 | 1086.50 |
| filter-half | 23.15 | 23.40 | 23.55 | 29.35 | 23.70 | 23.90 | 20.50 | 30.05 | 28.15 | 32.70 | 28.30 | 28.80 | 27.30 |
| sort-1000 | 168.80 | 158.50 | 178.65 | 170.15 | 172.45 | 167.00 | 176.85 | 181.85 | 179.95 | 171.30 | 178.85 | 213.00 | 179.60 |
| input-event | 2.95 | 2.80 | 2.90 | 2.75 | 3.05 | 2.60 | 2.65 | 8.60 | 6.45 | 6.15 | 8.00 | 6.15 | 4.20 |
| click-event | 2.25 | 2.10 | 1.95 | 2.00 | 2.35 | 2.45 | 2.30 | 10.55 | 6.25 | 5.70 | 11.65 | 7.40 | 4.10 |
| dashboard-tick | 3.05 | 3.20 | 3.55 | 3.95 | 4.10 | 3.70 | 4.00 | 6.85 | 6.50 | 6.05 | 10.60 | 6.95 | 5.05 |

### Local cold-context startup and lifecycle observations

Startup ends at application-ready assignment, not paint. Fresh browser contexts do not clear operating-system or browser-process code caches. Memory is one post-GC JavaScript retained-heap delta after 20 cycles (not total process or Wasm memory); negative values are possible and do not imply negative allocations. Animation trace: one 120-tick sample per adapter, display pacing dependent.

| Adapter | Ready median ms | Retained heap delta bytes | Tick work median ms | Frame interval p95 ms |
|---|---:|---:|---:|---:|
| velocity-next-clone | 35.20 | 39944 | 2.80 | 16.71 |
| velocity-next | 33.75 | 44644 | 2.90 | 16.71 |
| velocity-next-wasm | 45.35 | 40492 | 3.10 | 16.70 |
| velocity | 38.30 | 53704 | 3.30 | 16.70 |
| velocity-js | 34.45 | 27676 | 3.15 | 16.70 |
| velocity-wasm | 44.90 | 21492 | 3.20 | 16.80 |
| vanilla | 32.90 | -136288 | 3.30 | 16.80 |
| react | 91.65 | 128704 | 4.65 | 16.80 |
| preact | 44.95 | 17020 | 5.40 | 16.80 |
| vue | 49.10 | 336412 | 4.90 | 16.80 |
| solid | 39.95 | 88268 | 6.60 | 16.70 |
| svelte | 46.40 | 109300 | 4.35 | 16.70 |
| lit | 45.25 | 21284 | 3.90 | 16.80 |

## replication/run-chromium-cpu1.json: chromium, CPU multiplier 1

Browser: 153.0.8010.0. Node: v24.19.0. CPU: AMD EPYC 9V74 80-Core Processor. 15 measured rounds after 3 discarded warmup rounds. Failures: 0.

### Median commit + forced layout (milliseconds)

Lower is better. Includes shared state transformation and the adapter flush barrier. Layout is synchronously requested; these are not INP measurements.

| Workload | velocity-next-clone | velocity-next | velocity-next-wasm | velocity | velocity-js | velocity-wasm | vanilla | react | preact | vue | solid | svelte | lit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| create-10000 | 405.30 | 393.00 | 388.70 | 433.20 | 395.10 | 376.00 | 388.50 | 564.80 | 456.80 | 454.90 | 421.80 | 395.80 | 438.20 |
| update-all | 19.20 | 19.10 | 19.30 | 29.00 | 23.20 | 22.70 | 23.60 | 26.90 | 27.50 | 33.20 | 26.00 | 24.70 | 22.10 |
| reverse-1000 | 30.00 | 31.40 | 30.80 | 32.40 | 33.60 | 33.00 | 32.10 | 33.60 | 38.60 | 32.40 | 34.20 | 63.10 | 32.80 |
| rotate-1000 | 3.50 | 3.50 | 3.40 | 32.10 | 29.00 | 32.10 | 30.30 | 4.30 | 3.70 | 4.00 | 5.40 | 3.80 | 3.60 |
| shuffle-1000 | 30.10 | 30.40 | 30.40 | 31.10 | 32.10 | 30.80 | 31.90 | 36.20 | 33.80 | 31.40 | 35.20 | 34.10 | 35.80 |
| noop-1000 | 0.00 | 0.00 | 0.00 | 0.00 | 0.10 | 0.10 | 0.00 | 0.10 | 0.00 | 0.00 | 0.80 | 0.00 | 0.40 |
| create-1000 | 30.60 | 30.80 | 31.20 | 32.70 | 27.90 | 28.60 | 31.20 | 35.30 | 36.80 | 35.60 | 35.40 | 33.00 | 36.80 |
| create-5000 | 196.70 | 182.20 | 179.90 | 212.20 | 192.00 | 184.70 | 191.20 | 237.50 | 226.60 | 213.50 | 205.40 | 201.80 | 205.80 |
| replace-1000 | 37.10 | 39.50 | 36.10 | 42.80 | 36.70 | 39.90 | 36.70 | 46.40 | 48.90 | 43.10 | 45.30 | 39.40 | 50.40 |
| append-1000 | 36.90 | 35.30 | 36.80 | 41.30 | 36.10 | 37.60 | 39.80 | 40.40 | 41.80 | 40.00 | 40.60 | 42.10 | 43.60 |
| update-10pct | 4.80 | 4.50 | 4.70 | 5.80 | 5.20 | 4.90 | 5.50 | 6.20 | 5.90 | 7.60 | 6.50 | 6.10 | 5.80 |
| select-row | 0.20 | 0.10 | 0.20 | 0.20 | 0.20 | 0.20 | 0.20 | 0.90 | 1.00 | 0.90 | 1.80 | 1.00 | 0.50 |
| swap-rows | 3.10 | 3.20 | 3.50 | 32.80 | 30.70 | 29.50 | 30.90 | 34.30 | 3.80 | 3.80 | 4.80 | 4.10 | 3.50 |
| remove-row | 2.90 | 3.00 | 2.80 | 3.30 | 3.00 | 2.90 | 3.60 | 4.20 | 3.60 | 3.40 | 4.60 | 3.60 | 3.70 |
| clear-5000 | 18.70 | 18.90 | 18.80 | 38.60 | 22.90 | 23.70 | 23.90 | 30.70 | 30.00 | 34.90 | 21.90 | 22.10 | 242.00 |
| filter-half | 4.50 | 4.30 | 4.20 | 6.30 | 4.00 | 4.20 | 4.30 | 5.60 | 5.70 | 5.80 | 5.70 | 5.90 | 5.10 |
| sort-1000 | 32.30 | 33.40 | 32.80 | 33.00 | 34.30 | 32.90 | 34.70 | 37.80 | 36.50 | 33.10 | 33.10 | 47.10 | 36.50 |
| input-event | 0.60 | 0.60 | 0.50 | 0.60 | 0.60 | 0.60 | 0.60 | 1.90 | 1.30 | 1.10 | 1.60 | 1.40 | 0.90 |
| click-event | 0.40 | 0.40 | 0.50 | 0.40 | 0.40 | 0.50 | 0.40 | 1.50 | 1.20 | 1.10 | 2.10 | 1.30 | 0.90 |
| dashboard-tick | 0.70 | 0.70 | 0.70 | 0.80 | 0.90 | 0.90 | 0.80 | 1.50 | 1.30 | 1.40 | 1.90 | 1.50 | 1.00 |

### Local cold-context startup and lifecycle observations

Startup ends at application-ready assignment, not paint. Fresh browser contexts do not clear operating-system or browser-process code caches. Memory is one post-GC JavaScript retained-heap delta after 20 cycles (not total process or Wasm memory); negative values are possible and do not imply negative allocations. Animation trace: one 120-tick sample per adapter, display pacing dependent.

| Adapter | Ready median ms | Retained heap delta bytes | Tick work median ms | Frame interval p95 ms |
|---|---:|---:|---:|---:|
| velocity-next-clone | 11.90 | -104240 | 0.70 | 16.80 |
| velocity-next | 12.50 | -5424 | 0.70 | 16.80 |
| velocity-next-wasm | 16.40 | -103540 | 0.70 | 16.70 |
| velocity | 13.70 | -27596 | 0.70 | 16.70 |
| velocity-js | 11.80 | -70692 | 0.70 | 16.70 |
| velocity-wasm | 16.50 | -72040 | 0.70 | 16.71 |
| vanilla | 11.90 | -111128 | 0.70 | 16.80 |
| react | 28.60 | -705092 | 1.20 | 16.70 |
| preact | 14.50 | -216136 | 1.15 | 16.70 |
| vue | 17.30 | -1879292 | 1.10 | 16.71 |
| solid | 15.10 | 85992 | 1.60 | 16.80 |
| svelte | 16.40 | -304420 | 1.05 | 16.80 |
| lit | 15.80 | -599320 | 0.90 | 16.80 |

## Interpretation limits

- All adapters render the same rows, input, and 128 dashboard cells. They use different idiomatic update strategies; source review is essential.
- React uses memoized rows/cells and a synchronous flush barrier, not React Compiler. Vue uses render functions, not SFC compilation. Lit measures lit-html rendering, not LitElement lifecycle. Solid uses keyed store reconciliation.
- The POC is a much smaller feature set than mature frameworks. Bundle size is not a feature-parity comparison.
- New browser contexts and seeded shuffled order reduce some bias but cannot remove shared-host noise.
- Double requestAnimationFrame is only a frame-opportunity proxy; it does not prove that content was painted.
- No real mobile devices, slow-network tests, SSR, hydration, GPU, or accessibility certification are included.
- Median bootstrap intervals and p95 values are in summary.json. Small samples and shared-host correlations limit statistical confidence. There is no aggregate winner score.

Velocity and vanilla use a per-row selection registry; competing adapters use different selection propagation strategies. The targeted-update advantage is partly an adapter design choice, not proof of an unavoidable framework limitation. See docs/METHODOLOGY.md and results/FINDINGS.md.
