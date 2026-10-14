import { afterEach, describe, expect, it, vi } from 'vitest';
import { createLearnerProfile } from './learnerJourney.js';

afterEach(() => { vi.restoreAllMocks(); });

describe('learner demo-service boundary', () => {
  it('does not call the API without explicit processing opt-in', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await expect(createLearnerProfile({ allowDemoProcessing: false })).rejects.toThrow(/not enabled/i);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('sends only the minimal structured matching fields when opted in', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, status: 201, json: vi.fn().mockResolvedValue({ learnerId: 'learner-00000000-0000-0000-0000-000000000000' }) });
    await createLearnerProfile({ academicStage: 'undergraduate', preferredLanguage: 'ta', state: 'tamil-nadu', interests: ['nature'], strengths: ['practical'], goals: ['skillCertificate'], allowDemoProcessing: true });
    const [, request] = fetchSpy.mock.calls[0];
    const body = JSON.parse(request.body);
    expect(body).toEqual({ academicStage: 'undergraduate', preferredLanguage: 'ta', interests: ['nature'], strengths: ['practical'], goals: ['skillCertificate'], allowDemoProcessing: true });
    expect(body).not.toHaveProperty('state');
    expect(body).not.toHaveProperty('phone');
    expect(body).not.toHaveProperty('email');
  });
});
