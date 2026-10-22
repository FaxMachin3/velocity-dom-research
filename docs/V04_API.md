# v0.4 public template API

This is a compiled-template runtime with explicit snapshot updates, not a full React-compatible JSX language or a new fine-grained signal system. The original experimental signal runtime is retained unchanged as a separate control.

## Compile views

Files ending in `.view.jsx` are compiled by the supplied build integration. An exported JSX expression defines a view factory. Dynamic expressions receive the current props object as `p`:

```jsx
export const Greeting = <p>Hello {p.name}</p>;
```

`Greeting({name: 'Raj'})` returns a block. A block exposes `nodes`, `update(props)`, `onCleanup(callback)`, and idempotent `destroy()`. Mount with `mount(Greeting, host, props)` from `src/runtime/template.js`. `flush()` resolves immediately because updates are synchronous. Dynamic text uses text nodes; it is never interpreted as HTML.

## Keyed children

```jsx
export const Item = <li>{p.label}</li>;
export const List = <ul v-list={p.items} v-view={Item} v-key={item => item.id}/>;
```

The list exclusively owns its container. Keys must be unique finite numbers or strings; `2` and `'2'` are different keys. Duplicate keys are rejected before DOM mutation. Input arrays and row objects must be immutable snapshots. No in-place mutation tracking is provided.

`v-props={(item, context) => ...}` transforms item props; `v-context={p.context}` supplies shared context. Context identity changes update retained children even if the items array is unchanged. For index-keyed fixed collections use `(item, index) => index`; do not use index identity for reorderable stateful records.

## Components and ownership

`defineComponent(View, setup)` wraps a view with a once-per-instance setup callback. Register resources with `block.onCleanup(() => unsubscribe())`. Nested lists dispose children. Reordering preserves retained blocks; removal disposes them. All cleanup callbacks run even if one throws, then an AggregateError is raised. Construction/update errors dispose owned blocks rather than promise rollback of arbitrary user side effects.

```js
const Owned = defineComponent(Greeting, (block, initialProps) => {
  const unsubscribe = subscribe(initialProps.id, data => block.update(data));
  block.onCleanup(unsubscribe);
});
```

Cleanup is explicit for resources acquired by application code. The framework cannot discover external timers or subscriptions that callers fail to register.

## Multi-node blocks

Fragments such as `<><input value={p.value}/><span>{p.value}</span></>` produce multi-node blocks. Retained ranges preserve node identity on reorder. Focus/caret restoration is tested for ordinary text inputs. Native IME, iframe, custom-element and media state preservation are not certified.

## DOM and compiler limits

Supported: intrinsic HTML, static attributes/text, dynamic text/attributes, value/checked/selected/disabled/multiple properties, events, fragments and explicit list directives. Dynamic event callbacks are read from current props. Lists cannot mix static children with managed entries. Spread attributes, component tags, SVG namespaces, portals, implicit conditional child nodes, arbitrary JSX render callbacks and raw HTML bindings are not supported. Use explicit views/list structure or ordinary JavaScript composition. Reactive memoization, scheduling, SSR and hydration are not added by this release.

The compiler hoists static markup and binding plans. The runtime removes compiler markers from the template before cloning. Single-root views clone one node; multi-root views clone a fragment. Dynamic bindings share plans instead of creating one closure per binding. Compiled output is retained under generated/ for inspection.

## Reproduction

`USE_PREBUILT_WASM=1 npm run build` verifies and reuses the unchanged v0.3 Wasm asset. Omit the flag to rebuild with the pinned Rust toolchain. The compiled v0.4 adapter does not use Wasm; the older Wasm adapter remains an explicit control.

`npm run check:runtime` exercises general keys, multi-node records, cleanup exceptions, input retention, nested lists, randomized updates and remounts. `npm run check:stress` covers the older variants and compiled fixture. All timing scripts require a current correctness gate for the built app.
