# Grounded AI Assistant Policy

## Behavior contract

The assistant is a source navigator—not an authority that grants scholarship eligibility, promises jobs, or replaces teachers/advisors.

1. Search only supplied records that include an identifier and source URL.
2. Return matched records, provider/source name, source URL, source trust and recorded freshness metadata.
3. Clearly distinguish a portal reference from an individually reviewed opportunity.
4. If no supported record matches, return `NO_SUPPORTED_EVIDENCE` and ask a useful clarifying question. Do not fill gaps with plausible-sounding answers.
5. Never invent criteria, award amounts, eligibility, deadlines, vacancies, fees, or guarantee of admission/income.
6. The deterministic retrieval path remains active with `AI_PROVIDER=none`; it is suitable for a weak-network demonstration and requires no external model call.
7. Optional generative mode is an explicit configuration and is disabled by default. Use only an approved endpoint, a small relevant context, low temperature, source IDs and source URL references. Reject output when citations cannot be linked to supplied records.
8. Do not submit student profiles or sensitive information to model providers. This phase sends only the user's question and source-linked catalogue records.
9. Log operational metadata only. Do not log raw student questions by default in production.
10. Provide manual correction and direct official-source links in the UI.

## Current implementation versus future capability

Implemented now: lexical retrieval over up to 50 request-supplied public records, HTTPS-only source URLs, source links, localized safe fallback messages, no-evidence behavior, optional OpenAI-compatible chat-completions adapter and exact-record citation check. The client supplies the candidate records, so a browser can tamper with the request; do not enable generation for public deployment until authorized server-side retrieval validates the context.

Not implemented: embeddings/vector database, model fine-tuning, live government API sync, source page parsing, source freshness scheduler, offline language model, automatic translation of official legal text, production RAG evaluation or end-user personalization. Do not claim those features during the judging demo.

## Evaluation checklist

- Known question retrieves the expected source record.
- Unsupported question produces no factual claims.
- The system never says a student is eligible if the rule set is missing.
- All generated factual claims cite a retrieved record ID.
- Expired/deadline information is visually cautious.
- Hindi/Tamil UI fallback is tested; source documents may remain in the source's original language.
- Network timeout falls back gracefully and does not break the opportunity cards.
