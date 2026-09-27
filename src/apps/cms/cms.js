// Website CMS (prototype). Reads the seed data the build wrote to assets/data/cms-seed.json
// (the same content collections the public site renders from) and the shared 'cerfodes.' store
// for leads, subscribers and settings, so triaging a lead here is what the public contact form
// already writes, and toggling a rule here changes how the next public submission is scored.
import { store, track } from '../assets/js/lib/store.js';
import { scoreLead, bucketFor, trainThresholds, DEFAULT_RULES, DEFAULT_THRESHOLDS } from '../assets/js/lib/lead-score.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const L = (v, lang) => (v && typeof v === 'object' && 'en' in v) ? (v[lang] ?? v.en) : (v ?? '');
const en = v => L(v, 'en');

function toast(msg) {
  const t = $('[data-toast]'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 3200);
}
function badge(cls, label) { return `<span class="badge ${cls}">${label}</span>`; }
function renderTable(name, rows, headers) {
  const table = $(`[data-table="${name}"]`);
  table.innerHTML = (headers ? `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>` : '') +
    `<tbody>${rows.length ? rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('') : `<tr><td style="color:var(--ink-soft)">Nothing here yet.</td></tr>`}</tbody>`;
}

/* ---------- Auth gate (prototype: any sign-in succeeds) ---------- */
$('[data-sso]').addEventListener('click', () => {
  store.set('cmsSession', { name: 'Fatou Camara' });
  store.push('security', { at: new Date().toISOString(), type: 'sign-in', who: 'fatou.camara@cerfodesgroup.com', item: '—', result: 'pass', detail: 'CMS sign-in, Microsoft 365 SSO + 2FA' });
  boot();
});
$('[data-signout]').addEventListener('click', () => { store.set('cmsSession', null); location.reload(); });

/* ---------- Nav ---------- */
$$('button[data-go]').forEach(b => b.addEventListener('click', () => goPanel(b.dataset.go)));
function goPanel(name) {
  $$('.app-panel').forEach(p => p.classList.toggle('on', p.dataset.panel === name));
  $$('button[data-go]').forEach(b => b.setAttribute('aria-current', b.dataset.go === name ? 'true' : 'false'));
  ({ pages: renderPages, leads: renderLeads, collections: renderCollections, emails: renderEmails, newsletter: renderNewsletter, integrations: renderIntegrations, ai: renderAi }[name] || (() => {}))();
}

let seed = null;

async function boot() {
  $('[data-gate]').hidden = true; $('[data-app]').hidden = false;
  if (!seed) seed = await fetch('../assets/data/cms-seed.json').then(r => r.json());
  seedLeads(); seedSubscribers(); seedIntegrations(); seedRules();
  goPanel('pages');
}

/* ============================== Pages ============================== */
function renderPages() {
  renderTable('pages', seed.pages.map(p => [
    p.key + (p.sub ? ` / ${p.sub}` : ''),
    `<a class="link-arrow" href="../${p.en.replace(/^\//, '')}" target="_blank">${p.en}</a> ${badge('badge-green', 'Live')}`,
    p.fr ? `<a class="link-arrow" href="../${p.fr.replace(/^\//, '')}" target="_blank">${p.fr}</a> ${badge('badge-green', 'Live')}` : badge('badge-yellow', 'Needs translation')
  ]), ['Page', 'English', 'Français']);
}

/* ============================== Leads inbox ============================== */
const seedLeads = () => {
  if (store.get('leads', null) !== null) return;
  const rules = DEFAULT_RULES, thresholds = DEFAULT_THRESHOLDS;
  const raw = [
    { name: 'Aminata Traoré', email: 'a.traore@ministry.gov', organisation: 'Ministry of Rural Development', office: 'ouagadougou', officeName: 'Ouagadougou', message: 'We are preparing terms of reference for a monitoring and evaluation programme review and would like a proposal and budget from CERFODES.' },
    { name: 'James Okoro', email: 'j.okoro@devbank.org', organisation: 'Regional Development Bank', office: 'nairobi', officeName: 'Nairobi', message: 'Requesting a consultancy quote for a connectivity and network infrastructure assessment across three countries, with a timeline for Q1.' },
    { name: 'Grace M.', email: 'grace.m@gmail.com', organisation: 'Self', office: 'kampala', officeName: 'Kampala', message: 'Hi, interested in learning more about your training programmes.' },
    { name: 'P. Kone', email: 'contact@yopmail.com', organisation: 'N/A', office: 'kampala', officeName: 'Kampala', message: 'Hello I want info' },
    { name: 'SEO Team', email: 'offers@rank-boost.biz', organisation: 'RankBoost SEO', office: 'kampala', officeName: 'Kampala', message: 'We can get your website to the first page of Google — guest post and backlinks package, act now for a limited time discount!' },
    { name: 'Winner Notice', email: 'prize@mailinator.com', organisation: '', office: 'lilongwe', officeName: 'Lilongwe', message: 'Congratulations you have won! Click here to claim your investment opportunity.' }
  ];
  const leads = raw.map((r, i) => {
    const result = scoreLead(r, { rules, thresholds });
    const receivedAt = new Date(Date.now() - (raw.length - i) * 36e5 * 9).toISOString();
    return { id: 'L' + (1000 + i), ...r, lang: 'en', source: 'website', receivedAt, ...result };
  });
  store.set('leads', leads);
};

function seedRules() {
  if (store.get('leadRules', null) !== null) return;
  store.set('leadRules', { rules: structuredClone(DEFAULT_RULES), thresholds: { ...DEFAULT_THRESHOLDS } });
}
const RULE_LABEL = {
  honeypot: 'Hidden bot-trap field', disposable: 'Disposable email domain', spamPhrases: 'Spam phrase list',
  links: 'More than two links', intent: 'AI intent check (real service request?)', freeEmail: 'Free-email sender', tooShort: 'Message very short'
};

let activeBucket = 'genuine';
$$('[data-lead-tabs] button').forEach(b => b.addEventListener('click', () => { activeBucket = b.dataset.bucket; $$('[data-lead-tabs] button').forEach(x => x.classList.toggle('on', x === b)); renderLeadsTable(); }));

function renderLeads() { renderLeadStats(); renderLeadsTable(); renderRules(); }

function renderLeadStats() {
  const leads = store.get('leads', []);
  const counts = { genuine: 0, review: 0, spam: 0 };
  leads.forEach(l => counts[l.bucket] = (counts[l.bucket] || 0) + 1);
  $$('[data-count]').forEach(el => el.textContent = counts[el.dataset.count] || 0);
  $('[data-lead-stats]').innerHTML = [
    `<div class="card stat-card"><b>${leads.length}</b><span>Total received</span></div>`,
    `<div class="card stat-card"><b>${counts.genuine}</b><span>Genuine → shared inbox</span></div>`,
    `<div class="card stat-card warn"><b>${counts.review}</b><span>Held for review</span></div>`,
    `<div class="card stat-card bad"><b>${counts.spam}</b><span>Marked spam</span></div>`
  ].join('');
}

function renderLeadsTable() {
  const leads = store.get('leads', []).filter(l => l.bucket === activeBucket);
  renderTable('leads', leads.map(l => [
    new Date(l.receivedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    `<strong>${esc(l.name)}</strong><br><small style="color:var(--ink-soft)">${esc(l.email)}</small>`,
    esc(l.organisation || '—'),
    esc(l.officeName || '—'),
    `<strong>${l.score}</strong>/100`,
    `<span title="${esc((l.reasons || []).map(r => r.detail).join(' · ') || 'No penalties applied')}" style="cursor:help;color:var(--ink-soft);font-size:.85rem">${l.reasons?.length ? l.reasons.length + ' reason(s)' : 'clean'}</span>`,
    moveButtons(l)
  ]), ['Received', 'Contact', 'Organisation', 'Office', 'Score', 'Reasons', 'Move to']);
}
function moveButtons(l) {
  return ['genuine', 'review', 'spam'].filter(b => b !== l.bucket).map(b =>
    `<button class="btn btn-ghost btn-sm" data-move="${l.id}" data-to="${b}" style="margin:2px">${b}</button>`).join('');
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-move]'); if (!b) return;
  moveLead(b.dataset.move, b.dataset.to);
});
function moveLead(id, to) {
  const leads = store.get('leads', []);
  const lead = leads.find(l => l.id === id); if (!lead) return;
  const from = lead.bucket;
  const rulesState = store.get('leadRules'); rulesState.thresholds = trainThresholds(rulesState.thresholds, { score: lead.score, from, to });
  store.set('leadRules', rulesState);
  leads.forEach(l => { if (l.id === id) { l.bucket = to; l.manual = true; } else if (!l.manual) l.bucket = bucketFor(l.score, rulesState.thresholds); });
  store.set('leads', leads);
  toast(`Moved to ${to}. Thresholds nudged toward this decision.`);
  renderLeads();
}

function renderRules() {
  const state = store.get('leadRules');
  $('[data-rules]').innerHTML = Object.keys(RULE_LABEL).map(k => `
    <div class="toggle-row">
      <span><strong>${RULE_LABEL[k]}</strong><span>Weight ${state.rules[k]?.weight ?? '—'}</span></span>
      <label class="switch"><input type="checkbox" data-rule="${k}" ${state.rules[k]?.on ? 'checked' : ''}><span class="switch-ui" aria-hidden="true"></span></label>
    </div>`).join('') + `<p style="margin-top:14px;font-size:.85rem;color:var(--ink-soft)">Genuine ≥ ${state.thresholds.genuine} · Needs review ≥ ${state.thresholds.review} · below is spam.</p>`;
  $$('[data-rule]', $('[data-rules]')).forEach(inp => inp.addEventListener('change', () => {
    const s = store.get('leadRules'); s.rules[inp.dataset.rule].on = inp.checked; store.set('leadRules', s);
    const leads = store.get('leads', []).map(l => l.manual ? l : { ...l, ...scoreLead(l, { rules: s.rules, thresholds: s.thresholds }) });
    store.set('leads', leads);
    toast(`${RULE_LABEL[inp.dataset.rule]} ${inp.checked ? 'enabled' : 'disabled'}. Leads re-scored.`);
    renderLeads();
  }));
}

/* ============================== Collections ============================== */
const COLL_DEFS = {
  services: { label: 'Services', headers: ['Name', 'Tagline', 'Offerings'], row: s => [en(s.name), en(s.tagline), s.offerings.length] },
  caseStudies: { label: 'Case studies', headers: ['Title', 'Client', 'Sector'], row: c => [en(c.title), en(c.client), en(c.sector)] },
  insights: { label: 'Insights', headers: ['Title', 'Category', 'Date'], row: a => [en(a.title), en(a.category), a.date] },
  team: { label: 'Team', headers: ['Name', 'Role'], row: p => [p.name, en(p.role)] },
  testimonials: { label: 'Testimonials', headers: ['Name', 'Organisation', 'Rating'], row: t => [t.name, en(t.org), t.rating + '/5'] },
  offices: { label: 'Offices', headers: ['City', 'Country'], row: o => [o.city, en(o.country)] },
  faqs: { label: 'FAQs', headers: ['Question', 'Tab'], row: f => [en(f.q), f.tab] }
};
let activeColl = 'services';
function renderCollections() {
  $('[data-coll-tabs]').innerHTML = Object.entries(COLL_DEFS).map(([k, d]) => `<button class="${k === activeColl ? 'on' : ''}" data-coll="${k}">${d.label}<span class="n">${(seed.collections[k] || []).length}</span></button>`).join('');
  $$('[data-coll]', $('[data-coll-tabs]')).forEach(b => b.addEventListener('click', () => { activeColl = b.dataset.coll; renderCollections(); }));
  const def = COLL_DEFS[activeColl];
  renderTable('collection', (seed.collections[activeColl] || []).map(item => [...def.row(item), item.placeholder ? badge('badge-yellow', 'Sample') : badge('badge-green', 'Final')]), [...def.headers, 'Status']);
  renderContentNeeded();
}
function renderContentNeeded() {
  const need = [];
  for (const [key, def] of Object.entries(COLL_DEFS)) (seed.collections[key] || []).forEach(item => { if (item.placeholder) need.push({ key, label: `${def.label}: ${def.row(item)[0]}` }); });
  if (seed.collections.impact?.figures) seed.collections.impact.figures.forEach(f => { if (f.placeholder) need.push({ key: 'impact', label: `Impact figure: ${en(f.label)}` }); });
  if (seed.collections.impact?.chart?.placeholder) need.push({ key: 'impact', label: 'Impact chart: engagements delivered per year' });
  if (seed.collections.beforeAfter?.placeholder) need.push({ key: 'beforeAfter', label: 'Before/after statements' });
  $('[data-content-needed]').innerHTML = need.length
    ? need.map(n => `<li class="pending"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>${esc(n.label)}</li>`).join('')
    : '<li>Nothing outstanding — every collection has final content.</li>';
}

/* ============================== Emails ============================== */
const EMAIL_DEFS = [
  { id: 'enquiry', label: 'Genuine enquiry', trigger: 'Lead scores 80+' },
  { id: 'application', label: 'Job application', trigger: 'CV passes scan' },
  { id: 'newsletter', label: 'Newsletter sign-up', trigger: 'On sign-up' }
];
let emailLang = 'en', activeEmail = 'enquiry';
$$('[data-email-lang] button').forEach(b => b.addEventListener('click', () => { emailLang = b.dataset.lang; $$('[data-email-lang] button').forEach(x => x.classList.toggle('on', x === b)); renderEmails(); }));
function renderEmails() {
  $('[data-email-list]').innerHTML = EMAIL_DEFS.map(d => `<button class="${d.id === activeEmail ? 'on' : ''}" data-email="${d.id}">${d.label}<small>${d.trigger}</small></button>`).join('');
  $$('[data-email]', $('[data-email-list]')).forEach(b => b.addEventListener('click', () => { activeEmail = b.dataset.email; renderEmails(); }));
  const def = seed.emails[activeEmail];
  $('[data-email-subject]').textContent = L(def.subject, emailLang);
  $('[data-email-frame]').src = `../emails/${emailLang}/${activeEmail}.html`;
}

/* ============================== Newsletter ============================== */
const seedSubscribers = () => {
  if (store.get('subscribers', null) !== null) return;
  store.set('subscribers', [
    { email: 'planning@ministry.gov', status: 'confirmed', lang: 'en', source: 'insights', at: new Date(Date.now() - 12 * 864e5).toISOString() },
    { email: 'analyste@ong-partenaire.org', status: 'confirmed', lang: 'fr', source: 'footer', at: new Date(Date.now() - 8 * 864e5).toISOString() },
    { email: 'm.review@devbank.org', status: 'pending', lang: 'en', source: 'footer', at: new Date(Date.now() - 1 * 864e5).toISOString() }
  ]);
};
function renderNewsletter() {
  const subs = store.get('subscribers', []);
  const confirmed = subs.filter(s => s.status === 'confirmed').length;
  $('[data-nl-stats]').innerHTML = [
    `<div class="card stat-card"><b>${subs.length}</b><span>Subscribers</span></div>`,
    `<div class="card stat-card"><b>${confirmed}</b><span>Confirmed (double opt-in)</span></div>`,
    `<div class="card stat-card"><b>38%</b><span>Average open rate</span></div>`,
    `<div class="card stat-card"><b>1 Oct</b><span>Next issue date</span></div>`
  ].join('');
  renderTable('subscribers', subs.map(s => [esc(s.email), badge(s.status === 'confirmed' ? 'badge-green' : 'badge-yellow', s.status), s.lang.toUpperCase(), s.source, new Date(s.at).toLocaleDateString('en-GB')]), ['Email', 'Status', 'Lang', 'Source', 'Subscribed']);
}

/* ============================== Integrations ============================== */
const INTEGRATIONS = [
  { id: 'linkedin', name: 'LinkedIn', detail: 'Publish insights and show recent posts on the site.' },
  { id: 'x', name: 'X', detail: 'Auto-post new articles and show recent posts.' },
  { id: 'newsletterPlatform', name: 'Newsletter platform', detail: 'Send the Brief and sync subscribers.' },
  { id: 'whatsapp', name: 'WhatsApp Business', detail: 'Client approvals and notifications.' },
  { id: 'microsoft365', name: 'Microsoft 365', detail: 'Staff sign-in and document storage.' },
  { id: 'tenders', name: 'Tender & procurement portals', detail: 'Pull relevant opportunities via API (sources to confirm).' }
];
const seedIntegrations = () => { if (store.get('integrations', null) === null) store.set('integrations', { whatsapp: true, microsoft365: true }); };
function renderIntegrations() {
  const state = store.get('integrations', {});
  $('[data-integrations]').innerHTML = INTEGRATIONS.map(i => `
    <div class="toggle-row"><span><strong>${i.name}</strong><span>${i.detail}</span></span>
      <span style="display:flex;align-items:center;gap:12px">${badge(state[i.id] ? 'badge-green' : 'badge-grey', state[i.id] ? 'Connected' : 'Not connected')}
      <label class="switch"><input type="checkbox" data-integ="${i.id}" ${state[i.id] ? 'checked' : ''}><span class="switch-ui" aria-hidden="true"></span></label></span>
    </div>`).join('');
  $$('[data-integ]').forEach(inp => inp.addEventListener('change', () => {
    const s = store.get('integrations', {}); s[inp.dataset.integ] = inp.checked; store.set('integrations', s); renderIntegrations();
  }));
}

/* ============================== AI readiness ============================== */
function renderAi() {
  const placeholders = Object.keys(COLL_DEFS).reduce((n, k) => n + (seed.collections[k] || []).filter(x => x.placeholder).length, 0);
  const items = [
    { ok: true, label: 'Organization structured data with every office (JSON-LD on every page)' },
    { ok: true, label: 'FAQPage structured data on the homepage and every service page' },
    { ok: true, label: 'Article structured data with author and date on every insight' },
    { ok: true, label: 'llms.txt summary published for AI crawlers' },
    { ok: true, label: 'Sitemap with hreflang EN/FR pairs on every page' },
    { ok: true, label: 'Clean, crawlable URLs per language (no query-string routing)' },
    { ok: placeholders === 0, label: placeholders === 0 ? 'All collections hold final content' : `${placeholders} item(s) still hold placeholder content — see Collections` }
  ];
  const score = Math.round((items.filter(i => i.ok).length / items.length) * 100);
  $('[data-ai-score]').textContent = score + '%';
  $('[data-ai-meter]').style.width = score + '%';
  $('[data-ai-checklist]').innerHTML = items.map(i => `<li class="${i.ok ? '' : 'pending'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i.ok ? '<path d="M5 12.5l4.5 4.5L19 7.5"/>' : '<path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="9"/>'}</svg>${esc(i.label)}</li>`).join('');
}

/* ---------- Boot ---------- */
if (store.get('cmsSession')) boot();
