# Next experiments

1. Have maintainers review adapter choices; add compiled Vue SFC and React Compiler variants rather than replacing baseline results invisibly.
2. Profile per-row setup/disposal and immutable-ID bindings; the current adapter already skips selection-registry pruning when the row array is unchanged.
3. Add a distinct fine-grained state track with equivalent per-entity subscriptions for all frameworks. Keep it separate from immutable snapshot ingestion.
4. Add physical Android and iPhone runs, accessibility/focus/IME tests, traces, and actual input-to-paint measurement.
5. Specify cached computed invalidation, error propagation, disposal races, and async ownership before extending semantics.
6. Extend the compiler with a real intermediate representation, component composition, SVG, precise whitespace, and TypeScript support.
7. Design SSR and hydration as a separate workload track; then evaluate Marko, Qwik, Astro, and comparable server frameworks.
8. Add JS worker and Rust/Wasm compute kernels with complete transfer/initialization costs.
9. Port the compiler to Rust only after output semantics stabilize. Compare compiler speed independently from UI performance.
10. Add CI on dedicated benchmark hardware with noise-aware gates; never reject a commit based on one noisy timing.

A broad framework remains a substantial project. This repository is the first executable experiment, not the full roadmap delivered in one release.
