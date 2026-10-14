import { localizedOptionLabel, localizeCareerPath } from './teluguCatalog.js';
export { localizedOptionLabel } from './teluguCatalog.js';

/**
 * Offline-first, explainable career/pathway catalogue.
 * These are exploration prompts—not psychometric results, eligibility decisions, or job guarantees.
 * General learning portals are discovery references; users must verify specific programmes at source.
 */
export const CAREER_PATHWAYS = [
  {
    id: 'skilled-technical', category: 'vocational', icon: 'wrench',
    title: { en: 'Build, repair & work with technology', hi: 'तकनीक बनाना, सुधारना और समझना', ta: 'உருவாக்கம், பழுது பார்த்தல் மற்றும் தொழில்நுட்பம்' },
    summary: { en: 'Explore hands-on technical work, trades, repair, electronics and practical problem-solving.', hi: 'व्यावहारिक तकनीकी काम, ट्रेड, मरम्मत, इलेक्ट्रॉनिक्स और समस्या-समाधान जानें।', ta: 'செய்முறை தொழில்நுட்பம், தொழிற்பயிற்சி, பழுது பார்த்தல் மற்றும் சிக்கல் தீர்க்கும் வழிகளை ஆராயுங்கள்.' },
    interests: ['handsOn', 'technology', 'science', 'nature'], strengths: ['practical', 'problemSolving', 'patient'], goals: ['skillCertificate', 'employment', 'entrepreneurship'],
    stages: ['std9_10', 'std11_12', 'diploma_iti', 'undergraduate', 'graduate'],
    why: { en: 'Your selections point toward practical learning and making things work.', hi: 'आपकी पसंद व्यावहारिक सीखने और चीज़ों को काम करने योग्य बनाने की ओर संकेत करती है।', ta: 'உங்கள் தேர்வுகள் செய்முறையாகக் கற்றல் மற்றும் பொருட்களைச் செயல்படச் செய்வதைக் குறிக்கின்றன.' },
    steps: {
      en: [
        { title: 'Explore a foundation skill', detail: 'Try a beginner module in electronics, repair, fabrication, electrical safety or digital tools.', kind: 'Explore' },
        { title: 'Compare recognised training routes', detail: 'Check nearby ITI/polytechnic options and approved vocational programmes; compare entry rules, travel, fees and practical time.', kind: 'Compare' },
        { title: 'Build evidence of learning', detail: 'Keep a small project log or portfolio. Ask a teacher/facilitator to review safety and quality before sharing work.', kind: 'Practice' },
      ],
      hi: [
        { title: 'बुनियादी कौशल आज़माएँ', detail: 'इलेक्ट्रॉनिक्स, मरम्मत, निर्माण, विद्युत सुरक्षा या डिजिटल औज़ारों का शुरुआती मॉड्यूल आज़माएँ।', kind: 'खोजें' },
        { title: 'मान्यता प्राप्त प्रशिक्षण की तुलना करें', detail: 'नज़दीकी ITI/पॉलिटेक्निक और स्वीकृत व्यावसायिक कार्यक्रमों की प्रवेश शर्तें, यात्रा, शुल्क और अभ्यास समय जाँचें।', kind: 'तुलना' },
        { title: 'सीखने का प्रमाण बनाएँ', detail: 'छोटे प्रोजेक्ट का रिकॉर्ड रखें। काम साझा करने से पहले शिक्षक से सुरक्षा और गुणवत्ता की समीक्षा कराएँ।', kind: 'अभ्यास' },
      ],
      ta: [
        { title: 'அடிப்படைத் திறனை முயற்சிக்கவும்', detail: 'மின்னணு, பழுது பார்த்தல், தயாரித்தல், மின்சாரப் பாதுகாப்பு அல்லது டிஜிட்டல் கருவிகள் பற்றிய தொடக்கப் பாடத்தை முயற்சிக்கவும்.', kind: 'ஆராய்வு' },
        { title: 'அங்கீகரிக்கப்பட்ட பயிற்சிகளை ஒப்பிடுங்கள்', detail: 'அருகிலுள்ள ITI/பாலிடெக்னிக் மற்றும் அங்கீகரிக்கப்பட்ட பயிற்சிகளின் சேர்க்கை, பயணம், கட்டணம், செய்முறை நேரத்தைச் சரிபார்க்கவும்.', kind: 'ஒப்பீடு' },
        { title: 'கற்றதற்கான சான்றை உருவாக்குங்கள்', detail: 'சிறிய திட்டப் பதிவை வைத்திருங்கள். பகிர்வதற்கு முன் ஆசிரியரிடம் பாதுகாப்பு மற்றும் தரத்தை மதிப்பாய்வு செய்யச் சொல்லுங்கள்.', kind: 'பயிற்சி' },
      ],
    },
    resources: [
      { title: 'Skill India Digital Hub', url: 'https://www.skillindiadigital.gov.in/', note: 'Explore skills and training; check each course’s current details.' },
      { title: 'National Career Service', url: 'https://www.ncs.gov.in/', note: 'Career information and related services; verify local availability.' },
    ],
    caution: { en: 'Trades may require formal training, supervised practice, safety equipment or licences. Verify requirements locally.', hi: 'कुछ ट्रेड के लिए औपचारिक प्रशिक्षण, पर्यवेक्षित अभ्यास, सुरक्षा उपकरण या लाइसेंस चाहिए। स्थानीय नियम जाँचें।', ta: 'சில தொழில்களுக்கு முறையான பயிற்சி, மேற்பார்வையிலான பயிற்சி, பாதுகாப்பு உபகரணங்கள் அல்லது உரிமம் தேவைப்படலாம்.' },
  },
  {
    id: 'digital-creative', category: 'creative', icon: 'palette',
    title: { en: 'Create, design & communicate', hi: 'रचना, डिज़ाइन और संवाद', ta: 'படைப்பு, வடிவமைப்பு மற்றும் தொடர்பு' },
    summary: { en: 'Explore visual design, content, local-language communication, media and digital creation.', hi: 'विज़ुअल डिज़ाइन, सामग्री, स्थानीय भाषा में संवाद, मीडिया और डिजिटल रचना जानें।', ta: 'காட்சி வடிவமைப்பு, உள்ளடக்கம், உள்ளூர் மொழித் தொடர்பு, ஊடகம் மற்றும் டிஜிட்டல் படைப்பை ஆராயுங்கள்.' },
    interests: ['design', 'communication', 'technology', 'business'], strengths: ['creative', 'communication', 'organizing'], goals: ['skillCertificate', 'entrepreneurship', 'employment'],
    stages: ['std9_10', 'std11_12', 'diploma_iti', 'undergraduate', 'graduate'],
    why: { en: 'Your choices suggest you may enjoy making ideas clear, useful or visually engaging.', hi: 'आपकी पसंद बताती है कि विचारों को स्पष्ट, उपयोगी या आकर्षक बनाना आपको पसंद आ सकता है।', ta: 'கருத்துகளைத் தெளிவாகவும் பயனுள்ளதாகவும் காட்சியளிக்கச் செய்வது உங்களுக்கு பிடிக்கலாம் என உங்கள் தேர்வுகள் காட்டுகின்றன.' },
    steps: {
      en: [
        { title: 'Try a small creative brief', detail: 'Make a poster, explainer, short audio, photo story or simple webpage for a community topic.', kind: 'Create' },
        { title: 'Learn one tool and one principle', detail: 'Study layout, readability, story structure or audio clarity. Use free or accessible tools where possible.', kind: 'Learn' },
        { title: 'Build a small portfolio', detail: 'Keep 3–5 samples and explain your choices. Get feedback before sharing any personal or community information publicly.', kind: 'Practice' },
      ],
      hi: [
        { title: 'एक छोटा रचनात्मक काम करें', detail: 'किसी सामुदायिक विषय पर पोस्टर, सरल वेबपेज, ऑडियो या फोटो-कहानी बनाएँ।', kind: 'रचना' },
        { title: 'एक औज़ार और एक सिद्धांत सीखें', detail: 'लेआउट, पठनीयता, कहानी की संरचना या ऑडियो स्पष्टता सीखें। जहाँ संभव हो, निःशुल्क औज़ार चुनें।', kind: 'सीखें' },
        { title: 'छोटा पोर्टफोलियो बनाएँ', detail: '3–5 नमूने रखें और अपने निर्णय समझाएँ। सार्वजनिक रूप से साझा करने से पहले प्रतिक्रिया लें।', kind: 'अभ्यास' },
      ],
      ta: [
        { title: 'சிறிய படைப்புப் பணியை முயற்சிக்கவும்', detail: 'சமூகத் தலைப்பில் சுவரொட்டி, எளிய இணையப் பக்கம், ஒலி விளக்கம் அல்லது புகைப்படக் கதையை உருவாக்குங்கள்.', kind: 'உருவாக்கம்' },
        { title: 'ஒரு கருவியும் ஒரு கொள்கையும் கற்றுக்கொள்ளுங்கள்', detail: 'அமைப்பு, வாசிப்புத் தெளிவு, கதை அமைப்பு அல்லது ஒலி தெளிவைக் கற்றுக்கொள்ளுங்கள். முடிந்தால் இலவச கருவிகளைப் பயன்படுத்துங்கள்.', kind: 'கற்றல்' },
        { title: 'சிறிய தொகுப்பை உருவாக்குங்கள்', detail: '3–5 மாதிரிகளைச் சேமித்து உங்கள் தேர்வுகளை விளக்குங்கள். பொதுவில் பகிர்வதற்கு முன் கருத்துகளைப் பெறுங்கள்.', kind: 'பயிற்சி' },
      ],
    },
    resources: [
      { title: 'SWAYAM', url: 'https://swayam.gov.in/', note: 'Search current courses; confirm enrolment, language and certificates.' },
      { title: 'DIKSHA', url: 'https://diksha.gov.in/', note: 'Explore education resources and learning materials.' },
    ],
    caution: { en: 'A portfolio can show practice but does not itself guarantee paid work. Check age requirements and platform safety before publishing.', hi: 'पोर्टफोलियो अभ्यास दिखाता है, नौकरी की गारंटी नहीं। प्रकाशित करने से पहले आयु और सुरक्षा शर्तें जाँचें।', ta: 'போர்ட்ஃபோலியோ பயிற்சியை காட்டும்; வேலை உறுதி செய்யாது. வெளியிடும் முன் வயது மற்றும் பாதுகாப்பு விதிகளைச் சரிபார்க்கவும்.' },
  },
  {
    id: 'community-care', category: 'community', icon: 'heart',
    title: { en: 'Support people & strengthen communities', hi: 'लोगों की मदद और समुदाय को मज़बूत करें', ta: 'மக்களுக்கு உதவி செய்து சமூகத்தை வலுப்படுத்துங்கள்' },
    summary: { en: 'Explore education support, community services, care-related fields and people-facing work.', hi: 'शिक्षा सहायता, सामुदायिक सेवाएँ, देखभाल से जुड़े क्षेत्र और लोगों के साथ काम जानें।', ta: 'கல்வி ஆதரவு, சமூக சேவைகள், பராமரிப்பு துறைகள் மற்றும் மக்களுடன் பணியாற்றும் வழிகளை ஆராயுங்கள்.' },
    interests: ['helping', 'communication', 'science', 'teaching'], strengths: ['caring', 'patient', 'communication', 'organizing'], goals: ['higherStudy', 'employment', 'skillCertificate'],
    stages: ['std9_10', 'std11_12', 'diploma_iti', 'undergraduate', 'graduate'],
    why: { en: 'Your selections include people-focused interests and strengths that may be useful in community roles.', hi: 'आपकी पसंद में लोगों से जुड़ी रुचियाँ और सामुदायिक भूमिकाओं में उपयोगी हो सकने वाली खूबियाँ हैं।', ta: 'சமூகப் பணிகளில் உதவக்கூடிய மக்களுடன் தொடர்புடைய ஆர்வங்களும் திறன்களும் உங்கள் தேர்வுகளில் உள்ளன.' },
    steps: {
      en: [
        { title: 'Explore a community problem', detail: 'Choose an age-appropriate topic such as learning access, health awareness or local service navigation.', kind: 'Explore' },
        { title: 'Learn the boundaries of the role', detail: 'Review training, supervision, safeguarding and qualification requirements. Do not provide health or legal services without credentials.', kind: 'Check' },
        { title: 'Find a supervised learning opportunity', detail: 'Ask a teacher or trusted organisation about approved volunteering, study or skill pathways.', kind: 'Connect' },
      ],
      hi: [
        { title: 'समुदाय की समस्या जानें', detail: 'सीखने की पहुँच, स्वास्थ्य जागरूकता या स्थानीय सेवाओं जैसे उपयुक्त विषय चुनें।', kind: 'खोजें' },
        { title: 'भूमिका की सीमाएँ समझें', detail: 'प्रशिक्षण, पर्यवेक्षण, सुरक्षा और योग्यता की शर्तें जाँचें। बिना योग्यता स्वास्थ्य या कानूनी सेवा न दें।', kind: 'जाँचें' },
        { title: 'पर्यवेक्षित अवसर खोजें', detail: 'शिक्षक या विश्वसनीय संस्था से स्वीकृत स्वयंसेवा, अध्ययन या कौशल मार्ग के बारे में पूछें।', kind: 'जुड़ें' },
      ],
      ta: [
        { title: 'சமூகப் பிரச்சினையை ஆராயுங்கள்', detail: 'கல்வி அணுகல், சுகாதார விழிப்புணர்வு அல்லது உள்ளூர் சேவைகள் போன்ற வயதுக்கேற்ற தலைப்பைத் தேர்ந்தெடுக்கவும்.', kind: 'ஆராய்வு' },
        { title: 'பணியின் எல்லைகளை அறியுங்கள்', detail: 'பயிற்சி, மேற்பார்வை, பாதுகாப்பு மற்றும் தகுதி தேவைகளைச் சரிபார்க்கவும். தகுதியின்றி சுகாதார அல்லது சட்ட சேவைகள் வழங்க வேண்டாம்.', kind: 'சரிபார்ப்பு' },
        { title: 'மேற்பார்வையுள்ள கற்றல் வாய்ப்பைத் தேடுங்கள்', detail: 'அங்கீகரிக்கப்பட்ட தன்னார்வப் பணி அல்லது திறன் வழிகளைப் பற்றி ஆசிரியரிடம் அல்லது நம்பகமான அமைப்பிடம் கேளுங்கள்.', kind: 'இணைப்பு' },
      ],
    },
    resources: [{ title: 'National Career Service', url: 'https://www.ncs.gov.in/', note: 'Explore career information and verify provider requirements.' }],
    caution: { en: 'Care, health and education roles can have formal qualifications and safeguarding requirements. This is an exploration guide, not professional eligibility advice.', hi: 'देखभाल, स्वास्थ्य और शिक्षा भूमिकाओं में औपचारिक योग्यता और सुरक्षा नियम हो सकते हैं। यह केवल खोज मार्गदर्शिका है।', ta: 'பராமரிப்பு, சுகாதாரம் மற்றும் கல்விப் பணிகளுக்கு முறையான தகுதிகளும் பாதுகாப்பு விதிகளும் தேவைப்படலாம். இது வழிகாட்டி மட்டுமே.' },
  },
  {
    id: 'green-agri-enterprise', category: 'enterprise', icon: 'sprout',
    title: { en: 'Work with nature, food & local enterprise', hi: 'प्रकृति, खाद्य और स्थानीय उद्यम के साथ काम करें', ta: 'இயற்கை, உணவு மற்றும் உள்ளூர் தொழில்முனைவுடன் பணியாற்றுங்கள்' },
    summary: { en: 'Explore agriculture, food processing, environment, local business and practical sustainability.', hi: 'कृषि, खाद्य प्रसंस्करण, पर्यावरण, स्थानीय व्यवसाय और व्यावहारिक स्थिरता जानें।', ta: 'வேளாண்மை, உணவு பதப்படுத்தல், சுற்றுச்சூழல், உள்ளூர் வணிகம் மற்றும் நிலைத்தன்மையை ஆராயுங்கள்.' },
    interests: ['nature', 'handsOn', 'business', 'science'], strengths: ['practical', 'organizing', 'problemSolving'], goals: ['entrepreneurship', 'skillCertificate', 'employment'],
    stages: ['std9_10', 'std11_12', 'diploma_iti', 'undergraduate', 'graduate'],
    why: { en: 'You may enjoy solving practical problems connected to the local environment or economy.', hi: 'आपको स्थानीय पर्यावरण या अर्थव्यवस्था से जुड़ी व्यावहारिक समस्याएँ हल करना पसंद आ सकता है।', ta: 'உள்ளூர் சுற்றுச்சூழல் அல்லது பொருளாதாரத்துடன் தொடர்புடைய செய்முறை சிக்கல்களைத் தீர்ப்பது உங்களுக்கு பொருந்தலாம்.' },
    steps: {
      en: [
        { title: 'Map one local need', detail: 'Talk to a teacher or trusted adult about a local food, farming, water, energy or waste challenge.', kind: 'Explore' },
        { title: 'Learn a practical method', detail: 'Explore an age-appropriate course or demonstration; do not invest money or handle chemicals/equipment without supervision.', kind: 'Learn' },
        { title: 'Test a small, safe idea', detail: 'Document the problem, likely users, costs and constraints before considering any enterprise.', kind: 'Plan' },
      ],
      hi: [
        { title: 'स्थानीय ज़रूरत पहचानें', detail: 'खाद्य, खेती, पानी, ऊर्जा या कचरे से जुड़ी चुनौती पर शिक्षक या विश्वसनीय वयस्क से बात करें।', kind: 'खोजें' },
        { title: 'व्यावहारिक तरीका सीखें', detail: 'उपयुक्त कोर्स या प्रदर्शन देखें; पर्यवेक्षण बिना पैसा न लगाएँ और रसायन/उपकरण न संभालें।', kind: 'सीखें' },
        { title: 'छोटे और सुरक्षित विचार की जाँच करें', detail: 'किसी उद्यम से पहले समस्या, उपयोगकर्ता, लागत और सीमाएँ लिखें।', kind: 'योजना' },
      ],
      ta: [
        { title: 'உள்ளூர் தேவையை அடையாளம் காணுங்கள்', detail: 'உணவு, விவசாயம், நீர், ஆற்றல் அல்லது கழிவு சவாலை ஆசிரியர் அல்லது நம்பகமான பெரியவருடன் பேசுங்கள்.', kind: 'ஆராய்வு' },
        { title: 'செய்முறை முறையைக் கற்றுக்கொள்ளுங்கள்', detail: 'வயதுக்கேற்ற பாடம் அல்லது விளக்கத்தைப் பாருங்கள்; மேற்பார்வையின்றி பணம் முதலீடு செய்யவோ கருவிகள்/ரசாயனங்களை கையாளவோ வேண்டாம்.', kind: 'கற்றல்' },
        { title: 'சிறிய பாதுகாப்பான யோசனையைச் சோதியுங்கள்', detail: 'தொழில் தொடங்கும் முன் பிரச்சினை, பயனாளர்கள், செலவு மற்றும் கட்டுப்பாடுகளைப் பதிவு செய்யுங்கள்.', kind: 'திட்டம்' },
      ],
    },
    resources: [
      { title: 'Skill India Digital Hub', url: 'https://www.skillindiadigital.gov.in/', note: 'Explore courses and practical skill programmes.' },
      { title: 'SWAYAM', url: 'https://swayam.gov.in/', note: 'Search courses and verify their current requirements.' },
    ],
    caution: { en: 'Enterprise ideas need local validation, cost checks and adult supervision for minors. No income or business outcome is guaranteed.', hi: 'उद्यम के विचारों के लिए स्थानीय जाँच, लागत और नाबालिगों हेतु वयस्क की निगरानी ज़रूरी है। आय की गारंटी नहीं।', ta: 'தொழில்முனைவு யோசனைகளுக்கு உள்ளூர் சரிபார்ப்பு, செலவு மதிப்பீடு மற்றும் சிறார்களுக்கு பெரியவர் மேற்பார்வை தேவை. வருமானம் உறுதி இல்லை.' },
  },
  {
    id: 'data-business', category: 'analytical', icon: 'chart',
    title: { en: 'Work with numbers, data & organisation', hi: 'संख्याओं, डेटा और संगठन के साथ काम करें', ta: 'எண்கள், தரவு மற்றும் ஒழுங்கமைப்புடன் பணியாற்றுங்கள்' },
    summary: { en: 'Explore accounting support, data handling, business operations, commerce and analytical study.', hi: 'लेखा सहायता, डेटा प्रबंधन, व्यवसाय संचालन, वाणिज्य और विश्लेषणात्मक अध्ययन जानें।', ta: 'கணக்கியல் உதவி, தரவு கையாளல், வணிகச் செயல்பாடுகள் மற்றும் பகுப்பாய்வு படிப்புகளை ஆராயுங்கள்.' },
    interests: ['numbers', 'technology', 'business', 'science'], strengths: ['analytical', 'organizing', 'problemSolving'], goals: ['higherStudy', 'employment', 'examPreparation'],
    stages: ['std9_10', 'std11_12', 'diploma_iti', 'undergraduate', 'graduate'],
    why: { en: 'Your choices show interest in patterns, planning or working carefully with information.', hi: 'आपकी पसंद में पैटर्न, योजना या जानकारी के साथ सावधानी से काम करने की रुचि दिखती है।', ta: 'முறைகள், திட்டமிடல் அல்லது தகவலை கவனமாக கையாள்வதில் உங்கள் தேர்வுகள் ஆர்வத்தைக் காட்டுகின்றன.' },
    steps: {
      en: [
        { title: 'Strengthen number and digital basics', detail: 'Practice spreadsheets, arithmetic, charts and clear record keeping using sample data only.', kind: 'Learn' },
        { title: 'Try a small analysis task', detail: 'Organise a mock budget or public dataset and explain what it can—and cannot—tell you.', kind: 'Practice' },
        { title: 'Compare study and credential routes', detail: 'Review commerce, statistics, business, computer and vocational options with an educator.', kind: 'Compare' },
      ],
      hi: [
        { title: 'संख्या और डिजिटल बुनियाद मज़बूत करें', detail: 'केवल नमूना डेटा से स्प्रेडशीट, गणना, चार्ट और रिकॉर्ड रखने का अभ्यास करें।', kind: 'सीखें' },
        { title: 'छोटा विश्लेषण करें', detail: 'नमूना बजट या सार्वजनिक डेटा व्यवस्थित करें और समझाएँ कि उससे क्या पता चलता है और क्या नहीं।', kind: 'अभ्यास' },
        { title: 'अध्ययन के रास्तों की तुलना करें', detail: 'शिक्षक के साथ वाणिज्य, सांख्यिकी, व्यवसाय, कंप्यूटर और व्यावसायिक विकल्प देखें।', kind: 'तुलना' },
      ],
      ta: [
        { title: 'எண் மற்றும் டிஜிட்டல் அடிப்படைகளை வலுப்படுத்துங்கள்', detail: 'மாதிரி தரவை மட்டும் கொண்டு விரிதாள், கணக்கு, வரைபடம் மற்றும் பதிவு பராமரிப்பைப் பயிற்சி செய்யுங்கள்.', kind: 'கற்றல்' },
        { title: 'சிறிய பகுப்பாய்வை முயற்சிக்கவும்', detail: 'மாதிரி பட்ஜெட் அல்லது பொது தரவை ஒழுங்குபடுத்தி அது என்ன சொல்லுகிறது, என்ன சொல்லாது என்பதைக் கூறுங்கள்.', kind: 'பயிற்சி' },
        { title: 'படிப்பு வழிகளை ஒப்பிடுங்கள்', detail: 'ஆசிரியருடன் வணிகவியல், புள்ளியியல், வணிகம், கணினி மற்றும் தொழிற்பயிற்சி வழிகளைப் பாருங்கள்.', kind: 'ஒப்பீடு' },
      ],
    },
    resources: [{ title: 'SWAYAM', url: 'https://swayam.gov.in/', note: 'Explore current foundational courses; verify level and enrolment details.' }],
    caution: { en: 'Do not upload personal, financial or school records into practice exercises; use sample data.', hi: 'अभ्यास में निजी, वित्तीय या स्कूल रिकॉर्ड अपलोड न करें; नमूना डेटा इस्तेमाल करें।', ta: 'பயிற்சிக்காக தனிப்பட்ட, நிதி அல்லது பள்ளிப் பதிவுகளை பதிவேற்ற வேண்டாம்; மாதிரி தரவைப் பயன்படுத்துங்கள்.' },
  },
  {
    id: 'education-language', category: 'communication', icon: 'book',
    title: { en: 'Teach, explain & work with language', hi: 'सिखाएँ, समझाएँ और भाषा के साथ काम करें', ta: 'கற்பித்தல், விளக்குதல் மற்றும் மொழியுடன் பணியாற்றுதல்' },
    summary: { en: 'Explore peer learning, language support, communication, education and knowledge sharing.', hi: 'सहपाठी सीखना, भाषा सहायता, संवाद, शिक्षा और ज्ञान साझा करना जानें।', ta: 'சக மாணவர் கற்றல், மொழி உதவி, தொடர்பு, கல்வி மற்றும் அறிவுப் பகிர்வை ஆராயுங்கள்.' },
    interests: ['teaching', 'communication', 'design', 'helping'], strengths: ['communication', 'patient', 'organizing', 'creative'], goals: ['higherStudy', 'employment', 'skillCertificate'],
    stages: ['std9_10', 'std11_12', 'diploma_iti', 'undergraduate', 'graduate'],
    why: { en: 'You may enjoy helping others understand an idea and making information easier to use.', hi: 'आपको दूसरों को विचार समझाने और जानकारी को सरल बनाने में आनंद आ सकता है।', ta: 'கருத்துகளை மற்றவர்கள் புரிந்துகொள்ள உதவுவதும் தகவலை எளிமைப்படுத்துவதும் உங்களுக்கு பிடிக்கலாம்.' },
    steps: {
      en: [
        { title: 'Explain one thing clearly', detail: 'Create a short explanation, glossary, audio note or peer-study guide on a topic you know.', kind: 'Practice' },
        { title: 'Learn facilitation basics', detail: 'Practice listening, checking understanding, giving respectful feedback and protecting learners’ privacy.', kind: 'Learn' },
        { title: 'Review formal requirements', detail: 'Teacher, translator and education roles can have specific qualifications; confirm current rules before planning a route.', kind: 'Check' },
      ],
      hi: [
        { title: 'एक बात स्पष्ट समझाएँ', detail: 'अपने परिचित विषय पर छोटा विवरण, शब्दावली, ऑडियो नोट या सहपाठी अध्ययन मार्गदर्शिका बनाएँ।', kind: 'अभ्यास' },
        { title: 'मार्गदर्शन की बुनियाद सीखें', detail: 'ध्यान से सुनना, समझ जाँचना, सम्मानजनक प्रतिक्रिया देना और गोपनीयता सुरक्षित रखना सीखें।', kind: 'सीखें' },
        { title: 'औपचारिक शर्तें जाँचें', detail: 'शिक्षण, अनुवाद और शिक्षा भूमिकाओं के लिए योग्यता चाहिए हो सकती है; योजना से पहले मौजूदा नियम जाँचें।', kind: 'जाँचें' },
      ],
      ta: [
        { title: 'ஒரு விஷயத்தை தெளிவாக விளக்குங்கள்', detail: 'உங்களுக்குத் தெரிந்த தலைப்பில் குறுகிய விளக்கம், சொற்களஞ்சியம், ஒலி குறிப்பு அல்லது சக மாணவர் வழிகாட்டியை உருவாக்குங்கள்.', kind: 'பயிற்சி' },
        { title: 'வழிகாட்டல் அடிப்படைகளை கற்றுக்கொள்ளுங்கள்', detail: 'கவனமாகக் கேட்பது, புரிதலைச் சரிபார்ப்பது, மரியாதையான கருத்து மற்றும் கற்றவர்களின் தனியுரிமையைப் பாதுகாப்பதைப் பயிற்சி செய்யுங்கள்.', kind: 'கற்றல்' },
        { title: 'முறையான தகுதிகளைச் சரிபார்க்கவும்', detail: 'ஆசிரியர், மொழிபெயர்ப்பாளர் மற்றும் கல்விப் பணிகளுக்கு குறிப்பிட்ட தகுதிகள் தேவைப்படலாம்; தற்போதைய விதிகளைச் சரிபார்க்கவும்.', kind: 'சரிபார்ப்பு' },
      ],
    },
    resources: [{ title: 'DIKSHA', url: 'https://diksha.gov.in/', note: 'Explore learning materials and educator resources.' }],
    caution: { en: 'Formal teaching or translation roles may require qualifications, training or screening; verify the current rules.', hi: 'औपचारिक शिक्षण या अनुवाद में योग्यता, प्रशिक्षण या जाँच आवश्यक हो सकती है। मौजूदा नियम जाँचें।', ta: 'முறையான கற்பித்தல் அல்லது மொழிபெயர்ப்பு பணிகளுக்கு தகுதி, பயிற்சி அல்லது சரிபார்ப்பு தேவைப்படலாம்.' },
  },
];

export const INTEREST_OPTIONS = [
  { id: 'handsOn', icon: 'tool', labels: { en: 'Making, fixing or building', hi: 'बनाना, सुधारना या जोड़ना', ta: 'உருவாக்கம், பழுது பார்த்தல் அல்லது கட்டுதல்' } },
  { id: 'technology', icon: 'laptop', labels: { en: 'Computers and technology', hi: 'कंप्यूटर और तकनीक', ta: 'கணினி மற்றும் தொழில்நுட்பம்' } },
  { id: 'design', icon: 'palette', labels: { en: 'Art, design and creativity', hi: 'कला, डिज़ाइन और रचनात्मकता', ta: 'கலை, வடிவமைப்பு மற்றும் படைப்பாற்றல்' } },
  { id: 'helping', icon: 'heart', labels: { en: 'Helping people', hi: 'लोगों की मदद', ta: 'மக்களுக்கு உதவுதல்' } },
  { id: 'nature', icon: 'sprout', labels: { en: 'Nature, farming and environment', hi: 'प्रकृति, खेती और पर्यावरण', ta: 'இயற்கை, விவசாயம் மற்றும் சுற்றுச்சூழல்' } },
  { id: 'numbers', icon: 'chart', labels: { en: 'Numbers and patterns', hi: 'संख्याएँ और पैटर्न', ta: 'எண்கள் மற்றும் வடிவங்கள்' } },
  { id: 'communication', icon: 'message', labels: { en: 'Speaking, writing and media', hi: 'बोलना, लिखना और मीडिया', ta: 'பேசுதல், எழுதுதல் மற்றும் ஊடகம்' } },
  { id: 'business', icon: 'briefcase', labels: { en: 'Business and entrepreneurship', hi: 'व्यवसाय और उद्यमिता', ta: 'வணிகம் மற்றும் தொழில்முனைவு' } },
  { id: 'teaching', icon: 'book', labels: { en: 'Teaching and explaining', hi: 'सिखाना और समझाना', ta: 'கற்பித்தல் மற்றும் விளக்குதல்' } },
  { id: 'science', icon: 'flask', labels: { en: 'Science and discovery', hi: 'विज्ञान और खोज', ta: 'அறிவியல் மற்றும் கண்டுபிடிப்பு' } },
  { id: 'notSure', icon: 'message', labels: { en: 'I am not sure yet', hi: 'अभी तय नहीं', ta: 'இன்னும் உறுதியாகத் தெரியவில்லை' } },
];

export const STRENGTH_OPTIONS = [
  { id: 'problemSolving', labels: { en: 'Solving problems', hi: 'समस्याएँ हल करना', ta: 'சிக்கல்களைத் தீர்த்தல்' } },
  { id: 'creative', labels: { en: 'Imagining and creating', hi: 'कल्पना और रचना', ta: 'கற்பனை செய்து உருவாக்குதல்' } },
  { id: 'communication', labels: { en: 'Explaining ideas', hi: 'विचार समझाना', ta: 'கருத்துகளை விளக்குதல்' } },
  { id: 'caring', labels: { en: 'Noticing how others feel', hi: 'दूसरों की भावनाएँ समझना', ta: 'மற்றவர்களின் உணர்வுகளை கவனித்தல்' } },
  { id: 'organizing', labels: { en: 'Planning and organising', hi: 'योजना और व्यवस्था', ta: 'திட்டமிடல் மற்றும் ஒழுங்கமைப்பு' } },
  { id: 'practical', labels: { en: 'Learning by doing', hi: 'करके सीखना', ta: 'செய்து கற்றல்' } },
  { id: 'analytical', labels: { en: 'Finding patterns in information', hi: 'जानकारी में पैटर्न ढूँढना', ta: 'தகவலில் வடிவங்களை கண்டறிதல்' } },
  { id: 'patient', labels: { en: 'Being patient and careful', hi: 'धैर्य और सावधानी', ta: 'பொறுமை மற்றும் கவனம்' } },
];

export const GOAL_OPTIONS = [
  { id: 'higherStudy', labels: { en: 'Continue studying', hi: 'आगे पढ़ाई करना', ta: 'மேலும் படித்தல்' } },
  { id: 'employment', labels: { en: 'Prepare for work', hi: 'काम के लिए तैयारी', ta: 'வேலைக்குத் தயாராகுதல்' } },
  { id: 'skillCertificate', labels: { en: 'Learn a practical skill', hi: 'व्यावहारिक कौशल सीखना', ta: 'செய்முறைத் திறன் கற்றல்' } },
  { id: 'examPreparation', labels: { en: 'Explore exams', hi: 'परीक्षाओं को जानना', ta: 'தேர்வுகளை ஆராய்தல்' } },
  { id: 'entrepreneurship', labels: { en: 'Explore self-employment', hi: 'स्वरोज़गार जानना', ta: 'சுயதொழிலை ஆராய்தல்' } },
  { id: 'notSure', labels: { en: 'I am not sure yet', hi: 'अभी तय नहीं', ta: 'இன்னும் உறுதியாகத் தெரியவில்லை' } },
];

export const STAGE_OPTIONS = [
  { id: 'std9_10', labels: { en: 'Class 9–10', hi: 'कक्षा 9–10', ta: 'வகுப்பு 9–10' } },
  { id: 'std11_12', labels: { en: 'Class 11–12', hi: 'कक्षा 11–12', ta: 'வகுப்பு 11–12' } },
  { id: 'diploma_iti', labels: { en: 'Diploma / ITI / vocational', hi: 'डिप्लोमा / ITI / व्यावसायिक', ta: 'டிப்ளமோ / ITI / தொழிற்பயிற்சி' } },
  { id: 'undergraduate', labels: { en: 'Undergraduate', hi: 'स्नातक विद्यार्थी', ta: 'இளங்கலை மாணவர்' } },
  { id: 'graduate', labels: { en: 'Graduate', hi: 'स्नातक पूरा', ta: 'பட்டம் முடித்தவர்' } },
];

export const STATE_OPTIONS = [
  { id: 'andhra-pradesh', labels: { en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश', ta: 'ஆந்திரப் பிரதேசம்' } },
  { id: 'arunachal-pradesh', labels: { en: 'Arunachal Pradesh', hi: 'अरुणाचल प्रदेश', ta: 'அருணாசலப் பிரதேசம்' } },
  { id: 'assam', labels: { en: 'Assam', hi: 'असम', ta: 'அசாம்' } },
  { id: 'bihar', labels: { en: 'Bihar', hi: 'बिहार', ta: 'பீகார்' } },
  { id: 'chhattisgarh', labels: { en: 'Chhattisgarh', hi: 'छत्तीसगढ़', ta: 'சத்தீஸ்கர்' } },
  { id: 'goa', labels: { en: 'Goa', hi: 'गोवा', ta: 'கோவா' } },
  { id: 'gujarat', labels: { en: 'Gujarat', hi: 'गुजरात', ta: 'குஜராத்' } },
  { id: 'haryana', labels: { en: 'Haryana', hi: 'हरियाणा', ta: 'ஹரியானா' } },
  { id: 'himachal-pradesh', labels: { en: 'Himachal Pradesh', hi: 'हिमाचल प्रदेश', ta: 'இமாச்சலப் பிரதேசம்' } },
  { id: 'jharkhand', labels: { en: 'Jharkhand', hi: 'झारखंड', ta: 'ஜார்க்கண்ட்' } },
  { id: 'karnataka', labels: { en: 'Karnataka', hi: 'कर्नाटक', ta: 'கர்நாடகா' } },
  { id: 'kerala', labels: { en: 'Kerala', hi: 'केरल', ta: 'கேரளா' } },
  { id: 'madhya-pradesh', labels: { en: 'Madhya Pradesh', hi: 'मध्य प्रदेश', ta: 'மத்தியப் பிரதேசம்' } },
  { id: 'maharashtra', labels: { en: 'Maharashtra', hi: 'महाराष्ट्र', ta: 'மகாராஷ்டிரா' } },
  { id: 'manipur', labels: { en: 'Manipur', hi: 'मणिपुर', ta: 'மணிப்பூர்' } },
  { id: 'meghalaya', labels: { en: 'Meghalaya', hi: 'मेघालय', ta: 'மேகாலயா' } },
  { id: 'mizoram', labels: { en: 'Mizoram', hi: 'मिज़ोरम', ta: 'மிசோரம்' } },
  { id: 'nagaland', labels: { en: 'Nagaland', hi: 'नागालैंड', ta: 'நாகாலாந்து' } },
  { id: 'odisha', labels: { en: 'Odisha', hi: 'ओडिशा', ta: 'ஒடிசா' } },
  { id: 'punjab', labels: { en: 'Punjab', hi: 'पंजाब', ta: 'பஞ்சாப்' } },
  { id: 'rajasthan', labels: { en: 'Rajasthan', hi: 'राजस्थान', ta: 'ராஜஸ்தான்' } },
  { id: 'sikkim', labels: { en: 'Sikkim', hi: 'सिक्किम', ta: 'சிக்கிம்' } },
  { id: 'tamil-nadu', labels: { en: 'Tamil Nadu', hi: 'तमिलनाडु', ta: 'தமிழ்நாடு' } },
  { id: 'telangana', labels: { en: 'Telangana', hi: 'तेलंगाना', ta: 'தெலங்கானா' } },
  { id: 'tripura', labels: { en: 'Tripura', hi: 'त्रिपुरा', ta: 'திரிபுரா' } },
  { id: 'uttar-pradesh', labels: { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', ta: 'உத்தரப் பிரதேசம்' } },
  { id: 'uttarakhand', labels: { en: 'Uttarakhand', hi: 'उत्तराखंड', ta: 'உத்தரகாண்ட்' } },
  { id: 'west-bengal', labels: { en: 'West Bengal', hi: 'पश्चिम बंगाल', ta: 'மேற்கு வங்காளம்' } },
  { id: 'andaman-nicobar', labels: { en: 'Andaman and Nicobar Islands', hi: 'अंडमान और निकोबार द्वीपसमूह', ta: 'அந்தமான் நிக்கோபார் தீவுகள்' } },
  { id: 'chandigarh', labels: { en: 'Chandigarh', hi: 'चंडीगढ़', ta: 'சண்டிகர்' } },
  { id: 'dadra-nagar-haveli-daman-diu', labels: { en: 'Dadra and Nagar Haveli and Daman and Diu', hi: 'दादरा और नगर हवेली तथा दमन और दीव', ta: 'தாத்ரா நகர் ஹவேலி மற்றும் டாமன் டையூ' } },
  { id: 'delhi', labels: { en: 'Delhi', hi: 'दिल्ली', ta: 'டெல்லி' } },
  { id: 'jammu-kashmir', labels: { en: 'Jammu and Kashmir', hi: 'जम्मू और कश्मीर', ta: 'ஜம்மு காஷ்மீர்' } },
  { id: 'ladakh', labels: { en: 'Ladakh', hi: 'लद्दाख', ta: 'லடாக்' } },
  { id: 'lakshadweep', labels: { en: 'Lakshadweep', hi: 'लक्षद्वीप', ta: 'லட்சத்தீவு' } },
  { id: 'puducherry', labels: { en: 'Puducherry', hi: 'पुदुचेरी', ta: 'புதுச்சேரி' } },
];

export const UI_TEXT = {
  en: {
    eyebrow: 'YOUR PATHWAY, YOUR CHOICE', title: 'Build a learning path that starts with you.', intro: 'A few thoughtful choices can help you explore possibilities. There are no right or wrong answers, and you can change your answers any time.',
    start: 'Start my pathway', steps: ['Welcome', 'Your stage', 'What feels like you', 'Explore pathways', 'A practical next step'],
    stageTitle: 'Where are you in your learning journey?', stageHint: 'Choose the closest option. It is used to shape suggestions, not judge your ability.', language: 'Preferred language', state: 'State or union territory (optional)', statePlaceholder: 'Choose a state or UT (optional)', stateHint: 'Only a broad region. Do not enter your village, address or contact information.', next: 'Continue', back: 'Back',
    signalsTitle: 'What would you like to explore?', signalsIntro: 'Choose a few interests, strengths and goals. “Not sure yet” is always okay—this prototype starts with what you select.', interests: 'I am curious about', strengths: 'Things I may be good at', goals: 'What I want to explore next',
    generate: 'Explore my pathways', generating: 'Building ideas…', noSelections: 'Choose at least one interest and one goal so the suggestions have something to start from.',
    resultsTitle: 'Several paths can fit the same person.', resultsIntro: 'These are explainable starting points based on your choices—not a test, diagnosis or prediction of success.', fit: 'Choice alignment', why: 'Why this appears', explore: 'Explore this path', revise: 'Change my answers', offline: 'Using on-device matching. You can still explore without a network.', localSaved: 'Your selected profile is saved on this device only.', serverSaved: 'You opted in to temporary demo-service processing. The backend stores this profile in memory for up to 30 minutes; it is not an account.', serverUnavailable: 'The demo service was unreachable. Your choices stayed on this device and local pathway suggestions are shown.',
    shareLabel: 'Optional: allow the demo service to process these choices for pathway matching.', shareHint: 'Keep this off to use local matching only. This is a prototype choice, not legal consent. Do not enter sensitive or identifying details.',
    clear: 'Clear my local profile', cleared: 'Local profile cleared from this device.', clearFailed: 'The browser could not confirm that every local copy was removed. Retry clearing this profile and review browser site-data settings if the issue persists.',
    planTitle: 'Turn curiosity into a next step.', planIntro: 'Use this as a discussion starter with a teacher, facilitator or trusted adult. Verify programme details before enrolling or spending money.', milestones: 'A short learning plan', resources: 'Places to explore', important: 'Before you act', findOpps: 'Find related opportunities', savePlan: 'Save this pathway on this device', savedPlan: 'Pathway saved on this device.', selected: 'Selected pathway', backToResults: 'Back to pathway ideas',
    networkNotice: 'Designed for intermittent internet. The question flow and starter catalogue work locally; live sources and server matching need a connection.', noProfile: 'No profile has been saved on this device.', offlinePlan: 'This plan is from a local starter catalogue. Resource links may need internet and are not proof that a course is open.',
    source: 'Open source', localOnly: 'Local-only', processing: 'Trying demo service…', storageUnavailable: 'The browser could not save these choices. You can continue exploring, but keep this tab open and do not assume the profile is saved.', languageNote: 'The UI labels are localised; some external course pages may be available only in other languages.', localSessionFallback: 'Durable browser storage is unavailable. Keep this tab open; these choices may be lost when the session ends.',
  },
  hi: {
    eyebrow: 'आपका रास्ता, आपकी पसंद', title: 'अपनी पसंद से सीखने का रास्ता बनाएँ।', intro: 'कुछ सोच-समझकर चुने गए विकल्प संभावनाएँ खोजने में मदद कर सकते हैं। सही या गलत जवाब नहीं हैं; आप कभी भी बदल सकते हैं।',
    start: 'अपना रास्ता शुरू करें', steps: ['स्वागत', 'आपका स्तर', 'आपकी रुचियाँ', 'संभावित रास्ते', 'अगला व्यावहारिक कदम'],
    stageTitle: 'आप अभी किस चरण में हैं?', stageHint: 'सबसे नज़दीकी विकल्प चुनें। यह सुझावों के लिए है, आपकी क्षमता को परखने के लिए नहीं।', language: 'पसंदीदा भाषा', state: 'राज्य या केंद्र शासित प्रदेश (वैकल्पिक)', statePlaceholder: 'राज्य या केंद्र शासित प्रदेश चुनें (वैकल्पिक)', stateHint: 'केवल सामान्य क्षेत्र। गाँव, पता या संपर्क जानकारी न लिखें।', next: 'आगे बढ़ें', back: 'वापस',
    signalsTitle: 'आप क्या जानना चाहेंगे?', signalsIntro: 'कुछ रुचियाँ, खूबियाँ और लक्ष्य चुनें। “अभी तय नहीं” भी ठीक है—सुझाव आपकी पसंद से शुरू होते हैं।', interests: 'मुझे रुचि है', strengths: 'मेरी संभावित खूबियाँ', goals: 'मैं आगे यह जानना चाहता/चाहती हूँ',
    generate: 'मेरे संभावित रास्ते देखें', generating: 'विकल्प तैयार हो रहे हैं…', noSelections: 'शुरुआत के लिए कम से कम एक रुचि और एक लक्ष्य चुनें।',
    resultsTitle: 'एक व्यक्ति के लिए कई रास्ते उपयुक्त हो सकते हैं।', resultsIntro: 'ये आपकी पसंद पर आधारित शुरुआती सुझाव हैं—परीक्षा, निदान या सफलता की भविष्यवाणी नहीं।', fit: 'पसंद से मेल', why: 'यह सुझाव क्यों दिख रहा है', explore: 'यह रास्ता देखें', revise: 'जवाब बदलें', offline: 'डिवाइस पर उपलब्ध मिलान का उपयोग हो रहा है। इंटरनेट बिना भी रास्ते देख सकते हैं।', localSaved: 'आपकी पसंद केवल इस डिवाइस पर सहेजी गई है।', serverSaved: 'आपने अस्थायी डेमो सेवा को चुना है। प्रोफ़ाइल अधिकतम 30 मिनट तक केवल मेमोरी में रखी जाती है; यह खाता नहीं है।', serverUnavailable: 'डेमो सेवा उपलब्ध नहीं थी। आपकी पसंद डिवाइस पर रही और स्थानीय सुझाव दिख रहे हैं।',
    shareLabel: 'वैकल्पिक: डेमो सेवा को इन विकल्पों से रास्ते सुझाने की अनुमति दें।', shareHint: 'इसे बंद रखें तो सभी मिलान स्थानीय होंगे। यह प्रोटोटाइप विकल्प कानूनी सहमति नहीं है। संवेदनशील जानकारी न दें।',
    clear: 'इस डिवाइस से प्रोफ़ाइल हटाएँ', cleared: 'स्थानीय प्रोफ़ाइल हटा दी गई।', clearFailed: 'ब्राउज़र सभी स्थानीय प्रतियाँ हटाने की पुष्टि नहीं कर पाया। फिर से प्रयास करें; समस्या बनी रहे तो ब्राउज़र साइट-डेटा सेटिंग देखें।',
    planTitle: 'रुचि को अगले कदम में बदलें।', planIntro: 'इसे शिक्षक, मार्गदर्शक या विश्वसनीय वयस्क के साथ चर्चा की शुरुआत मानें। दाख़िला लेने या पैसा खर्च करने से पहले विवरण जाँचें।', milestones: 'छोटी सीखने की योजना', resources: 'जानने के स्थान', important: 'कदम उठाने से पहले', findOpps: 'संबंधित अवसर खोजें', savePlan: 'यह रास्ता इस डिवाइस पर सहेजें', savedPlan: 'रास्ता इस डिवाइस पर सहेजा गया।', selected: 'चुना गया रास्ता', backToResults: 'रास्तों पर वापस जाएँ',
    networkNotice: 'कमज़ोर इंटरनेट को ध्यान में रखकर बनाया गया। प्रश्न और शुरुआती सूची स्थानीय रूप से काम करते हैं; लाइव स्रोत और सर्वर मिलान के लिए कनेक्शन चाहिए।', noProfile: 'इस डिवाइस पर कोई प्रोफ़ाइल सहेजी नहीं गई है।', offlinePlan: 'यह योजना स्थानीय शुरुआती सूची से है। लिंक के लिए इंटरनेट लग सकता है और उनसे यह साबित नहीं होता कि कोर्स खुला है।',
    source: 'स्रोत खोलें', localOnly: 'केवल डिवाइस', processing: 'डेमो सेवा आज़माई जा रही है…', storageUnavailable: 'ब्राउज़र इन विकल्पों को सहेज नहीं पाया। आप आगे बढ़ सकते हैं, लेकिन टैब खुला रखें और प्रोफ़ाइल के सहेजे होने का भरोसा न मानें।', languageNote: 'स्क्रीन के शब्द स्थानीय भाषा में हैं; कुछ बाहरी पाठ्यक्रम पृष्ठ दूसरी भाषा में हो सकते हैं।', localSessionFallback: 'ब्राउज़र में स्थायी स्थानीय संग्रह उपलब्ध नहीं है। इस टैब को खुला रखें; सत्र समाप्त होने पर विकल्प खो सकते हैं।',
  },
  ta: {
    eyebrow: 'உங்கள் பாதை, உங்கள் தேர்வு', title: 'உங்களிலிருந்து தொடங்கும் கற்றல் பாதையை உருவாக்குங்கள்.', intro: 'சில சிந்தனைமிக்க தேர்வுகள் வாய்ப்புகளை ஆராய உதவும். சரி/தவறு பதில்கள் இல்லை; எப்போது வேண்டுமானாலும் மாற்றலாம்.',
    start: 'என் பாதையைத் தொடங்குங்கள்', steps: ['வரவேற்பு', 'கற்றல் நிலை', 'உங்கள் ஆர்வங்கள்', 'பாதை வாய்ப்புகள்', 'அடுத்த நடைமுறை படி'],
    stageTitle: 'உங்கள் கற்றல் பயணம் எந்த நிலையில் உள்ளது?', stageHint: 'உங்களுக்கு நெருக்கமானதைத் தேர்ந்தெடுக்கவும். இது பரிந்துரைகளுக்காக மட்டுமே; திறனை மதிப்பிடாது.', language: 'விருப்ப மொழி', state: 'மாநிலம் / யூனியன் பிரதேசம் (விருப்பம்)', statePlaceholder: 'மாநிலம் அல்லது யூனியன் பிரதேசத்தைத் தேர்ந்தெடுக்கவும் (விருப்பம்)', stateHint: 'பொதுவான பகுதி மட்டும். கிராமம், முகவரி அல்லது தொடர்பு விவரங்களை உள்ளிட வேண்டாம்.', next: 'தொடரவும்', back: 'பின்செல்',
    signalsTitle: 'நீங்கள் எதை ஆராய விரும்புகிறீர்கள்?', signalsIntro: 'சில ஆர்வங்கள், திறன்கள் மற்றும் இலக்குகளைத் தேர்ந்தெடுக்கவும். “இன்னும் தெரியவில்லை” என்பதும் சரிதான்.', interests: 'எனக்கு ஆர்வம்', strengths: 'எனக்கு இருக்கக்கூடிய திறன்கள்', goals: 'அடுத்து நான் ஆராய விரும்புவது',
    generate: 'என் பாதைகளை ஆராயுங்கள்', generating: 'விருப்பங்கள் உருவாகின்றன…', noSelections: 'தொடங்க குறைந்தது ஒரு ஆர்வமும் ஒரு இலக்கும் தேர்ந்தெடுக்கவும்.',
    resultsTitle: 'ஒரே நபருக்குப் பல பாதைகள் பொருந்தலாம்.', resultsIntro: 'இவை உங்கள் தேர்வுகளை அடிப்படையாகக் கொண்ட தொடக்க யோசனைகள் மட்டுமே; மதிப்பீடு அல்லது வெற்றி கணிப்பு அல்ல.', fit: 'தேர்வு பொருத்தம்', why: 'இந்த பரிந்துரை ஏன்', explore: 'இந்த பாதையை ஆராயுங்கள்', revise: 'என் பதில்களை மாற்றுங்கள்', offline: 'சாதனத்தில் உள்ள பொருத்தத்தைப் பயன்படுத்துகிறோம். இணையமின்றியும் ஆராயலாம்.', localSaved: 'உங்கள் தேர்வுகள் இந்தச் சாதனத்தில் மட்டுமே சேமிக்கப்பட்டுள்ளன.', serverSaved: 'தற்காலிக டெமோ சேவையைத் தேர்ந்தெடுத்துள்ளீர்கள். சுயவிவரம் 30 நிமிடங்கள் வரை நினைவகத்தில் இருக்கும்; இது கணக்கு அல்ல.', serverUnavailable: 'டெமோ சேவை கிடைக்கவில்லை. உங்கள் தேர்வுகள் சாதனத்திலேயே உள்ளன; உள்ளூர் பரிந்துரைகள் காட்டப்படுகின்றன.',
    shareLabel: 'விருப்பம்: இந்தத் தேர்வுகளை டெமோ சேவை செயலாக்க அனுமதிக்கவும்.', shareHint: 'இதனை அணைத்தால் உள்ளூர் பொருத்தம் மட்டுமே பயன்படுத்தப்படும். இது சட்டப்பூர்வ சம்மதம் அல்ல; உணர்வுப்பூர்வத் தகவல்களை உள்ளிட வேண்டாம்.',
    clear: 'இந்தச் சாதனத்திலிருந்து சுயவிவரத்தை அழிக்கவும்', cleared: 'உள்ளூர் சுயவிவரம் அழிக்கப்பட்டது.', clearFailed: 'உலாவியால் எல்லா உள்ளூர் நகல்களும் அகற்றப்பட்டதை உறுதிப்படுத்த முடியவில்லை. மீண்டும் முயற்சிக்கவும்; பிரச்சினை நீடித்தால் தளத் தரவு அமைப்புகளைப் பார்க்கவும்.',
    planTitle: 'ஆர்வத்தை அடுத்த படியாக மாற்றுங்கள்.', planIntro: 'இதனை ஆசிரியர், வழிகாட்டி அல்லது நம்பகமான பெரியவருடன் பேசுவதற்கான தொடக்கமாகப் பயன்படுத்துங்கள். சேர்வதற்கு அல்லது பணம் செலவிடுவதற்கு முன் விவரங்களைச் சரிபார்க்கவும்.', milestones: 'சிறிய கற்றல் திட்டம்', resources: 'ஆராய வேண்டிய இடங்கள்', important: 'செயல்படுவதற்கு முன்', findOpps: 'தொடர்புடைய வாய்ப்புகளைக் காணுங்கள்', savePlan: 'இந்தப் பாதையைச் சாதனத்தில் சேமிக்கவும்', savedPlan: 'பாதை சாதனத்தில் சேமிக்கப்பட்டது.',
    selected: 'தேர்ந்தெடுத்த பாதை', backToResults: 'பாதை யோசனைகளுக்குத் திரும்புங்கள்', networkNotice: 'குறைந்த இணையத்திற்காக வடிவமைக்கப்பட்டது. கேள்விகள் மற்றும் தொடக்கப் பட்டியல் உள்ளூரில் இயங்கும்; நேரடி மூலங்களுக்கும் சர்வர் பொருத்தத்திற்கும் இணைப்பு தேவை.', noProfile: 'இந்தச் சாதனத்தில் சுயவிவரம் சேமிக்கப்படவில்லை.', offlinePlan: 'இந்தத் திட்டம் உள்ளூர் தொடக்கப் பட்டியலிலிருந்து வருகிறது. இணைப்புகளுக்கு இணையம் தேவைப்படலாம்; பாடநெறி திறந்திருப்பதை அவை உறுதி செய்யாது.',
    source: 'மூலத்தைத் திறக்கவும்', localOnly: 'சாதனத்தில் மட்டும்', processing: 'டெமோ சேவையை முயற்சிக்கிறோம்…', storageUnavailable: 'உலாவியால் இந்தத் தேர்வுகளைச் சேமிக்க முடியவில்லை. தொடர்ந்து ஆராயலாம்; ஆனால் இந்தத் தாவலைத் திறந்தே வைத்து, சுயவிவரம் சேமிக்கப்பட்டுள்ளது என்று கருத வேண்டாம்.', languageNote: 'திரை உள்ளடக்கம் உள்ளூர் மொழியில் உள்ளது; வெளிப்புற பாடநெறிப் பக்கங்கள் வேறு மொழியில் இருக்கலாம்.', localSessionFallback: 'உலாவியில் நீடித்த உள்ளூர் சேமிப்பு கிடைக்கவில்லை. இந்தத் தாவலைத் திறந்தே வைத்திருக்கவும்; அமர்வு முடிந்தால் தேர்வுகள் இழக்கப்படலாம்.',
  },
};

// Shared copy used by interaction states was separated into one dictionary below to keep
// the pathway catalogue legible. Every key is supplied for EN/HI/TA and checked in tests.
Object.assign(UI_TEXT.en, {
  sidebarAria: 'Pathway steps', sidebarKicker: 'UDAANSETU / PATHWAY', startSmall: 'Start small. Keep your choices open.',
  stepMeta: ['WELCOME', '01 / YOUR CONTEXT', '02 / YOUR SIGNALS', '03 / OPEN POSSIBILITIES', '04 / MAKE IT PRACTICAL'],
  sidebarFoot: 'Choice first. No single career label. No guaranteed outcomes.', welcomeStamp: 'A path, not a label',
  welcomeEyebrow: 'A FEW QUESTIONS · YOUR OWN PACE', welcomeTitle: 'Start with what you know about yourself.',
  welcomeBody: 'Choose your learning stage, the things that interest you, and what you want to explore. We will suggest several directions and show practical next steps.',
  privacyNoIdentity: 'No name or phone number needed', offlineWorks: 'Works with local matching offline', clearAnytime: 'Edit or clear choices anytime', resumeSaved: 'Resume saved path',
  remoteMatched: 'Demo service matched · temporary profile', scoreDisclaimer: 'The alignment score is a transparent rule-based ranking indicator, not a probability or validated aptitude score.',
  smallStepIntro: 'Small, achievable steps to discuss and adapt.', connectedPlan: 'API catalogue + local plan', savedDatePrefix: 'Saved',
  stageGuidanceLabel: 'Guidance for your current stage',
  globalDisclaimer: 'UdaanSetu provides general exploration guidance. It is not an official government service, career assessment, admissions decision or employment guarantee. External sources may change; verify current details with the provider.',
  remoteCleanupPending: 'The temporary server profile could not be deleted immediately. It expires automatically within 30 minutes; retry cleanup when online.', retryCleanup: 'Retry clearing saved data',
});
Object.assign(UI_TEXT.hi, {
  sidebarAria: 'सीखने के रास्ते के चरण', sidebarKicker: 'UDAANSETU / रास्ता', startSmall: 'छोटे कदम से शुरू करें। विकल्प खुले रखें।',
  stepMeta: ['स्वागत', '01 / आपकी स्थिति', '02 / आपकी रुचियाँ', '03 / संभावित रास्ते', '04 / व्यावहारिक कदम'],
  sidebarFoot: 'चुनाव आपका है। कोई एक स्थायी करियर लेबल या परिणाम की गारंटी नहीं।', welcomeStamp: 'एक रास्ता, कोई लेबल नहीं',
  welcomeEyebrow: 'कुछ सवाल · आपकी अपनी गति', welcomeTitle: 'अपने बारे में जो जानते हैं, वहीं से शुरू करें।',
  welcomeBody: 'अपना सीखने का स्तर, रुचियाँ और आगे जानने की बातें चुनें। हम कई दिशाएँ और व्यावहारिक अगले कदम सुझाएँगे।',
  privacyNoIdentity: 'नाम या फोन नंबर की ज़रूरत नहीं', offlineWorks: 'बिना इंटरनेट स्थानीय मिलान काम करता है', clearAnytime: 'विकल्प कभी भी बदलें या हटाएँ', resumeSaved: 'सहेजा रास्ता फिर खोलें',
  remoteMatched: 'डेमो सेवा से मिलान · अस्थायी प्रोफ़ाइल', scoreDisclaimer: 'मेल का अंक नियम-आधारित क्रम दिखाता है; यह संभावना या प्रमाणित योग्यता-मूल्यांकन नहीं है।',
  smallStepIntro: 'छोटे, व्यावहारिक कदम जिन्हें चर्चा के बाद बदला जा सकता है।', connectedPlan: 'API सूची + स्थानीय योजना', savedDatePrefix: 'सहेजा गया',
  stageGuidanceLabel: 'आपके वर्तमान स्तर के लिए सुझाव',
  globalDisclaimer: 'UdaanSetu सामान्य खोज में मदद करता है। यह सरकारी सेवा, करियर मूल्यांकन, प्रवेश निर्णय या नौकरी की गारंटी नहीं है। बाहरी जानकारी बदल सकती है; वर्तमान विवरण प्रदाता से जाँचें।',
  remoteCleanupPending: 'अस्थायी सर्वर प्रोफ़ाइल अभी हट नहीं पाई। यह अधिकतम 30 मिनट में अपने आप समाप्त हो जाती है; इंटरनेट मिलने पर फिर हटाने का प्रयास करें।', retryCleanup: 'सहेजा डेटा हटाने का फिर प्रयास करें',
});
Object.assign(UI_TEXT.ta, {
  sidebarAria: 'கற்றல் பாதை படிகள்', sidebarKicker: 'UDAANSETU / பாதை', startSmall: 'சிறிய படியிலிருந்து தொடங்குங்கள். தேர்வுகளை திறந்தவையாக வைத்திருங்கள்.',
  stepMeta: ['வரவேற்பு', '01 / உங்கள் நிலை', '02 / உங்கள் ஆர்வங்கள்', '03 / திறந்த வாய்ப்புகள்', '04 / நடைமுறை படி'],
  sidebarFoot: 'தேர்வு உங்களுடையது. ஒரே தொழில் அடையாளமோ உறுதியான முடிவோ இல்லை.', welcomeStamp: 'ஒரு பாதை; ஒரு அடையாளம் அல்ல',
  welcomeEyebrow: 'சில கேள்விகள் · உங்கள் வேகத்தில்', welcomeTitle: 'உங்களைப் பற்றி அறிந்தவற்றிலிருந்து தொடங்குங்கள்.',
  welcomeBody: 'உங்கள் கற்றல் நிலை, ஆர்வங்கள் மற்றும் அடுத்து ஆராய விரும்புவதைத் தேர்ந்தெடுக்கவும். பல பாதைகளையும் நடைமுறை அடுத்த படிகளையும் பரிந்துரைப்போம்.',
  privacyNoIdentity: 'பெயர் அல்லது தொலைபேசி எண் தேவையில்லை', offlineWorks: 'இணையமின்றி உள்ளூர் பொருத்தம் செயல்படும்', clearAnytime: 'தேர்வுகளை எப்போது வேண்டுமானாலும் மாற்றலாம் அல்லது அழிக்கலாம்', resumeSaved: 'சேமித்த பாதையைத் தொடருங்கள்',
  remoteMatched: 'டெமோ சேவை பொருத்தம் · தற்காலிக சுயவிவரம்', scoreDisclaimer: 'பொருத்த மதிப்பெண் விதி அடிப்படையிலான வரிசை மட்டும்; இது வாய்ப்பு கணிப்போ சரிபார்க்கப்பட்ட திறன் மதிப்பீடோ அல்ல.',
  smallStepIntro: 'விவாதித்து மாற்றிக்கொள்ளக்கூடிய சிறிய நடைமுறை படிகள்.', connectedPlan: 'API பட்டியல் + உள்ளூர் திட்டம்', savedDatePrefix: 'சேமிக்கப்பட்டது',
  stageGuidanceLabel: 'உங்கள் தற்போதைய நிலைக்கான வழிகாட்டல்',
  globalDisclaimer: 'UdaanSetu பொதுவான வாய்ப்புகளை ஆராய உதவுகிறது. இது அரசு சேவை, தொழில் மதிப்பீடு, சேர்க்கை முடிவு அல்லது வேலை உத்தரவாதம் அல்ல. வெளிப்புற தகவல்கள் மாறலாம்; தற்போதைய விவரங்களை வழங்குநரிடம் சரிபார்க்கவும்.',
  remoteCleanupPending: 'தற்காலிக சர்வர் சுயவிவரத்தை உடனே நீக்க முடியவில்லை. அது 30 நிமிடங்களுக்குள் தானாக காலாவதியாகும்; இணையம் கிடைக்கும்போது மீண்டும் முயற்சிக்கவும்.', retryCleanup: 'சேமித்த தரவை நீக்க மீண்டும் முயற்சிக்கவும்',
});


Object.assign(UI_TEXT, {
  te: Object.assign({}, UI_TEXT.en, {
    eyebrow: 'మీ మార్గం, మీ ఎంపిక', title: 'మీతో ప్రారంభమయ్యే అభ్యాస మార్గాన్ని రూపొందించండి.',
    intro: 'కొన్ని ఆలోచనాత్మక ఎంపికలు కొత్త అవకాశాలను అన్వేషించడంలో సహాయపడతాయి. సరైన లేదా తప్పు సమాధానాలు లేవు; మీరు ఎప్పుడైనా మార్చుకోవచ్చు.',
    start: 'నా అభ్యాస మార్గాన్ని ప్రారంభించండి', steps: ['స్వాగతం', 'మీ విద్యా దశ', 'మీ ఆసక్తులు', 'సంభావ్య మార్గాలు', 'తదుపరి ఆచరణాత్మక అడుగు'],
    stageTitle: 'మీరు ప్రస్తుతం ఏ విద్యా దశలో ఉన్నారు?', stageHint: 'మీకు దగ్గరగా ఉన్న ఎంపికను ఎంచుకోండి. ఇది సూచనల కోసం మాత్రమే; మీ సామర్థ్యాన్ని నిర్ణయించదు.',
    language: 'ప్రాధాన్య భాష', state: 'రాష్ట్రం లేదా కేంద్రపాలిత ప్రాంతం (ఐచ్ఛికం)', statePlaceholder: 'రాష్ట్రం / కేంద్రపాలిత ప్రాంతాన్ని ఎంచుకోండి (ఐచ్ఛికం)',
    stateHint: 'సాధారణ ప్రాంతం మాత్రమే. గ్రామం, చిరునామా లేదా సంప్రదింపు వివరాలను నమోదు చేయవద్దు.', next: 'కొనసాగించండి', back: 'వెనుకకు',
    signalsTitle: 'మీరు ఏమి అన్వేషించాలనుకుంటున్నారు?', signalsIntro: 'కొన్ని ఆసక్తులు, బలాలు మరియు లక్ష్యాలను ఎంచుకోండి. “ఇంకా తెలియదు” అన్నదీ సరే.',
    interests: 'నాకు ఆసక్తి ఉన్నవి', strengths: 'నాకు ఉండవచ్చని అనిపించే బలాలు', goals: 'తర్వాత నేను అన్వేషించాలనుకునేది',
    generate: 'నా మార్గాలను అన్వేషించండి', generating: 'ఎంపికలను సిద్ధం చేస్తున్నాం…', noSelections: 'ప్రారంభించడానికి కనీసం ఒక ఆసక్తి మరియు ఒక లక్ష్యాన్ని ఎంచుకోండి.',
    resultsTitle: 'ఒక వ్యక్తికి అనేక మార్గాలు సరిపోవచ్చు.', resultsIntro: 'ఇవి మీ ఎంపికల ఆధారంగా ఇచ్చే ప్రారంభ ఆలోచనలు మాత్రమే; పరీక్ష, నిర్ధారణ లేదా విజయ అంచనా కాదు.',
    fit: 'ఎంపికల సరిపోలిక', why: 'ఈ సూచన ఎందుకు కనిపిస్తోంది', explore: 'ఈ మార్గాన్ని చూడండి', revise: 'నా సమాధానాలను మార్చండి',
    offline: 'పరికరంలోనే సరిపోలిక జరుగుతుంది. ఇంటర్నెట్ లేకున్నా అన్వేషించవచ్చు.', localSaved: 'మీ ఎంపికలు ఈ పరికరంలో మాత్రమే భద్రపరచబడ్డాయి.',
    serverSaved: 'తాత్కాలిక డెమో సేవను మీరు అనుమతించారు. ప్రొఫైల్ గరిష్ఠంగా 30 నిమిషాలు మెమరీలో ఉంటుంది; ఇది ఖాతా కాదు.',
    serverUnavailable: 'డెమో సేవ అందుబాటులో లేదు. మీ ఎంపికలు పరికరంలోనే ఉన్నాయి; స్థానిక సూచనలు చూపబడుతున్నాయి.',
    shareLabel: 'ఐచ్ఛికం: ఈ ఎంపికలను మార్గ సూచనల కోసం డెమో సేవ ప్రాసెస్ చేయడానికి అనుమతించండి.',
    shareHint: 'దీనిని ఆఫ్‌లో ఉంచితే స్థానిక సరిపోలిక మాత్రమే ఉపయోగించబడుతుంది. ఇది చట్టపరమైన సమ్మతి కాదు. సున్నితమైన లేదా గుర్తింపు వివరాలు ఇవ్వవద్దు.',
    clear: 'ఈ పరికరంలోని ప్రొఫైల్‌ను తొలగించండి', cleared: 'స్థానిక ప్రొఫైల్ తొలగించబడింది.',
    clearFailed: 'బ్రౌజర్ అన్ని స్థానిక కాపీలు తొలగినట్లు నిర్ధారించలేకపోయింది. మళ్లీ ప్రయత్నించండి; సమస్య కొనసాగితే బ్రౌజర్ సైట్-డేటా సెట్టింగ్‌లను పరిశీలించండి.',
    planTitle: 'ఆసక్తిని తదుపరి అడుగుగా మార్చండి.', planIntro: 'దీనిని ఉపాధ్యాయుడు, మార్గదర్శి లేదా విశ్వసనీయ పెద్దవారితో చర్చ ప్రారంభంగా ఉపయోగించండి. చేరే ముందు లేదా డబ్బు ఖర్చు చేసే ముందు వివరాలు నిర్ధారించండి.',
    milestones: 'చిన్న అభ్యాస ప్రణాళిక', resources: 'అన్వేషించడానికి వనరులు', important: 'చర్య తీసుకునే ముందు', findOpps: 'సంబంధిత అవకాశాలను కనుగొనండి',
    savePlan: 'ఈ మార్గాన్ని పరికరంలో సేవ్ చేయండి', savedPlan: 'మార్గం ఈ పరికరంలో సేవ్ చేయబడింది.', selected: 'ఎంచుకున్న మార్గం', backToResults: 'మార్గాల జాబితాకు తిరిగి వెళ్లండి',
    networkNotice: 'అస్థిర ఇంటర్నెట్‌ను దృష్టిలో పెట్టుకుని రూపొందించబడింది. ప్రశ్నలు మరియు ప్రారంభ కేటలాగ్ స్థానికంగా పనిచేస్తాయి; తాజా బాహ్య వనరులు, సర్వర్ సరిపోలికకు కనెక్షన్ అవసరం.',
    noProfile: 'ఈ పరికరంలో ప్రొఫైల్ సేవ్ చేయబడలేదు.', offlinePlan: 'ఈ ప్రణాళిక స్థానిక ప్రారంభ జాబితా నుంచి వచ్చింది. లింకులకు ఇంటర్నెట్ అవసరం కావచ్చు; అవి కోర్సు ప్రస్తుతం అందుబాటులో ఉందని నిరూపించవు.',
    source: 'మూలాన్ని తెరవండి', localOnly: 'పరికరంలో మాత్రమే', processing: 'డెమో సేవను ప్రయత్నిస్తున్నాం…',
    storageUnavailable: 'బ్రౌజర్ ఈ ఎంపికలను సేవ్ చేయలేకపోయింది. కొనసాగించవచ్చు, కానీ ట్యాబ్‌ను తెరిచి ఉంచండి; ప్రొఫైల్ సేవ్ అయిందని భావించవద్దు.',
    languageNote: 'ఇంటర్‌ఫేస్ పదాలు స్థానిక భాషలో ఉంటాయి; కొన్ని బాహ్య కోర్సు పేజీలు ఇతర భాషల్లో మాత్రమే ఉండవచ్చు.',
    localSessionFallback: 'స్థిరమైన బ్రౌజర్ నిల్వ అందుబాటులో లేదు. ఈ ట్యాబ్‌ను తెరిచి ఉంచండి; సెషన్ ముగిసినప్పుడు ఎంపికలు పోవచ్చు.',
    sidebarAria: 'అభ్యాస మార్గ దశలు', sidebarKicker: 'UDAANSETU / అభ్యాస మార్గం', startSmall: 'చిన్న అడుగుతో ప్రారంభించండి. ఎంపికలను తెరిచి ఉంచండి.',
    stepMeta: ['స్వాగతం', '01 / మీ నేపథ్యం', '02 / మీ ఆసక్తులు', '03 / కొత్త అవకాశాలు', '04 / ఆచరణాత్మక అడుగు'],
    sidebarFoot: 'ఎంపిక మీది. ఒకే కెరీర్ గుర్తింపు లేదు; ఫలితాలకు హామీ లేదు.', welcomeStamp: 'ఒక మార్గం; ఒక లేబుల్ కాదు',
    welcomeEyebrow: 'కొన్ని ప్రశ్నలు · మీ వేగంలో', welcomeTitle: 'మీ గురించి మీకు తెలిసిన దానితో ప్రారంభించండి.',
    welcomeBody: 'మీ విద్యా దశ, ఆసక్తులు మరియు తర్వాత అన్వేషించాలనుకునే అంశాలను ఎంచుకోండి. పలు దిశలు, ఆచరణాత్మక తదుపరి అడుగులు సూచిస్తాం.',
    privacyNoIdentity: 'పేరు లేదా ఫోన్ నంబర్ అవసరం లేదు', offlineWorks: 'ఇంటర్నెట్ లేకున్నా స్థానిక సరిపోలిక పనిచేస్తుంది', clearAnytime: 'ఎప్పుడైనా ఎంపికలను మార్చండి లేదా తొలగించండి', resumeSaved: 'సేవ్ చేసిన మార్గాన్ని కొనసాగించండి',
    remoteMatched: 'డెమో సేవ సరిపోల్చింది · తాత్కాలిక ప్రొఫైల్', scoreDisclaimer: 'సరిపోలిక స్కోరు నియమాల ఆధారంగా క్రమాన్ని చూపిస్తుంది; ఇది విజయ సంభావ్యత లేదా ధృవీకరించిన నైపుణ్య అంచనా కాదు.',
    smallStepIntro: 'చర్చించి మార్చుకోగల చిన్న, సాధ్యమైన అడుగులు.', connectedPlan: 'API కేటలాగ్ + స్థానిక ప్రణాళిక', savedDatePrefix: 'సేవ్ చేసినది',
    stageGuidanceLabel: 'మీ ప్రస్తుత విద్యా దశకు సూచనలు',
    globalDisclaimer: 'UdaanSetu సాధారణ అన్వేషణకు సహాయపడుతుంది. ఇది అధికారిక ప్రభుత్వ సేవ, కెరీర్ అంచనా, ప్రవేశ నిర్ణయం లేదా ఉద్యోగ హామీ కాదు. బాహ్య సమాచారం మారవచ్చు; ప్రస్తుత వివరాలను సంబంధిత మూలంలో నిర్ధారించండి.',
    remoteCleanupPending: 'తాత్కాలిక సర్వర్ ప్రొఫైల్ వెంటనే తొలగించబడలేదు. ఇది 30 నిమిషాల్లో స్వయంచాలకంగా గడువు ముగుస్తుంది; ఇంటర్నెట్ అందుబాటులో ఉన్నప్పుడు మళ్లీ ప్రయత్నించండి.', retryCleanup: 'సేవ్ చేసిన డేటాను తొలగించడానికి మళ్లీ ప్రయత్నించండి',
  }),
});

export const STAGE_GUIDANCE = {
  en: {
    std9_10: 'Focus on safe exploration, foundational subjects and supervised mini-projects. You do not need to commit to one career now.',
    std11_12: 'Compare subject choices, prerequisites, exam dates and likely costs with a teacher or counsellor before selecting a route.',
    diploma_iti: 'Map your course or trade to recognized credentials, supervised practice and local options. Verify accreditation and safety before paying or using equipment.',
    undergraduate: 'Compare electives, projects, internships and entrance or competitive exams against current official requirements.',
    graduate: 'Review role eligibility, credentials, apprenticeships, application steps and realistic costs using current official sources.',
  },
  hi: {
    std9_10: 'सुरक्षित खोज, बुनियादी विषयों और शिक्षक की देखरेख में छोटे प्रोजेक्ट पर ध्यान दें। अभी एक करियर चुनना ज़रूरी नहीं है।',
    std11_12: 'रास्ता चुनने से पहले शिक्षक या परामर्शदाता के साथ विषय, पूर्व-आवश्यकताएँ, परीक्षा तिथियाँ और संभावित लागत की तुलना करें।',
    diploma_iti: 'अपने कोर्स या ट्रेड को मान्यता प्राप्त प्रमाणपत्र, देखरेख वाले अभ्यास और स्थानीय विकल्पों से जोड़ें। भुगतान या उपकरण उपयोग से पहले मान्यता और सुरक्षा जाँचें।',
    undergraduate: 'वैकल्पिक विषयों, परियोजनाओं, इंटर्नशिप और प्रवेश/प्रतियोगी परीक्षाओं की वर्तमान आधिकारिक शर्तें देखें।',
    graduate: 'वर्तमान आधिकारिक स्रोतों से नौकरी की पात्रता, प्रमाणपत्र, अप्रेंटिसशिप, आवेदन के चरण और संभावित लागत जाँचें।',
  },
  ta: {
    std9_10: 'பாதுகாப்பான ஆராய்ச்சி, அடிப்படைப் பாடங்கள் மற்றும் ஆசிரியர் மேற்பார்வையிலான சிறிய திட்டங்களில் கவனம் செலுத்துங்கள். இப்போது ஒரே தொழிலைத் தீர்மானிக்க வேண்டியதில்லை.',
    std11_12: 'பாதையைத் தேர்வுசெய்வதற்கு முன் ஆசிரியர் அல்லது ஆலோசகருடன் பாடத் தேர்வு, முன் தகுதிகள், தேர்வு தேதிகள் மற்றும் செலவுகளை ஒப்பிடுங்கள்.',
    diploma_iti: 'உங்கள் படிப்பு அல்லது தொழிற்பயிற்சியை அங்கீகரிக்கப்பட்ட சான்றிதழ்கள், மேற்பார்வையிலான பயிற்சி மற்றும் உள்ளூர் வாய்ப்புகளுடன் இணைத்துப் பாருங்கள். பணம் செலுத்தும் முன் அங்கீகாரம் மற்றும் பாதுகாப்பைச் சரிபார்க்கவும்.',
    undergraduate: 'தேர்வுப் பாடங்கள், திட்டங்கள், பயிற்சிகள் மற்றும் நுழைவு/போட்டித் தேர்வுகளின் தற்போதைய அதிகாரப்பூர்வ தகுதிகளை ஒப்பிடுங்கள்.',
    graduate: 'தற்போதைய அதிகாரப்பூர்வ மூலங்களில் பணித் தகுதி, சான்றிதழ்கள், பயிற்சி வாய்ப்புகள், விண்ணப்பப் படிகள் மற்றும் செலவுகளைச் சரிபார்க்கவும்.',
  },
  te: {
    std9_10: 'సురక్షిత అన్వేషణ, ప్రాథమిక పాఠ్యాంశాలు మరియు ఉపాధ్యాయ పర్యవేక్షణలో చిన్న ప్రాజెక్టులపై దృష్టి పెట్టండి. ఇప్పుడే ఒక కెరీర్‌కు కట్టుబడాల్సిన అవసరం లేదు.',
    std11_12: 'మార్గాన్ని ఎంచుకునే ముందు ఉపాధ్యాయుడితో విషయ ఎంపికలు, అవసరమైన అర్హతలు, పరీక్ష తేదీలు మరియు ఖర్చులను పోల్చండి.',
    diploma_iti: 'మీ కోర్సు లేదా వృత్తి శిక్షణను గుర్తింపు పొందిన అర్హతలు, పర్యవేక్షణలో సాధన మరియు స్థానిక అవకాశాలతో కలపండి. చెల్లించే ముందు గుర్తింపు, భద్రతను నిర్ధారించండి.',
    undergraduate: 'ఎలెక్టివ్‌లు, ప్రాజెక్టులు, ఇంటర్న్‌షిప్‌లు మరియు ప్రవేశ/పోటీ పరీక్షల ప్రస్తుత అధికారిక అర్హతలను పరిశీలించండి.',
    graduate: 'ప్రస్తుత అధికారిక మూలాల ద్వారా ఉద్యోగ అర్హతలు, ధృవపత్రాలు, అప్రెంటిస్‌షిప్‌లు, దరఖాస్తు దశలు మరియు ఖర్చులను నిర్ధారించండి.',
  },
};

const normalize = (value) => Array.isArray(value) ? value : [];
export function matchLocalPathways(profile, limit = 3) {
  const interests = new Set(normalize(profile?.interests));
  const strengths = new Set(normalize(profile?.strengths));
  const goals = new Set(normalize(profile?.goals));
  const stage = profile?.academicStage || 'std9_10';
  const scored = CAREER_PATHWAYS.map((path) => {
    const interestMatches = path.interests.filter((tag) => interests.has(tag));
    const strengthMatches = path.strengths.filter((tag) => strengths.has(tag));
    const goalMatches = path.goals.filter((tag) => goals.has(tag));
    const stageMatches = path.stages.includes(stage);
    let raw = 18 + interestMatches.length * 13 + strengthMatches.length * 11 + goalMatches.length * 6 + (stageMatches ? 7 : 0);
    raw = Math.max(22, Math.min(94, raw));
    const lang = ['en', 'hi', 'ta', 'te'].includes(profile?.preferredLanguage) ? profile.preferredLanguage : 'en';
    const reasons = [];
    if (interestMatches.length) reasons.push(...interestMatches.slice(0, 2).map((id) => localizedOptionLabel(INTEREST_OPTIONS.find((x) => x.id === id), lang) || id));
    if (strengthMatches.length) reasons.push(...strengthMatches.slice(0, 1).map((id) => localizedOptionLabel(STRENGTH_OPTIONS.find((x) => x.id === id), lang) || id));
    const localizedPath = localizeCareerPath(path, lang);
    if (!reasons.length) reasons.push(localizedPath.why[lang] || localizedPath.why.en);
    return { ...localizedPath, relativeFit: raw, matchReasons: reasons.slice(0, 3) };
  }).sort((a, b) => b.relativeFit - a.relativeFit || a.title.en.localeCompare(b.title.en));
  return scored.slice(0, Math.max(1, Math.min(6, limit)));
}

export function buildLocalLearningPlan(pathwayId, language = 'en', academicStage = 'std9_10') {
  const basePath = CAREER_PATHWAYS.find((item) => item.id === pathwayId) || CAREER_PATHWAYS[0];
  const path = localizeCareerPath(basePath, language);
  const lang = ['en', 'hi', 'ta', 'te'].includes(language) ? language : 'en';
  return {
    pathwayId: path.id,
    title: path.title[lang] || path.title.en,
    summary: path.summary[lang] || path.summary.en,
    steps: path.steps[lang] || path.steps.en,
    resources: path.resources,
    caution: path.caution[lang] || path.caution.en,
    sourceNotice: (UI_TEXT[lang] || UI_TEXT.en).offlinePlan,
    stageGuidance: (STAGE_GUIDANCE[lang] || STAGE_GUIDANCE.en)[academicStage] || (STAGE_GUIDANCE[lang] || STAGE_GUIDANCE.en).std9_10,
  };
}

export const PROFILE_SCHEMA_VERSION = 1;
