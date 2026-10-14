/**
 * Fallback catalogue used only when the Java API is not reachable and no cached
 * catalogue exists. Entries are source-finding references, not promises of current
 * availability. Only the named NSP renewal notice has a dated portal notice.
 */
export const DEMO_OPPORTUNITIES = [
  {
    id: 'nsp-pm-usp-csss-renewal-2026',
    title: 'PM-USP CSSS — renewal notice (AY 2026–27)',
    summary: 'The National Scholarship Portal lists a renewal window for the PM-USP Central Sector Scheme of Scholarship for College and University Students. Review the official notice and scheme criteria before acting.',
    type: 'SCHOLARSHIP', provider: 'National Scholarship Portal', locationLabel: 'All India',
    languageCodes: ['en', 'hi'], tags: ['scholarship', 'college', 'renewal', 'financial aid'],
    sourceName: 'National Scholarship Portal', sourceUrl: 'https://scholarships.gov.in/Students',
    applicationUrl: 'https://scholarships.gov.in/Students', sourceTrust: 'OFFICIAL_PORTAL', listingStatus: 'PUBLISHED',
    lastVerifiedAt: '2026-10-14', opensOn: null, deadline: '2026-10-31',
    eligibilityRulesConfigured: false, demoOnly: false,
    requiredDocuments: ['Check the current official notice for required documents'],
    nextStep: 'Open the portal and confirm that the scheme and renewal category apply to you.'
  },
  {
    id: 'nsp-scholarship-discovery', title: 'National Scholarship Portal — scholarship discovery',
    summary: 'Use the official portal to discover scholarships and check the current academic-year notice, scheme eligibility, application windows and required documents. This is a portal reference, not a claim that every scheme is open.',
    type: 'SCHOLARSHIP', provider: 'National Scholarship Portal', locationLabel: 'All India', languageCodes: ['en', 'hi', 'ta'],
    tags: ['scholarship', 'financial aid', 'student support', 'government scheme'], sourceName: 'National Scholarship Portal',
    sourceUrl: 'https://scholarships.gov.in/All-Scholarships', applicationUrl: 'https://scholarships.gov.in/All-Scholarships',
    sourceTrust: 'REFERENCE_ONLY', listingStatus: 'REFERENCE_ONLY', lastVerifiedAt: '2026-10-14',
    eligibilityRulesConfigured: false, demoOnly: false, requiredDocuments: [], nextStep: 'Check the current academic-year notice and confirm that the scheme applies to you.'
  },
  {
    id: 'skill-india-course-explorer', title: 'Skill India Digital Hub — course explorer',
    summary: 'Explore skills courses and related opportunities across sectors. Availability, language, duration and eligibility vary by listing; check the provider page.',
    type: 'COURSE', provider: 'Skill India Digital Hub', locationLabel: 'All India', languageCodes: ['en', 'hi', 'ta'],
    tags: ['skills', 'vocational', 'courses', 'career'], sourceName: 'Skill India Digital Hub',
    sourceUrl: 'https://www.skillindiadigital.gov.in/free-online-courses/', applicationUrl: 'https://www.skillindiadigital.gov.in/free-online-courses/',
    sourceTrust: 'REFERENCE_ONLY', listingStatus: 'REFERENCE_ONLY', lastVerifiedAt: '2026-10-14',
    eligibilityRulesConfigured: false, demoOnly: false, requiredDocuments: [], nextStep: 'Open the official source and verify current availability, eligibility and deadlines.'
  },
  {
    id: 'swayam-course-explorer', title: 'SWAYAM — course search',
    summary: 'Search courses published on the official SWAYAM platform. Confirm enrolment windows, prerequisites, language and certificate/exam details on the course page.',
    type: 'COURSE', provider: 'SWAYAM / Ministry of Education', locationLabel: 'All India', languageCodes: ['en', 'hi', 'ta'],
    tags: ['courses', 'online learning', 'higher education'], sourceName: 'SWAYAM',
    sourceUrl: 'https://swayam.gov.in/search_courses', applicationUrl: 'https://swayam.gov.in/search_courses',
    sourceTrust: 'REFERENCE_ONLY', listingStatus: 'REFERENCE_ONLY', lastVerifiedAt: '2026-10-14',
    eligibilityRulesConfigured: false, demoOnly: false, requiredDocuments: [], nextStep: 'Open the official source and verify current availability, eligibility and deadlines.'
  },
  {
    id: 'diksha-learning-library', title: 'DIKSHA — learning resources',
    summary: 'Open the DIKSHA learning platform to explore learning resources. This is a portal reference, not an individual course recommendation.',
    type: 'RESOURCE', provider: 'DIKSHA', locationLabel: 'All India', languageCodes: ['en', 'hi', 'ta'],
    tags: ['school', 'learning resources', 'teacher'], sourceName: 'DIKSHA',
    sourceUrl: 'https://diksha.gov.in/', applicationUrl: 'https://diksha.gov.in/',
    sourceTrust: 'REFERENCE_ONLY', listingStatus: 'REFERENCE_ONLY', lastVerifiedAt: '2026-10-14',
    eligibilityRulesConfigured: false, demoOnly: false, requiredDocuments: [], nextStep: 'Open the official source and verify current availability, eligibility and deadlines.'
  },
  {
    id: 'ncs-career-services', title: 'National Career Service — career and employment services',
    summary: 'Explore career guidance and employment-related services on the official portal. Listings and eligibility must be checked individually.',
    type: 'RESOURCE', provider: 'National Career Service', locationLabel: 'All India', languageCodes: ['en', 'hi'],
    tags: ['career guidance', 'jobs', 'employment'], sourceName: 'National Career Service',
    sourceUrl: 'https://www.ncs.gov.in/', applicationUrl: 'https://www.ncs.gov.in/',
    sourceTrust: 'REFERENCE_ONLY', listingStatus: 'REFERENCE_ONLY', lastVerifiedAt: '2026-10-14',
    eligibilityRulesConfigured: false, demoOnly: false, requiredDocuments: [], nextStep: 'Open the official source and verify current availability, eligibility and deadlines.'
  },
  {
    id: 'apprenticeship-india-explorer', title: 'Apprenticeship India — opportunity explorer',
    summary: 'Visit the official apprenticeship portal to explore current apprenticeship information. This record does not represent a specific open vacancy.',
    type: 'APPRENTICESHIP', provider: 'Apprenticeship India', locationLabel: 'All India', languageCodes: ['en', 'hi'],
    tags: ['apprenticeship', 'work-based learning', 'skills'], sourceName: 'Apprenticeship India',
    sourceUrl: 'https://www.apprenticeshipindia.gov.in/', applicationUrl: 'https://www.apprenticeshipindia.gov.in/',
    sourceTrust: 'REFERENCE_ONLY', listingStatus: 'REFERENCE_ONLY', lastVerifiedAt: '2026-10-14',
    eligibilityRulesConfigured: false, demoOnly: false, requiredDocuments: [], nextStep: 'Open the official source and verify current availability, eligibility and deadlines.'
  },
  {
    id: 'bhashini-language-services', title: 'BHASHINI — language technology resources',
    summary: 'Explore language technology and developer resources for Indian language experiences. Integration access, service coverage and terms must be confirmed before use.',
    type: 'RESOURCE', provider: 'BHASHINI', locationLabel: 'All India', languageCodes: ['en', 'hi', 'ta'],
    tags: ['languages', 'speech', 'translation', 'accessibility'], sourceName: 'BHASHINI',
    sourceUrl: 'https://bhashini.gov.in/', applicationUrl: 'https://bhashini.gov.in/',
    sourceTrust: 'REFERENCE_ONLY', listingStatus: 'REFERENCE_ONLY', lastVerifiedAt: '2026-10-14',
    eligibilityRulesConfigured: false, demoOnly: false, requiredDocuments: [], nextStep: 'Open the official source and verify current availability, eligibility and deadlines.'
  }
];
