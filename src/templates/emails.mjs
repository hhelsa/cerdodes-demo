// On-brand auto-reply emails: Royal Blue header with logo and three dots, Futura headings,
// one orange CTA, tagline footer. Merge fields use {{double_braces}} and are filled at send time.
import { SITE_URL } from './helpers.mjs';

export const emailDefs = {
  enquiry: {
    trigger: { en: 'Lead scores 80+', fr: 'Score du prospect ≥ 80' },
    subject: { en: 'We’ve received your enquiry', fr: 'Nous avons bien reçu votre demande' },
    heading: { en: 'Thank you, {{first_name}}', fr: 'Merci, {{first_name}}' },
    body: {
      en: ['Your enquiry about <strong>{{topic}}</strong> has reached our <strong>{{office}}</strong> office.', 'A member of the team will reply within <strong>two working days</strong>. In the meantime, you may find our latest analysis useful.'],
      fr: ['Votre demande concernant <strong>{{topic}}</strong> a bien été transmise à notre bureau de <strong>{{office}}</strong>.', 'Un membre de l’équipe vous répondra sous <strong>deux jours ouvrés</strong>. En attendant, nos dernières analyses pourraient vous intéresser.']
    },
    cta: { en: 'Read our insights', fr: 'Lire nos analyses' },
    ctaUrl: { en: `${SITE_URL}/en/insights/`, fr: `${SITE_URL}/fr/analyses/` }
  },
  application: {
    trigger: { en: 'CV passes scan', fr: 'Le CV passe l’analyse' },
    subject: { en: 'Thank you for applying to CERFODES', fr: 'Merci d’avoir postulé chez CERFODES' },
    heading: { en: 'Thank you for applying, {{first_name}}', fr: 'Merci pour votre candidature, {{first_name}}' },
    body: {
      en: ['We have received your application for <strong>{{area}}</strong>.', 'Your CV passed our security checks and is now with our recruitment team. We review every application within <strong>three weeks</strong>.'],
      fr: ['Nous avons bien reçu votre candidature pour le domaine <strong>{{area}}</strong>.', 'Votre CV a passé nos contrôles de sécurité et a été transmis à notre équipe de recrutement. Nous examinons chaque candidature sous <strong>trois semaines</strong>.']
    },
    cta: { en: 'Discover life at CERFODES', fr: 'Découvrir CERFODES' },
    ctaUrl: { en: `${SITE_URL}/en/careers/`, fr: `${SITE_URL}/fr/carrieres/` }
  },
  newsletter: {
    trigger: { en: 'On sign-up', fr: 'À l’inscription' },
    subject: { en: 'Confirm your subscription', fr: 'Confirmez votre abonnement' },
    heading: { en: 'One click to confirm', fr: 'Un clic pour confirmer' },
    body: {
      en: ['Please confirm that you would like to receive <strong>the CERFODES Brief</strong>: one email a month with our latest analysis and lessons from the field.', 'If you did not sign up, simply ignore this email.'],
      fr: ['Merci de confirmer que vous souhaitez recevoir <strong>le CERFODES Brief</strong> : un e-mail par mois avec nos dernières analyses et les leçons du terrain.', 'Si vous ne vous êtes pas inscrit, ignorez simplement cet e-mail.']
    },
    cta: { en: 'Confirm subscription', fr: 'Confirmer l’abonnement' },
    ctaUrl: { en: '{{confirm_url}}', fr: '{{confirm_url}}' }
  }
};

const dotsRow = (a = '#FFB706', b = '#FFFFFF', c = '#389DC9') =>
  `<table role="presentation" cellpadding="0" cellspacing="0"><tr>${[a, b, c].map(col => `<td style="padding-right:6px"><div style="width:10px;height:10px;border-radius:50%;background:${col}"></div></td>`).join('')}</tr></table>`;

export function renderEmail(id, lang, { assetBase = `${SITE_URL}/assets/`, overrides = {} } = {}) {
  const d = { ...emailDefs[id], ...overrides };
  const g = v => (typeof v === 'object' ? v[lang] : v);
  const font = `'Futura PT', Futura, 'Jost', 'Century Gothic', Arial, sans-serif`;
  const paras = g(d.body).map(p => `<p style="margin:0 0 16px;font:400 16px/1.6 ${font};color:#1b2150">${p}</p>`).join('');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${g(d.subject)}</title></head>
<body style="margin:0;background:#f3f4fb">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4fb"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
  <tr><td style="background:#041790;padding:28px 32px">
    <img src="${assetBase}img/logo/logo-horizontal-white.png" width="180" alt="CERFODES" style="display:block;border:0;margin-bottom:18px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="40">${dotsRow()}</td><td><div style="height:1px;background:rgba(255,255,255,.35)"></div></td></tr></table>
  </td></tr>
  <tr><td style="padding:36px 32px 12px">
    <h1 style="margin:0 0 18px;font:800 26px/1.2 ${font};color:#041790;letter-spacing:-.01em">${g(d.heading)}</h1>
    ${paras}
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr><td style="background:#FFB706;border-radius:999px">
      <a href="${g(d.ctaUrl)}" style="display:inline-block;padding:14px 26px;font:700 15px ${font};color:#041790;text-decoration:none">${g(d.cta)} &rarr;</a></td></tr></table>
  </td></tr>
  <tr><td style="padding:0 32px 28px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td><div style="height:1px;background:#e3e6f5"></div></td><td width="44" align="right">${dotsRow('#FFB706', '#041790', '#389DC9')}</td></tr></table>
    <p style="margin:14px 0 0;font:500 12px/1.6 ${font};color:#3c4470;letter-spacing:.14em;text-transform:uppercase">${lang === 'fr' ? 'Technologie · Management · Conseil' : 'Technology · Management · Consulting'}</p>
    <p style="margin:6px 0 0;font:400 12px/1.6 ${font};color:#3c4470">CERFODES · info@cerfodesgroup.com · <a href="{{unsubscribe_url}}" style="color:#1d6a8d">${lang === 'fr' ? 'Se désabonner' : 'Unsubscribe'}</a></p>
  </td></tr>
</table></td></tr></table></body></html>`;
}
