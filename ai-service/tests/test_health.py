from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_health_reports_retrieval_and_disabled_by_default_generation() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "UP"
    assert body["service"] == "udaan-setu-ai-gateway"
    assert body["version"] == "0.7.1"
    assert body["capabilities"]["retrieval"] is True
    assert body["capabilities"]["generationConfigured"] is False
    assert "timestamp" in body

def test_capabilities_endpoint_discloses_provider_configuration() -> None:
    response = client.get("/api/v1/capabilities")
    assert response.status_code == 200
    body = response.json()
    assert body["retrieval"] is True
    assert body["configuredModelProvider"] == "none"
    assert body["generationConfigured"] is False
    assert body["speechProvider"] == "browser-native-if-supported"
