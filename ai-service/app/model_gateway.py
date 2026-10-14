"""Optional OpenAI-compatible gateway. Disabled by default; retrieval still works offline.

Configure AI_PROVIDER=openai-compatible or ollama only when the team has selected
and approved an endpoint. Never send student personal profiles to this adapter.
"""
from __future__ import annotations
import httpx
from app.config import AI_API_KEY, AI_BASE_URL, AI_MODEL, AI_PROVIDER

async def generate_grounded_answer(question: str, language: str, evidence: list[dict]) -> str | None:
    provider = (AI_PROVIDER or "none").lower()
    if provider == "none" or not AI_BASE_URL or not AI_MODEL:
        return None
    if provider not in {"openai-compatible", "ollama"}:
        return None
    sources = "\n".join(
        f"[{item['id']}] {item['title']} — {item['summary']} | Source: {item['sourceName']} ({item['sourceUrl']})"
        for item in evidence
    )
    system = (
        "You are a careful learning-opportunity guide for rural learners. Answer only using the evidence below. "
        "Never invent eligibility rules, deadlines, benefits, fees, guaranteed jobs, or application status. "
        "If evidence is insufficient, say so and tell the learner to open the official source. Cite each factual claim "
        "with the exact record ID in square brackets, such as [nsp-pm-usp-csss-renewal-2026]. Do not request sensitive data. "
        f"Respond in language code {language}. Evidence:\n{sources}"
    )
    headers = {"Content-Type": "application/json"}
    if AI_API_KEY:
        headers["Authorization"] = f"Bearer {AI_API_KEY}"
    url = AI_BASE_URL.rstrip("/") + "/chat/completions"
    payload = {"model": AI_MODEL, "temperature": 0.1,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": question}]}
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            if not isinstance(content, str) or not content.strip():
                return None
            # Validate at least one exact record citation. If missing, caller falls back to retrieval-only.
            evidence_ids = {item["id"] for item in evidence}
            citations = set()
            import re
            citations.update(re.findall(r"\[([A-Za-z0-9_-]{1,100})\]", content))
            if not evidence_ids.intersection(citations):
                return None
            return content.strip()[:4000]
    except (httpx.HTTPError, KeyError, TypeError, ValueError):
        return None
