# Benchmark methodology

## Contract

Every fixture renders a main element, row count, labeled input, mirrored output, 128 dashboard cells, and a three-column keyed table. Every row has an ID, clickable label, numeric value, and selection state. Shared CSS and deterministic data generation are used. IDs and DOM node identity must survive retained-key reorders and updates.

The common reducer is inside measured operations. DOM assertions, setup, warmup resets, and browser automation transport are outside the operation timer. React uses flushSync to provide a deterministic synchronous barrier; this does not measure React's normal scheduling/transition behavior. Preact uses microtask settling, Vue nextTick, Svelte tick, and synchronous adapters a resolved promise. The correctness gate verifies that these barriers settle the tested workloads.

## Operation measurements

Each framework receives a fresh browser context per round. Framework order and scenario order are deterministically shuffled. Warmup rounds are discarded. Before each operation, the adapter resets to the specified initial state and waits two animation-frame callbacks.

The browser records:

1. `commitMs`: action dispatch through framework flush completion.
2. `commitLayoutMs`: the same interval plus a forced host offsetHeight read.
3. `frameOpportunityMs`: the same start through two subsequent requestAnimationFrame callbacks.

The last metric is quantized by frame pacing and is NOT proof of paint, INP, or time to visible pixels. Forced layout intentionally prevents measuring only queued DOM work, but differs from natural browser scheduling. Use browser tracing and physical devices before product claims.

The input/click fixtures dispatch actual synthetic DOM events in the page, not hardware input. No automation round-trip time is included. Layout covers the table even when many rows extend outside the viewport; rasterization of all offscreen rows is not measured.

## Workloads

- create-1000/create-5000: populate an empty table.
- replace-1000: replace 1,000 rows with NEW IDs.
- append-1000: append to 1,000 retained rows.
- update-10pct: change label/value of every tenth row, preserve IDs.
- select-row: select ID 500.
- swap-rows: swap IDs 2 and 999.
- remove-row: remove ID 500.
- clear-5000: remove all rows.
- filter-half: retain even IDs.
- sort-1000: descending numeric value, ascending ID tie-break.
- input-event: dispatch input and mirror the text.
- click-event: click the row's button and update selection.
- dashboard-tick: update all 128 numeric cells alongside 1,000 rows.

## Additional observations

Startup is navigationStart to an application-ready assignment. The local server sends uncompressed files with no-store. This is NOT realistic WAN loading and does not measure LCP. Browser process and operating-system caches persist across contexts.

Animation records 120 requested frame callbacks, tick work, and frame intervals. It is a single exploratory trace, not statistically established animation superiority.

Chromium lifecycle observations compare post-GC used JS heap before and after 20 create/update/clear cycles. Startup/JIT caching, retained browser state, and GC behavior affect the delta. No leak diagnosis or allocation-rate claim is made from it. Firefox/WebKit omit CDP heap measurements.

Bundle sizes include the fixture code, model, benchmark API, and runtime. Source maps/common CSS are excluded. Compressed sizes are computed independently. Compiler and build dependencies are not sent to the browser. Mature frameworks offer features the POC lacks.

## Statistics and fairness

The report shows medians, with p95, min/max and 1,000-resample percentile bootstrap intervals in summary.json. Randomness is seeded. Small samples, coarse timer resolution, order effects, and shared-host correlations limit conclusions. There is no overall winner score or significance claim.

React is manually memoized, without React Compiler; Vue uses render functions rather than compiled SFCs; Lit uses lit-html and repeat rather than LitElement; Solid uses createStore + keyed reconcile. These choices are disclosed and reviewable, not claimed to be each framework's globally optimal implementation.

Do not compare this suite's numbers directly to the public JS Framework Benchmark: this is a separate harness, fixture, DOM, and measurement method. Run on dedicated hardware, increase repetitions, and review adapters before making external performance claims.

## Gate provenance

The correctness report records each app.js SHA-256. New runs reject stale correctness reports when the built application changes. The included timing runs were performed before this hash gate was added; the unchanged binaries were rechecked afterward. Operation-level output assertions were already enabled for every included sample.

The build script also records one-pass build elapsed time in bundle-sizes.json. This is diagnostic metadata, not a controlled compiler-speed benchmark: module caches and build ordering differ. No compiler-speed ranking is derived from it.

## A particularly important adapter asymmetry

Velocity maintains a per-row selection-signal registry and updates only the previous/new selected rows. Vanilla similarly targets two rows. React/Preact/Vue derive selected props during parent rendering; Solid reads a shared selection value in row bindings; Svelte/Lit derive selection in their template update paths. Thus the selection fixture compares these implementations, not an unavoidable cost of those frameworks. A registry or per-entity subscription design can be implemented in competing frameworks too.

The same caution applies to dashboard/input updates: incoming immutable snapshots interact differently with each adapter's state granularity. This release is a snapshot-ingestion comparison. It is not an equalized per-entity-subscription track, and a measured targeted-update advantage is not proof of a novel framework-level breakthrough.
