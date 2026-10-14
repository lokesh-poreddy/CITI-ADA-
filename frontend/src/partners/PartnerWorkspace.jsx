import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck, Bell, BookOpen, Briefcase, Building2, CalendarClock, Check, CheckCircle2,
  ChevronRight, CircleDollarSign, Clock3, ExternalLink, Handshake, Layers3,
  LockKeyhole, Plus, RefreshCw, Send, ShieldCheck, Users, Wifi, WifiOff, X,
} from 'lucide-react';
import { demoFallback, ecosystemActor, ecosystemApi, localDemoStore } from '../api/ecosystem.js';
import './partner-workspace.css';

const demoStore = localDemoStore();
const locale = {
  en: { kicker: 'TRUSTED LEARNING ECOSYSTEM', title: 'People, programmes and pathways — connected.', intro: 'A shared workspace for the people who help learners take their next step. This prototype uses demo actor keys; production access control is not yet enabled.', facilitator: 'Facilitator workspace', modules: 'Learning modules', mentors: 'Mentor connections', listings: 'Work & training', integrations: 'Partner integrations', reminders: 'Reminders', sustainability: 'Sustainability', live: 'Connected to API', local: 'Local demo mode', refresh: 'Refresh data', demo: 'Demo data', privacy: 'Privacy & safety first' },
  hi: { kicker: 'विश्वसनीय सीखने का इकोसिस्टम', title: 'लोग, कार्यक्रम और सीखने के रास्ते — एक साथ।', intro: 'विद्यार्थियों को अगला कदम उठाने में मदद करने वालों के लिए साझा कार्यक्षेत्र। यह प्रोटोटाइप डेमो पहचान का उपयोग करता है; उत्पादन-स्तर का प्रवेश नियंत्रण अभी सक्षम नहीं है।', facilitator: 'मार्गदर्शक कार्यक्षेत्र', modules: 'सीखने के मॉड्यूल', mentors: 'मार्गदर्शक संपर्क', listings: 'काम और प्रशिक्षण', integrations: 'पार्टनर इंटीग्रेशन', reminders: 'याद दिलाएँ', sustainability: 'स्थिरता', live: 'API से जुड़ा', local: 'स्थानीय डेमो मोड', refresh: 'डेटा रीफ़्रेश करें', demo: 'डेमो डेटा', privacy: 'गोपनीयता और सुरक्षा पहले' },
  ta: { kicker: 'நம்பகமான கற்றல் சூழல்', title: 'மக்கள், திட்டங்கள், பாதைகள் — ஒன்றிணைந்து.', intro: 'கற்றவர்களுக்கு அடுத்த படியை எடுக்க உதவும் நபர்களுக்கான பகிரப்பட்ட பணியிடம். இந்த முன்மாதிரி டெமோ அடையாளங்களைப் பயன்படுத்துகிறது; உற்பத்தி அணுகல் கட்டுப்பாடு இன்னும் இயக்கப்படவில்லை.', facilitator: 'வழிகாட்டி பணியிடம்', modules: 'கற்றல் தொகுதிகள்', mentors: 'வழிகாட்டி தொடர்புகள்', listings: 'வேலை மற்றும் பயிற்சி', integrations: 'கூட்டாளர் இணைப்புகள்', reminders: 'நினைவூட்டல்கள்', sustainability: 'நிலைத்தன்மை', live: 'API இணைப்பு', local: 'உள்ளூர் டெமோ முறை', refresh: 'தரவைப் புதுப்பிக்கவும்', demo: 'டெமோ தரவு', privacy: 'தனியுரிமை மற்றும் பாதுகாப்பு முதலில்' },
  te: { kicker: 'నమ్మకమైన అభ్యాస వేదిక', title: 'వ్యక్తులు, కార్యక్రమాలు, అభ్యాస మార్గాలు — ఒకచోట.', intro: 'విద్యార్థులు తదుపరి అడుగు వేయడానికి సహాయపడే మార్గదర్శకుల కోసం భాగస్వామ్య వేదిక. ఇది ప్రోటోటైప్; డెమో గుర్తింపులను ఉపయోగిస్తుంది. ఉత్పత్తి స్థాయి యాక్సెస్ నియంత్రణ ఇంకా ప్రారంభించలేదు.', facilitator: 'మార్గదర్శక వేదిక', modules: 'అభ్యాస మాడ్యూల్స్', mentors: 'మెంటర్ పరిచయాలు', listings: 'ఉద్యోగాలు మరియు శిక్షణ', integrations: 'భాగస్వామ్య అనుసంధానాలు', reminders: 'రిమైండర్లు', sustainability: 'స్థిరత్వం', live: 'API అనుసంధానం', local: 'స్థానిక డెమో మోడ్', refresh: 'డేటాను రిఫ్రెష్ చేయండి', demo: 'డెమో డేటా', privacy: 'గోప్యత మరియు భద్రతకు ప్రాధాన్యం' },
};
const tabs = [
  ['facilitator', Users], ['modules', BookOpen], ['mentors', Handshake], ['listings', Briefcase],
  ['integrations', Building2], ['reminders', Bell], ['sustainability', CircleDollarSign],
];
const asArray = (value) => Array.isArray(value) ? value : [];
const localDateTimeValue = () => { const date = new Date(Date.now() + 24 * 60 * 60 * 1000); date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); return date.toISOString().slice(0, 16); };
const createId = (prefix) => `${prefix}-local-${globalThis.crypto?.randomUUID?.() || Date.now()}`;

function Metric({ icon: Icon, label, value, tone = 'sage' }) {
  return <article className={`ecosystem-metric ecosystem-metric--${tone}`}><span className="ecosystem-metric__icon"><Icon size={18} /></span><span><small>{label}</small><strong>{value}</strong></span></article>;
}
function EmptyState({ title, body }) { return <div className="ecosystem-empty"><span><Layers3 size={21} /></span><strong>{title}</strong><p>{body}</p></div>; }
function StatusPill({ children, tone = 'neutral' }) { return <span className={`ecosystem-status ecosystem-status--${tone}`}>{children}</span>; }
function PanelHeader({ eyebrow, title, text, children }) { return <div className="ecosystem-panel-heading"><div><span className="ecosystem-eyebrow">{eyebrow}</span><h3>{title}</h3>{text && <p>{text}</p>}</div>{children}</div>; }

export default function PartnerWorkspace({ language = 'en' }) {
  const t = locale[language] || locale.en;
  const [tab, setTab] = useState('facilitator');
  const [data, setData] = useState(() => demoStore.load());
  const [mode, setMode] = useState('loading');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [cohortForm, setCohortForm] = useState({ name: '', region: 'Tamil Nadu', purpose: '' });
  const [learnerForm, setLearnerForm] = useState({ cohortId: '', learnerKey: '', displayAlias: '', consentRecorded: false });
  const [referralForm, setReferralForm] = useState({ cohortId: '', learnerKey: '', targetType: 'OPPORTUNITY', targetId: '', summary: '', followUpDate: '', consentRecorded: false });
  const [moduleForm, setModuleForm] = useState({ title: '', summary: '', audience: 'Secondary learners', language: language || 'en', accessMode: 'FREE', priceInr: '', lessons: 'Start with one practical activity' });
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [mentorForm, setMentorForm] = useState({ learnerAlias: '', purpose: '', consentConfirmed: false, facilitatorMediated: true, guardianOrInstitutionApprovalConfirmed: false });
  const [selectedMentor, setSelectedMentor] = useState('');
  const [listingFilter, setListingFilter] = useState('ALL');
  const [listingForm, setListingForm] = useState({ title: '', organization: '', description: '', location: 'Tamil Nadu', workMode: 'Hybrid', kind: 'APPRENTICESHIP', eligibilitySummary: '', applicationUrl: '', sourceUrl: '', deadline: '' });
  const [reminderForm, setReminderForm] = useState({ kind: 'FACILITATOR_FOLLOW_UP', title: '', message: '', scheduledAt: localDateTimeValue() });
  const [preferences, setPreferences] = useState({ inAppEnabled: true, emailEnabled: false, smsEnabled: false, consentToExternalDelivery: false });
  const [interestForm, setInterestForm] = useState({ organizationName: '', organizationType: 'NGO', modelId: 'CSR_SPONSORSHIP', approximateLearners: 100, contactEmail: '', notes: '', consentToFollowUp: false });

  const applyPatch = useCallback((patch) => setData((current) => { const next = { ...current, ...patch }; demoStore.save(next); return next; }), []);
  const announce = useCallback((message, tone = 'success') => { setNotice({ message, tone }); }, []);

  const loadAll = useCallback(async () => {
    setBusy(true);
    const calls = await Promise.allSettled([
      ecosystemApi.listCohorts(), ecosystemApi.listReferrals(), ecosystemApi.listMyModules(), ecosystemApi.listPublishedModules(language),
      ecosystemApi.listMentors(), ecosystemApi.listMentorRequests(), ecosystemApi.listPartnerListings(), ecosystemApi.listMyListings(),
      ecosystemApi.listIntegrations(), ecosystemApi.listReminders(ecosystemActor.actorKey), ecosystemApi.getSustainabilityOverview(),
    ]);
    const values = calls.map((r) => r.status === 'fulfilled' ? r.value : null);
    const allReachable = calls.every((r) => r.status === 'fulfilled');
    setData((current) => {
      const fallback = demoStore.load();
      const next = {
        ...fallback,
        ...current,
        cohorts: values[0] ?? current.cohorts ?? fallback.cohorts,
        referrals: values[1] ?? current.referrals ?? fallback.referrals,
        myModules: values[2] ?? current.myModules ?? [],
        modules: values[3] ?? current.modules ?? fallback.modules,
        mentors: values[4] ?? current.mentors ?? fallback.mentors,
        mentorRequests: values[5] ?? current.mentorRequests ?? fallback.mentorRequests,
        listings: values[6] ?? current.listings ?? fallback.listings,
        myListings: values[7] ?? current.myListings ?? fallback.myListings,
        integrations: values[8] ?? current.integrations ?? fallback.integrations,
        reminders: values[9] ?? current.reminders ?? fallback.reminders,
        sustainability: values[10] ?? current.sustainability ?? fallback.sustainability,
      };
      demoStore.save(next); return next;
    });
    const pref = await ecosystemApi.getNotificationPreferences(ecosystemActor.actorKey).catch(() => null);
    if (pref) setPreferences({ inAppEnabled: pref.inAppEnabled, emailEnabled: pref.emailEnabled, smsEnabled: pref.smsEnabled, consentToExternalDelivery: pref.consentToExternalDelivery });
    setMode(allReachable ? 'api' : 'local-demo');
    setBusy(false);
  }, [language]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const counts = useMemo(() => ({ learners: asArray(data.cohorts).reduce((sum, cohort) => sum + asArray(cohort.learners).length, 0), cohorts: asArray(data.cohorts).length, modules: asArray(data.modules).filter((m) => m.status === 'PUBLISHED').length, mentors: asArray(data.mentors).filter((m) => m.verified).length, listings: asArray(data.listings).filter((l) => l.status === 'PUBLISHED').length }), [data]);

  async function runAction(apiCall, fallbackAction, successMessage) {
    try {
      const result = await apiCall();
      fallbackAction?.(result, true);
      announce(successMessage, 'success');
      return result;
    } catch (error) {
      if (error?.status && error.status < 500) {
        announce(`The API rejected this action: ${error.message}`, 'warning');
        return null;
      }
      const localResult = fallbackAction?.(null, false);
      setMode('local-demo');
      announce(`${successMessage} Local demo only — API unavailable${error?.message ? ` (${error.message})` : ''}.`, 'warning');
      return localResult;
    }
  }

  async function createCohort(event) {
    event.preventDefault(); if (!cohortForm.name.trim()) return;
    await runAction(() => ecosystemApi.createCohort(cohortForm), (result, live) => {
      const cohort = result || { id: createId('cohort'), ownerKey: ecosystemActor.actorKey, ...cohortForm, createdAt: new Date().toISOString(), learners: [], demoRecord: true };
      applyPatch({ cohorts: [cohort, ...asArray(data.cohorts)] }); setCohortForm({ name: '', region: 'Tamil Nadu', purpose: '' }); setLearnerForm((prev) => ({ ...prev, cohortId: prev.cohortId || cohort.id })); return cohort;
    }, 'Cohort created.');
  }
  async function addLearner(event) {
    event.preventDefault(); if (!learnerForm.cohortId || !learnerForm.learnerKey.trim() || !learnerForm.displayAlias.trim() || !learnerForm.consentRecorded) return;
    await runAction(() => ecosystemApi.addLearner(learnerForm.cohortId, { learnerKey: learnerForm.learnerKey.trim(), displayAlias: learnerForm.displayAlias.trim(), consentRecorded: true }), (result) => {
      const updated = result || { ...data.cohorts.find((c) => c.id === learnerForm.cohortId), learners: [...asArray(data.cohorts.find((c) => c.id === learnerForm.cohortId)?.learners), { learnerKey: learnerForm.learnerKey.trim(), displayAlias: learnerForm.displayAlias.trim(), consentRecorded: true, linkedAt: new Date().toISOString() }] };
      applyPatch({ cohorts: data.cohorts.map((c) => c.id === updated.id ? updated : c) }); setLearnerForm({ cohortId: learnerForm.cohortId, learnerKey: '', displayAlias: '', consentRecorded: false }); return updated;
    }, 'Learner linked with consent recorded.');
  }
  async function createReferral(event) {
    event.preventDefault(); if (!referralForm.cohortId || !referralForm.learnerKey || !referralForm.targetId.trim() || !referralForm.summary.trim() || !referralForm.consentRecorded) return;
    const payload = { ...referralForm, followUpDate: referralForm.followUpDate || null, consentRecorded: true };
    await runAction(() => ecosystemApi.createReferral(payload), (result) => {
      const referral = result || { id: createId('referral'), ...payload, status: 'OPEN', createdBy: ecosystemActor.actorKey, createdAt: new Date().toISOString() };
      applyPatch({ referrals: [referral, ...asArray(data.referrals)] }); setReferralForm({ cohortId: referralForm.cohortId, learnerKey: '', targetType: 'OPPORTUNITY', targetId: '', summary: '', followUpDate: '', consentRecorded: false }); return referral;
    }, 'Referral recorded.');
  }
  async function createModule(event) {
    event.preventDefault(); if (!moduleForm.title.trim() || !moduleForm.summary.trim()) return;
    const lessons = moduleForm.lessons.split('\n').map((title) => title.trim()).filter(Boolean).map((title) => ({ title, summary: '', resourceUrl: '', estimatedMinutes: 15 }));
    const payload = { ...moduleForm, priceInr: moduleForm.accessMode === 'FREE' ? 0 : Number(moduleForm.priceInr), lessons };
    await runAction(
      () => editingModuleId ? ecosystemApi.updateModule(editingModuleId, payload) : ecosystemApi.createModule(payload),
      (result) => {
        const existing = asArray(data.myModules).find((m) => m.id === editingModuleId);
        const module = result || { ...(existing || {}), id: editingModuleId || createId('module'), creatorKey: ecosystemActor.actorKey, ...payload, status: 'DRAFT', version: (existing?.version || 0) + 1, createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(), demoRecord: true };
        const updatedModules = editingModuleId ? asArray(data.myModules).map((m) => m.id === editingModuleId ? module : m) : [module, ...asArray(data.myModules)];
        applyPatch({ myModules: updatedModules });
        setEditingModuleId(null);
        setModuleForm({ title: '', summary: '', audience: 'Secondary learners', language: language || 'en', accessMode: 'FREE', priceInr: '', lessons: 'Start with one practical activity' });
        return module;
      }, editingModuleId ? 'Module draft updated.' : 'Module draft saved.');
  }
  function editModule(module) {
    setEditingModuleId(module.id);
    setModuleForm({ title: module.title || '', summary: module.summary || '', audience: module.audience || 'Secondary learners', language: module.language || language || 'en', accessMode: module.accessMode || 'FREE', priceInr: module.accessMode === 'PAID' ? String(module.priceInr || '') : '', lessons: asArray(module.lessons).map((lesson) => lesson.title).join('\n') || '' });
    setTab('modules');
  }
  async function publishModule(module) {
    await runAction(() => ecosystemApi.publishModule(module.id), (result) => {
      const updated = result?.module || { ...module, status: 'PUBLISHED', updatedAt: new Date().toISOString() };
      applyPatch({ myModules: asArray(data.myModules).map((m) => m.id === module.id ? updated : m), modules: [updated, ...asArray(data.modules).filter((m) => m.id !== module.id)] }); return updated;
    }, 'Module published.');
  }
  async function connectMentor(event) {
    event.preventDefault(); if (!selectedMentor || !mentorForm.learnerAlias.trim() || !mentorForm.purpose.trim() || !mentorForm.consentConfirmed || !mentorForm.facilitatorMediated || !mentorForm.guardianOrInstitutionApprovalConfirmed) return;
    const payload = { ...mentorForm, facilitatorKey: ecosystemActor.actorKey };
    await runAction(() => ecosystemApi.requestMentorConnection(selectedMentor, payload), (result) => {
      const request = result || { id: createId('mentor-request'), mentorId: selectedMentor, ...payload, facilitatorKey: ecosystemActor.actorKey, status: 'PENDING_FACILITATOR_REVIEW', createdAt: new Date().toISOString(), safetyNote: 'Local demo request only; no contact has been made.' };
      applyPatch({ mentorRequests: [request, ...asArray(data.mentorRequests)] }); setMentorForm({ learnerAlias: '', purpose: '', consentConfirmed: false, facilitatorMediated: true, guardianOrInstitutionApprovalConfirmed: false }); return request;
    }, 'Mentor request sent to facilitator review.');
  }
  async function createListing(event) {
    event.preventDefault(); if (!listingForm.title.trim() || !listingForm.organization.trim() || !listingForm.description.trim() || !listingForm.eligibilitySummary.trim() || !listingForm.applicationUrl.startsWith('https://')) return;
    const payload = { ...listingForm, deadline: listingForm.deadline || null };
    await runAction(() => ecosystemApi.createPartnerListing(payload), (result) => {
      const listing = result || { id: createId('listing'), partnerKey: ecosystemActor.partnerKey, ...payload, status: 'DRAFT', organizationVerified: false, demoListing: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), reviewNote: 'Local demo draft, not published.' };
      applyPatch({ myListings: [listing, ...asArray(data.myListings)] }); setListingForm({ title: '', organization: '', description: '', location: 'Tamil Nadu', workMode: 'Hybrid', kind: 'APPRENTICESHIP', eligibilitySummary: '', applicationUrl: '', sourceUrl: '', deadline: '' }); return listing;
    }, 'Partner listing saved as a draft.');
  }
  async function submitListing(listing) {
    await runAction(() => ecosystemApi.submitPartnerListing(listing.id), (result) => {
      const updated = result || { ...listing, status: 'PENDING_REVIEW', updatedAt: new Date().toISOString(), reviewNote: 'Local demo only; review is simulated.' };
      applyPatch({ myListings: asArray(data.myListings).map((x) => x.id === listing.id ? updated : x) }); return updated;
    }, 'Listing sent for review.');
  }
  async function createReminder(event) {
    event.preventDefault(); if (!reminderForm.title.trim() || !reminderForm.message.trim() || !reminderForm.scheduledAt) return;
    const payload = { recipientKey: ecosystemActor.actorKey, kind: reminderForm.kind, title: reminderForm.title.trim(), message: reminderForm.message.trim(), scheduledAt: reminderForm.scheduledAt, relatedRecordId: '' };
    await runAction(() => ecosystemApi.createReminder(payload), (result) => {
      const reminder = result || { id: createId('reminder'), ...payload, status: 'SCHEDULED', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      applyPatch({ reminders: [reminder, ...asArray(data.reminders)] }); setReminderForm({ kind: 'FACILITATOR_FOLLOW_UP', title: '', message: '', scheduledAt: localDateTimeValue() }); return reminder;
    }, 'Reminder scheduled in the in-app centre.');
  }
  async function acknowledgeReminder(reminder) {
    await runAction(() => ecosystemApi.acknowledgeReminder(reminder.id, ecosystemActor.actorKey), (result) => {
      const updated = result || { ...reminder, status: 'ACKNOWLEDGED', updatedAt: new Date().toISOString() };
      applyPatch({ reminders: data.reminders.map((r) => r.id === reminder.id ? updated : r) }); return updated;
    }, 'Reminder acknowledged.');
  }
  async function savePreferences(event) {
    event.preventDefault();
    await runAction(() => ecosystemApi.saveNotificationPreferences(ecosystemActor.actorKey, preferences), (result) => { if (result) setPreferences({ inAppEnabled: result.inAppEnabled, emailEnabled: result.emailEnabled, smsEnabled: result.smsEnabled, consentToExternalDelivery: result.consentToExternalDelivery }); return result; }, 'Notification preferences saved.');
  }
  async function submitInterest(event) {
    event.preventDefault(); if (!interestForm.organizationName.trim() || !interestForm.consentToFollowUp) return;
    await runAction(() => ecosystemApi.submitSustainabilityInterest({ ...interestForm, contactEmail: interestForm.contactEmail.trim() || null, approximateLearners: Number(interestForm.approximateLearners) }), (result) => {
      setInterestForm({ organizationName: '', organizationType: 'NGO', modelId: 'CSR_SPONSORSHIP', approximateLearners: 100, contactEmail: '', notes: '', consentToFollowUp: false }); return result;
    }, 'Sustainability interest recorded.');
  }

  const cohorts = asArray(data.cohorts);
  const myModules = asArray(data.myModules);
  const listings = asArray(data.listings).filter((listing) => listingFilter === 'ALL' || listing.kind === listingFilter);
  const mentors = asArray(data.mentors).filter((mentor) => mentor.verified);

  return <section className="ecosystem-section" id="ecosystem-workspace">
    <div className="ecosystem-container">
      <div className="ecosystem-heading">
        <div className="ecosystem-heading__copy"><span className="ecosystem-eyebrow"><span className="ecosystem-eyebrow__line" />{t.kicker}</span><h2>{t.title}</h2><p>{t.intro}</p></div>
        <div className="ecosystem-heading__actions"><StatusPill tone={mode === 'api' ? 'good' : mode === 'loading' ? 'neutral' : 'warm'}>{mode === 'api' ? <><Wifi size={13} />{t.live}</> : mode === 'loading' ? <><RefreshCw size={13} className="ecosystem-spin" />Connecting</> : <><WifiOff size={13} />{t.local}</>}</StatusPill><button className="ecosystem-button ecosystem-button--quiet" onClick={loadAll} disabled={busy}><RefreshCw size={15} className={busy ? 'ecosystem-spin' : ''} />{t.refresh}</button></div>
      </div>
      <div className="ecosystem-metrics"><Metric icon={Users} label="Facilitator cohorts" value={counts.cohorts} /><Metric icon={BookOpen} label="Published modules" value={counts.modules} tone="peach" /><Metric icon={Handshake} label="Verified mentor profiles" value={counts.mentors} tone="lilac" /><Metric icon={Briefcase} label="Published work/training listings" value={counts.listings} tone="blue" /></div>
      {notice && <div className={`ecosystem-notice ecosystem-notice--${notice.tone}`} role="status"><span>{notice.tone === 'success' ? <CheckCircle2 size={17} /> : <WifiOff size={17} />}</span><p>{notice.message}</p><button onClick={() => setNotice(null)} aria-label="Dismiss notice"><X size={16} /></button></div>}
      <div className="ecosystem-tabs" role="tablist" aria-label="Partner ecosystem workspace">
        {tabs.map(([id, Icon]) => <button type="button" role="tab" key={id} aria-selected={tab === id} className={`ecosystem-tab ${tab === id ? 'is-active' : ''}`} onClick={() => setTab(id)}><Icon size={16} /><span>{t[id]}</span><ChevronRight size={14} className="ecosystem-tab__arrow" /></button>)}
      </div>

      {tab === 'facilitator' && <div className="ecosystem-content-grid">
        <div className="ecosystem-panel"><PanelHeader eyebrow="PHASE 18 · COHORT SUPPORT" title="Build a learner support circle" text="Create a cohort, link learners with recorded consent, and plan next-step referrals." />
          <form className="ecosystem-form" onSubmit={createCohort}><label>Cohort name<input value={cohortForm.name} onChange={(e)=>setCohortForm({...cohortForm,name:e.target.value})} placeholder="e.g. Kancheepuram career circle" maxLength={100} required /></label><div className="ecosystem-form__row"><label>Region<input value={cohortForm.region} onChange={(e)=>setCohortForm({...cohortForm,region:e.target.value})} maxLength={100} /></label><label>Purpose<input value={cohortForm.purpose} onChange={(e)=>setCohortForm({...cohortForm,purpose:e.target.value})} placeholder="Career discovery" maxLength={300} /></label></div><button className="ecosystem-button ecosystem-button--primary"><Plus size={16} />Create cohort</button></form>
          <div className="ecosystem-subsection"><h4>Current cohorts</h4>{cohorts.length ? cohorts.map((c)=><article className="ecosystem-list-card" key={c.id}><div className="ecosystem-list-card__main"><strong>{c.name}</strong><small>{c.region || 'Region not set'} · {asArray(c.learners).length} learners</small>{c.purpose && <p>{c.purpose}</p>}</div><StatusPill>{c.demoRecord ? 'Local demo' : 'Active'}</StatusPill></article>) : <EmptyState title="No cohorts yet" body="Create your first cohort to begin facilitator-led support." />}</div>
        </div>
        <div className="ecosystem-panel"><PanelHeader eyebrow="SAFE FOLLOW-THROUGH" title="Link a learner and recommend a next step" text="Use a pseudonymous learner key. Do not enter government identifiers or sensitive documents in this prototype." />
          <form className="ecosystem-form" onSubmit={addLearner}><label>Choose cohort<select value={learnerForm.cohortId} onChange={(e)=>setLearnerForm({...learnerForm,cohortId:e.target.value})} required><option value="">Select cohort</option>{cohorts.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label><div className="ecosystem-form__row"><label>Learner alias<input value={learnerForm.displayAlias} onChange={(e)=>setLearnerForm({...learnerForm,displayAlias:e.target.value})} placeholder="Learner A" maxLength={70} required /></label><label>Demo learner key<input value={learnerForm.learnerKey} onChange={(e)=>setLearnerForm({...learnerForm,learnerKey:e.target.value})} placeholder="learner-001" maxLength={80} required /></label></div><label className="ecosystem-check"><input type="checkbox" checked={learnerForm.consentRecorded} onChange={(e)=>setLearnerForm({...learnerForm,consentRecorded:e.target.checked})} /> Consent has been recorded through the appropriate process.</label><button className="ecosystem-button ecosystem-button--primary" disabled={!cohorts.length}><Plus size={16} />Link learner</button></form>
          <div className="ecosystem-divider" />
          <form className="ecosystem-form" onSubmit={createReferral}><h4>Next-step referral</h4><label>Cohort<select value={referralForm.cohortId} onChange={(e)=>setReferralForm({...referralForm,cohortId:e.target.value,learnerKey:''})} required><option value="">Select cohort</option>{cohorts.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label><label>Learner<select value={referralForm.learnerKey} onChange={(e)=>setReferralForm({...referralForm,learnerKey:e.target.value})} required><option value="">Select learner</option>{asArray(cohorts.find(c=>c.id===referralForm.cohortId)?.learners).map(l=><option key={l.learnerKey} value={l.learnerKey}>{l.displayAlias}</option>)}</select></label><div className="ecosystem-form__row"><label>Next-step type<select value={referralForm.targetType} onChange={(e)=>setReferralForm({...referralForm,targetType:e.target.value})}><option value="OPPORTUNITY">Opportunity</option><option value="MODULE">Learning module</option><option value="MENTOR">Mentor request</option><option value="FOLLOW_UP">Follow-up</option></select></label><label>Record ID<input value={referralForm.targetId} onChange={(e)=>setReferralForm({...referralForm,targetId:e.target.value})} placeholder="Opportunity / module ID" required /></label></div><label>Note<textarea value={referralForm.summary} onChange={(e)=>setReferralForm({...referralForm,summary:e.target.value})} maxLength={400} rows={2} required placeholder="Describe the action, not sensitive personal information." /></label><label>Follow-up date<input type="date" value={referralForm.followUpDate} onChange={(e)=>setReferralForm({...referralForm,followUpDate:e.target.value})} /></label><label className="ecosystem-check"><input type="checkbox" checked={referralForm.consentRecorded} onChange={(e)=>setReferralForm({...referralForm,consentRecorded:e.target.checked})} /> Learner/guardian consent to this referral is recorded.</label><button className="ecosystem-button ecosystem-button--primary" disabled={!cohorts.length}><Send size={15} />Record referral</button></form>
          <div className="ecosystem-subsection"><h4>Recent referrals</h4>{asArray(data.referrals).length ? data.referrals.map(r=><article className="ecosystem-list-card" key={r.id}><div className="ecosystem-list-card__main"><strong>{r.summary}</strong><small>{r.targetType} · {r.status} {r.followUpDate ? `· Follow up ${r.followUpDate}` : ''}</small></div><StatusPill tone="warm">{r.status}</StatusPill></article>) : <p className="ecosystem-muted">Referrals will appear here once recorded.</p>}</div>
        </div>
      </div>}

      {tab === 'modules' && <div className="ecosystem-content-grid"><div className="ecosystem-panel"><PanelHeader eyebrow="PHASE 19 · MODULE AUTHORING" title="Publish practical learning, one lesson at a time" text="Modules remain drafts until reviewed by the creator. Paid prices are labels only: this prototype has no checkout." />
        <form className="ecosystem-form" onSubmit={createModule}><label>Module title<input value={moduleForm.title} onChange={e=>setModuleForm({...moduleForm,title:e.target.value})} maxLength={120} required placeholder="e.g. Smartphone repair basics" /></label><label>What will learners practise?<textarea rows={3} value={moduleForm.summary} onChange={e=>setModuleForm({...moduleForm,summary:e.target.value})} maxLength={800} required placeholder="Describe the practical learning outcome." /></label><div className="ecosystem-form__row"><label>Audience<input value={moduleForm.audience} onChange={e=>setModuleForm({...moduleForm,audience:e.target.value})} maxLength={80} required /></label><label>Language<select value={moduleForm.language} onChange={e=>setModuleForm({...moduleForm,language:e.target.value})}><option value="en">English</option><option value="hi">Hindi</option><option value="ta">Tamil</option><option value="te">Telugu</option></select></label></div><label>Lesson titles — one per line<textarea rows={3} value={moduleForm.lessons} onChange={e=>setModuleForm({...moduleForm,lessons:e.target.value})} placeholder={'Safety and tools\nGuided practice\nCheck your learning'} /></label><div className="ecosystem-form__row"><label>Access model<select value={moduleForm.accessMode} onChange={e=>setModuleForm({...moduleForm,accessMode:e.target.value})}><option value="FREE">Free</option><option value="PAID">Paid (display only)</option></select></label>{moduleForm.accessMode === 'PAID' && <label>Price (INR)<input type="number" min="1" step="0.01" value={moduleForm.priceInr} onChange={e=>setModuleForm({...moduleForm,priceInr:e.target.value})} required /></label>}</div><div className="ecosystem-form__actions"><button className="ecosystem-button ecosystem-button--primary">{editingModuleId ? <Check size={16}/> : <Plus size={16} />}{editingModuleId ? 'Save changes' : 'Save draft'}</button>{editingModuleId && <button type="button" className="ecosystem-button ecosystem-button--quiet" onClick={() => { setEditingModuleId(null); setModuleForm({ title: '', summary: '', audience: 'Secondary learners', language: language || 'en', accessMode: 'FREE', priceInr: '', lessons: 'Start with one practical activity' }); }}>Cancel edit</button>}</div></form></div>
        <div className="ecosystem-panel"><PanelHeader eyebrow="PUBLISHING PIPELINE" title="Your modules" text="Publishing requires a title, summary, and at least one lesson. Paid access must be clearly disclosed." />{myModules.length ? myModules.map(m=><article className="ecosystem-module-card" key={m.id}><div className="ecosystem-module-card__top"><span className="ecosystem-module-icon"><BookOpen size={18}/></span><StatusPill tone={m.status==='PUBLISHED'?'good':'warm'}>{m.status}</StatusPill></div><h4>{m.title}</h4><p>{m.summary}</p><div className="ecosystem-inline-meta"><span>{m.audience}</span><span>{String(m.language||'en').toUpperCase()}</span><span>{asArray(m.lessons).length} lessons</span><span>{m.accessMode==='PAID'?`₹${m.priceInr}`:'Free'}</span></div>{m.status==='DRAFT' && <div className="ecosystem-form__actions"><button className="ecosystem-button ecosystem-button--quiet" onClick={()=>editModule(m)}><BookOpen size={15}/>Edit draft</button><button className="ecosystem-button ecosystem-button--secondary" onClick={()=>publishModule(m)}><Check size={15}/>Publish module</button></div>}</article>) : <EmptyState title="No drafts yet" body="Create a module from a local skill, classroom lesson or trusted training partner." />}</div>
      </div>}

      {tab === 'mentors' && <div className="ecosystem-content-grid ecosystem-content-grid--wide"><div className="ecosystem-panel"><PanelHeader eyebrow="PHASE 20 · VERIFIED PEOPLE" title="Mentors with a safe introduction path" text="Only verified profiles are shown. Requests go to a facilitator; the platform does not expose personal contact information." />
        <div className="ecosystem-mentor-grid">{mentors.map(m=><article className={`ecosystem-mentor-card ${selectedMentor===m.id?'is-selected':''}`} key={m.id}><div className="ecosystem-mentor-card__top"><span className="ecosystem-mentor-avatar">{m.displayName.split(/[ ·]/).filter(Boolean).slice(-1)[0]?.charAt(0)||'M'}</span><StatusPill tone="good"><BadgeCheck size={12}/>Verified</StatusPill></div><h4>{m.displayName}</h4><p className="ecosystem-mentor-card__expertise">{m.expertise}</p><p>{m.bio}</p><div className="ecosystem-inline-meta"><span>{m.region}</span><span>{asArray(m.languages).map(l=>l.toUpperCase()).join(' · ')}</span></div>{m.demoProfile && <p className="ecosystem-demo-note">Illustrative profile — not a real mentor or active offer.</p>}<button className={`ecosystem-button ${selectedMentor===m.id?'ecosystem-button--secondary':'ecosystem-button--quiet'}`} onClick={()=>setSelectedMentor(m.id)}>{selectedMentor===m.id?'Selected for request':'Choose mentor'}<ChevronRight size={15}/></button></article>)}</div>
      </div><div className="ecosystem-panel"><PanelHeader eyebrow="GUARDED CONNECTION" title="Request an introduction" text="This form records a request for facilitator review; it does not contact a mentor directly." />
        <form className="ecosystem-form" onSubmit={connectMentor}><label>Selected mentor<input value={mentors.find(m=>m.id===selectedMentor)?.displayName||'Choose a mentor card first'} readOnly /></label><label>Learner alias<input value={mentorForm.learnerAlias} onChange={e=>setMentorForm({...mentorForm,learnerAlias:e.target.value})} maxLength={70} required placeholder="Learner A" /></label><label>Purpose<textarea rows={3} value={mentorForm.purpose} onChange={e=>setMentorForm({...mentorForm,purpose:e.target.value})} maxLength={300} required placeholder="What would the learner like help understanding?" /></label><label className="ecosystem-check"><input type="checkbox" checked={mentorForm.consentConfirmed} onChange={e=>setMentorForm({...mentorForm,consentConfirmed:e.target.checked})}/> Learner/guardian consent is confirmed.</label><label className="ecosystem-check"><input type="checkbox" checked={mentorForm.facilitatorMediated} onChange={e=>setMentorForm({...mentorForm,facilitatorMediated:e.target.checked})}/> Contact will be coordinated through a facilitator.</label><label className="ecosystem-check"><input type="checkbox" checked={mentorForm.guardianOrInstitutionApprovalConfirmed} onChange={e=>setMentorForm({...mentorForm,guardianOrInstitutionApprovalConfirmed:e.target.checked})}/> Guardian/institution approval has been checked for this minor-inclusive workflow.</label><button className="ecosystem-button ecosystem-button--primary" disabled={!selectedMentor}><ShieldCheck size={16}/>Request safe introduction</button></form>
        <div className="ecosystem-divider"/><h4>Connection requests</h4>{asArray(data.mentorRequests).length?data.mentorRequests.map(r=><article className="ecosystem-list-card" key={r.id}><div className="ecosystem-list-card__main"><strong>{r.learnerAlias} · {r.purpose}</strong><small>{r.status}</small></div><StatusPill tone="warm">Review needed</StatusPill></article>):<p className="ecosystem-muted">No introduction requests yet.</p>}
      </div></div>}

      {tab === 'listings' && <div className="ecosystem-content-grid"><div className="ecosystem-panel"><PanelHeader eyebrow="PHASE 21 · WORK OPPORTUNITIES" title="A clearer route to work-based learning" text="Partner listings are unpublished until reviewed. Demo rows are explicitly labelled and are not live vacancies." /><div className="ecosystem-filter-row"><label>Listing type<select value={listingFilter} onChange={e=>setListingFilter(e.target.value)}><option value="ALL">All types</option><option value="APPRENTICESHIP">Apprenticeships</option><option value="INTERNSHIP">Internships</option><option value="ENTRY_LEVEL_JOB">Entry-level jobs</option><option value="TRAINING">Training</option></select></label></div>{listings.length?listings.map(l=><article className="ecosystem-listing-card" key={l.id}><div className="ecosystem-listing-card__top"><span className="ecosystem-listing-icon"><Briefcase size={18}/></span><StatusPill tone={l.demoListing?'warm':'good'}>{l.demoListing?'Illustrative demo':'Verified listing'}</StatusPill></div><h4>{l.title}</h4><p className="ecosystem-listing-card__org">{l.organization}</p><p>{l.description}</p><div className="ecosystem-inline-meta"><span>{l.location}</span><span>{l.workMode}</span><span>{String(l.kind).replaceAll('_',' ')}</span></div><div className="ecosystem-listing-card__bottom"><span className="ecosystem-muted">{l.eligibilitySummary}</span><a href={l.applicationUrl} target="_blank" rel="noreferrer">Open reference <ExternalLink size={13}/></a></div></article>) : <EmptyState title="No matching listings" body="Try another listing type or add a partner draft on the right."/>}</div>
        <div className="ecosystem-panel"><PanelHeader eyebrow="PARTNER PUBLISHING" title="Create a draft listing" text="Use official or organization-controlled HTTPS links. Do not publish unverifiable opportunities."/><form className="ecosystem-form" onSubmit={createListing}><label>Listing title<input value={listingForm.title} onChange={e=>setListingForm({...listingForm,title:e.target.value})} maxLength={140} required /></label><label>Organization<input value={listingForm.organization} onChange={e=>setListingForm({...listingForm,organization:e.target.value})} maxLength={120} required /></label><label>Description<textarea rows={3} value={listingForm.description} onChange={e=>setListingForm({...listingForm,description:e.target.value})} maxLength={900} required/></label><div className="ecosystem-form__row"><label>Type<select value={listingForm.kind} onChange={e=>setListingForm({...listingForm,kind:e.target.value})}><option value="APPRENTICESHIP">Apprenticeship</option><option value="INTERNSHIP">Internship</option><option value="ENTRY_LEVEL_JOB">Entry-level job</option><option value="TRAINING">Training</option></select></label><label>Work mode<select value={listingForm.workMode} onChange={e=>setListingForm({...listingForm,workMode:e.target.value})}><option>On-site</option><option>Hybrid</option><option>Remote</option></select></label></div><label>Location<input value={listingForm.location} onChange={e=>setListingForm({...listingForm,location:e.target.value})} maxLength={100} required /></label><label>Eligibility summary<textarea rows={2} value={listingForm.eligibilitySummary} onChange={e=>setListingForm({...listingForm,eligibilitySummary:e.target.value})} maxLength={600} required/></label><label>Application URL (HTTPS)<input type="url" value={listingForm.applicationUrl} onChange={e=>setListingForm({...listingForm,applicationUrl:e.target.value})} placeholder="https://official.example/apply" required /></label><label>Source URL (HTTPS)<input type="url" value={listingForm.sourceUrl} onChange={e=>setListingForm({...listingForm,sourceUrl:e.target.value})} placeholder="https://official.example" /></label><label>Deadline (optional)<input type="date" value={listingForm.deadline} onChange={e=>setListingForm({...listingForm,deadline:e.target.value})}/></label><button className="ecosystem-button ecosystem-button--primary"><Plus size={16}/>Save unpublished draft</button></form><div className="ecosystem-subsection"><h4>Your drafts</h4>{asArray(data.myListings).length?data.myListings.map(l=><article className="ecosystem-list-card" key={l.id}><div className="ecosystem-list-card__main"><strong>{l.title}</strong><small>{l.status} · {l.organization}</small></div>{l.status==='DRAFT'||l.status==='REJECTED'?<button className="ecosystem-mini-button" onClick={()=>submitListing(l)}>Submit for review <Send size={13}/></button>:<StatusPill>{l.status}</StatusPill>}</article>):<p className="ecosystem-muted">New partner listings appear here as drafts.</p>}</div></div>
      </div>}

      {tab === 'integrations' && <div className="ecosystem-panel"><PanelHeader eyebrow="PHASE 22 · APPROVED CONNECTORS" title="Integration registry" text="Adapters are explicit extension points. A source being listed here does not mean its API access is approved or connected." /><div className="ecosystem-integration-grid">{asArray(data.integrations).length?data.integrations.map(i=><article className="ecosystem-integration-card" key={i.id}><div className="ecosystem-integration-card__icon"><Building2 size={19}/></div><div className="ecosystem-integration-card__copy"><h4>{i.displayName}</h4><p>{i.capability}</p><p className="ecosystem-integration-guidance">{i.setupGuidance}</p></div><div className="ecosystem-integration-card__state"><StatusPill tone={i.status==='READY'?'good':'warm'}>{String(i.status).replaceAll('_',' ')}</StatusPill>{i.externalNetworkCallEnabled && <span className="ecosystem-mini-state">Network call enabled</span>}</div></article>) : <EmptyState title="Integration registry unavailable" body="The API is not reachable. No external connector is enabled in local fallback mode."/>}</div><div className="ecosystem-callout"><LockKeyhole size={19}/><div><strong>Server-side credentials only</strong><p>Use approved APIs, terms and permissions. Keep secrets in server environment variables. Avoid scraping protected portals. Each adapter needs source provenance, rate limits, freshness handling and automated tests.</p></div></div></div>}

      {tab === 'reminders' && <div className="ecosystem-content-grid"><div className="ecosystem-panel"><PanelHeader eyebrow="PHASE 23 · NEXT-STEP FOLLOW-THROUGH" title="Small reminders, meaningful progress" text="Reminders are in-app only in this prototype. SMS/email delivery is not connected."/><form className="ecosystem-form" onSubmit={createReminder}><label>Reminder type<select value={reminderForm.kind} onChange={e=>setReminderForm({...reminderForm,kind:e.target.value})}><option value="FACILITATOR_FOLLOW_UP">Facilitator follow-up</option><option value="OPPORTUNITY_DEADLINE">Opportunity deadline</option><option value="LEARNING_STEP">Learning step</option><option value="SYSTEM">General reminder</option></select></label><label>Title<input value={reminderForm.title} onChange={e=>setReminderForm({...reminderForm,title:e.target.value})} maxLength={140} required/></label><label>Message<textarea rows={3} value={reminderForm.message} onChange={e=>setReminderForm({...reminderForm,message:e.target.value})} maxLength={500} required/></label><label>Schedule at (local time)<input type="datetime-local" value={reminderForm.scheduledAt} onChange={e=>setReminderForm({...reminderForm,scheduledAt:e.target.value})} required/></label><button className="ecosystem-button ecosystem-button--primary"><CalendarClock size={16}/>Schedule in-app reminder</button></form><div className="ecosystem-callout"><Clock3 size={18}/><div><strong>Delivery boundary</strong><p>Due reminders become available when the app queries the service. There is no push worker or external message provider in this phase.</p></div></div></div>
        <div className="ecosystem-panel"><PanelHeader eyebrow="REMINDER CENTRE" title="Upcoming and due" text="Acknowledge a reminder after the follow-up has been addressed."/>{asArray(data.reminders).length?data.reminders.map(r=><article className="ecosystem-reminder-card" key={r.id}><div className="ecosystem-reminder-card__icon"><Bell size={17}/></div><div className="ecosystem-reminder-card__main"><h4>{r.title}</h4><p>{r.message}</p><small>{r.scheduledAt ? new Date(r.scheduledAt).toLocaleString() : 'Schedule not specified'}</small><div><StatusPill tone={r.status==='READY'?'warm':r.status==='ACKNOWLEDGED'?'good':'neutral'}>{r.status}</StatusPill>{r.status!=='ACKNOWLEDGED'&&<button className="ecosystem-mini-button" onClick={()=>acknowledgeReminder(r)}>Acknowledge <Check size={13}/></button>}</div></div></article>) : <EmptyState title="No reminders yet" body="Create an in-app reminder for a pathway step, deadline or facilitator follow-up."/>}
          <div className="ecosystem-divider"/><h4>Delivery preferences</h4><form className="ecosystem-form" onSubmit={savePreferences}><label className="ecosystem-check"><input type="checkbox" checked={true} disabled aria-label="In-app reminders always enabled"/> Keep in-app reminders enabled (required by this prototype)</label><label className="ecosystem-check"><input type="checkbox" checked={preferences.emailEnabled} onChange={e=>setPreferences({...preferences,emailEnabled:e.target.checked})}/> Email preference (provider not connected)</label><label className="ecosystem-check"><input type="checkbox" checked={preferences.smsEnabled} onChange={e=>setPreferences({...preferences,smsEnabled:e.target.checked})}/> SMS preference (provider not connected)</label><label className="ecosystem-check"><input type="checkbox" checked={preferences.consentToExternalDelivery} onChange={e=>setPreferences({...preferences,consentToExternalDelivery:e.target.checked})}/> Consent to external delivery if a provider is later configured</label><button className="ecosystem-button ecosystem-button--secondary">Save preferences</button></form></div></div>}

      {tab === 'sustainability' && <div className="ecosystem-content-grid"><div className="ecosystem-panel"><PanelHeader eyebrow="PHASE 24 · SUSTAINABILITY" title="Fund the system without pricing learners out" text="The proposal keeps core student discovery, public-opportunity navigation and official-source links free."/><div className="ecosystem-model-grid">{asArray(data.sustainability?.models).map(model=><article className="ecosystem-model-card" key={model.id}><span className="ecosystem-model-card__icon"><CircleDollarSign size={18}/></span><h4>{model.name}</h4><span className="ecosystem-model-payer">Potential payer: {model.whoPays}</span><p>{model.valueHypothesis}</p><div className="ecosystem-model-safeguard"><ShieldCheck size={15}/><span>{model.safeguards}</span></div></article>)}</div>{!asArray(data.sustainability?.models).length&&<EmptyState title="Revenue-model details unavailable" body="Connect the platform API to load the proposed sustainability hypotheses."/>}<div className="ecosystem-callout"><ShieldCheck size={19}/><div><strong>Ethical monetization boundary</strong><p>Payment must never influence eligibility decisions, career matching or ranking of public opportunities. Module pricing is only displayed at this stage; no payment is taken.</p></div></div></div>
        <div className="ecosystem-panel"><PanelHeader eyebrow="VALIDATE BEFORE SELLING" title="Register partnership interest" text="Use this to test payer hypotheses with institutions, NGOs or sponsors. Do not enter banking or payment-card information."/><form className="ecosystem-form" onSubmit={submitInterest}><label>Organization name<input value={interestForm.organizationName} onChange={e=>setInterestForm({...interestForm,organizationName:e.target.value})} maxLength={120} required/></label><label>Organization type<select value={interestForm.organizationType} onChange={e=>setInterestForm({...interestForm,organizationType:e.target.value})}><option value="NGO">NGO</option><option value="SCHOOL">School</option><option value="COLLEGE">College</option><option value="CSR_OR_FOUNDATION">CSR / Foundation</option><option value="SKILL_PROVIDER">Skill provider</option><option value="EMPLOYER">Employer</option><option value="OTHER">Other</option></select></label><label>Model to explore<select value={interestForm.modelId} onChange={e=>setInterestForm({...interestForm,modelId:e.target.value})}>{asArray(data.sustainability?.models).map(m=><option value={m.id} key={m.id}>{m.name}</option>)}{!asArray(data.sustainability?.models).length&&<option value="CSR_SPONSORSHIP">CSR sponsorship</option>}</select></label><label>Approximate learners supported<input type="number" min="1" max="1000000" value={interestForm.approximateLearners} onChange={e=>setInterestForm({...interestForm,approximateLearners:e.target.value})} required/></label><label>Contact email (optional)<input type="email" value={interestForm.contactEmail} onChange={e=>setInterestForm({...interestForm,contactEmail:e.target.value})} maxLength={160}/></label><label>What evidence would you need?<textarea rows={3} value={interestForm.notes} onChange={e=>setInterestForm({...interestForm,notes:e.target.value})} maxLength={600} placeholder="Outcomes, reach, governance, cost per learner..."/></label><label className="ecosystem-check"><input type="checkbox" checked={interestForm.consentToFollowUp} onChange={e=>setInterestForm({...interestForm,consentToFollowUp:e.target.checked})}/> I consent to follow-up about this proposal.</label><button className="ecosystem-button ecosystem-button--primary"><Send size={15}/>Record interest</button></form></div></div>}

      <div className="ecosystem-footer-note"><ShieldCheck size={16}/><span><strong>{t.privacy}:</strong> cohort aliases, facilitator-mediated mentor requests, verified listing workflows and explicit source status are part of the design. This is still a hackathon prototype: demo actor headers, in-memory storage and local browser demo mode are not production security or durable persistence.</span></div>
    </div>
  </section>;
}
