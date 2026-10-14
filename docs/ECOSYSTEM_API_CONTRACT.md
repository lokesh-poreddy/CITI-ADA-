# Ecosystem API contracts — Phases 18–24

Base URL: `/api/v1`. JSON requests use `Content-Type: application/json`. Error responses are Spring Boot error statuses; clients must not assume every failure contains a public `message`.

## Identity caveat
`X-Actor-Key`, `X-Partner-Key`, and `X-Reviewer-Token` are local development hooks. They do not establish secure authentication, strong identity or production authorization. Use a proper OIDC/session identity provider and server-side role/object authorization before real learner data or public hosting.

## Facilitator workspace
- `GET /facilitator/cohorts` — `X-Actor-Key`; returns only cohorts with matching owner key.
- `POST /facilitator/cohorts` — `{name, region, purpose}`.
- `POST /facilitator/cohorts/{id}/learners` — `{learnerKey, displayAlias, consentRecorded:true}`.
- `GET /facilitator/referrals` — `X-Actor-Key`.
- `POST /facilitator/referrals` — `{cohortId, learnerKey, targetType, targetId, summary, followUpDate?, consentRecorded:true}`; learner must already be linked.

## Learning modules
- `GET /learning-modules?language=en&q=` — published modules only.
- `GET /learning-modules/mine` — `X-Actor-Key`; creator-owned modules.
- `POST /learning-modules` and `PUT /learning-modules/{id}` — `{title,summary,audience,language,accessMode,priceInr,lessons:[{title,summary,resourceUrl,estimatedMinutes}]}`.
- `POST /learning-modules/{id}/publish`, `POST /learning-modules/{id}/archive` — `X-Actor-Key`.

## Mentors
- `GET /mentors?expertise=&language=&region=` — only verified profiles.
- `POST /mentors` — submit profile with `verificationConsent:true`; new profile is unverified.
- `GET /mentors/review-queue` — `X-Reviewer-Token`; unverified submitted profiles only.
- `POST /mentors/{id}/verify` — `X-Reviewer-Token`, `{decision:APPROVE|REJECT,note}`.
- `POST /mentors/{id}/connection-requests` — `{learnerAlias,purpose,facilitatorKey,consentConfirmed:true,facilitatorMediated:true,guardianOrInstitutionApprovalConfirmed:true}`.
- `GET /mentors/connection-requests` — `X-Actor-Key` matching facilitator key.

## Partner listings
- `GET /partner-listings?kind=&location=&q=` — only published and organization-verified listings.
- `GET /partner-listings/mine` — `X-Partner-Key`.
- `POST /partner-listings` — title, organization, description, location, workMode, kind, eligibilitySummary, HTTPS applicationUrl, optional HTTPS sourceUrl and deadline.
- `POST /partner-listings/{id}/submit` — `X-Partner-Key`.
- `GET /partner-listings/review-queue` — `X-Reviewer-Token`; pending submitted listings only.
- `POST /partner-listings/{id}/review` — `X-Reviewer-Token`, `{decision:APPROVE|REJECT,note}`.

## Integrations
- `GET /partners/integrations` — status and setup guidance only; no external sync is invoked by this route.
- `GET /partners/integrations/{id}` — one descriptor.

## Notifications
- `GET /notifications?recipientKey=`
- `POST /notifications` — recipientKey, kind, title, message, scheduledAt (local date-time interpreted in Asia/Kolkata in this prototype), optional relatedRecordId.
- `POST /notifications/{id}/acknowledge?recipientKey=`
- `GET /notifications/preferences?actorKey=`
- `PUT /notifications/preferences?actorKey=` — `{inAppEnabled:true,emailEnabled,smsEnabled,consentToExternalDelivery}`. External channels are preferences only, not connected delivery services.

## Sustainability
- `GET /sustainability/overview` — product policy, models, validation questions and payment status.
- `POST /sustainability/interest` — organizationName, organizationType, modelId, approximateLearners, optional contactEmail/notes, `consentToFollowUp:true`.

## Store/persistence limitations
All new service stores in this increment are in-memory. Restarting the Java API resets new cohort/module/request/listing/reminder/interest state. A production migration should introduce relational tables, migrations, transaction boundaries, audit events and data-retention controls before any live rollout.
