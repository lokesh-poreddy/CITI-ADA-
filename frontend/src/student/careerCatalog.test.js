import { describe, expect, it } from 'vitest';
import { buildLocalLearningPlan, CAREER_PATHWAYS, localizedOptionLabel, matchLocalPathways, STATE_OPTIONS, STAGE_OPTIONS, UI_TEXT } from './careerCatalog.js';

describe('local career catalogue', () => {
  it('returns diverse recommendations with actionable reasons when offline', () => {
    const results = matchLocalPathways({
      academicStage: 'diploma_iti', preferredLanguage: 'en',
      interests: ['handsOn', 'technology'], strengths: ['practical', 'problemSolving'],
      goals: ['skillCertificate', 'employment'],
    }, 3);
    expect(results).toHaveLength(3);
    expect(results[0].id).toBe('skilled-technical');
    expect(results.every((item) => item.matchReasons.length > 0)).toBe(true);
    expect(new Set(results.map((item) => item.id)).size).toBe(3);
    expect(results.every((item) => item.relativeFit >= 22 && item.relativeFit <= 94)).toBe(true);
  });

  it('returns stable rankings when a learner selects the same signals in a different order', () => {
    const first = matchLocalPathways({
      academicStage: 'diploma_iti', preferredLanguage: 'en',
      interests: ['technology', 'handsOn'], strengths: ['problemSolving', 'practical'],
      goals: ['employment', 'skillCertificate'],
    }, 3);
    const reordered = matchLocalPathways({
      academicStage: 'diploma_iti', preferredLanguage: 'en',
      interests: ['handsOn', 'technology'], strengths: ['practical', 'problemSolving'],
      goals: ['skillCertificate', 'employment'],
    }, 3);
    expect(reordered.map((item) => item.id)).toEqual(first.map((item) => item.id));
    expect(reordered.map((item) => item.relativeFit)).toEqual(first.map((item) => item.relativeFit));
  });

  it('keeps a broad set of academic, vocational, creative and enterprise options', () => {
    expect(CAREER_PATHWAYS.map((path) => path.id)).toEqual([
      'skilled-technical', 'digital-creative', 'community-care', 'green-agri-enterprise', 'data-business', 'education-language',
    ]);
    expect(CAREER_PATHWAYS.every((path) => path.resources.some((resource) => resource.url.startsWith('https://')))).toBe(true);
  });

  it('provides all 36 states and union territories in all supported languages', () => {
    expect(STATE_OPTIONS).toHaveLength(36);
    expect(new Set(STATE_OPTIONS.map((state) => state.id)).size).toBe(36);
    for (const state of STATE_OPTIONS) for (const locale of ['en', 'hi', 'ta', 'te']) expect(localizedOptionLabel(state, locale)).toBeTruthy();
    for (const stage of STAGE_OPTIONS) for (const locale of ['en', 'hi', 'ta', 'te']) expect(localizedOptionLabel(stage, locale)).toBeTruthy();
    const keys = Object.keys(UI_TEXT.en).sort();
    for (const locale of ['hi', 'ta', 'te']) expect(Object.keys(UI_TEXT[locale]).sort()).toEqual(keys);
  });

  it('localizes learner labels, pathway suggestions and learning plans in Telugu', () => {
    const andhra = STATE_OPTIONS.find((state) => state.id === 'andhra-pradesh');
    expect(localizedOptionLabel(andhra, 'te')).toBe('ఆంధ్రప్రదేశ్');
    const results = matchLocalPathways({ academicStage: 'undergraduate', preferredLanguage: 'te', interests: ['technology', 'numbers'], strengths: ['analytical'], goals: ['higherStudy'] }, 3);
    expect(results[0].title.te).toBeTruthy();
    expect(results[0].matchReasons.every((reason) => !/Computers|Numbers|Analytical/.test(reason))).toBe(true);
    const teluguPlan = buildLocalLearningPlan('data-business', 'te', 'undergraduate');
    expect(teluguPlan.title).toContain('సంఖ్యలు');
    expect(teluguPlan.steps).toHaveLength(3);
    expect(teluguPlan.stageGuidance).toContain('అధికారిక');
  });

  it('builds a localized plan with three milestones and cautionary guidance', () => {
    const plan = buildLocalLearningPlan('digital-creative', 'ta', 'undergraduate');
    expect(plan.steps).toHaveLength(3);
    expect(plan.title).toContain('படைப்பு');
    expect(plan.caution).toBeTruthy();
    expect(plan.resources.length).toBeGreaterThan(0);
    expect(plan.stageGuidance).toContain('தேர்வுப் பாடங்கள்');
    expect(buildLocalLearningPlan('digital-creative', 'ta', 'std9_10').stageGuidance).not.toEqual(plan.stageGuidance);
  });
});
