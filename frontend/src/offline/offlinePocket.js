/**
 * Local opportunity pocket. It stores public catalogue entries and minimal action
 * status only, not student profiles, documents, income, caste/category, or credentials.
 * Browser storage is a convenience, not secure storage and not an authentication layer.
 */
const DB_NAME = 'udaan-setu-pocket-v2';
const DB_VERSION = 2;
const STORE_CATALOGUE = 'catalogue';
const STORE_ACTIONS = 'actions';
const STORE_QUEUE = 'actionQueue';
const STORE_LEARNER = 'learnerProfile';
const memory = { catalogue: new Map(), actions: new Map(), actionQueue: new Map(), learnerProfile: new Map() };
let dbPromise;

function openDb() {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      let request;
      try { request = indexedDB.open(DB_NAME, DB_VERSION); } catch { resolve(null); return; }
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_CATALOGUE)) db.createObjectStore(STORE_CATALOGUE, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORE_ACTIONS)) db.createObjectStore(STORE_ACTIONS, { keyPath: 'opportunityId' });
        if (!db.objectStoreNames.contains(STORE_QUEUE)) db.createObjectStore(STORE_QUEUE, { keyPath: 'clientEventId' });
        if (!db.objectStoreNames.contains(STORE_LEARNER)) db.createObjectStore(STORE_LEARNER, { keyPath: 'key' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => { dbPromise = null; resolve(null); };
      request.onblocked = () => { dbPromise = null; resolve(null); };
    });
  }
  return dbPromise;
}

async function getAll(storeName) {
  const db = await openDb();
  if (!db) return [...memory[storeName].values()];
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const request = transaction.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error || new Error('Local read failed'));
  });
}

async function getOne(storeName, key) {
  const db = await openDb();
  if (!db) return memory[storeName].get(key) || null;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const request = transaction.objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error || new Error('Local read failed'));
  });
}

async function put(storeName, key, value) {
  const db = await openDb();
  if (!db) { memory[storeName].set(key, value); return value; }
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).put(value);
    transaction.oncomplete = () => resolve(value);
    transaction.onerror = () => reject(transaction.error || new Error('Local write failed'));
  });
}

async function remove(storeName, key) {
  const db = await openDb();
  if (!db) { memory[storeName].delete(key); return; }
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Local delete failed'));
  });
}

export function getLocalLearnerKey() {
  const keyName = 'udaan-setu-anonymous-demo-key';
  try {
    let value = localStorage.getItem(keyName);
    if (!value) {
      const random = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      value = `anon-${random.replace(/[^A-Za-z0-9_-]/g, '')}`;
      localStorage.setItem(keyName, value);
    }
    return value;
  } catch {
    return `anon-${Math.random().toString(36).slice(2)}-${Date.now()}`;
  }
}

export async function cacheCatalogue(records) {
  for (const record of records || []) {
    if (record?.id) await put(STORE_CATALOGUE, record.id, { ...record, cachedAt: new Date().toISOString() });
  }
}

export async function getCachedCatalogue() {
  return getAll(STORE_CATALOGUE);
}

export async function createQueuedAction({ opportunityId, status }) {
  const now = new Date().toISOString();
  const action = {
    clientEventId: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    opportunityId, status, createdAt: now, updatedAt: now, syncStatus: 'PENDING',
  };
  await put(STORE_ACTIONS, opportunityId, action);
  await put(STORE_QUEUE, action.clientEventId, action);
  return action;
}

export async function getLocalActions() {
  return (await getAll(STORE_ACTIONS)).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

export async function getQueuedActions() {
  return (await getAll(STORE_QUEUE)).sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

export async function flushActionQueue({ postAction, syncActions, isOnline = typeof navigator === 'undefined' || navigator.onLine } = {}) {
  if (!isOnline) return { synced: 0, pending: (await getQueuedActions()).length };
  const queue = await getQueuedActions();
  if (!queue.length) return { synced: 0, pending: 0 };

  if (typeof syncActions === 'function') {
    try {
      // One compact request is preferable to a burst of requests on weak networks.
      await syncActions(queue);
      for (const action of queue) {
        await put(STORE_ACTIONS, action.opportunityId, { ...action, syncStatus: 'SYNCED', updatedAt: new Date().toISOString() });
        await remove(STORE_QUEUE, action.clientEventId);
      }
      return { synced: queue.length, pending: (await getQueuedActions()).length };
    } catch {
      // Preserve all queued events if batch sync fails; do not silently drop local work.
      return { synced: 0, pending: (await getQueuedActions()).length };
    }
  }

  if (typeof postAction !== 'function') return { synced: 0, pending: queue.length };
  let synced = 0;
  for (const action of queue) {
    try {
      await postAction({ clientEventId: action.clientEventId, opportunityId: action.opportunityId, status: action.status });
      await put(STORE_ACTIONS, action.opportunityId, { ...action, syncStatus: 'SYNCED', updatedAt: new Date().toISOString() });
      await remove(STORE_QUEUE, action.clientEventId);
      synced += 1;
    } catch {
      // Keep failed actions queued for the next explicit or online-triggered retry.
    }
  }
  return { synced, pending: (await getQueuedActions()).length };
}


/**
 * Store only the low-risk, structured learner selections needed to resume the journey.
 * This is local convenience storage, not a secure account or an acceptable store for
 * names, phone numbers, documents, caste/category, income, credentials or exact addresses.
 */
export async function saveLocalLearnerProfile(profile) {
  const db = await openDb();
  const storageMode = db ? 'INDEXEDDB' : 'MEMORY_SESSION';
  const entry = {
    key: 'current',
    schemaVersion: 1,
    storageMode,
    profile: {
      academicStage: profile?.academicStage || 'std9_10',
      preferredLanguage: ['en', 'hi', 'ta', 'te'].includes(profile?.preferredLanguage) ? profile.preferredLanguage : 'en',
      state: typeof profile?.state === 'string' ? profile.state.slice(0, 80) : '',
      interests: [...new Set(Array.isArray(profile?.interests) ? profile.interests.filter((x) => typeof x === 'string').slice(0, 10) : [])],
      strengths: [...new Set(Array.isArray(profile?.strengths) ? profile.strengths.filter((x) => typeof x === 'string').slice(0, 8) : [])],
      goals: [...new Set(Array.isArray(profile?.goals) ? profile.goals.filter((x) => typeof x === 'string').slice(0, 5) : [])],
      // Service-processing opt-in is deliberately never persisted. It must be checked again
      // after a reload/new visit because this browser store is not a consent-management system.
      allowDemoProcessing: false,
      selectedPathwayId: typeof profile?.selectedPathwayId === 'string' && /^[a-z0-9-]{3,60}$/.test(profile.selectedPathwayId) ? profile.selectedPathwayId : '',
    },
    updatedAt: new Date().toISOString(),
  };
  await put(STORE_LEARNER, entry.key, entry);
  return entry;
}

export async function getLocalLearnerProfile() {
  const value = await getOne(STORE_LEARNER, 'current');
  if (!value || value.schemaVersion !== 1 || !value.profile) return null;
  return value;
}

export async function clearLocalLearnerProfile() {
  // Always clear the fallback cache even if a browser database transaction fails.
  memory.learnerProfile.delete('current');
  await remove(STORE_LEARNER, 'current');
  return true;
}
