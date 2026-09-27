// Reusable page sections. The homepage composes all of them in PRD order; inner pages reuse subsets.
import { ui } from '../content/ui.mjs';
import { services, offices, testimonials, team, caseStudies, faqs, insights, impact, beforeAfter, social } from '../content/collections.mjs';
import { esc, L, pic, dots, eyebrow, ciRule, btn, heading, split, sampleTag, stars, icon, arrow, fmtDate } from './helpers.mjs';
import { mapSvg } from './map.mjs';
import { newsletterForm } from './layout.mjs';

const byId = (list, id) => list.find(x => x.id === id);

export function hero(c) {
  const t = c.t; const h = ui.hero; const cs = caseStudies[0];
  return `<section class="hero" data-hero aria-labelledby="hero-title">
  <div class="hero-pin-wrap" data-curtain>
    <div class="hero-pin">
      <div class="hero-media" data-parallax>${pic(c, 'presenter', { alt: t({ en: 'A CERFODES consultant leads a planning workshop with a client team', fr: 'Une consultante CERFODES anime un atelier de planification avec une équipe cliente' }), eager: true, cls: 'hero-img' })}</div>
      <div class="hero-shade" aria-hidden="true"></div>
      <div class="wrap hero-inner">
        <p class="eyebrow on-dark hero-eyebrow">${dots('dots-pop')}<span class="hero-fade" style="--d:0">${esc(t(h.eyebrow))}</span></p>
        <h1 id="hero-title" class="hero-title" aria-label="${esc(t(h.title))}"><span aria-hidden="true">${split(t(h.title))}</span></h1>
        <p class="hero-lead hero-fade" style="--d:1">${esc(t(h.lead))}</p>
        <div class="hero-ctas hero-fade" style="--d:2">
          ${btn(t(h.cta1), c.href('contact'), { variant: 'yellow' })}
          ${btn(t(h.cta2), '#services', { variant: 'glass' })}
        </div>
        <div class="hero-bottom">
          <div class="hero-sectors hero-fade" style="--d:3">
            <p class="sr-only">${esc(t(h.sectorsLabel))}</p>
            <ul class="chips">${h.sectors.map(s => `<li class="chip chip-glass">${esc(t(s))}</li>`).join('')}</ul>
          </div>
          <a class="case-card hero-fade" style="--d:4" href="#case-study">
            <span class="case-thumb">${pic(c, cs.image, { alt: '', sizes: '120px' })}</span>
            <span class="case-copy"><small>${dots()} ${esc(t(h.newCase))} ${sampleTag(c, cs.placeholder)}</small><strong>${esc(t(cs.title))}</strong></span>
            <span class="case-arrow">${arrow}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
  ${ciRule('hero-rule on-dark')}
</section>`;
}

export function featured(c) {
  const t = c.t; const cs = caseStudies[0]; const m = cs.metrics[0];
  return `<section class="section featured" aria-labelledby="featured-title">
  <div class="wrap featured-grid">
    <a class="featured-media zoom" href="#case-study" data-reveal>${pic(c, 'glass', { alt: t({ en: 'Glass office towers seen from below', fr: 'Tours de bureaux vitrées vues d’en bas' }), sizes: '(min-width: 900px) 55vw, 100vw' })}
      <span class="featured-badge">${dots()} ${esc(t(cs.sector))}</span></a>
    <div class="featured-copy">
      ${eyebrow(t(ui.featured.eyebrow))}
      ${heading('h2', t(ui.featured.title), 'h2', 'featured-title')}
      <p class="featured-count" data-reveal><span class="count" data-count="${m.value}" data-suffix="${m.suffix}">${m.value.toLocaleString(c.lang === 'fr' ? 'fr-FR' : 'en-GB')}${m.suffix}</span><span class="count-label">${esc(t(m.label))} ${sampleTag(c, cs.placeholder)}</span></p>
      <p class="lead" data-reveal>${esc(t(cs.challenge))}</p>
      <p data-reveal><a class="link-arrow" href="#case-study">${esc(t(ui.featured.link))} ${arrow}</a></p>
    </div>
  </div>
</section>`;
}

export function beforeAfterSection(c) {
  const t = c.t;
  const list = (items, ok) => `<ul class="ba-list" data-stagger>${items.map(i => `<li><span class="ba-ico">${ok ? icon.check : icon.cross}</span>${esc(t(i))}</li>`).join('')}</ul>`;
  return `<section class="section ba" aria-labelledby="ba-title">
  <div class="curtain-pin-wrap" data-curtain>
    <div class="curtain-pin">
      <div class="wrap">
        <div class="section-head center">${eyebrow(t(ui.beforeAfter.eyebrow))}${heading('h2', t(ui.beforeAfter.title), 'h2', 'ba-title')} ${sampleTag(c, beforeAfter.placeholder)}</div>
        <div class="ba-grid">
          <div class="ba-card ba-before" data-reveal><h3>${esc(t(ui.beforeAfter.before))}</h3>${list(beforeAfter.before, false)}</div>
          <div class="ba-card ba-after" data-reveal><h3>${dots()} ${esc(t(ui.beforeAfter.after))}</h3>${list(beforeAfter.after, true)}</div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export function servicesTabs(c) {
  const t = c.t;
  const tabs = services.map((s, i) => `<button role="tab" id="tab-${s.id}" aria-controls="panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(t(s.name))}</button>`).join('');
  const panels = services.map((s, i) => {
    const q = byId(testimonials, s.quote.testimonial);
    return `<div class="svc-panel" role="tabpanel" id="panel-${s.id}" aria-labelledby="tab-${s.id}" style="--i:${i}" ${i ? 'hidden' : ''}>
      <div class="svc-copy">
        <span class="svc-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="h3">${esc(t(s.tagline))}</h3>
        <p>${esc(t(s.description))}</p>
        <h4 class="svc-sub">${esc(t(ui.services.offerings))} ${sampleTag(c, s.placeholder)}</h4>
        <ul class="svc-list">${s.offerings.map((o, j) => `<li style="--i:${j}">${dots()}<span>${esc(t(o))}</span></li>`).join('')}</ul>
        <blockquote class="svc-quote"><p>“${esc(t(q.quote))}”</p><footer>${esc(t(q.title))}, ${esc(t(q.org))}</footer></blockquote>
        <div class="svc-ctas">${btn(`${t(ui.services.cta)} ${t(s.name)}`, c.href('services', t(s.slug)), { variant: 'primary' })}${btn(t(ui.services.discuss), c.href('contact'), { variant: 'ghost', icon: false })}</div>
      </div>
      <div class="svc-media zoom">${pic(c, s.image, { alt: '', sizes: '(min-width: 900px) 45vw, 100vw' })}</div>
    </div>`;
  }).join('');
  return `<section class="section services" id="services" aria-labelledby="svc-title">
  <div class="wrap">
    <div class="section-head split-head">${eyebrow(t(ui.services.eyebrow))}<h2 id="svc-title" class="h2" data-split aria-label="${esc(t(ui.services.title))}"><span aria-hidden="true">${split(t(ui.services.title))}</span></h2></div>
    <div class="tabs" data-tabs>
      <div class="tab-bar" role="tablist" aria-label="${esc(t(ui.nav.services))}">${tabs}<span class="tab-ind" aria-hidden="true"></span></div>
      <div class="svc-panels" data-reveal>${panels}</div>
    </div>
  </div>
</section>`;
}

export function whoWeAre(c) {
  const t = c.t; const w = ui.who;
  return `<section class="section who dark" aria-labelledby="who-title">
  <div class="who-circles" aria-hidden="true"><i></i><i></i></div>
  <div class="curtain-pin-wrap" data-curtain>
    <div class="curtain-pin">
      <div class="wrap who-grid">
        <div>${eyebrow(t(w.eyebrow), 'on-dark')}${heading('h2', t(w.title), 'h1 caps', 'who-title')}</div>
        <dl class="who-rows" data-stagger>${w.rows.map(r => `<div><dt>${esc(t(r.k))}</dt><dd>${esc(t(r.v))}</dd></div>`).join('')}</dl>
      </div>
    </div>
  </div>
  <div class="wrap three-dots">
    <div class="td-copy" data-reveal><h3 class="h3 caps">${esc(t(w.dotsTitle))}</h3><p>${esc(t(w.dotsText))}</p></div>
    <ul class="td-list" data-stagger>${w.dots.map((d, i) => `<li><span class="td-dot td-${i}"></span>${esc(t(d))}</li>`).join('')}</ul>
  </div>
</section>`;
}

export function process(c) {
  const t = c.t; const p = ui.process;
  return `<section class="section process" aria-labelledby="proc-title">
  <div class="curtain-pin-wrap" data-curtain data-curtain-steps>
    <div class="curtain-pin">
      <div class="wrap process-grid">
        <div class="process-media" aria-hidden="true">${p.steps.map((s, i) => `<figure class="${i ? '' : 'active'}" data-step-img="${i}">${pic(c, s.img, { alt: '', sizes: '(min-width: 900px) 40vw, 100vw' })}</figure>`).join('')}
          <span class="process-count"><b data-step-num>01</b>/04</span></div>
        <div>
          ${eyebrow(t(p.eyebrow))}${heading('h2', t(p.title), 'h2', 'proc-title')}
          <div class="acc process-acc" data-accordion data-single data-process>
            ${p.steps.map((s, i) => `<div class="acc-item ${i ? '' : 'open'}" data-reveal>
              <h3><button class="acc-btn" aria-expanded="${i === 0}" aria-controls="step-${i}" id="step-b-${i}"><span class="acc-num">0${i + 1}</span><span class="acc-title">${esc(t(s.t))}</span><span class="acc-ico">${icon.plus}</span></button></h3>
              <div class="acc-panel" id="step-${i}" role="region" aria-labelledby="step-b-${i}" ${i ? 'hidden' : ''}><div><p>${esc(t(s.d))}</p></div></div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export function officeData(c) {
  const data = offices.map(o => ({ id: o.id, city: o.city, country: L(o.country, c.lang), address: L(o.address, c.lang), phones: o.phones, email: o.email, hq: !!o.hq, placeholder: !!o.placeholder, visible: o.visible,
    photo: c.asset(`img/photos/${o.photo}-640.webp`), lat: o.lat, lon: o.lon }));
  return `<script type="application/json" id="office-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export function mapSection(c, { headingTag = 'h2', withHead = true } = {}) {
  const t = c.t; const m = ui.map;
  return `<section class="section map-sec dark" id="map" aria-labelledby="map-title">
  <div class="wrap">
    ${withHead ? `<div class="section-head split-head">${eyebrow(t(m.eyebrow), 'on-dark')}<div>${heading(headingTag, t(m.title), 'h2', 'map-title')}<p class="lead on-dark" data-reveal id="map-title-lead">${esc(t(m.lead))}</p></div></div>` : ''}
    <div class="map" data-map data-contact="${c.href('contact')}">
      <div class="map-controls">
        <label class="switch"><input type="checkbox" data-show-offices checked><span class="switch-ui" aria-hidden="true"></span>${esc(t(m.showOffices))}</label>
      </div>
      <div class="map-stage" data-reveal>
        ${mapSvg(c)}
        <div class="map-tip" role="tooltip" hidden></div>
      </div>
      <p class="sr-only" id="map-hint">${esc(t(m.hint))}</p>
      <ul class="map-list" aria-label="${esc(t(m.listLabel))}">${offices.map(o => `<li><button data-open-office="${o.id}" id="office-${o.id}">${icon.pin}<span>${esc(o.city)}</span><small>${esc(t(o.country))}${o.hq ? ` · ${esc(t(m.hq))}` : ''}</small></button></li>`).join('')}</ul>
      <div class="map-pop" data-map-pop role="dialog" aria-modal="false" aria-labelledby="pop-city" hidden>
        <button class="pop-close" data-pop-close aria-label="${esc(t(ui.nav.close))}">${icon.cross}</button>
        <div class="pop-img"><img alt="" data-pop-img></div>
        <div class="pop-body">
          <p class="pop-country" data-pop-country></p>
          <h3 id="pop-city" class="h3" data-pop-city></h3>
          <p class="pop-addr">${icon.pin}<span data-pop-addr></span></p>
          <p class="pop-phones">${icon.phone}<span data-pop-phones></span></p>
          <p class="pop-mail">${icon.mail}<a data-pop-mail></a></p>
          <div class="pop-actions">
            <a class="btn btn-yellow btn-sm" data-pop-contact><span class="btn-roll"><span>${esc(t(m.contactOffice))}</span><span aria-hidden="true">${esc(t(m.contactOffice))}</span></span></a>
            <a class="btn btn-ghost btn-sm" data-pop-dir target="_blank" rel="noopener"><span class="btn-roll"><span>${esc(t(m.directions))}</span><span aria-hidden="true">${esc(t(m.directions))}</span></span></a>
          </div>
          <div class="pop-nav"><button data-pop-prev aria-label="${esc(t(m.prev))}">${arrow}</button><span data-pop-pos></span><button data-pop-next aria-label="${esc(t(m.next))}">${arrow}</button></div>
        </div>
      </div>
    </div>
  </div>
  ${officeData(c)}
</section>`;
}

export function teamSection(c) {
  const t = c.t; const tm = ui.team;
  return `<section class="section team" aria-labelledby="team-title">
  <div class="wrap">
    <div class="section-head split-head">${eyebrow(t(tm.eyebrow))}${heading('h2', t(tm.title), 'h2', 'team-title')}</div>
    <div class="team-grid" data-stagger>
      ${team.map((p, i) => `<article class="person zoom"><span class="person-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${pic(c, p.portrait, { alt: '', sizes: '(min-width: 900px) 30vw, 90vw' })}<div class="person-meta"><h3>${esc(p.name)} ${sampleTag(c, p.placeholder)}</h3><p>${esc(t(p.role))}</p>
        <p class="person-soc"><a href="#" aria-label="LinkedIn">${icon.linkedin}</a><a href="#" aria-label="X">${icon.x}</a></p></div></article>`).join('')}
    </div>
    <div class="hiring" data-reveal>
      ${dots('dots-lg')}<div><h3 class="h3">${esc(t(tm.hiringTitle))}</h3><p>${esc(t(tm.hiringText))}</p></div>
      ${btn(t(tm.apply), c.href('careers'), { variant: 'yellow' })}
    </div>
  </div>
</section>`;
}

export function testimonialsSection(c) {
  const t = c.t; const ts = ui.testimonials;
  const avg = (testimonials.reduce((s, x) => s + x.rating, 0) / testimonials.length).toFixed(1);
  return `<section class="section testi" aria-labelledby="testi-title">
  <div class="curtain-pin-wrap" data-curtain>
    <div class="curtain-pin">
      <div class="wrap testi-grid">
        <div class="testi-side">
          ${eyebrow(t(ts.eyebrow))}${heading('h2', t(ts.title), 'h2', 'testi-title')}
          <div class="rating" data-reveal><strong class="rating-num">${avg.replace('.', c.lang === 'fr' ? ',' : '.')}</strong><span>/5</span>${stars(Math.round(avg))}<small>${esc(t(ts.rating))} · ${esc(t(ts.ratingSource))}</small></div>
        </div>
        <div class="acc testi-acc" data-accordion data-single data-autoplay="7000">
          ${testimonials.map((q, i) => `<div class="acc-item ${i ? '' : 'open'}" data-reveal>
            <h3><button class="acc-btn" aria-expanded="${i === 0}" aria-controls="tq-${i}" id="tq-b-${i}">
              <span class="testi-avatar">${pic(c, q.photo, { alt: '', sizes: '56px' })}</span>
              <span class="acc-title"><strong>${esc(q.name)}</strong><small>${esc(t(q.title))}, ${esc(t(q.org))}</small></span>
              ${stars(q.rating)}<span class="acc-ico">${icon.plus}</span></button></h3>
            <div class="acc-panel" id="tq-${i}" role="region" aria-labelledby="tq-b-${i}" ${i ? 'hidden' : ''}><div><blockquote><p>“${esc(t(q.quote))}”</p></blockquote><span class="chip">${esc(t(q.sector))}</span> ${sampleTag(c, q.placeholder)}</div></div>
            <span class="acc-progress" aria-hidden="true"></span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export function impactSection(c) {
  const t = c.t; const max = Math.max(...impact.chart.series.map(s => s[1]));
  const fmt = n => n.toLocaleString(c.lang === 'fr' ? 'fr-FR' : 'en-GB');
  return `<section class="section impact" aria-labelledby="impact-title">
  <div class="curtain-pin-wrap" data-curtain>
    <div class="curtain-pin">
      <div class="wrap">
        <div class="section-head split-head">${eyebrow(t(ui.impact.eyebrow))}${heading('h2', t(ui.impact.title), 'h2', 'impact-title')}</div>
        <div class="impact-grid">
          <ul class="figures" data-stagger>${impact.figures.map(f => `<li><span class="figure-badge">${dots()}</span><span class="count" data-count="${f.value}" data-suffix="${f.suffix}">${fmt(f.value)}${f.suffix}</span><span>${esc(t(f.label))} ${sampleTag(c, f.placeholder)}</span></li>`).join('')}</ul>
          <figure class="chart" data-chart data-reveal>
            <figcaption>${esc(t(impact.chart.title))} ${sampleTag(c, impact.chart.placeholder)}</figcaption>
            <div class="bars" role="img" aria-label="${esc(t(impact.chart.title))}: ${impact.chart.series.map(([y, v]) => `${y} ${v}`).join(', ')}">
              ${impact.chart.series.map(([y, v], i) => `<div class="bar" style="--h:${(v / max * 100).toFixed(1)}%;--i:${i}"><span class="bar-col"><span class="bar-val">${v}</span><span class="bar-fill ${i === impact.chart.series.length - 1 ? 'hi' : ''}"></span></span><span class="bar-x">${y}</span></div>`).join('')}
            </div>
          </figure>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export function leadershipQuote(c) {
  const t = c.t; const q = ui.quote;
  return `<section class="section lq dark" aria-label="${esc(t(q.role))}">
  <div class="wrap lq-grid">
    <figure class="lq-portrait" data-reveal>${pic(c, 'handshake', { alt: '', sizes: '(min-width: 900px) 40vw, 100vw', attrs: 'data-drift' })}</figure>
    <div>
      <p class="lq-mark" aria-hidden="true">“</p>
      <blockquote class="lq-quote" data-split aria-label="${esc(t(q.text))}"><p aria-hidden="true">${split(t(q.text))}</p></blockquote>
      <p class="lq-name" data-reveal><strong>${esc(t(q.name))}</strong> ${sampleTag(c, true)}<br><span>${esc(t(q.role))}</span></p>
      <div data-reveal>${btn(t(q.cta), c.href('contact') + '?topic=call', { variant: 'yellow' })}</div>
    </div>
  </div>
</section>`;
}

export function caseStudySection(c) {
  const t = c.t; const cs = caseStudies[0]; const u = ui.caseStudy;
  const svc = byId(services, cs.practice);
  return `<section class="section case" id="case-study" aria-labelledby="case-title">
  <div class="wrap">
    <div class="case-wrap zoom" data-reveal>
      ${pic(c, 'speed', { alt: '', sizes: '100vw' })}
      <div class="case-over">
        <p class="eyebrow on-dark">${dots()}<span>${esc(t(u.eyebrow))}</span> ${sampleTag(c, cs.placeholder)}</p>
        <h2 id="case-title" class="h2">${esc(t(cs.title))}</h2>
        <div class="case-metrics">${cs.metrics.map(m => `<div><span class="count" data-count="${m.value}" data-suffix="${m.suffix}">${m.value.toLocaleString(c.lang === 'fr' ? 'fr-FR' : 'en-GB')}${m.suffix}</span><small>${esc(t(m.label))}</small></div>`).join('')}</div>
      </div>
    </div>
    <dl class="case-facts" data-stagger>
      <div><dt>${esc(t(u.client))}</dt><dd>${esc(t(cs.client))}</dd></div>
      <div><dt>${esc(t(u.sector))}</dt><dd>${esc(t(cs.sector))}</dd></div>
      <div><dt>${esc(t(u.country))}</dt><dd>${esc(t(cs.country))}</dd></div>
      <div><dt>${esc(t(u.practice))}</dt><dd><a href="${c.href('services', t(svc.slug))}">${esc(t(svc.name))}</a></dd></div>
    </dl>
  </div>
</section>`;
}

export function faqSection(c) {
  const t = c.t; const f = ui.faq; const tabs = Object.keys(f.tabs);
  return `<section class="section faq" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq-grid">
    <div>${eyebrow(t(f.eyebrow))}${heading('h2', t(f.title), 'h2', 'faq-title')}
      <p data-reveal class="faq-more">${esc(t(f.more))} <a class="link-arrow" href="${c.href('contact')}">${esc(t(ui.nav.talk))} ${arrow}</a></p></div>
    <div class="tabs" data-tabs>
      <div class="tab-bar" role="tablist" aria-label="FAQ">${tabs.map((k, i) => `<button role="tab" id="ftab-${k}" aria-controls="fpanel-${k}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}">${esc(t(f.tabs[k]))}</button>`).join('')}<span class="tab-ind" aria-hidden="true"></span></div>
      ${tabs.map((k, i) => `<div role="tabpanel" id="fpanel-${k}" aria-labelledby="ftab-${k}" ${i ? 'hidden' : ''}>
        <div class="acc faq-acc" data-accordion>
          ${faqs.filter(q => q.tab === k).map((q, j) => `<div class="acc-item">
            <h3><button class="acc-btn" aria-expanded="false" aria-controls="fq-${k}-${j}" id="fq-b-${k}-${j}"><span class="acc-title">${esc(t(q.q))}</span><span class="acc-ico">${icon.plus}</span></button></h3>
            <div class="acc-panel" id="fq-${k}-${j}" role="region" aria-labelledby="fq-b-${k}-${j}" hidden><div><p>${esc(t(q.a))}</p></div></div>
          </div>`).join('')}
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>`;
}

export function insightCard(c, a) {
  const t = c.t; const author = byId(team, a.author);
  return `<article class="post zoom">
    <a href="${c.href('insights', t(a.slug))}" class="post-link">
      <span class="post-img">${pic(c, a.image, { alt: '', sizes: '(min-width: 900px) 30vw, 90vw' })}</span>
      <span class="post-meta"><span class="chip">${esc(t(a.category))}</span><time datetime="${a.date}">${fmtDate(a.date, c.lang)}</time></span>
      <h3 class="post-title">${esc(t(a.title))}</h3>
      <p>${esc(t(a.summary))}</p>
      <span class="post-foot">${esc(t(ui.insights.by))} ${esc(author.name)} · ${a.readMins} ${esc(t(ui.insights.read))} ${sampleTag(c, a.placeholder)}</span>
    </a>
  </article>`;
}

export function insightsSection(c) {
  const t = c.t;
  return `<section class="section insights" aria-labelledby="ins-title">
  <div class="wrap">
    <div class="section-head row-head">${eyebrow(t(ui.insights.eyebrow))}${heading('h2', t(ui.insights.title), 'h2', 'ins-title')}<a class="link-arrow" href="${c.href('insights')}">${esc(t(ui.insights.all))} ${arrow}</a></div>
    <div class="post-grid" data-stagger>${insights.slice(0, 3).map(a => insightCard(c, a)).join('')}</div>
    <div class="brief" data-reveal>
      <div class="brief-copy">${dots('dots-lg')}<h3 class="h3 caps">${esc(t(ui.newsletter.name))}</h3><p>${esc(t(ui.newsletter.text))}</p></div>
      ${newsletterForm(c, 'insights')}
    </div>
  </div>
</section>`;
}

export function socialSection(c) {
  const t = c.t;
  return `<section class="section social" aria-labelledby="soc-title">
  <div class="wrap">
    <div class="section-head row-head">${eyebrow(t(ui.social.eyebrow))}${heading('h2', t(ui.social.title), 'h2', 'soc-title')}
      <p class="soc-follow"><a href="https://www.linkedin.com/company/cerfodes" class="chip">${icon.linkedin} LinkedIn</a><a href="https://x.com/cerfodes" class="chip">${icon.x} X</a></p></div>
    <div class="soc-grid" data-stagger>${social.map(p => `<article class="soc-card ${p.image ? 'has-img' : ''}">
      <header><span class="soc-ico">${p.network === 'X' ? icon.x : icon.linkedin}</span><strong>CERFODES</strong><time datetime="${p.date}">${fmtDate(p.date, c.lang)}</time></header>
      <p>${esc(t(p.text))}</p>${p.image ? `<span class="soc-img zoom">${pic(c, p.image, { alt: '', sizes: '(min-width: 900px) 30vw, 90vw' })}</span>` : ''}
      <footer>${sampleTag(c, true)}</footer></article>`).join('')}</div>
  </div>
</section>`;
}

export function contactSection(c, { standalone = false } = {}) {
  const t = c.t; const u = ui.contact;
  const opt = list => `<option value="">${esc(t(u.choose))}</option>` + list;
  return `<section class="section contact ${standalone ? 'contact-page' : ''}" id="contact" aria-labelledby="contact-title">
  <div class="wrap contact-grid">
    <div class="contact-side">
      ${eyebrow(t(u.eyebrow))}${heading(standalone ? 'h1' : 'h2', t(u.title), standalone ? 'h1' : 'h2', 'contact-title')}
      <p class="lead" data-reveal>${esc(t(u.lead))}</p>
      <ul class="contact-offices" data-stagger>${offices.filter(o => !o.placeholder).map(o => `<li><strong>${esc(o.city)}</strong><span>${esc(o.phones[0])}</span></li>`).join('')}</ul>
      <p data-reveal><a class="link-arrow" href="mailto:info@cerfodesgroup.com">info@cerfodesgroup.com ${arrow}</a></p>
    </div>
    <form class="form card" data-contact-form novalidate data-reveal>
      <div class="field"><label for="cf-name">${esc(t(u.name))}</label><input id="cf-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="cf-email">${esc(t(u.email))}</label><input id="cf-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="cf-org">${esc(t(u.org))}</label><input id="cf-org" name="organisation" autocomplete="organization" required></div>
      <div class="field-row">
        <div class="field"><label for="cf-sector">${esc(t(u.sector))}</label><select id="cf-sector" name="sector" required>${opt(u.sectors.map(s => `<option>${esc(t(s))}</option>`).join(''))}</select></div>
        <div class="field"><label for="cf-office">${esc(t(u.office))}</label><select id="cf-office" name="office" required>${opt(offices.map(o => `<option value="${o.id}">${esc(o.city)}, ${esc(t(o.country))}</option>`).join(''))}</select></div>
      </div>
      <div class="field"><label for="cf-msg">${esc(t(u.message))}</label><textarea id="cf-msg" name="message" rows="5" required></textarea></div>
      <div class="hp" aria-hidden="true"><label for="cf-web">${esc(t(u.trap))}</label><input id="cf-web" name="website" tabindex="-1" autocomplete="off"></div>
      <p class="form-note">${icon.shield} ${esc(t(u.captcha))} <a href="${c.href('privacy')}">${esc(t(u.privacy))}</a></p>
      ${btn(t(u.submit), null, { variant: 'primary', attrs: 'type="submit"' })}
      <div class="form-result" data-result aria-live="polite" hidden></div>
      <template data-i18n>${JSON.stringify({ okTitle: t(u.okTitle), okText: t(u.okText), reviewTitle: t(u.reviewTitle), reviewText: t(u.reviewText), required: t(u.required), emailInvalid: t(u.emailInvalid), sending: t(u.sending), rate: t(u.rate), demoScore: t(u.demoScore) }).replace(/</g, '\\u003c')}</template>
    </form>
  </div>
</section>`;
}

export function pageHero(c, { title, lead, image, crumbs = [] }) {
  const t = c.t;
  return `<section class="phero" data-hero>
  <div class="phero-media" data-parallax>${pic(c, image, { alt: '', eager: true, cls: 'hero-img' })}</div>
  <div class="hero-shade" aria-hidden="true"></div>
  <div class="wrap phero-inner">
    <nav class="crumbs hero-fade" style="--d:0" aria-label="Breadcrumb"><a href="${c.href('home')}">${esc(t(ui.common.home))}</a>${crumbs.map(([label, href]) => ` <span aria-hidden="true">/</span> ${href ? `<a href="${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`}`).join('')}</nav>
    <p class="eyebrow on-dark">${dots('dots-pop')}</p>
    <h1 class="hero-title h1" aria-label="${esc(title)}"><span aria-hidden="true">${split(title)}</span></h1>
    ${lead ? `<p class="hero-lead hero-fade" style="--d:1">${esc(lead)}</p>` : ''}
  </div>
  ${ciRule('hero-rule on-dark')}
</section>`;
}
