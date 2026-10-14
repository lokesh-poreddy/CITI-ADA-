# Phase 17 — Synchronization and conflict recovery

## Objective
Batch queued actions over weak networks, preserve failures, replay in creation order and use stable event IDs.

## Current implementation paths
frontend/src/offline/offlinePocket.js
- frontend/src/api/opportunities.js
- backend/src/main/java/in/udaansetu/platform/actions/ActionSyncRequest.java
- StudentActionService.java
- StudentActionController.java
- frontend/src/offline/offlinePocket.test.js
- docs/OFFLINE_SYNC_CONTRACT.md

## API / interaction boundary
POST /api/v1/student/opportunity-actions/sync

## Safety and design guardrails
Current conflict contract is ordered idempotent replay for one anonymous local learner key. Strong multi-device merge/versioning and durable server receipts are out of scope.

## Feature owner
Sync owner owns retry/failure visibility, idempotency and load tests.

## Exit criteria
Network failure leaves queue intact; successful batch drains queue; retry does not duplicate an event; records remain sorted by creation time.

## Team collaboration
The vertical owner must test the visible user flow, API/domain behavior, empty/error/loading states, responsiveness, accessibility, source provenance where applicable, and the integrated end-to-end journey. Changes should extend the existing repository; do not create a separate app for this phase.
