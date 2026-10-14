# Team Execution — Phases 25–28 (End-to-End Ownership)

Approach: each owner takes a complete, small slice through UI/API/domain rules/tests/docs/demo. Shared release gates are reviewed by the whole team.

| Workstream owner | Vertical deliverable | Acceptance responsibility |
|---|---|---|
| Impact / analytics owner | Safe event contract, aggregate API, KPI definitions and impact panel | Verify no PII payload, summary gate and metric definitions. |
| Privacy / security owner | Consent preferences, data-rights request boundary, request headers, request limits and security register | Demonstrate no false erasure/compliance claims; record demo-auth limitations. |
| AI quality owner | Curated retrieval evaluation cases and deterministic report; future multilingual cases | Run offline evaluation; explain test set size and what metric does not prove. |
| Release / DevEx owner | Actuator, Docker production frontend, Compose health checks, CI, smoke script and showcase notes | Clean build/test run; inspect secret configuration and rollback. |
| Integrator / demo lead | Full learner-to-opportunity journey and final presentation | Verify links, language switching, responsive UI, honest demo labels and release caveats. |

## Definition of done per change

1. Feature works end-to-end in the integrated repository.
2. Validation and failure/loading/offline states are covered.
3. Unit/integration tests cover important business rules and a negative case.
4. No secrets, personal data or unreviewed external integration is included.
5. Docs and phase manifest are updated.
6. At least one teammate other than the author reviews the code and demo acceptance.
7. The integrated smoke test and available checks pass; skips are called out rather than described as passing.

## Immediate blocker list

- Full identity and role-based authorization is still a production gate; prototype headers are not secure authentication.
- Feature data remains in-memory in existing slices and resets after restart.
- Phases 02–07 are integrated in prototype form: local-first onboarding/profile, six starter pathways, deterministic explainable matching and a three-step plan. Phase 08 has only general resource links; the reviewed exams/credentials/prerequisites catalogue remains open. Full dependency-aware builds are still required.
- External official APIs, payment checkout and outgoing email/SMS/push remain off or unconfigured.
