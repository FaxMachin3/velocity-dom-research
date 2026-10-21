# v0.3 experiment protocol

This release targets the previously measured DOM-move bottleneck and general keyed updates. It does not promise a minimum timing for every run or every workload.

## Iteration and stopping policy

Selection runs are stored under results/iterations with source snapshots. Fix correctness failures before accepting timing data. Examine full matrices, including regressions. After targeted iterations, freeze application binaries and run two independent normal-CPU batches with different ordering seeds plus a throttled batch. Do not select the fastest sample, pool earlier selection runs into final estimates, remove losing scenarios, alter competitor code to improve ranking, or claim sub-timer-resolution differences as wins. Once remaining differences are inconsistent/noise or have no identified safe optimization, report them instead of optimizing indefinitely against noise.

## Common workload changes

The original 14 workloads remain. Six additional workloads are applied equally to every adapter: create 10,000 rows, update all rows, reverse, rotate, deterministic shuffle and a no-op. The shared reducer gains those actions, so old adapter *bundles* change even though their implementation source does not. Original adapters remain in the comparison. Every operation is timed through the same state-reduction and flush contract, followed by forced layout and output validation.

## New variants

velocity-next and velocity-next-wasm share the same generic keyed-list primitive and specialized fixture adapter. Batch HTML parsing was tested in iteration i2 and rejected after creation regressions. Its escaped implementation, boundary tests and raw results remain in the iteration archive. The release candidates retain template cloning. The i1 direct-listener renderer remains as velocity-next-clone; i3 tests delegated events and sibling-pointer bindings. Both candidates skip identical immutable snapshots, match equal prefixes and suffixes, use fragments for new contiguous ranges, clear fully removed lists in one DOM operation, update retained text nodes directly, and compute a longest increasing subsequence for actual reorders. The Rust identity planner remains optional; the DOM and LIS execution are JavaScript. No virtualization, hidden rows, deferred completion, benchmark-name detection, precomputed output or skipped validation is used.

This is still an immutable-snapshot contract with unique u32 keys. Mutable in-place changes, duplicate keys and arbitrary string keys are outside the current API. The fixture renderer is not a complete component framework. Fast-path comparisons therefore do not establish feature-equivalent superiority over React/Vue/etc.

## Correctness beyond benchmark output

Node tests independently check LIS length against a quadratic oracle and execute the Rust/Wasm planner against an independent Map oracle. Browser stress tests exercise 600 seeded updates per new adapter, retained-node identity, text escaping, zero/max-u32 keys, retained focus, two-move swap assertions, repeated destroy and 100 remounts. Passing these tests is not a guarantee over all possible applications.

## Provenance and limits

Final raw records include app/Wasm fingerprints, ordering seed, timestamps, browser and host metadata. Validation hashes include the Wasm asset. This is still shared-host headless measurement, not INP, physical-device testing or a certified framework ranking. CPU throttling is synthetic. Wasm delivery bytes and startup are reported; JS-heap deltas do not measure total Wasm/process memory. Report median, p95 and intervals; inspect replication consistency rather than a single aggregate score.

## Wasm attribution

The optimized renderer bypasses identity planning when prefix/suffix matching completely resolves an update. Initial creation, simple append, single-row deletion with matched ends, same-key value updates and unchanged snapshots can therefore avoid the Rust planner entirely. The Wasm planner runs for unresolved mixed edits/reorders and some complete replacements. A lower creation median in the Wasm-labelled fixture is not evidence that Rust accelerated creation; the DOM path there is shared JavaScript, and startup/memory/JIT/noise can affect observations.
