# Phase 19 — Learning-module authoring

## Objective
Facilitator-created modules with draft/publish/archive workflow and explicit free or paid access terms.

## End-to-end owner responsibilities
- Define the learner/facilitator/partner interaction and its privacy constraints.
- Implement the UI, versioned API, domain validation, error states and documentation.
- Add tests for happy path, invalid input and permission boundary assumptions.
- Demonstrate the capability inside the integrated UdaanSetu application.

## Acceptance criteria
A module can be saved as a draft; publishing requires a title, summary, at least one lesson and an explicit access/price policy. No payment is collected.

## Files in this increment
- `backend/src/main/java/in/udaansetu/platform/modules/ModuleDtos.java`
- `backend/src/main/java/in/udaansetu/platform/modules/LearningModuleService.java`
- `backend/src/main/java/in/udaansetu/platform/modules/LearningModuleController.java`
- `frontend/src/partners/PartnerWorkspace.jsx`

## Prototype boundary
This slice uses the repository's current in-memory stores and demo actor headers. Those are suitable for local development only. Before public deployment, replace them with durable storage, authenticated identity and server-enforced role/object authorization; review applicable child-safety and privacy requirements.
