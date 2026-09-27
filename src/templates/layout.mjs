import { ui } from '../content/ui.mjs';
import { offices, services, faqs } from '../content/collections.mjs';
import { esc, L, dots, ciRule, btn, icon, SITE_URL } from './helpers.mjs';

const navItems = ['about', 'services', 'where', 'insights', 'careers', 'contact'];

export function organizationLd(lang) {
  return {
    '@type': 'Organization',
    '@id': SITE_URL + '/#org',
    name: 'CERFODES',
    url: SITE_URL,
    logo: SITE_URL + '/assets/img/logo/logo-full-colour.png',
    foundingDate: '2002',
    slogan: L(ui.meta.tagline, lang),
    description: L(ui.meta.description, lang),
    email: 'info@cerfodesgroup.com',
    areaServed: 'Worldwide',
    knowsAbout: services.map(s => L(s.name, lang)),
    sameAs: ['https://www.linkedin.com/company/cerfodes', 'https://x.com/cerfodes'],
    department: offices.map(o => ({
      '@type': 'Organization',
      name: `CERFODES ${o.city}`,
      email: o.email,
      telephone: o.phones[0],
      address: { '@type': 'PostalAddress', streetAddress: o.placeholder ? undefined : L(o.address, lang), addressLocality: o.city, addressCountry: L(o.country, 'en') },
      geo: { '@type': 'GeoCoordinates', latitude: o.lat, longitude: o.lon }
    }))
  };
}

export function faqLd(lang, list = faqs) {
  return { '@type': 'FAQPage', mainEntity: list.map(f => ({ '@type': 'Question', name: L(f.q, lang), acceptedAnswer: { '@type': 'Answer', text: L(f.a, lang) } })) };
}

function head(c, { title, description, altSub, ld = [], image = 'img/logo/logo-full-colour.png' }) {
  const t = c.t;
  const fullTitle = title ? `${title} | CERFODES` : `CERFODES | ${t(ui.meta.tagline)}`;
  const canonical = c.abs(c.key, c.sub);
  const graph = { '@context': 'https://schema.org', '@graph': [organizationLd(c.lang), { '@type': 'WebPage', '@id': canonical, url: canonical, name: fullTitle, inLanguage: c.lang, isPartOf: { '@type': 'WebSite', '@id': SITE_URL + '/#site', name: 'CERFODES', url: SITE_URL, publisher: { '@id': SITE_URL + '/#org' } } }, ...ld] };
  return `<!doctype html>
<html lang="${c.lang}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description || t(ui.meta.description))}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="${c.lang}" href="${canonical}">
<link rel="alternate" hreflang="${c.other}" href="${c.abs(c.key, altSub ?? c.sub, c.other)}">
<link rel="alternate" hreflang="x-default" href="${c.abs(c.key, c.lang === 'en' ? c.sub : altSub, 'en')}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description || t(ui.meta.description))}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE_URL}/assets/${image}">
<meta property="og:locale" content="${c.lang === 'en' ? 'en_GB' : 'fr_FR'}">
<meta name="theme-color" content="#041790">
<link rel="icon" href="${c.asset('img/favicon.png')}">
<link rel="preload" href="${c.asset('fonts/jost-latin-800-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${c.asset('fonts/jost-latin-400-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${c.asset('css/tokens.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<script>document.documentElement.classList.replace('no-js','js');try{var s=JSON.parse(localStorage.getItem('cerfodes.settings')||'{}');if(s.corners)document.documentElement.dataset.corners=s.corners;}catch(e){}</script>
<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>
</head>`;
}

function nav(c, altSub, { overHero }) {
  const t = c.t;
  const links = navItems.map(k => `<li><a href="${c.href(k)}" ${c.key === k ? 'aria-current="page"' : ''}>${esc(t(ui.nav[k]))}</a></li>`).join('');
  const login = [
    ['portal', c.root('portal/') + (c.fileLinks ? 'index.html' : '') + '#consultant', 'portalHint'],
    ['admin', c.root('portal/') + (c.fileLinks ? 'index.html' : '') + '#admin', 'adminHint'],
    ['client', c.root('client/') + (c.fileLinks ? 'index.html' : ''), 'clientHint'],
    ['cms', c.root('cms/') + (c.fileLinks ? 'index.html' : ''), 'cmsHint']
  ].map(([k, h, hint]) => `<li><a href="${h}" role="menuitem"><strong>${esc(t(ui.nav[k]))}</strong><small>${esc(t(ui.nav[hint]))}</small></a></li>`).join('');
  const langSwitch = `<div class="lang" role="group" aria-label="${esc(t(ui.nav.langLabel))}">
      <a href="${c.href(c.key, c.lang === 'en' ? c.sub : altSub, 'en')}" hreflang="en" lang="en" ${c.lang === 'en' ? 'aria-current="true"' : ''}>EN</a>
      <a href="${c.href(c.key, c.lang === 'fr' ? c.sub : altSub, 'fr')}" hreflang="fr" lang="fr" ${c.lang === 'fr' ? 'aria-current="true"' : ''}>FR</a>
    </div>`;
  return `<a class="skip" href="#main">${esc(t(ui.meta.skip))}</a>
<header class="nav ${overHero ? 'nav-over' : 'nav-solid'}" data-nav>
  <nav class="nav-pill" aria-label="Main">
    <a class="nav-logo" href="${c.href('home')}" aria-label="CERFODES ${esc(t(ui.common.home))}">
      <img class="logo-light" src="${c.asset('img/logo/logo-horizontal-white.webp')}" alt="" width="180" height="29">
      <img class="logo-dark" src="${c.asset('img/logo/logo-horizontal.webp')}" alt="" width="180" height="29">
    </a>
    <ul class="nav-links">${links}</ul>
    <div class="nav-actions">
      ${langSwitch}
      <div class="login" data-menu>
        <button class="login-btn" aria-haspopup="true" aria-expanded="false">${esc(t(ui.nav.login))}${icon.chevron}</button>
        <ul class="login-menu" role="menu">${login}</ul>
      </div>
      ${btn(t(ui.nav.talk), c.href('contact'), { variant: 'yellow', attrs: 'data-magnet' })}
      <button class="burger" aria-expanded="false" aria-controls="mobile-menu" data-burger><span class="sr-only">${esc(t(ui.nav.menu))}</span><i></i><i></i></button>
    </div>
  </nav>
  <div class="mobile-menu" id="mobile-menu" hidden>
    ${dots('dots-lg')}
    <ul>${navItems.map((k, i) => `<li style="--i:${i}"><a href="${c.href(k)}">${esc(t(ui.nav[k]))}</a></li>`).join('')}</ul>
    <div class="mobile-foot">${langSwitch}<ul class="mobile-login">${login}</ul></div>
  </div>
</header>`;
}

function footer(c) {
  const t = c.t;
  const col = (title, items) => `<div class="f-col"><h2 class="f-title">${esc(title)}</h2><ul>${items.join('')}</ul></div>`;
  return `<footer class="footer" data-section="footer">
  <div class="wrap">
    <div class="f-top">
      <div class="f-brief" data-reveal>
        <p class="eyebrow on-dark">${dots()}<span>${esc(t(ui.newsletter.name))}</span></p>
        <p class="f-brief-text">${esc(t(ui.newsletter.text))}</p>
        ${newsletterForm(c, 'footer')}
      </div>
    </div>
    ${ciRule('on-dark')}
    <div class="f-grid" data-stagger>
      <div class="f-brand">
        <a class="f-brand-logo" href="${c.href('home')}" aria-label="CERFODES ${esc(t(ui.common.home))}">
          <img src="${c.asset('img/logo/logo-horizontal-white.webp')}" alt="CERFODES" width="170" height="28" loading="lazy">
        </a>
        <p class="f-brand-tag">${esc(t(ui.meta.tagline))}</p>
        <p class="f-brand-soc"><a href="https://www.linkedin.com/company/cerfodes" aria-label="LinkedIn" class="soc">${icon.linkedin}</a><a href="https://x.com/cerfodes" aria-label="X" class="soc">${icon.x}</a></p>
      </div>
      ${col(t(ui.footer.company), ['about', 'services', 'where', 'insights', 'careers', 'contact'].map(k => `<li><a href="${c.href(k)}">${esc(t(ui.nav[k]))}</a></li>`))}
      ${col(t(ui.footer.access), [
        `<li><a href="${c.root('portal/')}${c.fileLinks ? 'index.html' : ''}#consultant">${esc(t(ui.nav.portal))}</a></li>`,
        `<li><a href="${c.root('portal/')}${c.fileLinks ? 'index.html' : ''}#admin">${esc(t(ui.nav.admin))}</a></li>`,
        `<li><a href="${c.root('client/')}${c.fileLinks ? 'index.html' : ''}">${esc(t(ui.nav.client))}</a></li>`,
        `<li><a href="${c.root('cms/')}${c.fileLinks ? 'index.html' : ''}">${esc(t(ui.nav.cms))}</a></li>`
      ])}
      ${col(t(ui.footer.offices), offices.map(o => `<li><a href="${c.href('where')}#office-${o.id}">${esc(o.city)}, ${esc(t(o.country))}</a></li>`))}
    </div>
    <div class="f-bottom">
      <p>© ${new Date().getFullYear()} CERFODES. ${esc(t(ui.footer.rights))}</p>
      <p class="f-legal"><a href="${c.href('privacy')}">${esc(t(ui.footer.privacy))}</a><button class="linkish" data-consent-open>${esc(t(ui.footer.cookies))}</button></p>
    </div>
    <p class="f-proto">${esc(t(ui.footer.prototype))}</p>
    <p class="f-wordmark" aria-hidden="true">CERFODES</p>
  </div>
</footer>`;
}

export function newsletterForm(c, id) {
  const t = c.t;
  return `<form class="nl-form" data-newsletter novalidate>
    <label class="sr-only" for="nl-${id}">${esc(t(ui.newsletter.label))}</label>
    <div class="nl-row">
      <input id="nl-${id}" name="email" type="email" autocomplete="email" required placeholder="${esc(t(ui.newsletter.placeholder))}">
      ${btn(t(ui.newsletter.cta), null, { variant: 'yellow', attrs: 'type="submit"' })}
    </div>
    <p class="nl-note" data-msg data-ok="${esc(t(ui.newsletter.sent))}" data-invalid="${esc(t(ui.newsletter.invalid))}" aria-live="polite">${esc(t(ui.newsletter.note))}</p>
  </form>`;
}

function consent(c) {
  const t = c.t;
  return `<div class="consent" data-consent hidden role="dialog" aria-live="polite" aria-label="Cookies">
  <div class="consent-copy">${dots()}<p>${esc(t(ui.consent.text))} <a href="${c.href('privacy')}">${esc(t(ui.footer.privacy))}</a></p></div>
  <div class="consent-actions"><button class="btn btn-ghost-dark btn-sm" data-consent-choice="no">${esc(t(ui.consent.decline))}</button><button class="btn btn-yellow btn-sm" data-consent-choice="yes">${esc(t(ui.consent.accept))}</button></div>
</div>`;
}

export function page(c, { title, description, body, altSub, ld, overHero = false, bodyClass = '' }) {
  return `${head(c, { title, description, altSub, ld })}
<body class="${bodyClass}">
${nav(c, altSub, { overHero })}
<main id="main">
${body}
</main>
${footer(c)}
${consent(c)}
<script type="module" src="${c.asset('js/site.js')}"></script>
</body>
</html>`;
}
