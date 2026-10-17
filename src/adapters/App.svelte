<script>
  let {state:s,dispatch}=$props();
</script>
<main><p data-count="">{s.rows.length}</p><label>Search<input aria-label="Search" value={s.text} oninput={e=>dispatch('text',e.target.value)}/></label><output>{s.text}</output><section class="dashboard">{#each s.cells as v,i (i)}<span class="cell">{v}</span>{/each}</section><table><tbody>{#each s.rows as r (r.id)}<tr data-id={r.id} class={r.id===s.selected?'selected':''}><td>{r.id}</td><td><button onclick={()=>dispatch('select',r.id)}>{r.label}</button></td><td>{r.value}</td></tr>{/each}</tbody></table></main>
