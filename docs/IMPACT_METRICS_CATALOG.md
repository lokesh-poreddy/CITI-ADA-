# Impact Metrics Catalog — Phase 25

## Design rules

1. Capture only fixed events needed to test whether the learner journey is usable.
2. Do not send names, contact information, raw prompts, student profile data, caste/category, income, school identifiers, exact location, documents, or arbitrary metadata.
3. Optional analytics must not be required for core learning or opportunity discovery.
4. Event counts in this prototype are in-memory aggregates and reset when the API restarts.
5. Aggregate metrics indicate product activity; they do not prove learning gains, employment, scholarship award, or economic mobility.

## Event vocabulary

| Event | Meaning | Primary funnel use |
|---|---|---|
| `PROFILE_STARTED` | User starts the profile flow | Onboarding start |
| `PROFILE_COMPLETED` | User completes minimum profile | Onboarding completion |
| `PATHWAY_VIEWED` | User opens a pathway | Discovery engagement |
| `OPPORTUNITY_OPENED` | User opens a catalogue item | Opportunity relevance proxy |
| `OPPORTUNITY_SAVED` | User saves an opportunity | Intent proxy |
| `APPLICATION_STARTED` | User begins an application handoff | Actionability proxy |
| `APPLICATION_HANDED_OFF` | User opens the provider's application route | Funnel completion proxy, not proof of submission |
| `FACILITATOR_REFERRAL_CREATED` | Facilitator initiates a learner referral | Assisted support usage |
| `LEARNING_MODULE_OPENED` | User opens a module | Learning content usage |
| `OFFLINE_SYNC_SUCCEEDED` | Queued action sync completes | Low-connectivity reliability |
| `OFFLINE_SYNC_CONFLICT` | Sync detects a conflict | Recovery and UX work |
| `ASSISTANT_NO_SUPPORTED_EVIDENCE` | AI assistant abstains due to lack of retrieved support | Coverage gaps, not a model-failure count on its own |
| `TEST_EVENT` | Explicit QA/demo event | Smoke test only; exclude from product KPI calculations |

## Captured dimensions

- Event name from enum above.
- Actor role from `STUDENT`, `FACILITATOR`, `PARTNER`, `ANONYMOUS`.
- Language from `en`, `hi`, `ta`, `unknown`.
- Connectivity from `ONLINE`, `OFFLINE`, `UNKNOWN`.
- Server-side summary date.

The event body contains no actor identifier. The UI sends the prototype `X-Actor-Key` header only so the API can check that `OPTIONAL_ANALYTICS` was granted; the API hashes this reference for the consent lookup and does not pass it to the analytics counter service. No actor identifier or per-person event row is stored by the analytics service. The actor header is still forgeable and is not authentication.

## KPI definitions for a future persisted analytics pipeline

- **Profile completion rate** = distinct consenting profile completions / distinct consenting profile starts in a defined cohort and period. The current aggregate-only prototype cannot calculate distinct users; add appropriate privacy review before any cohort/user counting.
- **Pathway action rate** = application handoffs or saved opportunities / pathway views. Current fixed counts can support a rough event-count ratio only when the reporting window and double-counting assumptions are explicit.
- **Opportunity relevance** = human-reviewed relevant recommendations / reviewed recommendations. Requires a separately governed evaluation sample; event counts alone cannot prove relevance.
- **Weak-network task completion** = completed core tasks / attempted core tasks during a defined network profile. This must be measured in user/device tests rather than inferred from aggregate events alone.
- **Facilitator effort** = time per supported learner in a documented baseline vs. prototype task. Requires usability testing; do not infer from clicks.

## Administrative access

`GET /api/v1/analytics/summary` requires a configured `APP_REVIEWER_TOKEN` of at least 24 characters and a matching `X-Reviewer-Token` request header. Keep this endpoint off public dashboards. Never expose the token in frontend source, static bundle variables or committed `.env` files.
