# Deployment, Observability and Hackathon Showcase — Phase 28

## Reproducible release gate

Use the strict release script—not only syntax checks—before a showcase build:

```bash
./scripts/doctor.sh
./scripts/verify-release.sh
```

This gate runs frontend dependency installation, tests and a production build; Java 21 `clean verify` through the checksum-verified Maven launcher; AI service tests and deterministic retrieval evaluation; Compose config validation; image builds; container startup and HTTP smoke tests. If a required tool or build is unavailable, the strict gate fails.

The CI workflow runs the same component test/build gates and builds/runs the Compose stack on pushes and pull requests. A workflow definition is not proof of success: review the action result for the exact commit. This authoring environment could not resolve Maven Central/npm registry DNS and had no Docker daemon, so only the checks listed in `docs/BUILD_VALIDATION_REPORT.md` have run locally.

## Local Docker run

1. Install Docker Engine/Desktop with Docker Compose v2.
2. From the repository root, optionally create `.env` from `.env.example`; leave `APP_REVIEWER_TOKEN` blank unless a reviewer summary is needed.
3. Build and start the stack:

```bash
docker compose -f compose.yaml config --quiet
docker compose -f compose.yaml up --build
```

4. Open `http://localhost:5173`. API health is `http://localhost:8080/actuator/health`; the AI health route is `http://localhost:8000/api/v1/health`.
5. Smoke test all services:

```bash
./scripts/smoke-release.sh
```

The frontend image builds the Vite bundle and serves it through Nginx. API base URLs are build-time Vite values and default to localhost ports for local demonstration; change these for the actual hosting topology.

## Service health and diagnostics

- Spring Boot Actuator exposes only `health` and `info` over HTTP; health details and environment details are disabled.
- `/api/v1/release/status` is a public non-secret disclosure of prototype readiness, current persistence/identity boundaries and release gates.
- Every API response gets baseline security headers and an `X-Request-Id`; preserve this ID in trusted infrastructure logs to correlate requests without logging payload contents.
- AI request tracing uses the same safe correlation header convention. Never log `AI_API_KEY`, user questions, student profiles or documents.
- `GET /api/v1/analytics/summary` requires a server-configured reviewer token; do not put it into any `VITE_*` variable or frontend build.

## Reviewer summary token

For local demo only, create a value of at least 32 random bytes and store it in a local environment or secret store. Example local shell:

```bash
export APP_REVIEWER_TOKEN="$(openssl rand -hex 32)"
```

Send it from a trusted admin terminal, never from the browser bundle:

```bash
curl -H "X-Reviewer-Token: $APP_REVIEWER_TOKEN" \
  http://localhost:8080/api/v1/analytics/summary
```

This is a temporary prototype gate. Replace it with authenticated admin role checks before any public deployment.

## Deployment guardrails

- Never use Vite's dev server as the public production frontend; the included container uses Nginx and built assets.
- Configure HTTPS and trusted proxy headers, strict CORS origins, edge body/rate limits and an approved domain-specific CSP.
- Do not publish management/metrics endpoints directly to the internet.
- Move feature state to a governed persistent database with backups and retention/deletion jobs before a real user pilot.
- Store secrets in a managed secret facility. Never commit `.env`, private keys, provider tokens or realistic learner data.
- Run the full test suite and Docker smoke test after each release; verify restore/rollback procedures.

## Demo sequence (4 minutes)

1. Show the learner landing experience in English, Hindi or Tamil.
2. Open opportunities and show official source references and the distinction between reference records and confirmed live openings.
3. Open Trusted Learning Ecosystem and demonstrate facilitator / partner workflows with explicitly marked demo data.
4. Open Impact & Trust Centre, show optional analytics consent and the release readiness warnings. With consent enabled, send the explicit `TEST_EVENT`; explain that it updates aggregate counters only.
5. Show the grounded AI evaluation report and a negative case where unsupported claims are rejected.
6. Finish by showing `/api/v1/release/status` to state what is and is not production ready.

## Rollback / incident basics

For a prototype incident: stop traffic to the affected container, preserve only redacted request IDs and operational logs, record the build ID, roll back to the last tested image, confirm health endpoints and rerun smoke checks. Do not export or share student data as part of debugging. A production release needs a named incident owner, log-retention policy, tested backups and an approved incident response procedure.
