import { defineTemplate as __velocityTemplate } from "../runtime/template.js";
// Public templates: p is the current props object in dynamic expressions.
export const Row = __velocityTemplate("<tr data-v-node=\"0\"><td><!--v:2--></td><td><button data-v-node=\"4\"><!--v:5--></button></td><td><!--v:7--></td></tr>", [{
  id: 0,
  kind: "prop",
  name: "data-id",
  read: p => p.row.id
}, {
  id: 0,
  kind: "prop",
  name: "className",
  read: p => p.selected ? 'selected' : ''
}, {
  id: 2,
  kind: "text",
  read: p => p.row.id
}, {
  id: 4,
  kind: "event",
  name: "click",
  read: p => () => p.choose(p.row.id)
}, {
  id: 5,
  kind: "text",
  read: p => p.row.label
}, {
  id: 7,
  kind: "text",
  read: p => p.row.value
}]);
export const Cell = __velocityTemplate("<span class=\"cell\"><!--v:1--></span>", [{
  id: 1,
  kind: "text",
  read: p => p
}]);
export const App = __velocityTemplate("<main><p data-count=\"\"><!--v:2--></p><label>Search<input aria-label=\"Search\" data-v-node=\"4\"></label><output><!--v:6--></output><section class=\"dashboard\" data-v-node=\"7\"></section><table><tbody data-v-node=\"9\"></tbody></table></main>", [{
  id: 2,
  kind: "text",
  read: p => p.state.rows.length
}, {
  id: 4,
  kind: "prop",
  name: "value",
  read: p => p.state.text
}, {
  id: 4,
  kind: "event",
  name: "input",
  read: p => e => p.text(e.target.value)
}, {
  id: 6,
  kind: "text",
  read: p => p.state.text
}, {
  id: 7,
  kind: "list",
  read: p => p.state.cells,
  view: Cell,
  key: (x, i) => i
}, {
  id: 9,
  kind: "list",
  read: p => p.state.rows,
  view: Row,
  key: row => row.id,
  props: (row, ctx) => ({
    row,
    selected: row.id === ctx.selected,
    choose: ctx.choose
  }),
  context: p => p.selection
}]);