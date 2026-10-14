# Phases 02–08 Integration Audit — UdaanSetu

**Audit snapshot:** 14 October 2026  
**Repository version:** 0.5.2  
**Purpose:** Describe the integrated learner journey, cross-layer contracts, verification evidence and remaining release gates.

## Executive summary

Phases 02–07 are integrated in prototype form as a local-first learner journey. A learner can select a learning stage and language, select broad interests/strengths/goals, receive several rule-based pathway suggestions, open a stage-sensitive three-step plan, save/resume/clear the minimum structured draft on the same device, and hand a selected pathway into the existing Opportunity Centre. English, Hindi, Tamil and Telugu screen-copy dictionaries are checked for key parity. The region selector contains all 28 states and 8 union territories, but the optional region selection stays on the device because the present matching service does not need it.

Phase 08 is **partially implemented**. The prototype provides general learning-resource links and exploratory pathway guidance. It does not yet contain a complete, reviewed, continuously verified catalogue of exams, prerequisites, credentials, local delivery options, dates, fees and eligibility rules. That catalogue should be developed as a governed data product rather than generated freely by an LLM.

This snapshot has strong source-level checks and limited tests where the necessary runtimes are available. It is **not a full release sign-off**: real npm/Vite tests and build, Maven/Spring tests/JAR, Docker image/runtime tests, and GitHub Actions are still outstanding because package-registry DNS is blocked in the authoring environment and Docker/Maven are unavailable here.

## Integrated learner flow

1. **Welcome and expectations** — the UI explains that suggestions are exploratory, not an official assessment or outcome guarantee.
2. **Minimal context** — learner selects one of five education stages and English, Hindi, Tamil or Telugu. Optional state/UT remains client-local.
3. **Signal selection** — choose interests, strengths and goals, including “not sure yet”. Validation requires at least one interest and one goal for a meaningful starter match.
4. **Local matching first** — fixed, explainable rules rank six broad pathways. Multiple alternatives are shown; score means relative alignment, not a probability or scientifically validated aptitude result.
5. **Stage-sensitive plan** — selected path opens three localized practical milestones, general discovery resources and safety/eligibility cautions.
6. **Offline-first persistence** — a debounced draft is stored in IndexedDB when available. The UI identifies the memory-only fallback, and does not claim durable storage when the browser cannot provide it.
7. **Opportunity handoff** — a selected pathway provides a topic-specific query to the existing Opportunity Centre.
8. **Optional remote demo matching** — only an explicit current-visit opt-in allows the minimal structured matching fields to be sent to the Java API. Local matching remains the fallback.

## Backend contracts and ownership

| Endpoint | Purpose | Current boundary |
|---|---|---|
| `POST /api/v1/learners/profiles` | Create temporary learner profile for opt-in demo processing | In-memory only; 30-minute TTL; not an account or authentication system |
| `DELETE /api/v1/learners/profiles/{learnerId}` | Best-effort immediate deletion of that temporary profile | Opaque ID format checked; TTL remains fallback if request cannot complete |
| `GET /api/v1/career-pathways` | Enumerate six starter pathway summaries | Starter taxonomy; not a validated labour-market classification |
| `POST /api/v1/career-pathways/recommendations` | Rank pathway IDs against temporary profile | Deterministic rules and relative-fit indicator; not a model prediction |
| `GET /api/v1/learning-pathways/{pathwayId}` | Read public, generic three-step plan and source references | Does not require or receive learner profile fields |

The frontend and Java API share six pathway IDs. Results are filtered against the known frontend catalogue before remote values can affect the displayed rankings. The Java matcher sorts set traversal before constructing matched-signal explanations so explanation ordering does not rely on unspecified set iteration order.

## Privacy and lifecycle decisions

- Never request the learner's name, phone number, email, date of birth, exact address, income, caste/category, school ID, password or uploaded personal documents in this journey.
- Do not send the optional state/UT selection to the current matching API. There is no current region-aware model that needs it.
- Local draft storage never persists `allowDemoProcessing=true`. A fresh visit/resume resets the option, so the user must re-confirm before new server-side processing.
- Browser storage is local convenience storage, not secure storage. Use only non-sensitive demo choices on shared devices.
- Deleting local data and deleting a remote temporary profile are separate operations. The UI now reports a failed local or remote deletion and leaves a retry action visible. Failed remote cleanup retains the opaque profile ID for retry; the temporary profile's 30-minute TTL is a fallback, not proof of immediate deletion.
- These controls are not legal consent, guardian approval, identity verification, production authorization, or a completed data-rights process.

## Offline/connectivity behavior

- Static frontend shell and starter catalogue support initial exploration after the shell has been loaded.
- Local pathway matching works without an API request.
- The learner draft uses IndexedDB with an in-memory fallback that disappears when the session ends.
- Public opportunity catalogue caching and queued actions are managed by the existing offline pocket.
- Service-worker caching excludes `/api/` routes; API responses and temporary profiles are not cached by the service worker.
- Live opportunity updates, remote matching, and official external webpages require a connection. A resource link does not mean that the content is downloadable or available offline.
- Synchronization queues exist for opportunity actions, but the broader learner profile is not silently uploaded on reconnect.

## Current code areas

- UI and taxonomy: `frontend/src/student/StudentJourney.jsx`, `frontend/src/student/careerCatalog.js`, `frontend/src/student/student-journey.css`
- API client and privacy boundary: `frontend/src/api/learnerJourney.js`
- Offline persistence: `frontend/src/offline/offlinePocket.js`
- Java profile lifecycle: `backend/src/main/java/in/udaansetu/platform/learners/`
- Java catalogue/matcher/plan: `backend/src/main/java/in/udaansetu/platform/careers/`
- Frontend tests: `frontend/src/student/careerCatalog.test.js`, `frontend/src/student/StudentJourney.test.jsx`, `frontend/src/api/learnerJourney.test.js`, `frontend/src/offline/offlinePocket.test.js`
- Backend tests: `backend/src/test/java/in/udaansetu/platform/learners/`, `backend/src/test/java/in/udaansetu/platform/careers/`
- Offline cross-layer contract checks: `scripts/check-integration-contracts.py`
- Acceptance: `docs/PHASE_02_08_ACCEPTANCE.md`

## Verification evidence at this snapshot

| Check | Result | Interpretation |
|---|---|---|
| Cross-layer contract checker | **55/55 passed** | File/route/ID/privacy-source checks; not runtime integration |
| Catalogue/local persistence smoke | **Passed** | 3 locales, 36 regions, six pathways, stage-sensitive plan, stable ordering, opt-in not persisted |
| JavaScript/JSX syntax transpilation | **27 files, 0 syntax errors** | Syntax parsing only; not Vite bundle or type check |
| CSS parse | **6 stylesheets passed** | Syntax parse only; not visual/browser layout test |
| Python AI service tests | **12 passed** | Unit tests for the existing Python service |
| Deterministic retrieval evaluation | **7/7 passed** | Small curated smoke set only, not model quality or population-level evidence |
| Python bytecode compile | **Passed** | Syntax/import compilation for app/evaluation/tests |
| Java learner/career source + selected tests compiled against temporary API stubs | **Passed** | Java language/type consistency against stub signatures only; does not run Spring, Jakarta validation, JUnit or the full application context |
| Java learner → recommendation → plan → delete smoke using compiled domain services | **Passed** | Domain path under stubs, not HTTP/Spring runtime behavior |
| JSON/YAML/XML and Bash script parsing | **Passed** | Configuration syntax, not container/build correctness |
| npm install, Vitest and Vite production build | **Blocked** | npm registry DNS could not resolve; no `package-lock.json` generated |
| Real Maven `clean verify` and JAR | **Blocked** | Maven unavailable; wrapper bootstrap and Maven Central dependency retrieval blocked by DNS |
| Docker builds and Compose HTTP smoke | **Blocked** | Docker/Compose unavailable |
| GitHub Actions | **Configured, not executed** | Must inspect a green run for the exact commit |

## Release and implementation gates still open

1. Run `./scripts/doctor.sh` and `./scripts/verify-release.sh` in a network-enabled environment with Java 21, Node/npm, Python and Docker Compose.
2. Generate and commit `frontend/package-lock.json`; then use reproducible lockfile-based installation (`npm ci`) in local and CI workflows.
3. Fix all failures from real React component tests, Vite production build, Spring/Maven tests, container build, and integrated HTTP smoke tests.
4. Replace prototype identity headers and in-memory stores with verified identities, server-side authorization, durable persistence, rate limiting, audit controls, retention and deletion workflows before any public user pilot.
5. Build an approved and source-reviewed exam/course/credential knowledge base for Phase 08, including source owner, eligibility fields, language, geography, fee, deadline, last-checked timestamp, expiry behavior and reviewer approval.
6. Test with target learners and facilitators across supported devices, accessibility needs, language/accent and weak-network conditions. Do not claim outcome impact without measurements.

## Decision

**Continue development; do not mark the project fully build-verified or production-ready.** The learner journey is integrated as a prototype slice and the available source-level/domain checks pass. Full dependency-aware builds, real service integration tests, data governance and field validation remain release gates.
