import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ImpactTrustConsole from './ImpactTrustConsole.jsx';

afterEach(() => vi.unstubAllGlobals());

function reply(body, status = 200) {
  return Promise.resolve({ ok: status >= 200 && status < 300, status, json: async () => body });
}

describe('ImpactTrustConsole', () => {
  it('shows the prototype boundary and only enables a test event after analytics consent', async () => {
    const fetchMock = vi.fn((url, options = {}) => {
      if (String(url).endsWith('/privacy/notice')) return reply({ policyVersion: '2026-10-14-v1', prototypeLimitations: ['In-memory only'] });
      if (String(url).endsWith('/release/status')) return reply({ releaseStage: 'HACKATHON_PROTOTYPE', productionReady: false, persistenceMode: 'IN_MEMORY_FOR_SOME_FEATURES', disabledExternalCapabilities: ['Payments'], releaseGates: ['Configure real identity.'] });
      if (String(url).endsWith('/privacy/consents') && (!options.method || options.method === 'GET')) return reply([]);
      if (String(url).endsWith('/privacy/data-rights-requests')) return reply([]);
      if (String(url).endsWith('/privacy/consents') && options.method === 'PUT') return reply({ scope: JSON.parse(options.body).scope, granted: JSON.parse(options.body).granted });
      if (String(url).endsWith('/analytics/events')) return reply({ accepted: true, aggregateOnly: true }, 202);
      return reply({}, 404);
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<ImpactTrustConsole language="en" />);

    expect(await screen.findByRole('heading', { name: 'Impact & Trust Centre' })).toBeTruthy();
    expect(await screen.findByText('Not production-ready')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Send test event/i }).disabled).toBe(true);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save choice' }).disabled).toBe(false));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Optional aggregate analytics' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save choice' }));
    await waitFor(() => expect(screen.getByRole('button', { name: /Send test event/i }).disabled).toBe(false));
    fireEvent.click(screen.getByRole('button', { name: /Send test event/i }));
    expect(await screen.findByText('Aggregate test event accepted.')).toBeTruthy();
    expect(fetchMock.mock.calls.some(([url]) => String(url).endsWith('/analytics/events'))).toBe(true);
  });
});
