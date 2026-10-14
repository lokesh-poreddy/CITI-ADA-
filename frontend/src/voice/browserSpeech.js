const LANGUAGE_TAGS = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN' };

export function languageTag(language = 'en') {
  return LANGUAGE_TAGS[language] || LANGUAGE_TAGS.en;
}

export function isSpeechRecognitionAvailable() {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function beginSpeechRecognition({ language = 'en', onText, onError, onEnd } = {}) {
  const Constructor = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  if (!Constructor) {
    onError?.('Speech input is not supported in this browser. You can type your question instead.');
    return null;
  }
  const recognition = new Constructor();
  recognition.lang = languageTag(language);
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;
  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript?.trim();
    if (transcript) onText?.(transcript);
  };
  recognition.onerror = (event) => {
    const friendly = event.error === 'not-allowed'
      ? 'Microphone permission was not granted. You can type instead.'
      : 'Voice input could not complete. Please try again or type instead.';
    onError?.(friendly);
  };
  recognition.onend = () => onEnd?.();
  try { recognition.start(); } catch { onError?.('Voice input could not start. Please type instead.'); return null; }
  return recognition;
}

export function speakText(text, language = 'en') {
  if (typeof window === 'undefined' || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(String(text || '').slice(0, 1600));
  utterance.lang = languageTag(language);
  utterance.rate = 0.94;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
}
