# Phase 15 — Multilingual content framework

## Objective
Localize the opportunity-centre task flow in English, Hindi and Tamil while preserving source-truth and control labels.

## Current implementation paths
frontend/src/opportunities/OpportunityCentre.jsx (TEXT dictionary)
- frontend/src/voice/browserSpeech.js
- frontend/src/App.jsx

## API / interaction boundary
Language selected through app shell; question payload sends language code en/hi/ta to AI gateway.

## Safety and design guardrails
This is UI-level localization for this feature, not a claim that every official source is translated. Source text may remain in its original language.

## Feature owner
Localization and accessibility owner; review translations with fluent speakers before field testing.

## Exit criteria
Core controls, status, warnings and empty/error states remain understandable after changing language.

## Team collaboration
The vertical owner must test the visible user flow, API/domain behavior, empty/error/loading states, responsiveness, accessibility, source provenance where applicable, and the integrated end-to-end journey. Changes should extend the existing repository; do not create a separate app for this phase.
