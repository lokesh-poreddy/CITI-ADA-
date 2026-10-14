# UdaanSetu v0.6.1 — Build Validation Report

**Status:** Source-level checks passed; full dependency-aware builds remain blocked in this authoring environment.  
**Release posture:** Integrated prototype increment, **not production-ready**.

## Increment summary

Version 0.6.1 hardens the durable opportunity catalogue and review workflow. Duplicate candidate detection now uses an indexed query on `(candidate_id, review_status)` instead of loading and deserializing the full review queue for every submitted record. Flyway V2 adds the composite index without changing the already-defined V1 migration. Catalogue seeding inserts only missing reference records, preserving reviewed edits on application restart. Existing catalogue rows are updated in place so `created_at` stays stable. Regression tests cover these lifecycle guarantees and pending-to-resolved review-state detection.

Other changes align runtime versions to 0.6.1, keep local H2 database files out of the backend Docker build context, make the H2 test password explicitly empty YAML, and correct the package provenance metadata.

## Checks actually executed

| Check | Result | Evidence and limitation |
|---|---|---|
| Cross-layer source contract | **72/72 passed** | `python3 scripts/check-integration-contracts.py`; static source checks only |
| Python AI-service tests | **12 passed** | `cd ai-service && python3 -m pytest -q` |
| Deterministic retrieval evaluation | **7/7 passed** | `cd ai-service && python3 -m evaluation.evaluate_retrieval`; tiny fixture corpus, not model-quality proof |
| Python syntax compile | **Passed** | `python3 -m compileall -q ai-service/app ai-service/evaluation ai-service/tests` |
| JavaScript/JSX parse | **26 files, 0 syntax errors** | Global TypeScript `transpileModule`; not a Vite build or module-resolution test |
| Changed Java persistence/security classes | **Compiled against temporary API stubs** | Checks basic Java type/syntax coherence; not a Spring/Maven dependency build |
| Persistence integration test source | **Compiled against temporary JUnit/Spring stubs** | Syntax/signature smoke only; the test was not executed |
| JSON/YAML/POM/shell parsing | **28 JSON, 8 YAML, POM XML and shell syntax passed** | Syntax/parse only; no Compose runtime validation |
| Toolchain diagnostic | **Completed** | Java 21, Node 22.16.0, npm 10.9.2 and Python 3.13.5 found; Docker missing; Maven wrapper present; npm lock absent |

## Full-build gates not verified

| Gate | Status | Reason / required action |
|---|---|---|
| npm install, `npm test`, `npm run build` | **Blocked** | `registry.npmjs.org` did not resolve. Run on a network-enabled CI runner or developer machine. Generate and commit `frontend/package-lock.json`, then change CI from `npm install` to `npm ci`. |
| `./mvnw -B --no-transfer-progress clean verify` | **Blocked** | System Maven is absent and `repo.maven.apache.org` did not resolve for the Maven wrapper and dependency downloads. Run with Java 21 and network access. |
| Flyway/H2 runtime tests | **Not executed** | Migration files and config parsed, but no Spring test context was started. |
| PostgreSQL persistence integration | **Not executed** | Requires running database and actual Maven integration tests. |
| Docker image builds and Compose smoke test | **Blocked** | Docker/Compose are not installed. Run strict validation on a Docker-enabled runner. |
| Browser/mobile/offline reconnect tests | **Not executed** | Requires built frontend and browser/device automation; low-end Android and weak-network testing is still needed. |
| GitHub Actions | **Configured, not executed here** | A repository runner must execute the workflow to provide true dependency-aware build evidence. |

## Commands for the next full verification

Run in the project root with Java 21, Node/npm, Python and Docker Compose v2 available and network access enabled:

```bash
./scripts/doctor.sh
./scripts/verify-release.sh
```

The strict release gate intentionally fails when required tools are missing; it does not count unavailable gates as passes.

## Persistence and production boundary

- Opportunity catalogue and human-review queue use JDBC/Flyway. Local development is file-backed H2; Compose uses PostgreSQL.
- V1 creates the relational tables; V2 adds the composite pending-review lookup index. Applied migrations must remain immutable; future changes should use new sequential versions.
- Other modules remain prototype/in-memory, including learner profiles, facilitator cohorts/referrals, mentor requests, partner listings, notifications, consent/data-rights request records and analytics.
- The `prod` profile disables routes that still depend on spoofable prototype actor headers. It is a fail-closed guard, not an identity provider: the affected routes remain unavailable until OIDC/session identity and role-based authorization are implemented.
- Database round-trip and startup-seed regression tests are present but have not run under Maven in this environment.
- Reference opportunity records are not a comprehensive, continuously verified catalogue. Eligibility, current dates, source freshness and official integration access require governance and review.

## Remaining production gates

1. Pass frontend npm/Vite build/tests, Maven/Spring tests, Flyway migration tests, and Docker build/runtime smoke.
2. Integrate real identity and RBAC, secure sessions, CSRF protections where applicable, managed secrets, and tested authorization boundaries.
3. Define data retention/deletion, migrate required remaining stores, and test concurrent updates plus database backup/restore.
4. Add load, abuse/rate-limit, authorization, dependency vulnerability and threat-model tests.
5. Test multilingual voice correction, accessibility, offline writes, reconnect synchronization, and conflict handling on real devices and constrained networks.
6. Verify licenses, partner safety, data freshness and eligibility correctness before any field pilot.

**Conclusion:** v0.6.1 improves query performance, seed integrity, timestamp stability, regression coverage and release hygiene. It must not be described as full-build-verified or production-ready until every blocked gate passes with real dependencies and runtime services.
