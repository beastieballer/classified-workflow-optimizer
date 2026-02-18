const files = {
  rollup: './WEEKLY_ROLLUP.md',
  personalMetrics: '../personal/METRICS_LOG.md',
  personalActions: '../personal/ACTION_BOARD.md',
  businessMetrics: '../mission-control/METRICS_LOG.md',
  businessActions: '../mission-control/ACTION_BOARD.md',
  build: '../mission-control/BUILD_TRACKER.md'
};

const num = (s) => {
  const m = String(s || '').match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
};

async function text(path){ const r = await fetch(path); return r.text(); }
function lines(md,prefix){ return md.split('\n').filter(l=>l.trim().startsWith(prefix)); }
function tone(score){ if(score==null) return 'bad'; if(score>=90) return 'good'; if(score>=75) return 'warn'; return 'bad'; }

function statCard(label,value,sub,t='warn'){ return `<div class="card ${t}"><h3>${label}</h3><div class="v">${value}</div><div>${sub||''}</div></div>`; }

function parseRollup(md){
  const get = (label)=> {
    const re = new RegExp(`- \*\*${label}:\*\*\\s*([^\\n]+)`);
    const m = md.match(re); return m?m[1].trim():'__';
  };
  const getLine = (starts)=> {
    const l = md.split('\n').find(x=>x.startsWith(starts)); return l?l.split(':').slice(1).join(':').trim():'__';
  };
  return {
    personal: get('Personal Total'),
    business: get('Business Total'),
    weighted: getLine('- **Weighted Total (50/50)**'),
    week: (md.match(/## Week Ending:\s*([^\n]+)/)||[])[1] || '__',
    personalRows: {
      ampm: getLine('- AM/PM Routine'),
      move: getLine('- Movement + Recovery'),
      org: getLine('- Organization + Reviews')
    },
    bizRows: {
      pipeline: getLine('- **Subtotal:**'),
    }
  }
}

function parseWeeklyMetrics(md){
  const blocks = md.split('---').filter(b=>b.includes('Week Ending:'));
  const b = blocks[blocks.length-1] || '';
  const grab=(k)=>{const m=b.match(new RegExp(`\\*\\*${k}:\\*\\*\\s*([^\\n]+)`)); return m?m[1].trim():'__';};
  return {
    qualified: grab('Qualified Leads'),
    calls: grab('Scope Calls Completed'),
    proposals: grab('Proposals Sent'),
    deals: grab('Deals Won'),
    revenue: grab('Broker Revenue Closed \(\$\)'),
    response: grab('Avg Time to First Response')
  };
}

function setStats(html){ document.getElementById('stats').innerHTML = html; }

async function init(){
  const [rollup, pMetrics, pActions, bMetrics, bActions, build] = await Promise.all([
    text(files.rollup), text(files.personalMetrics), text(files.personalActions), text(files.businessMetrics), text(files.businessActions), text(files.build)
  ]);

  const r = parseRollup(rollup);
  const bm = parseWeeklyMetrics(bMetrics);

  const pScore = num(r.personal);
  const bScore = num(r.business);
  const wScore = num(r.weighted);

  const pOpen = lines(pActions, '- [ ]');
  const bOpen = lines(bActions, '- [ ]');
  const blockers = (()=>{
    const sec = (build.match(/## Blockers \/ Risks([\s\S]*?)(\n## |$)/)||[])[1] || '';
    return lines(sec, '- ');
  })();

  setStats([
    statCard('Week Ending', r.week, 'Current rollup window', 'warn'),
    statCard('Personal Score', pScore!=null?`${pScore}/100`:'__', 'Life execution', tone(pScore)),
    statCard('Business Score', bScore!=null?`${bScore}/100`:'__', 'Venture execution', tone(bScore)),
    statCard('Weighted Total', wScore!=null?`${wScore}/100`:'__', '50/50 blend', tone(wScore)),
    statCard('Open Personal Actions', pOpen.length, 'From personal ACTION_BOARD', pOpen.length<=3?'good':pOpen.length<=7?'warn':'bad'),
    statCard('Open Business Actions', bOpen.length, 'From mission-control ACTION_BOARD', bOpen.length<=5?'good':'warn'),
    statCard('Qualified Leads', bm.qualified, 'Latest weekly snapshot', num(bm.qualified)>=5?'good':'warn'),
    statCard('Revenue Closed', bm.revenue, 'Latest weekly snapshot', num(bm.revenue)>0?'good':'warn')
  ].join(''));

  document.getElementById('executive').innerHTML = `
    <div class="exec-row"><span>Overall Status</span><span class="badge ${tone(wScore)}">${wScore==null?'Not yet scored':wScore>=90?'On fire':wScore>=75?'Strong':wScore>=60?'Mixed':'Reset'}</span></div>
    <div class="exec-row"><span>Personal</span><span>${r.personal}</span></div>
    <div class="exec-row"><span>Business</span><span>${r.business}</span></div>
    <div class="exec-row"><span>Weighted</span><span>${r.weighted}</span></div>
  `;

  document.getElementById('trend').innerHTML = `
    <div class="item"><span>Personal vs prior week</span><strong>Pending history</strong></div>
    <div class="item"><span>Business vs prior week</span><strong>Pending history</strong></div>
    <div class="item"><span>Constraint risk</span><strong>${blockers.length} active</strong></div>
  `;

  const pOps = [
    `AM/PM Routine: ${r.personalRows.ampm}`,
    `Movement + Recovery: ${r.personalRows.move}`,
    `Organization + Reviews: ${r.personalRows.org}`,
    `Open personal actions: ${pOpen.length}`
  ];
  document.getElementById('personalOps').innerHTML = pOps.map(x=>`<li>${x}</li>`).join('');

  const bOps = [
    `Qualified leads: ${bm.qualified}`,
    `Calls completed: ${bm.calls}`,
    `Proposals sent: ${bm.proposals}`,
    `Deals won: ${bm.deals}`,
    `Avg first response: ${bm.response}`
  ];
  document.getElementById('businessOps').innerHTML = bOps.map(x=>`<li>${x}</li>`).join('');

  const top3 = [
    ...(pOpen.slice(0,1).map(l=>l.replace('- [ ] ', '[Personal] '))),
    ...(bOpen.slice(0,2).map(l=>l.replace('- [ ] ', '[Business] ')))
  ];
  document.getElementById('top3').innerHTML = top3.map(x=>`<li>${x}</li>`).join('') || '<li>No open actions found</li>';
  document.getElementById('blockers').innerHTML = blockers.slice(0,8).map(l=>`<li>${l.replace('- ','')}</li>`).join('') || '<li>No blockers listed</li>';
}

init().catch(console.error);
