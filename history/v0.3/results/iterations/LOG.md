# v0.3 iteration log

1. Implemented prefix/suffix matching, LIS reorder, bulk replacement and text-node updates. Standard 20-scenario suite passed for all 12 adapters.
2. Expanded stress test exposed retained focused button losing focus during a two-row swap. The candidate made only two moves but native insertBefore blurred the moved node. Added conditional focus restoration for retained connected focused elements. No timings were accepted before resolving this correctness failure.

Exploratory selection measurements and final replication batches are kept separate.

3. Focus fix passed: 600 randomized updates plus boundary-key check per new adapter, two swap moves, focus retention and 100 remounts each. All 12 adapters pass the 20-scenario suite. Starting selection run i1 with five measured rounds after two warmups.

4. Selection run i1 completed 800 validated samples. Swaps/rotations improved strongly; creation remained competitive rather than consistently leading. Added candidate i2: escaped batch parsing for contiguous runs of at least 64 new rows, with a cloning fallback for NUL-containing labels. Kept the exact i1 renderer as velocity-next-clone for a simultaneous ablation. Added empty-label, CR, markup, quote and NUL tests.

5. Selection run i2 completed 960 validated samples. Batch parsing regressed large creation relative to the simultaneous cloning control; rejected it for the release path. Preserved source snapshots and raw results. Candidate i3 restores cloning, replaces per-row onclick closures with one delegated handler and uses sibling pointers when binding cloned nodes. Existing i1 clone remains a simultaneous control.

6. Selection run i3 completed 720 validated samples. Kept delegated events and sibling pointers for the next candidate: creation commit work improved, while most total dense-update time was layout. Small total-time differences and an inconsistent replacement result require independent replication, not workload-specific branches. Retained i1 clone control in all final runs.
7. Froze candidate binaries after all 13 adapters passed 20 scenarios, 16 Node tests and two Rust tests passed, and both release variants passed 600 randomized updates plus edge cases, focus retention, two-move swap and 100 remounts. Final experiment: 15 normal-CPU rounds with seed 20261017, 15 independent normal rounds with seed 104729, and 10 throttled rounds with seed 65537. All use three discarded warmup rounds. No application changes are allowed within these batches.

8. All final batches completed: 3,900 + 3,900 + 2,600 validated measurements, zero failures, identical application/Wasm fingerprints. Swap/rotation gains replicated; JS replacement remained a regression. Retained all results and explicitly rejected the claim of universally best timings. See results/DECISION.md.
9. Standalone planner benchmark completed 150 validated samples. Rust's 100k-entry median was 0.56 ms versus 0.65 ms for JS; smaller cases did not show a useful advantage. Report generation checks the full matrix, traces and binary consistency.
