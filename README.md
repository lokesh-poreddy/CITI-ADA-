# UdaanSetu — Rural Learning-to-Livelihood Platform

> A multilingual, source-grounded learning-to-livelihood companion designed for rural learners in India, with a facilitator-supported journey and low-connectivity considerations.

This cumulative development repository is version **0.7.1**. The product direction is now a **curated learning-resource and opportunity hub**: organize an initial catalogue of 26 external links—coding tutorials and practice (including W3Schools and GeeksforGeeks), India-aligned school learning, digital library/ODL sources, open courses, skills, exams, scholarships, and career pathways—then help learners choose a next step. UdaanSetu does not copy or re-host third-party learning content. The main interface, resource hub, learner journey and opportunity-centre core labels support English, Hindi, Tamil and Telugu; linked-site content languages remain controlled by each provider. It adds durable database storage for the opportunity catalogue and review queue, an indexed pending-duplicate query, and a fail-closed `prod` profile that disables routes dependent on prototype identity headers until a real identity provider/RBAC layer is integrated. It includes the **Phase 01 foundation**, **Phases 02–07 in prototype form** (language-first onboarding, minimal learner profile, strengths discovery, pathway taxonomy, explainable matching and local-first learning plans), a **starter-resource slice for Phase 08**, **Phases 09–17 (opportunities and AI intelligence)**, **Phases 18–24 (facilitators, partners and sustainability)**, and **Phases 25–28 (impact analytics, privacy/security controls, AI evaluation and release tooling)**. The learner journey uses local rule-based matching by default; server-side demo processing is optional and must be re-confirmed for each visit. Phase 08 is not a complete verified catalogue of exams, prerequisites or credentials. See `docs/PHASE_ROADMAP.md`, `docs/PHASE_02_08_LEARNER_JOURNEY.md`, and `docs/PHASE_02_08_INTEGRATION_AUDIT.md` for implementation boundaries and verification evidence.

## Technology
- Frontend: React + JavaScript + Vite; responsive CSS; PWA shell; IndexedDB offline pocket for selected opportunity actions.
- Platform API: Java 21 + Spring Boot 3.5.x + Maven 3.9+ (the project wrapper bootstraps Apache Maven 3.9.11 with SHA-512 verification when no compatible system Maven is available).
- AI gateway: Python + FastAPI; retrieval-first grounded answer boundary with optional model adapter disabled by default.
- Ecosystem modules: facilitator cohorts/referrals, learning modules, safe mentor requests, partner listings, integration registry, in-app reminders, sustainability interest capture.
- Impact/security/release: consent preference ledger, aggregate-only analytics, request correlation/security headers, coarse abuse throttles, privacy notice/data-rights request workflow, Actuator health/info, release-status boundary, deterministic AI retrieval evaluation, CI and production Nginx container.
- Storage boundary: opportunity catalogue and review queue use JDBC/Flyway (file-backed H2 locally, PostgreSQL in Compose); several other modules such as learner profiles, mentor requests, partner listings, facilitator data, notifications and analytics remain prototype/in-memory. Browser draft data remains local to the device.

## Prerequisites
- Node.js 22.16+ and npm.
- Java JDK 21.
- Python 3.13 (Python 3.11+ may work for the AI module, but CI standardizes on 3.13).
- Internet access for first dependency installation.
- Docker Engine/Desktop with Docker Compose v2 for container build and full integrated smoke testing.

`backend/mvnw` / `backend/mvnw.cmd` use an installed Maven 3.9+ when available; otherwise they download Apache Maven 3.9.11 and verify its SHA-512 checksum before execution. First build still needs network access for project dependencies.

## Run locally
Start the services in separate terminals:

```bash
# Terminal 1 — Java API
cd backend && ./mvnw spring-boot:run

# Terminal 2 — Python AI service
cd ai-service
python3 -m venv .venv
source .venv/bin/activate              # Windows: .venv\\Scripts\\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 3 — frontend
cd frontend && npm install --no-audit --no-fund && npm run dev
```

Open `http://localhost:5173`. The curated Resource Hub appears directly after the hero. It includes a searchable link catalogue, topic filters, source/access notes, local bookmarks, and safe external links to original publishers; content remains at the provider. A dependency-free smoke check can be run with `cd frontend && npm run check:resources` even before installing npm packages. The student pathway builder appears later and can help a learner turn interests into next steps. It guides the learner through stage → interests/strengths/goals → ranked alternatives → a practical learning plan. The **Trusted Learning Ecosystem** follows the opportunity section and includes facilitator, module authoring, mentor, listing, integration, reminders and sustainability sections. API endpoints live under `/api/v1`.

## Release verification

```bash
# Inspect available toolchain and setup warnings
./scripts/doctor.sh

# Strict release gate: dependency install, frontend tests/build, Java clean verify,
# Python tests/evaluation, Compose validation, production image builds and HTTP smoke tests.
./scripts/verify-release.sh
# Alias for the strict release gate:
./scripts/check.sh

# Narrower developer checks; may report SKIP and is NOT a release sign-off:
make check-available
```

`verify-release.sh` treats any missing required tool or failed stage as a failed release gate. It does not count skipped builds as passes. It attempts the available checks and reports failures when network access or Docker is unavailable. The GitHub Actions workflow also runs frontend tests/build, Java `clean verify`, AI tests/evaluation, all three image builds, and an integrated Compose HTTP smoke test on every push and pull request.

**Dependency locking:** this repository currently does not include `frontend/package-lock.json` because the package registry could not be reached when this archive was prepared. The first network-enabled frontend install will create it. Commit that generated file and then change CI's `npm install` to `npm ci` for fully reproducible frontend dependency resolution.

## Learner journey integration and privacy refinements

- Phases 02–07 provide a local-first learner wizard, a six-pathway starter taxonomy, deterministic explanation, stage-aware starter plans and a topic handoff to the Opportunity Centre.
- Phase 08 currently supplies general discovery resources; a reviewed catalogue of exams, eligibility, prerequisites, language, deadlines and verified credentials remains planned work.
- Demo-service processing is not remembered in local storage; the user must re-enable it after a reload. Clearing reports local erasure separately from a server deletion that may be delayed until its short TTL.
- The optional state/UT selection remains device-local and is not sent to the matching API because the current model does not require it.
- See `docs/PHASE_02_08_INTEGRATION_AUDIT.md` for the current validation gates and known limitations.

## Phase 25–28 additions

- `GET /api/v1/privacy/notice`, consent preference routes and manual-review data-rights request records.
- `POST /api/v1/analytics/events` accepts only fixed event names/roles/language/connectivity and increments aggregate counters. `GET /api/v1/analytics/summary` requires a server-side `APP_REVIEWER_TOKEN` of at least 24 characters; blank token disables reporting. Never put this token in a `VITE_*` variable.
- `GET /api/v1/release/status` reports a non-secret readiness boundary and current prototype limitations. Actuator exposes health/info only.
- `python -m evaluation.evaluate_retrieval` evaluates the deterministic retrieval corpus. It is a small smoke evaluation, not proof of actual AI quality.
- `./scripts/smoke-release.sh` waits for and checks frontend, API health, release status, privacy notice, and AI gateway routes.

## Integration and safety boundaries
- New Java repositories are in-memory and reset when the service restarts.
- Demo actor headers `X-Actor-Key`, `X-Partner-Key`, and `X-Reviewer-Token` are prototype hooks only, not authentication.
- Demo mentor and partner listings are explicitly illustrative, not live people/jobs.
- Mentor introductions are facilitator-mediated; no personal contact information is exposed.
- Partner listings remain drafts/pending review until an authorized reviewer approves them.
- External integration registry records only display setup status; no DIKSHA, Skill India, NCS or BHASHINI external sync is enabled in this increment.
- Reminders are in-app only; no email/SMS/push provider or scheduler is connected.
- Sustainability endpoints describe hypotheses and record consented partnership interest; no payment checkout or financial data collection exists.
- The UI may fall back to browser-local demonstration state when an API is unreachable. It labels this mode and does not automatically sync those local-only changes. Consent and data-rights endpoints are also prototype-only: actor headers are forgeable, stores are in memory, and erasure/export must be fulfilled manually across systems.
- Follow `docs/ECOSYSTEM_SAFETY_AND_MONETIZATION.md` before any public demo or user pilot.

## Key documents
- `docs/RESOURCE_HUB_RESEARCH.md` — curated source directory, link-only content policy and four-language UI caveat.
- `docs/PHASE_02_08_LEARNER_JOURNEY.md` — learner onboarding, matching and pathway design.
- `docs/PHASE_02_08_ACCEPTANCE.md` — learner-journey acceptance and test scenarios.
- `PHASE_25_28_README.md` — latest increment quick start and release boundaries.
- `docs/PHASE_25_28_ACCEPTANCE.md` — phase gates and open blockers.
- `docs/IMPACT_METRICS_CATALOG.md` — event vocabulary and KPI definitions.
- `docs/PRIVACY_SECURITY_CONTROL_REGISTER.md` — implemented controls vs production gaps.
- `docs/AI_EVALUATION_PROTOCOL.md` — deterministic evaluation procedure.
- `docs/DEPLOYMENT_OBSERVABILITY_RUNBOOK.md` — Docker, health checks and showcase.
- `docs/PHASE_25_28_TEAM_EXECUTION.md` — end-to-end work ownership.
- `docs/PHASE_ROADMAP.md` — all 28 phases.
- `docs/ARCHITECTURE.md`, `docs/AI_GROUNDING_POLICY.md`, `docs/OFFLINE_SYNC_CONTRACT.md` — core design notes.

## Engineering principle
Each feature owner delivers the full vertical slice: interface → API → domain rules → data provenance / safety → tests → docs → demo. Code size is not a delivery metric; correct behavior, clarity and validation are.

## Phase 29–30: persistence and production-safe boundary

- Opportunity catalogue records and the human-review queue now use JDBC with Flyway migrations. Local development uses file-backed H2; Docker Compose uses PostgreSQL 17 and a named persistent volume. The schema is under `backend/src/main/resources/db/migration/`.
- Pending and reviewed opportunity submissions survive API restarts when the configured database volume is retained. Reference seeds are inserted only if their IDs are absent; reviewer-edited rows are not overwritten.
- Reviewer endpoints reuse `DemoReviewerAccess`, including the same minimum token-length requirement. A reviewer token is still only a prototype shared secret, not account authentication or RBAC.
- `compose.production.yaml` layers the `prod` profile over Compose and disables endpoints that still rely on spoofable demo actor headers. Public discovery remains available; restricted workflows return `503 PROTOTYPE_IDENTITY_DISABLED` until a genuine OIDC/OAuth2 identity provider and role-based authorization are implemented.
- Run a demo stack with `docker compose up --build`. For a fail-closed configuration check, run `POSTGRES_PASSWORD=temporary-test-value docker compose -f compose.yaml -f compose.production.yaml config --quiet`. Do not use the sample password in a real deployment.
- This increment does **not** migrate learner profiles, facilitator cohorts, mentor requests, partner listings, notification/reminder records, consent preferences or analytics counters. Those stores remain in-memory and must be migrated with domain-specific retention, ownership, backup and access rules before a public pilot.
