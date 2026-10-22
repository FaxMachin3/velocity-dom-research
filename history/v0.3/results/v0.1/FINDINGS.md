# Findings from the first POC

## Outcome

The compiler/runtime and all eight adapters run successfully in Chromium. Both profiles completed with zero operation-level correctness failures: 1,680 normal-CPU samples and 1,120 samples at Chromium CPU throttle rate 4. This is 2,800 validated operation measurements, plus startup observations, frame traces and lifecycle heap observations. It is not a claim of universal superiority.

The POC is competitive on targeted updates in these adapters, but it is not the fastest across all workloads. Large row creation and cleanup remain important weaknesses. The selection registry is an adapter-level optimization that competing frameworks can also implement.

## Selected measured medians

Times below are milliseconds from dispatch through framework settling and forced layout. They are not confirmed paint times or INP. See REPORT.md for all workloads and summary.json for sample counts, p95 and bootstrap intervals.

### Chromium CPU rate 1

| Workload | velocity | vanilla | react | preact | vue | solid | svelte | lit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| create-1000 | 49.80 | 46.80 | 48.90 | 51.60 | 59.70 | 58.70 | 44.10 | 53.70 |
| create-5000 | 363.60 | 281.30 | 347.10 | 339.30 | 352.50 | 380.90 | 301.30 | 323.40 |
| update-10pct | 9.80 | 8.60 | 10.30 | 9.40 | 10.70 | 8.90 | 10.60 | 8.50 |
| select-row | 0.30 | 0.20 | 1.10 | 1.40 | 1.30 | 2.70 | 1.30 | 1.00 |
| input-event | 1.00 | 1.00 | 2.60 | 1.80 | 1.80 | 2.30 | 2.00 | 1.60 |
| dashboard-tick | 1.20 | 1.20 | 2.30 | 2.50 | 2.70 | 2.80 | 2.50 | 1.60 |
| clear-5000 | 57.10 | 33.00 | 42.20 | 38.40 | 48.30 | 27.90 | 31.70 | 293.30 |

### Chromium CPU rate 4

| Workload | velocity | vanilla | react | preact | vue | solid | svelte | lit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| create-1000 | 275.90 | 228.60 | 235.10 | 293.60 | 282.20 | 273.65 | 223.15 | 289.20 |
| create-5000 | 2154.90 | 1902.00 | 1971.90 | 2031.55 | 2239.95 | 1950.90 | 1592.70 | 1763.95 |
| update-10pct | 55.90 | 48.70 | 56.10 | 52.25 | 54.45 | 47.95 | 51.55 | 56.90 |
| select-row | 1.30 | 1.25 | 6.20 | 5.30 | 5.35 | 13.15 | 5.55 | 4.45 |
| input-event | 6.50 | 4.35 | 13.30 | 8.80 | 9.50 | 12.15 | 11.85 | 7.70 |
| dashboard-tick | 5.90 | 5.50 | 11.10 | 11.25 | 13.35 | 13.05 | 13.30 | 9.25 |
| clear-5000 | 295.20 | 152.05 | 220.90 | 216.90 | 242.65 | 135.70 | 143.90 | 1653.10 |

## What the evidence supports

- A small compiled DOM runtime can execute these workloads correctly and deliver cheap targeted updates.
- Direct DOM generation alone does not guarantee the fastest creation or cleanup.
- End-to-end fixture performance includes state ingestion, framework scheduling, DOM mutation and layout.
- Bundle size is attractive for the POC, but it implements a much smaller feature set than the established frameworks.
- The observed selection advantage is partly caused by the explicit per-row registry. It is not proof that other frameworks cannot achieve similar performance.

## Next controlled experiments

1. **Static template cloning:** compare template cloning with the POC's repeated createElement/append path. This is a hypothesis, not a measured cause established by profiling.
2. **Fewer per-row bindings:** immutable IDs currently receive effect-backed bindings. Investigate explicit static expressions and compiler analysis without changing semantics.
3. **Cleanup cost:** profile listener removal, effect disposal, and keyed entry deletion independently.
4. **Equalized granular-state adapters:** add per-entity subscription variants for competitors, especially selection and dashboard updates. Keep the existing snapshot-ingestion track.
5. **Stronger compiler baselines:** add compiled Vue SFC and React Compiler variants with pinned versions and documented settings.
6. **Dedicated devices:** repeat with real Android/iPhone hardware, more samples, and actual rendering traces before public performance claims.

## Unimplemented scope

The POC does not yet include a Rust compiler, Wasm kernels, SSR/hydration, routing, data caching, GPU rendering, general component composition, full JSX/TypeScript support, or production accessibility guarantees. Firefox and WebKit measurements are not included.

Source maps for generated views are included separately; integration into a full authored-source debugging experience is future work. The generated code is deliberately readable for review.

## Where to start

Read README.md, launch the explorer, inspect src/poc/views.jsx and generated/views.js side by side, then inspect bench/run.mjs and docs/METHODOLOGY.md before interpreting timings.
