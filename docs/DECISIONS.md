# Engineering decisions

**Use a hybrid boundary first.** A Rust-owned identity planner is small enough to validate independently and can be exercised under exactly the same renderer. Moving everything at once would prevent attribution of results.

**Keep all original competitors.** The normal-CPU run remeasures the original POC, handwritten DOM, six third-party libraries/frameworks and the two new variants (ten implementations in total). No historical timing is substituted for a current measurement.

**Keep matching outputs, not synthetic empty operations.** Every UI measurement is checked against expected DOM output. The standalone planner consumes IDs and its result is checked against an independent oracle. Warmups are excluded from reported samples.

**Include copying and startup.** Data conversion is part of planner timing, and Wasm fetch/compile is part of ready timing. Both JS and Wasm bytes are listed. Compiler build time is not a browser rendering result.

**Do not choose a default from a small median difference.** Shared-host headless results establish hypotheses, not production superiority. Structural DOM work may dominate a faster kernel. The next experiment should keep a large dataset resident in Rust and compare complete interactions against JS and worker alternatives.
