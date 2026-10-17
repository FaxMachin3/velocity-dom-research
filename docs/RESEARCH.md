# Velocity: compiled DOM rendering research

## Research question

What are the bundle-size, update, construction, and disposal tradeoffs of a small compiled-DOM runtime with fine-grained reactive bindings?

Velocity v0.1.0 implements a restricted JSX compiler, synchronous reactive runtime, and keyed list reconciliation. A shared fixture compares eight implementations. The table, mirrored input, and dashboard are measurement fixtures, not a complete application.

## Relationship to existing work

Compilation and fine-grained reactivity have established precedents. Solid documents targeted reactive updates and JSX; Svelte compiles declarative components. This project does not claim to have invented those approaches. Its current contribution is an inspectable implementation and an explicit, reproducible experiment in their tradeoffs.

- [Solid fine-grained reactivity](https://docs.solidjs.com/advanced-concepts/fine-grained-reactivity)
- [Svelte overview](https://svelte.dev/docs/svelte/overview)
- [JS Framework Benchmark](https://github.com/krausest/js-framework-benchmark): a separate benchmark with its own contracts; its results are not interchangeable with this suite.

## Baseline and evidence

Read [methodology](METHODOLOGY.md), [architecture](ARCHITECTURE.md), [findings](../results/FINDINGS.md), and the [report](../results/REPORT.md) together. Raw Chromium runs contain 1,680 normal-profile and 1,120 CPU-rate-4 operation measurements, with zero recorded operation failures. These are author-supplied observations, not an independent replication.

The current experiment shows inexpensive targeted updates, with less favorable bulk creation and cleanup. It does not establish a universally faster framework. Fixture bundles include application/model/benchmark code and implement unequal feature sets.

## Threats to validity

- State granularity differs: Velocity and vanilla target selection updates explicitly; other adapters use different propagation paths.
- React uses a synchronous commit barrier; other adapters have their own settling contracts.
- Included results use headless Linux Chromium on one host, with limited repetitions.
- Forced-layout timings and frame callbacks are not measured input-to-paint, INP, or LCP.
- CPU throttling is a synthetic profile, not evidence of physical mobile performance.
- The correctness gate was added after the included timing runs; unchanged bundles were checked afterward, as disclosed in methodology.
- Unit and browser tests cover a limited contract, not complete reactive semantics, accessibility, focus, or IME behavior.

No peer review or independent results validation is claimed. Making artifacts available is distinct from having their results independently validated.

## Next controlled experiments

1. Add a separate comparison with equivalent per-entity subscriptions across adapters. Keep the snapshot-ingestion baseline.
2. Compare template cloning against repeated DOM construction, changing one mechanism at a time.
3. Measure the effect of removing reactive bindings for immutable values.
4. Profile creation and disposal costs separately before attributing causes.
5. Repeat on independent machines and browsers; use physical devices and rendering traces for interaction claims.
6. Specify effect rerun errors, cleanup exceptions, and computed invalidation before expanding runtime guarantees.

Preserve original raw runs. Record changed code, environment, sample counts, failures, bundle hashes, and source/harness provenance for each new study. Report unfavorable results as well as favorable ones.

## Reproducing and citing

Use the README commands from a clean checkout and record the exact commit and environment. Do not overwrite historical evidence without retaining the original. Cite a specific release or commit using CITATION.cff. An archived release DOI may be added later; no DOI has been assigned here.

## Research practice references

- [SIGPLAN empirical evaluation guidance](https://www.sigplan.org/Resources/EmpiricalEvaluation/)
- [FAIR principles for research software](https://www.researchsoft.org/blog/2022-08/)
- [Zenodo software archiving](https://help.zenodo.org/docs/github/)
