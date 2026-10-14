# Opportunity & AI API Contract — v1

All platform endpoints are versioned under `/api/v1`. JSON uses camelCase field names from Java records. Public catalogue results should be treated as source-linked candidate data; the official provider remains the authority for eligibility and application status.

## Public discovery

### `GET /api/v1/opportunities`

Query parameters: `q` (optional free-text search), `type` (`SCHOLARSHIP`, `SCHEME`, `COURSE`, `APPRENTICESHIP`, `MENTOR`, `RESOURCE`), `state`, `language` (`en`, `hi`, `ta`), `page` (zero-based), `size` (1–50; default 20).

Response fields: `items`, `total`, `page`, `size`, `generatedAt`, `dataNotice`. Each item includes `id`, `title`, `summary`, `type`, `provider`, `locationLabel`, language tags, tags, `sourceName`, `sourceUrl`, `applicationUrl`, `sourceTrust`, `listingStatus`, `lastVerifiedAt`, dates, structured eligibility-rule fields, `eligibilityRulesConfigured`, `requiredDocuments`, and `nextStep`.

### `GET /api/v1/opportunities/{id}`

Returns a single visible catalogue record. Unknown IDs return 404. Expired dated items are not included in active catalogue search.

### `POST /api/v1/opportunities/{id}/eligibility-check`

Example body:

```json
{"educationLevel":"undergraduate","state":"Tamil Nadu","age":19}
```

Only send the fields needed by the opportunity's reviewed rules. The prototype does not persist eligibility-check inputs. Possible statuses are `RULES_MATCH`, `NEEDS_MORE_INFORMATION`, `POSSIBLE_MISMATCH`, and `NEEDS_REVIEW`. A result is not an official decision. `NEEDS_REVIEW` is the expected response when the record does not have complete reviewed eligibility rules.

## Learner action centre

All learner-action routes require `X-Learner-Key`. In this prototype the key is a random local demo identifier and is **not authentication**.

- `GET /api/v1/student/opportunity-actions`
- `POST /api/v1/student/opportunity-actions`
- `POST /api/v1/student/opportunity-actions/sync`

Write payload:

```json
{"clientEventId":"uuid-or-stable-client-event-id","opportunityId":"swayam-course-explorer","status":"SAVED"}
```

Batch payload wraps an `actions` array of up to 100 write payloads. `clientEventId` makes replays idempotent within the in-memory prototype store. Queue events are replayed in creation order. Cross-device conflict resolution, durable event storage, authenticated identity and retention controls remain future production work.

Valid action statuses: `SAVED`, `INTERESTED`, `APPLICATION_STARTED`, `APPLIED`, `COMPLETED`, `NOT_INTERESTED`.

## Reviewer-gated source ingestion

All review routes require `X-Reviewer-Token`; set `APP_REVIEWER_TOKEN` in the environment. The local default exists only for local development.

- `POST /api/v1/opportunity-ingestion/preview` — validates and stages up to 100 candidate records; it does not publish.
- `GET /api/v1/opportunity-ingestion/review-queue?status=PENDING` — fetch review items.
- `POST /api/v1/opportunity-ingestion/review-queue/{reviewId}/decision` — body `{"approved":true,"note":"Reviewed source and requirements"}`.

The ingestion service does not fetch external URLs. It validates URL shape, basic date/range checks, duplicate IDs and structured-rule configuration, then asks a human to review. Non-allowlisted source hosts require a meaningful review note before approval. A successful decision publishes only into this prototype's in-memory catalogue.

## AI gateway

### `POST http://localhost:8000/api/v1/assistant/grounded-answer`

Body: `question`, `language`, `records`. Records must include their source URL. The default retrieval mode returns matches and source links without generative claims. If there is no evidence match, the service returns `NO_SUPPORTED_EVIDENCE`. Optional model generation is disabled unless an approved OpenAI-compatible endpoint is configured, and its output is rejected if it contains no citation to a retrieved record ID.

### Capability endpoints

- `GET /api/v1/voice/capabilities` — available locale tags and honest speech/offline limits.
- `GET http://localhost:8000/api/v1/capabilities` — retrieval/model configuration status.

## Error posture

Use explicit statuses, friendly error messages and source fallback behavior. Never convert network errors into fabricated opportunities. Never infer eligibility from empty criteria. Client-side offline queue writes must remain queued when batch sync fails.
