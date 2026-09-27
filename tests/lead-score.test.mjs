import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreLead, bucketFor, trainThresholds, DEFAULT_RULES, DEFAULT_THRESHOLDS, isExpiredSpam } from '../src/lib/lead-score.js';

const genuine = { name: 'Amina Okello', email: 'a.okello@finance.go.ug', organisation: 'Ministry of Finance', message: 'We would like a proposal for an institutional assessment of our internal audit function, starting in Q1.' };

test('genuine enquiry scores 80+ and routes to inbox', () => {
  const r = scoreLead(genuine);
  assert.equal(r.score, 100);
  assert.equal(r.bucket, 'genuine');
});

test('French service request passes the intent check', () => {
  const r = scoreLead({ ...genuine, message: 'Nous souhaitons un appui pour une étude de faisabilité dans le cadre de notre projet.' });
  assert.equal(r.bucket, 'genuine');
});

test('bot trap alone sends a lead to spam', () => {
  const r = scoreLead({ ...genuine, website: 'http://x.com' });
  assert.equal(r.score, 0);
  assert.equal(r.bucket, 'spam');
});

test('SEO pitch from disposable domain with many links is spam', () => {
  const r = scoreLead({ email: 'x@mailinator.com', message: 'SEO services to rank your website on first page of google http://a.io http://b.io http://c.io' });
  assert.equal(r.bucket, 'spam');
  assert.ok(r.reasons.some(x => x.rule === 'disposable'));
  assert.ok(r.reasons.some(x => x.rule === 'links'));
});

test('free email vague message is held for review', () => {
  const r = scoreLead({ email: 'someone@gmail.com', message: 'Hello, I would like to know more about your company please.' });
  assert.equal(r.bucket, 'review');
  assert.equal(r.score, 65);
});

test('rules can be switched off', () => {
  const rules = structuredClone(DEFAULT_RULES); rules.freeEmail.on = false; rules.intent.on = false;
  const r = scoreLead({ email: 'someone@gmail.com', message: 'Hello, I would like to know more about your company please.' }, { rules });
  assert.equal(r.score, 100);
});

test('bucket boundaries', () => {
  assert.equal(bucketFor(80), 'genuine');
  assert.equal(bucketFor(79), 'review');
  assert.equal(bucketFor(40), 'review');
  assert.equal(bucketFor(39), 'spam');
});

test('moving leads trains thresholds within bounds', () => {
  let t = trainThresholds(DEFAULT_THRESHOLDS, { score: 70, from: 'review', to: 'genuine' });
  assert.equal(t.genuine, 79);
  t = trainThresholds(t, { score: 85, from: 'genuine', to: 'spam' });
  assert.equal(t.genuine, 80);
  let s = { genuine: 46, review: 40 };
  s = trainThresholds(s, { score: 20, from: 'review', to: 'genuine' });
  assert.equal(s.genuine, 45, 'genuine never closer than 5 to review');
});

test('spam expires after 30 days', () => {
  const old = { bucket: 'spam', receivedAt: new Date(Date.now() - 31 * 864e5).toISOString() };
  assert.equal(isExpiredSpam(old), true);
  assert.equal(isExpiredSpam({ ...old, bucket: 'review' }), false);
});
