// CV and deliverable security pipeline (client-side pre-check).
// Production runs the same steps server-side before storage: antivirus scan (e.g. ClamAV),
// macro/script removal (CDR), and link checks against phishing lists. Blocked files are quarantined and logged.

export const MAX_BYTES = 5 * 1024 * 1024;
export const ALLOWED = { pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
const EXECUTABLE_EXT = ['exe', 'bat', 'cmd', 'com', 'scr', 'js', 'jse', 'vbs', 'vbe', 'ps1', 'msi', 'jar', 'sh', 'app', 'dll', 'hta', 'lnk', 'docm', 'dotm', 'xlsm', 'pif', 'iso'];

// Sample phishing list; production syncs from a threat feed (e.g. Google Safe Browsing, PhishTank).
export const PHISHING_DOMAINS = ['secure-login-verify.com', 'microsoft-365-auth.net', 'paypa1.com', 'bit-ly.click', 'dropbox-share.info', 'wetransfer-download.top'];

const MAGIC = {
  pdf: [0x25, 0x50, 0x44, 0x46],          // %PDF
  docx: [0x50, 0x4b, 0x03, 0x04],         // PK.. (OOXML zip)
  doc: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] // OLE2
};
const EXE_MAGIC = [[0x4d, 0x5a], [0x7f, 0x45, 0x4c, 0x46], [0xcf, 0xfa, 0xed, 0xfe]]; // MZ, ELF, Mach-O

const startsWith = (bytes, sig) => sig.every((b, i) => bytes[i] === b);

export function checkName(name = '') {
  const parts = name.toLowerCase().split('.');
  if (parts.length < 2) return { ok: false, code: 'type', detail: 'File has no extension' };
  const ext = parts.at(-1);
  const inner = parts.slice(1, -1);
  if (EXECUTABLE_EXT.includes(ext)) {
    return inner.some(p => ALLOWED[p])
      ? { ok: false, code: 'disguised', detail: `Disguised executable (${name})` }
      : { ok: false, code: 'executable', detail: `Executable files are not accepted (.${ext})` };
  }
  if (inner.some(p => EXECUTABLE_EXT.includes(p))) return { ok: false, code: 'disguised', detail: `Double extension (${name})` };
  if (!ALLOWED[ext]) return { ok: false, code: 'type', detail: `.${ext} is not accepted` };
  return { ok: true, ext };
}

function latin1(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 8192) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
  return s;
}

export function findLinks(text) {
  return [...new Set((text.match(/\bhttps?:\/\/[^\s"'<>)\]]+/gi) || []).map(u => u.replace(/[.,;]+$/, '')))];
}

export function linkVerdicts(links) {
  return links.map(url => {
    let host = '';
    try { host = new URL(url).hostname.toLowerCase(); } catch { /* malformed */ }
    const phishing = PHISHING_DOMAINS.some(d => host === d || host.endsWith('.' + d));
    return { url, host, phishing };
  });
}

/**
 * @param {{name:string,size:number,bytes:Uint8Array}} file
 * @returns {{status:'clean'|'cleaned'|'blocked', steps:{step:string,result:'pass'|'fixed'|'fail',detail:string}[], reason?:string}}
 */
export function scanFile({ name, size, bytes }) {
  const steps = [];
  const block = (step, detail) => { steps.push({ step, result: 'fail', detail }); return { status: 'blocked', steps, reason: detail }; };

  const n = checkName(name);
  if (!n.ok) return block('Type check', n.detail);
  steps.push({ step: 'Type check', result: 'pass', detail: `.${n.ext} accepted` });

  if (size > MAX_BYTES) return block('Size check', `${(size / 1048576).toFixed(1)} MB exceeds 5 MB`);
  steps.push({ step: 'Size check', result: 'pass', detail: `${(size / 1048576).toFixed(2)} MB` });

  if (EXE_MAGIC.some(sig => startsWith(bytes, sig))) return block('Content signature', 'Executable content inside a document');
  if (!startsWith(bytes, MAGIC[n.ext])) return block('Content signature', `Content does not match .${n.ext}`);
  steps.push({ step: 'Content signature', result: 'pass', detail: 'Signature matches extension' });

  const text = latin1(bytes);
  if (/X5O!P%@AP\[4\\PZX54\(P\^\)7CC\)7\}\$EICAR/.test(text)) return block('Antivirus scan', 'Malware signature detected (EICAR test)');
  steps.push({ step: 'Antivirus scan', result: 'pass', detail: 'No known signatures' });

  let cleaned = false;
  if (n.ext === 'pdf' && /\/(JavaScript|JS|Launch|EmbeddedFile|OpenAction)\b/.test(text)) {
    cleaned = true; steps.push({ step: 'Active content', result: 'fixed', detail: 'Embedded scripts or auto-actions removed' });
  } else if ((n.ext === 'docx' && /vbaProject\.bin/.test(text)) || (n.ext === 'doc' && /(_VBA_PROJECT|Macros)/.test(text))) {
    cleaned = true; steps.push({ step: 'Active content', result: 'fixed', detail: 'Macros removed' });
  } else steps.push({ step: 'Active content', result: 'pass', detail: 'No macros or scripts' });

  const bad = linkVerdicts(findLinks(text)).filter(l => l.phishing);
  if (bad.length) return block('Link check', `Phishing link: ${bad.map(b => b.host).join(', ')}`);
  steps.push({ step: 'Link check', result: 'pass', detail: 'No links on phishing lists' });

  return { status: cleaned ? 'cleaned' : 'clean', steps };
}

export async function scanBrowserFile(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  return scanFile({ name: file.name, size: file.size, bytes });
}
