# Phases 02–08 — Integrated Learner Journey

## Purpose

These phases close the missing learner-facing path in the UdaanSetu prototype. The learner can choose a preferred language, select a broad education stage, share a small set of interests/strengths/goals, review several transparent pathway ideas, follow a stage-sensitive three-step local learning plan, open general learning-resource portals and pass a topical search into the existing Opportunity Centre.

## User flow

1. **Welcome:** explains the process, local-first behavior and what the tool does not collect. The in-progress profile draft is debounced to local storage while the form is being edited.
2. **Learner context:** selects current learning stage, language and an optional broad state/UT. No name, phone, birth date, exact address, income, caste/category or document fields are collected.
3. **Strengths and interests:** selects from curated interest, strength and goal tags, including “I am not sure yet”.
4. **Pathway matching:** the local rule-based matcher scores six pathway families. The score is shown as *relative alignment*, not probability, psychometric assessment, admission eligibility or prediction of job success. The selected education stage also changes practical planning guidance without excluding exploratory career choices.
5. **Practical plan:** the selected route provides three localized milestones, resource links and cautionary guidance. The learner can save the selected route locally, clear it and resume it on the same device.
6. **Opportunity handoff:** the learner can move to the existing Opportunity Centre with a topic-specific, editable search phrase.

## Backend contracts

- `POST /api/v1/learners/profiles` — creates an opaque ID for a minimal profile in volatile memory. Requires `allowDemoProcessing=true`, returns a 30-minute expiry, has no profile retrieval endpoint, and does not return the profile fields. The memory map resets on application restart.
- `GET /api/v1/career-pathways` — lists the six starter pathway definitions and interest tags.
- `POST /api/v1/career-pathways/recommendations` — accepts the temporary `learnerId` and returns up to three stable pathway IDs with relative-fit scores, matching tags and a short explanation.
- `GET /api/v1/learning-pathways/{pathwayId}` — returns the generic pathway summary, three steps, resource links and caution. This endpoint contains no learner-specific data and can be requested without profile sharing.

## Local-first and privacy choices

- On-device matching is the default; the learner profile is stored in IndexedDB through the existing local pocket storage abstraction.
- Server profile creation is attempted only if the learner checks the optional demo-service processing box and the browser reports an available network.
- When the API is unavailable, local matching continues. The UI names the fallback instead of presenting it as a server success.
- The optional broad state/UT selection is stored locally only; the selector covers 28 states and 8 union territories and it is not sent to the pathway matching API because the current matcher does not need regional information. The dropdown covers all 28 states and 8 union territories. The local profile is convenience storage, not secure account storage. A reset control clears the saved local learner profile. Shared-device use must be disclosed.
- The server profile store is volatile and TTL-limited. This is not production authentication, legally reviewed consent, guardian approval, or a durable data-rights implementation.
- Resource links are discovery references. They do not prove that a course is open, free, in a particular language, or appropriate for the learner’s current stage.

## Matching model

The rule matcher adds a baseline, then small weights for selected interests, strengths, goals and stage. Matching signals are included in the response for explanation. The catalogue intentionally returns several different directions instead of one definitive label. There is no machine-learning claim and no externally validated aptitude claim. Weights need user research, outcome feedback and bias review before anything beyond a hackathon prototype.

## Implemented files

- `frontend/src/student/careerCatalog.js`
- `frontend/src/student/StudentJourney.jsx`
- `frontend/src/student/student-journey.css`
- `frontend/src/student/careerCatalog.test.js`
- `frontend/src/student/StudentJourney.test.jsx`
- `frontend/src/api/learnerJourney.js`
- `frontend/src/offline/offlinePocket.js`
- `backend/src/main/java/in/udaansetu/platform/learners/*`
- `backend/src/main/java/in/udaansetu/platform/careers/*`
- `backend/src/test/java/in/udaansetu/platform/learners/*`
- `backend/src/test/java/in/udaansetu/platform/careers/*`

## Known limitations before a field pilot

1. Backend persistence is in memory, and anonymous profile create/recommendation endpoints are not protected by production identity or object-level access controls.
2. The taxonomy and scoring weights are designed starter rules, not a validated career assessment.
3. Learning resources use general official portal links, not a fully structured, verified catalogue of current exams, entry requirements, languages and deadlines.
4. UI copy is available in English, Hindi, Tamil and Telugu; opportunity records and some provider pages are not completely localized.
5. Voice capability depends on the browser/device and may need connectivity. The profile and matching wizard does not require voice input.
6. The local profile store does not encrypt data and is not appropriate for sensitive records; use test/demo selections only and clear data on shared devices.
7. Full npm/Maven/container build verification must pass on a network-enabled developer machine or CI runner.

## Acceptance summary

- A user can complete the journey with internet disabled after the shell/assets have been loaded.
- A “not sure yet” selection does not block exploration.
- All six pathways have three next steps, at least one HTTPS learning resource and a caution statement.
- A server profile is only submitted when the optional processing toggle is enabled; otherwise local matching is used.
- Backend scores preserve known path IDs and provide alternatives, not only the single top item.
- Selecting a path and choosing “Find related opportunities” updates the already-integrated Opportunity Centre query.
