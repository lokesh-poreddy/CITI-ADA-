from __future__ import annotations
from pydantic import BaseModel, Field, HttpUrl, ConfigDict, field_validator
from typing import Literal

LanguageCode = Literal["en", "hi", "ta"]

class KnowledgeRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(min_length=1, max_length=100)
    title: str = Field(min_length=1, max_length=180)
    summary: str = Field(default="", max_length=2000)
    sourceName: str = Field(default="Source not provided", max_length=180)
    sourceUrl: HttpUrl
    sourceTrust: str = Field(default="UNKNOWN", max_length=40)
    lastVerifiedAt: str | None = Field(default=None, max_length=30)
    type: str | None = Field(default=None, max_length=40)
    deadline: str | None = Field(default=None, max_length=30)

    @field_validator("sourceUrl")
    @classmethod
    def require_https_source(cls, value: HttpUrl) -> HttpUrl:
        if value.scheme != "https":
            raise ValueError("Opportunity source URLs must use HTTPS.")
        return value

class GroundedAnswerRequest(BaseModel):
    question: str = Field(min_length=2, max_length=600)
    language: LanguageCode = "en"
    records: list[KnowledgeRecord] = Field(default_factory=list, max_length=50)

class RetrievedSource(BaseModel):
    id: str
    title: str
    sourceName: str
    sourceUrl: str
    sourceTrust: str
    lastVerifiedAt: str | None = None
    deadline: str | None = None
    score: float

class GroundedAnswerResponse(BaseModel):
    status: Literal["MATCHED", "NO_SUPPORTED_EVIDENCE"]
    answer: str
    language: LanguageCode
    sources: list[RetrievedSource]
    modelUsed: bool
    notice: str
    clarificationPrompt: str | None = None
