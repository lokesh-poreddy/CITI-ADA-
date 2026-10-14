# Phase 09 — Opportunity data ingestion and review

## Objective
Provide a controlled path for adding source-linked opportunity records without crawling or auto-publishing unreviewed content.

## Current implementation paths
frontend/src/opportunities/OpportunityReviewWorkbench.jsx
- frontend/src/api/opportunityReview.js
- backend/src/main/java/in/udaansetu/platform/opportunity/OpportunityIngestionService.java
- OpportunityIngestionController.java
- IngestionCandidateRequest.java
- IngestionPreviewRequest.java
- ReviewQueueItem.java
- ReviewDecisionRequest.java

## API / interaction boundary
POST /api/v1/opportunity-ingestion/preview; GET /api/v1/opportunity-ingestion/review-queue; POST /api/v1/opportunity-ingestion/review-queue/{reviewId}/decision

## Safety and design guardrails
Preview blocks invalid HTTPS URLs, duplicate IDs, invalid date/age ranges. Unknown hosts receive a review warning; nothing publishes without an explicit reviewer decision.

## Feature owner
Source review UX, ingestion rules, and tests. Reviewer-token gate is prototype-only.

## Exit criteria
A contributor submits one JSON record; reviewers can inspect findings, approve or reject. Rejected/pending records never appear in public search.

## Team collaboration
The vertical owner must test the visible user flow, API/domain behavior, empty/error/loading states, responsiveness, accessibility, source provenance where applicable, and the integrated end-to-end journey. Changes should extend the existing repository; do not create a separate app for this phase.
