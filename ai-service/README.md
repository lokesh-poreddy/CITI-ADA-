# UdaanSetu AI gateway — Phases 09–17

The Python/FastAPI service provides a **retrieval-first** answer boundary over public opportunity records supplied by the client. It returns source references, a localized safe fallback and `NO_SUPPORTED_EVIDENCE` when no record matches. Optional generation uses an explicitly configured OpenAI-compatible chat-completions endpoint and is disabled by default.

## Run

```bash
python -m venv .venv
source .venv/bin/activate           # Windows: .venv\\Scripts\\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health: `/api/v1/health`; capabilities: `/api/v1/capabilities`; voice capabilities: `/api/v1/voice/capabilities`; OpenAPI UI: `/docs`.

## Configuration

- `AI_PROVIDER=none` keeps responses retrieval-only (recommended for local/offline demo).
- Only set `AI_PROVIDER=openai-compatible` or `ollama` with an approved and reachable endpoint, plus `AI_BASE_URL` and `AI_MODEL`.
- `AI_API_KEY` stays in the server environment and must never be placed in `VITE_*` frontend variables.
- The generation layer times out and falls back to the source-grounded retrieval response if unavailable. It rejects a generated answer if no exact retrieved record ID is cited.

## Data and privacy constraints

This current interface accepts source-linked public catalogue records in the request. It is a prototype boundary, not production server-verified retrieval: a browser client could alter request records. Keep generation disabled for public deployment until the backend supplies and validates authorized catalogue context. Do not send learner profiles, contact details, credentials, financial fields or documents to this service.

The current retrieval method is lexical matching. It is not an embedding/vector search, does not scrape official websites, does not refresh current listings and does not make eligibility decisions. All official criteria and dates must be checked against the linked provider.

Run tests using `python -m pytest -q` from this directory.
