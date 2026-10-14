import { PLATFORM_API_BASE } from './opportunities.js';

async function requestJson(url, options = {}) {
  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(new Error('Request timed out')), options.timeoutMs ?? 4500);
  try {
    const response = await fetch(url, {
      ...options,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) },
      signal: options.signal || controller.signal,
      cache: 'no-store',
    });
    const body = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || `Learner journey request failed (${response.status})`);
    return body;
  } finally {
    globalThis.clearTimeout(timer);
  }
}

/** The request is only called after the user explicitly enables demo-service processing. */
export async function createLearnerProfile(profile) {
  if (profile?.allowDemoProcessing !== true) {
    throw new Error('Demo-service processing was not enabled. Use local matching instead.');
  }
  return requestJson(`${PLATFORM_API_BASE}/learners/profiles`, {
    method: 'POST',
    body: JSON.stringify({
      academicStage: profile.academicStage,
      preferredLanguage: profile.preferredLanguage,
      // Broad region stays on-device until an explicitly justified regional feature exists.
      interests: profile.interests || [],
      strengths: profile.strengths || [],
      goals: profile.goals || [],
      allowDemoProcessing: true,
    }),
  });
}

export function fetchCareerRecommendations(learnerId) {
  return requestJson(`${PLATFORM_API_BASE}/career-pathways/recommendations`, {
    method: 'POST', body: JSON.stringify({ learnerId }),
  });
}

export function fetchLearningPathway(pathwayId) {
  return requestJson(`${PLATFORM_API_BASE}/learning-pathways/${encodeURIComponent(pathwayId)}`);
}


/** Best-effort deletion for a temporary profile created in this browser session. */
export function deleteLearnerProfile(learnerId) {
  if (!/^learner-[0-9a-fA-F-]{36}$/.test(String(learnerId || ''))) return Promise.resolve(false);
  return requestJson(`${PLATFORM_API_BASE}/learners/profiles/${encodeURIComponent(learnerId)}`, { method: 'DELETE' })
    .then(() => true)
    .catch(() => false);
}
