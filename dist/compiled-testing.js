// src/poc/lis.js
function stablePositions(values) {
  const tails = [], links = new Int32Array(values.length);
  links.fill(-1);
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (!v) continue;
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (values[tails[mid]] < v) lo = mid + 1;
      else hi = mid;
    }
    if (lo) links[i] = tails[lo - 1];
    tails[lo] = i;
  }
  const stable = new Uint8Array(values.length);
  for (let i = tails.length ? tails[tails.length - 1] : -1; i >= 0; i = links[i]) stable[i] = 1;
  return stable;
}

// src/runtime/list.js
function createList(parent, view, { key = (x) => x.id, props = (x) => x, validate = true } = {}) {
  let rows = [], entries = [], context, alive = true;
  const registry = /* @__PURE__ */ new Map();
  const readKey = (x, i) => {
    const k = key(x, i);
    if (validate && !(typeof k === "string" || typeof k === "number" && Number.isFinite(k))) throw TypeError("Keys must be finite numbers or strings");
    return k;
  };
  const remove = (e, detach = true) => {
    try {
      e.block.destroy(detach);
    } finally {
      if (detach) for (const n of e.block.nodes) n.remove();
      registry.delete(e.key);
    }
  };
  function update(next, ctx) {
    if (!alive) throw Error("List disposed");
    if (next === rows && ctx === context) return;
    const keys = next.map(readKey);
    if (validate && new Set(keys).size !== keys.length) throw Error("Duplicate list key");
    const active = document.activeElement, focus = active && parent.contains(active) ? active : null;
    const selection = focus && "selectionStart" in focus ? { start: focus.selectionStart, end: focus.selectionEnd, direction: focus.selectionDirection } : null;
    const output = new Array(next.length), created = [];
    let head = 0, oldEnd = entries.length - 1, newEnd = next.length - 1;
    const patch = (e, i) => {
      if (e.row !== next[i] || ctx !== context) e.block.update(props(next[i], ctx));
      e.row = next[i];
      output[i] = e;
    };
    try {
      while (head <= oldEnd && head <= newEnd && entries[head].key === keys[head]) {
        patch(entries[head], head);
        head++;
      }
      while (head <= oldEnd && head <= newEnd && entries[oldEnd].key === keys[newEnd]) {
        patch(entries[oldEnd], newEnd);
        oldEnd--;
        newEnd--;
      }
      const positions = new Uint32Array(Math.max(0, newEnd - head + 1));
      const oldPositions = /* @__PURE__ */ new Map();
      for (let i = head; i <= oldEnd; i++) oldPositions.set(entries[i].key, i);
      let last = -1, ordered = true;
      for (let i = head; i <= newEnd; i++) {
        const index = oldPositions.get(keys[i]);
        if (index !== void 0) {
          positions[i - head] = index + 1;
          if (index < last) ordered = false;
          last = index;
          patch(entries[index], i);
          oldPositions.delete(keys[i]);
        } else {
          const block = view(props(next[i], ctx));
          if (!block?.nodes?.length) throw Error("List view must return a nonempty block");
          const e = { key: keys[i], row: next[i], block };
          created.push(e);
          output[i] = e;
        }
      }
      const bulk = head === 0 && oldEnd === entries.length - 1 && !positions.some(Boolean);
      const cleanupErrors = [];
      for (const index of oldPositions.values()) try {
        remove(entries[index], !bulk);
      } catch (e) {
        cleanupErrors.push(e);
      }
      if (bulk) {
        const fragment = document.createDocumentFragment();
        for (const e of output) fragment.append(...e.block.nodes);
        parent.replaceChildren(fragment);
      } else {
        const stable = ordered ? null : stablePositions(positions);
        let anchor = output[newEnd + 1]?.block.nodes[0] || null;
        for (let i = newEnd; i >= head; i--) {
          const e = output[i];
          if (!positions[i - head] || !ordered && !stable[i - head]) for (const node of e.block.nodes) parent.insertBefore(node, anchor);
          anchor = e.block.nodes[0];
        }
      }
      for (const e of created) registry.set(e.key, e);
      rows = next;
      entries = output;
      context = ctx;
      if (focus?.isConnected && document.activeElement !== focus) {
        focus.focus({ preventScroll: true });
        if (selection && selection.start !== null) focus.setSelectionRange(selection.start, selection.end, selection.direction);
      }
      if (cleanupErrors.length) throw new AggregateError(cleanupErrors, "List cleanup failed");
    } catch (error) {
      const owned = /* @__PURE__ */ new Set([...entries, ...created]);
      alive = false;
      entries = [];
      rows = [];
      registry.clear();
      for (const e of owned) try {
        e.block.destroy();
      } catch {
      }
      parent.replaceChildren();
      throw error;
    }
  }
  return { update, get: (k) => registry.get(k)?.block, destroy() {
    if (!alive) return;
    alive = false;
    const errors = [];
    for (const e of entries) try {
      remove(e);
    } catch (e2) {
      errors.push(e2);
    }
    entries = [];
    rows = [];
    registry.clear();
    parent.replaceChildren();
    if (errors.length) throw new AggregateError(errors, "List disposal failed");
  } };
}

// src/runtime/template.js
function set(node, name, value) {
  if (name === "value") {
    const next = String(value ?? "");
    if (node.value !== next) node.value = next;
  } else if (name === "checked" || name === "selected" || name === "disabled" || name === "multiple") node[name] = !!value;
  else if (name === "className") node.setAttribute("class", value ?? "");
  else if (value == null || value === false && !name.startsWith("aria-") && !name.startsWith("data-")) node.removeAttribute(name);
  else node.setAttribute(name, value === true && !name.startsWith("aria-") && !name.startsWith("data-") ? "" : String(value));
}
function defineTemplate(html, bindings) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const paths = /* @__PURE__ */ new Map();
  function walk(parent, path = []) {
    for (let i = 0; i < parent.childNodes.length; i++) {
      let n = parent.childNodes[i];
      const p = [...path, i];
      if (n.nodeType === 8 && n.data.startsWith("v:")) {
        paths.set(n.data.slice(2), p);
        const text = document.createTextNode("");
        n.replaceWith(text);
        n = text;
      } else if (n.nodeType === 1 && n.hasAttribute("data-v-node")) {
        paths.set(n.getAttribute("data-v-node"), p);
        n.removeAttribute("data-v-node");
      }
      walk(n, p);
    }
  }
  walk(template.content);
  const plans = bindings.map((b) => ({ ...b, path: paths.get(String(b.id)) }));
  if (plans.some((b) => !b.path)) throw Error("Template binding path missing");
  return function instantiate(initial) {
    const nodes = template.content.childNodes.length === 1 ? [template.content.firstChild.cloneNode(true)] : [...template.content.cloneNode(true).childNodes];
    const targets = plans.map((b) => {
      let node = { childNodes: nodes };
      for (const index of b.path) node = node.childNodes[index];
      return node;
    }), previous = new Array(plans.length).fill(/* @__PURE__ */ Symbol("unset")), lists = new Array(plans.length), cleanups = [];
    let current = initial, alive = true;
    const onCleanup = (fn) => {
      if (!alive) throw Error("Component disposed");
      cleanups.push(fn);
      return fn;
    };
    const block = { nodes, update(next) {
      if (!alive) throw Error("Component disposed");
      current = next;
      try {
        for (let i = 0; i < plans.length; i++) {
          const b = plans[i], node = targets[i];
          if (b.kind === "event") continue;
          if (b.kind === "list") {
            lists[i].update(b.read(next), b.context ? b.context(next) : void 0);
            continue;
          }
          const value = b.read(next);
          if (Object.is(value, previous[i])) continue;
          previous[i] = value;
          if (b.kind === "text") node.data = value == null ? "" : String(value);
          else set(node, b.name, value);
        }
      } catch (e) {
        try {
          block.destroy();
        } catch {
        }
        throw e;
      }
    }, onCleanup, destroy(detach = true) {
      if (!alive) return;
      alive = false;
      const errors = [];
      for (const cleanup of cleanups.splice(0).reverse()) try {
        cleanup();
      } catch (e) {
        errors.push(e);
      }
      if (detach) for (const node of nodes) node.remove();
      previous.length = 0;
      targets.length = 0;
      lists.length = 0;
      current = null;
      if (errors.length) throw new AggregateError(errors, "Component cleanup failed");
    } };
    try {
      for (let i = 0; i < plans.length; i++) {
        const b = plans[i], node = targets[i];
        if (b.kind === "event") {
          const listener = (e) => b.read(current)?.(e);
          node.addEventListener(b.name, listener);
          onCleanup(() => node.removeEventListener(b.name, listener));
        } else if (b.kind === "list") {
          const list = createList(node, b.view, { key: b.key, props: b.props, validate: true });
          lists[i] = list;
          onCleanup(() => list.destroy());
        }
      }
      block.update(initial);
      return block;
    } catch (error) {
      try {
        block.destroy();
      } catch {
      }
      throw error;
    }
  };
}
function mount(view, host, props) {
  const block = view(props);
  host.append(...block.nodes);
  return { update: (next) => block.update(next), flush: () => Promise.resolve(), destroy: () => block.destroy() };
}

// src/views/benchmark.view.jsx
var Row = defineTemplate('<tr data-v-node="0"><td><!--v:2--></td><td><button data-v-node="4"><!--v:5--></button></td><td><!--v:7--></td></tr>', [{
  id: 0,
  kind: "prop",
  name: "data-id",
  read: (p) => p.row.id
}, {
  id: 0,
  kind: "prop",
  name: "className",
  read: (p) => p.selected ? "selected" : ""
}, {
  id: 2,
  kind: "text",
  read: (p) => p.row.id
}, {
  id: 4,
  kind: "event",
  name: "click",
  read: (p) => () => p.choose(p.row.id)
}, {
  id: 5,
  kind: "text",
  read: (p) => p.row.label
}, {
  id: 7,
  kind: "text",
  read: (p) => p.row.value
}]);
var Cell = defineTemplate('<span class="cell"><!--v:1--></span>', [{
  id: 1,
  kind: "text",
  read: (p) => p
}]);
var App = defineTemplate('<main><p data-count=""><!--v:2--></p><label>Search<input aria-label="Search" data-v-node="4"></label><output><!--v:6--></output><section class="dashboard" data-v-node="7"></section><table><tbody data-v-node="9"></tbody></table></main>', [{
  id: 2,
  kind: "text",
  read: (p) => p.state.rows.length
}, {
  id: 4,
  kind: "prop",
  name: "value",
  read: (p) => p.state.text
}, {
  id: 4,
  kind: "event",
  name: "input",
  read: (p) => (e) => p.text(e.target.value)
}, {
  id: 6,
  kind: "text",
  read: (p) => p.state.text
}, {
  id: 7,
  kind: "list",
  read: (p) => p.state.cells,
  view: Cell,
  key: (x, i) => i
}, {
  id: 9,
  kind: "list",
  read: (p) => p.state.rows,
  view: Row,
  key: (row) => row.id,
  props: (row, ctx) => ({
    row,
    selected: row.id === ctx.selected,
    choose: ctx.choose
  }),
  context: (p) => p.selection
}]);

// src/adapters/velocity-compiled.js
function mount2(host, initial, dispatch) {
  const choose = (id) => dispatch("select", id), text = (value) => dispatch("text", value);
  let selection = { selected: initial.selected, choose };
  const props = (state) => {
    if (selection.selected !== state.selected) selection = { selected: state.selected, choose };
    return { state, selection, text };
  };
  const app = mount(App, host, props(initial));
  return { ...app, update: (state) => app.update(props(state)) };
}
export {
  mount2 as mount
};
