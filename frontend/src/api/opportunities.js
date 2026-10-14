import { getLocalLearnerKey } from '../offline/offlinePocket.js';

const DEFAULT_BASE = 'http://localhost:8080/api/v1';
export const PLATFORM_API_BASE = (import.meta.env.VITE_PLATFORM_API_BASE_URL || DEFAULT_BASE).replace(/\/$/, '');
export const AI_API_BASE = (import.meta.env.VITE_AI_SERVICE_BASE_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) },
    signal: options.signal || AbortSignal.timeout(5000),
    cache: 'no-store',
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || `Request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

export async function fetchOpportunities({ query = '', type = 'ALL', language = 'en', page = 0, size = 50, signal } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size), language });
  if (query.trim()) params.set('q', query.trim());
  if (type && type !== 'ALL') params.set('type', type);
  return requestJson(`${PLATFORM_API_BASE}/opportunities?${params}`, { signal });
}

export async function fetchOpportunityDetail(id) {
  return requestJson(`${PLATFORM_API_BASE}/opportunities/${encodeURIComponent(id)}`);
}

export async function requestEligibilityCheck(id, answers = {}) {
  // Only fields explicitly entered for this check are sent. The prototype API does not persist them.
  return requestJson(`${PLATFORM_API_BASE}/opportunities/${encodeURIComponent(id)}/eligibility-check`, {
    method: 'POST', body: JSON.stringify(answers),
  });
}

export async function postOpportunityAction(action) {
  return requestJson(`${PLATFORM_API_BASE}/student/opportunity-actions`, {
    method: 'POST',
    headers: { 'X-Learner-Key': getLocalLearnerKey() },
    body: JSON.stringify(action),
  });
}

export async function fetchOpportunityActions() {
  return requestJson(`${PLATFORM_API_BASE}/student/opportunity-actions`, {
    headers: { 'X-Learner-Key': getLocalLearnerKey() },
  });
}

export async function syncOpportunityActions(actions) {
  if (!actions?.length) return [];
  return requestJson(`${PLATFORM_API_BASE}/student/opportunity-actions/sync`, {
    method: 'POST',
    headers: { 'X-Learner-Key': getLocalLearnerKey() },
    body: JSON.stringify({ actions: actions.map(({ clientEventId, opportunityId, status }) => ({ clientEventId, opportunityId, status })) }),
  });
}

export async function askGroundedAssistant(question, language, records) {
  return requestJson(`${AI_API_BASE}/assistant/grounded-answer`, {
    method: 'POST',
    body: JSON.stringify({
      question: question.trim(), language,
      records: records.slice(0, 50).map((record) => ({
        id: record.id, title: record.title, summary: record.summary || '',
        sourceName: record.sourceName || record.provider || 'Source not provided',
        sourceUrl: record.sourceUrl, sourceTrust: record.sourceTrust || 'UNKNOWN',
        lastVerifiedAt: record.lastVerifiedAt || null, type: record.type || null,
        deadline: record.deadline || null,
      })),
    }),
  });
}
