# v0.4.0 — compiled templates and owned keyed blocks

Experimental compiler/runtime milestone, not a universal speed upgrade. Adds hoisted static templates, shared binding plans, public block update/cleanup APIs, component setup, finite-number/string keys, multi-node keyed ranges, nested lists, and form/tree examples. The compiled benchmark now uses the public API. Preserved v0.3 hand-written renderers remain controls.

## Evidence and tradeoffs

The supplied release campaign includes 6,030 observations across fresh/warmed 2x2 event/binding ablations, 12-adapter normal A, six-adapter normal B, and three compiled-only application workloads. A separate initial selection screen and diagnostic traces are not pooled into release estimates. These are author-run batches on one environment, not external independent reproduction. No new throttled campaign was run.

Compared with the current-session v0.3 JS control, compiled create-1000 is approximately 18–25% slower, create-5000 20–23% slower, and clear-5000 24–27% slower across the two normal batches. Selection refreshes retained-row props when context changes. Low-move reordering remains, but no consistent speed lead is established. Generic lifecycle, allocation, and validation costs require further profiling. The compiled fixture ships 8,931 raw / 3,769 gzip JS bytes; these are fixture-inclusive sizes.

No new Rust kernel is introduced. The original binary remains hash-verified and optional; generic compiled keys use JavaScript Map. Historical planner timings are not current measurements. The supplied environment did not rerun native Rust tests or complete Firefox validation; publication CI separately checks the clean Rust build and browser correctness. Correctness verification does not establish cross-browser performance.

## Publication

Source/binary manifests are checked and supplied timing evidence is preserved. Existing research/contribution guidance is retained and citation metadata updated. CI adds runtime and release/example checks to the existing build, Rust, unit, stress, explorer, and cross-browser checks.

No complete JSX component language, SVG, portals, routing, SSR/hydration, scheduler, compiled-Wasm implementation, native IME certification, or production accessibility guarantee is provided. APIs remain unstable. No peer review or external independent performance validation is claimed.

Read results/v04/DECISION.md, docs/V04_PROTOCOL.md, docs/V04_API.md, and docs/V04_STATUS.md for full evidence and boundaries. Performance benchmarks are not rerun for publication.
