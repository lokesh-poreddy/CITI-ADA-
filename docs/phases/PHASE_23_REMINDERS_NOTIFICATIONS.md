# Phase 23 — Reminders and notifications

## Objective
Scheduled in-app reminders, acknowledgement and delivery preferences with explicit provider boundaries.

## End-to-end owner responsibilities
- Define the learner/facilitator/partner interaction and its privacy constraints.
- Implement the UI, versioned API, domain validation, error states and documentation.
- Add tests for happy path, invalid input and permission boundary assumptions.
- Demonstrate the capability inside the integrated UdaanSetu application.

## Acceptance criteria
A reminder can be scheduled/listed/acknowledged; due reminders become READY on read. Email/SMS remain preferences only until a provider is approved and configured.

## Files in this increment
- `backend/src/main/java/in/udaansetu/platform/notifications/NotificationDtos.java`
- `backend/src/main/java/in/udaansetu/platform/notifications/NotificationService.java`
- `backend/src/main/java/in/udaansetu/platform/notifications/NotificationController.java`
- `frontend/src/partners/PartnerWorkspace.jsx`

## Prototype boundary
This slice uses the repository's current in-memory stores and demo actor headers. Those are suitable for local development only. Before public deployment, replace them with durable storage, authenticated identity and server-enforced role/object authorization; review applicable child-safety and privacy requirements.
