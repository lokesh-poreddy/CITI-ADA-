# Opportunity Data Governance

## Core rule

An official portal link does not prove that a specific opportunity, benefit, eligibility rule or deadline is correct. Separate (1) official-source provenance, (2) record content review, and (3) current availability. Never mark all three as true merely because a URL is on an official-looking domain.

## Starter source register

The initial catalogue uses portal-level discovery references and one dated NSP renewal notice, including a separate non-expiring NSP scholarship-discovery reference. These are starter references to verify, not a full national database.

| Source | URL | Use in this prototype | Important limit |
|---|---|---|---|
| National Scholarship Portal — dated notice | https://scholarships.gov.in/Students | One AY 2026–27 PM-USP CSSS renewal notice is seeded with a closing date shown on the portal on 14 October 2026. | The full eligibility criteria are intentionally not encoded; checker responds `NEEDS_REVIEW`. Confirm latest notice and eligibility on the live portal. |
| National Scholarship Portal — discovery | https://scholarships.gov.in/All-Scholarships | Non-expiring portal reference for scholarship discovery. It does not claim every scheme is open. | Check the live academic-year notice, deadlines and eligibility; this is not a verified match. |
| SWAYAM | https://swayam.gov.in/search_courses | Course search reference. | Individual course dates, prerequisites and exam/certificate conditions must be checked per course. |
| Skill India Digital Hub | https://www.skillindiadigital.gov.in/free-online-courses/ | Skills-course discovery reference. | Course availability, fees, languages and location vary. No general eligibility claim is made. |
| DIKSHA | https://diksha.gov.in/ | Learning-resource discovery reference. | A portal reference is not a personalized course recommendation. |
| National Career Service | https://www.ncs.gov.in/ | Career/employment-service discovery reference. | Listing information is not verified by this prototype. |
| Apprenticeship India | https://www.apprenticeshipindia.gov.in/ | Apprenticeship portal reference. | No specific vacancy is asserted by the seeded record. |
| BHASHINI | https://bhashini.gov.in/ | Language technology reference for future speech/translation integration. | API onboarding, model/service coverage, terms and availability must be confirmed first. |

## Required schema for future ingestion

Each source-backed record should capture:

- Stable record ID and title.
- Opportunity type and provider/authority.
- Concise summary whose claims are supported by the original source.
- Original source URL and application URL (if distinct).
- Source provenance/trust status, reviewer, review timestamp and review note.
- Last-checked date, opening/deadline date, and expiry status.
- Eligibility criteria with rule provenance, version and explicit `eligibilityRulesConfigured` flag.
- Geography, language, education level, documents, fees/benefits only when sourced.
- Source snapshot/hash or a stored excerpt if permitted by source terms; do not copy content indiscriminately.
- Current data status and reason a record was archived or rejected.

## Workflow

1. A contributor submits a structured JSON record.
2. Automated validation checks required fields, HTTPS, date order, duplicates, invalid age ranges and missing rule structure.
3. Unknown domains and past deadlines are flagged for human review; the code never visits the URL automatically.
4. A reviewer opens the original source, checks every material field and adds a note.
5. Only the reviewed record is published. Records with unencoded eligibility display a warning and must not be presented as eligibility-matched.
6. A refresh job (future phase) detects records due for review and marks stale/expired records clearly; it must not silently keep old deadlines as current.
7. User feedback can flag inaccurate or expired information. A curator investigates, updates, or removes the listing.

## Privacy and safety

Do not scrape portals without checking their terms or access policy. Avoid storing Aadhaar numbers, bank details, caste/category, disability documents, income evidence or any student documents in this prototype. The eligibility form is only for non-sensitive fields currently needed by configured rules and is not persisted. Add consent, age-appropriate design, a secure identity layer, role-based access, audit history and retention/deletion controls before production.
