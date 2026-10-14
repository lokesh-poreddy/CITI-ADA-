# Approach A — End-to-End Ownership (Vertical Development)

## Definition

Every assigned owner develops, tests, documents and integrates a whole feature from user interaction to API/domain/data behavior. The owner coordinates with shared platform maintainers rather than throwing a UI ticket “over the wall” to a backend teammate.

## Ownership contract for every phase

The feature owner must deliver:

1. User story and acceptance criteria.
2. UI/UX flow including loading, empty, error, offline and success states.
3. API contract and backend/domain changes.
4. Data schema/migration and seed data when required.
5. AI prompt/retrieval/evaluation work when the feature depends on AI.
6. Unit/integration/end-to-end tests proportionate to risk.
7. Accessibility and performance checks relevant to the feature.
8. README, environment changes, integration notes and known limitations.
9. A working demonstration in the integrated branch.

## Suggested ownership pattern

- Product/UX owner: owns discovery and design acceptance, but also validates the finished in-product journey.
- Learner journey owner: owns onboarding, profile, strengths and pathway user stories end-to-end.
- Opportunity/data owner: owns source ingestion, provenance, freshness, search and eligibility quality end-to-end.
- AI/voice owner: owns service integration, grounding, language/voice handling, fallback and evaluation end-to-end.
- Facilitator/platform owner: owns cohort workflows, permissions and integrations end-to-end.
- Release/security owner may be a rotating responsibility; every feature owner still meets the shared gates.

Adapt the number of owners to the team size. Avoid isolated “frontend-only/backend-only” assignments as the default delivery model.

## Definition of done

A phase is done only when the feature is accessible, handles errors/offline states honestly, passes its agreed tests, has no hard-coded secret, has documented data provenance if facts are shown, and works in the integrated application. “Files written” and “lines of code” are not acceptance criteria by themselves.
