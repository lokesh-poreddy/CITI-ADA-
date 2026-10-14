# Phase 14 — Voice interaction service

## Objective
Provide one-step browser voice input and read-aloud with locale selection and text fallback.

## Current implementation paths
frontend/src/voice/browserSpeech.js
- frontend/src/voice/browserSpeech.test.js
- frontend/src/opportunities/OpportunityCentre.jsx
- backend/src/main/java/in/udaansetu/platform/voice/VoiceCapabilitiesController.java

## API / interaction boundary
GET /api/v1/voice/capabilities

## Safety and design guardrails
Browser recognition/synthesis is used where supported; capability varies by browser/device and can require internet. Offline speech is not promised.

## Feature owner
Voice feature owner; test en-IN, hi-IN and ta-IN where supported, including denied permission and unsupported browser.

## Exit criteria
Mic errors are explained; transcript fills editable input; text is always available; optional answer read-aloud works.

## Team collaboration
The vertical owner must test the visible user flow, API/domain behavior, empty/error/loading states, responsiveness, accessibility, source provenance where applicable, and the integrated end-to-end journey. Changes should extend the existing repository; do not create a separate app for this phase.
