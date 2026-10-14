"""Deterministic evaluation harness for retrieval grounding; no model/network required.

Run from ai-service/: python -m evaluation.evaluate_retrieval
The cases are illustrative evaluation fixtures, not claims about live opportunity availability.
"""
from __future__ import annotations
import json
from pathlib import Path
from app.retrieval import SearchRecord, retrieve

CASES_PATH = Path(__file__).with_name("cases.json")


def load_cases():
    return json.loads(CASES_PATH.read_text(encoding="utf-8"))


def evaluate_cases(cases=None):
    cases = cases if cases is not None else load_cases()
    total = len(cases)
    source_hits = 0
    abstain_correct = 0
    abstain_cases = 0
    results = []
    for case in cases:
        records = [SearchRecord(
            id=row["id"], title=row["title"], summary=row.get("summary", ""),
            source_name=row.get("source_name", "Source not provided"),
            source_url=row["source_url"], source_trust=row.get("source_trust", "UNKNOWN"),
            last_verified_at=row.get("last_verified_at"), type=row.get("type"), deadline=row.get("deadline"))
            for row in case.get("records", [])]
        hits = retrieve(case["question"], records, limit=5)
        hit_ids = [record.id for record, _ in hits]
        expected = set(case.get("expectedSourceIds", []))
        source_ok = bool(expected.intersection(hit_ids)) if expected else False
        if expected and source_ok:
            source_hits += 1
        abstain_ok = len(hits) == 0
        if case.get("expectAbstain"):
            abstain_cases += 1
            if abstain_ok:
                abstain_correct += 1
        results.append({"caseId": case["id"], "expectedSources": sorted(expected), "retrievedSources": hit_ids,
                        "sourceHit": source_ok, "expectedAbstention": bool(case.get("expectAbstain")),
                        "abstained": abstain_ok, "pass": (abstain_ok if case.get("expectAbstain") else source_ok)})
    expected_source_cases = sum(1 for case in cases if case.get("expectedSourceIds"))
    summary = {
        "caseCount": total,
        "sourceHitRate": round(source_hits / expected_source_cases, 4) if expected_source_cases else 1.0,
        "unsupportedQuestionAbstentionRate": round(abstain_correct / abstain_cases, 4) if abstain_cases else 1.0,
        "passedCases": sum(1 for item in results if item["pass"]),
        "failedCases": sum(1 for item in results if not item["pass"]),
        "interpretation": "Small deterministic smoke evaluation only; not a model-quality or population-level claim.",
        "results": results,
    }
    return summary


def main():
    result = evaluate_cases()
    print(json.dumps(result, indent=2, ensure_ascii=False))
    raise SystemExit(0 if result["failedCases"] == 0 else 1)


if __name__ == "__main__":
    main()
