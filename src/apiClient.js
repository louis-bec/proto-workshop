// Simple fetch helper that safely parses JSON or falls back to text.
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...options });
  const ct = res.headers.get('content-type') || '';
  let data;
  if (ct.includes('application/json')) {
    try { data = await res.json(); } catch (e) { data = null; }
  } else {
    // Fallback to text (e.g., HTML error page or plain text)
    const text = await res.text();
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
  }
  if (!res.ok) {
    const msg = data?.error || data?.message || (typeof data?.raw === 'string' ? truncate(data.raw) : `Request failed (${res.status})`);
    throw new Error(msg);
  }
  return data;
}

function truncate(str, len = 120) {
  if (!str) return str;
  return str.length > len ? str.slice(0, len) + '…' : str;
}
