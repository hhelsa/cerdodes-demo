import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanFile, checkName, MAX_BYTES } from '../src/lib/file-check.js';

const enc = s => new TextEncoder().encode(s);
const pdf = body => enc(`%PDF-1.7\n${body}\n%%EOF`);

test('clean PDF passes', () => {
  const r = scanFile({ name: 'cv.pdf', size: 2000, bytes: pdf('1 0 obj << /Type /Catalog >> endobj') });
  assert.equal(r.status, 'clean');
});

test('disguised executable is blocked', () => {
  assert.equal(checkName('resume.pdf.exe').code, 'disguised');
  assert.equal(checkName('resume.exe.pdf').code, 'disguised');
  assert.equal(checkName('setup.exe').code, 'executable');
  const r = scanFile({ name: 'resume.pdf.exe', size: 10, bytes: new Uint8Array([0x4d, 0x5a]) });
  assert.equal(r.status, 'blocked');
});

test('executable content renamed to .pdf is blocked', () => {
  const r = scanFile({ name: 'cv.pdf', size: 10, bytes: new Uint8Array([0x4d, 0x5a, 0, 0]) });
  assert.equal(r.status, 'blocked');
  assert.match(r.reason, /Executable/);
});

test('oversized and unsupported files are rejected', () => {
  assert.equal(scanFile({ name: 'cv.pdf', size: MAX_BYTES + 1, bytes: pdf('') }).status, 'blocked');
  assert.equal(scanFile({ name: 'cv.png', size: 10, bytes: new Uint8Array(4) }).status, 'blocked');
  assert.equal(scanFile({ name: 'cv.docm', size: 10, bytes: new Uint8Array(4) }).status, 'blocked');
});

test('PDF with embedded JavaScript is cleaned', () => {
  const r = scanFile({ name: 'cv.pdf', size: 100, bytes: pdf('<< /OpenAction << /S /JavaScript /JS (app.alert(1)) >> >>') });
  assert.equal(r.status, 'cleaned');
});

test('DOCX with macros is cleaned', () => {
  const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, ...enc('word/vbaProject.bin')]);
  assert.equal(scanFile({ name: 'cv.docx', size: bytes.length, bytes }).status, 'cleaned');
});

test('phishing links and EICAR are blocked', () => {
  assert.equal(scanFile({ name: 'cv.pdf', size: 100, bytes: pdf('see https://secure-login-verify.com/reset') }).status, 'blocked');
  const eicar = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
  assert.equal(scanFile({ name: 'cv.pdf', size: 100, bytes: pdf(eicar) }).status, 'blocked');
});
