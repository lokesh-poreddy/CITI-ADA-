# API contract — cumulative platform (Phase 01 foundation + Phases 09–17)

## Java platform API

`GET /api/v1/health`

Example response:

```json
{
  "status": "UP",
  "service": "udaan-setu-platform-api",
  "version": "0.7.1",
  "timestamp": "2026-10-14T08:30:00Z"
}
```

## Python AI service

`GET /api/v1/health`

Example response:

```json
{
  "status": "UP",
  "service": "udaan-setu-ai-gateway",
  "version": "0.7.1",
  "capabilities": {
    "retrieval": false,
    "generation": false,
    "speech": false
  }
}
```

`GET /api/v1/capabilities` exposes the same declared flags. False means not yet implemented in this phase; it is not a claim that a provider is configured.

## Compatibility rules

- Keep service names and `status` stable.
- Add fields compatibly where possible; avoid changing a field's meaning.
- Never include credentials, tokens, user profile information or trace payloads in health responses.
