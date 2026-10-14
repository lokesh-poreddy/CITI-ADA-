import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, CheckCircle2, ClipboardCheck, Download, HeartHandshake,
  LockKeyhole, RefreshCw, ShieldCheck, ShieldOff, Sparkles, Trash2, WifiOff,
} from 'lucide-react';
import { PLATFORM_API_BASE } from '../api/opportunities.js';
import { getLocalLearnerKey } from '../offline/offlinePocket.js';
import './impact-trust-console.css';

const MESSAGES = {
  en: {
    eyebrow: 'TRUST · EVIDENCE · READINESS', title: 'Impact & Trust Centre',
    intro: 'A transparent control surface for aggregate impact signals, learner choices and prototype release boundaries.',
    privacy: 'Your choices', privacyText: 'You can change these prototype preferences at any time. Saying no to optional analytics does not block learning or public opportunity discovery.',
    guidance: 'Personalized guidance', guidanceText: 'Use interests and stated goals to shape suggested pathways.',
    sharing: 'Facilitator sharing', sharingText: 'Allow a facilitator to view information you explicitly share for support.',
    analytics: 'Optional aggregate analytics', analyticsText: 'Share anonymous event counts to help the team improve task completion. No names, questions or learner-level histories are sent.',
    save: 'Save choice', saved: 'Preference saved', revoke: 'Withdraw all preferences',
    rights: 'Data rights requests', rightsText: 'Request an access/export review or an erasure review. This prototype records the request for manual handling; it does not claim to export or erase all data automatically.',
    export: 'Request access/export review', erase: 'Request erasure review', pending: 'Request recorded for manual review',
    metrics: 'Impact measurement', metricsText: 'Events are counted into fixed aggregate buckets. The analytics service intentionally does not store individual event rows or free-text content.',
    sendTest: 'Send test event', testOnly: 'Demo-only action: sends one TEST_EVENT counter, not a learner action.', eventSent: 'Aggregate test event accepted.', optInFirst: 'Enable optional analytics first to send a test event.',
    readiness: 'Release readiness', status: 'Prototype boundary', refresh: 'Refresh status', notReady: 'Not production-ready', readinessLoading: 'Checking deployment status…',
    limitation: 'This display is not a compliance certification or a real-world impact claim.', loading: 'Loading privacy settings…', unavailable: 'The platform API is unavailable. Your choice has not been saved.',
    noticeMissing: 'Could not load the full policy notice.', health: 'Platform API', available: 'Available', unavailableShort: 'Unavailable',
    storage: 'Storage', auth: 'Identity', disabled: 'Disabled external capabilities', gates: 'Required before real users',
    accepted: 'Request recorded. Manual fulfillment is required; no export or erasure has yet been performed.',
  },
  hi: {
    eyebrow: 'विश्वास · प्रमाण · तैयारी', title: 'प्रभाव और विश्वास केंद्र',
    intro: 'प्रभाव संकेतों, विद्यार्थी की पसंद और प्रोटोटाइप की सीमाओं के लिए पारदर्शी नियंत्रण पटल।',
    privacy: 'आपकी पसंद', privacyText: 'आप इन प्रोटोटाइप विकल्पों को कभी भी बदल सकते हैं। वैकल्पिक विश्लेषण से मना करने पर सीखने या सार्वजनिक अवसरों तक पहुँच नहीं रुकेगी।',
    guidance: 'व्यक्तिगत मार्गदर्शन', guidanceText: 'रुचियों और बताए गए लक्ष्यों से सुझाए गए रास्ते बेहतर बनाएँ।',
    sharing: 'मार्गदर्शक के साथ साझा करना', sharingText: 'सहायता के लिए केवल आपके द्वारा साझा की गई जानकारी मार्गदर्शक को दिखाएँ।',
    analytics: 'वैकल्पिक समेकित विश्लेषण', analyticsText: 'कार्य पूरा करने में सुधार के लिए अनाम इवेंट गणनाएँ साझा करें। नाम, प्रश्न या व्यक्तिगत इतिहास नहीं भेजे जाते।',
    save: 'पसंद सहेजें', saved: 'पसंद सहेजी गई', revoke: 'सभी पसंद वापस लें',
    rights: 'डेटा अधिकार अनुरोध', rightsText: 'डेटा पहुँच/निर्यात या मिटाने की समीक्षा माँगें। प्रोटोटाइप अनुरोध दर्ज करता है; यह स्वतः पूरा करने का दावा नहीं करता।',
    export: 'पहुँच/निर्यात समीक्षा माँगें', erase: 'मिटाने की समीक्षा माँगें', pending: 'अनुरोध मैनुअल समीक्षा के लिए दर्ज',
    metrics: 'प्रभाव मापन', metricsText: 'इवेंट निश्चित समेकित समूहों में गिने जाते हैं। व्यक्तिगत इवेंट रिकॉर्ड या मुक्त-पाठ सेव नहीं होता।',
    sendTest: 'परीक्षण इवेंट भेजें', testOnly: 'केवल डेमो: एक TEST_EVENT गणना भेजता है, विद्यार्थी की गतिविधि नहीं।', eventSent: 'समेकित परीक्षण इवेंट स्वीकार हुआ।',
    optInFirst: 'परीक्षण इवेंट भेजने से पहले वैकल्पिक विश्लेषण चालू करें।', readiness: 'रिलीज़ तैयारी', status: 'प्रोटोटाइप सीमा', refresh: 'स्थिति फिर जाँचें', notReady: 'उत्पादन के लिए तैयार नहीं',
    readinessLoading: 'डिप्लॉयमेंट स्थिति जाँची जा रही है…', limitation: 'यह दृश्य कानूनी अनुपालन प्रमाणपत्र या वास्तविक प्रभाव का दावा नहीं है।', loading: 'गोपनीयता सेटिंग लोड हो रही हैं…',
    unavailable: 'प्लेटफ़ॉर्म API उपलब्ध नहीं है। आपकी पसंद सहेजी नहीं गई।', noticeMissing: 'पूरी नीति सूचना लोड नहीं हो सकी।', health: 'प्लेटफ़ॉर्म API', available: 'उपलब्ध', unavailableShort: 'अनुपलब्ध',
    storage: 'स्टोरेज', auth: 'पहचान', disabled: 'बंद बाहरी क्षमताएँ', gates: 'वास्तविक उपयोगकर्ताओं से पहले आवश्यक', accepted: 'अनुरोध दर्ज हुआ। मैनुअल प्रक्रिया आवश्यक है; डेटा निर्यात या मिटाया नहीं गया है।',
  },
  ta: {
    eyebrow: 'நம்பிக்கை · ஆதாரம் · தயார்நிலை', title: 'தாக்கம் மற்றும் நம்பிக்கை மையம்',
    intro: 'தாக்கக் குறியீடுகள், மாணவர் தேர்வுகள் மற்றும் முன்மாதிரி வரம்புகளுக்கான வெளிப்படையான கட்டுப்பாட்டு பகுதி.',
    privacy: 'உங்கள் தேர்வுகள்', privacyText: 'இந்த முன்மாதிரி விருப்பங்களை எப்போது வேண்டுமானாலும் மாற்றலாம். விருப்பத் தேர்வு பகுப்பாய்வை மறுப்பது கற்றல் அல்லது பொது வாய்ப்புகளுக்கான அணுகலைத் தடுக்காது.',
    guidance: 'தனிப்பயன் வழிகாட்டுதல்', guidanceText: 'ஆர்வங்கள் மற்றும் கூறிய இலக்குகளின் அடிப்படையில் வழிகளைப் பரிந்துரைக்கவும்.',
    sharing: 'வழிகாட்டியுடன் பகிர்வு', sharingText: 'உதவிக்காக நீங்கள் வெளிப்படையாகப் பகிர்ந்த தகவலை மட்டும் காட்டவும்.',
    analytics: 'விருப்பத் தொகுக்கப்பட்ட பகுப்பாய்வு', analyticsText: 'பணிகளை மேம்படுத்த பெயரில்லா நிகழ்வு எண்ணிக்கைகளைப் பகிரவும். பெயர்கள், கேள்விகள் அல்லது தனிநபர் வரலாறு அனுப்பப்படாது.',
    save: 'தேர்வைச் சேமி', saved: 'விருப்பம் சேமிக்கப்பட்டது', revoke: 'அனைத்து விருப்பங்களையும் திரும்பப் பெறு',
    rights: 'தரவு உரிமை கோரிக்கைகள்', rightsText: 'தரவு அணுகல்/ஏற்றுமதி அல்லது நீக்கல் மதிப்பாய்வைக் கோரலாம். இந்த முன்மாதிரி கோரிக்கையை பதிவு செய்கிறது; தானாகவே முடித்ததாகக் கூறாது.',
    export: 'அணுகல்/ஏற்றுமதி மதிப்பாய்வு கோரு', erase: 'நீக்கல் மதிப்பாய்வு கோரு', pending: 'கோரிக்கை கைமுறை மதிப்பாய்வுக்கு பதிவு செய்யப்பட்டது',
    metrics: 'தாக்க அளவீடு', metricsText: 'நிகழ்வுகள் தொகுக்கப்பட்ட எண்ணிக்கைகளாக மட்டுமே கணக்கிடப்படுகின்றன. தனிநபர் நிகழ்வு வரலாறோ திறந்த உரையோ சேமிக்கப்படாது.',
    sendTest: 'சோதனை நிகழ்வை அனுப்பு', testOnly: 'டெமோ மட்டும்: ஒரு TEST_EVENT எண்ணிக்கையை அனுப்பும்; மாணவர் செயலை அல்ல.', eventSent: 'தொகுக்கப்பட்ட சோதனை நிகழ்வு ஏற்கப்பட்டது.',
    optInFirst: 'சோதனை நிகழ்வை அனுப்ப முன் விருப்பப் பகுப்பாய்வை இயக்கவும்.', readiness: 'வெளியீட்டு தயார்நிலை', status: 'முன்மாதிரி வரம்பு', refresh: 'நிலையைப் புதுப்பி', notReady: 'உற்பத்திக்குத் தயாரில்லை',
    readinessLoading: 'வெளியீட்டு நிலை சரிபார்க்கப்படுகிறது…', limitation: 'இது இணக்கச் சான்றிதழோ உண்மையான தாக்கக் கூற்றோ அல்ல.', loading: 'தனியுரிமை அமைப்புகள் ஏற்றப்படுகின்றன…',
    unavailable: 'தள API கிடைக்கவில்லை. உங்கள் தேர்வு சேமிக்கப்படவில்லை.', noticeMissing: 'முழு கொள்கை அறிவிப்பை ஏற்ற முடியவில்லை.', health: 'தள API', available: 'கிடைக்கிறது', unavailableShort: 'கிடைக்கவில்லை',
    storage: 'சேமிப்பு', auth: 'அடையாளம்', disabled: 'முடக்கப்பட்ட வெளிப்புற வசதிகள்', gates: 'உண்மைப் பயனர்களுக்கு முன் தேவையானவை', accepted: 'கோரிக்கை பதிவு செய்யப்பட்டது. கைமுறை செயலாக்கம் தேவை; தரவு ஏற்றுமதி அல்லது நீக்கம் இன்னும் செய்யப்படவில்லை.',
  },
};

async function api(path, options = {}) {
  const response = await fetch(`${PLATFORM_API_BASE}${path}`, {
    ...options,
    headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) },
    cache: 'no-store', signal: options.signal || AbortSignal.timeout(6000),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || `Request failed (${response.status})`);
  return body;
}

const PURPOSES = [
  { scope: 'PERSONALIZED_GUIDANCE', key: 'guidance' },
  { scope: 'FACILITATOR_SHARING', key: 'sharing' },
  { scope: 'OPTIONAL_ANALYTICS', key: 'analytics' },
];

export default function ImpactTrustConsole({ language = 'en' }) {
  const t = MESSAGES[language] || MESSAGES.en;
  const [actorKey] = useState(() => getLocalLearnerKey());
  const [notice, setNotice] = useState(null);
  const [release, setRelease] = useState(null);
  const [consents, setConsents] = useState({});
  const [draft, setDraft] = useState({ PERSONALIZED_GUIDANCE: false, FACILITATOR_SHARING: false, OPTIONAL_ANALYTICS: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [rightsRequests, setRightsRequests] = useState([]);
  const reviewerGates = useMemo(() => release?.releaseGates || [], [release]);

  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    const actorHeaders = { 'X-Actor-Key': actorKey };
    const [noticeResult, releaseResult, consentResult, rightsResult] = await Promise.allSettled([
      api('/privacy/notice'), api('/release/status'), api('/privacy/consents', { headers: actorHeaders }), api('/privacy/data-rights-requests', { headers: actorHeaders }),
    ]);
    if (noticeResult.status === 'fulfilled') setNotice(noticeResult.value); else setError(t.noticeMissing);
    if (releaseResult.status === 'fulfilled') { setRelease(releaseResult.value); setApiAvailable(true); } else setApiAvailable(false);
    if (consentResult.status === 'fulfilled') {
      const next = Object.fromEntries(consentResult.value.map((item) => [item.scope, item.granted]));
      setConsents(next); setDraft({ PERSONALIZED_GUIDANCE: false, FACILITATOR_SHARING: false, OPTIONAL_ANALYTICS: false, ...next });
    }
    if (rightsResult.status === 'fulfilled') setRightsRequests(rightsResult.value);
    setLoading(false);
  }, [actorKey, t.noticeMissing]);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); };
  }, []);

  async function savePreferences() {
    setSaving(true); setError(''); setMessage('');
    try {
      const changed = await Promise.all(PURPOSES.map(({ scope }) => api('/privacy/consents', {
        method: 'PUT', headers: { 'X-Actor-Key': actorKey }, body: JSON.stringify({ scope, granted: Boolean(draft[scope]), policyVersion: notice?.policyVersion || '2026-10-14-v1' }),
      })));
      setConsents(Object.fromEntries(changed.map((item) => [item.scope, item.granted]))); setMessage(t.saved);
    } catch { setError(t.unavailable); }
    finally { setSaving(false); }
  }

  async function revokePreferences() {
    setSaving(true); setError(''); setMessage('');
    try {
      await api('/privacy/consents', { method: 'DELETE', headers: { 'X-Actor-Key': actorKey } });
      setConsents({}); setDraft({ PERSONALIZED_GUIDANCE: false, FACILITATOR_SHARING: false, OPTIONAL_ANALYTICS: false }); setMessage(t.saved);
    } catch { setError(t.unavailable); }
    finally { setSaving(false); }
  }

  async function requestRights(requestType) {
    setError(''); setMessage('');
    try {
      const result = await api('/privacy/data-rights-requests', { method: 'POST', headers: { 'X-Actor-Key': actorKey }, body: JSON.stringify({ requestType }) });
      setRightsRequests((items) => [result, ...items]); setMessage(t.accepted);
    } catch { setError(t.unavailable); }
  }

  async function sendTestEvent() {
    setError(''); setMessage('');
    if (!consents.OPTIONAL_ANALYTICS) { setError(t.optInFirst); return; }
    try {
      await api('/analytics/events', { method: 'POST', headers: { 'X-Actor-Key': actorKey }, body: JSON.stringify({ eventName: 'TEST_EVENT', actorRole: 'ANONYMOUS', connectivity: isOnline ? 'ONLINE' : 'OFFLINE', language: ['en', 'hi', 'ta', 'te'].includes(language) ? language : 'unknown' }) });
      setMessage(t.eventSent);
    } catch { setError(t.unavailable); }
  }

  return (
    <section className="impact-trust section-shell" id="impact-trust" aria-labelledby="impact-trust-title">
      <div className="impact-trust__inner">
        <div className="impact-trust__heading">
          <div>
            <span className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</span>
            <h2 id="impact-trust-title">{t.title}</h2>
            <p>{t.intro}</p>
          </div>
          <button className="impact-trust__refresh" type="button" onClick={refresh} disabled={loading}><RefreshCw size={15} className={loading ? 'is-spinning' : ''} />{t.refresh}</button>
        </div>

        <div className="impact-trust__status-grid">
          <article className="trust-status-card">
            <span className="trust-status-card__icon"><Activity size={19} /></span><span className="trust-status-card__label">{t.health}</span>
            <strong className={apiAvailable ? 'trust-good' : 'trust-warn'}>{apiAvailable ? t.available : t.unavailableShort}</strong>
            <small>{loading ? t.readinessLoading : release?.releaseStage || 'Status unavailable'}</small>
          </article>
          <article className="trust-status-card">
            <span className="trust-status-card__icon"><ShieldCheck size={19} /></span><span className="trust-status-card__label">{t.status}</span>
            <strong className={release?.productionReady ? 'trust-good' : 'trust-warn'}>{release?.productionReady ? t.ready : t.notReady}</strong><small>{release?.persistenceMode || 'Storage state unavailable'}</small>
          </article>
          <article className="trust-status-card">
            <span className="trust-status-card__icon"><WifiOff size={19} /></span><span className="trust-status-card__label">Connectivity</span>
            <strong>{isOnline ? 'Online' : 'Offline'}</strong><small>Saved actions may require sync when the connection returns.</small>
          </article>
        </div>

        <div className="impact-trust__grid">
          <section className="trust-panel" aria-labelledby="privacy-heading">
            <div className="trust-panel__heading"><span className="trust-panel__icon"><LockKeyhole size={19} /></span><div><h3 id="privacy-heading">{t.privacy}</h3><p>{t.privacyText}</p></div></div>
            {loading && <p className="trust-muted">{t.loading}</p>}
            <div className="consent-list">
              {PURPOSES.map(({ scope, key }) => (
                <label className="consent-row" key={scope}>
                  <span className="consent-row__copy"><strong>{t[key]}</strong><small>{t[`${key}Text`]}</small></span>
                  <input type="checkbox" checked={Boolean(draft[scope])} disabled={loading || saving} onChange={(event) => setDraft((current) => ({ ...current, [scope]: event.target.checked }))} aria-label={t[key]} />
                </label>
              ))}
            </div>
            <div className="trust-panel__actions"><button type="button" className="trust-button trust-button--primary" disabled={saving || loading} onClick={savePreferences}>{saving ? 'Saving…' : t.save}</button><button type="button" className="trust-button trust-button--quiet" disabled={saving || loading} onClick={revokePreferences}><ShieldOff size={15} />{t.revoke}</button></div>
            {notice && <details className="privacy-notice"><summary>Privacy notice · {notice.policyVersion}</summary><ul>{(notice.prototypeLimitations || []).map((item) => <li key={item}>{item}</li>)}</ul></details>}
          </section>

          <section className="trust-panel" aria-labelledby="metrics-heading">
            <div className="trust-panel__heading"><span className="trust-panel__icon"><ClipboardCheck size={19} /></span><div><h3 id="metrics-heading">{t.metrics}</h3><p>{t.metricsText}</p></div></div>
            <div className="aggregate-explainer"><div className="aggregate-explainer__ring"><Activity size={24} /></div><div><strong>Fixed event vocabulary</strong><span>Role, language and connectivity buckets only</span></div></div>
            <p className="trust-muted">{t.testOnly}</p>
            <button type="button" className="trust-button trust-button--primary" onClick={sendTestEvent} disabled={!consents.OPTIONAL_ANALYTICS}><Sparkles size={15} />{t.sendTest}</button>
            <div className="rights-block"><h4>{t.rights}</h4><p>{t.rightsText}</p><div className="rights-actions"><button type="button" className="trust-button trust-button--quiet" onClick={() => requestRights('ACCESS_EXPORT')}><Download size={15} />{t.export}</button><button type="button" className="trust-button trust-button--danger" onClick={() => requestRights('ERASURE')}><Trash2 size={15} />{t.erase}</button></div>
              {rightsRequests.length > 0 && <p className="rights-note"><AlertTriangle size={15} />{rightsRequests.length} request(s): {rightsRequests[0].status}. {t.accepted}</p>}
            </div>
          </section>
        </div>

        <section className="release-gates" aria-labelledby="release-gates-heading">
          <div className="release-gates__heading"><span className="trust-panel__icon"><HeartHandshake size={19} /></span><div><h3 id="release-gates-heading">{t.gates}</h3><p>{t.limitation}</p></div></div>
          <div className="release-gates__grid">{reviewerGates.length ? reviewerGates.map((gate) => <div className="release-gate" key={gate}><AlertTriangle size={15} /><span>{gate}</span></div>) : <p className="trust-muted">{t.readinessLoading}</p>}</div>
          {release?.disabledExternalCapabilities?.length > 0 && <p className="release-gates__disabled"><strong>{t.disabled}:</strong> {release.disabledExternalCapabilities.join(' · ')}</p>}
        </section>
        {(message || error) && <div className={`trust-feedback ${error ? 'trust-feedback--error' : 'trust-feedback--success'}`} role="status">{error ? <AlertTriangle size={17} /> : <CheckCircle2 size={17} />}{error || message}</div>}
      </div>
    </section>
  );
}
