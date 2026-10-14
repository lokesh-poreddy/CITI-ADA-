import { PLATFORM_API_BASE } from './opportunities.js';

async function reviewRequest(path, token, options = {}) {
  const response = await fetch(`${PLATFORM_API_BASE}${path}`, {
    ...options,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-Reviewer-Token': token, ...(options.headers || {}) },
    signal: AbortSignal.timeout(7000), cache: 'no-store',
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || `Review request failed (${response.status})`);
  return body;
}

export function previewOpportunityImport(token, records) {
  return reviewRequest('/opportunity-ingestion/preview', token, { method: 'POST', body: JSON.stringify({ records }) });
}
export function fetchReviewQueue(token, status = 'PENDING') {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return reviewRequest(`/opportunity-ingestion/review-queue${query}`, token);
}
export function submitReviewDecision(token, reviewId, approved, note) {
  return reviewRequest(`/opportunity-ingestion/review-queue/${encodeURIComponent(reviewId)}/decision`, token, {
    method: 'POST', body: JSON.stringify({ approved, note }),
  });
}
