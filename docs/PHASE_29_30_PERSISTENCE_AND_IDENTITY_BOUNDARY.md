# Phase 29–30 — persistence and identity boundary

## Phase 29: durable opportunity records

**Implemented in source:**
- JDBC-backed `OpportunityCatalogue` in the application runtime; no-argument constructor retained for isolated in-memory domain tests.
- Durable `OpportunityReviewRepository` for pending, approved and rejected review items.
- Flyway migrations for PostgreSQL/H2: V1 creates the tables, V2 adds a composite `(candidate_id, review_status)` index for pending duplicate checks.
- `ApplicationReadyEvent` seeds only missing records after migrations run; startup no longer overwrites reviewer-edited records. Catalogue updates preserve the original `created_at` timestamp. Duplicate staging uses an indexed SQL predicate rather than deserializing the entire review queue.
- Spring service-level transactions are used across stage/review writes.
- Integration tests round-trip records through a newly constructed repository, check pending-to-resolved duplicate detection, and verify startup seeding preserves a reviewed title and stable `created_at`.

**Not yet proven in this workspace:** the real Maven/Spring application test suite could not execute because Maven Central DNS was unavailable. The test sources are included and must pass in CI.

## Phase 30: reviewer policy and safe production mode

- Opportunity ingestion, mentor review and partner listing review use the shared `DemoReviewerAccess` component.
- Missing, short or mismatched reviewer tokens are rejected using a constant-time byte comparison after the length/empty checks.
- The `prod` profile sets `app.prototype-identities-enabled=false`. The boundary filter rejects routes dependent on spoofable actor headers with `503 PROTOTYPE_IDENTITY_DISABLED`; it does not pretend those headers are authentication.
- Public discovery reads remain available, while actor/reviewer-dependent profile, action, review and mutation routes fail closed.

**Important limitation:** no OIDC/OAuth2 identity provider or production RBAC is implemented yet. These routes are intentionally unavailable in `prod` until that integration exists. The hackathon demo profile leaves prototype routes enabled for local presentation only.

## Exit criteria

- `./backend/mvnw -B clean verify` passes with the real dependency graph.
- Migration and persistence tests pass on H2 and PostgreSQL.
- `docker compose -f compose.yaml config --quiet` and full image/runtime smoke pass.
- `docker compose -f compose.yaml -f compose.production.yaml config --quiet` shows `postgres,prod` active and the prototype identity flag false.
- Security testing proves protected routes return 503 in production-safe mode and source/reviewer gate consistency is covered by tests.
- Backup/restore and restart durability are manually demonstrated before any operational pilot.
