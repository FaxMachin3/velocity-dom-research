// Velocity v0: synchronous fine-grained reactivity with batched notifications.
let observer = null, owner = null, depth = 0, flushing = false;
const pending = new Set();
function cleanup(scope) {
  for (const child of [...scope.children]) child.dispose();
  for (const fn of scope.cleanups.splice(0).reverse()) fn();
}
function flush() {
  if (depth || flushing) return;
  flushing = true;
  let steps = 0;
  try {
    while (pending.size) {
      if (++steps > 10000) throw new Error('Reactive update cycle exceeded 10000 steps');
      const job = pending.values().next().value;
      pending.delete(job);
      if (!job.disposed) job.run();
    }
  } finally { flushing = false; }
}
export function signal(value) {
  const subscribers = new Set();
  return {
    get() { if (observer) { subscribers.add(observer); observer.deps.add(subscribers); } return value; },
    set(next) {
      if (Object.is(value, next)) return;
      value = next;
      for (const sub of subscribers) pending.add(sub);
      flush();
    }
  };
}
export function effect(fn) {
  const parent = owner;
  const job = {
    deps: new Set(), children: new Set(), cleanups: [], disposed: false,
    dispose() {
      if (job.disposed) return;
      job.disposed = true; pending.delete(job);
      for (const dep of job.deps) dep.delete(job);
      job.deps.clear(); cleanup(job); parent?.children.delete(job);
    },
    run() {
      for (const dep of job.deps) dep.delete(job);
      job.deps.clear(); cleanup(job);
      const prev = observer, prevOwner = owner;
      observer = job; owner = job;
      try { fn(); } finally { observer = prev; owner = prevOwner; }
    }
  };
  parent?.children.add(job);
  try { job.run(); } catch (e) { job.dispose(); throw e; }
  return job.dispose;
}
export function batch(fn) { depth++; try { return fn(); } finally { depth--; flush(); } }
export function untrack(fn) { const prev = observer; observer = null; try { return fn(); } finally { observer = prev; } }
export function onCleanup(fn) { if (!owner) throw new Error('onCleanup requires an owner'); owner.cleanups.push(fn); }
export function root(fn) {
  const parent = owner;
  const scope = {children: new Set(), cleanups: [], disposed: false, dispose() {
    if (scope.disposed) return;
    scope.disposed = true; cleanup(scope); parent?.children.delete(scope);
  }};
  parent?.children.add(scope);
  owner = scope;
  try { return fn(scope.dispose); } catch (e) { scope.dispose(); throw e; } finally { owner = parent; }
}
// Derived reads intentionally recompute. Cached computed invalidation is a future feature.
export function derived(fn) { return {get: fn}; }
export function detachedRoot(fn) {
  const prevOwner = owner, prevObserver = observer;
  owner = null; observer = null;
  try { return root(fn); } finally { owner = prevOwner; observer = prevObserver; }
}
