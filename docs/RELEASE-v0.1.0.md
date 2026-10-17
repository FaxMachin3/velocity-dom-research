# v0.1.0 — experimental research preview

Initial public research baseline: restricted JSX-to-DOM compilation, synchronous signals/effects with ownership, keyed DOM reconciliation, and eight fixture implementations.

Includes source, generated views, prebuilt fixtures, tests, methodology, raw Chromium measurements, and offline reports. Targeted updates are competitive in these adapters; bulk creation and disposal remain weaknesses. Selection/state-granularity differences limit framework-level conclusions.

This is research code with unstable APIs. It has no SSR/hydration, routing, full component composition, general JSX/TypeScript support, Rust compiler, or Wasm acceleration. No peer review or independent reproduction is claimed.

The initial public packaging adds research, contribution, and citation documentation. The archived implementation and measurement files are preserved. Included benchmark results and test logs were supplied with the original archive; they have not been regenerated for this documentation update.

For reproduction use README.md and docs/METHODOLOGY.md. For interpretation use docs/RESEARCH.md and results/FINDINGS.md. Subsequent experiments should retain this baseline and disclose changes.
