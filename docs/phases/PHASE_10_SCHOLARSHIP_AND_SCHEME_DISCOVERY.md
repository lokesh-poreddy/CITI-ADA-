# Phase 10 — Scholarship and scheme discovery

## Objective
Make scholarship and government-scheme discovery source-first, diverse and explicit about incomplete data.

## Current implementation paths
backend/src/main/java/in/udaansetu/platform/opportunity/OpportunityCatalogue.java
- OpportunityService.java
- OpportunityController.java
- frontend/src/data/demoOpportunityCatalogue.js
- frontend/src/opportunities/OpportunityCentre.jsx
- docs/OPPORTUNITY_DATA_GOVERNANCE.md

## API / interaction boundary
GET /api/v1/opportunities?type=SCHOLARSHIP; GET /api/v1/opportunities?q=&type=SCHEME

## Safety and design guardrails
Starter catalogue has one dated NSP portal notice plus portal references for courses, skill pathways, career services, apprenticeships, learning resources and language technology.

## Feature owner
Catalogue discovery and source-governance owner. Confirm actual source rules before any detailed scheme import.

## Exit criteria
Student can filter/search listings, see provider/source/date, open official source, and sees a warning when criteria are not configured.

## Team collaboration
The vertical owner must test the visible user flow, API/domain behavior, empty/error/loading states, responsiveness, accessibility, source provenance where applicable, and the integrated end-to-end journey. Changes should extend the existing repository; do not create a separate app for this phase.
