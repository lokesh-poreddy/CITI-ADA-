# Phase 21 — Apprenticeship, internship and employer listings

## Objective
Partner listing drafts, submission for review, filtering and public browsing of approved or explicitly illustrative entries.

## End-to-end owner responsibilities
- Define the learner/facilitator/partner interaction and its privacy constraints.
- Implement the UI, versioned API, domain validation, error states and documentation.
- Add tests for happy path, invalid input and permission boundary assumptions.
- Demonstrate the capability inside the integrated UdaanSetu application.

## Acceptance criteria
New listings remain unpublished until a reviewer approves; application and source URLs must be HTTPS. Seed listings are marked illustrative, not live vacancies.

## Files in this increment
- `backend/src/main/java/in/udaansetu/platform/listings/PartnerListingDtos.java`
- `backend/src/main/java/in/udaansetu/platform/listings/PartnerListingService.java`
- `backend/src/main/java/in/udaansetu/platform/listings/PartnerListingController.java`
- `frontend/src/partners/PartnerWorkspace.jsx`

## Prototype boundary
This slice uses the repository's current in-memory stores and demo actor headers. Those are suitable for local development only. Before public deployment, replace them with durable storage, authenticated identity and server-enforced role/object authorization; review applicable child-safety and privacy requirements.
