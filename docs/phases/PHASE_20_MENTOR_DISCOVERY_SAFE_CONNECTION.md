# Phase 20 — Mentor discovery and safe connection

## Objective
Discover verified profiles and request facilitator-mediated introductions.

## End-to-end owner responsibilities
- Define the learner/facilitator/partner interaction and its privacy constraints.
- Implement the UI, versioned API, domain validation, error states and documentation.
- Add tests for happy path, invalid input and permission boundary assumptions.
- Demonstrate the capability inside the integrated UdaanSetu application.

## Acceptance criteria
Unverified profiles are not shown publicly; connection requests require consent, facilitator mediation and guardian/institution approval flags. Contact details are not returned.

## Files in this increment
- `backend/src/main/java/in/udaansetu/platform/mentors/MentorDtos.java`
- `backend/src/main/java/in/udaansetu/platform/mentors/MentorService.java`
- `backend/src/main/java/in/udaansetu/platform/mentors/MentorController.java`
- `frontend/src/partners/PartnerWorkspace.jsx`

## Prototype boundary
This slice uses the repository's current in-memory stores and demo actor headers. Those are suitable for local development only. Before public deployment, replace them with durable storage, authenticated identity and server-enforced role/object authorization; review applicable child-safety and privacy requirements.
