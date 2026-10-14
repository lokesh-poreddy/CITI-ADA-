import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cacheCatalogue, createQueuedAction, flushActionQueue, getCachedCatalogue, getLocalActions, getQueuedActions, saveLocalLearnerProfile, getLocalLearnerProfile, clearLocalLearnerProfile } from './offlinePocket.js';

describe('offline opportunity pocket', () => {
  it('stores only structured learner journey choices and can clear them', async () => {
    await clearLocalLearnerProfile();
    await saveLocalLearnerProfile({ academicStage: 'undergraduate', preferredLanguage: 'ta', state: 'Tamil Nadu', interests: ['nature', 'nature', 'science'], strengths: ['practical'], goals: ['skillCertificate'], allowDemoProcessing: true, selectedPathwayId: 'green-agri-enterprise', phone: 'must-not-be-stored' });
    const saved = await getLocalLearnerProfile();
    expect(saved.profile.interests).toEqual(['nature', 'science']);
    expect(saved.profile.selectedPathwayId).toBe('green-agri-enterprise');
    expect(saved.profile.phone).toBeUndefined();
    expect(saved.profile.allowDemoProcessing).toBe(false); // re-confirm service processing on every visit
    expect(['INDEXEDDB', 'MEMORY_SESSION']).toContain(saved.storageMode);
    await clearLocalLearnerProfile();
    expect(await getLocalLearnerProfile()).toBeNull();
  });


  it('preserves Telugu as the preferred UI locale in the local learner pocket', async () => {
    await clearLocalLearnerProfile();
    await saveLocalLearnerProfile({ academicStage: 'undergraduate', preferredLanguage: 'te', interests: ['technology'], goals: ['higherStudy'], allowDemoProcessing: true });
    const saved = await getLocalLearnerProfile();
    expect(saved.profile.preferredLanguage).toBe('te');
    expect(saved.profile.allowDemoProcessing).toBe(false);
    await clearLocalLearnerProfile();
  });

  it('caches only the catalogue record supplied by the caller', async () => {
    const record = { id: `cache-${Date.now()}`, title: 'Sample course', sourceUrl: 'https://swayam.gov.in/search_courses' };
    await cacheCatalogue([record]);
    const cached = await getCachedCatalogue();
    expect(cached.some((item) => item.id === record.id)).toBe(true);
  });

  it('retains action events while offline and marks them synced only after success', async () => {
    const action = await createQueuedAction({ opportunityId: `offline-${Date.now()}`, status: 'SAVED' });
    expect(action.syncStatus).toBe('PENDING');
    const offline = await flushActionQueue({ postAction: vi.fn(), isOnline: false });
    expect(offline.pending).toBeGreaterThanOrEqual(1);

    const syncActions = vi.fn().mockResolvedValue([{ syncStatus: 'SYNCED' }]);
    const result = await flushActionQueue({ syncActions, isOnline: true });
    expect(syncActions).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ clientEventId: action.clientEventId, status: 'SAVED' })]));
    expect(result.synced).toBeGreaterThanOrEqual(1);
    expect((await getQueuedActions()).some((entry) => entry.clientEventId === action.clientEventId)).toBe(false);
    expect((await getLocalActions()).find((entry) => entry.opportunityId === action.opportunityId).syncStatus).toBe('SYNCED');
  });

  it('keeps failed sync attempts in the queue for retry', async () => {
    const action = await createQueuedAction({ opportunityId: `retry-${Date.now()}`, status: 'INTERESTED' });
    const result = await flushActionQueue({ postAction: vi.fn().mockRejectedValue(new Error('offline')), isOnline: true });
    expect(result.pending).toBeGreaterThanOrEqual(1);
    expect((await getQueuedActions()).some((entry) => entry.clientEventId === action.clientEventId)).toBe(true);
  });
});
