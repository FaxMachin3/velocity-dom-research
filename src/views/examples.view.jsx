export const Field = <label>{p.label}<input value={p.value} aria-label={p.label} onInput={e=>p.change(e.target.value)}/></label>;
export const Pair = <><input value={p.value} aria-label={p.id}/><span>{p.value}</span></>;
export const Text = <output>{p.value}</output>;
export const Nested = <section><h2>{p.name}</h2><div v-list={p.children} v-view={Text} v-key={x=>x.id}/></section>;
export const Form = <form><div v-list={p.fields} v-view={Field} v-key={x=>x.id}/><output aria-live="polite">{p.message}</output></form>;
export const Tree = <main><div v-list={p.groups} v-view={Nested} v-key={x=>x.id}/></main>;
