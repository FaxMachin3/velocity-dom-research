# Velocity v0.2: Rust/Wasm experiment

**Experimental research preview.** APIs and conclusions may change. No peer review or independent performance validation is claimed. See the [research overview](docs/RESEARCH.md), [contribution guidance](CONTRIBUTING.md), and [v0.2.0 release notes](docs/RELEASE-v0.2.0.md). This project is unrelated to the Velocity animation library.

This version adds a real Rust-compiled WebAssembly keyed-list planner, a matching JavaScript planner, and a shared DOM renderer. Read **docs/RUST_WASM.md** and **results/RUST_WASM_FINDINGS.md** first. It is an experimental hybrid, not a complete Rust UI framework or a claim of universal speed leadership.

Quick start (Node 22+, Rust via rustup):

```sh
npm ci
rustup toolchain install 1.85.0 --profile minimal --target wasm32-unknown-unknown
npm run build
npm run test:rust
npm test
npx playwright install chromium
npm run check
npm run bench
npm run bench:planner
npm run report
npm run serve
```

Open http://127.0.0.1:4173/explorer.html. The prebuilt `dist/` works without Rust or npm using `python3 -m http.server 4173 --directory dist --bind 127.0.0.1`.

The 10 adapters include original Velocity, `velocity-js` (new planner/renderer control), `velocity-wasm` (same renderer with Rust planner), vanilla, React, Preact, Vue, Solid, Svelte, and Lit. v0.1 raw runs are preserved under `results/v0.1/`; do not combine them with v0.2 measurements as one experiment.

## Repository guide

- `rust/planner/`: Rust source, locked Cargo project and native tests.
- `src/planner/`: equivalent JS planner and Wasm bridge.
- `src/adapters/hybrid.js`: shared renderer for the paired controls.
- `src/poc/`: original signals, keyed DOM runtime and restricted JSX compiler.
- `bench/`: browser correctness, full UI timing, planner timing and report generation.
- `tests/`: Node tests including actual Wasm execution against a reference oracle.
- `dist/`: prebuilt fixtures and explorer; `generated/`: compiled JSX, Wasm and provenance.
- `results/RUST_WASM_FINDINGS.md`: current findings; `results/report.html`: full comparison report.
- `docs/RUST_WASM.md`: architecture, limitations and next-stage plan.
- `docs/REPRODUCE_V02.md`: measured commands and environment notes.
- `docs/V01_README.md`: historical POC usage and design background.

Run `npm run findings` after both CPU profiles and the planner benchmark to regenerate the focused findings. Run `python3 scripts/manifests.py` and `python3 scripts/archive.py` to package an updated checkout. Rust build artifacts and node_modules are excluded.

## Scope

This version has a restricted compiler and experimental runtime; it does not implement routing, SSR/hydration, a production component model, arbitrary keys, concurrent rendering, or a Rust-based JSX compiler. Wasm is a measured optional path. Its internal pointer ABI is for trusted generated code, not a hardened public interface. See the architecture document before reusing it.
