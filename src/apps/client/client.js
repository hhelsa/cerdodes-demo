// Client access (prototype): one WhatsApp-style workspace per client company, no separate login.
// In production, CERFODES sends secure, expiring one-tap links over WhatsApp Business; this page
// stands in for a link already opened, using a company picker instead of a signed token.
import { store, track } from '../assets/js/lib/store.js';
import { seedClients, seedDeliverables, seedProjects, seedWhatsapp } from '../assets/js/lib/demo-data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmtTime = iso => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

seedClients(); seedProjects(); seedDeliverables(); seedWhatsapp();

const docIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';

function toast(msg) {
  const t = $('[data-toast]'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 3200);
}

function showPicker() {
  $('[data-view="picker"]').hidden = false; $('[data-view="thread"]').hidden = true; $('[data-change-company]').hidden = true;
  const clients = seedClients();
  $('[data-company-list]').innerHTML = clients.map(c => {
    const n = seedDeliverables().filter(d => d.clientId === c.id && d.status === 'awaiting').length;
    return `<button data-open-company="${c.id}"><span><strong>${c.name}</strong><br><small style="color:var(--ink-soft)">${c.contact} · ${c.phone}</small></span>${n ? `<span class="badge badge-yellow">${n} awaiting</span>` : '<span class="badge badge-grey">Up to date</span>'}</button>`;
  }).join('');
  $$('[data-open-company]').forEach(b => b.addEventListener('click', () => openCompany(b.dataset.openCompany)));
}

let currentCompany = null;
function openCompany(id) {
  currentCompany = id;
  $('[data-view="picker"]').hidden = true; $('[data-view="thread"]').hidden = false; $('[data-change-company]').hidden = false;
  const client = seedClients().find(c => c.id === id);
  $('[data-company-name]').textContent = client.name;
  renderThread();
}
$('[data-change-company]').addEventListener('click', showPicker);

function threadForCompany(id) {
  const threads = store.get('whatsapp', {});
  return Object.values(threads).filter(t => t.clientId === id).sort((a, b) => (a.messages[0]?.at || '').localeCompare(b.messages[0]?.at || ''));
}

function renderThread() {
  const threads = threadForCompany(currentCompany);
  const body = $('[data-thread]');
  if (!threads.length) { body.innerHTML = `<p style="color:var(--ink-soft);text-align:center;padding:24px 0">No deliverables have been sent for approval yet.</p>`; return; }
  body.innerHTML = threads.map(t => {
    const d = seedDeliverables().find(x => x.id === t.deliverableId);
    const bubbles = t.messages.map(m => bubbleHtml(m)).join('');
    const canAct = d && d.status === 'awaiting';
    return bubbles + (canAct ? `<div class="wa-msg in" style="max-width:100%">
      <p style="margin:0 0 8px">What would you like to do with <strong>${d.name}</strong>?</p>
      <div class="wa-actions">
        <button class="wa-approve" data-approve="${d.id}">✓ Approve</button>
        <button class="wa-changes" data-request-changes="${d.id}">Request changes</button>
        <button data-view-doc="${d.id}">View document</button>
      </div>
    </div>` : '');
  }).join('');
  $$('[data-approve]').forEach(b => b.addEventListener('click', () => approve(b.dataset.approve)));
  $$('[data-request-changes]').forEach(b => b.addEventListener('click', () => openChanges(b.dataset.requestChanges)));
  $$('[data-view-doc]').forEach(b => b.addEventListener('click', () => toast('Prototype: opens the scanned deliverable in a secure viewer.')));
  body.scrollTop = body.scrollHeight;
}

function bubbleHtml(m) {
  const mine = m.from === 'client';
  const doc = m.doc ? `<div class="doc">${docIcon}<span>${m.doc}</span></div>` : '';
  return `<div class="wa-msg ${mine ? 'out' : 'in'}">${doc}<span>${m.text}</span><time>${fmtTime(m.at)}</time></div>`;
}

function pushMessage(deliverableId, from, text) {
  const threads = store.get('whatsapp', {});
  const t = threads[deliverableId] || { deliverableId, clientId: currentCompany, messages: [] };
  t.messages.push({ from, text, at: new Date().toISOString() });
  threads[deliverableId] = t; store.set('whatsapp', threads);
}

function approve(id) {
  store.update('deliverables', id, d => ({ status: 'approved', history: [...d.history, { at: new Date().toISOString(), event: 'Approved by client via WhatsApp' }] }));
  pushMessage(id, 'client', '✓ Approved. Thank you.');
  track('deliverable_approved', { id });
  toast('Approved. The project lead has been notified.');
  renderThread();
}

function openChanges(id) {
  $('[data-changes-form]').hidden = false;
  $('[data-changes-for]').textContent = `Requesting changes on: ${seedDeliverables().find(d => d.id === id).name}`;
  $('[data-changes-text]').value = ''; $('[data-changes-text]').focus();
  $('[data-changes-send]').onclick = () => {
    const text = $('[data-changes-text]').value.trim();
    if (!text) return;
    store.update('deliverables', id, d => ({ status: 'changes', history: [...d.history, { at: new Date().toISOString(), event: `Client requested changes: ${text}` }] }));
    pushMessage(id, 'client', `Requesting changes: ${text}`);
    track('deliverable_changes_requested', { id });
    $('[data-changes-form]').hidden = true;
    toast('Sent. The project lead has been notified.');
    renderThread();
  };
}
$('[data-changes-cancel]').addEventListener('click', () => { $('[data-changes-form]').hidden = true; });

showPicker();
