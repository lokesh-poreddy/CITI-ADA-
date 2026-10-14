# Phase 25–28 Acceptance Gates

These gates define the intended engineering outcome for this increment. A checked source file is not proof that the entire stack is production-ready; the documented tests must run in a clean environment.

## Phase 25 — Impact analytics and reporting

- [x] A fixed, validated event vocabulary covers the core learner journey.
- [x] The event payload has no actor identifier, user-entered query, free text, contact fields, or arbitrary metadata.
- [x] Service stores aggregate counters only in the prototype; summary does not return event-level records.
- [x] Summary is disabled unless a reviewer token of sufficient length is configured.
- [x] UI labels test events as demo-only and requires optional analytics consent.
- [ ] A persistent store, aggregation windowing, retention automation and role-based admin authorization are required before a pilot.

## Phase 26 — Security, privacy and child-safety hardening

- [x] API responses receive security headers and a sanitized request correlation ID.
- [x] Known oversized request Content-Length values are rejected; the reverse proxy has a body limit.
- [x] High-cost prototype POST routes have coarse per-peer rate limiting.
- [x] Consent preferences are tracked separately for personalized guidance, facilitator sharing and optional aggregate analytics.
- [x] Data-rights requests clearly state that manual fulfillment is required and that automatic export/erasure has not been performed.
- [x] External capabilities, payment checkout and real identity are explicitly marked as disabled/not implemented.
- [ ] Replace demo actor headers with authenticated identity and server-enforced role/tenant permissions.
- [ ] Conduct child-safety, safeguarding, privacy/legal review, threat modeling and penetration testing before using real minors' data.
- [ ] Add persistent data inventory, tested retention/erasure jobs, secret rotation and production rate limiting at the trusted edge.

## Phase 27 — Integrated quality and AI evaluation

- [x] Frontend component test added for privacy preferences and analytics consent gating.
- [x] Backend unit tests added for aggregate counters, hashed actor references, data-rights status, security headers and release state.
- [x] AI retrieval evaluation corpus and deterministic evaluator added.
- [x] AI evaluation report measures source hit rate and abstention for unsupported questions.
- [ ] Execute the full React test/build and Maven test suites in CI or on a clean developer machine.
- [ ] Add multilingual human-reviewed evaluation cases and real device/network tests.
- [ ] Add an accessibility audit and browser/device matrix before calling the prototype pilot-ready.

## Phase 28 — Deployment, observability and showcase

- [x] Spring Boot Actuator health/info endpoints are enabled; detailed health data and environment disclosure are not exposed.
- [x] Release status endpoint returns non-secret prototype boundaries and explicit readiness gates.
- [x] Frontend Docker image serves a production Vite build through Nginx rather than the Vite development server.
- [x] Docker images use non-root application users where configured; API and AI have health checks.
- [x] CI workflow covers Java, frontend, Python and the AI retrieval evaluation.
- [x] Smoke-check script checks the frontend, API, privacy notice, release status and AI gateway.
- [ ] Build and run the full Docker Compose stack in a Docker-enabled environment.
- [ ] Configure HTTPS, trusted proxy headers, durable database, backups, log retention, monitoring alerts, rollback and incident ownership for any public deployment.

## Release decision

Current state: **HACKATHON PROTOTYPE — NOT PRODUCTION READY**. Use synthetic/demo information in judging. Do not onboard real school-age learners until the unchecked identity, safeguarding, legal, persistence, deployment and operational gates are completed.
