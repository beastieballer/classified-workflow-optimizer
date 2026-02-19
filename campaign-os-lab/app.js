let channels = [
  {name:'Linear TV', current:35, perf:0.92},
  {name:'CTV', current:30, perf:1.18},
  {name:'Digital Video', current:20, perf:1.05},
  {name:'Social', current:15, perf:0.84}
];

const variants = [
  {name:'Security + Family', lift:1.24},
  {name:'Economic + Local', lift:1.11},
  {name:'Contrast + Proof', lift:0.89}
];

const baseAlerts = [
  'MD-07 CTV ad missing sponsor disclosure in final frame.',
  'Two variants contain absolute safety language (replace with “reduce risk”).',
  'One creative references prohibited claim category for local compliance policy.'
];

const $ = (id) => document.getElementById(id);

function calc() {
  const budget = Number($('budget').value || 0);
  const tol = $('riskTolerance').value;

  const perfMultiplier = tol === 'high' ? 1.15 : tol === 'low' ? 0.9 : 1;
  const weighted = channels.map(c => ({...c, score: c.current * c.perf * perfMultiplier}));
  const totalWeighted = weighted.reduce((a,c)=>a+c.score,0) || 1;

  const rec = weighted.map(c=> ({
    ...c,
    recommended: Math.round((c.score/totalWeighted)*100)
  }));

  const lift = ((variants.reduce((a,v)=>a+v.lift,0)/variants.length)-1)*100 * (tol === 'high' ? 1.1 : tol==='low' ? 0.85 : 1);
  const eff = (totalWeighted/100).toFixed(2);

  $('lift').textContent = `+${lift.toFixed(1)}%`;
  const riskLevel = tol === 'high' ? 'High' : baseAlerts.length > 2 ? 'Medium' : 'Low';
  $('risk').textContent = riskLevel;
  $('eff').textContent = eff;

  $('rows').innerHTML = rec.map(r=>{
    const d = r.recommended-r.current;
    const sign = d>0?'+':'';
    const dollars = Math.round((r.recommended/100)*budget).toLocaleString();
    return `<tr><td>${r.name}</td><td>${r.current}%</td><td>${r.recommended}%</td><td>${sign}${d}%</td><td>$${dollars}</td></tr>`;
  }).join('');

  $('variants').innerHTML = variants
    .sort((a,b)=>b.lift-a.lift)
    .map(v=>`<li><strong>${v.name}</strong> — predicted lift index ${v.lift.toFixed(2)}</li>`)
    .join('');

  const alerts = [...baseAlerts];
  if (tol === 'high') alerts.push('High risk tolerance selected: require legal reviewer sign-off.');
  $('alerts').innerHTML = alerts.map(a=>`<li>${a}</li>`).join('');
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const parsed = [];
  for (const line of lines.slice(1)) {
    const [name,current,perf] = line.split(',').map(s=>s.trim());
    const c = Number(current); const p = Number(perf);
    if (!name || !Number.isFinite(c) || !Number.isFinite(p)) continue;
    parsed.push({name, current:c, perf:p});
  }
  if (parsed.length) channels = parsed;
}

$('budget').addEventListener('input', calc);
$('riskTolerance').addEventListener('change', calc);
$('csv').addEventListener('change', async (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  const txt = await f.text();
  parseCsv(txt);
  calc();
});

calc();
