// Consultant & admin portal (prototype). No real backend: state lives in localStorage under the
// 'cerfodes.' namespace shared with the public site, the client WhatsApp access app and the CMS.
import { store, track } from '../assets/js/lib/store.js';
import { scanBrowserFile } from '../assets/js/lib/file-check.js';
import { seedConsultants, seedClients, seedProjects, seedDeliverables, seedTimesheets, seedSecurity, seedWhatsapp } from '../assets/js/lib/demo-data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const fmt = n => (Math.round(n * 10) / 10).toFixed(1);

const DEMO = {
  consultant: { name: 'Amara Diallo', email: 'amara.diallo@cerfodesgroup.com', initials: 'AD', consultantId: 'c1' },
  admin: { name: 'Kofi Mensah', email: 'kofi.mensah@cerfodesgroup.com', initials: 'KM', consultantId: 'c4' }
};

const staff = seedConsultants, clients = seedClients, projects = seedProjects, deliverables = seedDeliverables, timesheets = seedTimesheets, security = seedSecurity;
function ensureSeed() { staff(); clients(); projects(); deliverables(); timesheets(); security(); seedWhatsapp(); }

/* ---------- Week helpers ---------- */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function mondayOf(d) { const x = new Date(d); const day = (x.getDay() + 6) % 7; x.setDate(x.getDate() - day); x.setHours(0, 0, 0, 0); return x; }
let weekOffset = 0;
function currentWeekStart() { const d = mondayOf(new Date()); d.setDate(d.getDate() + weekOffset * 7); return d; }
function weekKey(d) { return d.toISOString().slice(0, 10); }
function weekLabel(d) { const end = new Date(d); end.setDate(end.getDate() + 6); const f = x => x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); return `${f(d)} – ${f(end)}`; }

/* ---------- Badges ---------- */
const STATUS_BADGE = {
  active: ['badge-blue', 'Active'], draft: ['badge-grey', 'Draft'], awaiting: ['badge-yellow', 'Awaiting client'],
  approved: ['badge-green', 'Approved'], changes: ['badge-red', 'Changes requested'], submitted: ['badge-yellow', 'Submitted'],
  pass: ['badge-green', 'Pass'], blocked: ['badge-red', 'Blocked'], 'new-device': ['badge-yellow', 'New device']
};
const badge = key => { const [c, l] = STATUS_BADGE[key] || ['badge-grey', key]; return `<span class="badge ${c}">${l}</span>`; };

function toast(msg) {
  const t = $('[data-toast]'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ============================== Auth gate ============================== */
let pendingRole = null;
function gate() {
  const steps = { role: $('[data-step="role"]'), password: $('[data-step="password"]'), mfa: $('[data-step="mfa"]') };
  const show = k => Object.entries(steps).forEach(([n, el]) => el.classList.toggle('on', n === k));
  show('role');

  if (location.hash === '#admin') $(`.gate-role[data-role="admin"]`).classList.add('on');
  else if (location.hash === '#consultant') $(`.gate-role[data-role="consultant"]`).classList.add('on');

  $$('.gate-role').forEach(b => b.addEventListener('click', () => {
    pendingRole = b.dataset.role;
    $('[data-role-hint]').textContent = `Signing in as ${DEMO[pendingRole].name} (${DEMO[pendingRole].email}).`;
    $('#pw-email').value = DEMO[pendingRole].email;
    show('password');
  }));
  $('[data-back]').addEventListener('click', () => show('role'));
  $('[data-sso]').addEventListener('click', () => show('mfa'));
  $('[data-password-form]').addEventListener('submit', e => { e.preventDefault(); show('mfa'); });

  const mfaInputs = $$('[data-mfa-inputs] input');
  mfaInputs.forEach((inp, i) => inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, '').slice(0, 1); if (inp.value && mfaInputs[i + 1]) mfaInputs[i + 1].focus(); }));
  $('[data-mfa-form]').addEventListener('submit', e => {
    e.preventDefault();
    if (mfaInputs.some(i => !i.value)) return;
    const role = pendingRole || 'consultant';
    const demo = DEMO[role];
    store.set('session', { role, ...demo });
    store.push('security', { at: new Date().toISOString(), type: 'sign-in', who: demo.email, item: '—', result: 'pass', detail: 'Microsoft 365 SSO + 2FA verified' });
    enterApp();
  });
}

function enterApp() {
  const session = store.get('session');
  if (!session) return;
  $('[data-gate]').hidden = true;
  $('[data-app]').hidden = false;
  $('[data-user-name]').textContent = session.name;
  $('[data-user-role]').textContent = session.role === 'admin' ? 'Admin · project lead' : 'Consultant';
  $('[data-user-initials]').textContent = session.initials;
  $('[data-bar-title]').innerHTML = session.role === 'admin' ? 'Admin workspace<small>Portal · prototype</small>' : 'Consultant workspace<small>Portal · prototype</small>';
  $('[data-nav="consultant"]').hidden = session.role !== 'consultant';
  $('[data-nav="admin"]').hidden = session.role !== 'admin';
  goPanel('overview');
  renderAll();
}

$('[data-signout]').addEventListener('click', () => {
  store.set('session', null);
  location.reload();
});

/* ============================== Navigation ============================== */
function goPanel(name) {
  $$('.app-panel').forEach(p => p.classList.toggle('on', p.dataset.panel === name));
  const session = store.get('session');
  const nav = $(`[data-nav="${session.role}"]`);
  $$('button[data-go]', nav).forEach(b => b.setAttribute('aria-current', b.dataset.go === name ? 'true' : 'false'));
  if (name === 'overview') renderOverview();
  if (name === 'projects' || name === 'people') renderProjectsTable();
  if (name === 'timesheet') renderTimesheet();
  if (name === 'deliverables') renderDeliverables();
  if (name === 'approvals') renderApprovals();
  if (name === 'security') renderSecurity();
}
$$('button[data-go]').forEach(b => b.addEventListener('click', () => goPanel(b.dataset.go)));

$$('[data-subtabs] button').forEach(b => b.addEventListener('click', () => {
  $$('[data-subtabs] button').forEach(x => x.classList.toggle('on', x === b));
  $$('[data-sub-panel]').forEach(p => p.hidden = p.dataset.subPanel !== b.dataset.sub);
  if (b.dataset.sub === 'staff') renderStaffTable();
  if (b.dataset.sub === 'clients') renderClientsTable();
}));

function renderAll() { renderOverview(); renderStaffTable(); renderClientsTable(); }

/* ============================== Overview ============================== */
function renderOverview() {
  const session = store.get('session');
  const all = { projects: projects(), timesheets: timesheets(), deliverables: deliverables(), security: security() };
  $('[data-hello]').textContent = `, ${session.name.split(' ')[0]}`;

  if (session.role === 'consultant') {
    const my = all.projects.filter(p => p.consultantIds.includes(session.consultantId));
    const week = weekKey(currentWeekStart());
    const ts = all.timesheets.find(t => t.consultantId === session.consultantId && t.week === week);
    const hours = ts ? Object.values(ts.hours).reduce((a, b) => a + b, 0) : 0;
    const awaitingMine = all.deliverables.filter(d => my.some(p => p.id === d.projectId) && d.status === 'awaiting').length +
      all.timesheets.filter(t => t.consultantId === session.consultantId && t.status === 'submitted').length;
    $('[data-overview-sub]').textContent = 'Your projects, hours and pending items at a glance.';
    $('[data-stats]').innerHTML = [
      stat(my.length, 'Active projects'), stat(fmt(hours) + ' h', 'Hours this week'),
      stat(awaitingMine, 'Awaiting approval', awaitingMine ? 'warn' : ''), stat(all.security.filter(s => s.result === 'blocked').length, 'Threats blocked', 'bad')
    ].join('');
    renderTable('projects-mini', my.map(rowProject));
  } else {
    const pendingTs = all.timesheets.filter(t => t.status === 'submitted').length;
    const readyDl = all.deliverables.filter(d => d.status === 'draft').length;
    const week = weekKey(currentWeekStart());
    const hoursAll = all.timesheets.filter(t => t.week === week).reduce((s, t) => s + Object.values(t.hours).reduce((a, b) => a + b, 0), 0);
    $('[data-overview-sub]').textContent = 'Approvals, staff and security across every office.';
    $('[data-stats]').innerHTML = [
      stat(all.projects.length, 'Active projects'), stat(fmt(hoursAll) + ' h', 'Hours logged this week'),
      stat(pendingTs + readyDl, 'Awaiting your approval', (pendingTs + readyDl) ? 'warn' : ''), stat(all.security.filter(s => s.result === 'blocked').length, 'Threats blocked', 'bad')
    ].join('');
    renderTable('projects-mini', all.projects.map(rowProject));
  }
}
function stat(value, label, cls = '') { return `<div class="card stat-card ${cls}"><b>${value}</b><span>${label}</span></div>`; }

function rowProject(p) {
  return [p.name, p.country, p.practice, `<div class="bar-track"><i style="width:${p.progress}%"></i></div> ${p.progress}%`, badge(p.status)];
}
function renderProjectsTable() { renderTable('projects', projects().map(p => rowProject(p)), ['Project', 'Country', 'Practice', 'Progress', 'Status']); }

function renderTable(name, rows, headers) {
  $$(`[data-table="${name}"]`).forEach(table => {
    table.innerHTML = (headers ? `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>` : '') +
      `<tbody>${rows.length ? rows.map(r => `<tr>${(Array.isArray(r) ? r : r.cells).map(c => `<td>${c}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="8" style="color:var(--ink-soft)">Nothing here yet.</td></tr>`}</tbody>`;
  });
}

/* ============================== Timesheet ============================== */
$$('[data-week]').forEach(b => b.addEventListener('click', () => { weekOffset += +b.dataset.week; renderTimesheet(); }));

function renderTimesheet() {
  const session = store.get('session');
  const my = projects().filter(p => p.consultantIds.includes(session.consultantId));
  const start = currentWeekStart(); const key = weekKey(start);
  $('[data-week-label]').textContent = `Week of ${weekLabel(start)}`;
  let ts = timesheets().find(t => t.consultantId === session.consultantId && t.week === key);
  if (!ts) { ts = { id: uid('ts'), consultantId: session.consultantId, week: key, status: 'draft', hours: {} }; }

  const grid = $('[data-timesheet-grid]');
  grid.innerHTML = `<thead><tr><th>Project</th>${DAYS.map(d => `<th>${d}</th>`).join('')}<th>Total</th></tr></thead>
    <tbody>${my.map(p => `<tr data-p="${p.id}"><td>${p.name}</td>${DAYS.map((d, i) => `<td><input type="number" min="0" max="12" step="0.5" data-day="${i}" value="${(ts.hours[p.id] || [])[i] || ''}" ${ts.status !== 'draft' ? 'disabled' : ''}></td>`).join('')}<td class="tsheet-total" data-row-total>0.0</td></tr>`).join('')}</tbody>`;

  const recompute = () => {
    let grand = 0;
    $$('tbody tr', grid).forEach(tr => {
      const vals = $$('input', tr).map(i => +i.value || 0);
      const t = vals.reduce((a, b) => a + b, 0); grand += t;
      $('[data-row-total]', tr).textContent = fmt(t);
    });
    $('[data-week-total]').textContent = fmt(grand) + ' h';
  };
  $$('input', grid).forEach(i => i.addEventListener('input', recompute));
  recompute();

  const submitBtn = $('[data-submit-timesheet]');
  submitBtn.disabled = ts.status !== 'draft';
  submitBtn.querySelector('.btn-roll span').textContent = ts.status === 'draft' ? 'Submit for approval' : (ts.status === 'submitted' ? 'Submitted, awaiting approval' : 'Approved');
  submitBtn.onclick = () => {
    const hours = {};
    my.forEach(p => { const tr = $(`tr[data-p="${p.id}"]`, grid); hours[p.id] = $$('input', tr).map(i => +i.value || 0); });
    const all = timesheets(); const existing = all.findIndex(t => t.id === ts.id);
    const record = { ...ts, hours, status: 'submitted', submittedAt: new Date().toISOString() };
    if (existing > -1) all[existing] = record; else all.unshift(record);
    store.set('timesheets', all);
    toast('Timesheet submitted to your project lead.');
    renderTimesheet(); renderOverview();
  };
}

/* ============================== Deliverables ============================== */
function populateProjectSelect() {
  const session = store.get('session');
  const my = projects().filter(p => p.consultantIds.includes(session.consultantId));
  $('[data-dl-project]').innerHTML = my.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

function renderDeliverables() {
  populateProjectSelect();
  const session = store.get('session');
  const my = projects().filter(p => p.consultantIds.includes(session.consultantId)).map(p => p.id);
  const mine = deliverables().filter(d => my.includes(d.projectId));
  const cls = clients();
  renderTable('deliverables', mine.map(d => {
    const p = projects().find(x => x.id === d.projectId); const client = cls.find(c => c.id === d.clientId);
    const canSend = d.status === 'draft' || d.status === 'changes';
    return [d.name, p?.name || '—', client?.name || '—', badge(d.status),
      canSend ? `<button class="btn btn-ghost btn-sm" data-send="${d.id}"><span class="btn-roll"><span>${d.status === 'changes' ? 'Resend via WhatsApp' : 'Send via WhatsApp'}</span><span aria-hidden="true">${d.status === 'changes' ? 'Resend via WhatsApp' : 'Send via WhatsApp'}</span></span></button>` : '—'];
  }), ['Deliverable', 'Project', 'Client', 'Status', 'Action']);
  $$('[data-send]').forEach(b => b.addEventListener('click', () => sendForApproval(b.dataset.send)));
}

function sendForApproval(id) {
  store.update('deliverables', id, d => ({ status: 'awaiting', history: [...d.history, { at: new Date().toISOString(), event: 'Sent to client via WhatsApp' }] }));
  const d = deliverables().find(x => x.id === id);
  const threads = store.get('whatsapp', {});
  threads[id] = threads[id] || { deliverableId: id, clientId: d.clientId, messages: [] };
  threads[id].messages.push({ from: 'cerfodes', text: `A new deliverable is ready for your review: “${d.name}”.`, doc: d.name, at: new Date().toISOString(), kind: 'request' });
  store.set('whatsapp', threads);
  toast('Sent. The client can approve or request changes from the client access link.');
  renderDeliverables();
}

$('[data-dl-file]').addEventListener('change', async e => {
  const file = e.target.files[0]; if (!file) return;
  const list = $('[data-scan]'); const label = $('[data-drop-label]'); const upBtn = $('[data-dl-upload]');
  label.textContent = file.name; list.hidden = false; list.innerHTML = '<li>Running security checks…</li>'; upBtn.disabled = true;
  const verdict = await scanBrowserFile(file);
  list.innerHTML = '';
  for (const s of verdict.steps) list.insertAdjacentHTML('beforeend', `<li class="${s.result === 'fail' ? 'fail' : s.result === 'fixed' ? 'fixed' : ''}">${s.step}<span>${s.detail}</span></li>`);
  const summary = { clean: 'Passed all security checks.', cleaned: 'Passed — active content removed.', blocked: 'Blocked — quarantined and logged.' }[verdict.status];
  list.insertAdjacentHTML('beforeend', `<li class="${verdict.status === 'blocked' ? 'fail' : ''}"><strong>${summary}</strong></li>`);
  upBtn.disabled = verdict.status === 'blocked';
  upBtn._verdict = verdict; upBtn._file = file;
  if (verdict.status === 'blocked') store.push('security', { at: new Date().toISOString(), type: 'upload', who: store.get('session').email, item: file.name, result: 'blocked', detail: verdict.reason });
});
$('[data-dl-upload]').addEventListener('click', () => {
  const btn = $('[data-dl-upload]'); if (!btn._verdict || btn._verdict.status === 'blocked') return;
  const projectId = $('[data-dl-project]').value; const name = $('[data-dl-name]').value.trim() || btn._file.name;
  const project = projects().find(p => p.id === projectId);
  const all = deliverables();
  all.unshift({ id: uid('d'), projectId, clientId: project.clientId, name, status: 'draft', history: [{ at: new Date().toISOString(), event: 'Uploaded and security-scanned' }] });
  store.set('deliverables', all);
  store.push('security', { at: new Date().toISOString(), type: 'upload', who: store.get('session').email, item: btn._file.name, result: verdictLabel(btn._verdict), detail: 'Deliverable upload' });
  $('[data-dl-name]').value = ''; $('[data-scan]').hidden = true; $('[data-drop-label]').textContent = 'Drop a file here or browse (PDF or Word, 5 MB max)';
  btn.disabled = true; btn._verdict = null;
  toast('Deliverable added.'); renderDeliverables();
});
function verdictLabel(v) { return v.status === 'blocked' ? 'blocked' : 'pass'; }
['dragenter', 'dragover'].forEach(ev => $('[data-drop]').addEventListener(ev, e => { e.preventDefault(); $('[data-drop]').classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => $('[data-drop]').addEventListener(ev, () => $('[data-drop]').classList.remove('over')));

/* ============================== Admin: approvals ============================== */
function renderApprovals() {
  const cons = staff(); const proj = projects(); const cls = clients();
  const pendingTs = timesheets().filter(t => t.status === 'submitted');
  renderTable('approvals-timesheets', pendingTs.map(t => {
    const c = cons.find(x => x.id === t.consultantId); const total = Object.values(t.hours).flat().reduce((a, b) => a + b, 0);
    return [c?.name || '—', weekLabel(new Date(t.week)), fmt(total) + ' h', badge('submitted'), `<button class="btn btn-ghost btn-sm" data-approve-ts="${t.id}">Approve</button>`];
  }), ['Consultant', 'Week', 'Hours', 'Status', 'Action']);
  $$('[data-approve-ts]').forEach(b => b.addEventListener('click', () => {
    store.update('timesheets', b.dataset.approveTs, { status: 'approved' });
    toast('Timesheet approved.'); renderApprovals(); renderOverview();
  }));

  const ready = deliverables().filter(d => d.status === 'draft');
  renderTable('approvals-deliverables', ready.map(d => {
    const p = proj.find(x => x.id === d.projectId); const c = cls.find(x => x.id === d.clientId);
    return [d.name, p?.name || '—', c?.name || '—', `<button class="btn btn-ghost btn-sm" data-send-admin="${d.id}">Approve &amp; send to client</button>`];
  }), ['Deliverable', 'Project', 'Client', 'Action']);
  $$('[data-send-admin]').forEach(b => b.addEventListener('click', () => { sendForApproval(b.dataset.sendAdmin); renderApprovals(); }));
}

/* ============================== Admin: staff / projects / clients ============================== */
function renderStaffTable() { renderTable('staff', staff().map(c => [c.name, c.practice, `${projects().filter(p => p.consultantIds.includes(c.id)).length} project(s)`]), ['Name', 'Practice', 'Assigned']); }
function renderClientsTable() { renderTable('clients', clients().map(c => [c.name, c.contact, c.phone, `${deliverables().filter(d => d.clientId === c.id).length} deliverable(s)`]), ['Company', 'Contact', 'WhatsApp', 'Deliverables']); }

$('[data-add-staff]').addEventListener('submit', e => {
  e.preventDefault(); const f = new FormData(e.target);
  const all = staff(); all.push({ id: uid('c'), name: f.get('name'), practice: f.get('practice') }); store.set('consultants', all);
  e.target.reset(); renderStaffTable(); toast('Consultant added.');
});
$('[data-add-project]').addEventListener('submit', e => {
  e.preventDefault(); const f = new FormData(e.target);
  const all = projects(); all.push({ id: uid('p'), name: f.get('name'), country: f.get('country'), practice: f.get('practice'), progress: 0, status: 'active', clientId: clients()[0]?.id, consultantIds: [] });
  store.set('projects', all); e.target.reset(); renderProjectsTable(); toast('Project added.');
});
$('[data-add-client]').addEventListener('submit', e => {
  e.preventDefault(); const f = new FormData(e.target);
  const all = clients(); all.push({ id: uid('cl'), name: f.get('name'), contact: f.get('contact'), phone: f.get('phone') }); store.set('clients', all);
  e.target.reset(); renderClientsTable(); toast('Client company added.');
});

/* ============================== Admin: security log ============================== */
function renderSecurity() {
  const log = security();
  const blocked = log.filter(s => s.result === 'blocked').length;
  const signins = log.filter(s => s.type === 'sign-in').length;
  $('[data-security-stats]').innerHTML = [stat(log.length, 'Events logged'), stat(signins, 'Sign-ins'), stat(blocked, 'Blocked / quarantined', blocked ? 'bad' : '')].join('');
  renderTable('security', log.map(s => [new Date(s.at).toLocaleString('en-GB'), s.type, s.who, s.item, badge(s.result), s.detail]), ['When', 'Type', 'Who', 'Item', 'Result', 'Detail']);
}

/* ---------- Boot ---------- */
ensureSeed();
const existingSession = store.get('session');
gate();
if (existingSession) enterApp(); else { $('[data-app]').hidden = true; }
