# Privacy and Security Control Register — Phase 26

This register distinguishes implemented prototype controls from controls that still require real identity, infrastructure, legal and safeguarding work.

| Control | Status in this increment | Limitation / production requirement |
|---|---|---|
| Data minimization for analytics | Implemented in event schema | Review all future event additions and every other feature's data model separately. |
| Aggregate-only event counters | Implemented in memory | No persistent retention/aggregation window; restart resets counters. |
| Consent preference UI/API | Implemented as prototype | `X-Actor-Key` is not proof of identity. Do not use this as legally sufficient consent for real users. |
| Data-rights request record | Prototype workflow | Request status is `PENDING_MANUAL_REVIEW`; no automatic whole-system export or deletion exists. |
| Request correlation ID | Implemented; UUID-only client IDs are accepted, otherwise server-generated; included in MDC logging context | Ensure edge proxy preserves or replaces request IDs and avoids logging secrets. |
| Security response headers | Implemented | Validate final browser CSP with production deployment and any extra integrations. |
| API body size check | Content-Length ceiling in application and Nginx config | Configure equivalent limit on all production ingress paths; chunked body limits require edge enforcement. |
| Coarse rate limiting | Per-process in-memory limiter | Not distributed, not persistent, not a DDoS control; enforce limits at a trusted gateway too. |
| Reviewer summary access | Disabled until strong token configured | Token header is a temporary demo gate, not RBAC; use SSO/OIDC or equivalent server-side auth in production. |
| Operational health | Health/info only | Keep management endpoints behind trusted network controls and monitor externally. |
| Child safety | Design prompts and release gates documented | Requires trained human review, safeguarding policy, identity verification for external adults/partners and legally reviewed processes. |
| Secrets | Environment based | Use managed secrets, rotation, least privilege and leak scanning; never ship secrets in Vite `VITE_*` values. |
| External integrations | Off by default | Validate official terms, approved scopes, privacy impact and service credentials before enabling. |
| Payment processing | Not implemented | No card/bank data or real payments are collected by the prototype. |

## Trust boundaries

- Student PWA: untrusted client. Any browser-held actor key is forgeable and must never authorize access to another person's data.
- Java platform API: business rules, validation, permission checks and audit boundaries. Current in-memory module slices use prototype identity headers and are not production authorization.
- Python AI gateway: handles only the question and curated records explicitly submitted to it; optional model calling is disabled by default. Never send a student profile or personal records without a reviewed purpose, consent and provider terms.
- External provider: untrusted until integration contracts, access scopes, URL validation, timeouts, error handling and privacy review are completed.
- Data store: current feature slices are in-memory; use governed persistence, encryption, backups, access controls and retention jobs before pilot.

## Mandatory pre-pilot gates

1. Real authentication and role-based authorization on each endpoint; test IDOR and cross-tenant access.
2. Complete personal-data inventory, lawful basis/consent analysis, retention schedule, export/deletion procedures and legal review.
3. Child safeguarding and safe adult contact workflows reviewed with qualified stakeholders.
4. Threat model including prompt injection, malicious partner listings, external URL abuse, injection and dependency risk.
5. Trusted reverse proxy, TLS, edge rate limiting, monitoring/alerts, backups and recovery rehearsal.
6. Dependency and container vulnerability review, SBOM, license review and secure secret management.
7. Documented incident response owner and reporting workflow.
