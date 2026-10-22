# v0.4 experiment protocol

The release tests whether public compiler-generated templates retain the benefits of v0.3 after adding general keys, owned cleanup and multi-node blocks. It does not promise fastest timings. No runtime changes are allowed during the final experiment.

## Focused investigation

Four controls cross two factors: direct/delegated row events and indexed/sibling node binding. The v0.3 clone and selected JS adapters are preserved. New variants change one choice each. Three prespecified workloads: replacement, append and shuffle. Warm track: 30 paired rounds with three exact in-page warmup operations before each measured sample. Fresh track: 15 rounds with no in-page warmup. Fresh contexts are used for every adapter/workload/round. Round ordering is seeded. Both tracks validate every output. They are separate experiments; differences between tracks are not causal estimates with all other conditions held constant.

One tracing observation per implementation diagnoses replacement. Traces are not timing evidence and do not establish causality. Instrumented results are kept separate.

## Frozen-build validation

Normal A: 12 implementations, all 20 workloads, 15 measured rounds after three discarded fresh-context rounds. Normal B: independent replication of six prespecified implementations (compiled, v0.3 JS, vanilla, React, Solid, Svelte), with the same counts and a different seed. This retains the previous mixed-session measurement track for continuity; it is not called warm steady-state. Normal B is explicitly a subset, not a complete replication of all external adapters. This v0.4 campaign does not rerun CPU throttling.

Run shared-host experiments sequentially. Report medians, p95 and intervals without declaring near-resolution or uncertain differences wins. Old archived numbers must not be substituted for current controls. No modifications to competitor sources, styling or shared reduction semantics.

## Broader workloads

Thirty observations each for editing one of 250 fields, editing one leaf in an 80-by-20 nested tree, and reversing 1,000 multi-node records. These exercise only the compiled runtime and have no external comparator. They are exploratory absolute timings, not framework rankings.

## Delivery and limitations

The unchanged Rust binary is hash verified when USE_PREBUILT_WASM=1 is specified; a native rebuild remains available through the original command. No new Rust source optimization is claimed. The new template runtime currently uses a generic JavaScript Map for string/number keys. General key-to-u32 interning and a compiled-Wasm adapter are not implemented.

The template language supports intrinsic HTML, expressions over `p`, fragments and explicit keyed-list directives. It is not full React JSX. Scope ownership covers DOM events, lists and registered cleanup callbacks. Advanced scheduling, cached reactive memos, routing, SSR/hydration and a complete ecosystem remain future work. Form tests cover focus/caret and input events, not certification of native IME behavior. Browser support claims depend on recorded completed checks.
