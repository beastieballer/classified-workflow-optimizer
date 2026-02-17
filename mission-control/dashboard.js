const files = {
  actions: 'ACTION_BOARD.md',
  build: 'BUILD_TRACKER.md',
  ideas: 'IDEA_VAULT.md',
  metrics: 'METRICS_LOG.md',
  activity: 'ACTIVITY_LOG.md'
};

const weeklyTargets = {
  inboundLeads: 10,
  qualifiedLeads: 5,
  scopeCallsBooked: 3,
  proposalsSent: 2,
  dealsWon: 1,
  revenueClosed: 5000
};

function getLines(md, startsWith) {
  return md.split('\n').filter((l) => l.trim().startsWith(startsWith));
}

function extractMetric(md, label) {
  const re = new RegExp(`- \\*\\*${label}:\\*\\*\\s*(.*)`);
  const match = md.match(re);
  if (!match) return 0;
  const raw = match[1].replace(/[$,]/g, '').trim();
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function statusClass(value, target) {
  const pct = target ? value / target : 0;
  if (pct >= 1) return 'good';
  if (pct >= 0.5) return 'warn';
  return 'bad';
}

function setStats(stats) {
  const root = document.getElementById('stats');
  root.innerHTML = '';
  stats.forEach((s) => {
    const el = document.createElement('div');
    el.className = `card ${s.tone || ''}`.trim();
    el.innerHTML = `<h3>${s.label}</h3><div class="v">${s.value}</div><div class="sub">${s.sub || ''}</div>`;
    root.appendChild(el);
  });
}

async function loadMd(path) {
  const res = await fetch(path);
  return await res.text();
}

function renderFunnel(metrics) {
  const stages = [
    ['Inbound', metrics.inboundLeads],
    ['Qualified', metrics.qualifiedLeads],
    ['Calls Booked', metrics.scopeCallsBooked],
    ['Proposals', metrics.proposalsSent],
    ['Won', metrics.dealsWon]
  ];
  const max = Math.max(...stages.map((s) => s[1]), 1);
  const html = stages
    .map(([name, value]) => {
      const width = Math.max(8, Math.round((value / max) * 100));
      return `<div class="row"><strong>${name}</strong><div class="bar-wrap"><div class="bar" style="width:${width}%"></div></div><span>${value}</span></div>`;
    })
    .join('');
  document.getElementById('funnel').innerHTML = html;
}

function renderScoreboard(metrics) {
  const rows = [
    ['Inbound Leads', metrics.inboundLeads, weeklyTargets.inboundLeads],
    ['Qualified Leads', metrics.qualifiedLeads, weeklyTargets.qualifiedLeads],
    ['Calls Booked', metrics.scopeCallsBooked, weeklyTargets.scopeCallsBooked],
    ['Proposals Sent', metrics.proposalsSent, weeklyTargets.proposalsSent],
    ['Deals Won', metrics.dealsWon, weeklyTargets.dealsWon],
    ['Revenue Closed ($)', metrics.revenueClosed, weeklyTargets.revenueClosed]
  ];

  document.getElementById('scoreboard').innerHTML = rows
    .map(([name, actual, target]) => {
      const pct = Math.min(100, Math.round((actual / target) * 100));
      const tone = statusClass(actual, target);
      const label = tone === 'good' ? 'On Target' : tone === 'warn' ? 'At Risk' : 'Off Pace';
      return `
        <div class="score-item">
          <div class="score-head">
            <span>${name}</span>
            <span>${actual}/${target} <span class="badge ${tone}">${label}</span></span>
          </div>
          <div class="progress"><span style="width:${pct}%"></span></div>
        </div>
      `;
    })
    .join('');
}

async function init() {
  const [actions, build, ideas, activity, metricsMd] = await Promise.all([
    loadMd(files.actions),
    loadMd(files.build),
    loadMd(files.ideas),
    loadMd(files.activity),
    loadMd(files.metrics)
  ]);

  const actionOpen = getLines(actions, '- [ ]');
  const actionDone = getLines(actions, '- [x]');
  const buildOpen = getLines(build, '- [ ]');
  const activityItems = getLines(activity, '- ');
  const ideaTitles = ideas
    .split('\n')
    .filter((l) => l.startsWith('## '))
    .slice(0, 3)
    .map((l) => l.replace(/^##\s*/, ''));

  const metrics = {
    inboundLeads: extractMetric(metricsMd, 'Inbound Leads'),
    qualifiedLeads: extractMetric(metricsMd, 'Qualified Leads'),
    scopeCallsBooked: extractMetric(metricsMd, 'Scope Calls Booked'),
    proposalsSent: extractMetric(metricsMd, 'Proposals Sent'),
    dealsWon: extractMetric(metricsMd, 'Deals Won'),
    revenueClosed: extractMetric(metricsMd, 'Broker Revenue Closed \\($\\)')
  };

  const closeRate = metrics.qualifiedLeads ? Math.round((metrics.dealsWon / metrics.qualifiedLeads) * 100) : 0;

  setStats([
    { label: 'Pipeline Value', value: `$${metrics.revenueClosed.toLocaleString()}`, sub: 'Closed so far', tone: statusClass(metrics.revenueClosed, weeklyTargets.revenueClosed) },
    { label: 'Leads This Week', value: metrics.inboundLeads, sub: `Target ${weeklyTargets.inboundLeads}`, tone: statusClass(metrics.inboundLeads, weeklyTargets.inboundLeads) },
    { label: 'Calls Booked', value: metrics.scopeCallsBooked, sub: `Target ${weeklyTargets.scopeCallsBooked}`, tone: statusClass(metrics.scopeCallsBooked, weeklyTargets.scopeCallsBooked) },
    { label: 'Close Rate', value: `${closeRate}%`, sub: 'Won / Qualified', tone: closeRate >= 20 ? 'good' : closeRate >= 10 ? 'warn' : 'bad' },
    { label: 'Open Actions', value: actionOpen.length, sub: `${actionDone.length} done`, tone: actionOpen.length <= 3 ? 'good' : actionOpen.length <= 7 ? 'warn' : 'bad' },
    { label: 'Build Blockers', value: buildOpen.length, sub: 'Open build tasks', tone: buildOpen.length <= 2 ? 'good' : buildOpen.length <= 6 ? 'warn' : 'bad' }
  ]);

  renderFunnel(metrics);
  renderScoreboard(metrics);

  document.getElementById('todayList').innerHTML = actionOpen
    .slice(0, 8)
    .map((l) => `<li>${l.replace('- [ ] ', '')}</li>`)
    .join('');

  document.getElementById('buildList').innerHTML = buildOpen
    .slice(0, 8)
    .map((l) => `<li>${l.replace('- [ ] ', '')}</li>`)
    .join('');

  document.getElementById('ideaList').innerHTML = ideaTitles
    .map((t) => `<li>${t}</li>`)
    .join('');

  document.getElementById('activityList').innerHTML = activityItems
    .slice(-10)
    .reverse()
    .map((l) => `<li>${l.replace('- ', '')}</li>`)
    .join('');
}

init().catch(console.error);
