# v0.4 scope and release status

Implemented in this increment:

- Compiler-generated static templates with shared binding plans, direct dynamic text/property updates, event binding, fragments and explicit declarative list directives.
- Public block lifecycle with explicit cleanup registration, nested list ownership, cleanup-error aggregation and idempotent destruction.
- General finite-number/string keys with duplicate validation, keyed multi-node ranges and matching only the unresolved middle.
- Bulk replacement/clear while still invoking component cleanup.
- A fixture built through public template APIs rather than the v0.3 hand-written renderer.
- Form and nested-tree examples, randomized range/identity tests and compiled-fixture stress tests.
- Controlled 2x2 event/binding experiment, fresh versus exact in-page-warmed tracks, separate traces and independent validation batches.

Not implemented or not established:

- The complete prior long-term plan is not finished. This is a scoped v0.4 increment.
- No React-compatible general JSX component language, spread attributes, SVG namespaces, portals, arbitrary child render expressions, reactive memo rewrite, scheduling, routing or SSR/hydration.
- No new Rust kernel or compiled-Wasm renderer. The old Wasm module is retained and hash-verified. Generic string-key support currently uses JavaScript Map.
- No public JS Framework Benchmark submission or run; no React Compiler/Vue SFC additions or Leptos/Dioxus comparisons yet.
- No completed Firefox check: downloaded browser, bounded 80-second runtime attempt exited 124. WebKit and physical devices were not measured.
- No measured INP, native IME certification, WAN startup, virtualized grids or total-process/Wasm memory ranking.
- Form/tree/range application timings have no competitor controls.

The compiled candidate adds real functionality and overhead. A performance regression against the smaller v0.3 hand-written renderer must remain visible. Do not call this build a universal speed upgrade. Final report contains independent current-session controls; historical v0.3 binaries are unchanged but historical timings are not reused as current measurements.
