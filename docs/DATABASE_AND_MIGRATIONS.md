# Database and migration guide — UdaanSetu 0.6.1

## Scope of this increment

This increment moves the **opportunity catalogue** and **opportunity review queue** from process memory into a relational database. It does not make every feature persistent: temporary learner profiles remain volatile by design, and facilitator cohorts, mentor requests, partner listings, notifications, consent preferences, data-rights request records and aggregate analytics remain prototype stores.

## Storage modes

- **Local development:** file-backed H2 configured in `backend/src/main/resources/application.yml`. Database files are written under `backend/backend-data/` when starting the API from the `backend/` directory. They are ignored by Git.
- **Automated tests:** in-memory H2 configured by `backend/src/test/resources/application.yml`; Flyway migrations still run.
- **Compose demo:** PostgreSQL 17 Alpine with the `postgres` Spring profile; the database is not exposed on the host port by default. Data lives in the `postgres-data` named volume.
- **Production-like safe mode:** run `docker compose -f compose.yaml -f compose.production.yaml ...`. This enables the `prod` Spring profile and fails closed for routes that still use prototype identity headers. It is not a production identity solution.

## Migration

`V1__create_opportunity_persistence.sql` creates `opportunity_catalogue` and `opportunity_review_queue`. `V2__add_pending_review_lookup_index.sql` adds the composite `(candidate_id, review_status)` index used by duplicate staging checks. `payload_json` stores the versioned domain record representation, while indexed columns support IDs, status, type, deadlines, review state and submitted ordering. Duplicate staging checks use the indexed `candidate_id` + `review_status` columns instead of loading and JSON-deserializing the complete review queue for every submitted record. Do not edit a migration after it has been applied. Introduce a new sequential Flyway migration for future schema changes.

## Operational requirements before a pilot

1. Set a strong `POSTGRES_PASSWORD` outside source control; do not use the local demo fallback.
2. Configure database backups, restore drills, connection limits, TLS where required, least-privilege database roles and migration ownership.
3. Decide data retention per domain. Do not persist full learner profiles by default.
4. Move remaining feature stores to appropriate repositories with object-level authorization and audit/retention controls.
5. Add metrics/alerts for migration failures, connection pool exhaustion, failed writes, queue age and data-source health.
6. Run the Maven suite against H2 and PostgreSQL integration test profile in CI before promoting a release.
