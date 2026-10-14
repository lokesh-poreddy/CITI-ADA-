# Phase 11 — Eligibility and deadline checker

## Objective
Evaluate only explicitly configured, reviewed rules. Never infer eligibility from absent criteria.

## Current implementation paths
backend/src/main/java/in/udaansetu/platform/opportunity/OpportunityEligibilityEngine.java
- EligibilityCheckRequest.java
- EligibilityCheckResponse.java
- OpportunityService.java
- frontend/src/opportunities/OpportunityCentre.jsx

## API / interaction boundary
POST /api/v1/opportunities/{id}/eligibility-check

## Safety and design guardrails
Rules are optional fields for education level, state, age range and income ceiling; unconfigured rules return NEEDS_REVIEW; missing details return NEEDS_MORE_INFORMATION.

## Feature owner
Eligibility/business-rule owner with source reviewer. Never encode a criterion without traceable official source and review version.

## Exit criteria
Unit/API tests cover matching, mismatch, missing fields and unconfigured rules. UI states this is not an official decision.

## Team collaboration
The vertical owner must test the visible user flow, API/domain behavior, empty/error/loading states, responsiveness, accessibility, source provenance where applicable, and the integrated end-to-end journey. Changes should extend the existing repository; do not create a separate app for this phase.
