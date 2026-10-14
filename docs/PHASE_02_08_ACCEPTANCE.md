# Phases 02–08 — Acceptance and Regression Checklist

## User-experience checks

- [ ] Landing content explains that the tool supports exploration and does not assign a permanent career label.
- [ ] Preferred-language selector updates both the wizard and the outer app shell across English, Hindi and Tamil.
- [ ] Stage is selected from a fixed set; region is broad and optional.
- [ ] No name, phone, email, date of birth, exact village/address, caste/category, family income or document upload is collected in this flow.
- [ ] Interests, strengths and goals support multiple selections and a “not sure yet” option.
- [ ] The user can return to change selections without losing the in-progress state.
- [ ] Three separate pathway alternatives appear, with matching signals and a visible score disclaimer.
- [ ] A chosen pathway displays three actionable milestones, official portal links and cautionary guidance.
- [ ] User can save/resume and clear the device-local profile.
- [ ] The “Find related opportunities” action pre-fills an editable query in Opportunity Centre.
- [ ] Keyboard focus, reduced motion and small-screen layouts work.

## API checks

- [ ] Profile creation fails validation unless the optional demo processing flag is true.
- [ ] Profile request values are schema-constrained; unknown tags do not create arbitrary catalog records.
- [ ] Returned learner ID is opaque; profile body is not echoed in the response.
- [ ] Temporary profile expires after 30 minutes and vanishes on application restart.
- [ ] Unknown/expired profile recommendation request returns 404.
- [ ] Career catalogue IDs are unique and stable across frontend and backend.
- [ ] Every pathway returns 3 steps, valid HTTPS resource URLs and a caution statement.
- [ ] Scores are capped, deterministic for the same profile, and accompanied by matched signals.
- [ ] Generic learning-path GET does not require or receive a learner profile.

## Offline/privacy checks

- [ ] With browser network disabled, local profile selections generate pathway suggestions without calling profile/recommendation endpoints.
- [ ] Turning on demo-service processing explicitly allows temporary POST only while online.
- [ ] API failure after opt-in falls back to local recommendations and is visibly disclosed.
- [ ] Reset removes the local profile record.
- [ ] Service worker never caches `/api/` responses or profile POST results.
- [ ] Shared-device warning and non-account prototype boundary remain visible.

## Regression and release

- [ ] `npm test in `frontend/`` passes all existing and new tests.
- [ ] `npm run build in `frontend/`` passes.
- [ ] ``./mvnw clean verify` in `backend/`` passes.
- [ ] Python AI-service tests and retrieval evaluation pass.
- [ ] `scripts/check-integration-contracts.py` passes.
- [ ] Docker Compose builds and starts all services; `scripts/smoke-release.sh` passes.
- [ ] Mobile device/manual keyboard/reduced-motion checks are recorded.

A checked item means the test was actually executed and passed. Static source inspection alone is not a substitute for runtime verification.
