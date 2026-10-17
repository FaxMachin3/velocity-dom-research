# Architecture and API

## Compilation

`src/poc/compiler.js` parses JSX using Babel and lowers intrinsic HTML elements to IIFEs containing direct `document.createElement`, attribute/property writes, event listeners, and dynamic binding registrations. The build invokes this compiler only for Velocity's views. `generated/views.js` is the readable result.

There is no virtual DOM, runtime JSX interpreter, or component tree diff. The compiler is restricted: lowercase HTML tags, literal attributes, expression attributes, events, text, and scalar expression children. Components are normal functions invoked by the adapter. Lists are explicitly mounted using `keyed`.

Unsupported component tags, fragments, and spreads fail at compile time. JSX whitespace normalization is simplified; SVG, portals, arbitrary component composition, array children, refs, SSR, and TypeScript stripping are not part of v0. This is a template compiler POC, not a complete JSX language implementation. All dynamic text uses text nodes; untrusted HTML is not evaluated.

## Reactive semantics

- `signal(value)` returns `{get(), set(value)}`. Equality is `Object.is`.
- `effect(fn)` executes immediately, tracks reads, and returns an idempotent disposer.
- Dependencies are detached and re-collected on every effect execution.
- `batch(fn)` defers effect execution until the outermost batch exits; direct signal reads see writes immediately.
- `untrack(fn)` suppresses dependency collection.
- `root(fn)` establishes ownership; nested owners and effects are disposed recursively.
- `onCleanup(fn)` requires an owner and runs before an effect reruns or an owner is disposed.
- `derived(fn)` is intentionally uncached and always reads current values. It is not a memoized computed signal.
- `detachedRoot` is an internal escape hatch for keyed row ownership; callers must dispose it.

The scheduler is synchronous and includes a cycle guard. It is not a concurrent scheduler and does not guarantee general glitch freedom for effect-to-signal chains. Prefer derived reads; computed invalidation, error boundaries, and asynchronous resource semantics require further design.

## Keyed reconciliation

`keyed(parent, read, key, create, update)` keeps a map from key to a DOM node, per-row state, and detached owner. Retained items update bindings without recreation. Removed items dispose their owners. A cursor-based algorithm moves retained nodes with `insertBefore`.

Time complexity is O(n) scanning per list update, plus DOM moves and changed bindings. It does not use a longest-increasing-subsequence optimization. The benchmark uses immutable records and a shared state reducer; framework work is not hidden in a custom data generator.

## Application adapter

Velocity uses per-row item signals and selection signals, plus text, count, and dashboard-cell signals. The selected row gets a targeted update. List changes require reconciliation; the selection registry is pruned when rows disappear.

Other frameworks implement the same output contract using their own rendering models. All adapters implement `mount(host, initial, dispatch)` returning `update`, `flush`, and `destroy`.

## Scope boundaries

This release validates a small client DOM execution model. It does not implement the complete framework proposed in the planning conversation. It excludes server rendering, hydration, streaming, routing, data caches, worker modules, Rust, Wasm, GPU rendering, and compatibility adapters. Those require independent design and measurement.
