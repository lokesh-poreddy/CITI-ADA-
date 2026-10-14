import { describe, expect, it, vi } from 'vitest';
import { beginSpeechRecognition, isSpeechRecognitionAvailable, languageTag } from './browserSpeech.js';

describe('browser speech adapters', () => {
  it('maps supported interface languages to Indian locale tags', () => {
    expect(languageTag('en')).toBe('en-IN');
    expect(languageTag('hi')).toBe('hi-IN');
    expect(languageTag('ta')).toBe('ta-IN');
    expect(languageTag('te')).toBe('te-IN');
    expect(languageTag('unknown')).toBe('en-IN');
  });

  it('provides a text fallback when speech recognition is unavailable', () => {
    const oldSpeechRecognition = window.SpeechRecognition;
    const oldWebkitSpeechRecognition = window.webkitSpeechRecognition;
    try {
      delete window.SpeechRecognition;
      delete window.webkitSpeechRecognition;
      expect(isSpeechRecognitionAvailable()).toBe(false);
      const onError = vi.fn();
      expect(beginSpeechRecognition({ language: 'te', onError })).toBeNull();
      expect(onError).toHaveBeenCalledWith(expect.stringContaining('type your question'));
    } finally {
      if (oldSpeechRecognition) window.SpeechRecognition = oldSpeechRecognition;
      if (oldWebkitSpeechRecognition) window.webkitSpeechRecognition = oldWebkitSpeechRecognition;
    }
  });
});
