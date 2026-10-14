"""Small deterministic retriever used when no external model is configured.

This is intentionally retrieval-first: it never invents eligibility facts or dates.
"""
from __future__ import annotations
import re
from dataclasses import dataclass
from typing import Iterable

TOKEN_RE = re.compile(r"[\wऀ-ॿ஀-௿]+", re.UNICODE)
STOP_WORDS = {
    "the", "a", "an", "is", "are", "to", "for", "on", "and", "or", "of", "in", "my", "me", "can", "i",
    "what", "which", "how", "tell", "about", "show", "find", "please", "எனக்கு", "என்ன", "ஒரு", "और", "के", "में", "क्या"
}

@dataclass(frozen=True)
class SearchRecord:
    id: str
    title: str
    summary: str
    source_name: str
    source_url: str
    source_trust: str = "UNKNOWN"
    last_verified_at: str | None = None
    type: str | None = None
    deadline: str | None = None


def tokens(text: str) -> set[str]:
    return {t.casefold() for t in TOKEN_RE.findall(text or "") if len(t) > 1 and t.casefold() not in STOP_WORDS}


def retrieve(question: str, records: Iterable[SearchRecord], limit: int = 5) -> list[tuple[SearchRecord, float]]:
    query = tokens(question)
    if not query:
        return []
    scored: list[tuple[SearchRecord, float]] = []
    for record in records:
        title_tokens = tokens(record.title)
        summary_tokens = tokens(record.summary)
        type_tokens = tokens(record.type or "")
        overlap = len(query & title_tokens) * 3.0 + len(query & type_tokens) * 1.5 + len(query & summary_tokens)
        # Small phrase benefit for common categories, without asserting eligibility.
        corpus = f"{record.title} {record.summary} {record.type or ''}".casefold()
        question_cf = (question or "").casefold()
        for phrase, terms in {
            "scholarship": {"scholarship", "scholarships", "छात्रवृत्ति", "உதவித்தொகை"},
            "course": {"course", "courses", "learning", "பாடநெறி", "படிப்பு", "पाठ्यक्रम"},
            "apprenticeship": {"apprenticeship", "apprenticeships", "பழகுநர்", "अप्रेंटिसशिप"},
            "language": {"language", "voice", "speech", "மொழி", "भाषा"},
        }.items():
            if any(term in question_cf for term in terms) and phrase in corpus:
                overlap += 1.5
        if overlap > 0:
            scored.append((record, overlap))
    return sorted(scored, key=lambda item: (-item[1], item[0].title.casefold()))[: max(1, min(limit, 10))]
