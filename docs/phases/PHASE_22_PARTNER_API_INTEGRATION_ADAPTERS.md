# Phase 22 — Partner/API integration adapters

## Objective
A registry of local and planned external adapters with configuration status and authorization guidance.

## End-to-end owner responsibilities
- Define the learner/facilitator/partner interaction and its privacy constraints.
- Implement the UI, versioned API, domain validation, error states and documentation.
- Add tests for happy path, invalid input and permission boundary assumptions.
- Demonstrate the capability inside the integrated UdaanSetu application.

## Acceptance criteria
The registry distinguishes the local catalogue from external sources and explicitly reports that no external network adapter is enabled in this increment.

## Files in this increment
- `backend/src/main/java/in/udaansetu/platform/integrations/PartnerAdapter.java`
- `backend/src/main/java/in/udaansetu/platform/integrations/IntegrationStatus.java`
- `backend/src/main/java/in/udaansetu/platform/integrations/IntegrationDescriptor.java`
- `backend/src/main/java/in/udaansetu/platform/integrations/IntegrationRegistryService.java`
- `backend/src/main/java/in/udaansetu/platform/integrations/IntegrationController.java`

## Prototype boundary
This slice uses the repository's current in-memory stores and demo actor headers. Those are suitable for local development only. Before public deployment, replace them with durable storage, authenticated identity and server-enforced role/object authorization; review applicable child-safety and privacy requirements.
