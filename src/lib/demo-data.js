// Shared demo/seed records for the consultant portal, client WhatsApp access and CMS.
// Each function seeds its collection in the shared store the first time any app reads it,
// so whichever app loads first (portal, client access or CMS) sees the same starting state.
import { seedOnce } from './store.js';

function iso(daysAgo) { const d = new Date(); d.setDate(d.getDate() + daysAgo); return d.toISOString(); }

export const seedConsultants = () => seedOnce('consultants', () => [
  { id: 'c1', name: 'Amara Diallo', practice: 'Technology' },
  { id: 'c2', name: 'Grace Nakato', practice: 'Management' },
  { id: 'c3', name: 'Idrissa Ouédraogo', practice: 'Consulting' },
  { id: 'c4', name: 'Kofi Mensah', practice: 'Management' }
]);

export const seedClients = () => seedOnce('clients', () => [
  { id: 'cl1', name: 'Ministry of Planning (demo)', contact: 'Director of Planning', phone: '+256700000001' },
  { id: 'cl2', name: 'Regional Development Bank (demo)', contact: 'Programme Manager', phone: '+254700000002' },
  { id: 'cl3', name: 'Northern NGO Alliance (demo)', contact: 'Head of M&E', phone: '+226700000003' }
]);

export const seedProjects = () => seedOnce('projects', () => [
  { id: 'p1', name: 'Connectivity condition assessment', country: 'Kenya · Uganda · Malawi', practice: 'Technology', progress: 72, status: 'active', clientId: 'cl2', consultantIds: ['c1'] },
  { id: 'p2', name: 'Public financial management reform', country: 'Burkina Faso', practice: 'Management', progress: 45, status: 'active', clientId: 'cl1', consultantIds: ['c2', 'c4'] },
  { id: 'p3', name: 'Programme evaluation, results-based management', country: 'Uganda', practice: 'Consulting', progress: 90, status: 'active', clientId: 'cl3', consultantIds: ['c3'] },
  { id: 'p4', name: 'Institutional capacity diagnostic', country: 'Nigeria', practice: 'Management', progress: 20, status: 'active', clientId: 'cl1', consultantIds: ['c2'] }
]);

export const seedDeliverables = () => seedOnce('deliverables', () => [
  { id: 'd1', projectId: 'p1', clientId: 'cl2', name: 'Draft connectivity assessment report', status: 'approved', history: [{ at: iso(-9), event: 'Uploaded and security-scanned' }, { at: iso(-6), event: 'Sent to client via WhatsApp' }, { at: iso(-4), event: 'Approved by client' }] },
  { id: 'd2', projectId: 'p2', clientId: 'cl1', name: 'PFM diagnostic — findings deck', status: 'awaiting', history: [{ at: iso(-3), event: 'Uploaded and security-scanned' }, { at: iso(-2), event: 'Sent to client via WhatsApp' }] },
  { id: 'd3', projectId: 'p3', clientId: 'cl3', name: 'Evaluation inception report', status: 'draft', history: [{ at: iso(-1), event: 'Uploaded and security-scanned' }] }
]);

export const seedTimesheets = () => seedOnce('timesheets', () => []);

export const seedSecurity = () => seedOnce('security', () => [
  { at: iso(-9), type: 'sign-in', who: 'amara.diallo@cerfodesgroup.com', item: '—', result: 'pass', detail: 'Microsoft 365 SSO + 2FA, known device' },
  { at: iso(-5), type: 'upload', who: 'grace.nakato@cerfodesgroup.com', item: 'invoice_final.pdf.exe', result: 'blocked', detail: 'Disguised executable (invoice_final.pdf.exe)' },
  { at: iso(-2), type: 'sign-in', who: 'kofi.mensah@cerfodesgroup.com', item: '—', result: 'new-device', detail: 'New-device check passed, verified with 2FA' }
]);

/** WhatsApp threads keyed by deliverable id: [{from:'cerfodes'|'client', text, doc?, at, kind}]. */
export const seedWhatsapp = () => seedOnce('whatsapp', () => {
  const d2 = seedDeliverables().find(d => d.id === 'd2');
  return { d2: { deliverableId: 'd2', clientId: d2.clientId, messages: [{ from: 'cerfodes', text: 'A new deliverable is ready for your review: “PFM diagnostic — findings deck”.', doc: d2.name, at: iso(-2), kind: 'request' }] } };
});
