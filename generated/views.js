import { bindText, bindProp, setProp, listen } from './dom.js';
export function shell(count, text, onInput) {
  return (() => {
    const _v0 = document.createElement("main");
    _v0.append((() => {
      const _v1 = document.createElement("p");
      setProp(_v1, "data-count", "");
      bindText(_v1, () => count.get());
      return _v1;
    })());
    _v0.append((() => {
      const _v2 = document.createElement("label");
      _v2.append("Search");
      _v2.append((() => {
        const _v3 = document.createElement("input");
        setProp(_v3, "aria-label", "Search");
        bindProp(_v3, "value", () => text.get());
        listen(_v3, "input", onInput);
        return _v3;
      })());
      return _v2;
    })());
    _v0.append((() => {
      const _v4 = document.createElement("output");
      bindText(_v4, () => text.get());
      return _v4;
    })());
    _v0.append((() => {
      const _v5 = document.createElement("section");
      setProp(_v5, "className", "dashboard");
      return _v5;
    })());
    _v0.append((() => {
      const _v6 = document.createElement("table");
      _v6.append((() => {
        const _v7 = document.createElement("tbody");
        return _v7;
      })());
      return _v6;
    })());
    return _v0;
  })();
}
export function rowView(item, selected, choose) {
  return (() => {
    const _v8 = document.createElement("tr");
    bindProp(_v8, "data-id", () => item.get().id);
    bindProp(_v8, "className", () => selected.get() ? 'selected' : '');
    _v8.append((() => {
      const _v9 = document.createElement("td");
      bindText(_v9, () => item.get().id);
      return _v9;
    })());
    _v8.append((() => {
      const _v10 = document.createElement("td");
      _v10.append((() => {
        const _v11 = document.createElement("button");
        listen(_v11, "click", choose);
        bindText(_v11, () => item.get().label);
        return _v11;
      })());
      return _v10;
    })());
    _v8.append((() => {
      const _v12 = document.createElement("td");
      bindText(_v12, () => item.get().value);
      return _v12;
    })());
    return _v8;
  })();
}
export function cellView(value) {
  return (() => {
    const _v13 = document.createElement("span");
    setProp(_v13, "className", "cell");
    bindText(_v13, () => value.get());
    return _v13;
  })();
}