# UdaanSetu — Phase 25–28 Handoff

This is the cumulative repository through the Phase 25–28 increment:

- **25 — Impact analytics and reporting:** a fixed event allowlist; aggregate counters only; no raw event rows or free-text analytics payloads; reviewer summary disabled unless a sufficiently long server token is configured.
- **26 — Security, privacy and child-safety hardening:** consent preference API/UI, manual-review data-rights requests, API security headers, safe request correlation IDs, content-length ceiling, prototype throttling and a truthful security register.
- **27 — Integrated quality and AI evaluation:** deterministic retrieval evaluation data, evaluation CLI, AI middleware tests, frontend consent gating test and Java unit/integration tests wired into CI.
- **28 — Deployment, observability and showcase:** Actuator health/info, non-secret release-status endpoint, production Nginx frontend image, non-root service containers, Docker Compose health checks, GitHub Actions CI and smoke-check script.

## Build and release verification

Requirements: Java 21, Node.js 22+, npm, Python 3.13 and Docker Compose v2 for the strict full-stack release gate. The Maven launcher is pinned to 3.9.11 and verifies the distribution checksum when it needs to bootstrap Maven.

```bash
# Diagnose toolchain readiness
./scripts/doctor.sh

# Strict release gate: frontend install/test/build, Java clean verify, AI tests/evaluation,
# Compose validation, all image builds, service startup and HTTP smoke checks.
./scripts/verify-release.sh

# Optional checks for a development environment where some tools may be absent:
make check-available
```

The strict gate fails rather than reporting unavailable builds as passes. GitHub Actions is configured to run actual frontend tests/build, Java tests/package, Python tests/evaluation, container image builds and an integrated service smoke test on pushes and pull requests. That workflow must complete successfully on the team repository before declaring these builds verified.

The frontend package manifest now pins direct dependencies exactly. A generated `package-lock.json` is still pending because the authoring environment cannot resolve external package hosts. On the first network-enabled CI run, the workflow uploads the generated lock as an artifact for review. Add that file to the repository and switch future CI/Docker installs from `npm install` to `npm ci` to pin transitive dependencies as well.

## New API routes

- `GET /api/v1/privacy/notice`
- `GET/PUT/DELETE /api/v1/privacy/consents` (requires prototype `X-Actor-Key`)
- `GET/POST /api/v1/privacy/data-rights-requests` (prototype actor key, manual-review only)
- `POST /api/v1/analytics/events` (fixed aggregate event vocabulary)
- `GET /api/v1/analytics/summary` (requires configured `APP_REVIEWER_TOKEN` via `X-Reviewer-Token`)
- `GET /api/v1/release/status` (public, non-secret readiness disclosure)
- Spring Actuator: `/actuator/health` and `/actuator/info` only

## Important safety boundaries

The project explicitly returns `productionReady: false`. Current actor headers are not authentication; in-memory stores reset on restart; data-rights requests are not automatically executed; the fixed evaluation has only seven curated cases; there is no production model provider by default; partner APIs, outbound messaging and payment checkout are not connected. Phases 02–08 (student onboarding, profile, strengths, career-matching and learning-pathway foundation) are still pending as a complete integrated feature slice.

Do not use real learner/minor personal data or claim legal compliance/production readiness based on this increment. See `docs/PHASE_25_28_ACCEPTANCE.md` and `docs/PRIVACY_SECURITY_CONTROL_REGISTER.md` before any field test.
