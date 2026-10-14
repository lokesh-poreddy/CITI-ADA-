from evaluation.evaluate_retrieval import evaluate_cases, load_cases


def test_evaluation_cases_have_expected_structure():
    cases = load_cases()
    assert len(cases) >= 5
    assert all(case.get("id") and case.get("question") for case in cases)


def test_retrieval_smoke_evaluation_passes_all_curated_cases():
    report = evaluate_cases()
    assert report["failedCases"] == 0, report
    assert report["sourceHitRate"] >= 0.8
    assert report["unsupportedQuestionAbstentionRate"] == 1.0
