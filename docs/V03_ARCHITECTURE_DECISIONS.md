# v0.3 architecture decisions

## Fix unnecessary work before changing execution language

The previous identity planner could correctly identify a retained row while the renderer still moved almost every intervening DOM node during a swap. Moving that planner into Wasm did not fix the renderer. The new list primitive resolves equal prefixes/suffixes and uses a longest increasing subsequence for unresolved reorders. The stress test independently counts two insertBefore calls for the distant swap, compared with the prior 997-move diagnosis.

Keep identity, DOM construction, patching and movement separate. The JS and Wasm candidates share the renderer, which lets experiments distinguish an identity-planner change from a rendering-algorithm change. Wasm is optional; the release does not assume that crossing into Wasm is beneficial for every operation.

## Preserve observable behavior

The first minimal-move implementation exposed focus loss when insertBefore moved the focused button. The fix remembers a focused descendant and restores focus only when that retained connected element has lost it. Removed elements are not refocused. Retained keys keep their DOM identities; existing rows are not reconstructed as HTML to obtain lower timing values.

The immutable-snapshot contract enables an unchanged-array fast path. Callers must create a new snapshot for changes, use unique u32 keys, and avoid modifying previous rows in place. This is an explicit API limitation rather than support for arbitrary mutable application state.

## Retain controls and rejected alternatives

Iteration i2 tested escaped batch HTML creation. It lost to cloning for large creation in the selection run, so it is not used in the release renderer. Its source snapshots and measurements remain available.

Iteration i3 uses delegated row events and sibling-pointer binding while retaining i1 as a simultaneous direct-handler control. The final experiment keeps both variants; it does not splice the fastest variant for each benchmark into a synthetic winner. The complete matrices show where each implementation loses as well as wins.

## Bound the claim

This is a reusable keyed-list primitive plus a specialized table/dashboard fixture, not a complete production framework. No routing, hydration, general component lifecycle or broad application benchmark corpus has been implemented. Competing adapters are transparent but are not asserted to be the optimal possible implementation of each framework.

The final experiment freezes binaries across two normal-CPU batches and one throttled batch. A performance difference without an identified cause is recorded, not explained away as noise or attributed automatically to Rust. Remaining work should be driven by a chosen real application and measured bottleneck rather than the impossible requirement to lead every conceivable workload.
