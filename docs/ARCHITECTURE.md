# Architecture decision record — UdaanSetu cumulative prototype

## Product principle

UdaanSetu guides rural learners from strengths and interests to learning steps and real opportunities. It complements teachers and trusted community partners; it does not decide a student's future or guarantee employment, scholarship awards or income.

## System boundaries

```text
React PWA (JavaScript)
  ├── Platform API: Java 21 / Spring Boot 3.5.x
  │     ├── Current prototype: in-memory source catalogue, review queue, eligibility rules and action events
  │     └── Future: PostgreSQL, migrations, durable audit events, role-based authorization
  └── AI Gateway: Python / FastAPI
        ├── Current prototype: lexical retrieval, source references, optional disabled-by-default model adapter
        └── Future: backend-verified retrieval, evaluation suite and approved provider integration

External official sources (each with its own permitted access terms)
```

The browser talks to APIs. It must never receive provider secrets or database credentials. The Java platform API owns core business rules and domain workflows; this increment uses in-memory stores, not durable persistence. Python provides AI-specific orchestration and model/data science dependencies; it is not the source of truth for scheme eligibility. Deterministic eligibility checks should be implemented and tested separately from natural-language generation.

## Technology choices

- Java 21 + Spring Boot 3.5.x for the core API. Spring Boot 3.5 requires Java 17+ and supports Java 21.
- React + JavaScript + Vite for fast, responsive UI iteration; Node 22.12+ is recommended for current Vite tooling.
- Python + FastAPI for the AI service boundary. Phases 09–17 provide lexical retrieval and source-linked safe responses; generation remains disabled by default.
- PWA manifest and service worker for a static-shell/offline foundation. The service worker does not cache API data or private responses.
- Future persistence: PostgreSQL with migrations and explicit ownership/retention decisions.

## Offline design rule

Offline support is progressive, not magic. Cache static assets and explicitly selected non-sensitive resources. Show data freshness and sync state. Queue only supported mutations with idempotency and conflict handling. Do not cache authentication, private profile responses or opportunity eligibility decisions as if they were guaranteed current. Time-sensitive scheme facts need freshness checks before a user acts.

## API conventions

- Prefix endpoints with `/api/v1`.
- Use JSON; include stable service names, status and version in health endpoints.
- Use predictable error bodies for domain endpoints and document any differences.
- Use bounded timeouts and graceful degradation in clients.
- Never assume a public website has an API or permission for scraping. Use approved APIs, documented exports, or manually curated public records with source URLs and review timestamps.

## Security baseline

Keep secrets out of Git and browser bundles, restrict CORS to expected origins, validate all input, authorize every protected action on the server, minimize student data, log useful audit events without sensitive payloads, and test authorization at both function and object level. Because the product may serve minors, privacy/consent and safe contact flows require explicit review before collection or mentor/employer messaging.
