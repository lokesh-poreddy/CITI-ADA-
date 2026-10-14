from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

RECORDS = [
    {"id": "nsp-demo", "title": "National Scholarship Portal renewal notice", "summary": "Check official scholarship renewal and current scheme eligibility.", "sourceName": "National Scholarship Portal", "sourceUrl": "https://scholarships.gov.in/Students", "sourceTrust": "OFFICIAL_PORTAL", "lastVerifiedAt": "2026-10-14", "type": "SCHOLARSHIP"},
    {"id": "swayam-course", "title": "SWAYAM course search", "summary": "Search online courses and verify each course's enrolment window.", "sourceName": "SWAYAM", "sourceUrl": "https://swayam.gov.in/search_courses", "sourceTrust": "REFERENCE_ONLY", "lastVerifiedAt": "2026-10-14", "type": "COURSE"},
]

def test_grounded_assistant_returns_source_for_relevant_question():
    response = client.post("/api/v1/assistant/grounded-answer", json={"question": "How do I find scholarship renewal?", "language": "en", "records": RECORDS})
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "MATCHED"
    assert body["sources"]
    assert body["sources"][0]["sourceUrl"].startswith("https://")
    assert "official" in body["answer"].lower() or "source" in body["answer"].lower()
    assert body["modelUsed"] is False

def test_grounded_assistant_does_not_make_up_unmatched_information():
    response = client.post("/api/v1/assistant/grounded-answer", json={"question": "What is the secret lottery number?", "language": "en", "records": RECORDS})
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "NO_SUPPORTED_EVIDENCE"
    assert body["sources"] == []
    assert "could not find" in body["answer"].lower() or "couldn't find" in body["answer"].lower()

def test_voice_capabilities_are_candid_about_offline_support():
    response = client.get("/api/v1/voice/capabilities")
    assert response.status_code == 200
    assert response.json()["offlineGuarantee"] is False


def test_grounded_assistant_rejects_non_https_source_urls():
    records = [{**RECORDS[0], "sourceUrl": "http://scholarships.gov.in/Students"}]
    response = client.post("/api/v1/assistant/grounded-answer", json={
        "question": "Find scholarship renewal", "language": "en", "records": records
    })
    assert response.status_code == 422
