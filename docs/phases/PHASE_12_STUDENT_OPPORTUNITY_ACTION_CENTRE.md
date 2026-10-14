# Phase 12 — Student opportunity action centre

## Objective
Allow the learner to save, show interest, start application, mark applied/completed, and view saved actions.

## Current implementation paths
backend/src/main/java/in/udaansetu/platform/actions/ActionStatus.java
- ActionWriteRequest.java
- ActionSyncRequest.java
- StudentOpportunityAction.java
- StudentActionService.java
- StudentActionController.java
- frontend/src/offline/offlinePocket.js
- frontend/src/api/opportunities.js
- frontend/src/opportunities/OpportunityCentre.jsx

## API / interaction boundary
GET /api/v1/student/opportunity-actions; POST /api/v1/student/opportunity-actions; POST /api/v1/student/opportunity-actions/sync

## Safety and design guardrails
Prototype uses anonymous local learner key and no free-text notes. Client event IDs make retries idempotent within the current in-memory store.

## Feature owner
Action centre owner responsible for UX, action status semantics, idempotency and tests.

## Exit criteria
User can save or update an action locally, view it in Saved Items, and sync it to the Java API when online.

## Team collaboration
The vertical owner must test the visible user flow, API/domain behavior, empty/error/loading states, responsiveness, accessibility, source provenance where applicable, and the integrated end-to-end journey. Changes should extend the existing repository; do not create a separate app for this phase.
