import { ui } from '../content/ui.mjs';
import { services, offices, testimonials, team, insights, faqs } from '../content/collections.mjs';
import { esc, L, pic, dots, eyebrow, btn, heading, sampleTag, arrow, icon, fmtDate, SITE_URL } from './helpers.mjs';
import { page, faqLd, newsletterForm } from './layout.mjs';
import * as S from './sections.mjs';

export function home(c) {
  const body = [
    S.hero(c), S.featured(c), S.beforeAfterSection(c), S.servicesTabs(c), S.whoWeAre(c), S.process(c),
    S.mapSection(c), S.teamSection(c), S.testimonialsSection(c), S.impactSection(c), S.leadershipQuote(c),
    S.caseStudySection(c), S.faqSection(c), S.insightsSection(c), S.socialSection(c), S.contactSection(c)
  ].join('\n');
  return page(c, { body, overHero: true, bodyClass: 'is-home', ld: [faqLd(c.lang)] });
}

export function about(c) {
  const t = c.t; const a = ui.about;
  const body = `${S.pageHero(c, { title: t(a.title), lead: t(a.lead), image: 'team-table', crumbs: [[t(ui.nav.about)]] })}
  <section class="section vm">
    <div class="wrap vm-grid">
      <article class="vm-card" data-reveal>${dots()}<h2 class="h3 caps">${esc(t(a.visionT))}</h2><p class="lead">${esc(t(a.vision))}</p></article>
      <article class="vm-card vm-alt" data-reveal>${dots()}<h2 class="h3 caps">${esc(t(a.missionT))}</h2><p class="lead">${esc(t(a.mission))}</p></article>
    </div>
  </section>
  ${S.whoWeAre(c)}
  <section class="section values" aria-labelledby="values-title">
    <div class="wrap">
      <div class="section-head split-head">${eyebrow(t(a.valuesT))}${heading('h2', t({ en: 'What we stand for', fr: 'Ce qui nous guide' }), 'h2', 'values-title')}</div>
      <ul class="values-grid" data-stagger>${a.values.map((v, i) => `<li><span class="v-num">0${i + 1}</span><h3>${esc(t(v.t))}</h3><p>${esc(t(v.d))}</p></li>`).join('')}</ul>
    </div>
  </section>
  ${S.process(c)}
  ${S.teamSection(c)}
  ${S.impactSection(c)}`;
  return page(c, { title: t(ui.nav.about), description: t(a.lead), body });
}

export function servicesIndex(c) {
  const t = c.t;
  const body = `${S.pageHero(c, { title: t(ui.services.title), lead: t(ui.meta.description), image: 'meeting-table', crumbs: [[t(ui.nav.services)]] })}
  <section class="section">
    <div class="wrap svc-cards" data-stagger>
      ${services.map(s => `<a class="svc-card zoom" href="${c.href('services', t(s.slug))}">
        ${pic(c, s.image, { alt: '', sizes: '(min-width: 900px) 33vw, 100vw' })}
        <span class="svc-card-body">${dots()}<strong class="h3">${esc(t(s.name))}</strong><span>${esc(t(s.tagline))}</span><span class="link-arrow">${esc(t(ui.common.learnMore))} ${arrow}</span></span>
      </a>`).join('')}
    </div>
  </section>
  ${S.servicesTabs(c)}
  ${S.process(c)}
  ${S.contactSection(c)}`;
  return page(c, { title: t(ui.nav.services), body });
}

export function serviceDetail(c, s) {
  const t = c.t;
  const q = testimonials.find(x => x.id === s.quote.testimonial);
  const related = insights.filter(a => a.practice === s.id);
  const serviceLd = { '@type': 'Service', name: t(s.name), serviceType: t(s.name), description: t(s.description), provider: { '@id': SITE_URL + '/#org' }, areaServed: 'Worldwide', hasOfferCatalog: { '@type': 'OfferCatalog', name: t(ui.services.offerings), itemListElement: s.offerings.map(o => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: t(o) } })) } };
  const svcFaq = [
    { q: { en: `What does the CERFODES ${s.name.en} practice do?`, fr: `Que fait le pôle ${s.name.fr} de CERFODES ?` }, a: s.description },
    { q: { en: `Which ${s.name.en.toLowerCase()} services does CERFODES offer?`, fr: `Quels services de ${s.name.fr.toLowerCase()} CERFODES propose-t-il ?` }, a: { en: s.offerings.map(o => o.en).join('; ') + '.', fr: s.offerings.map(o => o.fr).join(' ; ') + '.' } },
    { q: { en: 'Where does CERFODES deliver this work?', fr: 'Où CERFODES intervient-il ?' }, a: { en: 'From offices in Côte d’Ivoire, Nigeria, Kenya, Uganda, Burkina Faso, Guinea-Bissau and Malawi, and with partners worldwide.', fr: 'Depuis ses bureaux en Côte d’Ivoire, au Nigeria, au Kenya, en Ouganda, au Burkina Faso, en Guinée-Bissau et au Malawi, et avec des partenaires dans le monde entier.' } }
  ];
  const body = `${S.pageHero(c, { title: t(s.name), lead: t(s.tagline), image: s.image, crumbs: [[t(ui.nav.services), c.href('services')], [t(s.name)]] })}
  <section class="section">
    <div class="wrap sd-grid">
      <div>
        ${eyebrow(t(ui.services.offerings))}
        <p class="lead" data-reveal>${esc(t(s.description))}</p>
        <ul class="sd-list" data-stagger>${s.offerings.map((o, i) => `<li><span class="v-num">0${i + 1}</span>${esc(t(o))}</li>`).join('')}</ul>
        ${sampleTag(c, s.placeholder)}
      </div>
      <aside class="sd-aside">
        <blockquote class="svc-quote card" data-reveal><p>“${esc(t(q.quote))}”</p><footer>${esc(t(q.title))}, ${esc(t(q.org))} ${sampleTag(c, q.placeholder)}</footer></blockquote>
        <div class="card sd-cta" data-reveal>${dots()}<h2 class="h3">${esc(t(ui.services.discuss))}</h2><p>${esc(t(ui.contact.lead))}</p>${btn(t(ui.nav.talk), c.href('contact'), { variant: 'yellow' })}</div>
      </aside>
    </div>
  </section>
  <section class="section faq"><div class="wrap faq-grid"><div>${eyebrow('FAQ')}${heading('h2', t(ui.faq.title), 'h2')}</div>
    <div class="acc faq-acc" data-accordion>${svcFaq.map((f, j) => `<div class="acc-item"><h3><button class="acc-btn" aria-expanded="false" aria-controls="sf-${j}" id="sf-b-${j}"><span class="acc-title">${esc(t(f.q))}</span><span class="acc-ico">${icon.plus}</span></button></h3><div class="acc-panel" id="sf-${j}" role="region" aria-labelledby="sf-b-${j}" hidden><div><p>${esc(t(f.a))}</p></div></div></div>`).join('')}</div></div></section>
  ${related.length ? `<section class="section insights"><div class="wrap"><div class="section-head row-head">${eyebrow(t(ui.insights.eyebrow))}${heading('h2', t(ui.insights.title), 'h2')}</div><div class="post-grid">${related.map(a => S.insightCard(c, a)).join('')}</div></div></section>` : ''}`;
  const altSub = L(s.slug, c.other);
  return page(c, { title: t(s.name), description: t(s.description), body, altSub, ld: [serviceLd, faqLd(c.lang, svcFaq)] });
}

export function where(c) {
  const t = c.t;
  const body = `${S.pageHero(c, { title: t(ui.map.title), lead: t(ui.where.lead), image: 'silhouettes', crumbs: [[t(ui.nav.where)]] })}
  ${S.mapSection(c, { withHead: false })}
  <section class="section">
    <div class="wrap office-grid" data-stagger>
      ${offices.map(o => `<article class="office-card" id="office-card-${o.id}">
        <span class="office-img zoom">${pic(c, o.photo, { alt: '', sizes: '(min-width: 900px) 30vw, 90vw' })}</span>
        <div class="office-body"><p class="pop-country">${esc(t(o.country))}${o.hq ? ` · ${esc(t(ui.map.hq))}` : ''}</p><h2 class="h3">${esc(o.city)} ${sampleTag(c, o.placeholder)}</h2>
        <address>${esc(t(o.address))}</address>
        ${o.phones.length ? `<p>${o.phones.map(p => `<a href="tel:${p.replace(/\s/g, '')}">${esc(p)}</a>`).join('<br>')}</p>` : ''}
        <p><a href="mailto:${o.email}">${o.email}</a></p>
        <a class="link-arrow" href="${c.href('contact')}?office=${o.id}">${esc(t(ui.map.contactOffice))} ${arrow}</a></div>
      </article>`).join('')}
    </div>
  </section>`;
  return page(c, { title: t(ui.nav.where), description: t(ui.where.lead), body });
}

export function insightsIndex(c) {
  const t = c.t;
  const body = `${S.pageHero(c, { title: t(ui.insights.title), lead: t(ui.insights.lead), image: 'lightbulb', crumbs: [[t(ui.nav.insights)]] })}
  <section class="section insights">
    <div class="wrap">
      <div class="post-grid" data-stagger>${insights.map(a => S.insightCard(c, a)).join('')}</div>
      <div class="brief" data-reveal><div class="brief-copy">${dots('dots-lg')}<h2 class="h3 caps">${esc(t(ui.newsletter.name))}</h2><p>${esc(t(ui.newsletter.text))}</p></div>${newsletterForm(c, 'page')}</div>
    </div>
  </section>`;
  return page(c, { title: t(ui.nav.insights), description: t(ui.insights.lead), body });
}

export function article(c, a) {
  const t = c.t; const author = team.find(p => p.id === a.author); const svc = services.find(s => s.id === a.practice);
  const ld = { '@type': 'Article', headline: t(a.title), description: t(a.summary), datePublished: a.date, dateModified: a.date, inLanguage: c.lang, image: `${SITE_URL}/assets/img/photos/${a.image}-1280.webp`, author: { '@type': 'Person', name: author.name, jobTitle: t(author.role), worksFor: { '@id': SITE_URL + '/#org' } }, publisher: { '@id': SITE_URL + '/#org' }, about: t(svc.name) };
  const body = `${S.pageHero(c, { title: t(a.title), lead: t(a.summary), image: a.image, crumbs: [[t(ui.nav.insights), c.href('insights')], [t(a.category)]] })}
  <article class="section prose-wrap">
    <div class="wrap prose">
      <p class="post-meta"><span class="chip">${esc(t(a.category))}</span><time datetime="${a.date}">${fmtDate(a.date, c.lang)}</time> · ${esc(t(ui.insights.by))} ${esc(author.name)}, ${esc(t(author.role))} · ${a.readMins} ${esc(t(ui.insights.read))} ${sampleTag(c, a.placeholder)}</p>
      <h2>${esc(t({ en: 'Key points', fr: 'Points clés' }))}</h2>
      <ul><li>${esc(t(a.summary))}</li><li>${esc(t({ en: 'Full article text will be supplied by CERFODES and published from the CMS in English and French.', fr: 'Le texte complet sera fourni par CERFODES et publié depuis le CMS en anglais et en français.' }))}</li></ul>
      <p>${esc(t({ en: 'This article page shows the Insights template: title, summary, category, author, date and image, with Article structured data so AI assistants and search engines can cite it accurately.', fr: 'Cette page présente le modèle Analyses : titre, résumé, catégorie, auteur, date et image, avec des données structurées Article pour que les assistants IA et les moteurs de recherche puissent la citer avec précision.' }))}</p>
      <p><a class="link-arrow" href="${c.href('services', t(svc.slug))}">${esc(t(ui.insights.related))}: ${esc(t(svc.name))} ${arrow}</a></p>
      <p><a class="link-arrow back" href="${c.href('insights')}">${esc(t(ui.insights.back))}</a></p>
    </div>
  </article>`;
  return page(c, { title: t(a.title), description: t(a.summary), body, altSub: L(a.slug, c.other), ld: [ld] });
}

export function careers(c) {
  const t = c.t; const u = ui.careers;
  const body = `${S.pageHero(c, { title: t(u.title), lead: t(u.lead), image: 'smiles', crumbs: [[t(ui.nav.careers)]] })}
  <section class="section">
    <div class="wrap">
      <ul class="values-grid three" data-stagger>${u.why.map((w, i) => `<li><span class="v-num">0${i + 1}</span><h2 class="h3">${esc(t(w.t))}</h2><p>${esc(t(w.d))}</p></li>`).join('')}</ul>
    </div>
  </section>
  <section class="section careers-form" id="apply" aria-labelledby="apply-title">
    <div class="wrap contact-grid">
      <div class="contact-side">${eyebrow(t(ui.nav.careers))}${heading('h2', t(u.formTitle), 'h2', 'apply-title')}
        <p class="lead" data-reveal>${esc(t(ui.faq.tabs.careers))}: ${esc(t(faqs.find(f => f.tab === 'careers').a))}</p></div>
      <form class="form card" data-careers-form novalidate data-reveal>
        <div class="field"><label for="ca-name">${esc(t(ui.contact.name))}</label><input id="ca-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="ca-email">${esc(t(ui.contact.email))}</label><input id="ca-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="ca-area">${esc(t(u.area))}</label><select id="ca-area" name="area" required><option value="">${esc(t(ui.contact.choose))}</option>${u.areas.map(a => `<option>${esc(t(a))}</option>`).join('')}</select></div>
        <div class="field"><span class="label" id="ca-cv-l">${esc(t(u.cv))}</span>
          <label class="drop" data-drop><input type="file" name="cv" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-labelledby="ca-cv-l" required>
          <span class="drop-ui"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0-5 5m5-5 5 5M4 20h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-drop-label>${esc(t(u.drop))}</span></span></label>
          <ol class="scan" data-scan aria-live="polite" hidden></ol>
        </div>
        <div class="hp" aria-hidden="true"><label for="ca-web">${esc(t(ui.contact.trap))}</label><input id="ca-web" name="website" tabindex="-1" autocomplete="off"></div>
        ${btn(t(u.submit), null, { variant: 'primary', attrs: 'type="submit" disabled' })}
        <div class="form-result" data-result aria-live="polite" hidden></div>
        <template data-i18n>${JSON.stringify({ scanning: t(u.scanning), clean: t(u.clean), cleaned: t(u.cleaned), blocked: t(u.blocked), okTitle: t(u.okTitle), okText: t(u.okText), required: t(ui.contact.required), emailInvalid: t(ui.contact.emailInvalid) }).replace(/</g, '\\u003c')}</template>
      </form>
    </div>
  </section>
  ${S.teamSection(c)}`;
  return page(c, { title: t(ui.nav.careers), description: t(u.lead), body });
}

export function contact(c) {
  const t = c.t;
  const body = `<div class="page-top"></div>${S.contactSection(c, { standalone: true })}${S.mapSection(c)}`;
  return page(c, { title: t(ui.nav.contact), description: t(ui.contact.lead), body });
}

export function privacy(c) {
  const t = c.t;
  const body = `<div class="page-top"></div><section class="section prose-wrap"><div class="wrap prose">${eyebrow(t(ui.privacy.title))}<h1 class="h1">${esc(t(ui.privacy.title))}</h1>${L(ui.privacy.body, c.lang).map(p => `<p>${esc(p)}</p>`).join('')}</div></section>`;
  return page(c, { title: t(ui.privacy.title), body });
}
