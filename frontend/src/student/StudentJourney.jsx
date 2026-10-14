import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronRight, Compass,
  GraduationCap, Heart, Lightbulb, LoaderCircle, MapPin, RefreshCw, ShieldCheck,
  Sparkles, Sprout, Wrench, Palette, Laptop, MessageCircle,
  Briefcase, FlaskConical, Trash2, Wifi, WifiOff, BarChart3,
} from 'lucide-react';
import { createLearnerProfile, deleteLearnerProfile, fetchCareerRecommendations, fetchLearningPathway } from '../api/learnerJourney.js';
import { clearLocalLearnerProfile, getLocalLearnerProfile, saveLocalLearnerProfile } from '../offline/offlinePocket.js';
import {
  buildLocalLearningPlan, CAREER_PATHWAYS, GOAL_OPTIONS, INTEREST_OPTIONS, localizedOptionLabel,
  matchLocalPathways, STAGE_GUIDANCE, STAGE_OPTIONS, STATE_OPTIONS, STRENGTH_OPTIONS, UI_TEXT,
} from './careerCatalog.js';
import './student-journey.css';

const ICONS = {
  tool: Wrench, laptop: Laptop, palette: Palette, heart: Heart, sprout: Sprout,
  chart: BarChart3, message: MessageCircle, briefcase: Briefcase,
  book: BookOpen, flask: FlaskConical,
};
const PATH_ICONS = {
  'skilled-technical': Wrench, 'digital-creative': Palette, 'community-care': Heart,
  'green-agri-enterprise': Sprout, 'data-business': BarChart3, 'education-language': BookOpen,
};
const EMPTY_PROFILE = (language) => ({
  academicStage: 'std9_10', preferredLanguage: language || 'en', state: '',
  interests: [], strengths: [], goals: [], allowDemoProcessing: false, selectedPathwayId: '',
});
const normaliseLanguage = (language) => ['en', 'hi', 'ta', 'te'].includes(language) ? language : 'en';

function ChoiceChip({ selected, label, icon: Icon, onClick, id }) {
  return <button type="button" className={`journey-chip ${selected ? 'journey-chip--selected' : ''}`} onClick={onClick} aria-pressed={selected} key={id}>
    {Icon && <Icon size={17} aria-hidden="true" />}<span>{label}</span>{selected && <Check size={15} aria-hidden="true" />}
  </button>;
}

function ToggleGroup({ title, options, selectedIds, onToggle, language, iconOptions = false }) {
  return <fieldset className="journey-fieldset">
    <legend className="journey-fieldset__legend">{title}</legend>
    <div className="journey-chip-grid">
      {options.map((option) => <ChoiceChip
        key={option.id}
        id={option.id}
        selected={selectedIds.includes(option.id)}
        label={localizedOptionLabel(option, language)}
        icon={iconOptions ? ICONS[option.icon] : undefined}
        onClick={() => onToggle(option.id)}
      />)}
    </div>
  </fieldset>;
}

export default function StudentJourney({ language = 'en', onLanguageChange = () => {}, onExploreOpportunities }) {
  const locale = normaliseLanguage(language);
  const t = UI_TEXT[locale];
  const [step, setStep] = useState('welcome');
  const [profile, setProfile] = useState(() => EMPTY_PROFILE(locale));
  const [matches, setMatches] = useState([]);
  const [selectedPathwayId, setSelectedPathwayId] = useState('');
  const [plan, setPlan] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [serviceMode, setServiceMode] = useState('local');
  const [savedOnDevice, setSavedOnDevice] = useState(false);
  const [hadSavedProfile, setHadSavedProfile] = useState(false);
  const [profileUpdatedAt, setProfileUpdatedAt] = useState('');
  const [storageMode, setStorageMode] = useState('INDEXEDDB');
  const [remoteProfileId, setRemoteProfileId] = useState('');
  const [clearRetryAvailable, setClearRetryAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);

  useEffect(() => {
    let active = true;
    getLocalLearnerProfile().then((saved) => {
      if (!active || !saved?.profile) return;
      setProfile({ ...EMPTY_PROFILE(locale), ...saved.profile, allowDemoProcessing: false, preferredLanguage: locale });
      setHadSavedProfile(true);
      setProfileUpdatedAt(saved.updatedAt || '');
      setStorageMode(saved.storageMode || 'MEMORY_SESSION');
      setSavedOnDevice(saved.storageMode === 'INDEXEDDB');
      if (saved.profile.selectedPathwayId) setSelectedPathwayId(saved.profile.selectedPathwayId);
    }).catch(() => { /* local journey remains usable if browser storage is unavailable */ });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setProfile((current) => ({ ...current, preferredLanguage: locale }));
  }, [locale]);

  // Persist only low-risk structured choices locally while the learner is editing.
  // Debouncing reduces writes on slower devices; no request is sent to the server.
  useEffect(() => {
    if (!['profile', 'signals'].includes(step)) return undefined;
    let active = true;
    const timer = globalThis.setTimeout(async () => {
      try {
        const saved = await saveLocalLearnerProfile(profile);
        if (!active) return;
        const mode = saved.storageMode || 'MEMORY_SESSION';
        setStorageMode(mode);
        setSavedOnDevice(mode === 'INDEXEDDB');
        setHadSavedProfile(true);
        setProfileUpdatedAt(saved.updatedAt || new Date().toISOString());
      } catch {
        if (active) {
          setStorageMode('UNAVAILABLE');
          setSavedOnDevice(false);
        }
      }
    }, 250);
    return () => {
      active = false;
      globalThis.clearTimeout(timer);
    };
  }, [profile, step]);

  useEffect(() => {
    const markOnline = () => setIsOnline(true);
    const markOffline = () => setIsOnline(false);
    window.addEventListener('online', markOnline);
    window.addEventListener('offline', markOffline);
    return () => { window.removeEventListener('online', markOnline); window.removeEventListener('offline', markOffline); };
  }, []);

  const currentStepIndex = ({ welcome: 0, profile: 1, signals: 2, results: 3, plan: 4 })[step] ?? 0;
  const selectedPathway = useMemo(() => CAREER_PATHWAYS.find((path) => path.id === selectedPathwayId) || null, [selectedPathwayId]);

  function toggle(field, id) {
    setProfile((current) => {
      const list = Array.isArray(current[field]) ? current[field] : [];
      return { ...current, [field]: list.includes(id) ? list.filter((value) => value !== id) : [...list, id] };
    });
  }

  function goBack() {
    setNotice('');
    setStep((current) => current === 'signals' ? 'profile' : current === 'results' ? 'signals' : current === 'plan' ? 'results' : 'welcome');
  }

  async function persistLocal(nextProfile) {
    try {
      const saved = await saveLocalLearnerProfile(nextProfile);
      const mode = saved.storageMode || 'MEMORY_SESSION';
      setSavedOnDevice(mode === 'INDEXEDDB');
      setHadSavedProfile(true);
      setProfileUpdatedAt(saved.updatedAt || new Date().toISOString());
      setStorageMode(mode);
      return mode;
    } catch {
      setNotice(t.storageUnavailable);
      setSavedOnDevice(false);
      setStorageMode('UNAVAILABLE');
      return 'UNAVAILABLE';
    }
  }

  async function generatePathways() {
    if (!profile.interests.length || !profile.goals.length) {
      setNotice(t.noSelections);
      return;
    }
    const nextProfile = { ...profile, preferredLanguage: locale, selectedPathwayId: '' };
    setProfile(nextProfile);
    setBusy(true);
    setNotice('');
    setServiceMode('local');
    let localResults = matchLocalPathways(nextProfile, 3);
    const localMode = await persistLocal(nextProfile);

    if (nextProfile.allowDemoProcessing && isOnline) {
      setServiceMode('checking');
      setNotice(t.processing);
      let createdProfile = null;
      try {
        // The API currently creates a new temporary profile on each POST; retire any prior one first.
        if (remoteProfileId) {
          const removed = await deleteLearnerProfile(remoteProfileId);
          if (!removed) throw new Error('Could not retire the previous temporary profile');
          setRemoteProfileId('');
        }
        createdProfile = await createLearnerProfile(nextProfile);
        if (!/^learner-[0-9a-fA-F-]{36}$/.test(String(createdProfile?.learnerId || ''))) {
          throw new Error('Demo service returned an invalid temporary profile identifier');
        }
        setRemoteProfileId(createdProfile.learnerId);
        const remote = await fetchCareerRecommendations(createdProfile.learnerId);
        const knownIds = new Set(CAREER_PATHWAYS.map((path) => path.id));
        const supportedItems = (Array.isArray(remote?.items) ? remote.items : []).filter((item) =>
          knownIds.has(item?.pathwayId) && Number.isFinite(item?.relativeFit) && item.relativeFit >= 22 && item.relativeFit <= 94);
        if (supportedItems.length === 0) throw new Error('Demo service returned no supported pathway scores');
        const scores = new Map(supportedItems.map((item) => [item.pathwayId, item]));
        localResults = [...localResults].map((item) => ({
          ...item,
          relativeFit: scores.get(item.id)?.relativeFit ?? item.relativeFit,
          serviceExplanation: scores.get(item.id)?.explanation || '',
        })).sort((a, b) => b.relativeFit - a.relativeFit || a.title.en.localeCompare(b.title.en));
        setServiceMode('remote');
        setNotice(t.serverSaved);
      } catch {
        if (/^learner-[0-9a-fA-F-]{36}$/.test(String(createdProfile?.learnerId || ''))) {
          const removed = await deleteLearnerProfile(createdProfile.learnerId);
          setRemoteProfileId(removed ? '' : createdProfile.learnerId);
        } else {
          setRemoteProfileId('');
        }
        setServiceMode('local');
        setNotice(t.serverUnavailable);
      }
    } else if (!isOnline) {
      setNotice(localMode === 'INDEXEDDB' ? t.offline : t.localSessionFallback);
    } else {
      setNotice(localMode === 'INDEXEDDB' ? t.localSaved : t.localSessionFallback);
    }
    setMatches(localResults);
    setStep('results');
    setBusy(false);
  }

  async function openPlan(pathway) {
    setSelectedPathwayId(pathway.id);
    const nextProfile = { ...profile, preferredLanguage: locale, selectedPathwayId: pathway.id };
    setProfile(nextProfile);
    setPlan(buildLocalLearningPlan(pathway.id, locale, nextProfile.academicStage));
    setStep('plan');
    setNotice('');
    // Persist the selected route locally before any potentially slow network request.
    await persistLocal(nextProfile);
    // Public, non-personal plan data may be read without sending learner information.
    if (isOnline) {
      try {
        const remotePlan = await fetchLearningPathway(pathway.id);
        if (remotePlan?.pathwayId === pathway.id) {
          setPlan((current) => current?.pathwayId === pathway.id ? { ...current, catalogueConnected: true, remoteSourceNotice: remotePlan.sourceNotice || '' } : current);
        }
      } catch { /* local plan intentionally remains available */ }
    }
  }

  async function resumeSaved() {
    const local = await getLocalLearnerProfile().catch(() => null);
    if (!local?.profile) { setNotice(t.noProfile); return; }
    const nextProfile = { ...EMPTY_PROFILE(locale), ...local.profile, allowDemoProcessing: false, preferredLanguage: locale };
    setProfile(nextProfile);
    const found = matchLocalPathways(nextProfile, 3);
    setMatches(found);
    setStorageMode(local.storageMode || 'MEMORY_SESSION');
    setSavedOnDevice(local.storageMode === 'INDEXEDDB');
    if (nextProfile.selectedPathwayId) {
      const target = CAREER_PATHWAYS.find((path) => path.id === nextProfile.selectedPathwayId);
      if (target) {
        setPlan(buildLocalLearningPlan(target.id, locale, nextProfile.academicStage));
        setSelectedPathwayId(target.id);
        setStep('plan');
        return;
      }
    }
    setStep('results');
  }

  async function clearProfile() {
    // Browser deletion and server deletion are separate operations; never claim both succeeded
    // when the remote cleanup request failed or the browser is offline.
    const remoteCleared = !remoteProfileId || (isOnline && await deleteLearnerProfile(remoteProfileId));
    const localCleared = await clearLocalLearnerProfile().then(() => true).catch(() => false);
    setProfile(EMPTY_PROFILE(locale));
    setMatches([]);
    setSelectedPathwayId('');
    setPlan(null);
    setHadSavedProfile(false);
    setSavedOnDevice(false);
    setProfileUpdatedAt('');
    setRemoteProfileId(remoteCleared ? '' : remoteProfileId);
    setClearRetryAvailable(!localCleared || !remoteCleared);
    setStorageMode('INDEXEDDB');
    setServiceMode('local');
    const messages = [localCleared ? t.cleared : t.clearFailed];
    if (!remoteCleared) messages.push(t.remoteCleanupPending);
    setNotice(messages.join(' '));
    setStep('welcome');
  }

  function exploreRelatedOpportunities() {
    const selected = selectedPathway;
    if (typeof onExploreOpportunities === 'function' && selected) {
      const queries = {
        'skilled-technical': 'skills',
        'digital-creative': 'course',
        'community-care': 'education',
        'green-agri-enterprise': 'skills',
        'data-business': 'course',
        'education-language': 'learning',
      };
      onExploreOpportunities({ pathwayId: selected.id, query: queries[selected.id] || selected.title.en });
    } else {
      document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return <section id="student-journey" className="student-journey-section">
    <div className="container">
      <div className="journey-header">
        <div>
          <span className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</span>
          <h2>{t.title}</h2>
          <p>{t.intro}</p>
        </div>
        <div className="journey-header-mark" aria-hidden="true"><Compass size={30} /><Sparkles size={17} /></div>
      </div>

      <div className="journey-notice" role="note">
        {isOnline ? <Wifi size={17} /> : <WifiOff size={17} />}
        <span>{t.networkNotice}</span>
      </div>

      <div className="journey-workspace">
        <aside className="journey-sidebar" aria-label={t.sidebarAria}>
          <div className="journey-sidebar__top"><span className="journey-sidebar__kicker">{t.sidebarKicker}</span><h3>{t.steps[currentStepIndex]}</h3><p>{currentStepIndex === 0 ? t.startSmall : t.stepMeta[currentStepIndex]}</p></div>
          <ol className="journey-step-list">
            {t.steps.map((label, index) => <li key={label} className={index === currentStepIndex ? 'is-active' : index < currentStepIndex ? 'is-complete' : ''}>
              <span className="journey-step-list__marker">{index < currentStepIndex ? <Check size={13} /> : String(index + 1).padStart(2, '0')}</span><span>{label}</span>
            </li>)}
          </ol>
          <div className="journey-sidebar__foot"><ShieldCheck size={18} /><span>{t.sidebarFoot}</span></div>
        </aside>

        <div className="journey-main" aria-live="polite">
          {step === 'welcome' && <div className="journey-screen journey-welcome">
            <div className="journey-welcome__art"><div className="journey-welcome__orb journey-welcome__orb--one"/><div className="journey-welcome__orb journey-welcome__orb--two"/><div className="journey-welcome__route"><span><Compass size={18}/></span><i/><span><BookOpen size={18}/></span><i/><span><Sprout size={18}/></span></div><div className="journey-welcome__stamp"><Sparkles size={15}/> {t.welcomeStamp}</div></div>
            <div className="journey-welcome__copy"><span className="journey-small-label">{t.welcomeEyebrow}</span><h3>{t.welcomeTitle}</h3><p>{t.welcomeBody}</p>
              <div className="journey-privacy-points"><span><CheckCircle2 size={16}/>{t.privacyNoIdentity}</span><span><CheckCircle2 size={16}/>{t.offlineWorks}</span><span><CheckCircle2 size={16}/>{t.clearAnytime}</span></div>
              <div className="journey-actions"><button type="button" className="journey-primary" onClick={() => { setNotice(''); setStep('profile'); }}>{t.start}<ArrowRight size={17}/></button>{hadSavedProfile && <button type="button" className="journey-secondary" onClick={resumeSaved}><RefreshCw size={16}/>{t.resumeSaved}</button>}</div>
              {hadSavedProfile && <div className="journey-saved-caption">{storageMode === 'INDEXEDDB' ? t.localSaved : t.localSessionFallback}{profileUpdatedAt && storageMode === 'INDEXEDDB' && <span> · {new Date(profileUpdatedAt).toLocaleDateString(locale === 'te' ? 'te-IN' : locale === 'ta' ? 'ta-IN' : locale === 'hi' ? 'hi-IN' : 'en-IN')}</span>}</div>}{(hadSavedProfile || remoteProfileId || clearRetryAvailable) && <div className="journey-local-controls"><button type="button" onClick={clearProfile}><Trash2 size={15}/>{!hadSavedProfile && (remoteProfileId || clearRetryAvailable) ? t.retryCleanup : t.clear}</button></div>}
            </div>
          </div>}

          {step === 'profile' && <div className="journey-screen">
            <div className="journey-screen-head"><span className="journey-small-label">{t.stepMeta[1]}</span><h3>{t.stageTitle}</h3><p>{t.stageHint}</p></div>
            <div className="journey-form-grid">
              <label className="journey-control"><span>{t.stageTitle}</span><select value={profile.academicStage} onChange={(event) => setProfile((current) => ({ ...current, academicStage: event.target.value }))}>{STAGE_OPTIONS.map((option) => <option key={option.id} value={option.id}>{localizedOptionLabel(option, locale)}</option>)}</select></label>
              <label className="journey-control"><span>{t.language}</span><select value={locale} onChange={(event) => { const value = event.target.value; setProfile((current) => ({ ...current, preferredLanguage: value })); onLanguageChange(value); }}><option value="en">English</option><option value="hi">हिन्दी</option><option value="ta">தமிழ்</option><option value="te">తెలుగు</option></select></label>
              <label className="journey-control journey-control--wide"><span>{t.state}</span><select value={profile.state} onChange={(event) => setProfile((current) => ({ ...current, state: event.target.value }))}><option value="">{t.statePlaceholder}</option>{STATE_OPTIONS.map((state) => <option key={state.id} value={state.id}>{localizedOptionLabel(state, locale)}</option>)}</select><small>{t.stateHint}</small></label>
            </div>
            <label className="journey-consent"><input type="checkbox" checked={profile.allowDemoProcessing} onChange={(event) => setProfile((current) => ({ ...current, allowDemoProcessing: event.target.checked }))}/><span><strong>{t.shareLabel}</strong><small>{t.shareHint}</small></span></label>
            <div className="journey-actions journey-actions--split"><button type="button" className="journey-secondary" onClick={goBack}><ArrowLeft size={16}/>{t.back}</button><button type="button" className="journey-primary" onClick={() => { setNotice(''); setStep('signals'); }}>{t.next}<ArrowRight size={17}/></button></div>
          </div>}

          {step === 'signals' && <div className="journey-screen">
            <div className="journey-screen-head"><span className="journey-small-label">{t.stepMeta[2]}</span><h3>{t.signalsTitle}</h3><p>{t.signalsIntro}</p></div>
            <ToggleGroup title={t.interests} options={INTEREST_OPTIONS} selectedIds={profile.interests} onToggle={(id) => toggle('interests', id)} language={locale} iconOptions/>
            <ToggleGroup title={t.strengths} options={STRENGTH_OPTIONS} selectedIds={profile.strengths} onToggle={(id) => toggle('strengths', id)} language={locale}/>
            <ToggleGroup title={t.goals} options={GOAL_OPTIONS} selectedIds={profile.goals} onToggle={(id) => toggle('goals', id)} language={locale}/>
            <div className="journey-actions journey-actions--split"><button type="button" className="journey-secondary" onClick={goBack}><ArrowLeft size={16}/>{t.back}</button><button type="button" className="journey-primary" disabled={busy} onClick={generatePathways}>{busy ? <><LoaderCircle className="journey-spinner" size={17}/>{t.generating}</> : <>{t.generate}<ArrowRight size={17}/></>}</button></div>
          </div>}

          {step === 'results' && <div className="journey-screen">
            <div className="journey-screen-head"><span className="journey-small-label">{t.stepMeta[3]}</span><h3>{t.resultsTitle}</h3><p>{t.resultsIntro}</p></div>
            <div className="journey-match-meta"><span>{serviceMode === 'remote' ? <CheckCircle2 size={15}/> : <WifiOff size={15}/>} {serviceMode === 'remote' ? t.remoteMatched : t.localOnly}</span><button type="button" onClick={() => { setStep('signals'); setNotice(''); }}>{t.revise}</button></div>
            <div className="journey-result-grid">
              {matches.map((path, index) => {
                const Icon = PATH_ICONS[path.id] || Lightbulb;
                const title = path.title?.[locale] || path.title?.en || path.title;
                const summary = path.summary?.[locale] || path.summary?.en || path.summary;
                const reasonText = path.matchReasons?.length ? path.matchReasons.join(' · ') : path.why?.[locale] || path.why?.en || '';
                return <article className={`journey-result-card ${index === 0 ? 'journey-result-card--lead' : ''}`} key={path.id}>
                  <div className="journey-result-card__top"><span className="journey-result-icon"><Icon size={20}/></span><span className="journey-result-rank">0{index + 1}</span></div>
                  <h4>{title}</h4><p>{summary}</p>
                  <div className="journey-fit"><div className="journey-fit__label"><span>{t.fit}</span><strong>{path.relativeFit}%</strong></div><div className="journey-fit__track"><span style={{ width: `${path.relativeFit}%` }}/></div></div>
                  <div className="journey-result-reason"><strong>{t.why}</strong><span>{reasonText}</span></div>
                  <button type="button" className="journey-result-cta" onClick={() => openPlan(path)}>{t.explore}<ChevronRight size={17}/></button>
                </article>;
              })}
            </div>
            <p className="journey-disclaimer"><ShieldCheck size={17}/>{t.scoreDisclaimer}</p>
            <div className="journey-actions journey-actions--split"><button type="button" className="journey-secondary" onClick={goBack}><ArrowLeft size={16}/>{t.back}</button><button type="button" className="journey-primary" onClick={() => { setStep('profile'); setNotice(''); }}><RefreshCw size={16}/>{t.revise}</button></div>
          </div>}

          {step === 'plan' && plan && selectedPathway && <div className="journey-screen">
            <div className="journey-screen-head"><span className="journey-small-label">{t.stepMeta[4]}</span><h3>{t.planTitle}</h3><p>{t.planIntro}</p></div>
            <div className="journey-selected-path"><span className="journey-result-icon">{(() => { const Icon = PATH_ICONS[selectedPathway.id] || Lightbulb; return <Icon size={21}/>; })()}</span><div><small>{t.selected}</small><h4>{selectedPathway.title?.[locale] || selectedPathway.title?.en}</h4><p>{selectedPathway.summary?.[locale] || selectedPathway.summary?.en}</p></div><span className="journey-data-badge">{plan.catalogueConnected ? t.connectedPlan : t.localOnly}</span></div>
            <div className="journey-stage-guidance"><div><span className="journey-small-label">{t.stageGuidanceLabel}</span><p>{plan.stageGuidance || STAGE_GUIDANCE[locale].std9_10}</p></div></div>
            <div className="journey-plan-section"><div className="journey-plan-title"><span>01</span><div><h4>{t.milestones}</h4><p>{t.smallStepIntro}</p></div></div>
              <div className="journey-milestones">{plan.steps.map((item, index) => <article className="journey-milestone" key={`${item.title}-${index}`}><span className="journey-milestone__number">{String(index + 1).padStart(2, '0')}</span><div><span className="journey-small-label">{item.kind || 'NEXT STEP'}</span><h5>{item.title}</h5><p>{item.detail}</p></div><CheckCircle2 size={18} className="journey-milestone__icon"/></article>)}</div>
            </div>
            <div className="journey-plan-section"><div className="journey-plan-title"><span>02</span><div><h4>{t.resources}</h4><p>{t.languageNote}</p></div></div>
              <div className="journey-resource-list">{plan.resources.map((resource) => <a href={resource.url} key={resource.url} target="_blank" rel="noreferrer" className="journey-resource"><span><BookOpen size={17}/></span><span><strong>{resource.title}</strong><small>{resource.note}</small></span><ArrowRight size={17}/></a>)}</div>
            </div>
            <div className="journey-caution"><ShieldCheck size={18}/><div><strong>{t.important}</strong><p>{selectedPathway.caution[locale]}</p><small>{t.offlinePlan}</small></div></div>
            {savedOnDevice && <p className="journey-inline-success"><CheckCircle2 size={15}/>{t.savedPlan}</p>}
            <div className="journey-actions journey-actions--split"><button type="button" className="journey-secondary" onClick={goBack}><ArrowLeft size={16}/>{t.backToResults}</button><button type="button" className="journey-primary" onClick={exploreRelatedOpportunities}>{t.findOpps}<ArrowRight size={17}/></button></div>
            <div className="journey-local-controls"><button type="button" onClick={clearProfile}><Trash2 size={15}/>{t.clear}</button>{hadSavedProfile && profileUpdatedAt && <span>{t.savedDatePrefix} {new Date(profileUpdatedAt).toLocaleDateString(locale === 'te' ? 'te-IN' : locale === 'ta' ? 'ta-IN' : locale === 'hi' ? 'hi-IN' : 'en-IN')}</span>}</div>
          </div>}

          {notice && <div className={`journey-status ${serviceMode === 'remote' ? 'journey-status--success' : ''}`} role="status">{serviceMode === 'remote' ? <CheckCircle2 size={16}/> : <ShieldCheck size={16}/>}<span>{notice}</span></div>}
        </div>
      </div>
      <p className="journey-global-disclaimer">{t.globalDisclaimer}</p>
    </div>
  </section>;
}
