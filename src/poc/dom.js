import {effect, onCleanup, root, untrack} from './reactivity.js';
export function bindText(parent, read) {
  const node = document.createTextNode(''); parent.append(node);
  effect(() => { const value = read(); node.data = value == null ? '' : String(value); });
}
export function bindProp(node, name, read) { effect(() => setProp(node, name, read())); }
export function setProp(node, name, value) {
  if (name === 'value') { if (node.value !== String(value ?? '')) node.value = value ?? ''; }
  else if (name === 'className') node.className = value ?? '';
  else if (name === 'checked') node.checked = !!value;
  else if (value == null || value === false) node.removeAttribute(name);
  else node.setAttribute(name, value === true ? '' : String(value));
}
export function listen(node, name, fn) { node.addEventListener(name, fn); onCleanup(() => node.removeEventListener(name, fn)); }
export function keyed(parent, read, key, create, update) {
  const entries = new Map();
  // Entries are owned by this list, not by the rerunning reconciliation effect.
  onCleanup(() => { for (const e of entries.values()) e.dispose(); entries.clear(); });
  effect(() => {
    const items = read();
    untrack(() => {
      const seen = new Set();
      for (const item of items) { const id = key(item); if (seen.has(id)) throw new Error('Duplicate key: ' + id); seen.add(id); }
      for (const [id, e] of entries) if (!seen.has(id)) { e.dispose(); e.node.remove(); entries.delete(id); }
      let cursor = parent.firstChild;
      for (const item of items) {
        const id = key(item); let entry = entries.get(id);
        if (!entry) {
          // Detached owner prevents reconciliation reruns from disposing retained rows.
          entry = detachedRoot(dispose => ({...create(item), dispose})); entries.set(id, entry);
        } else update(entry, item);
        if (entry.node !== cursor) parent.insertBefore(entry.node, cursor);
        cursor = entry.node.nextSibling;
      }
    });
  });
}
// Exported internal helper from reactivity keeps list entry lifetimes explicit.
import {detachedRoot} from './reactivity.js';
