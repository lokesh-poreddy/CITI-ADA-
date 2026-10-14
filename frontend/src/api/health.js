const DEFAULT_PLATFORM_BASE = 'http://localhost:8080/api/v1';
const DEFAULT_AI_BASE = 'http://localhost:8000/api/v1';

export const SERVICE_ENDPOINTS = {
  platform: import.meta.env.VITE_PLATFORM_API_BASE_URL || DEFAULT_PLATFORM_BASE,
  ai: import.meta.env.VITE_AI_SERVICE_BASE_URL || DEFAULT_AI_BASE,
};

/**
 * Requests service health with a strict timeout. A failure becomes an explicit
 * status object so a temporary outage never breaks the landing page.
 */
export async function checkService(baseUrl, { fetchImpl = fetch, timeoutMs = 2500 } = {}) {
  try {
    const response = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
      cache: 'no-store',
    });

    if (!response.ok) {
      return { state: 'degraded', label: 'Needs attention', statusCode: response.status };
    }

    const payload = await response.json();
    return payload?.status === 'UP'
      ? { state: 'online', label: 'Connected', service: payload.service ?? 'service' }
      : { state: 'degraded', label: 'Needs attention' };
  } catch {
    return { state: 'offline', label: 'Not reachable' };
  }
}

export async function checkAllServices(options) {
  const [platform, ai] = await Promise.all([
    checkService(SERVICE_ENDPOINTS.platform, options),
    checkService(SERVICE_ENDPOINTS.ai, options),
  ]);
  return { platform, ai, checkedAt: new Date().toISOString() };
}
