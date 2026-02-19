const channels = [
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

const alerts = [
  'MD-07 CTV ad missing sponsor disclosure in final frame.',
  'Two variants contain absolute safety language (replace with “reduce risk”).',
  'One creative references prohibited claim category for local compliance policy.'
];

const totalWeighted = channels.reduce((a,c)=>a + c.current*c.perf,0);
const rec = channels.map(c=>({
  ...c,
  recommended: Math.round(((c.current*c.perf)/totalWeighted)*100)
}));

const lift = ((variants.reduce((a,v)=>a+v.lift,0)/variants.length)-1)*100;
const eff = (totalWeighted/100).toFixed(2);

document.getElementById('lift').textContent = `+${lift.toFixed(1)}%`;
document.getElementById('risk').textContent = alerts.length > 2 ? 'Medium' : 'Low';
document.getElementById('eff').textContent = eff;

document.getElementById('rows').innerHTML = rec.map(r=>{
  const d = r.recommended-r.current;
  const sign = d>0?'+':'';
  return `<tr><td>${r.name}</td><td>${r.current}%</td><td>${r.recommended}%</td><td>${sign}${d}%</td></tr>`;
}).join('');

document.getElementById('variants').innerHTML = variants
  .sort((a,b)=>b.lift-a.lift)
  .map(v=>`<li><strong>${v.name}</strong> — predicted lift index ${v.lift.toFixed(2)}</li>`)
  .join('');

document.getElementById('alerts').innerHTML = alerts.map(a=>`<li>${a}</li>`).join('');
