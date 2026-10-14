# Phase 29–30 — Durable catalogue and fail-closed identity boundary

## What changed

- `OpportunityCatalogue` uses JDBC in the application runtime, while the no-argument constructor keeps isolated domain tests simple.
- `OpportunityReviewRepository` persists review submissions and decisions. `OpportunityIngestionService` wraps stage/review operations in transaction boundaries.
- Flyway V1 creates the catalogue and review queue in both H2 and PostgreSQL. The starter official-source references are seeded after migrations and never overwrite an existing row.
- Shared `DemoReviewerAccess` now governs opportunity review, mentor review and partner-listing review consistently.
- The `prod` profile fails closed for endpoints whose actor identity is still provided by forgeable headers. This reduces accidental public exposure but does not implement a true identity provider.
- Compose now runs PostgreSQL with a named volume; the production override requires an explicit database password and disables prototype identity routes.

## Run locally

```bash
cd backend
./mvnw -B clean verify
./mvnw spring-boot:run
```

Default local mode uses file-backed H2 and the Flyway migration. For the Compose demo:

```bash
cp .env.example .env
# Edit POSTGRES_PASSWORD to a unique strong local value.
docker compose up --build
```

Fail-closed production-profile configuration check (does not launch services):

```bash
POSTGRES_PASSWORD=temporary-test-value docker compose -f compose.yaml -f compose.production.yaml config --quiet
```

## Release boundaries

The opportunity catalogue and review queue are durable. Other domain stores are not yet migrated. The production profile disables identity-dependent routes until OIDC/OAuth2 identity and roles are actually integrated. The project is still a hackathon prototype until real build/test/container CI has passed, backups/restores and access controls are verified, child-safety and privacy review is complete, and the application is tested with intended users.
