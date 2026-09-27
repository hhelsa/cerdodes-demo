import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { routes } from '../content/ui.mjs';

export const SITE_URL = 'https://www.cerfodesgroup.com';
export const LANGS = ['en', 'fr'];

const photoDir = fileURLToPath(new URL('../assets/img/photos/', import.meta.url));
const photoSizes = {};
for (const f of readdirSync(photoDir)) {
  const m = f.match(/^(.+)-(\d+)\.webp$/);
  if (m) (photoSizes[m[1]] ||= []).push(+m[2]);
}
for (const k in photoSizes) photoSizes[k].sort((a, b) => a - b);

export const esc = (s = '') => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
export const L = (v, lang) => (v && typeof v === 'object' && 'en' in v ? v[lang] ?? v.en : v ?? '');

/** Page context: builds relative links so the output works on any host or sub-path. */
export function context({ lang, key, sub = null, fileLinks = false }) {
  const segs = pagePath(lang, key, sub).split('/').filter(Boolean);
  const up = '../'.repeat(segs.length);
  const dir = p => (p === '' || p.endsWith('/') ? p : p + '/') + (fileLinks ? 'index.html' : '');
  return {
    lang, key, sub, other: lang === 'en' ? 'fr' : 'en',
    t: v => L(v, lang),
    asset: p => up + 'assets/' + p,
    root: p => up + p,
    href: (k, s = null, lg = lang) => up + dir(pagePath(lg, k, s)),
    abs: (k, s = null, lg = lang) => SITE_URL + '/' + pagePath(lg, k, s),
    fileLinks
  };
}

export function pagePath(lang, key, sub) {
  const base = routes[key][lang];
  return [lang, base, sub].filter(Boolean).join('/') + '/';
}

export function pic(c, name, { alt = '', cls = '', sizes = '100vw', eager = false, attrs = '' } = {}) {
  const ws = photoSizes[name];
  if (!ws) throw new Error(`Missing photo: ${name}`);
  const srcset = ws.map(w => `${c.asset(`img/photos/${name}-${w}.webp`)} ${w}w`).join(', ');
  const src = c.asset(`img/photos/${name}-${ws.includes(1280) ? 1280 : ws.at(-1)}.webp`);
  return `<img class="${cls}" src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" ${attrs}>`;
}

/** The three dots – mandatory brand device. Colours adapt through CSS custom properties. */
export const dots = (cls = '') => `<span class="dots ${cls}" aria-hidden="true"><i></i><i></i><i></i></span>`;
export const eyebrow = (text, cls = '') => `<p class="eyebrow ${cls}" data-reveal>${dots()}<span>${esc(text)}</span></p>`;
export const ciRule = (cls = '') => `<div class="ci-rule ${cls}" aria-hidden="true">${dots()}<span class="ci-line"></span></div>`;

export const arrow = `<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** Rolling-label button (Kora micro-interaction). */
export function btn(label, href, { variant = 'primary', icon = true, attrs = '' } = {}) {
  const inner = `<span class="btn-roll"><span>${esc(label)}</span><span aria-hidden="true">${esc(label)}</span></span>${icon ? `<span class="btn-ico">${arrow}</span>` : ''}`;
  return href
    ? `<a class="btn btn-${variant}" href="${href}" ${attrs}>${inner}</a>`
    : `<button class="btn btn-${variant}" ${attrs}>${inner}</button>`;
}

/** Split heading into words for the word-by-word reveal. Text stays readable without JS. */
export function split(text) {
  return String(text).split(/\s+/).map((w, i) => `<span class="w"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ');
}
export const heading = (tag, text, cls = '', id = '') => `<${tag} ${id ? `id="${id}" ` : ''}class="${cls}" data-split aria-label="${esc(text)}"><span aria-hidden="true">${split(text)}</span></${tag}>`;

export const sampleTag = (c, on) => (on ? `<span class="sample-tag" title="Placeholder content">${esc(c.t({ en: 'Sample', fr: 'Exemple' }))}</span>` : '');

export const stars = n => `<span class="stars" aria-hidden="true">${[1, 2, 3, 4, 5].map(i => `<svg viewBox="0 0 24 24" class="${i <= n ? 'on' : ''}"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>`).join('')}</span>`;

export const icon = {
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.64-1.61-2.64-1.61 0-1.86 1.26-1.86 2.56v4.92h-4z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.7 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L1.8 3h6.4l4.4 5.9zm-1.1 16.2h1.7L7.5 4.7H5.7z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.2-8 5-8-5V6l8 5 8-5z"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cross: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0-5 5m5-5 5 5M4 20h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 12l2.5 2.5 4.5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

export const fmtDate = (iso, lang) => new Date(iso + 'T00:00:00Z').toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
