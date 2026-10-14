import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowRight, AudioLines, Bookmark, BookmarkCheck, BookOpen, Briefcase,
  CalendarDays, CheckCircle2, Clock, Database, ExternalLink, Filter, GraduationCap,
  Headphones, Loader2, MapPin, Mic, RefreshCw, Search, Send, ShieldCheck, Sparkles,
  Volume2, Wifi, WifiOff, X,
} from 'lucide-react';
import { askGroundedAssistant, fetchOpportunities, fetchOpportunityActions, requestEligibilityCheck, syncOpportunityActions } from '../api/opportunities.js';
import { DEMO_OPPORTUNITIES } from '../data/demoOpportunityCatalogue.js';
import { cacheCatalogue, createQueuedAction, flushActionQueue, getCachedCatalogue, getLocalActions } from '../offline/offlinePocket.js';
import { beginSpeechRecognition, isSpeechRecognitionAvailable, speakText, stopSpeaking } from '../voice/browserSpeech.js';
import OpportunityReviewWorkbench from './OpportunityReviewWorkbench.jsx';
import './opportunities.css';

const TEXT = {
  en: {
    eyebrow: 'YOUR NEXT STEP, WITH SOURCES', title: 'Find an opportunity that moves you forward.', intro: 'Explore source-linked scholarships, courses, apprenticeship pathways and career services. We show what is known, what needs checking and where to confirm it.',
    all: 'All', scholarship: 'Scholarships', courses: 'Courses', apprentice: 'Apprenticeships', resources: 'Resources', saved: 'My next steps', search: 'Search by interest, course or provider', searchLabel: 'Search opportunities', listingCount: 'source-linked listings', savedCount: 'saved on this device', sourceNote: 'Source-first catalogue', online: 'Connected', offline: 'Low-connectivity mode', dataSaver: 'Data saver', dataSaverOn: 'Data saver on', save: 'Save', savedLabel: 'Saved', remove: 'Remove from saved', details: 'View details', official: 'Open source', deadline: 'Listed deadline', noDeadline: 'No deadline in this portal reference', verified: 'Source checked', recheck: 'Verify at source', portalRef: 'Portal reference', officialPortal: 'Official source', reviewNeeded: 'Eligibility not encoded', reviewNotice: 'This listing does not yet have a complete reviewed eligibility rule set. Open the official source before applying.', checkFit: 'Check fit', matchRules: 'Rules match', moreInfo: 'More information needed', mismatch: 'Possible mismatch', unable: 'Needs review', close: 'Close', nextStep: 'Suggested next step', requirements: 'What to check', sourceTrust: 'Source status', lastChecked: 'Last checked', provider: 'Provider', location: 'Coverage', languages: 'Language tags', documents: 'Documents to confirm', actionCentre: 'My next steps', actionIntro: 'Save an opportunity or mark the next action. Your local list remains available on this device when offline.', emptySaved: 'No saved opportunities yet', emptySavedText: 'Save a source-linked opportunity and it will appear here.', assistantTitle: 'Ask UdaanSetu', assistantText: 'Ask where to begin. Answers are limited to records in this catalogue, with source links for verification.', askPlaceholder: 'e.g. How can I find a scholarship for college?', ask: 'Ask', asking: 'Checking sources…', voice: 'Speak question', listen: 'Listen to answer', voiceUnavailable: 'Speech recognition is not available in this browser. You can type instead.', micDisclosure: 'Voice support depends on your browser and network; your text transcript can be corrected before sending.', noEvidence: 'I could not reach the assistant. I have not generated an answer. You can still open the source-linked listings below.', noResults: 'No matching items in this catalogue', noResultsText: 'Try a broader phrase or choose another category.', loading: 'Loading source-linked opportunities…', usingCache: 'Showing saved catalogue data; live refresh is unavailable.', fallback: 'Showing starter source references. Refresh official details before making a decision.', refreshed: 'Catalogue refreshed', actionSaved: 'Next step saved on this device.', actionQueued: 'Saved locally; will sync when a connection returns.', syncReady: 'Pending actions are synchronized.', noPersonal: 'Prototype note: this is not an authenticated account. Do not store sensitive information here.', dataNotice: 'A source link is not proof that a listing is currently open. Confirm requirements and deadlines with the provider.', eligibilityDisclosure: 'Only enter details needed for this check. The prototype endpoint does not persist these answers; the official provider makes the final decision.', education: 'Education level', state: 'State / UT', age: 'Age', income: 'Annual family income (₹, optional)', runCheck: 'Run eligibility check', checking: 'Checking…', answerUnsupported: 'No supported evidence found', sources: 'Sources', by: 'by', actions: 'Actions', source: 'Source', pending: 'Pending sync', synced: 'Synced', referenceOnly: 'Reference only', curated: 'Curated starter catalogue', poweredBy: 'Grounded in catalogue records', clear: 'Clear search', showAll: 'Show all listings', endDate: 'Application date shown on official portal', askCategory: 'Would you like scholarships, courses or apprenticeships?', tryPrompt: 'Try a question', promptScholarship: 'How can I find scholarships for college?', promptCourse: 'Where can I find skill courses?', promptApprenticeship: 'How can I explore apprenticeships?', reviewNeed: 'Do not treat this as an eligibility decision.', offlineDetails: 'Only the saved public catalogue and action list are available offline. New source checks need a connection.', listening: 'Listening…', stopListening: 'Stop listening', statusQueued: 'Saved; waiting for connection', application: 'I want to take this step', markInterested: 'I’m interested', startApplication: 'I’m starting the application', openOfficial: 'Open official page', tabBrowse: 'Discover', tabSaved: 'Saved items'
  },
  hi: {
    eyebrow: 'स्रोत के साथ अगला कदम', title: 'ऐसा अवसर खोजें जो आपको आगे बढ़ाए।', intro: 'छात्रवृत्ति, पाठ्यक्रम, अप्रेंटिसशिप और करियर सेवाओं के स्रोत देखें। हम स्पष्ट करते हैं कि क्या ज्ञात है और क्या आधिकारिक स्रोत पर जाँचना है।',
    all: 'सभी', scholarship: 'छात्रवृत्तियाँ', courses: 'पाठ्यक्रम', apprentice: 'अप्रेंटिसशिप', resources: 'संसाधन', saved: 'मेरे अगले कदम', search: 'रुचि, पाठ्यक्रम या प्रदाता खोजें', searchLabel: 'अवसर खोजें', listingCount: 'स्रोत-संबद्ध सूची', savedCount: 'इस डिवाइस पर सहेजे', sourceNote: 'स्रोत-प्रथम सूची', online: 'कनेक्टेड', offline: 'कम-कनेक्टिविटी मोड', dataSaver: 'डेटा बचत', dataSaverOn: 'डेटा बचत चालू', save: 'सहेजें', savedLabel: 'सहेजा गया', remove: 'सहेजे गए से हटाएँ', details: 'विवरण देखें', official: 'स्रोत खोलें', deadline: 'दिखाई गई अंतिम तिथि', noDeadline: 'इस पोर्टल संदर्भ में अंतिम तिथि नहीं', verified: 'स्रोत जाँच', recheck: 'स्रोत पर पुष्टि करें', portalRef: 'पोर्टल संदर्भ', officialPortal: 'आधिकारिक स्रोत', reviewNeeded: 'पात्रता नियम दर्ज नहीं', reviewNotice: 'इस सूची के नियमों की पूरी समीक्षा नहीं हुई है। आवेदन से पहले आधिकारिक स्रोत खोलें।', checkFit: 'पात्रता जाँचें', matchRules: 'नियम मेल खाते हैं', moreInfo: 'और जानकारी चाहिए', mismatch: 'संभव मेल नहीं', unable: 'समीक्षा ज़रूरी', close: 'बंद करें', nextStep: 'अगला सुझाया कदम', requirements: 'क्या जाँचें', sourceTrust: 'स्रोत स्थिति', lastChecked: 'अंतिम जाँच', provider: 'प्रदाता', location: 'क्षेत्र', languages: 'भाषा टैग', documents: 'पुष्टि करने वाले दस्तावेज़', actionCentre: 'मेरे अगले कदम', actionIntro: 'अवसर सहेजें या अगला कदम चिन्हित करें। ऑफलाइन होने पर आपकी स्थानीय सूची इस डिवाइस पर उपलब्ध रहेगी।', emptySaved: 'अभी कोई अवसर सहेजा नहीं गया', emptySavedText: 'कोई स्रोत-संबद्ध अवसर सहेजें, वह यहाँ दिखेगा।', assistantTitle: 'उड़ानसेतु से पूछें', assistantText: 'पूछें कि कहाँ से शुरू करें। उत्तर सूची में उपलब्ध रिकॉर्ड और स्रोतों तक सीमित हैं।', askPlaceholder: 'जैसे कॉलेज के लिए छात्रवृत्ति कैसे खोजूँ?', ask: 'पूछें', asking: 'स्रोत जाँचे जा रहे हैं…', voice: 'बोलकर पूछें', listen: 'उत्तर सुनें', voiceUnavailable: 'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। आप टाइप कर सकते हैं।', micDisclosure: 'वॉइस सुविधा ब्राउज़र और नेटवर्क पर निर्भर है। भेजने से पहले ट्रांसक्रिप्ट सुधारें।', noEvidence: 'सहायक तक पहुँच नहीं हो सकी। कोई उत्तर नहीं बनाया गया। नीचे स्रोत-संबद्ध सूची देखें।', noResults: 'इस सूची में मेल खाने वाली वस्तु नहीं मिली', noResultsText: 'व्यापक शब्द आज़माएँ या दूसरी श्रेणी चुनें।', loading: 'स्रोत-संबद्ध अवसर लोड हो रहे हैं…', usingCache: 'सहेजा गया डेटा दिख रहा है; लाइव अपडेट उपलब्ध नहीं है।', fallback: 'शुरुआती स्रोत संदर्भ दिख रहे हैं। निर्णय से पहले आधिकारिक विवरण जाँचें।', refreshed: 'सूची अपडेट हुई', actionSaved: 'अगला कदम इस डिवाइस पर सहेजा गया।', actionQueued: 'स्थानीय रूप से सहेजा; कनेक्शन लौटने पर सिंक होगा।', syncReady: 'लंबित कार्य सिंक हो गए।', noPersonal: 'पूर्वावलोकन: यह प्रमाणित खाता नहीं है। संवेदनशील जानकारी न सहेजें।', dataNotice: 'स्रोत लिंक इस बात का प्रमाण नहीं कि आवेदन अभी खुला है। प्रदाता से शर्तें और तिथियाँ जाँचें।', eligibilityDisclosure: 'केवल आवश्यक जानकारी दें। पूर्वावलोकन API उत्तर सहेजता नहीं है; अंतिम निर्णय प्रदाता का है।', education: 'शिक्षा स्तर', state: 'राज्य / केंद्र शासित प्रदेश', age: 'आयु', income: 'वार्षिक पारिवारिक आय (₹, वैकल्पिक)', runCheck: 'पात्रता जाँचें', checking: 'जाँच रहे हैं…', answerUnsupported: 'समर्थित जानकारी नहीं मिली', sources: 'स्रोत', by: 'द्वारा', actions: 'कार्य', source: 'स्रोत', pending: 'सिंक लंबित', synced: 'सिंक हुआ', referenceOnly: 'केवल संदर्भ', curated: 'शुरुआती संदर्भ सूची', poweredBy: 'कैटलॉग रिकॉर्ड पर आधारित', clear: 'खोज साफ़ करें', showAll: 'सभी सूची दिखाएँ', endDate: 'आधिकारिक पोर्टल पर दी गई तिथि', askCategory: 'छात्रवृत्ति, पाठ्यक्रम या अप्रेंटिसशिप?', tryPrompt: 'एक सवाल चुनें', promptScholarship: 'मैं कॉलेज की छात्रवृत्ति कैसे खोजूँ?', promptCourse: 'मैं कौशल पाठ्यक्रम कहाँ खोजूँ?', promptApprenticeship: 'मैं अप्रेंटिसशिप के अवसर कैसे खोजूँ?', reviewNeed: 'इसे पात्रता का अंतिम निर्णय न मानें।', offlineDetails: 'ऑफलाइन केवल सहेजी गई सार्वजनिक सूची और कार्य सूची उपलब्ध हैं। नई पुष्टि के लिए कनेक्शन चाहिए।', listening: 'सुन रहे हैं…', stopListening: 'सुनना रोकें', statusQueued: 'सहेजा; कनेक्शन की प्रतीक्षा', application: 'मैं यह कदम लेना चाहता/चाहती हूँ', markInterested: 'मेरी रुचि है', startApplication: 'आवेदन शुरू कर रहा/रही हूँ', openOfficial: 'आधिकारिक पेज खोलें', tabBrowse: 'खोजें', tabSaved: 'सहेजी गई वस्तुएँ'
  },
  ta: {
    eyebrow: 'ஆதாரத்துடன் அடுத்த படி', title: 'உங்களை முன்னேற்றும் வாய்ப்பைக் கண்டறியுங்கள்.', intro: 'உதவித்தொகைகள், படிப்புகள், தொழில் பயிற்சி மற்றும் தொழில் வழிகாட்டல் சேவைகளின் மூலங்களைப் பாருங்கள். எதை அதிகாரப்பூர்வமாக சரிபார்க்க வேண்டும் என்பதையும் காட்டுகிறோம்.',
    all: 'அனைத்தும்', scholarship: 'உதவித்தொகைகள்', courses: 'படிப்புகள்', apprentice: 'தொழில் பயிற்சி', resources: 'வளங்கள்', saved: 'எனது அடுத்த படிகள்', search: 'ஆர்வம், படிப்பு அல்லது வழங்குநரைத் தேடுங்கள்', searchLabel: 'வாய்ப்புகளைத் தேடுங்கள்', listingCount: 'மூல இணைப்புள்ள பதிவுகள்', savedCount: 'இந்த சாதனத்தில் சேமிப்பு', sourceNote: 'மூலத்தை முதலில் பாருங்கள்', online: 'இணைக்கப்பட்டுள்ளது', offline: 'குறைந்த இணைப்பு முறை', dataSaver: 'தரவு சேமிப்பு', dataSaverOn: 'தரவு சேமிப்பு இயக்கத்தில்', save: 'சேமி', savedLabel: 'சேமிக்கப்பட்டது', remove: 'சேமிப்பிலிருந்து நீக்கு', details: 'விவரங்கள்', official: 'மூலத்தைத் திற', deadline: 'காட்டப்பட்ட கடைசி தேதி', noDeadline: 'இந்த மூல குறிப்பில் தேதி இல்லை', verified: 'மூலம் சரிபார்ப்பு', recheck: 'மூலத்தில் உறுதிப்படுத்தவும்', portalRef: 'வலைத்தள குறிப்பு', officialPortal: 'அதிகாரப்பூர்வ மூலம்', reviewNeeded: 'தகுதி விதிகள் உள்ளிடப்படவில்லை', reviewNotice: 'இந்தப் பதிவின் முழுமையான தகுதி விதிகள் இன்னும் சரிபார்க்கப்படவில்லை. விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ மூலத்தைத் திறக்கவும்.', checkFit: 'தகுதியைச் சரிபார்', matchRules: 'விதிகள் பொருந்துகின்றன', moreInfo: 'மேலும் தகவல் தேவை', mismatch: 'பொருந்தாமை இருக்கலாம்', unable: 'மீளாய்வு தேவை', close: 'மூடு', nextStep: 'பரிந்துரைக்கப்படும் அடுத்த படி', requirements: 'சரிபார்க்க வேண்டியவை', sourceTrust: 'மூல நிலை', lastChecked: 'கடைசியாகச் சரிபார்த்தது', provider: 'வழங்குநர்', location: 'பரப்பு', languages: 'மொழி குறிச்சொற்கள்', documents: 'உறுதிப்படுத்த வேண்டிய ஆவணங்கள்', actionCentre: 'எனது அடுத்த படிகள்', actionIntro: 'வாய்ப்பைச் சேமிக்கவும் அல்லது அடுத்த செயலைக் குறிக்கவும். இணையம் இல்லாதபோதும் இந்த சாதனத்தில் உங்கள் உள்ளூர் பட்டியல் இருக்கும்.', emptySaved: 'இன்னும் வாய்ப்புகள் சேமிக்கப்படவில்லை', emptySavedText: 'மூல இணைப்புள்ள வாய்ப்பைச் சேமித்தால் இங்கே தோன்றும்.', assistantTitle: 'உதான் சேதுவிடம் கேளுங்கள்', assistantText: 'எங்கிருந்து தொடங்குவது என்று கேளுங்கள். பதில்கள் இந்தப் பட்டியலில் உள்ள பதிவுகளையும் மூலங்களையும் மட்டுமே பயன்படுத்தும்.', askPlaceholder: 'எ.கா. கல்லூரி உதவித்தொகையை எப்படிக் கண்டுபிடிப்பது?', ask: 'கேள்', asking: 'மூலங்களைச் சரிபார்க்கிறது…', voice: 'குரலில் கேள்', listen: 'பதிலைக் கேள்', voiceUnavailable: 'இந்த உலாவியில் குரல் உள்ளீடு இல்லை. பதிலாகத் தட்டச்சு செய்யலாம்.', micDisclosure: 'குரல் வசதி உலாவி மற்றும் இணையத்தைப் பொறுத்தது. அனுப்பும் முன் உரையைத் திருத்தலாம்.', noEvidence: 'உதவியாளரை அணுக முடியவில்லை. பதில் உருவாக்கப்படவில்லை. கீழே உள்ள மூல இணைப்புகளைப் பாருங்கள்.', noResults: 'இந்தப் பட்டியலில் பொருத்தமானவை இல்லை', noResultsText: 'பரந்த சொற்களை முயற்சிக்கவும் அல்லது வேறு வகையைத் தேர்ந்தெடுக்கவும்.', loading: 'மூல இணைப்புள்ள வாய்ப்புகள் ஏற்றப்படுகின்றன…', usingCache: 'சேமித்த பட்டியல் காட்டப்படுகிறது; நேரடி புதுப்பிப்பு கிடைக்கவில்லை.', fallback: 'தொடக்க மூல குறிப்புகள் காட்டப்படுகின்றன. முடிவெடுக்கும் முன் அதிகாரப்பூர்வ விவரங்களை உறுதிப்படுத்தவும்.', refreshed: 'பட்டியல் புதுப்பிக்கப்பட்டது', actionSaved: 'அடுத்த படி இந்த சாதனத்தில் சேமிக்கப்பட்டது.', actionQueued: 'உள்ளூரில் சேமிக்கப்பட்டது; இணையம் திரும்பும்போது ஒத்திசைக்கப்படும்.', syncReady: 'நிலுவைச் செயல்கள் ஒத்திசைக்கப்பட்டன.', noPersonal: 'முன்மாதிரி குறிப்பு: இது சரிபார்க்கப்பட்ட கணக்கு அல்ல. முக்கியமான தகவலைச் சேமிக்க வேண்டாம்.', dataNotice: 'மூல இணைப்பு மட்டும் விண்ணப்பம் திறந்திருப்பதை உறுதிப்படுத்தாது. வழங்குநரிடம் விதிகளையும் தேதிகளையும் சரிபார்க்கவும்.', eligibilityDisclosure: 'இந்தச் சரிபார்ப்புக்கு தேவையான தகவலை மட்டும் அளிக்கவும். முன்மாதிரி API பதில்களைச் சேமிக்காது; இறுதி முடிவு வழங்குநருடையது.', education: 'கல்வி நிலை', state: 'மாநிலம் / யூனியன் பிரதேசம்', age: 'வயது', income: 'ஆண்டு குடும்ப வருமானம் (₹, விருப்பம்)', runCheck: 'தகுதியைச் சரிபார்', checking: 'சரிபார்க்கிறது…', answerUnsupported: 'ஆதரிக்கப்படும் தகவல் கிடைக்கவில்லை', sources: 'மூலங்கள்', by: 'வழங்குபவர்', actions: 'செயல்கள்', source: 'மூலம்', pending: 'ஒத்திசைவு நிலுவை', synced: 'ஒத்திசைக்கப்பட்டது', referenceOnly: 'குறிப்பு மட்டும்', curated: 'தொடக்கக் குறிப்பு பட்டியல்', poweredBy: 'பட்டியல் பதிவுகளின் அடிப்படையில்', clear: 'தேடலை அழி', showAll: 'அனைத்தையும் காட்டு', endDate: 'அதிகாரப்பூர்வ தளத்தில் காட்டப்பட்ட தேதி', askCategory: 'உதவித்தொகை, படிப்பு அல்லது தொழில் பயிற்சியா?', tryPrompt: 'ஒரு கேள்வியைத் தேர்ந்தெடுக்கவும்', promptScholarship: 'கல்லூரி உதவித்தொகைகளை எப்படிக் கண்டறிவது?', promptCourse: 'திறன் படிப்புகளை எங்கே தேடலாம்?', promptApprenticeship: 'பழகுநர் வாய்ப்புகளை எப்படிக் கண்டறிவது?', reviewNeed: 'இதனை இறுதி தகுதி முடிவாகக் கருத வேண்டாம்.', offlineDetails: 'சேமிக்கப்பட்ட பொது பட்டியலும் செயல் பட்டியலும் மட்டுமே ஆஃப்லைனில் கிடைக்கும். புதிய சரிபார்ப்புக்கு இணையம் தேவை.', listening: 'கேட்கிறது…', stopListening: 'கேட்பதை நிறுத்து', statusQueued: 'சேமிக்கப்பட்டது; இணையத்திற்காக காத்திருக்கிறது', application: 'இந்த நடவடிக்கையை எடுக்க விரும்புகிறேன்', markInterested: 'எனக்கு ஆர்வம் உள்ளது', startApplication: 'விண்ணப்பத்தைத் தொடங்குகிறேன்', openOfficial: 'அதிகாரப்பூர்வ பக்கத்தைத் திற', tabBrowse: 'கண்டறி', tabSaved: 'சேமித்தவை'
  },
};


// Telugu UI labels; English fallback strings remain only for lower-priority edge states.
TEXT.te = Object.assign({}, TEXT.en, {
  eyebrow: 'ఆధారాలతో తదుపరి అడుగు', title: 'మీరు ముందుకు సాగేందుకు ఉపయోగపడే అవకాశాన్ని కనుగొనండి.',
  intro: 'స్కాలర్‌షిప్‌లు, కోర్సులు, అప్రెంటిస్‌షిప్ మార్గాలు మరియు కెరీర్ సేవల మూల లింకులను అన్వేషించండి. ఏది తెలిసింది, ఏది నిర్ధారించాలి, ఎక్కడ తనిఖీ చేయాలో చూపిస్తాం.',
  all: 'అన్నీ', scholarship: 'స్కాలర్‌షిప్‌లు', courses: 'కోర్సులు', apprentice: 'అప్రెంటిస్‌షిప్‌లు', resources: 'వనరులు', saved: 'నా తదుపరి అడుగులు',
  search: 'ఆసక్తి, కోర్సు లేదా ప్రదాత ద్వారా వెతకండి', searchLabel: 'అవకాశాలను వెతకండి', listingCount: 'మూల లింకులతో జాబితాలు', savedCount: 'ఈ పరికరంలో సేవ్ చేసినవి', sourceNote: 'మూల ఆధారిత కేటలాగ్', online: 'కనెక్ట్ అయింది', offline: 'తక్కువ కనెక్టివిటీ మోడ్', dataSaver: 'డేటా ఆదా', dataSaverOn: 'డేటా ఆదా ఆన్‌లో ఉంది',
  save: 'సేవ్ చేయండి', savedLabel: 'సేవ్ అయింది', remove: 'సేవ్ చేసిన వాటి నుంచి తొలగించండి', details: 'వివరాలు చూడండి', official: 'మూలాన్ని తెరవండి', deadline: 'జాబితాలోని చివరి తేదీ', noDeadline: 'ఈ పోర్టల్ సూచనలో చివరి తేదీ లేదు', verified: 'మూలం తనిఖీ', recheck: 'మూలంలో నిర్ధారించండి', portalRef: 'పోర్టల్ సూచన', officialPortal: 'అధికారిక మూలం',
  reviewNeeded: 'అర్హత నియమాలు ఇంకా నమోదు కాలేదు', reviewNotice: 'ఈ జాబితాకు సంబంధించిన పూర్తి అర్హత నియమాలు ఇంకా సమీక్షించబడలేదు. దరఖాస్తు ముందు అధికారిక మూలాన్ని తెరవండి.', checkFit: 'సరిపోలిక తనిఖీ', matchRules: 'నియమాలు సరిపోతున్నాయి', moreInfo: 'మరింత సమాచారం అవసరం', mismatch: 'సరిపోకపోవచ్చు', unable: 'మానవ సమీక్ష అవసరం', close: 'మూసివేయండి', nextStep: 'సూచించిన తదుపరి అడుగు', requirements: 'తనిఖీ చేయాల్సినవి', sourceTrust: 'మూల స్థితి', lastChecked: 'చివరిగా తనిఖీ చేసిన తేదీ', provider: 'ప్రదాత', location: 'ప్రాంతం', languages: 'భాష ట్యాగులు', documents: 'నిర్ధారించాల్సిన పత్రాలు',
  actionCentre: 'నా తదుపరి అడుగులు', actionIntro: 'అవకాశాన్ని సేవ్ చేయండి లేదా తదుపరి చర్యను గుర్తించండి. ఆఫ్‌లైన్‌లో ఉన్నప్పటికీ స్థానిక జాబితా ఈ పరికరంలో ఉంటుంది.', emptySaved: 'ఇంకా అవకాశాలు సేవ్ చేయలేదు', emptySavedText: 'మూల లింకు ఉన్న అవకాశాన్ని సేవ్ చేస్తే ఇక్కడ కనిపిస్తుంది.',
  assistantTitle: 'ఉదాన్‌సేతును అడగండి', assistantText: 'ఎక్కడ ప్రారంభించాలో అడగండి. సమాధానాలు ఈ కేటలాగ్‌లోని రికార్డులు మరియు మూల లింకులకు మాత్రమే పరిమితం.', askPlaceholder: 'ఉదా: కళాశాల స్కాలర్‌షిప్‌లను ఎలా కనుగొనాలి?', ask: 'అడగండి', asking: 'మూలాలను తనిఖీ చేస్తున్నాం…', voice: 'మాట్లాడి అడగండి', listen: 'సమాధానం వినండి', voiceUnavailable: 'ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు అందుబాటులో లేదు. బదులుగా టైప్ చేయండి.',
  micDisclosure: 'వాయిస్ సౌకర్యం బ్రౌజర్ మరియు నెట్‌వర్క్‌పై ఆధారపడుతుంది. పంపే ముందు ట్రాన్స్‌క్రిప్ట్‌ను సరిచేయవచ్చు.', noEvidence: 'సహాయక సేవను చేరుకోలేకపోయాం. సమాధానం కల్పించలేదు. కింద ఉన్న మూల లింకులను తెరవండి.', noResults: 'ఈ కేటలాగ్‌లో సరిపోలే అంశాలు లేవు', noResultsText: 'విస్తృత పదంతో వెతకండి లేదా వేరే వర్గం ఎంచుకోండి.', loading: 'మూల లింకులతో అవకాశాలను లోడ్ చేస్తున్నాం…', usingCache: 'సేవ్ చేసిన కేటలాగ్ చూపిస్తున్నాం; ప్రత్యక్ష నవీకరణ అందుబాటులో లేదు.', fallback: 'ప్రారంభ మూల సూచనలు చూపిస్తున్నాం. నిర్ణయం తీసుకునే ముందు అధికారిక వివరాలు నిర్ధారించండి.', refreshed: 'కేటలాగ్ నవీకరించబడింది',
  actionSaved: 'తదుపరి అడుగు ఈ పరికరంలో సేవ్ అయింది.', actionQueued: 'స్థానికంగా సేవ్ అయింది; కనెక్షన్ తిరిగి వచ్చినప్పుడు సింక్ అవుతుంది.', syncReady: 'పెండింగ్ చర్యలు సింక్ అయ్యాయి.', noPersonal: 'ప్రోటోటైప్ సూచన: ఇది ధృవీకరించిన ఖాతా కాదు. సున్నితమైన సమాచారాన్ని నిల్వ చేయవద్దు.', dataNotice: 'మూల లింకు మాత్రమే దరఖాస్తు ప్రస్తుతం తెరిచి ఉందని నిరూపించదు. అవసరాలు, తేదీలను ప్రదాత వద్ద నిర్ధారించండి.',
  eligibilityDisclosure: 'ఈ తనిఖీకి అవసరమైన వివరాలనే ఇవ్వండి. ప్రోటోటైప్ API సమాధానాలను నిల్వ చేయదు; తుది నిర్ణయం అధికారిక ప్రదాతదే.', education: 'విద్యా స్థాయి', state: 'రాష్ట్రం / కేంద్రపాలిత ప్రాంతం', age: 'వయస్సు', income: 'వార్షిక కుటుంబ ఆదాయం (₹, ఐచ్ఛికం)', runCheck: 'అర్హతను తనిఖీ చేయండి', checking: 'తనిఖీ చేస్తున్నాం…', answerUnsupported: 'ఆధారంతో సమర్థించగల సమాచారం కనబడలేదు', sources: 'మూలాలు', by: 'ప్రదాత', actions: 'చర్యలు', source: 'మూలం', pending: 'సింక్ పెండింగ్', synced: 'సింక్ అయింది', referenceOnly: 'సూచన మాత్రమే', curated: 'ఎంపిక చేసిన ప్రారంభ కేటలాగ్', poweredBy: 'కేటలాగ్ రికార్డుల ఆధారంగా', clear: 'శోధనను క్లియర్ చేయండి', showAll: 'అన్ని జాబితాలు చూపించండి', endDate: 'అధికారిక పోర్టల్‌లో చూపిన తేదీ',
  askCategory: 'స్కాలర్‌షిప్‌లు, కోర్సులు లేదా అప్రెంటిస్‌షిప్‌ల గురించి తెలుసుకోవాలా?', tryPrompt: 'ఒక ప్రశ్నను ఎంచుకోండి', promptScholarship: 'కళాశాల స్కాలర్‌షిప్‌లను ఎలా కనుగొనాలి?', promptCourse: 'నైపుణ్య కోర్సులను ఎక్కడ వెతకాలి?', promptApprenticeship: 'అప్రెంటిస్‌షిప్ అవకాశాలను ఎలా అన్వేషించాలి?', reviewNeed: 'దీనిని తుది అర్హత నిర్ణయంగా భావించవద్దు.', offlineDetails: 'సేవ్ చేసిన పబ్లిక్ కేటలాగ్ మరియు చర్యల జాబితా మాత్రమే ఆఫ్‌లైన్‌లో అందుబాటులో ఉంటాయి. కొత్త మూల తనిఖీలకు ఇంటర్నెట్ అవసరం.',
  listening: 'వింటున్నాం…', stopListening: 'వినడం ఆపండి', statusQueued: 'సేవ్ అయింది; కనెక్షన్ కోసం వేచి ఉంది', application: 'ఈ తదుపరి చర్య తీసుకోవాలనుకుంటున్నాను', markInterested: 'నాకు ఆసక్తి ఉంది', startApplication: 'దరఖాస్తు ప్రారంభిస్తున్నాను', openOfficial: 'అధికారిక పేజీ తెరవండి', tabBrowse: 'అన్వేషించండి', tabSaved: 'సేవ్ చేసినవి',
});

const TYPES = [
  { key: 'ALL', label: 'all', icon: Filter },
  { key: 'SCHOLARSHIP', label: 'scholarship', icon: GraduationCap },
  { key: 'COURSE', label: 'courses', icon: BookOpen },
  { key: 'APPRENTICESHIP', label: 'apprentice', icon: Briefcase },
  { key: 'RESOURCE', label: 'resources', icon: Database },
];
const ACTIVE_ACTIONS = new Set(['SAVED', 'INTERESTED', 'APPLICATION_STARTED', 'APPLIED', 'COMPLETED']);
const TYPE_NAMES = { SCHOLARSHIP: 'Scholarship', SCHEME: 'Scheme', COURSE: 'Course', APPRENTICESHIP: 'Apprenticeship', MENTOR: 'Mentor', RESOURCE: 'Resource' };

function formatDate(value, language) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.valueOf())) return value;
  const locale = language === 'te' ? 'te-IN' : language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function sourceLabel(item, t) {
  return item.sourceTrust === 'OFFICIAL_PORTAL' ? t.officialPortal : t.portalRef;
}

function VoiceControl({ language, onTranscript, t }) {
  const [voiceMessage, setVoiceMessage] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [listening, setListening] = useState(false);
  const available = isSpeechRecognitionAvailable();
  useEffect(() => () => { try { recognition?.stop(); } catch {} }, [recognition]);
  const start = () => {
    setVoiceMessage('');
    const next = beginSpeechRecognition({
      language,
      onText: (text) => { onTranscript(text); setVoiceMessage(''); },
      onError: (message) => { setVoiceMessage(message); setListening(false); },
      onEnd: () => setListening(false),
    });
    if (next) { setRecognition(next); setListening(true); }
  };
  return <div className="op-voice-wrap">
    <button type="button" className={`op-voice-button ${listening ? 'is-listening' : ''}`} onClick={() => {
      if (listening) { try { recognition?.stop(); } catch {} setListening(false); }
      else if (available) start(); else setVoiceMessage(t.voiceUnavailable);
    }} aria-pressed={listening} title={t.voice}>
      {listening ? <AudioLines size={16} /> : <Mic size={16} />}{listening ? t.listening : t.voice}
    </button>
    <span className="op-voice-disclosure">{voiceMessage || t.micDisclosure}</span>
  </div>;
}

function OpportunityCard({ item, action, language, t, onSave, onDetails }) {
  const isSaved = action && ACTIVE_ACTIONS.has(action.status) && action.status !== 'NOT_INTERESTED';
  const expired = item.deadline && new Date(`${item.deadline}T23:59:59`) < new Date();
  return <article className="op-card">
    <div className="op-card__top">
      <span className={`op-type op-type--${String(item.type || 'resource').toLowerCase()}`}>{TYPE_NAMES[item.type] || 'Opportunity'}</span>
      <span className="op-source-pill"><ShieldCheck size={13} />{sourceLabel(item, t)}</span>
    </div>
    <h3>{item.title}</h3>
    <p className="op-card__provider">{t.by} {item.provider || item.sourceName}</p>
    <p className="op-card__summary">{item.summary}</p>
    <div className="op-card__meta">
      <span><MapPin size={14} />{item.locationLabel || 'All India'}</span>
      {item.deadline ? <span className={expired ? 'op-deadline op-deadline--expired' : 'op-deadline'}><CalendarDays size={14} />{expired ? 'Date passed — verify source' : `${t.deadline}: ${formatDate(item.deadline, language)}`}</span> : <span><Clock size={14} />{t.noDeadline}</span>}
    </div>
    <div className="op-tags">{(item.tags || []).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
    <div className="op-card__footer">
      <button className={`op-button ${isSaved ? 'op-button--saved' : ''}`} onClick={() => onSave(item, isSaved ? 'NOT_INTERESTED' : 'SAVED')}>
        {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}{isSaved ? t.remove : t.save}
      </button>
      <button className="op-button op-button--details" onClick={() => onDetails(item)}>{t.details}<ArrowRight size={16} /></button>
    </div>
    {action?.syncStatus === 'PENDING' && <div className="op-sync-note"><WifiOff size={13} />{t.pending}</div>}
  </article>;
}

export default function OpportunityCentre({ language = 'en', suggestedQuery = '' }) {
  const t = TEXT[language] || TEXT.en;
  // Keep curation tools out of the ordinary learner flow; enable them explicitly for a local team demo with ?review=1.
  const reviewMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('review') === '1';
  const [items, setItems] = useState([]);
  const [serverResults, setServerResults] = useState(null);
  const [actions, setActions] = useState([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('ALL');
  const [view, setView] = useState('discover');
  const [isOnline, setIsOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [answers, setAnswers] = useState({ educationLevel: '', state: '', age: '', annualFamilyIncomeInr: '' });
  const [showEligibilityForm, setShowEligibilityForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [assistantResponse, setAssistantResponse] = useState(null);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState('');
  const [reviewWorkbenchOpen, setReviewWorkbenchOpen] = useState(false);

  useEffect(() => {
    const nextQuery = String(suggestedQuery || '').trim();
    if (!nextQuery) return;
    setQuery(nextQuery);
    setType('ALL');
    setView('discover');
  }, [suggestedQuery]);

  const reloadActions = useCallback(async () => {
    let local = [];
    try { local = await getLocalActions(); } catch { local = []; }
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        const remote = await fetchOpportunityActions();
        const merged = new Map((remote || []).map((action) => [action.opportunityId, action]));
        // Prefer local state when it is newer or still waiting to sync.
        for (const action of local) {
          const existing = merged.get(action.opportunityId);
          if (!existing || action.syncStatus === 'PENDING' || Date.parse(action.updatedAt || '') >= Date.parse(existing.updatedAt || '')) {
            merged.set(action.opportunityId, action);
          }
        }
        setActions([...merged.values()]);
        return;
      } catch { /* Server may be unreachable; local action state remains usable. */ }
    }
    setActions(local);
  }, []);

  const loadCatalogue = useCallback(async ({ background = false } = {}) => {
    if (background) setRefreshing(true); else setLoading(true);
    setNotice('');
    let cached = [];
    try {
      cached = await getCachedCatalogue();
      if (cached.length) setItems(cached);
    } catch { /* use in-memory fallback below */ }
    try {
      const response = await fetchOpportunities({ language, size: dataSaver ? 12 : 50 });
      const fresh = Array.isArray(response) ? response : response.items || [];
      if (!fresh.length) throw new Error('The API returned no catalogue records.');
      await cacheCatalogue(fresh);
      setItems(fresh);
      setUsingFallback(false);
      setNotice(response.dataNotice || t.refreshed);
    } catch {
      if (!cached.length) { setItems(DEMO_OPPORTUNITIES); setUsingFallback(true); setNotice(t.fallback); }
      else { setUsingFallback(true); setNotice(t.usingCache); }
    } finally { setLoading(false); setRefreshing(false); }
  }, [language, dataSaver, t.fallback, t.refreshed, t.usingCache]);

  useEffect(() => {
    loadCatalogue();
    reloadActions();
    const onOnline = async () => {
      setIsOnline(true);
      await flushActionQueue({ syncActions: syncOpportunityActions, isOnline: true });
      await reloadActions();
      loadCatalogue({ background: true });
    };
    const onOffline = () => { setIsOnline(false); setNotice(t.offlineDetails); };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); stopSpeaking(); };
  }, [loadCatalogue, reloadActions, t.offlineDetails]);

  const actionById = useMemo(() => new Map(actions.map((action) => [action.opportunityId, action])), [actions]);
  const savedItems = useMemo(() => items.filter((item) => {
    const action = actionById.get(item.id);
    return action && ACTIVE_ACTIONS.has(action.status) && action.status !== 'NOT_INTERESTED';
  }), [items, actionById]);
  const filteredItems = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    const base = view === 'saved' ? savedItems : (serverResults ?? items);
    return base.filter((item) => {
      const categoryMatches = type === 'ALL' || item.type === type || (type === 'RESOURCE' && item.type === 'SCHEME');
      const text = `${item.title} ${item.summary} ${item.provider} ${(item.tags || []).join(' ')}`.toLocaleLowerCase();
      return categoryMatches && (!needle || text.includes(needle));
    });
  }, [items, query, savedItems, serverResults, type, view]);

  useEffect(() => {
    if (view === 'saved' || (!query.trim() && type === 'ALL')) {
      setServerResults(null);
      return undefined;
    }
    if (!isOnline) {
      setServerResults(null); // filter cached catalogue locally when offline
      return undefined;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetchOpportunities({ query, type, language, size: dataSaver ? 12 : 50, signal: controller.signal });
        const fresh = Array.isArray(response) ? response : response.items || [];
        setServerResults(fresh);
        await cacheCatalogue(fresh);
      } catch {
        // Preserve the source-linked cache and local search path during an outage.
        setServerResults(null);
      }
    }, 260);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query, type, language, view, isOnline, dataSaver]);

  const saveAction = async (item, status) => {
    try {
      const action = await createQueuedAction({ opportunityId: item.id, status });
      setActions((current) => [action, ...current.filter((entry) => entry.opportunityId !== item.id)]);
      setNotice(isOnline ? t.actionSaved : t.actionQueued);
      if (isOnline) {
        await flushActionQueue({ syncActions: syncOpportunityActions, isOnline: true });
        await reloadActions();
      }
    } catch {
      setNotice(t.actionQueued);
    }
  };

  const runEligibility = async () => {
    if (!selected) return;
    setEligibilityLoading(true); setEligibility(null);
    try {
      const payload = {};
      if (showEligibilityForm) {
        if (answers.educationLevel) payload.educationLevel = answers.educationLevel;
        if (answers.state.trim()) payload.state = answers.state.trim();
        if (answers.age) payload.age = Number(answers.age);
        if (answers.annualFamilyIncomeInr) payload.annualFamilyIncomeInr = Number(answers.annualFamilyIncomeInr);
      }
      const result = await requestEligibilityCheck(selected.id, payload);
      setEligibility(result);
    } catch {
      setEligibility({ status: 'NEEDS_REVIEW', explanation: t.noEvidence, missingInformation: [], matchedRules: [], authorityNote: t.reviewNeed });
    } finally { setEligibilityLoading(false); }
  };

  const submitAssistantQuestion = async (rawText) => {
    const text = String(rawText || '').trim();
    if (text.length < 2 || assistantLoading) return;
    setQuestion(text);
    setAssistantLoading(true); setAssistantError(''); setAssistantResponse(null);
    try {
      const response = await askGroundedAssistant(text, language, items);
      setAssistantResponse(response);
    } catch {
      const terms = queryTokens(text);
      const matches = items.map((item) => ({ item, score: queryTokens(`${item.title} ${item.summary} ${(item.tags || []).join(' ')}`).filter((term) => terms.includes(term)).length }))
        .filter((match) => match.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((match) => match.item);
      setAssistantResponse({ status: matches.length ? 'MATCHED' : 'NO_SUPPORTED_EVIDENCE', answer: t.noEvidence, sources: matches.map((item) => ({ id: item.id, title: item.title, sourceName: item.sourceName, sourceUrl: item.sourceUrl, sourceTrust: item.sourceTrust, lastVerifiedAt: item.lastVerifiedAt })), modelUsed: false, notice: t.dataNotice });
      setAssistantError(t.noEvidence);
    } finally { setAssistantLoading(false); }
  };

  const runAssistant = async (event) => {
    event?.preventDefault();
    await submitAssistantQuestion(question);
  };

  const useSuggestedQuestion = (prompt) => {
    setQuestion(prompt);
    void submitAssistantQuestion(prompt);
  };

  const speakAnswer = () => {
    const text = assistantResponse?.answer;
    if (text && !speakText(text, language)) setAssistantError(t.voiceUnavailable);
  };

  const setField = (field, value) => setAnswers((current) => ({ ...current, [field]: value }));
  const openDetails = (item) => { setSelected(item); setEligibility(null); setShowEligibilityForm(false); setAnswers({ educationLevel: '', state: '', age: '', annualFamilyIncomeInr: '' }); };
  const onVoiceQuestion = (text) => { setQuestion(text); };

  return <section className="opportunity-centre" id="opportunities" aria-labelledby="op-centre-title">
    <div className="opportunity-centre__container">
      <div className="opportunity-heading">
        <div className="opportunity-heading__copy">
          <span className="op-eyebrow"><span />{t.eyebrow}</span>
          <h2 id="op-centre-title">{t.title}</h2>
          <p>{t.intro}</p>
        </div>
        <div className={`op-network-pill ${isOnline ? 'is-online' : 'is-offline'}`}>{isOnline ? <Wifi size={15} /> : <WifiOff size={15} />}{isOnline ? t.online : t.offline}</div>
      </div>

      <div className="op-stat-row">
        <div className="op-stat"><span className="op-stat__icon"><Database size={17} /></span><span><strong>{items.length}</strong><small>{t.listingCount}</small></span></div>
        <div className="op-stat"><span className="op-stat__icon op-stat__icon--peach"><BookmarkCheck size={17} /></span><span><strong>{savedItems.length}</strong><small>{t.savedCount}</small></span></div>
        <button className={`op-data-saver ${dataSaver ? 'is-active' : ''}`} onClick={() => setDataSaver((value) => !value)} aria-pressed={dataSaver}><WifiOff size={15} />{dataSaver ? t.dataSaverOn : t.dataSaver}</button>
      </div>

      <div className="op-explorer">
        <div className="op-explorer__top">
          <div className="op-tabs" role="tablist" aria-label="Opportunity views">
            <button role="tab" aria-selected={view === 'discover'} className={view === 'discover' ? 'is-active' : ''} onClick={() => setView('discover')}>{t.tabBrowse}</button>
            <button role="tab" aria-selected={view === 'saved'} className={view === 'saved' ? 'is-active' : ''} onClick={() => setView('saved')}>{t.tabSaved}<span>{savedItems.length}</span></button>
          </div>
          <button className="op-refresh" onClick={() => loadCatalogue({ background: true })} disabled={refreshing}><RefreshCw size={15} className={refreshing ? 'op-spin' : ''} />{refreshing ? t.asking : t.recheck}</button>
        </div>
        <div className="op-search-row">
          <label className="op-search"><Search size={18} /><span className="sr-only">{t.searchLabel}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /><button type="button" onClick={() => setQuery('')} aria-label={t.clear} disabled={!query}><X size={15} /></button></label>
          <div className="op-filters" aria-label={t.actions}>
            {TYPES.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => setType(key)} className={type === key ? 'is-active' : ''} aria-pressed={type === key}><Icon size={14} />{t[label]}</button>)}
          </div>
        </div>

        {notice && <div className={`op-notice ${usingFallback ? 'op-notice--warn' : ''}`} role="status"><span>{usingFallback ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}</span><p>{notice}</p><button onClick={() => setNotice('')} aria-label={t.close}><X size={15} /></button></div>}
        {loading && !items.length ? <div className="op-loading"><Loader2 className="op-spin" size={22} />{t.loading}</div> : filteredItems.length ? <div className="op-card-grid">{filteredItems.map((item) => <OpportunityCard key={item.id} item={item} action={actionById.get(item.id)} language={language} t={t} onSave={saveAction} onDetails={openDetails} />)}</div> : <div className="op-empty"><span><Search size={22} /></span><h3>{view === 'saved' ? t.emptySaved : t.noResults}</h3><p>{view === 'saved' ? t.emptySavedText : t.noResultsText}</p>{query && <button className="op-button op-button--details" onClick={() => { setQuery(''); setType('ALL'); }}>{t.showAll}<ArrowRight size={15} /></button>}</div>}

        <div className="op-data-footnote"><ShieldCheck size={15} /><p>{t.dataNotice}</p></div>
      </div>

      <div className="op-assistant-panel">
        <div className="op-assistant-panel__intro">
          <span className="op-assistant-mark"><Sparkles size={20} /></span>
          <div><span className="op-eyebrow">{t.poweredBy}</span><h3>{t.assistantTitle}</h3><p>{t.assistantText}</p></div>
        </div>
        <form className="op-assistant-form" onSubmit={runAssistant}>
          <label className="sr-only" htmlFor="op-assistant-question">{t.askPlaceholder}</label>
          <input id="op-assistant-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t.askPlaceholder} maxLength={600} />
          <VoiceControl language={language} onTranscript={onVoiceQuestion} t={t} />
          <button type="submit" disabled={assistantLoading || question.trim().length < 2}>{assistantLoading ? <Loader2 className="op-spin" size={16} /> : <Send size={16} />}{assistantLoading ? t.asking : t.ask}</button>
        </form>
        <div className="op-assistant-prompts" aria-label={t.askCategory}>
          <span>{t.tryPrompt}</span>
          <button type="button" disabled={assistantLoading} onClick={() => useSuggestedQuestion(t.promptScholarship)}>{t.scholarship}</button>
          <button type="button" disabled={assistantLoading} onClick={() => useSuggestedQuestion(t.promptCourse)}>{t.courses}</button>
          <button type="button" disabled={assistantLoading} onClick={() => useSuggestedQuestion(t.promptApprenticeship)}>{t.apprentice}</button>
        </div>
        {assistantResponse && <div className="op-answer" role="status">
          <div className="op-answer__head"><span><Sparkles size={15} />{assistantResponse.modelUsed ? 'Grounded AI answer' : t.poweredBy}</span><button onClick={speakAnswer}><Volume2 size={15} />{t.listen}</button></div>
          <p>{assistantResponse.answer}</p>
          {assistantResponse.clarificationPrompt && <p className="op-answer__clarify">{assistantResponse.clarificationPrompt}</p>}
          {assistantResponse.sources?.length > 0 && <div className="op-answer__sources"><strong>{t.sources}</strong>{assistantResponse.sources.map((source) => <a key={source.id} href={source.sourceUrl} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={12} /></a>)}</div>}
          <small>{assistantResponse.notice || t.dataNotice}</small>
        </div>}
        {assistantError && <div className="op-inline-alert"><AlertTriangle size={15} />{assistantError}</div>}
        <p className="op-assistant-footnote"><ShieldCheck size={14} />{t.noPersonal}</p>
      </div>

      <div className="op-lower-grid">
        <div className="op-lower-card"><span className="op-lower-icon op-lower-icon--mint"><BookmarkCheck size={18} /></span><h3>{t.actionCentre}</h3><p>{t.actionIntro}</p><button onClick={() => { setView('saved'); document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{t.tabSaved}<ArrowRight size={15} /></button></div>
        <div className="op-lower-card"><span className="op-lower-icon op-lower-icon--lilac"><Headphones size={18} /></span><h3>{t.voice}</h3><p>{t.micDisclosure}</p><div className="op-voice-capability">{isSpeechRecognitionAvailable() ? <><CheckCircle2 size={15} />Browser recognition detected</> : <><AlertTriangle size={15} />Text input available</>}</div></div>
        <div className="op-lower-card"><span className="op-lower-icon op-lower-icon--peach"><ShieldCheck size={18} /></span><h3>{t.sourceTrust}</h3><p>{t.dataNotice}</p><a href="https://scholarships.gov.in/Students" target="_blank" rel="noreferrer">National Scholarship Portal<ExternalLink size={14} /></a></div>
      </div>
      <div className="op-source-review-launch"><p className="op-prototype-boundary">{t.offlineDetails}</p>{reviewMode && <button onClick={() => setReviewWorkbenchOpen(true)}><ShieldCheck size={14} />Source review workspace <span>Team demo</span></button>}</div>
    </div>

    {reviewWorkbenchOpen && <OpportunityReviewWorkbench onClose={() => setReviewWorkbenchOpen(false)} />}
    {selected && <div className="op-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <section className="op-detail-modal" role="dialog" aria-modal="true" aria-labelledby="op-detail-title">
        <button className="op-modal-close" onClick={() => setSelected(null)} aria-label={t.close}><X size={19} /></button>
        <div className="op-detail-kicker"><span className="op-type">{TYPE_NAMES[selected.type] || 'Opportunity'}</span><span className="op-source-pill"><ShieldCheck size={13} />{sourceLabel(selected, t)}</span></div>
        <h3 id="op-detail-title">{selected.title}</h3><p className="op-detail-provider">{selected.provider || selected.sourceName}</p><p className="op-detail-summary">{selected.summary}</p>
        <div className="op-detail-facts">
          <div><small>{t.location}</small><strong>{selected.locationLabel || 'All India'}</strong></div>
          <div><small>{t.lastChecked}</small><strong>{formatDate(selected.lastVerifiedAt, language) || 'Not recorded'}</strong></div>
          <div><small>{t.deadline}</small><strong>{selected.deadline ? formatDate(selected.deadline, language) : t.noDeadline}</strong></div>
        </div>
        <div className="op-detail-source"><ShieldCheck size={16} /><div><strong>{selected.sourceName || selected.provider}</strong><a href={selected.sourceUrl} target="_blank" rel="noreferrer">{selected.sourceUrl}<ExternalLink size={12} /></a></div></div>
        <div className="op-detail-next"><span>{t.nextStep}</span><p>{selected.nextStep || t.recheck}</p></div>
        {selected.requiredDocuments?.length > 0 && <div className="op-detail-next"><span>{t.documents}</span><ul>{selected.requiredDocuments.map((doc) => <li key={doc}>{doc}</li>)}</ul></div>}
        {!selected.eligibilityRulesConfigured && <div className="op-review-box"><AlertTriangle size={17} /><div><strong>{t.reviewNeeded}</strong><p>{t.reviewNotice}</p></div></div>}
        {selected.eligibilityRulesConfigured && <button className="op-link-button" onClick={() => setShowEligibilityForm((value) => !value)}>{t.checkFit}<ArrowRight size={15} /></button>}
        {showEligibilityForm && selected.eligibilityRulesConfigured && <form className="op-eligibility-form" onSubmit={(event) => { event.preventDefault(); runEligibility(); }}>
          <p>{t.eligibilityDisclosure}</p>
          <label>{t.education}<select value={answers.educationLevel} onChange={(event) => setField('educationLevel', event.target.value)}><option value="">Choose if known</option>{['secondary', 'higher-secondary', 'diploma', 'undergraduate', 'graduate', 'other'].map((level) => <option key={level} value={level}>{level.replace('-', ' ')}</option>)}</select></label>
          <label>{t.state}<input value={answers.state} onChange={(event) => setField('state', event.target.value)} maxLength={80} /></label>
          <label>{t.age}<input type="number" min="13" max="100" value={answers.age} onChange={(event) => setField('age', event.target.value)} /></label>
          <label>{t.income}<input type="number" min="0" value={answers.annualFamilyIncomeInr} onChange={(event) => setField('annualFamilyIncomeInr', event.target.value)} /></label>
          <button type="submit" className="op-button op-button--primary" disabled={eligibilityLoading}>{eligibilityLoading ? <Loader2 size={15} className="op-spin" /> : <CheckCircle2 size={15} />}{t.runCheck}</button>
        </form>}
        {!selected.eligibilityRulesConfigured && <button className="op-button op-button--details" onClick={runEligibility} disabled={eligibilityLoading}>{eligibilityLoading ? <Loader2 size={15} className="op-spin" /> : <ShieldCheck size={15} />}{t.checkFit}</button>}
        {eligibility && <div className={`op-eligibility-result op-eligibility-result--${String(eligibility.status).toLowerCase()}`} role="status"><strong>{eligibility.status === 'RULES_MATCH' ? t.matchRules : eligibility.status === 'NEEDS_MORE_INFORMATION' ? t.moreInfo : eligibility.status === 'POSSIBLE_MISMATCH' ? t.mismatch : t.unable}</strong><p>{eligibility.explanation}</p>{eligibility.missingInformation?.length > 0 && <ul>{eligibility.missingInformation.map((field) => <li key={field}>{field}</li>)}</ul>}<small>{eligibility.authorityNote || t.reviewNeed}</small></div>}
        <div className="op-detail-actions"><button className="op-button" onClick={() => saveAction(selected, 'INTERESTED')}><BookmarkCheck size={16} />{t.markInterested}</button><a className="op-button op-button--primary" href={selected.applicationUrl || selected.sourceUrl} target="_blank" rel="noreferrer" onClick={() => saveAction(selected, 'APPLICATION_STARTED')}>{t.startApplication}<ExternalLink size={15} /></a></div>
        <p className="op-detail-disclaimer">{t.dataNotice}</p>
      </section>
    </div>}
  </section>;
}

function queryTokens(text) {
  return String(text || '').toLocaleLowerCase().split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 1);
}
