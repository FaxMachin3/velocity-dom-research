# Contributing to the research preview

Feedback on correctness, reproducibility, and benchmark methodology is welcome. APIs are unstable; opening the repository does not imply a production support commitment.

For bug reports, include the commit/release, OS, Node/browser versions, reproduction commands, expected behavior, and observed behavior. Remove credentials and personal information from logs.

For performance reports, include raw samples, warmups, CPU profile, browser executable/version, hardware, and exact build. A single timing is not sufficient to establish an improvement.

Discuss broad API or architectural changes in an issue before implementing them. Keep focused fixes and experiments in separate pull requests. Adapter improvements should preserve the common output and keyed-identity contracts, disclose optimizations, and retain a meaningful baseline.

Follow the README setup. Run `npm test`, `npm run build`, and `npm run check` for implementation changes, plus the affected browser/explorer checks where applicable. Do not replace baseline results with unrelated local runs. Documentation-only changes do not require timing reruns.

Useful contributions include equivalent granular-state adapters, runtime error/cleanup tests, focus and IME checks, independent reproduction, and profiling creation/disposal. See docs/RESEARCH.md and docs/ROADMAP.md.

The repository uses the MIT license; retain applicable copyright and third-party notices. Attribute external code and ideas.
