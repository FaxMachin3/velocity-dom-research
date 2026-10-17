# Adding a framework or workload

## New adapter

1. Install and pin the framework/compiler dependencies.
2. Add a module in src/adapters exporting mount(host, state, dispatch).
3. Return update(nextState), flush(), and destroy(). flush must resolve only once tested DOM changes are committed. destroy must release resources.
4. Match the exact semantic output in the existing adapters: row data-id, three cells, a button label, selected class, labeled input, output, dashboard cells, and count.
5. Add a production build branch/plugin in scripts/build.mjs. Avoid bundling development builds.
6. Add the name to scripts/build.mjs and bench/config.mjs.
7. Run unit tests, build, and correctness checks before benchmarking.
8. Document adapter-specific optimizations and limitations in docs/METHODOLOGY.md.

Do not substitute a canvas or virtualized table in the current DOM-overhead track. Those belong in a separately specified application-level track with equivalent user-visible behavior.

## New operation

1. Add a deterministic, immutable transformation in src/model.js.
2. Add a scenario name, initial row count, action, and argument in bench/config.mjs.
3. Extend expected snapshots if the UI contract changes; every adapter must support the same behavior.
4. Add correctness coverage for the new state and any identity requirements.
5. Keep fixtures and validation outside the timing interval; keep the actual state transformation and UI update inside it.
6. Use a separate metric when measuring async completion or worker transfer rather than silently comparing it to synchronous commits.

## Rerunning results

Do not merge raw samples from different browser versions, devices, source revisions, or profiles into one comparison. Archive each run separately. A changed adapter requires a new correctness run and a new benchmark run. The current runner overwrites an engine/profile file by design; version your results externally for long-term studies.
