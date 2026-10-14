#!/usr/bin/env node
/**
 * Dependency-free smoke checks for the curated resource hub and four-language
 * learner core. Run with `npm run check:resources`; this does not replace Vitest
 * or a production build, but it can run before npm dependencies are installed.
 */
import assert from 'node:assert/strict';
import {
  RESOURCE_CATALOG, RESOURCE_COPY, RESOURCE_CATEGORIES,
  filterResources, validateResourceCatalog,
} from '../src/resources/resourceCatalog.js';
import {
  STATE_OPTIONS, STAGE_OPTIONS, UI_TEXT,
  localizedOptionLabel, matchLocalPathways, buildLocalLearningPlan,
} from '../src/student/careerCatalog.js';
import { languageTag } from '../src/voice/browserSpeech.js';
import { clearLocalLearnerProfile, getLocalLearnerProfile, saveLocalLearnerProfile } from '../src/offline/offlinePocket.js';

let passed = 0;
function check(name, fn) {
  fn();
  passed += 1;
  process.stdout.write(`PASS ${name}\n`);
}

check('catalogue validates unique HTTPS resources and known categories', () => {
  assert.equal(validateResourceCatalog(), true);
  assert.equal(new Set(RESOURCE_CATALOG.map((item) => item.id)).size, RESOURCE_CATALOG.length);
  assert.ok(RESOURCE_CATALOG.length >= 26);
  const ids = new Set(RESOURCE_CATALOG.map((item) => item.id));
  for (const id of ['khan-academy-india', 'ndli', 'ignou-online', 'code-org', 'leetcode-explore', 'hackerrank-tutorials']) assert.ok(ids.has(id), `${id} missing`);
  assert.ok(RESOURCE_CATALOG.every((item) => item.url.startsWith('https://')));
  assert.ok(RESOURCE_CATALOG.every((item) => RESOURCE_CATEGORIES.some((c) => c.id === item.category)));
});
check('coding collection contains W3Schools and GeeksforGeeks', () => {
  const ids = filterResources(RESOURCE_CATALOG, { category: 'coding' }).map((item) => item.id);
  for (const id of ['w3schools', 'geeksforgeeks', 'gfg-practice']) assert.ok(ids.includes(id), `${id} missing`);
});
check('search covers provider metadata and topic names', () => {
  assert.ok(filterResources(RESOURCE_CATALOG, { query: 'Python' }).some((item) => item.id === 'python-docs'));
  assert.ok(filterResources(RESOURCE_CATALOG, { query: 'scholarship' }).some((item) => item.id === 'national-scholarship-portal'));
});
check('saved-only filtering uses bookmark identifiers', () => {
  assert.deepEqual(filterResources(RESOURCE_CATALOG, { audience: 'saved', savedIds: ['w3schools', 'nptel'] }).map((item) => item.id), ['w3schools', 'nptel']);
  assert.deepEqual(filterResources(RESOURCE_CATALOG, { audience: 'saved', savedIds: [] }), []);
});
check('resource labels have identical keys in English, Hindi, Tamil and Telugu', () => {
  const expected = Object.keys(RESOURCE_COPY.en).sort();
  for (const language of ['hi', 'ta', 'te']) assert.deepEqual(Object.keys(RESOURCE_COPY[language]).sort(), expected, `${language} key mismatch`);
});
check('learner interface translations have identical keys in all four languages', () => {
  const expected = Object.keys(UI_TEXT.en).sort();
  for (const language of ['hi', 'ta', 'te']) assert.deepEqual(Object.keys(UI_TEXT[language]).sort(), expected, `${language} key mismatch`);
});
check('all 36 state/UT labels and all education-stage labels have a fallback in each language', () => {
  assert.equal(STATE_OPTIONS.length, 36);
  for (const option of [...STATE_OPTIONS, ...STAGE_OPTIONS]) {
    for (const language of ['en', 'hi', 'ta', 'te']) assert.ok(localizedOptionLabel(option, language), `${option.id} missing ${language}`);
  }
});
check('Telugu pathways and plans return translated content', () => {
  const matches = matchLocalPathways({ academicStage: 'undergraduate', preferredLanguage: 'te', interests: ['technology', 'numbers'], strengths: ['analytical'], goals: ['higherStudy'] }, 3);
  assert.equal(matches.length, 3);
  assert.ok(matches.every((path) => path.title?.te && path.summary?.te));
  assert.ok(buildLocalLearningPlan('data-business', 'te', 'undergraduate').title.includes('సంఖ్యలు'));
});
check('Telugu voice locale resolves to Indian Telugu', () => assert.equal(languageTag('te'), 'te-IN'));
await clearLocalLearnerProfile();
await saveLocalLearnerProfile({ academicStage: 'undergraduate', preferredLanguage: 'te', interests: ['technology'], goals: ['higherStudy'], allowDemoProcessing: true, phone: 'must-not-persist' });
const stored = await getLocalLearnerProfile();
assert.equal(stored.profile.preferredLanguage, 'te');
assert.equal(stored.profile.allowDemoProcessing, false);
assert.equal(stored.profile.phone, undefined);
await clearLocalLearnerProfile();
passed += 1;
process.stdout.write('PASS offline learner profile preserves Telugu while excluding processing consent and phone\n');
process.stdout.write(`\nResource hub smoke checks: ${passed}/${passed} passed (${RESOURCE_CATALOG.length} curated links; English, Hindi, Tamil, Telugu)\n`);
