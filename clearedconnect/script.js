const form = document.getElementById('intakeForm');
const result = document.getElementById('result');
const year = document.getElementById('year');
const config = window.CC_CONFIG || { leadCapture: { provider: 'none' } };

if (year) year.textContent = new Date().getFullYear();

function initGA4() {
  const id = config?.ga4MeasurementId;
  if (!id) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id);
}

function track(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

function wireCtaTracking() {
  const nodes = document.querySelectorAll('[data-track]');
  nodes.forEach((node) => {
    node.addEventListener('click', () => {
      const key = node.getAttribute('data-track');
      track('select_content', { content_type: 'cta', item_id: key });
    });
  });
}

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

async function sendLead(payload) {
  const leadCapture = config?.leadCapture || {};
  if (!leadCapture.endpoint || leadCapture.provider === 'none') return { skipped: true };

  const headers = { 'Content-Type': 'application/json' };
  if (leadCapture.apiKey) headers.Authorization = `Bearer ${leadCapture.apiKey}`;

  const body = {
    provider: leadCapture.provider,
    source: 'clearedconnect.io',
    submittedAt: new Date().toISOString(),
    ...payload
  };

  const res = await fetch(leadCapture.endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Lead capture failed (${res.status})`);
  }

  return { ok: true };
}

form?.addEventListener('submit', async (e) => {
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

  track('generate_lead', {
    method: 'intake_form',
    value: score,
    clearance: data.clearance,
    timeline: data.timeline
  });

  try {
    await sendLead({ data, score, label });
  } catch (err) {
    console.warn(err.message);
    result.innerHTML += '<br><small>Note: lead capture endpoint is not connected yet.</small>';
  }
});

initGA4();
wireCtaTracking();
