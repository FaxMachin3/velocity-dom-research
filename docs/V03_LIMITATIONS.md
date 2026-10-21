# What this release does and does not establish

The reusable keyed-list primitive owns DOM records and identity matching. The optimized table adapter is manually specialized to the benchmark fixture; the original JSX compiler does not yet generate that optimized adapter. This is a runtime/compiler research POC, not a complete framework release.

Inputs must use immutable snapshots and unique unsigned 32-bit keys. Duplicate-key handling, arbitrary string keys, mutable in-place data, user-defined row-effect disposal hooks, concurrent rendering, routing, SSR/hydration and a complete component system are not implemented in the new primitive. External subscriptions/resources require caller-managed lifetimes. The fixture has no such per-row resources; its row events are delegated and released with the host.

The original signal/effect runtime remains available separately. Comparing its overhead with the specialized renderer also compares feature/lifecycle mechanisms; it is not evidence that an equally general reactive system would cost the same as this fixture.

All twenty workloads render the same full DOM across adapters. The shared reducer is inside operation timing. Inputs/clicks are synthetic DOM events. Forced layout is measured; complete paint, hardware input latency, INP, network loading, virtualized grids and real mobile devices are not established by these results.

The external adapters are representative implementations, not guarantees of the best possible React/Preact/Vue/Solid/Svelte/Lit code. React Compiler and compiled Vue SFC alternatives were not added. Data-subscription granularity differs across adapters. All source remains reviewable.

Near-zero timings are quantized and do not imply zero work. Per-case sample counts are stated in the reports; thousands of total measurements do not make each p95 estimate precise. Shared-host scheduling, GC, browser caches and layout cost can change rankings. Bootstrap intervals are descriptive, without multiple-comparison correction. Independent batches help expose variability but do not remove it.

A winning median for one workload, profile or Wasm-labelled fixture is not a universal fastest claim. Wasm can be bypassed by common fast paths; its binary and startup costs remain. The report preserves losses and does not choose the faster of JS/Wasm per row as if that were one measured application.
