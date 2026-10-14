# Offline Pocket & Synchronization Contract

## Cached offline data

The browser stores source-linked public catalogue records in IndexedDB and a minimal local action state. It does not store student profiles, application documents, income fields, secrets or credentials. Browsers may evict local storage; it is not a backup or secure vault.

## Action event

```json
{
  "clientEventId": "stable-event-id",
  "opportunityId": "swayam-course-explorer",
  "status": "SAVED",
  "createdAt": "2026-10-14T08:30:00.000Z",
  "updatedAt": "2026-10-14T08:30:00.000Z",
  "syncStatus": "PENDING"
}
```

`clientEventId` is stable across retries and is used by the prototype server for idempotency. Events are sorted by creation time and sent in a batch to reduce connection overhead. Successful batches are marked `SYNCED`; failed batches remain queued. An `online` event triggers a retry. A future implementation should add periodic manual sync, visible per-event retry errors, backoff, tombstones for removals and persistent server-side event receipts.

## Conflict policy in this phase

This prototype provides ordered, idempotent batch replay for one anonymous local learner key. It does not provide strong multi-device conflict resolution, server revisions, concurrent edit merging, durable receipts or account recovery. The in-memory backend loses event receipts on restart. Do not describe this as production-grade conflict handling.

## Network/data saver design

- Do not cache `/api/**` responses in the service worker.
- The UI caches only the bounded public catalogue returned by the API.
- The data saver option requests fewer catalogue entries.
- Save/interest actions are queued locally; no network is required for local confirmation.
- New source lookup, eligibility evaluation and assistant lookup require connectivity unless the relevant data has already been cached.
- Voice recognition and voice synthesis are browser/device capabilities; offline use is not guaranteed.

## Acceptance test

1. Load the catalogue online and confirm records appear with source links.
2. Turn the network off; reload the saved public catalogue and save an item.
3. Confirm the item displays a pending-sync state.
4. Restore the network; verify one batch is posted and the queue drains.
5. Retry the same event and verify it does not create a duplicate action.
6. Force an API failure and verify the queue is retained.
