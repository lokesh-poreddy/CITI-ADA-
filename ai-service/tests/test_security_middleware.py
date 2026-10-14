from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_ai_responses_include_security_headers_and_request_id():
    response = client.get('/api/v1/health', headers={'X-Request-Id': 'b8b73b64-2d46-4f86-8f31-9b64d2fdb9ab'})
    assert response.status_code == 200
    assert response.headers['x-request-id'] == 'b8b73b64-2d46-4f86-8f31-9b64d2fdb9ab'
    assert response.headers['x-content-type-options'] == 'nosniff'
    assert response.headers['x-frame-options'] == 'DENY'
    assert response.headers['cache-control'] == 'no-store'


def test_invalid_request_id_is_replaced():
    response = client.get('/api/v1/health', headers={'X-Request-Id': 'bad id with spaces'})
    assert response.status_code == 200
    assert ' ' not in response.headers['x-request-id']


def test_oversized_ai_body_is_rejected_before_json_validation():
    response = client.post('/api/v1/assistant/grounded-answer', content='{}', headers={
        'Content-Type': 'application/json', 'Content-Length': str(1_048_577)
    })
    assert response.status_code == 413


def test_per_peer_rate_limiter_blocks_excess_assistant_calls():
    from fastapi import FastAPI
    from starlette.testclient import TestClient
    from app.security_middleware import SecurityControlsMiddleware

    isolated = FastAPI()

    @isolated.post('/api/v1/assistant/grounded-answer')
    def assistant_stub():
        return {'status': 'ok'}

    isolated.add_middleware(SecurityControlsMiddleware, limit_per_minute=1)
    isolated_client = TestClient(isolated)
    assert isolated_client.post('/api/v1/assistant/grounded-answer', json={}).status_code == 200
    limited = isolated_client.post('/api/v1/assistant/grounded-answer', json={})
    assert limited.status_code == 429
    assert limited.headers['retry-after'] == '60'
