import { useCallback, useEffect, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Check, Code2,
  ChevronDown, Compass, GraduationCap, HeartHandshake, Languages, MapPin,
  Menu, Mic2, Signal, Sparkles, Sprout, Users, Wifi, WifiOff, X,
} from 'lucide-react';
import { checkAllServices } from './api/health.js';
import OpportunityCentre from './opportunities/OpportunityCentre.jsx';
import PartnerWorkspace from './partners/PartnerWorkspace.jsx';
import ImpactTrustConsole from './release/ImpactTrustConsole.jsx';
import StudentJourney from './student/StudentJourney.jsx';
import ResourceHub from './resources/ResourceHub.jsx';

const copy = {
  en: {
    eyebrow: 'A clearer way to discover learning resources',
    title: 'Useful learning links.\nOne clear place.',
    intro: 'Find trusted coding tutorials, school and college resources, skill courses, exams and career links — in a language that feels like yours.',
    start: 'Explore resource hub', explore: 'Build my pathway', network: 'Made for low-connectivity days',
    resourceHub: 'Resource hub', learner: 'For learners', facilitator: 'For facilitators', discover: 'Discover your strengths', myPath: 'My learning path', beginLearner: 'Build my learning pathway', openFacilitator: 'Open facilitator workspace',
    discoverText: 'Browse useful links by topic instead of searching across many sites one by one.',
    learn: 'Learn from trusted sources', learnText: 'Open original tutorials, documentation, courses and practice resources.',
    opportunities: 'Find opportunities that count', opportunitiesText: 'Explore scholarships, schemes, courses and apprenticeships with source links.',
    section: 'Less searching. Better next steps.', sectionText: 'Start with a topic, compare useful sources, then use a learning pathway if you need help deciding what to do next.',
    pathLabel: 'Start with a learning area', pathText: 'Browse the collection that is closest to what you want to learn.',
    path1: 'Coding & computer science', path1sub: 'Programming tutorials · DSA · documentation', path2: 'School & college', path2sub: 'Curriculum resources · open courses', path3: 'Skills & careers', path3sub: 'Vocational learning · exams · opportunities',
    pathCta: 'Browse this collection', gentle: 'UdaanSetu organizes resources. Original content stays with its provider.',
    footer: 'Trusted learning links, organized for real-world access.',
    status: 'System readiness', close: 'Close', online: 'Connected', offline: 'Not reachable', checking: 'Checking',
    modalTitle: 'Where would you like to begin?', modalText: 'Choose a starting point. This preview does not create an account or save personal information.',
    student: 'I am a learner', teacher: 'I support learners', continue: 'Preview next step', previewNote: 'This start-flow is still a preview. Source-linked opportunity discovery is now available below.',
    selected: 'Direction selected', studentStep: 'Next: a short strengths conversation in your preferred language.', facilitatorStep: 'Next: a simple way to support a learner or a small group.',
    demo: 'Illustrative pathways — not a career assessment',
  },
  hi: {
    eyebrow: 'सीखने के संसाधन खोजने का आसान तरीका',
    title: 'सीखने के उपयोगी लिंक।\nएक ही जगह।',
    intro: 'विश्वसनीय कोडिंग ट्यूटोरियल, स्कूल-कॉलेज संसाधन, कौशल पाठ्यक्रम, परीक्षाएँ और करियर लिंक अपनी भाषा में खोजें।',
    start: 'संसाधन केंद्र देखें', explore: 'अपना सीखने का रास्ता बनाएँ', network: 'कमज़ोर इंटरनेट के लिए बनाया गया',
    resourceHub: 'संसाधन केंद्र', learner: 'विद्यार्थियों के लिए', facilitator: 'मार्गदर्शकों के लिए', discover: 'अपनी खूबियाँ पहचानें', myPath: 'मेरी सीखने की राह', beginLearner: 'अपनी सीखने की राह बनाएँ', openFacilitator: 'मार्गदर्शक कार्यक्षेत्र खोलें',
    discoverText: 'कई वेबसाइटों पर अलग-अलग खोजने के बजाय विषय के अनुसार उपयोगी लिंक देखें।',
    learn: 'विश्वसनीय स्रोतों से सीखें', learnText: 'मूल ट्यूटोरियल, दस्तावेज़, पाठ्यक्रम और अभ्यास संसाधन खोलें।',
    opportunities: 'उपयोगी अवसर खोजें', opportunitiesText: 'छात्रवृत्ति, योजनाएँ, पाठ्यक्रम और अप्रेंटिसशिप के स्रोत लिंक देखें।',
    section: 'कम खोजें। बेहतर अगला कदम चुनें।', sectionText: 'विषय से शुरुआत करें, उपयोगी स्रोतों की तुलना करें और फिर ज़रूरत हो तो सीखने का रास्ता बनाएँ।',
    pathLabel: 'सीखने का विषय चुनें', pathText: 'जिस विषय में रुचि है, उसके संसाधन देखें।',
    path1: 'कोडिंग और कंप्यूटर विज्ञान', path1sub: 'प्रोग्रामिंग · DSA · तकनीकी दस्तावेज़', path2: 'स्कूल और कॉलेज', path2sub: 'पाठ्यक्रम संसाधन · खुले पाठ्यक्रम', path3: 'कौशल और करियर', path3sub: 'व्यावसायिक सीखना · परीक्षाएँ · अवसर',
    pathCta: 'इस संग्रह को देखें', gentle: 'UdaanSetu संसाधनों को व्यवस्थित करता है; मूल सामग्री प्रदाता के पास रहती है।',
    footer: 'वास्तविक उपयोग के लिए व्यवस्थित विश्वसनीय शिक्षा लिंक।', status: 'सिस्टम की स्थिति', close: 'बंद करें', online: 'जुड़ा हुआ', offline: 'उपलब्ध नहीं', checking: 'जाँच जारी',
    modalTitle: 'आप कहाँ से शुरू करना चाहेंगे?', modalText: 'शुरुआत चुनें। यह पूर्वावलोकन खाता नहीं बनाता और व्यक्तिगत जानकारी सहेजता नहीं है।',
    student: 'मैं विद्यार्थी हूँ', teacher: 'मैं विद्यार्थियों की मदद करता/करती हूँ', continue: 'अगला कदम देखें', previewNote: 'चरण पूर्वावलोकन: नीचे स्रोत-संबद्ध अवसर देखें; विद्यार्थी प्रोफ़ाइल और सीखने के रास्ते आगामी चरणों में जुड़ेंगे।',
    selected: 'दिशा चुनी गई', studentStep: 'अगला: आपकी पसंदीदा भाषा में खूबियों पर छोटी बातचीत।', facilitatorStep: 'अगला: एक विद्यार्थी या छोटे समूह की मदद का सरल तरीका।', demo: 'उदाहरण के रास्ते — करियर आकलन नहीं',
  },
  ta: {
    eyebrow: 'கற்றல் வளங்களைக் கண்டறிய எளிய வழி',
    title: 'பயனுள்ள கற்றல் இணைப்புகள்.\nஒரே இடத்தில்.',
    intro: 'நம்பகமான குறியீட்டு வழிகாட்டிகள், பள்ளி–கல்லூரி வளங்கள், திறன் படிப்புகள், தேர்வுகள் மற்றும் தொழில் இணைப்புகளைக் கண்டறியுங்கள்.',
    start: 'வள மையத்தைப் பாருங்கள்', explore: 'என் கற்றல் பாதையை உருவாக்குங்கள்', network: 'குறைந்த இணைய இணைப்புக்காக வடிவமைக்கப்பட்டது',
    resourceHub: 'வள மையம்', learner: 'மாணவர்களுக்கு', facilitator: 'வழிகாட்டிகளுக்கு', discover: 'உங்கள் திறன்களைக் கண்டறியுங்கள்', myPath: 'என் கற்றல் பாதை', beginLearner: 'என் கற்றல் பாதையை உருவாக்குங்கள்', openFacilitator: 'வழிகாட்டி பணியிடத்தைத் திறக்கவும்',
    discoverText: 'பல தளங்களில் தனித்தனியாகத் தேடுவதற்குப் பதிலாக தலைப்பின்படி இணைப்புகளைப் பாருங்கள்.',
    learn: 'நம்பகமான ஆதாரங்களிலிருந்து கற்கவும்', learnText: 'அசல் வழிகாட்டிகள், ஆவணங்கள், பாடநெறிகள் மற்றும் பயிற்சி வளங்களைத் திறக்கவும்.',
    opportunities: 'பயனுள்ள வாய்ப்புகளைக் கண்டறியுங்கள்', opportunitiesText: 'உதவித்தொகைகள், திட்டங்கள், படிப்புகள் மற்றும் பயிற்சி வாய்ப்புகளுக்கான மூல இணைப்புகள்.',
    section: 'குறைந்த தேடல். தெளிவான அடுத்த படி.', sectionText: 'ஒரு தலைப்பில் தொடங்கி, பயனுள்ள ஆதாரங்களை ஒப்பிட்டு, தேவையானால் கற்றல் பாதையை உருவாக்குங்கள்.',
    pathLabel: 'கற்றல் தலைப்பைத் தேர்வுசெய்யுங்கள்', pathText: 'உங்களுக்குப் பொருந்தும் வளத் தொகுப்பைத் திறக்கவும்.',
    path1: 'குறியீடு மற்றும் கணினி அறிவியல்', path1sub: 'நிரலாக்கம் · DSA · தொழில்நுட்ப ஆவணங்கள்', path2: 'பள்ளி மற்றும் கல்லூரி', path2sub: 'பாடத்திட்ட வளங்கள் · திறந்த படிப்புகள்', path3: 'திறன்கள் மற்றும் தொழில்', path3sub: 'தொழிற்பயிற்சி · தேர்வுகள் · வாய்ப்புகள்',
    pathCta: 'இந்தத் தொகுப்பைப் பாருங்கள்', gentle: 'UdaanSetu வளங்களை ஒழுங்குபடுத்துகிறது; அசல் உள்ளடக்கம் வழங்குநரிடமே இருக்கும்.',
    footer: 'நடைமுறை பயன்பாட்டுக்காக ஒழுங்குபடுத்தப்பட்ட நம்பகமான கல்வி இணைப்புகள்.', status: 'சேவை நிலை', close: 'மூடு', online: 'இணைக்கப்பட்டது', offline: 'அணுக முடியவில்லை', checking: 'சரிபார்க்கிறது',
    modalTitle: 'எங்கு தொடங்க விரும்புகிறீர்கள்?', modalText: 'ஒரு தொடக்கத்தைத் தேர்ந்தெடுக்கவும். இந்த முன்னோட்டம் கணக்கை உருவாக்காது அல்லது தனிப்பட்ட தகவலைச் சேமிக்காது.',
    student: 'நான் ஒரு மாணவர்', teacher: 'நான் மாணவர்களுக்கு வழிகாட்டுகிறேன்', continue: 'அடுத்த படியைப் பார்க்கவும்', previewNote: 'இந்த தொடக்கத் திரை இன்னும் முன்னோட்டம். மூல இணைப்புள்ள வாய்ப்புகள் கீழே கிடைக்கின்றன.',
    selected: 'வழி தேர்ந்தெடுக்கப்பட்டது', studentStep: 'அடுத்து: விருப்பமான மொழியில் திறன்களைப் பற்றி ஒரு சிறிய உரையாடல்.', facilitatorStep: 'அடுத்து: ஒரு மாணவர் அல்லது சிறு குழுவுக்கு உதவும் எளிய வழி.', demo: 'விளக்கத்திற்கான பாதைகள் — தொழில் மதிப்பீடு அல்ல',
  },
  te: {
    eyebrow: 'విద్యా వనరులను కనుగొనే సులభమైన మార్గం', title: 'ఉపయోగకరమైన విద్యా లింకులు.\nఒకే చోట.',
    intro: 'నమ్మకమైన కోడింగ్ ట్యుటోరియల్స్, పాఠశాల–కళాశాల వనరులు, నైపుణ్య కోర్సులు, పరీక్షలు మరియు కెరీర్ లింకులను మీకు నచ్చిన భాషలో కనుగొనండి.',
    start: 'వనరుల కేంద్రాన్ని చూడండి', explore: 'నా అభ్యాస మార్గాన్ని నిర్మించండి', network: 'తక్కువ ఇంటర్నెట్ కోసం రూపొందించబడింది',
    resourceHub: 'విద్యా వనరుల కేంద్రం', learner: 'విద్యార్థుల కోసం', facilitator: 'మార్గదర్శకుల కోసం', discover: 'మీ ఆసక్తులను తెలుసుకోండి', myPath: 'నా అభ్యాస మార్గం', beginLearner: 'నా అభ్యాస మార్గాన్ని నిర్మించండి', openFacilitator: 'మార్గదర్శక వర్క్‌స్పేస్ తెరవండి',
    discoverText: 'వేర్వేరు వెబ్‌సైట్లలో వెతకడానికి బదులుగా, అంశాల వారీగా ఉపయోగకరమైన లింకులను చూడండి.',
    learn: 'నమ్మకమైన మూలాల నుంచి నేర్చుకోండి', learnText: 'అసలు ట్యుటోరియల్స్, డాక్యుమెంటేషన్, కోర్సులు మరియు సాధన వనరులను తెరవండి.',
    opportunities: 'ఉపయోగకరమైన అవకాశాలను కనుగొనండి', opportunitiesText: 'స్కాలర్‌షిప్‌లు, పథకాలు, కోర్సులు మరియు అప్రెంటిస్‌షిప్‌ల మూల లింకులను చూడండి.',
    section: 'తక్కువ వెతుకులాట. స్పష్టమైన తదుపరి అడుగు.', sectionText: 'ఒక అంశంతో ప్రారంభించి, ఉపయోగకరమైన మూలాలను పోల్చి, అవసరమైతే అభ్యాస మార్గాన్ని నిర్మించండి.',
    pathLabel: 'మీ అభ్యాస అంశాన్ని ఎంచుకోండి', pathText: 'మీకు దగ్గరగా ఉన్న అంశానికి సంబంధించిన వనరులను బ్రౌజ్ చేయండి.',
    path1: 'కోడింగ్ & కంప్యూటర్ సైన్స్', path1sub: 'ప్రోగ్రామింగ్ · DSA · సాంకేతిక డాక్యుమెంటేషన్', path2: 'పాఠశాల & కళాశాల', path2sub: 'పాఠ్యాంశ వనరులు · ఓపెన్ కోర్సులు', path3: 'నైపుణ్యాలు & కెరీర్', path3sub: 'వృత్తి శిక్షణ · పరీక్షలు · అవకాశాలు',
    pathCta: 'ఈ వనరులను చూడండి', gentle: 'UdaanSetu వనరులను క్రమబద్ధం చేస్తుంది; అసలు కంటెంట్ మూల వెబ్‌సైట్‌లోనే ఉంటుంది.',
    footer: 'నిజ జీవితంలో ఉపయోగించడానికి క్రమబద్ధం చేసిన నమ్మకమైన విద్యా లింకులు.', status: 'సిస్టమ్ స్థితి', close: 'మూసివేయి', online: 'కనెక్ట్ అయింది', offline: 'అందుబాటులో లేదు', checking: 'తనిఖీ చేస్తోంది',
    modalTitle: 'ఎక్కడి నుంచి ప్రారంభించాలి?', modalText: 'ఒక ప్రారంభాన్ని ఎంచుకోండి. ఈ ప్రివ్యూ ఖాతాను సృష్టించదు లేదా వ్యక్తిగత సమాచారాన్ని సేవ్ చేయదు.',
    student: 'నేను విద్యార్థిని', teacher: 'నేను విద్యార్థులకు సహాయం చేస్తాను', continue: 'తదుపరి అడుగు చూడండి', previewNote: 'ఇది ప్రారంభ దశ ప్రివ్యూ. దిగువన మూల లింకులతో వనరుల శోధన అందుబాటులో ఉంది.',
    selected: 'దిశ ఎంచుకోబడింది', studentStep: 'తదుపరి: మీ భాషలో ఆసక్తులు, బలాల గురించి చిన్న సంభాషణ.', facilitatorStep: 'తదుపరి: ఒక విద్యార్థి లేదా చిన్న సమూహానికి సహాయం చేసే మార్గం.', demo: 'ఉదాహరణ దిశలు — కెరీర్ అంచనా కాదు',
  },
};

const directions = [
  { id: 'coding', resourceCategory: 'coding', icon: Code2, tone: 'mint', copyKey: 'path1', subKey: 'path1sub' },
  { id: 'school', resourceCategory: 'school', icon: GraduationCap, tone: 'peach', copyKey: 'path2', subKey: 'path2sub' },
  { id: 'skills', resourceCategory: 'skills', icon: Compass, tone: 'lilac', copyKey: 'path3', subKey: 'path3sub' },
];

const features = [
  { id: 'discover', icon: Compass, key: 'discover', textKey: 'discoverText', num: '01' },
  { id: 'learn', icon: BookOpen, key: 'learn', textKey: 'learnText', num: '02' },
  { id: 'opportunities', icon: GraduationCap, key: 'opportunities', textKey: 'opportunitiesText', num: '03' },
];

function StatusDot({ state }) {
  return <span className={`status-dot status-dot--${state}`} aria-hidden="true" />;
}

function ServicePanel({ t, statuses, isOnline, onRefresh, isRefreshing }) {
  const row = (label, item) => (
    <div className="service-row" key={label}>
      <span className="service-row__name"><StatusDot state={item?.state ?? 'checking'} />{label}</span>
      <span className={`service-state service-state--${item?.state ?? 'checking'}`}>
        {item?.state === 'online' ? t.online : item?.state === 'offline' ? t.offline : item?.state === 'degraded' ? 'Degraded' : t.checking}
      </span>
    </div>
  );
  return (
    <section className="system-panel" aria-label={t.status}>
      <div className="system-panel__head">
        <div><span className="eyebrow eyebrow--small">PLATFORM CHECK</span><h3>{t.status}</h3></div>
        <button className="icon-button" onClick={onRefresh} disabled={isRefreshing} aria-label="Refresh service status" title="Refresh status">
          <Activity size={17} className={isRefreshing ? 'spin' : ''} />
        </button>
      </div>
      {row('Java platform API', statuses?.platform)}
      {row('Python AI gateway', statuses?.ai)}
      <p className="system-panel__note">{isOnline ? 'Your device reports an internet connection. Individual services may still be unavailable.' : 'Your device reports no network connection. The initial screen can remain available when cached.'}</p>
    </section>
  );
}

function StartModal({ t, onClose, onChoose, onBegin, role, setRole, selectedPath }) {
  const [continued, setContinued] = useState(false);
  useEffect(() => {
    function onKey(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="start-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close icon-button" onClick={onClose} aria-label={t.close}><X size={20} /></button>
        {!continued ? <>
          <div className="modal-symbol"><Sparkles size={23} /></div>
          <span className="eyebrow">YOUR FIRST STEP</span>
          <h2 id="modal-title">{selectedPath ? t.selected : t.modalTitle}</h2>
          <p>{selectedPath ? `${t[selectedPath.copyKey]} — ${t[selectedPath.subKey]}` : t.modalText}</p>
          <div className="role-options">
            <button className={`role-option ${role === 'student' ? 'is-selected' : ''}`} onClick={() => setRole('student')} aria-pressed={role === 'student'}>
              <span className="role-option__icon"><GraduationCap size={21} /></span><span><strong>{t.student}</strong><small>Discover, learn and explore opportunities</small></span><span className="role-option__check"><Check size={14} /></span>
            </button>
            <button className={`role-option ${role === 'facilitator' ? 'is-selected' : ''}`} onClick={() => setRole('facilitator')} aria-pressed={role === 'facilitator'}>
              <span className="role-option__icon"><Users size={21} /></span><span><strong>{t.teacher}</strong><small>Support learners and guide next steps</small></span><span className="role-option__check"><Check size={14} /></span>
            </button>
          </div>
          <button className="button button--primary button--wide" onClick={() => { setContinued(true); onChoose(role); }}>{t.continue}<ArrowRight size={17} /></button>
          <p className="modal-footnote">{t.previewNote}</p>
        </> : <>
          <div className="success-mark"><Check size={25} /></div>
          <span className="eyebrow">PREVIEW READY</span>
          <h2 id="modal-title">{t[selectedPath ? selectedPath.copyKey : role === 'student' ? 'discover' : 'learn']}</h2>
          <p>{role === 'student' ? t.studentStep : t.facilitatorStep}</p>
          <div className="preview-boundary"><Signal size={17} /><span>{t.previewNote}</span></div>
          <div className="start-modal__actions"><button className="button button--quiet" onClick={onClose}>{t.close}</button><button className="button button--primary button--wide" onClick={() => onBegin(role)}>{role === 'student' ? t.beginLearner : t.openFacilitator}<ArrowRight size={17} /></button></div>
        </>}
      </section>
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState('student');
  const [selectedPath, setSelectedPath] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statuses, setStatuses] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [suggestedOpportunityQuery, setSuggestedOpportunityQuery] = useState('');
  const [resourceCategoryFocus, setResourceCategoryFocus] = useState('all');
  const t = copy[language] || copy.en;

  const browseResourceCategory = (category = 'all') => {
    setResourceCategoryFocus(category);
    window.setTimeout(() => document.getElementById('resource-hub')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const refreshStatuses = useCallback(async () => {
    setIsRefreshing(true);
    const result = await checkAllServices();
    setStatuses(result);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    refreshStatuses();
    const interval = window.setInterval(refreshStatuses, 30000);
    const online = () => { setIsOnline(true); refreshStatuses(); };
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, [refreshStatuses]);

  const openStart = (path = null) => {
    setSelectedPath(path);
    setModalOpen(true);
    setMenuOpen(false);
  };

  const beginSelectedFlow = (selectedRole) => {
    setRole(selectedRole);
    setModalOpen(false);
    const targetId = selectedRole === 'student' ? 'student-journey' : 'ecosystem-workspace';
    window.setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const explorePathwayOpportunities = ({ query }) => {
    setSuggestedOpportunityQuery(query || '');
    window.setTimeout(() => document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  return (
    <div className="app-shell">
      <div className="announcement-bar">
        <span className="announcement-bar__spark"><Sprout size={14} /></span>
        <span>{t.network}</span>
        <span className="announcement-bar__divider" />
        <span className="announcement-bar__proof"><Wifi size={13} /> Offline-ready foundations</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="UdaanSetu home">
          <span className="brand-mark"><span className="brand-mark__stem" /><span className="brand-mark__leaf brand-mark__leaf--one" /><span className="brand-mark__leaf brand-mark__leaf--two" /></span>
          <span className="brand-name">udaan<span>setu</span><small>LEARN · GROW · GO</small></span>
        </a>
        <nav className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`} aria-label="Main navigation">
          <a href="#resource-hub" onClick={() => { setMenuOpen(false); browseResourceCategory('all'); }}>{t.resourceHub}</a>
          <a href="#pathways" onClick={() => setMenuOpen(false)}>{t.pathLabel}</a>
          <a href="#student-journey" onClick={() => setMenuOpen(false)}>{t.myPath}</a>
          <a href="#opportunities" onClick={() => setMenuOpen(false)}>{t.opportunities}</a>
          <a href="#ecosystem-workspace" onClick={() => setMenuOpen(false)}>{t.facilitator}</a>
          <a href="#impact-trust" onClick={() => setMenuOpen(false)}>Impact &amp; trust</a>
          <button className="nav-link-button" onClick={() => { setStatusOpen((v) => !v); setMenuOpen(false); }}><Activity size={15} /> {t.status}</button>
          <button className="button button--nav" onClick={() => openStart()}>{t.start}<ArrowUpRight size={16} /></button>
        </nav>
        <div className="header-actions">
          <label className="language-picker" aria-label="Choose language">
            <Languages size={16} />
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="en">EN</option><option value="hi">हिंदी</option><option value="ta">தமிழ்</option><option value="te">తెలుగు</option>
            </select><ChevronDown size={13} />
          </label>
          <button className="menu-toggle icon-button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>

      {statusOpen && <div className="status-drawer"><ServicePanel t={t} statuses={statuses} isOnline={isOnline} onRefresh={refreshStatuses} isRefreshing={isRefreshing} /></div>}

      <main id="home">
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</div>
            <h1>{t.title.split('\n').map((line, i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</h1>
            <p className="hero-lede">{t.intro}</p>
            <div className="hero-actions">
              <button className="button button--primary" onClick={() => browseResourceCategory('all')}>{t.start}<ArrowRight size={18} /></button>
              <button className="button button--quiet" onClick={() => beginSelectedFlow('student')}><span className="play-button"><ArrowDownRight size={16} /></span>{t.explore}</button>
            </div>
            <div className="hero-trustline"><span className="trust-icon"><ShieldIcon /></span><span>Built around learner choice, clear sources and trusted guidance.</span></div>
            <div className="hero-availability"><span className="availability-pip" /><span>{t.gentle}</span></div>
          </div>
          <div className="hero-art" aria-label="Illustration of different pathways meeting at a destination" role="img">
            <div className="art-sun" />
            <div className="art-orbit art-orbit--one" /><div className="art-orbit art-orbit--two" />
            <svg className="art-landscape" viewBox="0 0 650 530" fill="none" aria-hidden="true">
              <path d="M6 390C82 344 130 352 192 380C255 410 287 318 359 324C424 330 481 381 644 333V530H6V390Z" fill="#D7E7D5" />
              <path d="M6 427C105 375 167 415 245 434C324 453 392 387 468 401C539 414 586 440 644 417V530H6V427Z" fill="#B3D1B8" />
              <path d="M6 476C100 440 168 459 258 474C347 490 420 453 500 467C559 477 605 474 644 458V530H6V476Z" fill="#8DB89A" />
              <path d="M213 530C231 475 258 424 306 389C351 356 399 338 429 291C451 256 457 230 470 197" stroke="#F8F6E9" strokeWidth="24" strokeLinecap="round" />
              <path d="M213 530C231 475 258 424 306 389C351 356 399 338 429 291C451 256 457 230 470 197" stroke="#D6D6B9" strokeWidth="2" strokeDasharray="5 9" strokeLinecap="round" />
              <path d="M64 530C107 484 139 451 182 430C222 410 255 414 283 430" stroke="#F8F6E9" strokeWidth="17" strokeLinecap="round" />
              <path d="M64 530C107 484 139 451 182 430C222 410 255 414 283 430" stroke="#D6D6B9" strokeWidth="1.5" strokeDasharray="4 8" strokeLinecap="round" />
              <g transform="translate(422 83)"><rect width="120" height="95" rx="20" fill="#FFFCF3" stroke="#E8E8D9"/><circle cx="60" cy="39" r="21" fill="#E5F1D8"/><path d="M60 53V29M60 37C48 38 44 30 45 24C54 24 60 29 60 37ZM60 44C72 45 77 37 75 31C66 31 60 36 60 44Z" stroke="#426F54" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M30 70H90" stroke="#D6E1D2" strokeWidth="5" strokeLinecap="round"/><path d="M40 81H80" stroke="#E7ECE0" strokeWidth="5" strokeLinecap="round"/></g>
              <g transform="translate(82 285)"><rect width="120" height="91" rx="19" fill="#FCF2E4" stroke="#F0DFCA"/><circle cx="60" cy="34" r="17" fill="#F5D6A9"/><path d="M50 39L56 28L63 36L69 29" stroke="#8E6430" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M30 64H90M39 75H81" stroke="#E4CBAA" strokeWidth="5" strokeLinecap="round"/></g>
              <g transform="translate(329 235)"><rect width="126" height="97" rx="20" fill="#F8F3FC" stroke="#E9DDF5"/><circle cx="63" cy="37" r="18" fill="#E7D8F2"/><path d="M54 44L63 27L72 44M58 38H68" stroke="#7A5C9D" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M31 67H95M41 78H85" stroke="#DDD0E9" strokeWidth="5" strokeLinecap="round"/></g>
              <g transform="translate(255 355)"><circle cx="43" cy="43" r="42" fill="#234A3A"/><circle cx="43" cy="30" r="13" fill="#EFC7A1"/><path d="M21 68C22 48 32 43 43 43C55 43 65 49 66 68" fill="#F2F5E9"/><path d="M31 24C32 10 52 8 58 23L54 29H34L31 24Z" fill="#273C30"/><path d="M37 30H37.5M49 30H49.5" stroke="#49362F" strokeWidth="3" strokeLinecap="round"/><path d="M37 36C40 39 46 39 49 36" stroke="#A66D5C" strokeWidth="2" strokeLinecap="round"/></g>
              <g transform="translate(467 185)"><circle cx="0" cy="0" r="6" fill="#D38C4C"/><circle cx="0" cy="0" r="13" stroke="#D38C4C" strokeOpacity=".35" strokeWidth="1.5"/></g>
              <g transform="translate(270 120)"><rect width="118" height="42" rx="21" fill="#234A3A"/><circle cx="23" cy="21" r="8" fill="#CDE1B9"/><path d="M20 21L22 23L26 18" stroke="#234A3A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><text x="40" y="25" fontSize="12" fontWeight="600" fill="#FFFFFF">Your next step</text></g>
            </svg>
            <div className="art-note art-note--top"><span className="art-note__icon art-note__icon--mint"><Compass size={18} /></span><span><strong>Discover</strong><small>What feels like you</small></span></div>
            <div className="art-note art-note--side"><span className="art-note__icon art-note__icon--peach"><BookOpen size={18} /></span><span><strong>Learn</strong><small>One step at a time</small></span></div>
            <div className="art-note art-note--bottom"><span className="art-note__icon art-note__icon--lilac"><GraduationCap size={18} /></span><span><strong>Move forward</strong><small>With real opportunities</small></span></div>
            <div className="art-caption"><span className="art-caption__mark"><MapPin size={14} /></span><span>Many paths. Your choice.</span></div>
          </div>
          <div className="hero-bottomline"><span>01 / DISCOVER</span><span className="hero-bottomline__line" /><span>02 / LEARN</span><span className="hero-bottomline__line" /><span>03 / TAKE THE NEXT STEP</span></div>
        </section>

        <ResourceHub language={language} initialCategory={resourceCategoryFocus} onBuildPathway={() => openStart()} />

        <section className="how-section" id="how-it-works">
          <div className="container">
            <div className="section-heading"><div><span className="eyebrow"><span className="eyebrow-line" />{t.learner}</span><h2>{t.section}</h2></div><p>{t.sectionText}</p></div>
            <div className="feature-grid">
              {features.map((feature) => {
                const Icon = feature.icon;
                return <article className="feature-card" key={feature.id}>
                  <div className="feature-card__top"><span className={`feature-card__icon feature-card__icon--${feature.id}`}><Icon size={23} /></span><span className="feature-card__number">{feature.num}</span></div>
                  <h3>{t[feature.key]}</h3><p>{t[feature.textKey]}</p>
                  <button className="text-action" onClick={() => openStart()}>{t.explore}<ArrowUpRight size={15} /></button>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="pathways-section container" id="pathways">
          <div className="pathways-heading"><div><span className="eyebrow"><span className="eyebrow-line" />EXPLORE WITHOUT LIMITS</span><h2>{t.pathLabel}</h2><p>{t.pathText}</p></div><span className="pathways-stamp"><Sparkles size={15} /> {t.demo}</span></div>
          <div className="pathway-grid">
            {directions.map((direction, index) => {
              const Icon = direction.icon;
              return <article className={`pathway-card pathway-card--${direction.tone}`} key={direction.id}>
                <div className="pathway-card__graphic"><span className="pathway-card__halo" /><span className="pathway-card__symbol"><Icon size={28} strokeWidth={1.7} /></span><span className="pathway-card__index">0{index + 1}</span></div>
                <div className="pathway-card__body"><span className="pathway-card__type">POSSIBLE DIRECTION</span><h3>{t[direction.copyKey]}</h3><p>{t[direction.subKey]}</p><button onClick={() => browseResourceCategory(direction.resourceCategory)} className="pathway-link">{t.pathCta}<ArrowRight size={16} /></button></div>
              </article>;
            })}
          </div>
          <p className="soft-disclaimer"><span><Sparkles size={15} /></span>{t.gentle} These cards are illustrative examples, not AI-generated matches or verified training opportunities.</p>
        </section>

        <StudentJourney language={language} onLanguageChange={setLanguage} onExploreOpportunities={explorePathwayOpportunities} />

        <OpportunityCentre language={language} suggestedQuery={suggestedOpportunityQuery} />

        <PartnerWorkspace language={language} />

        <ImpactTrustConsole language={language} />

        <section className="closing-band">
          <div className="container closing-band__inner"><div className="closing-emblem"><Mic2 size={25} /></div><div><span className="eyebrow eyebrow--light">YOUR VOICE BELONGS HERE</span><h2>Learning should meet you where you are.</h2><p>Simple to explore. Easier to understand. Designed to work with people and real-world constraints.</p></div><button className="button button--light" onClick={() => openStart()}>{t.start}<ArrowRight size={17} /></button></div>
        </section>
      </main>

      <footer className="site-footer"><div className="container site-footer__inner"><a className="brand brand--footer" href="#home"><span className="brand-mark"><span className="brand-mark__stem" /><span className="brand-mark__leaf brand-mark__leaf--one" /><span className="brand-mark__leaf brand-mark__leaf--two" /></span><span className="brand-name">udaan<span>setu</span><small>LEARN · GROW · GO</small></span></a><p>{t.footer}</p><div className="footer-meta"><span><StatusDot state={isOnline ? 'online' : 'offline'} />{isOnline ? 'Device online' : 'Offline mode'}</span><button className="footer-status" onClick={() => setStatusOpen((v) => !v)}>{t.status}<ArrowUpRight size={14} /></button></div></div><div className="container copyright"><span>© UdaanSetu · Hackathon prototype</span><span>Clarity over complexity. Choice over labels.</span></div></footer>

      {modalOpen && <StartModal t={t} onClose={() => setModalOpen(false)} role={role} setRole={setRole} onChoose={setRole} onBegin={beginSelectedFlow} selectedPath={selectedPath} />}
      <span className="sr-only" aria-live="polite">{isOnline ? 'Network appears available' : 'Network appears unavailable'}</span>
    </div>
  );
}

function ShieldIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3L19 6V11.5C19 16 16 19 12 21C8 19 5 16 5 11.5V6L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
