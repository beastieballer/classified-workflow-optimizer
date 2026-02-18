async function init(){
  const data = await fetch('kpi-data.json').then(r=>r.json());
  const grid = document.getElementById('kpiGrid');
  const detail = document.getElementById('kpiDetail');
  const title = document.getElementById('kpiTitle');
  const meta = document.getElementById('kpiMeta');
  const details = document.getElementById('kpiDetails');
  const actions = document.getElementById('kpiActions');

  data.kpis.forEach(k=>{
    const pct = Math.round((k.value / Math.max(1,k.target))*100);
    const tone = k.status === 'track' ? 'track' : (k.status === 'risk' ? 'risk' : 'off');
    const card = document.createElement('button');
    card.className = 'kpi';
    card.innerHTML = `<div class="lbl">${k.label}</div><div class="val">${k.value}/${k.target}</div><div class="sub">${k.unit} • ${pct}% to target</div><span class="badge ${tone}">${k.status.toUpperCase()}</span>`;
    card.addEventListener('click', ()=>{
      detail.classList.remove('hidden');
      title.textContent = k.label;
      meta.textContent = `Current ${k.value}/${k.target} ${k.unit} • Status: ${k.status.toUpperCase()}`;
      details.innerHTML = k.details.map(x=>`<li>${x}</li>`).join('');
      actions.innerHTML = k.nextActions.map(x=>`<li>${x}</li>`).join('');
      detail.scrollIntoView({behavior:'smooth', block:'start'});
    });
    grid.appendChild(card);
  });
}
init().catch(console.error);
