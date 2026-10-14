# Phase 18–24 team execution — Approach A

## Ownership principle
Each person owns a complete vertical slice: interaction design, React component, Java API, domain validation, demo/local fallback where relevant, tests, docs and a short demonstration. The owner must coordinate shared contracts before changing a field or route.

## Suggested vertical owners (assign names in the team)

| Feature owner | Slice | Responsibilities | Demonstration |
|---|---|---|---|
| Owner A | Facilitator workspace (18) | Cohorts, consent-aware learner links, referrals and access-scope tests | Create a cohort, link a learner, record a referral |
| Owner B | Module authoring (19) | Draft/publish lifecycle, lesson model, pricing validation and creator ownership | Save draft, show publish guard, publish a free module |
| Owner C | Mentor connection (20) | Verified discovery, submission/review boundary, mediated contact and safety copy | Select illustrative mentor and submit safe introduction request |
| Owner D | Partner listings (21) | Draft, HTTPS validation, review state and public listing filters | Create a draft and show it is not publicly visible before approval |
| Owner E | Integrations + reminders (22–23) | Registry contract, adapter capability boundary, notifications, preferences and due states | Show disabled external adapters and schedule/acknowledge an in-app reminder |
| Owner F | Sustainability (24) + UX integration | Model options, interest capture, ethical monetization copy, responsive QA and presentation | Explain the payer hypothesis and submit consented interest |

For smaller teams, combine Owners E and F. Feature ownership does not remove the requirement for code review and cross-feature tests.

## Merge and integration rules
1. Maintain one canonical branch and one API contract owner.
2. Every endpoint needs request validation, predictable status codes, a test, and a README/API update.
3. Keep all demo headers clearly marked as prototype-only. Never imply `X-Actor-Key` is authentication.
4. Do not introduce third-party integrations without checking terms, access permissions, rate limits and data handling.
5. Merge only when the previous end-to-end smoke test still passes.
6. Record unresolved issues in the release limitations section rather than hiding them in the demo.
