import { PLATFORM_API_BASE } from './opportunities.js';

const ACTOR_KEY = 'facilitator-demo';
const PARTNER_KEY = 'partner-demo';

async function request(path, options = {}) {
  const response = await fetch(`${PLATFORM_API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    signal: options.signal || AbortSignal.timeout(7000),
    cache: 'no-store',
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const error = new Error(payload.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}
function json(method, body, headers = {}) { return { method, body: JSON.stringify(body), headers }; }
const actorHeader = { 'X-Actor-Key': ACTOR_KEY };
const partnerHeader = { 'X-Partner-Key': PARTNER_KEY };

export const ecosystemActor = Object.freeze({ actorKey: ACTOR_KEY, partnerKey: PARTNER_KEY });
export const ecosystemApi = {
  listCohorts: () => request('/facilitator/cohorts', { headers: actorHeader }),
  createCohort: (data) => request('/facilitator/cohorts', json('POST', data, actorHeader)),
  addLearner: (cohortId, data) => request(`/facilitator/cohorts/${encodeURIComponent(cohortId)}/learners`, json('POST', data, actorHeader)),
  listReferrals: () => request('/facilitator/referrals', { headers: actorHeader }),
  createReferral: (data) => request('/facilitator/referrals', json('POST', data, actorHeader)),

  listPublishedModules: (language) => request(`/learning-modules?language=${encodeURIComponent(language || '')}`),
  listMyModules: () => request('/learning-modules/mine', { headers: actorHeader }),
  createModule: (data) => request('/learning-modules', json('POST', data, actorHeader)),
  updateModule: (id, data) => request(`/learning-modules/${encodeURIComponent(id)}`, json('PUT', data, actorHeader)),
  publishModule: (id) => request(`/learning-modules/${encodeURIComponent(id)}/publish`, json('POST', {}, actorHeader)),
  archiveModule: (id) => request(`/learning-modules/${encodeURIComponent(id)}/archive`, json('POST', {}, actorHeader)),

  listMentors: (filters = {}) => {
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => Boolean(value)));
    return request(`/mentors${query.toString() ? `?${query}` : ''}`);
  },
  requestMentorConnection: (id, data) => request(`/mentors/${encodeURIComponent(id)}/connection-requests`, json('POST', data)),
  listMentorRequests: () => request('/mentors/connection-requests', { headers: actorHeader }),

  listPartnerListings: (filters = {}) => {
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => Boolean(value)));
    return request(`/partner-listings${query.toString() ? `?${query}` : ''}`);
  },
  listMyListings: () => request('/partner-listings/mine', { headers: partnerHeader }),
  createPartnerListing: (data) => request('/partner-listings', json('POST', data, partnerHeader)),
  submitPartnerListing: (id) => request(`/partner-listings/${encodeURIComponent(id)}/submit`, json('POST', {}, partnerHeader)),

  listIntegrations: () => request('/partners/integrations'),
  listReminders: (recipientKey) => request(`/notifications?recipientKey=${encodeURIComponent(recipientKey)}`),
  createReminder: (data) => request('/notifications', json('POST', data)),
  acknowledgeReminder: (id, recipientKey) => request(`/notifications/${encodeURIComponent(id)}/acknowledge?recipientKey=${encodeURIComponent(recipientKey)}`, json('POST', {})),
  getNotificationPreferences: (actorKey) => request(`/notifications/preferences?actorKey=${encodeURIComponent(actorKey)}`),
  saveNotificationPreferences: (actorKey, data) => request(`/notifications/preferences?actorKey=${encodeURIComponent(actorKey)}`, json('PUT', data)),

  getSustainabilityOverview: () => request('/sustainability/overview'),
  submitSustainabilityInterest: (data) => request('/sustainability/interest', json('POST', data)),
};

export const demoFallback = {
  cohorts: [], referrals: [], modules: [
    { id: 'module-local-demo', title: 'Everyday money skills', summary: 'Illustrative short module about planning, saving and comparing choices.', audience: 'Secondary learners', language: 'en', accessMode: 'FREE', priceInr: 0, status: 'PUBLISHED', version: 1, lessons: [{ title: 'Map a practical skill', summary: 'An example lesson', estimatedMinutes: 15 }], demoRecord: true },
  ],
  mentors: [
    { id: 'mentor-demo-design', displayName: 'Illustrative mentor · Design', expertise: 'Design and communication', bio: 'Explore portfolio-building and visual communication pathways.', region: 'Tamil Nadu', languages: ['ta', 'en'], organization: 'Community partner (demo)', verified: true, demoProfile: true },
    { id: 'mentor-demo-skills', displayName: 'Illustrative mentor · Skilled trades', expertise: 'Technical and vocational skills', bio: 'Explore training routes for technical and vocational pathways.', region: 'South India', languages: ['ta', 'hi', 'en'], organization: 'Training partner (demo)', verified: true, demoProfile: true },
  ],
  mentorRequests: [],
  listings: [
    { id: 'listing-demo-apprenticeship', title: 'Illustrative electrical maintenance apprenticeship', organization: 'Example training partner (demo)', kind: 'APPRENTICESHIP', location: 'Chennai / nearby district', workMode: 'On-site', description: 'Example listing to demonstrate the workflow. Not a live vacancy.', eligibilitySummary: 'Illustrative requirements only; verify with the provider.', applicationUrl: 'https://example.org/apprenticeships', status: 'PUBLISHED', demoListing: true },
    { id: 'listing-demo-internship', title: 'Illustrative community technology internship', organization: 'Example NGO partner (demo)', kind: 'INTERNSHIP', location: 'Hybrid · Tamil Nadu', workMode: 'Hybrid', description: 'Example listing to demonstrate accessible technology work. Not a live vacancy.', eligibilitySummary: 'Illustrative requirements only; verify with the provider.', applicationUrl: 'https://example.org/internships', status: 'PUBLISHED', demoListing: true },
  ],
  myListings: [], integrations: [
    { id: 'LOCAL_OPPORTUNITY_CATALOGUE', displayName: 'UdaanSetu local catalogue', capability: 'Browse locally curated records', status: 'READY', setupGuidance: 'Local demo records only; in-memory data resets on restart.', externalNetworkCallEnabled: false },
    { id: 'DIKSHA', displayName: 'DIKSHA', capability: 'Curriculum-linked learning resources', status: 'NOT_CONFIGURED', setupGuidance: 'Confirm documentation, credentials, terms and permitted scopes before enabling.', externalNetworkCallEnabled: false },
    { id: 'SKILL_INDIA', displayName: 'Skill India Digital Hub', capability: 'Skills and training references', status: 'NOT_CONFIGURED', setupGuidance: 'Do not assume an unrestricted public API.', externalNetworkCallEnabled: false },
    { id: 'NATIONAL_CAREER_SERVICE', displayName: 'National Career Service', capability: 'Career and employment references', status: 'NOT_CONFIGURED', setupGuidance: 'Confirm the authorized integration route.', externalNetworkCallEnabled: false },
    { id: 'BHASHINI', displayName: 'BHASHINI', capability: 'Language-service adapter', status: 'NOT_CONFIGURED', setupGuidance: 'Configure an authorized service adapter server-side.', externalNetworkCallEnabled: false },
  ], reminders: [{ id: 'reminder-local-demo', recipientKey: ACTOR_KEY, kind: 'LEARNING_STEP', title: 'Revisit your saved pathway', message: 'Illustrative demo reminder.', scheduledAt: new Date(Date.now() + 86400000).toISOString(), status: 'SCHEDULED' }],
  sustainability: { productPolicy: 'Core student discovery and public-opportunity navigation stay free in this proposal.', models: [
    { id: 'CSR_SPONSORSHIP', name: 'CSR or foundation sponsorship', whoPays: 'CSR programmes, foundations or impact funders', valueHypothesis: 'Sponsor learner access, facilitator enablement or a defined local pilot.', safeguards: 'Core student access and opportunity ranking remain free.' },
    { id: 'INSTITUTIONAL_LICENSE', name: 'Institution or NGO license', whoPays: 'Schools, colleges, NGOs or skilling partners', valueHypothesis: 'Support facilitator cohort workflows and transparent reports.', safeguards: 'Apply least-privilege access to learner data.' },
    { id: 'FACILITATOR_MODULES', name: 'Facilitator-created modules', whoPays: 'Institutions, sponsors or learners depending on approved model', valueHypothesis: 'Enable free, sponsored or priced modules after quality checks.', safeguards: 'Show price terms; no checkout is live.' },
    { id: 'PARTNER_SERVICE', name: 'Verified partner services', whoPays: 'Employers or training providers', valueHypothesis: 'Explore partner services or listing administration.', safeguards: 'Paid placement never changes recommendations.' },
  ], validationQuestions: ['Who has purchasing authority?', 'What evidence of value is required?', 'What price is affordable?', 'Can access be sponsored without steering recommendations?'], paymentStatus: 'No payment processor or checkout is connected. No payment is collected.' },
};

export function localDemoStore() {
  const key = 'udaan-setu-ecosystem-demo-v1';
  const load = () => {
    try { return { ...structuredClone(demoFallback), ...JSON.parse(localStorage.getItem(key) || '{}') }; }
    catch { return structuredClone(demoFallback); }
  };
  const save = (value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* local-only demo storage may be unavailable */ } };
  return { load, save };
}
