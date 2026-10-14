# Phase 13 — Grounded AI assistant

## Objective
Answer with relevant source records, safe limitations and official links; optional generation is explicitly configured.

## Current implementation paths
ai-service/app/retrieval.py
- ai-service/app/model_gateway.py
- ai-service/app/assistant_schemas.py
- ai-service/app/main.py
- ai-service/tests/test_opportunity_ai.py
- frontend/src/api/opportunities.js
- frontend/src/opportunities/OpportunityCentre.jsx

## API / interaction boundary
POST http://localhost:8000/api/v1/assistant/grounded-answer; GET http://localhost:8000/api/v1/capabilities

## Safety and design guardrails
Default is retrieval-only; unsupported questions return NO_SUPPORTED_EVIDENCE. Optional OpenAI-compatible generation is off by default and output without source-record citations is rejected.

## Feature owner
AI/grounding owner; evaluate retrieval quality and unsupported-question behavior.

## Exit criteria
Known query returns traceable source records. Unsupported query does not create facts. Network/model error cannot break discovery.

## Team collaboration
The vertical owner must test the visible user flow, API/domain behavior, empty/error/loading states, responsiveness, accessibility, source provenance where applicable, and the integrated end-to-end journey. Changes should extend the existing repository; do not create a separate app for this phase.
