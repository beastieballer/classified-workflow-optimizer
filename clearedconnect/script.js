const form = document.getElementById('intakeForm');
const result = document.getElementById('result');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

function scoreIntake(data) {
  let score = 50;

  if (data.clearance === 'Top Secret / SCI' || data.clearance === 'SCIF (active)') score += 20;
  if (data.timeline === '30') score += 20;
  if (data.timeline === '60') score += 10;
  if ((data.scope || '').length > 40) score += 10;

  return Math.max(0, Math.min(100, score));
}

function urgencyLabel(score) {
  if (score >= 85) return 'High-priority secure project';
  if (score >= 70) return 'Qualified and time-sensitive';
  return 'Qualified - follow-up recommended';
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (!data.company || !data.contact || !data.email || !data.location || !data.clearance || !data.timeline) {
    result.classList.remove('ok');
    result.textContent = 'Please complete all required fields before running intake.';
    return;
  }

  const score = scoreIntake(data);
  const label = urgencyLabel(score);

  result.classList.add('ok');
  result.innerHTML = `<strong>Readiness score: ${score}/100</strong><br>${label}. Next step: book a confidential scope call.`;
});
