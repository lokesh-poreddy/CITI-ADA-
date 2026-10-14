# Phase 24 — Monetization and sustainability

## Objective
Sustainability hypotheses, ethical guardrails and consent-based partner interest capture.

## End-to-end owner responsibilities
- Define the learner/facilitator/partner interaction and its privacy constraints.
- Implement the UI, versioned API, domain validation, error states and documentation.
- Add tests for happy path, invalid input and permission boundary assumptions.
- Demonstrate the capability inside the integrated UdaanSetu application.

## Acceptance criteria
The product makes no payment calls and stores no payment-card/banking data; core student discovery is proposed to remain free, and interest capture validates possible payer models.

## Files in this increment
- `backend/src/main/java/in/udaansetu/platform/sustainability/SustainabilityDtos.java`
- `backend/src/main/java/in/udaansetu/platform/sustainability/SustainabilityService.java`
- `backend/src/main/java/in/udaansetu/platform/sustainability/SustainabilityController.java`
- `frontend/src/partners/PartnerWorkspace.jsx`

## Prototype boundary
This slice uses the repository's current in-memory stores and demo actor headers. Those are suitable for local development only. Before public deployment, replace them with durable storage, authenticated identity and server-enforced role/object authorization; review applicable child-safety and privacy requirements.
