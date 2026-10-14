# Integration notes — cumulative Phase 01 + Phases 09–17 package

1. Extract this archive as the repository root and open the root folder in VS Code; do not nest the repository a second time.
2. This archive contains Phase 01 and the capability slice for Phases 09–17. Phases 02–08 remain planned, so learner profile/persona, strengths discovery, taxonomy, career matching, pathways and structured exam/course planning must be added before the complete promised journey exists.
3. Java owns catalogue records, ingestion-review decisions, eligibility logic and learner-action endpoints. Python offers retrieval-first AI assistance; it is not a source of truth for scheme eligibility.
4. The starter catalogue includes portal references and a dated NSP notice; it is neither a national opportunity database nor a guarantee that every record is currently open.
5. Source review is local-demo gated. `APP_REVIEWER_TOKEN` is not production authentication. The `?review=1` URL flag only reveals the UI and is not a security control.
6. No external URLs are crawled or automatically published. Do not add a scraper or API integration until source terms, access and permission have been checked.
7. Java catalogue, review queue and student action maps are in-memory. Apply a durable database/migrations phase before multi-user or public deployment.
8. AI generation defaults to disabled. It operates on public record metadata supplied in the request, and this is not a secure server-side RAG trust boundary. Do not send profile data, private documents, identifiers or sensitive information to this service.
9. The offline pocket stores only public listings and minimal action events in browser storage. It is not secure identity storage; the random learner key is not authentication. Browser speech is not guaranteed to work offline.
10. Run `./scripts/check-phase-09-17.sh` and manually execute all skipped commands before merging. See `docs/PHASE_09_17_ACCEPTANCE.md` for release gates.
11. No credentials are included intentionally. Inject local secret values through an ignored `.env` file or a proper secret manager; never commit them.
