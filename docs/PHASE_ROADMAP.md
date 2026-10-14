# UdaanSetu — 28-phase development roadmap

The plan follows **Approach A: End-to-End Ownership (Vertical Development)**. A team member owns a complete user-visible capability from discovery and UI through API, data, AI, tests, documentation and demo. Ownership is feature-oriented—not “one person only frontend, one person only backend.”

The numbers represent an implementation sequence, not a promise that all phases must be completed for a hackathon demo. The current cumulative package includes Phase 01, learner-journey prototype slices for Phases 02–08, plus feature slices for Phases 09–28. The learner journey is functional using local rule-based matching and optional temporary server matching; production authentication, durable reviewed data and field validation remain open.

| Phase | Topic | End-to-end slice / acceptance outcome |
|---:|---|---|
| 01 | Platform foundation & experience shell | Repository standards, responsive product shell, Java API health, Python AI boundary, PWA baseline and local run instructions. |
| 02 | Language-first onboarding | **Implemented in prototype:** the language picker is integrated with the journey; text remains available if voice is unsupported. |
| 03 | Learner profile & consent | **Implemented in prototype:** minimal non-identifying profile, local-first save/clear, optional server-processing toggle, 30-minute in-memory API profile. This is not production consent or authentication. |
| 04 | Strengths and interest discovery | **Implemented in prototype:** interests, strengths, goals, “not sure yet” options, validation and editable responses. |
| 05 | Career and skill taxonomy | **Implemented in prototype:** six pathway families spanning vocational, creative, community, enterprise, analytical and education/language directions. |
| 06 | Explainable career matching | **Implemented in prototype:** stable deterministic scores and signal reasons locally; optional matching API; score explicitly described as relative alignment, not probability or psychometric result. |
| 07 | Personalized learning pathway | **Implemented in prototype:** three-step practical plan, resource links, caution notes, saved pathway and local recovery. |
| 08 | Exams, courses and credential planning | **Partially implemented in prototype:** general learning resources and skill/exam exploration links are included; a complete structured, verified exam/prerequisite dataset is still required. |
| 09 | Opportunity data ingestion & editorial review | Import/curate opportunities, provenance fields, moderation, expiry and reviewer workflow. |
| 10 | Scholarship and scheme discovery | Search and match scholarship/scheme records to profile attributes without guessing missing eligibility facts. |
| 11 | Eligibility and deadline checker | Deterministic rule checks, missing-document prompts, dates, explanations and safe “needs verification” outcomes. |
| 12 | Student Opportunity Action Centre | Saved opportunities, checklists, application handoff, status tracking and actionable next steps. |
| 13 | Grounded AI assistant | Retrieval-grounded explanations with source references, unsupported-question handling and evaluation set. |
| 14 | Voice interaction service | Speech-to-text/text-to-speech adapter, confirmation for uncertain transcripts, fallback to text and user controls. |
| 15 | Multilingual content framework | Translation dictionary/content catalogue, locale formatting, language quality checks and extension guide. |
| 16 | Offline learner pocket | Cache application shell and user-selected non-sensitive resources; indicate freshness and unavailable actions. |
| 17 | Sync queue and conflict recovery | Queue supported mutations, idempotency, retry/backoff, conflict states and sync review. |
| 18 | Facilitator workspace | Cohort roster, student referral/recommendations, next-step review and least-privilege permissions. |
| 19 | Learning module authoring | Facilitators build and revise training modules, publish/unpublish, version content and set access terms. |
| 20 | Mentor discovery and safe connection | Verified mentor profiles, expertise, availability, controlled contact request and safeguarding controls. |
| 21 | Apprenticeship, internship and employer listings | Partner verification, listings, eligibility, application handoff and status visibility. |
| 22 | Partner/API integration adapters | Documented, replaceable adapters and data contracts; only use integrations with approved access. |
| 23 | Reminder and notification centre | Consent-aware reminders, deadlines, offline queues and notification preference controls. |
| 24 | Monetization and sustainability | Pricing experiments for institutions/sponsors/modules; transparent paid placement policy and access safeguards. |
| 25 | Impact analytics and reporting | Privacy-aware funnel metrics, user outcomes, facilitator effort, opportunity quality and transparent definitions. |
| 26 | Security, privacy and child-safety hardening | Role/object authorization, data minimization, abuse cases, audit trail, dependency/security review and retention rules. |
| 27 | Integrated quality & AI evaluation | Cross-device, accessibility, weak-network, security, source correctness, multilingual and regression suites. |
| 28 | Release, observability and showcase | Reproducible deployment, configuration validation, demo seed data, recovery plan, pitch flow and known-limitations register. |

## MVP definition

The intended MVP is the smallest complete path through Phases 02–12: understand the learner, present more than one sensible pathway, connect it to a short learning plan, display a source-backed opportunity, and let a facilitator support the next step. Phase 01 supplies the foundation required for this sequence.

## Package discipline

Each phase ZIP should contain only new/changed files plus `phase-manifest.json`, `README.md`, `CHANGELOG.md`, and `integration-notes.md`. Do not copy the whole repository into every ZIP. On integration, apply the delta to the canonical Git repository and produce a separate full-release ZIP at Phase 28.


## Implementation status snapshot (Phase 25–28 package)

- Phase 01: foundation included.
- Phases 09–17: feature increment included.
- Phases 18–24: facilitator/partner/sustainability increment included in prototype form.
- Phases 25–28: analytics, prototype privacy/security controls, deterministic AI evaluation, container/CI and release observability are implemented in prototype form, with full React/Maven/Docker verification still required.
- Phases 02–07: integrated in prototype form with a local-first learner wizard, six explainable pathway families, temporary server profile/matching APIs, and a three-step local learning plan.
- Phase 08: starter course/resource links are present; a governed, source-verified exam and credential catalogue remains open.
- Release boundaries remain: temporary server profile storage is in-memory, not authentication; rule scores are not scientifically validated; some pathway resources require internet; translations of opportunity records and detailed partner forms are incomplete.

“Included in prototype form” means an endpoint/UI/service slice is implemented, not that it has production persistence, secure production identity, official external integration, or field validation.


## Post-28 engineering increments (maintenance roadmap)

### Phase 29 — Durable opportunity catalogue and review queue
Persist reviewed opportunity records and their review decisions through JDBC and Flyway. Use file-backed H2 for local development and PostgreSQL in Compose. This does not yet migrate learner profile, partner listing, mentor, facilitator, notification, privacy ledger or analytics storage.

### Phase 30 — Central reviewer policy and fail-closed production boundary
Centralize the minimum token-strength / constant-time check for prototype reviewer routes and disable routes relying on spoofable actor headers in the `prod` profile. A genuine identity provider and RBAC layer remains required before production use.
