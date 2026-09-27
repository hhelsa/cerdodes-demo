// Lead screening: scores every contact submission 0–100 before delivery.
// Shared by the website (instant feedback), the CMS leads inbox and the tests.
// In production this runs server-side; the AI intent check calls an LLM classifier,
// with the keyword heuristic below as the offline fallback.

export const DEFAULT_THRESHOLDS = { genuine: 80, review: 40 };

export const DEFAULT_RULES = {
  honeypot: { on: true, weight: 100 },
  disposable: { on: true, weight: 60 },
  spamPhrases: { on: true, weight: 15, max: 45 },
  links: { on: true, weight: 30, limit: 2 },
  intent: { on: true, weight: 25 },
  freeEmail: { on: true, weight: 10 },
  tooShort: { on: true, weight: 15, minChars: 30 }
};

export const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
  'yopmail.com', 'trashmail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com',
  'maildrop.cc', 'throwawaymail.com', 'fakeinbox.com', 'mintemail.com', 'emailondeck.com'
];

export const FREE_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'yahoo.fr', 'hotmail.com', 'hotmail.fr', 'outlook.com', 'live.com',
  'aol.com', 'icloud.com', 'gmx.com', 'proton.me', 'protonmail.com', 'mail.com', 'orange.fr'
];

export const SPAM_PHRASES = [
  'seo services', 'rank your website', 'first page of google', 'guest post', 'backlinks',
  'crypto', 'bitcoin', 'forex', 'casino', 'viagra', 'loan offer', 'investment opportunity',
  'work from home', 'click here', 'limited time', 'act now', 'buy now', 'web design services',
  'increase your traffic', 'dear sir/madam', 'winner', 'congratulations you',
  'référencement', 'gagnez', 'offre exceptionnelle', 'cliquez ici'
];

// Signals that a message is a real service request (EN + FR). Fallback for the AI intent check.
export const INTENT_TERMS = [
  'proposal', 'tender', 'rfp', 'request for', 'terms of reference', 'tor', 'assessment', 'evaluation',
  'study', 'audit', 'support', 'consultancy', 'consulting', 'advisory', 'project', 'programme', 'program',
  'capacity', 'training', 'strategy', 'review', 'baseline', 'feasibility', 'engagement', 'assignment',
  'partnership', 'quote', 'budget', 'timeline', 'ministry', 'government', 'donor', 'implementation',
  'appel d’offres', "appel d'offres", 'termes de référence', 'étude', 'évaluation', 'mission', 'appui',
  'accompagnement', 'renforcement', 'projet', 'programme', 'devis', 'partenariat', 'diagnostic', 'conseil'
];

const URL_RE = /\b(?:https?:\/\/|www\.)\S+/gi;

export function emailDomain(email = '') {
  const at = String(email).trim().toLowerCase().lastIndexOf('@');
  return at === -1 ? '' : String(email).trim().toLowerCase().slice(at + 1);
}

export function intentCheck(message = '') {
  const text = message.toLowerCase();
  const hits = INTENT_TERMS.filter(t => new RegExp(`(^|[^\\p{L}])${escapeRe(t)}([^\\p{L}]|$)`, 'u').test(text));
  return { isServiceRequest: hits.length > 0, hits };
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/**
 * @param {{name?:string,email?:string,organisation?:string,message?:string,website?:string}} lead
 *   `website` is the hidden bot-trap field.
 * @returns {{score:number, bucket:'genuine'|'review'|'spam', reasons:{rule:string,delta:number,detail:string}[]}}
 */
export function scoreLead(lead, { rules = DEFAULT_RULES, thresholds = DEFAULT_THRESHOLDS } = {}) {
  const reasons = [];
  const hit = (rule, delta, detail) => reasons.push({ rule, delta: -Math.abs(delta), detail });
  const message = String(lead.message || '');
  const domain = emailDomain(lead.email);

  if (rules.honeypot?.on && String(lead.website || '').trim() !== '') hit('honeypot', rules.honeypot.weight, 'Hidden bot-trap field was filled');
  if (rules.disposable?.on && DISPOSABLE_DOMAINS.includes(domain)) hit('disposable', rules.disposable.weight, `Disposable email domain (${domain})`);

  if (rules.spamPhrases?.on) {
    const text = `${message} ${lead.organisation || ''}`.toLowerCase();
    const found = SPAM_PHRASES.filter(p => text.includes(p));
    if (found.length) hit('spamPhrases', Math.min(found.length * rules.spamPhrases.weight, rules.spamPhrases.max), `Spam phrases: ${found.join(', ')}`);
  }

  if (rules.links?.on) {
    const n = (message.match(URL_RE) || []).length;
    if (n > rules.links.limit) hit('links', rules.links.weight, `${n} links in message`);
  }

  if (rules.intent?.on) {
    const { isServiceRequest } = intentCheck(message);
    if (!isServiceRequest) hit('intent', rules.intent.weight, 'AI intent check: not recognised as a service request');
  }

  if (rules.freeEmail?.on && FREE_EMAIL_DOMAINS.includes(domain)) hit('freeEmail', rules.freeEmail.weight, `Free email provider (${domain})`);
  if (rules.tooShort?.on && message.trim().length < rules.tooShort.minChars) hit('tooShort', rules.tooShort.weight, 'Message is very short');

  const score = Math.max(0, Math.min(100, 100 + reasons.reduce((s, r) => s + r.delta, 0)));
  return { score, bucket: bucketFor(score, thresholds), reasons };
}

export function bucketFor(score, thresholds = DEFAULT_THRESHOLDS) {
  if (score >= thresholds.genuine) return 'genuine';
  if (score >= thresholds.review) return 'review';
  return 'spam';
}

/**
 * Editors moving leads between buckets nudge the thresholds ("moves train the thresholds").
 * Each move shifts the relevant boundary one point toward the moved lead's score, within safe bounds.
 */
export function trainThresholds(thresholds, { score, from, to }) {
  const t = { ...thresholds };
  const order = { spam: 0, review: 1, genuine: 2 };
  if (order[to] > order[from]) {
    if (to === 'genuine' && score < t.genuine) t.genuine = Math.max(t.review + 5, t.genuine - 1);
    if (to === 'review' && score < t.review) t.review = Math.max(10, t.review - 1);
  } else if (order[to] < order[from]) {
    if (from === 'genuine' && score >= t.genuine) t.genuine = Math.min(95, t.genuine + 1);
    if (to === 'spam' && score >= t.review) t.review = Math.min(t.genuine - 5, t.review + 1);
  }
  return t;
}

/** Spam is deleted after 30 days. */
export const SPAM_RETENTION_DAYS = 30;
export function isExpiredSpam(lead, now = Date.now()) {
  return lead.bucket === 'spam' && now - new Date(lead.receivedAt).getTime() > SPAM_RETENTION_DAYS * 864e5;
}
