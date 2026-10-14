"""Environment-driven configuration. Optional model credentials are never logged."""
import os

SERVICE_NAME = "udaan-setu-ai-gateway"
SERVICE_VERSION = "0.7.1"
ALLOWED_ORIGINS = [item.strip() for item in os.getenv("AI_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if item.strip()]
AI_PROVIDER = os.getenv("AI_PROVIDER", "none")
AI_BASE_URL = os.getenv("AI_BASE_URL", "").strip()
AI_MODEL = os.getenv("AI_MODEL", "").strip()
AI_API_KEY = os.getenv("AI_API_KEY", "").strip()
