// Static build: one template set renders every page in English and French.
// Output is server-rendered HTML (SEO/AI search), plus sitemap, llms.txt, emails and the app shells.
import { mkdirSync, writeFileSync, cpSync, rmSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { context, LANGS, SITE_URL, pagePath, L } from '../src/templates/helpers.mjs';
import * as P from '../src/templates/pages.mjs';
import { renderEmail, emailDefs } from '../src/templates/emails.mjs';
import { landSvg } from '../src/templates/map.mjs';
import { ui, routes } from '../src/content/ui.mjs';
import * as C from '../src/content/collections.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const fileLinks = process.argv.includes('--file-links') || process.env.FILE_LINKS === '1';

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const write = (rel, html) => { const f = join(out, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); };
const pages = [];
const emit = (lang, key, sub, html, altSub) => {
  const rel = pagePath(lang, key, sub);
  write(rel + 'index.html', html);
  pages.push({ lang, key, sub, altSub, rel });
};

for (const lang of LANGS) {
  const ctx = (key, sub = null) => context({ lang, key, sub, fileLinks });
  emit(lang, 'home', null, P.home(ctx('home')));
  emit(lang, 'about', null, P.about(ctx('about')));
  emit(lang, 'services', null, P.servicesIndex(ctx('services')));
  for (const s of C.services) emit(lang, 'services', L(s.slug, lang), P.serviceDetail(ctx('services', L(s.slug, lang)), s), L(s.slug, lang === 'en' ? 'fr' : 'en'));
  emit(lang, 'where', null, P.where(ctx('where')));
  emit(lang, 'insights', null, P.insightsIndex(ctx('insights')));
  for (const a of C.insights) emit(lang, 'insights', L(a.slug, lang), P.article(ctx('insights', L(a.slug, lang)), a), L(a.slug, lang === 'en' ? 'fr' : 'en'));
  emit(lang, 'careers', null, P.careers(ctx('careers')));
  emit(lang, 'contact', null, P.contact(ctx('contact')));
  emit(lang, 'privacy', null, P.privacy(ctx('privacy')));
}

// Assets and shared libraries (the same lead-score / file-check modules run in the browser and in tests)
cpSync(join(root, 'src/assets'), join(out, 'assets'), { recursive: true });
cpSync(join(root, 'src/lib'), join(out, 'assets/js/lib'), { recursive: true });
write('assets/img/world-land.svg', landSvg());

// App shells: consultant portal, client WhatsApp access, CMS
for (const app of readdirSync(join(root, 'src/apps'))) cpSync(join(root, 'src/apps', app), join(out, app), { recursive: true });

// Emails (EN/FR) – also embedded in the CMS for live preview
const emails = {};
for (const id of Object.keys(emailDefs)) for (const lang of LANGS) {
  const html = renderEmail(id, lang, { assetBase: '../../assets/' });
  write(`emails/${lang}/${id}.html`, html);
  (emails[id] ||= { trigger: emailDefs[id].trigger, subject: emailDefs[id].subject })[lang] = renderEmail(id, lang, { assetBase: '../assets/' });
}

// CMS seed data: collections + page status + emails
const pageRows = [];
for (const p of pages.filter(p => p.lang === 'en')) {
  const fr = pages.find(q => q.lang === 'fr' && q.key === p.key && (p.sub ? q.sub === p.altSub : !q.sub));
  pageRows.push({ key: p.key, sub: p.sub, en: '/' + p.rel, fr: fr ? '/' + fr.rel : null });
}
write('assets/data/cms-seed.json', JSON.stringify({ collections: C, pages: pageRows, emails, routes, nav: ui.nav }, null, 0));

// Sitemap with hreflang pairs
const url = rel => `${SITE_URL}/${rel}`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(p => {
  const other = pages.find(q => q.lang !== p.lang && q.key === p.key && (p.sub ? q.sub === p.altSub : !q.sub));
  return `  <url><loc>${url(p.rel)}</loc><lastmod>2026-09-25</lastmod>
    <xhtml:link rel="alternate" hreflang="${p.lang}" href="${url(p.rel)}"/>
    ${other ? `<xhtml:link rel="alternate" hreflang="${other.lang}" href="${url(other.rel)}"/>` : ''}
    <xhtml:link rel="alternate" hreflang="x-default" href="${url(p.lang === 'en' ? p.rel : other?.rel ?? p.rel)}"/></url>`;
}).join('\n')}
</urlset>`;
write('sitemap.xml', sitemap);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /portal/\nDisallow: /cms/\nDisallow: /client/\n\n# AI crawlers welcome on public content\nUser-agent: GPTBot\nAllow: /en/\nAllow: /fr/\nUser-agent: ClaudeBot\nAllow: /en/\nAllow: /fr/\nUser-agent: PerplexityBot\nAllow: /en/\nAllow: /fr/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// llms.txt – concise, factual summary for AI assistants
const llms = `# CERFODES

> CERFODES is an Africa-based, African-led international consulting firm founded in 2002. It provides technical advice and support to public, private and non-profit organisations across three practices: Technology, Management and Consulting. Offices: Côte d’Ivoire (Abidjan), Nigeria, Kenya (Nairobi), Uganda (Kampala, head office), Burkina Faso (Ouagadougou), Guinea-Bissau (Bissau) and Malawi (Lilongwe). Contact: info@cerfodesgroup.com.

The site is fully bilingual. English pages live under /en/, French pages under /fr/.

## Key facts
- Founded: 2002
- Headquarters: George Courts, Wing B, 2nd Floor, Plot 34, Hannington Road, Nakasero, Kampala, Uganda
- Approach: rigorous, data-driven, customised solutions; four steps: Agree, Analyse, Customise, Deliver
- Values: dignity of the individual, excellence, service, reliability, transparency, efficiency
- The three dots in the identity stand for consistency, commitment and conscientiousness
- Enquiries are answered within two working days by the nearest office

## Services
${C.services.map(s => `- [${s.name.en}](${SITE_URL}/en/services/${s.slug.en}/): ${s.tagline.en} Offerings: ${s.offerings.map(o => o.en).join('; ')}.`).join('\n')}

## Offices
${C.offices.map(o => `- ${o.city}, ${o.country.en}${o.hq ? ' (head office)' : ''}: ${o.placeholder ? 'address to be confirmed' : o.address.en}${o.phones.length ? '; ' + o.phones.join(', ') : ''}`).join('\n')}

## Pages
- [About](${SITE_URL}/en/about/): positioning, vision, mission, values
- [Where we work](${SITE_URL}/en/where-we-work/): office addresses and map
- [Insights](${SITE_URL}/en/insights/): articles and the CERFODES Brief newsletter
- [Careers](${SITE_URL}/en/careers/): open applications, CV upload
- [Contact](${SITE_URL}/en/contact/): enquiry form routed to the nearest office
- [Version française](${SITE_URL}/fr/)

## FAQ
${C.faqs.map(f => `- Q: ${f.q.en}\n  A: ${f.a.en}`).join('\n')}
`;
write('llms.txt', llms);

// Root: language negotiation with a crawlable fallback
write('index.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CERFODES</title><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="alternate" hreflang="en" href="${SITE_URL}/en/"><link rel="alternate" hreflang="fr" href="${SITE_URL}/fr/"><link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/">
<script>var l=(navigator.language||'en').slice(0,2)==='fr'?'fr':'en';location.replace(l+'/${fileLinks ? 'index.html' : ''}');</script>
<style>body{font-family:system-ui;background:#041790;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0}a{color:#FFB706;margin:0 1em}</style></head>
<body><p><a href="en/${fileLinks ? 'index.html' : ''}">English</a><a href="fr/${fileLinks ? 'index.html' : ''}">Français</a></p></body></html>`);

write('404.html', readFileSync(join(out, 'en/index.html'), 'utf8').replace(/<main id="main">[\s\S]*<\/main>/, `<main id="main"><section class="section" style="padding-top:180px"><div class="wrap"><h1 class="h1">Page not found · Page introuvable</h1><p><a class="link-arrow" href="/en/">Home</a> · <a class="link-arrow" href="/fr/">Accueil</a></p></div></section></main>`));

console.log(`Built ${pages.length} pages (${LANGS.join('/')}) → dist/${fileLinks ? ' [file links]' : ''}`);
