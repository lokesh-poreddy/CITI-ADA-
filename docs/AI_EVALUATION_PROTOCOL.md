# AI Evaluation Protocol — Phase 27

## Current model boundary

The AI service is retrieval-first. With `AI_PROVIDER=none` (the default), it does not call a hosted model. It searches the records supplied by the client and provides source references or abstains if no support is retrieved. The evaluation corpus is synthetic test data shaped around example source types; it is not a real-world benchmark.

## Running the evaluation

```bash
cd ai-service
python -m pytest -q
python -m evaluation.evaluate_retrieval
```

The evaluator reports:

- `sourceHitRate`: fraction of cases with expected source IDs where at least one expected source is retrieved.
- `unsupportedQuestionAbstentionRate`: fraction of unsupported cases for which retrieval returns no candidate.
- Per-case expected/retrieved IDs and pass/fail.

Current curated corpus: 7 cases (5 supported lookup cases and 2 unsupported/guarantee cases). The harness is deterministic, offline and does not prove model factuality, user satisfaction or real source accuracy.

## Add cases with every new domain or language

Each case should include a question, language, expected source IDs, expected abstention flag and a small reviewed record set. Add:

- Tamil and Hindi queries written and reviewed by fluent speakers.
- Ambiguous or under-specified queries that should trigger clarification.
- Conflicting source and stale-deadline cases.
- Attempts to request guaranteed scholarship/job results.
- Prompt injection strings in records and questions.
- Cases with no current eligibility evidence.
- Test for URL scheme validation and source provenance preservation.

## Release policy

Do not advertise an evaluation percentage without naming the test set, version, number of cases, metric and limitations. Human-reviewed data must not contain real student personal data. If an external model is enabled, run separate grounding, hallucination, language quality, injection-resistance, latency and provider-data-handling checks.
