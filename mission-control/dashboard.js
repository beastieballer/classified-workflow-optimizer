const files = {
  actions: 'ACTION_BOARD.md',
  build: 'BUILD_TRACKER.md',
  ideas: 'IDEA_VAULT.md',
  metrics: 'METRICS_LOG.md',
  activity: 'ACTIVITY_LOG.md'
};

function getLines(md, startsWith) {
  return md.split('\n').filter((l) => l.trim().startsWith(startsWith));
}

function setStats(stats) {
  const root = document.getElementById('stats');
  root.innerHTML = '';
  stats.forEach((s) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `<h3>${s.label}</h3><div class="v">${s.value}</div>`;
    root.appendChild(el);
  });
}

async function loadMd(path) {
  const res = await fetch(path);
  return await res.text();
}

async function init() {
  const [actions, build, ideas, activity] = await Promise.all([
    loadMd(files.actions),
    loadMd(files.build),
    loadMd(files.ideas),
    loadMd(files.activity)
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

  setStats([
    { label: 'Open Actions', value: actionOpen.length },
    { label: 'Done Actions', value: actionDone.length },
    { label: 'Open Build Tasks', value: buildOpen.length },
    { label: 'Recent Activity Items', value: activityItems.length }
  ]);

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
    .slice(-8)
    .reverse()
    .map((l) => `<li>${l.replace('- ', '')}</li>`)
    .join('');
}

init().catch(console.error);
