# v0.2.0 — Rust/WebAssembly planner research preview

Adds a real Rust-compiled Wasm keyed-list planner and a matching typed-array JavaScript control. Both use the same shared DOM renderer with template cloning and delegated row events. The original Velocity runtime/compiler remain available, bringing the suite to ten adapters.

## Findings

Supplied Chromium runs contain 1,960 validated UI-operation samples with no recorded failures. The planner-only experiment reports effectively tied medians at 1k/10k rows and a 12.3% lower Wasm median at 100k rows. Full UI results are mixed. Wasm remains optional; improvements from the new shared renderer must not be presented as Rust-specific gains.

The Wasm adapter ships 4,872 JS bytes plus 19,742 Wasm bytes (24,614 raw bytes), compared with 4,683 JS bytes for the matched JS control. Planner measurements include ID copying but exclude DOM, startup, and state reduction. The CPU-rate-4 study covers four controls, not all ten adapters.

## Implementation and reproducibility

- Pinned Rust 1.85.0 with wasm32-unknown-unknown and no external crate dependencies.
- Planner parity tests execute actual Wasm against a Map oracle, including resizing and large unsigned IDs.
- Correctness hashing includes both JS and Wasm for the Wasm adapter.
- Build, server MIME handling, report delivery accounting, and CI support the new experiment.
- Historical v0.1 results are retained separately under results/v0.1 and in the existing v0.1.0 release.

The internal ABI assumes trusted callers and unique unsigned 32-bit keys, with a one-million-entry limit in Rust. There is no automatic JS fallback on Wasm startup failure. This is not a Rust JSX compiler or a complete Rust UI framework. APIs remain unstable; no peer review or independent performance validation is claimed.

Read docs/RUST_WASM.md, docs/REPRODUCE_V02.md, and results/RUST_WASM_FINDINGS.md for interpretation. Included performance evidence is preserved from the supplied archive; release verification does not replace those measurements with new timing runs.
