# Phase 01 acceptance criteria

## Required outcomes

- `frontend/` installs, tests and produces a production build.
- The initial UI is responsive, keyboard navigable, uses semantic landmarks, and offers functional English/Hindi/Tamil shell-label switching.
- The learner-facing experience identifies sample pathways as demo content and does not claim that recommendations or government-opportunity data are live.
- The frontend checks the Java and Python health endpoints with timeouts and communicates unavailable services clearly.
- Java `/api/v1/health` returns JSON and is covered by a controller test.
- Python `/api/v1/health` and `/api/v1/capabilities` return JSON and are covered by tests.
- Service-worker caching is limited to same-origin static assets/navigation and never caches cross-origin API requests.
- CORS is configurable by environment variable; no real credentials are present in repository files.
- README explains local execution, test commands, missing implementation and intended next phases.

## Exit checks

```bash
cd frontend && npm test && npm run build
cd ../backend && mvn test
cd ../ai-service && python -m pytest
```

Optional: build and start all three services with Docker Compose. If a command is not available on the contributor machine, record the missing prerequisite rather than marking its test as passed.

## Non-goals

Phase 01 does not implement production authentication, student data persistence, live LLM inference, speech-provider calls, trusted data ingestion, application submission, guaranteed offline mutations, payments or compliance certification.
