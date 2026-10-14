# UdaanSetu — Phases 09–17: Opportunity Discovery & AI Intelligence

This is a cumulative extension of the Phase 01 repository, not a standalone mock. It adds the integrated feature slice for opportunity data ingestion/review, discovery, eligibility guidance, student actions, grounded assistance, browser voice, multilingual UI labels, offline public-data caching and retryable sync.

## Scope and phase mapping

| Phase | Shipped capability in this package | Main paths |
|---:|---|---|
| 09 | Candidate import/validation, reviewer queue, explicit approval and provenance | `backend/.../opportunity`, `frontend/src/opportunities/OpportunityReviewWorkbench.jsx` |
| 10 | Searchable catalogue, category filters, details and source links | `OpportunityController.java`, `OpportunityCentre.jsx` |
| 11 | Conservative eligibility outcomes and deadline caution | `OpportunityEligibilityEngine.java` |
| 12 | Saved/interest/application-start states and learner action API | `backend/.../actions`, `frontend/src/offline/offlinePocket.js` |
| 13 | Retrieval-first assistant, source links, no-evidence response and optional model adapter | `ai-service/app` |
| 14 | Browser voice recognition/synthesis adapter with text fallback | `frontend/src/voice/browserSpeech.js` |
| 15 | English/Hindi/Tamil labels for the opportunity experience | `frontend/src/opportunities/OpportunityCentre.jsx` |
| 16 | IndexedDB public catalogue pocket | `frontend/src/offline/offlinePocket.js` |
| 17 | Batched action sync, idempotent event IDs, retry and visible connectivity state | `StudentActionService.java`, `offlinePocket.js` |

## What to run

See root `README.md` for full instructions. In brief: Java 21 + Maven for `backend`, Python + `ai-service/requirements.txt` for FastAPI, and Node.js + npm for `frontend`. Optional Docker Compose is included for local development.

## Validation commands

```bash
./scripts/check-phase-09-17.sh
```

The packaging environment ran **6 Python tests successfully**, compiled Python modules, and transpiled **14 JavaScript/JSX files with zero syntax diagnostics**. The npm install timed out and Maven was unavailable there, so frontend tests/build and Java tests remain to be executed locally.

## Truthful capability boundaries

- The Java catalogue, review queue and learner action store are **in-memory**. Restarting the API clears them; database persistence is future work.
- The starter catalogue contains source references and one dated NSP renewal notice plus a separate general scholarship-discovery reference; it is not comprehensive and not every record is a currently open course or vacancy.
- Scheme-specific eligibility has not been encoded for the seeded scholarship entry. The checker returns `NEEDS_REVIEW` rather than guessing.
- Ingestion never crawls websites and never publishes a record automatically. Manual approval is required.
- Reviewer token gate is a local prototype control, not production auth. Student key is a demo identifier, not authentication.
- AI retrieval works over the public record set supplied to the request. Optional generation is disabled by default (`AI_PROVIDER=none`); do not send student profiles or sensitive fields to the AI endpoint.
- Browser speech depends on browser/device/network; offline speech is not guaranteed. Typed interaction remains available.
- Offline support is limited to public catalogue cache and a queue of minimal action events. New search/eligibility/AI checks require connectivity unless already represented in cached data.
- This package includes Phase 01 and phases 09–17. Phases 02–08 remain planned and must be integrated for the intended end-to-end strengths → career pathways → learning plan journey.
