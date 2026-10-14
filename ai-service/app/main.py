"""AI gateway for evidence-grounded guidance.

Default behavior is local retrieval only. No hosted model is called unless an approved
OpenAI-compatible or Ollama endpoint is explicitly configured.
"""
from __future__ import annotations
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.config import ALLOWED_ORIGINS, SERVICE_NAME, SERVICE_VERSION, AI_PROVIDER, AI_BASE_URL, AI_MODEL
from app.assistant_schemas import GroundedAnswerRequest, GroundedAnswerResponse, RetrievedSource
from app.retrieval import SearchRecord, retrieve
from app.model_gateway import generate_grounded_answer
from app.security_middleware import SecurityControlsMiddleware

app = FastAPI(
    title="UdaanSetu AI Gateway",
    description="Source-grounded opportunity retrieval with optional explicitly configured model generation.",
    version=SERVICE_VERSION,
    docs_url="/docs",
    redoc_url=None,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Accept", "Content-Type", "X-Request-Id"],
    expose_headers=["X-Request-Id"],
)
app.add_middleware(SecurityControlsMiddleware, limit_per_minute=30)

class CapabilityFlags(BaseModel):
    retrieval: bool = True
    configuredModelProvider: str = "none"
    generationConfigured: bool = False
    speechProvider: str = "browser-native-if-supported"

class ServiceHealth(BaseModel):
    status: str
    service: str
    version: str
    timestamp: datetime
    capabilities: CapabilityFlags

@app.get("/api/v1/health", response_model=ServiceHealth, tags=["health"])
def health() -> ServiceHealth:
    return ServiceHealth(status="UP", service=SERVICE_NAME, version=SERVICE_VERSION,
        timestamp=datetime.now(timezone.utc), capabilities=CapabilityFlags(
            retrieval=True, configuredModelProvider=AI_PROVIDER,
            generationConfigured=AI_PROVIDER in {"ollama", "openai-compatible"} and bool(AI_BASE_URL and AI_MODEL)))

@app.get("/api/v1/capabilities", response_model=CapabilityFlags, tags=["health"])
def capabilities() -> CapabilityFlags:
    return CapabilityFlags(retrieval=True, configuredModelProvider=AI_PROVIDER,
        generationConfigured=AI_PROVIDER in {"ollama", "openai-compatible"} and bool(AI_BASE_URL and AI_MODEL))

@app.get("/api/v1/voice/capabilities", tags=["voice"])
def voice_capabilities() -> dict:
    return {"languageTags": ["en-IN", "hi-IN", "ta-IN"], "recognition": "browser-native-if-supported",
        "synthesis": "browser-native-if-supported", "offlineGuarantee": False,
        "notice": "Speech recognition and voices depend on the browser/device. Text remains available."}

@app.post("/api/v1/assistant/grounded-answer", response_model=GroundedAnswerResponse, tags=["assistant"])
async def grounded_answer(request: GroundedAnswerRequest) -> GroundedAnswerResponse:
    records = [SearchRecord(id=item.id, title=item.title, summary=item.summary, source_name=item.sourceName,
        source_url=str(item.sourceUrl), source_trust=item.sourceTrust, last_verified_at=item.lastVerifiedAt,
        type=item.type, deadline=item.deadline) for item in request.records]
    hits = retrieve(request.question, records, limit=5)
    if not hits:
        messages = {
            "en": "I could not find enough support in the provided opportunity records to answer that safely. Try a different phrase or open an official source.",
            "hi": "दिए गए अवसर रिकॉर्ड में इसका सुरक्षित उत्तर देने के लिए पर्याप्त जानकारी नहीं मिली। अलग शब्दों से खोजें या आधिकारिक स्रोत खोलें।",
            "ta": "கொடுக்கப்பட்ட வாய்ப்பு பதிவுகளில் இதற்கு நம்பகமான பதில் அளிக்க போதுமான தகவல் இல்லை. வேறு சொற்களால் தேடவும் அல்லது அதிகாரப்பூர்வ மூலத்தைத் திறக்கவும்."
        }
        return GroundedAnswerResponse(status="NO_SUPPORTED_EVIDENCE", answer=messages[request.language], language=request.language,
            sources=[], modelUsed=False, notice="No unsupported facts were generated.", clarificationPrompt="Are you looking for a course, scholarship, scheme, or apprenticeship?")

    evidence = [{"id": item.id, "title": item.title, "summary": item.summary, "sourceName": item.source_name,
                "sourceUrl": item.source_url, "sourceTrust": item.source_trust, "lastVerifiedAt": item.last_verified_at, "deadline": item.deadline}
                for item, score in hits]
    model_answer = await generate_grounded_answer(request.question, request.language, evidence)
    messages = {
        "en": "I found related records in the provided catalogue. Open the source link to confirm current eligibility, documents, deadlines and application steps.",
        "hi": "दिए गए कैटलॉग में संबंधित रिकॉर्ड मिले। पात्रता, दस्तावेज़, अंतिम तिथि और आवेदन प्रक्रिया की पुष्टि के लिए आधिकारिक स्रोत खोलें।",
        "ta": "கொடுக்கப்பட்ட பட்டியலில் தொடர்புடைய பதிவுகள் கிடைத்தன. தகுதி, ஆவணங்கள், கடைசி தேதி மற்றும் விண்ணப்ப படிகளை உறுதிப்படுத்த அதிகாரப்பூர்வ மூலத்தைத் திறக்கவும்."
    }
    sources = [RetrievedSource(id=item.id, title=item.title, sourceName=item.source_name, sourceUrl=item.source_url,
        sourceTrust=item.source_trust, lastVerifiedAt=item.last_verified_at, deadline=item.deadline, score=round(score, 2)) for item, score in hits]
    return GroundedAnswerResponse(status="MATCHED", answer=model_answer or messages[request.language], language=request.language,
        sources=sources, modelUsed=bool(model_answer),
        notice="Catalogue matches are not official eligibility decisions. Check every detail with the source provider.",
        clarificationPrompt="Would you like to check a specific scheme's eligibility or look for courses?")

@app.get("/", include_in_schema=False)
def root() -> dict[str, str]:
    return {"service": SERVICE_NAME, "status": "UP", "docs": "/docs"}
