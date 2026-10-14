## 0.7.1 — Resource directory expansion and Telugu consistency

- Expanded the curated external-link directory with Khan Academy India, NDLI, IGNOU Online/eGyanKosh, Code.org, LeetCode Explore and HackerRank tutorials, verified against public provider pages on 14 October 2026.
- Fixed Telugu education-stage option labels and locale-aware saved-profile date formatting.
- Preserved Telugu language selection in the local learner pocket without persisting optional server-processing consent.
- Added Telugu to facilitator module content-language choices and the telemetry locale allowlist. Provider `languageCodes` remain distinct from interface locale: third-party resource content is not assumed to be available in Telugu.
- Added a dependency-free resource/locale smoke script and expanded catalogue regression tests.
- Full npm/Vite, Maven/Spring and Docker runtime builds remain network/toolchain-dependent and are not claimed as passed here.

## 0.7.0 — Curated resource hub and Telugu localization

- Repositioned the main experience around a curated education-resource directory inspired by resource discovery and structured tutorials, not a content-hosting library.
- Added direct links to coding tutorials/practice, web and language documentation, school resources, open courses, vocational skills, official exam pages, career services, apprenticeships, scholarship portals and language tools.
- Clarified the link-only model: UdaanSetu does not mirror publisher content; provider languages, fees, eligibility, access and availability remain controlled by the original source.
- Added Telugu (`te`) to the main interface, student pathway flow, state/UT labels, core opportunity-centre copy and browser voice locale (`te-IN`) alongside English, Hindi and Tamil.
- Added resource catalog regression tests and source governance documentation; fixed the saved-bookmark filter so saved resources are not incorrectly treated as an audience group.
- Bumped synchronized runtime metadata to 0.7.0. Build/runtime verification still requires a network-enabled environment and installed Java/npm/Docker toolchains.

# Changelog

## 0.6.1 — Persistence query and release hardening

- Replaced full review-queue JSON deserialization during duplicate-candidate validation with an indexed SQL predicate on candidate ID and pending status.
- Added persistence regression coverage for pending-to-resolved review state and the duplicate guard.
- Hardened backend Docker build context to exclude local H2 database files and runtime persistence directories.
- Made H2 test password explicitly empty in YAML and corrected phase-manifest provenance.
- Bumped synchronized frontend, backend, AI-service, Compose and CI artifact versions to 0.6.1.
- Added/updated the honest validation record distinguishing static/type-smoke checks from Maven/npm/Docker gates that require external dependencies and a container runtime.


## 0.6.0 — Persistence and identity-boundary hardening

- Added Flyway-managed relational schema and JDBC persistence for the opportunity catalogue and opportunity review queue.
- Added file-backed H2 local development mode and PostgreSQL-backed Compose mode with a named data volume.
- Centralized reviewer-token policy across source review, mentor review and partner-listing review controllers.
- Added a fail-closed `prod` profile for routes that still depend on spoofable prototype actor headers.
- Added H2-backed persistence round-trip tests, reviewer policy tests, and production-boundary filter tests.
- Updated strict release verification and CI to validate both the demo and fail-closed Compose configurations.
- Remaining stores are still prototype/in-memory and production identity/RBAC is not yet implemented.

## 0.5.2 — Consent and integration determinism hardening

- Made temporary demo-service opt-in visit-scoped: local draft persistence always stores `allowDemoProcessing=false`, and resuming a draft requires the user to opt in again before server processing.
- Improved profile-clear truthfulness by reporting local deletion separately from a failed remote cleanup; failed local or server deletion leaves a visible retry action, and failed server deletion retains the temporary profile identifier for retry with the backend TTL stated.
- Sorted Java pathway set traversal so match explanation tags remain deterministic across JVM runs; added a regression test for repeated recommendation stability.
- Updated the build/audit record to include the integrated Phases 02–07 prototype slice, Phase 08 starter-resource boundary, local-only region handling, test evidence and still-blocked full build gates.

## 0.5.1 — Learner journey integration hardening

- Added a complete local-first learner wizard with debounced draft persistence, accurate IndexedDB/session-memory messaging, and a full 36-option state/UT selector.
- Kept the broad region on-device; the matching API now receives only the structured fields needed for recommendations.
- Added safer validation of remote pathway IDs/scores and best-effort cleanup of temporary profiles.
- Persist the selected learning plan before calling the network-backed catalogue endpoint.
- Added API-client/privacy tests and expanded offline cross-layer contract checks.
- Full npm/Maven/Docker verification remains blocked in this authoring environment because package hosts cannot resolve and Docker is not installed.

## 0.5.0 — Phases 02–08 learner journey integration

- Added a localized learner pathway wizard for English, Hindi and Tamil, with a minimal profile and strengths/interest/goal selections.
- Added six transparent local-first pathway recommendations and three-step learning plans with official learning-resource references and cautions.
- Added Java profile, career catalogue, recommendations and generic learning-path APIs; remote profile processing is optional, in-memory and TTL-limited.
- Integrated selected pathway searches with Opportunity Centre and added profile reset/resume behavior.
- Added frontend/backend matcher tests, acceptance documentation, phase manifests and a stdlib-only cross-layer contract checker.
- Updated release identifiers to 0.5.0. Full npm/Maven/Docker verification still requires an enabled dependency/network environment.

## 0.4.1 — Build and release pipeline hardening

- Added checksum-verified Maven 3.9.11 bootstrap for Unix/macOS and Windows.
- Added a strict release verification script that fails on missing tools instead of counting skipped builds as passes.
- Expanded GitHub Actions to run frontend tests/build, Java clean verification, AI tests/evaluation, all container builds, and integrated HTTP smoke checks.
- Added toolchain diagnostics, local setup guidance, and an explicit validation report distinguishing passed syntax/tests from builds blocked by the authoring environment.
- Pinned direct frontend dependency versions; lockfile generation is still pending a network-enabled npm install and must be committed before switching to `npm ci`.

# Changelog

## 0.4.0 — Phases 25–28

- Added fixed-vocabulary aggregate impact analytics and protected reviewer summary.
- Added privacy notice, hashed prototype actor references for consent preferences, preference revocation and manual-review data-rights requests.
- Added backend request correlation/security headers, body Content-Length ceiling and coarse rate limit on high-cost prototype POST routes.
- Added AI gateway security middleware with response headers, request correlation, declared-body limit and per-peer assistant throttling.
- Added release status endpoint and Spring Boot Actuator health/info configuration.
- Added Impact & Trust Centre UI in English/Hindi/Tamil with consent controls, analytics test-event gating, data-rights request flow and prototype release gates.
- Added retrieval evaluation fixtures/report and expanded Java/Python/React tests.
- Changed frontend container from Vite development server to production Vite build served by Nginx; added Docker health checks, CI workflow and smoke check.
- Updated documentation/manifest to distinguish prototype controls from unmet production gates.

## 0.3.x — Earlier prototype increments

- Phase 01 foundation.
- Phases 09–17 opportunities and AI intelligence.
- Phases 18–24 facilitators, partners and sustainability.
