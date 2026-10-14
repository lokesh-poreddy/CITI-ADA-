# Phase 16 — Offline learner pocket

## Objective
Cache public source-linked listings and minimal action status locally without caching authenticated API traffic.

## Current implementation paths
frontend/src/offline/offlinePocket.js
- frontend/src/opportunities/OpportunityCentre.jsx
- frontend/public/sw.js
- frontend/src/offline/offlinePocket.test.js
- docs/OFFLINE_SYNC_CONTRACT.md

## API / interaction boundary
Browser IndexedDB storage; no new public API route.

## Safety and design guardrails
Service worker does not cache /api/**. IndexedDB stores public catalogue and action statuses, not profile/documents/income. Browser eviction and local access risks remain.

## Feature owner
Offline/PWA owner; test with throttled/interrupted network and mobile storage unavailable.

## Exit criteria
After one online visit, public listings and locally saved actions remain visible offline; new checks require connectivity.

## Team collaboration
The vertical owner must test the visible user flow, API/domain behavior, empty/error/loading states, responsiveness, accessibility, source provenance where applicable, and the integrated end-to-end journey. Changes should extend the existing repository; do not create a separate app for this phase.
