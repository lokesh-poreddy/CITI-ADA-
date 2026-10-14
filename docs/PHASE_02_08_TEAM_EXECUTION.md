# Vertical Ownership — Phases 02–08

The team uses end-to-end feature ownership. The owner is accountable for the user behavior, component state, API/data contract, error/fallback behavior, tests, documentation and demo—not only one technology layer.

| Slice | Feature owner deliverable | Review partner | Handoff gate |
|---|---|---|---|
| 02 — Language-first onboarding | Language selector, first-run journey, accessible labels and browser language behavior | UX/accessibility owner | EN/HI/TA selector updates both app shell and wizard; text fallback remains usable |
| 03 — Learner profile | Minimal profile fields, local persistence, clear/resume, opt-in disclosure and Java profile endpoint | Privacy/security owner | No unnecessary personal fields; default is local-only; API stores volatile profile only after opt-in |
| 04 — Strengths discovery | Interest/strength/goal taxonomy and “not sure yet” path | Domain researcher | Multi-select works, no forced high-stakes conclusion; inputs are schema constrained |
| 05 — Career taxonomy | Six diverse pathway families, localized display copy and resource references | Domain researcher | Every ID unique; non-STEM and vocational options included; source and caution notes present |
| 06 — Explainable matching | Deterministic local matcher, Java matcher, reasons, alternatives and score disclaimer | AI/evaluation owner | Identical IDs in frontend/backend; top three valid; stable scoring tests pass |
| 07 — Learning pathway | Three-step local plans, resource links, caution and saved selection | UX + content owner | All paths have three steps and at least one HTTPS resource; offline display works |
| 08 — Course/exam exploration | Starter resource links and handoff into opportunity search | Data-governance owner | Generic sources are not misrepresented as verified courses or exam eligibility |

## Integration rules

1. **Canonical contracts:** front-end identifiers in `careerCatalog.js` must match `CareerPathwayService` pathway IDs and profile tag keys. Run `python3 scripts/check-integration-contracts.py` after edits.
2. **Local-first is the default:** no learner profile fields are sent to the backend unless the explicit demo-service processing toggle is checked.
3. **No identity claims:** temporary learner IDs are opaque but are not authentication. Do not use them to secure private data.
4. **No unsupported recommendations:** score is a ranking heuristic, not a probability; every card provides the basis and caution.
5. **Single integration branch:** each owner creates a small feature branch or commit; integrate after tests. Avoid copying whole project folders or rewriting another feature owner’s work without discussion.
6. **Exit gate:** run the specific tests, the static contract checker, and the full release gate on a network-enabled runner before a competition demo.
