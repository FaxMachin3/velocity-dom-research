# Selection experiments, not final evidence

- i1: prefix/suffix + LIS reconciliation, direct text nodes, direct row handlers. Focus-loss bug was fixed before accepting timings. 800 measured UI samples.
- i2: optional escaped batch-HTML construction for contiguous new rows. 960 samples. Rejected after bulk-creation regressions versus the simultaneous i1 cloning control.
- i3: template cloning restored; one delegated event handler and sibling-pointer binding. 720 samples. Selected for independent final validation, with i1 retained as an ablation.

Each directory contains raw timings, a readable matrix, bundle-size metadata and source snapshots. To reproduce a candidate, use a separate copy of the checkout, copy its source/keyed-list.js into src/poc/keyed-list.js and source/optimized.js into src/adapters/optimized.js, then rebuild and rerun correctness before timing. The old measurements' hashes identify the exact tested bundles. Do not merge these selection samples into final estimates or select the fastest historical sample as a release result.

The independent runs are in ../run-chromium-cpu1.json, ../replication/run-chromium-cpu1.json and ../run-chromium-cpu4.json. Their fingerprints must match one another; release-report.mjs enforces this.
