# Phase 18 — Facilitator workspace

## Objective
Cohorts, learner links with consent state, and next-step referrals.

## End-to-end owner responsibilities
- Define the learner/facilitator/partner interaction and its privacy constraints.
- Implement the UI, versioned API, domain validation, error states and documentation.
- Add tests for happy path, invalid input and permission boundary assumptions.
- Demonstrate the capability inside the integrated UdaanSetu application.

## Acceptance criteria
A facilitator can create a cohort, add a learner only when consent is recorded, and record a referral only for a linked learner.

## Files in this increment
- `backend/src/main/java/in/udaansetu/platform/facilitator/FacilitatorDtos.java`
- `backend/src/main/java/in/udaansetu/platform/facilitator/FacilitatorWorkspaceService.java`
- `backend/src/main/java/in/udaansetu/platform/facilitator/FacilitatorWorkspaceController.java`
- `frontend/src/partners/PartnerWorkspace.jsx`

## Prototype boundary
This slice uses the repository's current in-memory stores and demo actor headers. Those are suitable for local development only. Before public deployment, replace them with durable storage, authenticated identity and server-enforced role/object authorization; review applicable child-safety and privacy requirements.
