# v0.2 changes

- Dependency-free Rust crate and reproducible wasm32 release build.
- Wasm loader with explicit owned-instance lifecycle and reacquired memory views.
- Typed-array JS control using the same hash-table algorithm.
- Shared DOM renderer with template cloning and delegated row click handling.
- Ten browser adapters, updated interactive explorer and complete delivery-size accounting.
- Wasm-inclusive correctness fingerprint; scalar ABI and planner oracle tests.
- Three-size standalone browser planner benchmark with raw samples.
- CI Rust setup, Rust tests, compiler-before-tests ordering, archive target exclusion and manifest generator.
- Historical v0.1 results preserved, current matched-control findings and staged roadmap.

Original framework adapter sources remain unchanged. The two new variants are fixture-oriented renderers, not full replacements for the original reactive/JSX API. Their purpose is to validate the runtime architecture before generalizing it.
