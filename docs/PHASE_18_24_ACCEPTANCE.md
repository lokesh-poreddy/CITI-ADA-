# Phase 18–24 acceptance checklist

## Cross-cutting
- [ ] All visible actions have loading, success, validation and error states.
- [ ] The UI makes API-backed data distinct from local demo-only state.
- [ ] No personal contact details of mentors appear in student-facing payloads.
- [ ] Demo listings and demo mentor profiles are conspicuously labeled.
- [ ] No external service is described as connected unless its adapter is authorized, configured and tested.
- [ ] No real payment or SMS/email delivery is claimed.
- [ ] A full build/test run is recorded on a supported development machine.

## Phase 18 — Facilitator workspace
- [ ] Create and list cohorts scoped to the submitted demo actor key.
- [ ] Linking a learner requires a consent flag and a unique learner key within the cohort.
- [ ] A referral can be created only for a learner already linked to the cohort.
- [ ] UI advises using aliases and not entering government IDs or sensitive documents.

## Phase 19 — Module authoring
- [ ] Create and revise a draft; module creator ownership is checked in the service.
- [ ] Publishing fails without title, summary, at least one lesson or a valid paid price.
- [ ] Free modules use a zero price; paid module prices are clearly labeled as display-only.
- [ ] No checkout, payments or disbursement logic exists in this phase.

## Phase 20 — Mentors
- [ ] Only verified profiles appear in discovery.
- [ ] Mentor submissions start unverified; a reviewer-only queue is available and a reviewer decision is required before public discovery.
- [ ] Connection requests require consent, facilitator mediation and guardian/institution approval confirmation.
- [ ] Requests expose a controlled status and no direct phone/email contact.

## Phase 21 — Partner listings
- [ ] New listings start DRAFT and are not returned by the public listing route.
- [ ] Reviewer-only queue returns pending listing records without demo seeds.
- [ ] Application/source links must be HTTPS URLs.
- [ ] Partner can submit only their own non-demo listing.
- [ ] Only a reviewer can approve/reject a pending listing; only approved listings are public.
- [ ] Seed records are labelled as illustrative and not live vacancies.

## Phase 22 — Integrations
- [ ] Registry shows capability, status and setup guidance.
- [ ] External adapters report NOT_CONFIGURED and `externalNetworkCallEnabled=false` until a real approved adapter is implemented.
- [ ] Credentials are never embedded in frontend code.

## Phase 23 — Reminders
- [ ] Schedule, list and acknowledge reminders for a recipient key.
- [ ] Due reminders change to READY when queried.
- [ ] External-delivery consent is required before email/SMS preferences are enabled.
- [ ] UI clearly states there is no configured email/SMS/push provider.

## Phase 24 — Sustainability
- [ ] Overview names potential models, potential payers, value hypotheses and safeguards.
- [ ] Partnership interest requires consent; invalid model IDs are rejected.
- [ ] No payment-card, bank-account or transaction data is collected.
- [ ] Core student discovery/opportunity navigation is not paywalled by the prototype.

## Localization follow-up
- [ ] Translate detailed form labels, validation messages, empty states and confirmations into each selected language; review with fluent speakers before field use.
