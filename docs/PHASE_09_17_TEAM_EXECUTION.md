# Team Execution Plan — Phases 09–17 (Approach A)

## Delivery model

Use vertical feature ownership. A feature owner is accountable for the visible interaction, Java API/domain implementation, Python AI boundary if needed, cache/sync behavior, tests, documentation and an integrated demonstration. Avoid assigning the entire frontend to one person and the entire backend to another.

## Suggested ownership assignments

| Feature owner | Phases | End-to-end responsibility |
|---|---|---|
| Opportunity data owner | 09–10 | Import preview, source governance, reviewer workbench, catalogue search, record freshness and source links. |
| Eligibility/action owner | 11–12 | Eligibility rules and warnings, deadline handling, save/interest/application-start states, idempotent event writes. |
| AI/voice owner | 13–14 | Retrieval relevance, citations, no-evidence behavior, model adapter controls, browser speech and correction path. |
| Localization/accessibility owner | 15 | Locale dictionaries, language toggle, accessible labels, untranslated-source handling and small-screen QA. |
| Offline/reliability owner | 16–17 | IndexedDB public catalogue cache, action queue, batching, retry, sync status and offline test scenarios. |
| Rotating integrator / QA lead | All | Maintains integration branch, runs smoke tests, reviews manifests, tracks cross-service contract changes, prepares demo fallback. |

If there are fewer people, combine roles. If there are more, split by coherent user journey but keep a single accountable owner per phase.

## Integration sequence

1. Agree API fields and acceptance checks before a feature owner starts implementation.
2. Build against the canonical repository, not a copied isolated repository.
3. Commit UI + API/domain changes + tests + docs together where possible.
4. Run local tests and a small-phone manual pass before requesting merge.
5. Merge through the integration branch; do not release a feature whose frontend expects fields that the API does not return.
6. At each phase exit, update the phase manifest and demo notes.

## Definition of done for each phase

- The user story and acceptance criteria are met in the integrated application.
- Loading, empty, error, unavailable-service, low-connectivity and success states are accounted for.
- Public facts show source provenance and last-checked information where applicable.
- Personal data is minimized; no real learner personal details are placed in seed fixtures.
- Unit/integration tests pass on the contributor machine, or an unresolved test is documented as a blocker.
- No secrets are included in source, ZIPs, frontend build variables, screenshots or demo accounts.
- Documentation describes what works, what is mocked, what requires network access and what remains a prototype limitation.

## Demo owner checklist

- Have a fully local fallback demonstration using the curated reference catalogue.
- Show one record entering the review queue, then show that it is not public until approved.
- Show a conservative eligibility outcome for a record without encoded rules.
- Save an opportunity while offline and demonstrate the pending-sync state.
- Restore connectivity and show a single batch-sync attempt; retry safely if the service was unavailable.
- Ask an unsupported AI question and show the no-supported-evidence response.
- Demonstrate that voice can fail gracefully and text remains usable.
