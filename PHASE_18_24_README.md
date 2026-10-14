# UdaanSetu — Phases 18–24 handoff

This cumulative package extends the earlier Phase 01 and Phase 09–17 repository with **Phases 18–24: Facilitators, partners and sustainability**. It does not complete the unimplemented Phases 02–08 or the remaining Phases 25–28.

## Features included

- **Phase 18 — Facilitator workspace:** cohort create/list, learner links with consent recorded, referrals for linked learners, and follow-up dates.
- **Phase 19 — Learning-module authoring:** create/update drafts, free/paid display terms, publish validation and archive action. There is no checkout or payment processing.
- **Phase 20 — Mentor discovery and safe connection:** verified/demo profiles, submitted mentor candidates, reviewer gate, and facilitator-mediated connection requests. Direct contact information is not exposed.
- **Phase 21 — Apprenticeship/internship/employer listings:** create drafts, submit for review, reviewer approval, and browse published/illustrative listings. Example seed entries are not live vacancies.
- **Phase 22 — Integration registry:** local catalogue is distinguished from external sources (DIKSHA, Skill India Digital Hub, National Career Service, BHASHINI). External network calls are disabled; verify authorization and terms before implementing adapters.
- **Phase 23 — In-app reminders:** schedule, list, promote due reminders to READY on read, acknowledge, save delivery preferences. No SMS/email provider or background push scheduler is connected.
- **Phase 24 — Sustainability:** model hypotheses and a consent-based partnership-interest form. The product proposal keeps core student discovery and public-opportunity navigation free.

## Start services

Requirements: Java 21, Maven 3.9+, Node.js 22.12+, npm and Python 3.11+.

```bash
# Terminal 1
cd backend && mvn spring-boot:run

# Terminal 2
cd ai-service
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Terminal 3
cd frontend && npm install && npm run dev
```

Open `http://localhost:5173` and scroll to **Trusted Learning Ecosystem**. The new panels are tabs for facilitator workspace, learning modules, mentor connections, work/training listings, integrations, reminders and sustainability. Top-level workspace copy follows English/Hindi/Tamil selection; detailed administrative form labels are still predominantly English and need full translation review before a field pilot.

If some platform endpoints are unavailable, the UI shows **Local demo mode** and local-only writes are stored in this browser for demonstration. Local demo data is not synchronized to the API automatically; a full offline mutation queue needs separate conflict/retry work before production use.

## API surface added

- `GET/POST /api/v1/facilitator/cohorts`
- `POST /api/v1/facilitator/cohorts/{cohortId}/learners`
- `GET/POST /api/v1/facilitator/referrals`
- `GET /api/v1/learning-modules`, `GET /mine`, `POST`, `PUT /{id}`, `POST /{id}/publish`, `POST /{id}/archive`
- `GET/POST /api/v1/mentors`, `POST /{id}/verify`, `POST /{id}/connection-requests`, `GET /connection-requests`
- `GET/POST /api/v1/partner-listings`, `GET /mine`, `POST /{id}/submit`, `POST /{id}/review`
- `GET /api/v1/partners/integrations`, `GET /{id}`
- `GET/POST /api/v1/notifications`, `POST /{id}/acknowledge`, `GET/PUT /preferences`
- `GET /api/v1/sustainability/overview`, `POST /interest`

Demo identity headers: `X-Actor-Key` and `X-Partner-Key`. A local reviewer gate uses `X-Reviewer-Token` and `APP_REVIEWER_TOKEN`. These are prototype integration hooks only, not secure authentication. Do not make these endpoints publicly accessible until proper identity and RBAC are implemented.

## Validation

```bash
./scripts/check-phase-18-24.sh
```

The check script runs frontend tests/build, Java tests and the Python test suite when the toolchains/dependencies are available. This build environment previously could not complete npm installation and did not have Maven, so no claim is made here that the complete React production build or Spring Boot suite passed. Run checks locally before presenting as release-ready.
