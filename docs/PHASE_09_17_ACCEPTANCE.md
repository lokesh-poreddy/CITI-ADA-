# Phase 09–17 Acceptance Gates

A feature is not accepted because its files exist. Run the checks on the integrated repository.

## Phase 09 — Ingestion and review

- [ ] Valid JSON candidate is staged as `PENDING` and is not returned in public search.
- [ ] HTTP, malformed source URL, invalid date range, invalid age range and duplicate ID create blockers.
- [ ] Non-allowlisted host creates a warning and requires a reviewer note to approve.
- [ ] A human approval is required before publication; rejected item remains absent from public search.
- [ ] Review token is read from environment. Team documents why this is a prototype gate, not production security.

## Phase 10 — Opportunity discovery

- [ ] Search supports keyword, type, language and optional state filters.
- [ ] Cards show type, provider, source trust, date metadata and direct source link.
- [ ] Portal references are not presented as specific verified open vacancies/courses.
- [ ] Expired items are not returned in active search.
- [ ] API failure falls back to cached catalogue or clearly labelled starter references.

## Phase 11 — Eligibility and deadlines

- [ ] Incomplete rule set returns `NEEDS_REVIEW`.
- [ ] Missing inputs return `NEEDS_MORE_INFORMATION`.
- [ ] Out-of-range values return `POSSIBLE_MISMATCH` with a non-final-decision warning.
- [ ] Matching values return `RULES_MATCH`, but still state that only the source provider confirms eligibility.
- [ ] Deadline labels remain cautious and a record's source URL is visible.

## Phase 12 — Learner action centre

- [ ] Save, interest and application-start actions update local UI immediately.
- [ ] Saved items remain visible after a component reload/reopen on the same device.
- [ ] Invalid/missing learner key or unknown opportunity ID is rejected.
- [ ] Repeating the same event ID does not create a duplicate action in the current server process.
- [ ] Action records contain no free-text personal notes.

## Phase 13 — Grounded AI assistant

- [ ] Query matches relevant source records and returns source URLs.
- [ ] One-tap scholarship/course/apprenticeship prompts work in English, Hindi and Tamil without requiring keyboard entry.
- [ ] Unsupported query returns `NO_SUPPORTED_EVIDENCE`.
- [ ] Generation is disabled by default and capability endpoint accurately states that.
- [ ] If optional generation is configured, output without exact record citation falls back to retrieval-only.
- [ ] AI service timeout does not break catalogue browsing and does not produce fabricated fallback content.

## Phase 14 — Voice

- [ ] Voice input uses language tag `en-IN`, `hi-IN` or `ta-IN` according to UI selection.
- [ ] Unsupported browser and denied microphone permission produce an actionable message.
- [ ] Transcript can be edited before submission.
- [ ] Read-aloud is optional; text answer remains visible.
- [ ] UI does not promise offline voice support.

## Phase 15 — Localization

- [ ] Language switch updates opportunity centre core controls, error states and disclaimers.
- [ ] Text does not overflow on a 320px-wide viewport.
- [ ] English source titles and original provider text remain intact if no verified translation exists.

## Phase 16 — Offline pocket

- [ ] Public catalogue is cached in IndexedDB after successful fetch.
- [ ] Local action queue works while offline and indicates pending sync.
- [ ] Service worker continues not to cache `/api/**` responses.
- [ ] Public learner view does not expose curation controls unless the local `?review=1` demo flag is present.
- [ ] No profile, document, income, credential or authentication data is stored in this pocket.

## Phase 17 — Sync and recovery

- [ ] Batch sync is one request for queued events when online.
- [ ] Events replay in creation order.
- [ ] Network error preserves every queued event for retry.
- [ ] Successful response removes queued records and marks action state synchronized.
- [ ] Duplicate event replay is idempotent in the current server process.
- [ ] Team documents that production multi-device conflicts and durable receipts are not yet implemented.

## Cross-phase integration gates

- [ ] Frontend `npm test` and `npm run build` pass.
- [ ] Backend `mvn test` passes with no test disabled to work around the new APIs.
- [ ] AI gateway `python -m pytest -q` passes.
- [ ] Browser demo works on a small mobile viewport with a 3G/slow network profile.
- [ ] Official-source links open and all seed-data caveats remain visible.
- [ ] No credentials/tokens are in source control, frontend build variables, screenshots or demo data.
