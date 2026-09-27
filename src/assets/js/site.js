// CERFODES website: load sequence, scroll motion, micro-interactions, map, forms.
// Everything degrades to fully visible, usable content without JS or with reduced motion.
import { scoreLead, DEFAULT_RULES, DEFAULT_THRESHOLDS } from './lib/lead-score.js';
import { scanBrowserFile } from './lib/file-check.js';
import { store, track } from './lib/store.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lang = document.documentElement.lang;
const settings = store.get('settings', {});

/* ---------- Load sequence ---------- */
function ready() {
  const img = $('.hero-img');
  const go = () => requestAnimationFrame(() => document.body.classList.add('is-ready'));
  if (!img || reduced) return go();
  const t = setTimeout(go, 1400);
  (img.decode ? img.decode() : Promise.resolve()).catch(() => {}).then(() => { clearTimeout(t); go(); });
}

/* ---------- Navigation ---------- */
function nav() {
  const header = $('[data-nav]'); if (!header) return;
  const hero = $('[data-hero]');
  let ticking = false;
  const update = () => {
    const heroEnd = hero ? hero.offsetHeight - 90 : 0;
    header.classList.toggle('is-solid', !hero || scrollY > heroEnd);
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();

  // Log in menu
  $$('[data-menu]').forEach(m => {
    const b = $('button', m); const items = $$('a', m);
    const set = open => { m.classList.toggle('open', open); b.setAttribute('aria-expanded', open); };
    b.addEventListener('click', e => { e.stopPropagation(); set(!m.classList.contains('open')); if (m.classList.contains('open')) items[0]?.focus(); });
    m.addEventListener('keydown', e => {
      const i = items.indexOf(document.activeElement);
      if (e.key === 'Escape') { set(false); b.focus(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    });
    document.addEventListener('click', e => { if (!m.contains(e.target)) set(false); });
  });

  // Mobile menu
  const burger = $('[data-burger]'), menu = $('#mobile-menu');
  burger?.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    header.classList.add('is-solid');
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('open')); document.body.style.overflow = 'hidden'; }
    else { menu.classList.remove('open'); document.body.style.overflow = ''; setTimeout(() => (menu.hidden = true), 300); }
  });
  menu?.addEventListener('click', e => { if (e.target.closest('a')) burger.click(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && burger?.getAttribute('aria-expanded') === 'true') burger.click(); });
}

/* ---------- Scroll reveals, stagger, count-up ---------- */
function reveals() {
  $$('[data-stagger]').forEach(g => [...g.children].forEach((el, i) => el.style.setProperty('--si', i)));
  const counters = new WeakSet();
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).concat(e.target.matches('[data-count]') ? [e.target] : []).forEach(countUp);
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  $$('[data-reveal], [data-split], [data-stagger], [data-chart], .map-stage').forEach(el => io.observe(el));

  function countUp(el) {
    if (counters.has(el)) return; counters.add(el);
    const end = +el.dataset.count, suffix = el.dataset.suffix || '';
    const fmt = n => Math.round(n).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB') + suffix;
    if (reduced) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), dur = 1800;
    const step = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = fmt(end * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); };
    el.textContent = fmt(0); requestAnimationFrame(step);
  }
}

/* ---------- Hero parallax ---------- */
function parallax() {
  if (reduced) return;
  const el = $('[data-parallax]'); if (!el) return;
  const h = el.parentElement;
  addEventListener('scroll', () => requestAnimationFrame(() => {
    const y = scrollY; if (y > h.offsetHeight) return;
    el.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
  }), { passive: true });
}

/* ---------- Tabs with sliding indicator ---------- */
function tabs() {
  $$('[data-tabs]').forEach(root => {
    const bar = $('[role="tablist"]', root);
    const list = $$('[role="tab"]', bar); const ind = $('.tab-ind', bar);
    const move = t => { if (ind) { ind.style.width = t.offsetWidth + 'px'; ind.style.transform = `translateX(${t.offsetLeft}px)`; } };
    const select = (t, focus = true) => {
      list.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) { p.hidden = !on; if (on && !reduced) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); } } });
      move(t); if (focus) t.focus();
    };
    list.forEach(t => t.addEventListener('click', () => select(t)));
    bar.addEventListener('keydown', e => {
      const i = list.indexOf(document.activeElement); if (i < 0) return;
      const n = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (n) { e.preventDefault(); select(list[(i + n + list.length) % list.length]); }
      if (e.key === 'Home') { e.preventDefault(); select(list[0]); }
      if (e.key === 'End') { e.preventDefault(); select(list.at(-1)); }
    });
    const cur = () => list.find(t => t.getAttribute('aria-selected') === 'true');
    requestAnimationFrame(() => move(cur()));
    addEventListener('resize', () => move(cur()));
    document.fonts?.ready.then(() => move(cur()));
  });
}

/* ---------- Accordions (process image swap, testimonial auto-advance) ---------- */
function accordions() {
  $$('[data-accordion]').forEach(acc => {
    const items = $$(':scope > .acc-item', acc);
    const single = acc.hasAttribute('data-single');
    const process = acc.hasAttribute('data-process');
    const open = (item, on) => {
      const b = $('.acc-btn', item), p = $('.acc-panel', item);
      item.classList.toggle('open', on); b.setAttribute('aria-expanded', on);
      if (on) p.hidden = false; else setTimeout(() => { if (!item.classList.contains('open')) p.hidden = true; }, 600);
    };
    const activate = (item, fromUser) => {
      const was = item.classList.contains('open');
      if (single) items.forEach(i => i !== item && open(i, false));
      open(item, single ? true : !was);
      if (process) {
        const idx = items.indexOf(item);
        $$('[data-step-img]', acc.closest('section')).forEach(f => f.classList.toggle('active', +f.dataset.stepImg === idx));
        const num = $('[data-step-num]', acc.closest('section')); if (num) num.textContent = String(idx + 1).padStart(2, '0');
      }
      if (fromUser) stop?.();
      else restartProgress(item);
    };
    items.forEach(i => $('.acc-btn', i).addEventListener('click', () => activate(i, true)));

    let stop = null;
    const ms = +acc.dataset.autoplay;
    function restartProgress(item) { items.forEach(i => i.classList.remove('playing')); void item.offsetWidth; if (timer) item.classList.add('playing'); }
    let timer = null;
    if (ms && !reduced) {
      acc.style.setProperty('--autoplay', ms + 'ms');
      let paused = false, stopped = false;
      const tick = () => { if (paused || stopped) return; const i = items.findIndex(x => x.classList.contains('open')); activate(items[(i + 1) % items.length], false); };
      const vis = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !timer && !stopped) { timer = setInterval(tick, ms); restartProgress(items.find(x => x.classList.contains('open'))); }
        else if (!e.isIntersecting && timer) { clearInterval(timer); timer = null; }
      }, { threshold: .3 });
      vis.observe(acc);
      acc.addEventListener('pointerenter', () => { paused = true; acc.classList.add('paused'); });
      acc.addEventListener('pointerleave', () => { paused = false; acc.classList.remove('paused'); });
      acc.addEventListener('focusin', () => (paused = true));
      stop = () => { stopped = true; clearInterval(timer); timer = null; items.forEach(i => i.classList.remove('playing')); };
    }
  });
}

/* ---------- Interactive map ---------- */
function map() {
  const root = $('[data-map]'); if (!root) return;
  const svg = $('.map-svg', root), tip = $('.map-tip', root), pop = $('[data-map-pop]', root), stage = $('.map-stage', root);
  const data = JSON.parse($('#office-data')?.textContent || '[]');
  const nodes = $$('.m-node', svg);
  let current = -1, lastFocus = null;

  // Offices switch (default from CMS setting)
  const sw = $('[data-show-offices]', root);
  const applyOffices = on => { root.classList.toggle('no-offices', !on); if (!on) closePop(); nodes.forEach(n => n.setAttribute('tabindex', on ? 0 : -1)); };
  if (settings.showOffices === false) sw.checked = false;
  applyOffices(sw.checked);
  sw.addEventListener('change', () => applyOffices(sw.checked));
  data.forEach((o, i) => { if (o.visible === false) nodes[i]?.remove(); });

  // Tooltip
  const place = (el, node) => {
    const r = node.getBoundingClientRect(), s = stage.getBoundingClientRect();
    el.style.left = (r.left + r.width / 2 - s.left) + 'px'; el.style.top = (r.top - s.top) + 'px';
  };
  nodes.forEach((n, i) => {
    n.addEventListener('pointerenter', () => { tip.textContent = `${data[i].city}, ${data[i].country}`; tip.hidden = false; place(tip, n); });
    n.addEventListener('pointerleave', () => (tip.hidden = true));
    n.addEventListener('focus', () => { tip.textContent = `${data[i].city}, ${data[i].country}`; tip.hidden = false; place(tip, n); });
    n.addEventListener('blur', () => (tip.hidden = true));
    n.addEventListener('click', () => openPop(i, n));
    n.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPop(i, n); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); nodes[(i + 1) % nodes.length].focus(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); nodes[(i - 1 + nodes.length) % nodes.length].focus(); }
    });
  });
  $$('[data-open-office]', root).forEach(b => b.addEventListener('click', () => {
    const i = data.findIndex(o => o.id === b.dataset.openOffice); openPop(i, nodes[i], b);
  }));

  function fill(i) {
    const o = data[i];
    $('[data-pop-img]', pop).src = o.photo;
    $('[data-pop-country]', pop).textContent = o.country + (o.hq ? ' · HQ' : '');
    $('[data-pop-city]', pop).textContent = o.city;
    $('[data-pop-addr]', pop).textContent = o.address;
    $('[data-pop-phones]', pop).innerHTML = o.phones.length ? o.phones.map(p => `<a href="tel:${p.replace(/\s/g, '')}">${p}</a>`).join('<br>') : '—';
    const mail = $('[data-pop-mail]', pop); mail.textContent = o.email; mail.href = `mailto:${o.email}`;
    $('[data-pop-contact]', pop).href = `${root.dataset.contact}?office=${o.id}`;
    $('[data-pop-dir]', pop).href = `https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lon}`;
    $('[data-pop-pos]', pop).textContent = `${i + 1} / ${data.length}`;
    nodes.forEach((n, j) => n.classList.toggle('active', j === i));
    $$('[data-open-office]', root).forEach(b => b.classList.toggle('active', b.dataset.openOffice === o.id));
  }
  function position(node) {
    if (matchMedia('(max-width: 700px)').matches) { pop.style.left = pop.style.top = ''; return; }
    const r = node.getBoundingClientRect(), m = root.getBoundingClientRect();
    const w = pop.offsetWidth || 340, h = pop.offsetHeight || 460;
    let x = r.left - m.left + 24, y = r.top - m.top - h / 2;
    if (x + w > m.width) x = r.left - m.left - w - 24;
    y = Math.max(0, Math.min(y, m.height - h));
    pop.style.left = Math.max(0, x) + 'px'; pop.style.top = y + 'px';
    pop.style.setProperty('--ox', (r.left - m.left - x) + 'px'); pop.style.setProperty('--oy', (r.top - m.top - y) + 'px');
  }
  function openPop(i, node, opener) {
    if (i < 0) return;
    lastFocus = opener || node || document.activeElement;
    current = i; fill(i); pop.hidden = false; position(node || stage);
    pop.classList.remove('show'); void pop.offsetWidth; pop.classList.add('show');
    $('.pop-close', pop).focus({ preventScroll: true });
    track('office_popup_open', { office: data[i].id });
  }
  function closePop() {
    if (pop.hidden) return;
    pop.hidden = true; current = -1; nodes.forEach(n => n.classList.remove('active'));
    lastFocus?.focus?.({ preventScroll: true });
  }
  const step = d => { const i = (current + d + data.length) % data.length; fill(i); current = i; position(nodes[i]); pop.classList.remove('show'); void pop.offsetWidth; pop.classList.add('show'); };
  $('[data-pop-close]', pop).addEventListener('click', closePop);
  $('[data-pop-next]', pop).addEventListener('click', () => step(1));
  $('[data-pop-prev]', pop).addEventListener('click', () => step(-1));
  pop.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePop();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) closePop(); });
  document.addEventListener('click', e => { if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('.m-node,[data-open-office]')) closePop(); });
}

/* ---------- Forms ---------- */
const i18n = form => JSON.parse($('template[data-i18n]', form)?.innerHTML || '{}');
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

function validate(form, msgs) {
  let ok = true;
  $$('.field-err', form).forEach(e => e.remove());
  $$('[required]', form).forEach(el => {
    const f = el.closest('.field'); f?.classList.remove('invalid');
    let msg = '';
    if (el.type === 'file' ? !el.files.length : !el.value.trim()) msg = msgs.required;
    else if (el.type === 'email' && !emailOk(el.value)) msg = msgs.emailInvalid;
    if (msg) {
      ok = false; f?.classList.add('invalid'); el.setAttribute('aria-invalid', 'true');
      const id = el.id + '-err'; el.setAttribute('aria-describedby', id);
      f?.insertAdjacentHTML('beforeend', `<span class="field-err" id="${id}">${msg}</span>`);
    } else el.removeAttribute('aria-invalid');
  });
  if (!ok) $('[aria-invalid="true"]', form)?.focus();
  return ok;
}

function rateLimited() {
  const now = Date.now(); const hits = store.get('rate', []).filter(t => now - t < 60000);
  if (hits.length >= 3) return true;
  hits.push(now); store.set('rate', hits); return false;
}

function contactForm() {
  const form = $('[data-contact-form]'); if (!form) return;
  const m = i18n(form); const opened = Date.now();
  const params = new URLSearchParams(location.search);
  if (params.get('office')) form.office.value = params.get('office');
  if (params.get('topic') === 'call') form.message.placeholder = lang === 'fr' ? 'Je souhaite réserver un appel au sujet de…' : 'I would like to book a call about…';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate(form, m)) return;
    const res = $('[data-result]', form);
    if (rateLimited()) { res.hidden = false; res.className = 'form-result bad'; res.innerHTML = `<p>${m.rate}</p>`; return; }
    const btnLabel = $('button[type=submit] .btn-roll', form); const orig = btnLabel.innerHTML;
    btnLabel.innerHTML = `<span>${m.sending}</span>`;
    const lead = Object.fromEntries(new FormData(form));
    // Invisible CAPTCHA signal: humans take more than 3 seconds to fill the form.
    if (Date.now() - opened < 3000) lead.website = lead.website || '[submitted in under 3s]';
    const cms = store.get('leadRules', {});
    const result = scoreLead(lead, { rules: { ...DEFAULT_RULES, ...cms.rules }, thresholds: cms.thresholds || DEFAULT_THRESHOLDS });
    await new Promise(r => setTimeout(r, reduced ? 0 : 700));
    const officeName = form.office.selectedOptions[0]?.textContent.split(',')[0] || '';
    store.push('leads', { id: 'L' + Date.now(), ...lead, officeName, lang, ...result, receivedAt: new Date().toISOString(), source: 'website' });
    if (result.bucket === 'genuine') track('enquiry', { office: lead.office });
    res.hidden = false; res.className = 'form-result';
    const genuine = result.bucket === 'genuine';
    res.innerHTML = `<h3>${genuine ? m.okTitle : m.reviewTitle}</h3><p>${genuine ? m.okText.replace('{office}', officeName) : m.reviewText}</p>
      <p class="score">${m.demoScore}: <b>${result.score}/100</b> → ${result.bucket}${result.reasons.length ? ' · ' + result.reasons.map(r => r.detail).join(' · ') : ''}</p>`;
    btnLabel.innerHTML = orig;
    if (genuine) form.reset();
    res.focus?.();
  });
}

function careersForm() {
  const form = $('[data-careers-form]'); if (!form) return;
  const m = i18n(form); const input = $('input[type=file]', form); const list = $('[data-scan]', form);
  const drop = $('[data-drop]', form); const label = $('[data-drop-label]', form); const submit = $('button[type=submit]', form);
  let verdict = null;
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, () => drop.classList.add('over')));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, () => drop.classList.remove('over')));
  input.addEventListener('change', async () => {
    const file = input.files[0]; if (!file) return;
    label.textContent = file.name; submit.disabled = true; list.hidden = false;
    list.innerHTML = `<li>${m.scanning}</li>`;
    verdict = await scanBrowserFile(file);
    list.innerHTML = '';
    for (const s of verdict.steps) {
      await new Promise(r => setTimeout(r, reduced ? 0 : 260));
      list.insertAdjacentHTML('beforeend', `<li class="${s.result === 'fail' ? 'fail' : s.result === 'fixed' ? 'fixed' : ''}">${s.step}<span>${s.detail}</span></li>`);
    }
    const summary = { clean: m.clean, cleaned: m.cleaned, blocked: m.blocked }[verdict.status];
    list.insertAdjacentHTML('beforeend', `<li class="${verdict.status === 'blocked' ? 'fail' : ''}"><strong>${summary}</strong></li>`);
    submit.disabled = verdict.status === 'blocked';
    if (verdict.status === 'blocked') {
      store.push('security', { at: new Date().toISOString(), type: 'upload', who: form.email.value || 'careers applicant', item: file.name, result: 'quarantined', detail: verdict.reason });
      input.value = '';
    }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate(form, m) || !verdict || verdict.status === 'blocked') return;
    const d = Object.fromEntries(new FormData(form));
    const bot = d.website && d.website.trim();
    if (!bot) {
      store.push('applications', { name: d.name, email: d.email, area: d.area, file: input.files[0]?.name, scan: verdict.status, lang, at: new Date().toISOString() });
      store.push('security', { at: new Date().toISOString(), type: 'upload', who: d.email, item: input.files[0]?.name, result: verdict.status, detail: 'CV scan passed' });
      track('application', { area: d.area });
    }
    const res = $('[data-result]', form); res.hidden = false; res.className = 'form-result';
    res.innerHTML = `<h3>${m.okTitle}</h3><p>${m.okText}</p>`;
    form.reset(); list.hidden = true; label.textContent = '✓'; submit.disabled = true; verdict = null;
  });
}

function newsletter() {
  $$('[data-newsletter]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('[data-msg]', form); const v = form.email.value.trim();
    if (!emailOk(v)) { msg.textContent = msg.dataset.invalid; msg.className = 'nl-note err'; form.email.focus(); return; }
    store.push('subscribers', { email: v, status: 'pending', lang, source: form.closest('footer') ? 'footer' : 'insights', at: new Date().toISOString() });
    track('newsletter_signup');
    msg.textContent = msg.dataset.ok; msg.className = 'nl-note ok'; form.reset();
  }));
}

/* ---------- Consent ---------- */
function consent() {
  const box = $('[data-consent]'); if (!box) return;
  if (!store.get('consent')) setTimeout(() => (box.hidden = false), 2600);
  $$('[data-consent-choice]', box).forEach(b => b.addEventListener('click', () => { store.set('consent', b.dataset.consentChoice); box.hidden = true; }));
  $$('[data-consent-open]').forEach(b => b.addEventListener('click', () => (box.hidden = false)));
}

ready(); nav(); reveals(); parallax(); tabs(); accordions(); map(); contactForm(); careersForm(); newsletter(); consent();
