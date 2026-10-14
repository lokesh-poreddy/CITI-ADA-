/**
 * Curated external education directory for UdaanSetu.
 * The app stores metadata and links only; learning content remains on the publisher's site.
 * Access terms, course availability and language coverage can vary and must be checked at source.
 */
export const RESOURCE_CATEGORIES = [
  { id: 'all', labelKey: 'all' },
  { id: 'coding', labelKey: 'coding' },
  { id: 'school', labelKey: 'school' },
  { id: 'courses', labelKey: 'courses' },
  { id: 'skills', labelKey: 'skills' },
  { id: 'exams', labelKey: 'exams' },
  { id: 'careers', labelKey: 'careers' },
  { id: 'aid', labelKey: 'aid' },
];

export const RESOURCE_CATALOG = [
  {
    id: 'w3schools', title: 'W3Schools', provider: 'W3Schools', url: 'https://www.w3schools.com/', category: 'coding',
    topics: ['HTML', 'CSS', 'JavaScript', 'Python', 'SQL', 'Java', 'Web development'], level: 'Beginner to intermediate',
    publisherType: 'publisher', audience: ['school', 'college', 'beginner'], accessNote: 'Free tutorials are available; optional paid features and certificates may exist.',
    description: 'Tutorials, references, examples and practice-oriented learning for web and programming topics.', checkedOn: '2026-10-14',
  },
  {
    id: 'geeksforgeeks', title: 'GeeksforGeeks', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/', category: 'coding',
    topics: ['DSA', 'Algorithms', 'Java', 'Python', 'Computer science', 'Interview preparation'], level: 'Beginner to advanced',
    publisherType: 'publisher', audience: ['school', 'college', 'graduate'], accessNote: 'Free articles and practice coexist with paid courses and services.',
    description: 'Computer-science tutorials, programming explanations, practice problems and career preparation resources.', checkedOn: '2026-10-14',
  },
  {
    id: 'gfg-practice', title: 'GeeksforGeeks Practice', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/explore/', category: 'coding',
    topics: ['DSA', 'Arrays', 'Strings', 'Trees', 'Graphs', 'Problem solving'], level: 'Beginner to advanced',
    publisherType: 'publisher', audience: ['college', 'graduate'], accessNote: 'Access and features vary; review the provider’s current terms.',
    description: 'Topic-based computer-science and algorithm practice with difficulty and topic filters.', checkedOn: '2026-10-14',
  },
  {
    id: 'mdn', title: 'MDN Web Docs', provider: 'Mozilla', url: 'https://developer.mozilla.org/en-US/', category: 'coding',
    topics: ['HTML', 'CSS', 'JavaScript', 'Web APIs', 'Accessibility'], level: 'Beginner to advanced',
    publisherType: 'documentation', audience: ['college', 'graduate', 'beginner'], accessNote: 'Documentation is free to access; language availability varies by page.',
    description: 'Detailed web-platform documentation, guides and reference material for developers.', checkedOn: '2026-10-14',
  },
  {
    id: 'python-docs', title: 'Python Tutorial', provider: 'Python Software Foundation', url: 'https://docs.python.org/3/tutorial/', category: 'coding',
    topics: ['Python', 'Programming fundamentals', 'Data structures'], level: 'Beginner to intermediate',
    publisherType: 'official-docs', audience: ['school', 'college', 'graduate'], accessNote: 'Official documentation is free to access.',
    description: 'The official Python tutorial and language documentation.', checkedOn: '2026-10-14',
  },
  {
    id: 'dev-java', title: 'Learn Java', provider: 'Oracle / Java community', url: 'https://dev.java/learn/', category: 'coding',
    topics: ['Java', 'Object-oriented programming', 'JVM'], level: 'Beginner to intermediate',
    publisherType: 'official-docs', audience: ['school', 'college', 'graduate'], accessNote: 'Learning materials are available online; check linked tool and licence terms.',
    description: 'Java learning guides and documentation from the Java developer ecosystem.', checkedOn: '2026-10-14',
  },
  {
    id: 'freecodecamp', title: 'freeCodeCamp Learn', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/', category: 'coding',
    topics: ['Web development', 'JavaScript', 'Python', 'Data analysis', 'Projects'], level: 'Beginner to intermediate',
    publisherType: 'community', audience: ['school', 'college', 'beginner'], accessNote: 'Core learning curriculum is free; review the provider’s current terms.',
    description: 'Project-based coding curriculum and practice in web development and related topics.', checkedOn: '2026-10-14',
  },
  {
    id: 'cs50', title: 'CS50x', provider: 'Harvard University', url: 'https://cs50.harvard.edu/x/', category: 'coding',
    topics: ['Computer science', 'C', 'Python', 'SQL', 'Web development'], level: 'Beginner',
    publisherType: 'institution', audience: ['college', 'beginner'], accessNote: 'Course access and optional certificate conditions are defined by the provider.',
    description: 'An introductory computer-science course with problem sets and programming projects.', checkedOn: '2026-10-14',
  },
  {
    id: 'diksha', title: 'DIKSHA', provider: 'Government of India education initiative', url: 'https://diksha.gov.in/', category: 'school',
    topics: ['School curriculum', 'Teachers', 'School subjects', 'Vocational education'], level: 'School and educator resources',
    publisherType: 'government', audience: ['school', 'facilitator'], accessNote: 'Content and access conditions vary by resource and state/board.',
    description: 'A national digital education platform with school learning and teacher-facing resources.', checkedOn: '2026-10-14',
  },
  {
    id: 'epathshala', title: 'ePathshala', provider: 'NCERT / CIET', url: 'https://epathshala.nic.in/epathshala.php', category: 'school',
    topics: ['School curriculum', 'eResources', 'Textbooks', 'Teachers', 'Parents'], level: 'School and educator resources',
    publisherType: 'government', audience: ['school', 'facilitator'], accessNote: 'Follow NCERT copyright notices and the provider’s reuse conditions.',
    description: 'NCERT school e-resources and curriculum materials for students, teachers and families.', checkedOn: '2026-10-14',
  },
  {
    id: 'ncert-textbooks', title: 'NCERT Online Textbooks', provider: 'NCERT', url: 'https://ncert.nic.in/textbook.php', category: 'school',
    topics: ['Classes I–XII', 'Textbooks', 'School subjects', 'Curriculum'], level: 'School',
    publisherType: 'government', audience: ['school', 'facilitator'], accessNote: 'Link to NCERT; do not copy or re-host textbook files. Follow its copyright terms.',
    description: 'NCERT textbook access and chapter selection on the official publisher site.', checkedOn: '2026-10-14',
  },
  {
    id: 'swayam', title: 'SWAYAM', provider: 'Ministry of Education, Government of India', url: 'https://swayam.gov.in/', category: 'courses',
    topics: ['MOOCs', 'Higher education', 'Engineering', 'Humanities', 'Science', 'Management'], level: 'School to postgraduate',
    publisherType: 'government', audience: ['school', 'college', 'graduate'], accessNote: 'Course, examination, certificate and enrolment terms vary; check each course page.',
    description: 'Searchable online courses from institutions and national coordinators.', checkedOn: '2026-10-14',
  },
  {
    id: 'nptel', title: 'NPTEL', provider: 'IITs and IISc, supported by the Ministry of Education', url: 'https://nptel.ac.in/', category: 'courses',
    topics: ['Engineering', 'Computer science', 'Science', 'Management', 'Online courses'], level: 'Higher secondary to postgraduate; course-dependent',
    publisherType: 'institution', audience: ['school', 'college', 'graduate'], accessNote: 'Self-study access and optional certification/exam terms differ by course.',
    description: 'Online course catalogue from IITs and IISc covering engineering and other subjects.', checkedOn: '2026-10-14',
  },
  {
    id: 'skill-india', title: 'Skill India Digital Hub', provider: 'Ministry of Skill Development and Entrepreneurship', url: 'https://www.skillindiadigital.gov.in/free-online-courses/', category: 'skills',
    topics: ['Vocational skills', 'Digital skills', 'Entrepreneurship', 'Training', 'Certifications'], level: 'Learners and jobseekers',
    publisherType: 'government', audience: ['school', 'college', 'graduate'], accessNote: 'Course fees, duration, eligibility and certificate terms vary by listing.',
    description: 'Search skill courses and skills-related training and opportunity links.', checkedOn: '2026-10-14',
  },
  {
    id: 'ncs', title: 'National Career Service', provider: 'Ministry of Labour & Employment, Government of India', url: 'https://www.ncs.gov.in/', category: 'careers',
    topics: ['Career guidance', 'Jobs', 'Counselling', 'Job fairs', 'Skills'], level: 'Jobseekers and career explorers',
    publisherType: 'government', audience: ['college', 'graduate'], accessNote: 'The NCS portal warns users about fraudulent parties; verify all contacts on the official site.',
    description: 'Government career services, job search, career information and related services.', checkedOn: '2026-10-14',
  },
  {
    id: 'apprenticeship-india', title: 'Apprenticeship India', provider: 'Government apprenticeship portal', url: 'https://www.apprenticeshipindia.gov.in/', category: 'careers',
    topics: ['Apprenticeships', 'On-the-job training', 'Employers', 'Skill development'], level: 'Eligibility varies by programme',
    publisherType: 'government', audience: ['college', 'graduate'], accessNote: 'Check the current eligibility, employer and application requirements on the portal.',
    description: 'A starting point for apprenticeship registration and opportunities; verify the current portal workflow.', checkedOn: '2026-10-14',
  },
  {
    id: 'national-scholarship-portal', title: 'National Scholarship Portal', provider: 'Government of India', url: 'https://scholarships.gov.in/', category: 'aid',
    topics: ['Scholarships', 'Eligibility', 'Applications', 'Student financial aid'], level: 'Scheme-dependent',
    publisherType: 'government', audience: ['school', 'college', 'graduate'], accessNote: 'A portal link does not mean a scheme is currently open or that the student is eligible.',
    description: 'Official portal for discovering and accessing scholarship schemes and application information.', checkedOn: '2026-10-14',
  },
  {
    id: 'nta', title: 'National Testing Agency', provider: 'National Testing Agency', url: 'https://www.nta.ac.in/', category: 'exams',
    topics: ['Entrance exams', 'Exam calendar', 'Admissions', 'Mock tests'], level: 'Exam-dependent',
    publisherType: 'government', audience: ['school', 'college', 'graduate'], accessNote: 'Always confirm the latest notification, eligibility, dates and official application link.',
    description: 'Official examination and notification information for exams administered by NTA.', checkedOn: '2026-10-14',
  },
  {
    id: 'upsc', title: 'UPSC', provider: 'Union Public Service Commission', url: 'https://upsc.gov.in/', category: 'exams',
    topics: ['Civil services', 'Recruitment', 'Exam notifications', 'Syllabus'], level: 'Notification-dependent',
    publisherType: 'government', audience: ['graduate'], accessNote: 'Read the current official notification before relying on eligibility or dates.',
    description: 'Official recruitment notifications, examination information and syllabus documents.', checkedOn: '2026-10-14',
  },
  {
    id: 'bhashini', title: 'BHASHINI', provider: 'National Language Translation Mission', url: 'https://bhashini.gov.in/', category: 'skills',
    topics: ['Indian languages', 'Speech', 'Translation', 'Language technology'], level: 'Learners and developers',
    publisherType: 'government', audience: ['college', 'graduate', 'facilitator'], accessNote: 'Service/API availability and permissions depend on the selected service and onboarding.',
    description: 'Explore Indian-language technology and translation/speech service resources.', checkedOn: '2026-10-14',
  },
  {
    id: 'khan-academy-india', title: 'Khan Academy India', provider: 'Khan Academy', url: 'https://india.khanacademy.org/', category: 'school',
    topics: ['School mathematics', 'Science', 'Foundational concepts', 'Teacher resources'], level: 'School to early college',
    publisherType: 'community', audience: ['school', 'beginner', 'educator'], accessNote: 'The provider lists free learning content; content languages and curriculum coverage vary by topic.',
    description: 'India-aligned school learning resources, practice and teacher support for selected subjects.', checkedOn: '2026-10-14',
  },
  {
    id: 'ndli', title: 'National Digital Library of India', provider: 'IIT Kharagpur / Ministry of Education initiative', url: 'https://ndl.iitkgp.ac.in/', category: 'school',
    topics: ['Digital library', 'Research', 'School education', 'Higher education', 'Multilingual discovery'], level: 'School to research',
    publisherType: 'institution', audience: ['school', 'college', 'graduate', 'educator'], accessNote: 'The portal aggregates records from contributing institutions; individual item access and licence terms depend on the provider.',
    description: 'A discovery portal for learning and research materials from contributing institutions.', checkedOn: '2026-10-14',
  },
  {
    id: 'ignou-online', title: 'IGNOU Online & eGyanKosh', provider: 'Indira Gandhi National Open University', url: 'https://www.ignouonline.ac.in/', category: 'courses',
    topics: ['Open and distance learning', 'Online programmes', 'Digital repository', 'Higher education'], level: 'Higher education',
    publisherType: 'institution', audience: ['college', 'graduate'], accessNote: 'Admission, course, fee and resource terms differ by programme; verify details with IGNOU.',
    description: 'A gateway to IGNOU online programmes and associated open-learning resources.', checkedOn: '2026-10-14',
  },
  {
    id: 'code-org', title: 'Code.org — Student Learning', provider: 'Code.org', url: 'https://code.org/en-US/students', category: 'coding',
    topics: ['Computer science basics', 'AI literacy', 'Block coding', 'Web and app concepts'], level: 'School learners and beginners',
    publisherType: 'community', audience: ['school', 'beginner', 'educator'], accessNote: 'Activities, account requirements and language support vary across courses.',
    description: 'Interactive computer-science activities and beginner-friendly learning experiences.', checkedOn: '2026-10-14',
  },
  {
    id: 'leetcode-explore', title: 'LeetCode Explore', provider: 'LeetCode', url: 'https://leetcode.com/explore/', category: 'coding',
    topics: ['Data structures', 'Algorithms', 'Interview preparation', 'Problem solving'], level: 'Intermediate to advanced',
    publisherType: 'publisher', audience: ['college', 'graduate'], accessNote: 'Some content and features may require an account or paid plan; check current access terms.',
    description: 'Structured topic learning and coding-practice pathways for computer-science concepts.', checkedOn: '2026-10-14',
  },
  {
    id: 'hackerrank-tutorials', title: 'HackerRank Tutorials', provider: 'HackerRank', url: 'https://www.hackerrank.com/domains/tutorials/10-days-of-javascript', category: 'coding',
    topics: ['JavaScript', 'Programming practice', 'Problem solving', 'Developer skills'], level: 'Beginner to intermediate',
    publisherType: 'publisher', audience: ['school', 'college', 'graduate'], accessNote: 'Challenges and account features are governed by HackerRank’s current terms.',
    description: 'Guided coding challenges that combine programming practice with short explanations.', checkedOn: '2026-10-14',
  },

];

export const RESOURCE_COPY = {
  en: {
    eyebrow: 'THE UDAANSETU RESOURCE HUB', title: 'Useful learning links. One clear place.',
    intro: 'Find trusted tutorials, coding practice, school and college resources, skill courses, exams and career links. We organize the discovery journey; the original provider hosts the content.',
    searchLabel: 'Search learning resources', searchPlaceholder: 'Try Java, Python, school science, scholarships…',
    all: 'All resources', coding: 'Coding & computer science', school: 'School & curriculum', courses: 'Courses & higher education', skills: 'Skills & language tools', exams: 'Exams & admissions', careers: 'Careers & apprenticeships', aid: 'Scholarships & financial aid',
    browse: 'Browse', results: 'resources found', saved: 'Saved links', save: 'Save link', unsave: 'Remove saved link', open: 'Open original site', official: 'Government / institution', publisher: 'Learning publisher', documentation: 'Technical documentation', community: 'Community learning', level: 'Level', topics: 'Topics', checked: 'Catalogue checked', access: 'Access note',
    disclaimer: 'External sites control their own content, language, access, terms and availability. A saved link works offline as a bookmark only; the provider’s page still needs an internet connection.',
    curationTitle: 'How this directory works', curationText: 'UdaanSetu stores curated link metadata—not copied textbooks, course videos or third-party lessons. We prefer original and official sources, show review dates, and send learners to the provider for current details.',
    noResults: 'No matching resources', noResultsText: 'Try a broader keyword or choose another category.', clear: 'Clear filters', savedOnly: 'Show saved only', allLinks: 'Browse catalogue', emptySaved: 'No saved links yet', emptySavedText: 'Save useful resources to keep their bookmarks available on this device.',
    openNewTab: 'Opens the provider in a new tab', languageNotice: 'Interface language is selected below; the resource content language depends on the provider.', local: 'Local catalogue', lowData: 'Lightweight link directory', countLabel: 'Curated links', categoriesTitle: 'Start by topic', updated: 'Review date', external: 'External provider', noPromise: 'We do not guarantee a course, exam, scholarship or job is currently open. Verify at source.',
    resourceHub: 'Resource hub', pathfinder: 'Find my pathway', sourceType: 'Provider type', resourceType: 'Resource category', choose: 'Select a category',
  },
  hi: {
    eyebrow: 'UDAANSETU संसाधन केंद्र', title: 'सीखने के उपयोगी लिंक — एक ही जगह।',
    intro: 'विश्वसनीय ट्यूटोरियल, कोडिंग अभ्यास, स्कूल-कॉलेज संसाधन, कौशल पाठ्यक्रम, परीक्षाएँ और करियर लिंक खोजें। हम खोज को व्यवस्थित करते हैं; मूल सामग्री संबंधित प्रदाता के पास रहती है।',
    searchLabel: 'सीखने के संसाधन खोजें', searchPlaceholder: 'Java, Python, स्कूल विज्ञान, छात्रवृत्ति… खोजें',
    all: 'सभी संसाधन', coding: 'कोडिंग और कंप्यूटर विज्ञान', school: 'स्कूल और पाठ्यक्रम', courses: 'कोर्स और उच्च शिक्षा', skills: 'कौशल और भाषा उपकरण', exams: 'परीक्षाएँ और प्रवेश', careers: 'करियर और अप्रेंटिसशिप', aid: 'छात्रवृत्ति और आर्थिक सहायता',
    browse: 'देखें', results: 'संसाधन मिले', saved: 'सहेजे गए लिंक', save: 'लिंक सहेजें', unsave: 'सहेजा लिंक हटाएँ', open: 'मूल वेबसाइट खोलें', official: 'सरकार / संस्था', publisher: 'शिक्षण प्रदाता', documentation: 'तकनीकी दस्तावेज़', community: 'सामुदायिक शिक्षण', level: 'स्तर', topics: 'विषय', checked: 'सूची जाँची गई', access: 'पहुँच संबंधी नोट',
    disclaimer: 'बाहरी वेबसाइट अपनी सामग्री, भाषा, पहुँच और शर्तें नियंत्रित करती हैं। सहेजा लिंक ऑफलाइन केवल बुकमार्क के रूप में उपलब्ध है; प्रदाता का पृष्ठ खोलने के लिए इंटरनेट चाहिए।',
    curationTitle: 'यह निर्देशिका कैसे काम करती है', curationText: 'UdaanSetu केवल लिंक का विवरण रखता है—कॉपी की गई पाठ्यपुस्तकें, वीडियो या पाठ नहीं। हम मूल और आधिकारिक स्रोतों को प्राथमिकता देते हैं और वर्तमान जानकारी के लिए प्रदाता की वेबसाइट खोलते हैं।',
    noResults: 'कोई मेल खाता संसाधन नहीं', noResultsText: 'व्यापक शब्द आज़माएँ या दूसरी श्रेणी चुनें।', clear: 'फ़िल्टर साफ़ करें', savedOnly: 'केवल सहेजे लिंक', allLinks: 'सभी लिंक देखें', emptySaved: 'अभी कोई लिंक सहेजा नहीं गया', emptySavedText: 'उपयोगी संसाधनों के बुकमार्क इस डिवाइस पर रखने के लिए उन्हें सहेजें।',
    openNewTab: 'प्रदाता नई टैब में खुलेगा', languageNotice: 'नीचे इंटरफ़ेस भाषा चुनें; संसाधन की भाषा प्रदाता पर निर्भर करती है।', local: 'स्थानीय सूची', lowData: 'कम डेटा वाला लिंक संग्रह', countLabel: 'चुने हुए लिंक', categoriesTitle: 'विषय के आधार पर शुरू करें', updated: 'समीक्षा तिथि', external: 'बाहरी प्रदाता', noPromise: 'कोर्स, परीक्षा, छात्रवृत्ति या नौकरी खुली होने की गारंटी नहीं है। स्रोत पर जाँचें।',
    resourceHub: 'संसाधन केंद्र', pathfinder: 'अपना रास्ता खोजें', sourceType: 'प्रदाता प्रकार', resourceType: 'संसाधन श्रेणी', choose: 'श्रेणी चुनें',
  },
  ta: {
    eyebrow: 'UDAANSETU வள மையம்', title: 'பயனுள்ள கற்றல் இணைப்புகள் — ஒரே இடத்தில்.',
    intro: 'நம்பகமான வழிகாட்டிகள், குறியீட்டு பயிற்சி, பள்ளி மற்றும் கல்லூரி வளங்கள், திறன் படிப்புகள், தேர்வுகள் மற்றும் தொழில் இணைப்புகளைக் கண்டறியுங்கள். நாங்கள் தேடலை ஒழுங்குபடுத்துகிறோம்; அசல் உள்ளடக்கம் வழங்குநரிடமே இருக்கும்.',
    searchLabel: 'கற்றல் வளங்களைத் தேடுங்கள்', searchPlaceholder: 'Java, Python, பள்ளி அறிவியல், உதவித்தொகைகள்…',
    all: 'அனைத்து வளங்கள்', coding: 'குறியீடு மற்றும் கணினி அறிவியல்', school: 'பள்ளி மற்றும் பாடத்திட்டம்', courses: 'படிப்புகள் மற்றும் உயர்கல்வி', skills: 'திறன்கள் மற்றும் மொழிக் கருவிகள்', exams: 'தேர்வுகள் மற்றும் சேர்க்கை', careers: 'தொழில் மற்றும் பழகுநர் பயிற்சி', aid: 'உதவித்தொகை மற்றும் நிதி உதவி',
    browse: 'பார்க்கவும்', results: 'வளங்கள் கிடைத்தன', saved: 'சேமித்த இணைப்புகள்', save: 'இணைப்பைச் சேமி', unsave: 'சேமிப்பிலிருந்து நீக்கு', open: 'அசல் தளத்தைத் திற', official: 'அரசு / நிறுவனம்', publisher: 'கற்றல் வெளியீட்டாளர்', documentation: 'தொழில்நுட்ப ஆவணங்கள்', community: 'சமூகக் கற்றல்', level: 'நிலை', topics: 'தலைப்புகள்', checked: 'பட்டியல் சரிபார்க்கப்பட்டது', access: 'அணுகல் குறிப்பு',
    disclaimer: 'வெளிப்புற தளங்கள் தங்கள் உள்ளடக்கம், மொழி மற்றும் விதிகளை நிர்வகிக்கின்றன. சேமித்த இணைப்பு ஆஃப்லைனில் புத்தகக்குறியாக மட்டுமே இருக்கும்; வழங்குநர் பக்கத்துக்கு இணையம் தேவை.',
    curationTitle: 'இந்த அடைவு எப்படி செயல்படுகிறது', curationText: 'UdaanSetu இணைப்பு விவரங்களை மட்டுமே சேமிக்கிறது; நகலெடுக்கப்பட்ட புத்தகங்கள், காணொளிகள் அல்லது பாடங்களை அல்ல. அசல் மற்றும் அதிகாரப்பூர்வ ஆதாரங்களை முன்னுரிமைப்படுத்துகிறோம்.',
    noResults: 'பொருந்தும் வளங்கள் இல்லை', noResultsText: 'பரந்த சொல்லை முயற்சிக்கவும் அல்லது வேறு வகையைத் தேர்ந்தெடுக்கவும்.', clear: 'வடிகட்டிகளை அழி', savedOnly: 'சேமித்தவை மட்டும்', allLinks: 'அனைத்து இணைப்புகள்', emptySaved: 'இன்னும் இணைப்புகள் சேமிக்கப்படவில்லை', emptySavedText: 'பயனுள்ள இணைப்புகளை இந்தச் சாதனத்தில் புத்தகக்குறியாகச் சேமிக்கவும்.',
    openNewTab: 'வழங்குநர் புதிய தாவலில் திறக்கப்படும்', languageNotice: 'கீழே இடைமுக மொழி தேர்வு செய்யப்படுகிறது; வளத்தின் மொழி வழங்குநரைப் பொறுத்தது.', local: 'உள்ளூர் பட்டியல்', lowData: 'குறைந்த தரவு இணைப்பு அடைவு', countLabel: 'தேர்ந்தெடுத்த இணைப்புகள்', categoriesTitle: 'தலைப்பின்படி தொடங்குங்கள்', updated: 'மதிப்பாய்வு தேதி', external: 'வெளிப்புற வழங்குநர்', noPromise: 'பாடம், தேர்வு, உதவித்தொகை அல்லது வேலை தற்போது திறந்திருப்பது உறுதி இல்லை; மூலத்தில் சரிபார்க்கவும்.',
    resourceHub: 'வள மையம்', pathfinder: 'என் பாதையைத் தேடுங்கள்', sourceType: 'வழங்குநர் வகை', resourceType: 'வள வகை', choose: 'வகையைத் தேர்ந்தெடுக்கவும்',
  },
  te: {
    eyebrow: 'UDAANSETU విద్యా వనరుల కేంద్రం', title: 'ఉపయోగకరమైన విద్యా లింకులు — ఒకే చోట.',
    intro: 'నమ్మకమైన ట్యుటోరియల్స్, కోడింగ్ సాధన, పాఠశాల–కళాశాల వనరులు, నైపుణ్య కోర్సులు, పరీక్షలు మరియు కెరీర్ లింకులను కనుగొనండి. మేము వనరులను క్రమబద్ధం చేస్తాము; అసలు కంటెంట్ సంబంధిత వెబ్‌సైట్‌లోనే ఉంటుంది.',
    searchLabel: 'విద్యా వనరులను వెతకండి', searchPlaceholder: 'Java, Python, పాఠశాల సైన్స్, స్కాలర్‌షిప్‌లు…',
    all: 'అన్ని వనరులు', coding: 'కోడింగ్ & కంప్యూటర్ సైన్స్', school: 'పాఠశాల & పాఠ్యాంశాలు', courses: 'కోర్సులు & ఉన్నత విద్య', skills: 'నైపుణ్యాలు & భాషా సాధనాలు', exams: 'పరీక్షలు & ప్రవేశాలు', careers: 'కెరీర్ & అప్రెంటిస్‌షిప్', aid: 'స్కాలర్‌షిప్‌లు & ఆర్థిక సహాయం',
    browse: 'చూడండి', results: 'వనరులు దొరికాయి', saved: 'సేవ్ చేసిన లింకులు', save: 'లింక్ సేవ్ చేయండి', unsave: 'సేవ్ చేసిన లింక్ తొలగించండి', open: 'అసలు వెబ్‌సైట్ తెరవండి', official: 'ప్రభుత్వం / విద్యాసంస్థ', publisher: 'విద్యా ప్రచురణకర్త', documentation: 'సాంకేతిక డాక్యుమెంటేషన్', community: 'కమ్యూనిటీ అభ్యాసం', level: 'స్థాయి', topics: 'విషయాలు', checked: 'జాబితా పరిశీలించిన తేదీ', access: 'ప్రవేశ వివరాలు',
    disclaimer: 'బాహ్య వెబ్‌సైట్లు తమ కంటెంట్, భాష, ప్రాప్యత మరియు నిబంధనలను నిర్వహిస్తాయి. సేవ్ చేసిన లింక్ ఆఫ్‌లైన్‌లో బుక్‌మార్క్‌గా మాత్రమే ఉంటుంది; అసలు పేజీని తెరవడానికి ఇంటర్నెట్ అవసరం.',
    curationTitle: 'ఈ డైరెక్టరీ ఎలా పనిచేస్తుంది', curationText: 'UdaanSetu లింక్ వివరాలను మాత్రమే నిల్వ చేస్తుంది—కాపీ చేసిన పాఠ్యపుస్తకాలు, వీడియోలు లేదా పాఠాలను కాదు. అసలు మరియు అధికారిక మూలాలకు ప్రాధాన్యం ఇస్తూ తాజా వివరాల కోసం మూల వెబ్‌సైట్‌కు పంపుతుంది.',
    noResults: 'సరిపోలే వనరులు లేవు', noResultsText: 'విస్తృత పదంతో వెతకండి లేదా మరో వర్గాన్ని ఎంచుకోండి.', clear: 'ఫిల్టర్లను తొలగించండి', savedOnly: 'సేవ్ చేసినవి మాత్రమే', allLinks: 'అన్ని లింకులు', emptySaved: 'ఇంకా లింకులు సేవ్ చేయలేదు', emptySavedText: 'ఉపయోగకరమైన లింకులను ఈ పరికరంలో బుక్‌మార్క్‌లుగా సేవ్ చేయండి.',
    openNewTab: 'మూల వెబ్‌సైట్ కొత్త ట్యాబ్‌లో తెరుచుకుంటుంది', languageNotice: 'ఇక్కడ ఇంటర్‌ఫేస్ భాషను ఎంచుకుంటారు; వనరులోని భాష మాత్రం సంబంధిత వెబ్‌సైట్‌పై ఆధారపడుతుంది.', local: 'స్థానిక జాబితా', lowData: 'తక్కువ డేటాతో పనిచేసే లింకుల డైరెక్టరీ', countLabel: 'ఎంపిక చేసిన లింకులు', categoriesTitle: 'విషయం ఆధారంగా ప్రారంభించండి', updated: 'సమీక్ష తేదీ', external: 'బాహ్య వెబ్‌సైట్', noPromise: 'కోర్సు, పరీక్ష, స్కాలర్‌షిప్ లేదా ఉద్యోగం ప్రస్తుతం అందుబాటులో ఉందని హామీ లేదు. మూలంలో నిర్ధారించండి.',
    resourceHub: 'విద్యా వనరుల కేంద్రం', pathfinder: 'నా అభ్యాస మార్గాన్ని కనుగొనండి', sourceType: 'వనరుల రకం', resourceType: 'విద్యా వనరు వర్గం', choose: 'వర్గాన్ని ఎంచుకోండి',
  },
};

export function filterResources(resources, { query = '', category = 'all', audience = 'all', savedIds = [] } = {}) {
  const term = query.trim().toLocaleLowerCase();
  const saved = new Set(savedIds);
  return resources.filter((resource) => {
    if (category !== 'all' && resource.category !== category) return false;
    if (audience === 'saved' && !saved.has(resource.id)) return false;
    if (audience !== 'all' && audience !== 'saved' && !resource.audience.includes(audience)) return false;
    if (!term) return true;
    const searchable = [resource.title, resource.provider, resource.description, resource.level, ...resource.topics].join(' ').toLocaleLowerCase();
    return searchable.includes(term);
  });
}

export function validateResourceCatalog(resources = RESOURCE_CATALOG) {
  const ids = new Set();
  for (const resource of resources) {
    if (!resource.id || ids.has(resource.id)) throw new Error(`Missing or duplicate resource ID: ${resource.id}`);
    ids.add(resource.id);
    const url = new URL(resource.url);
    if (url.protocol !== 'https:') throw new Error(`Resource must use HTTPS: ${resource.id}`);
    if (!resource.title || !resource.provider || !resource.description) throw new Error(`Incomplete resource metadata: ${resource.id}`);
    if (!RESOURCE_CATEGORIES.some((item) => item.id === resource.category && item.id !== 'all')) throw new Error(`Invalid category: ${resource.id}`);
  }
  return true;
}
