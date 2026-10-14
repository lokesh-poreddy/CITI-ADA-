import { describe, expect, it, vi } from 'vitest';
import { checkService } from './health.js';

describe('checkService', () => {
  it('marks a healthy service as online', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'UP', service: 'test-api' }),
    });
    await expect(checkService('http://localhost:8080/api/v1', { fetchImpl }))
      .resolves.toMatchObject({ state: 'online', service: 'test-api' });
  });

  it('reports an unavailable service without throwing into the UI', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network unavailable'));
    await expect(checkService('http://localhost:8080/api/v1', { fetchImpl }))
      .resolves.toMatchObject({ state: 'offline', label: 'Not reachable' });
  });

  it('does not claim a non-2xx response is healthy', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 503 });
    await expect(checkService('http://localhost:8080/api/v1', { fetchImpl }))
      .resolves.toMatchObject({ state: 'degraded', statusCode: 503 });
  });
});
