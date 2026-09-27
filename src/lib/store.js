// Shared localStorage-backed store for the CERFODES prototype.
// The public website, consultant portal, client access and CMS all run on the same origin,
// so a write made in one surface (a client's WhatsApp approval, a lead landing in the inbox)
// is immediately visible in another (the consultant's deliverable list, the CMS leads inbox)
// through this single 'cerfodes.' namespace. In production each surface would instead call a
// shared API; here the namespace itself stands in for that contract.
export const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('cerfodes.' + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('cerfodes.' + k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  push(k, v) { const a = store.get(k, []); a.unshift(v); store.set(k, a.slice(0, 200)); },
  update(k, id, patch) {
    const a = store.get(k, []);
    const i = a.findIndex(x => x.id === id);
    if (i > -1) { a[i] = { ...a[i], ...(typeof patch === 'function' ? patch(a[i]) : patch) }; store.set(k, a); }
    return a;
  }
};

/** Privacy-friendly analytics stub: events only fire after consent. */
export function track(name, data = {}) {
  if (store.get('consent') !== 'yes') return;
  store.push('events', { name, data, at: new Date().toISOString(), path: location.pathname });
}

/** Seeds a collection the first time a surface reads it, so each app has believable demo data. */
export function seedOnce(key, factory) {
  const existing = store.get(key, null);
  if (existing !== null) return existing;
  const seeded = factory();
  store.set(key, seeded);
  return seeded;
}
