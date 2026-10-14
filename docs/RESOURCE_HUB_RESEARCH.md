# UdaanSetu Resource Hub — product and source policy

**Revision:** 0.7.1 resource-discovery direction  
**Review date:** 14 October 2026

## Product decision

UdaanSetu is a curated educational resource and opportunity hub. It organizes trusted external learning links and then helps the learner identify a sensible next step. It does **not** copy or re-host third-party textbooks, article text, code examples, videos, courses, or training content. Publishers remain the source of truth for content, availability, language, access rules and licensing.

The product can take inspiration from:

- W3Schools for topic-organized tutorials and quick access to programming references.
- GeeksforGeeks for computer-science articles, algorithms and practice-oriented discovery.
- India's existing education and employment ecosystem for curriculum resources, open courses, skill programmes, career services, exams and financial aid.

These are examples of complementary resources, not a claim that UdaanSetu owns or replaces them.

## Curated starter sources

This is a starter directory, not a comprehensive or continually verified database. Availability, current URLs, language support and terms can change, and each destination must be rechecked before a public release.

| Area | Initial source | Link | Product handling |
|---|---|---|---|
| Web tutorials | W3Schools | https://www.w3schools.com/ | Store source metadata/link only; provider controls tutorials and practice. |
| Computer science | GeeksforGeeks | https://www.geeksforgeeks.org/ | Link to articles and learning routes; do not mirror content. |
| Coding practice | GeeksforGeeks Practice | https://www.geeksforgeeks.org/explore/ | Store link and topic tags; practice runs at source. |
| Web documentation | MDN Web Docs | https://developer.mozilla.org/en-US/ | Link to official web-platform documentation. |
| Python documentation | Python Tutorial | https://docs.python.org/3/tutorial/ | Link to the upstream language documentation. |
| Java learning | dev.java | https://dev.java/learn/ | Link to Java ecosystem learning materials. |
| Project-based coding | freeCodeCamp | https://www.freecodecamp.org/learn/ | Direct learners to the provider’s own curriculum. |
| Introductory CS | Harvard CS50x | https://cs50.harvard.edu/x/ | Explain that course/certificate terms are set by the provider. |
| School education | DIKSHA | https://diksha.gov.in/ | Link to official education resources; do not assume every resource is available in every state/language. |
| School resources | ePathshala | https://epathshala.nic.in/epathshala.php | Link to upstream resources and retain its copyright notices. |
| Textbooks | NCERT | https://ncert.nic.in/textbook.php | Link only. Never bundle or re-host textbook files; check official reuse/copyright terms. |
| Online courses | SWAYAM | https://swayam.gov.in/ | Course availability, exams and certificate terms must be checked at source. |
| Higher education courses | NPTEL | https://nptel.ac.in/ | Link to provider pages and distinguish self-study from certification/exam conditions. |
| Skills | Skill India Digital Hub | https://www.skillindiadigital.gov.in/free-online-courses/ | Check each programme's eligibility, cost, geography and current status. |
| Career services | National Career Service | https://www.ncs.gov.in/ | Warn learners to verify contacts and opportunities through the official portal. |
| Apprenticeships | Apprenticeship India | https://www.apprenticeshipindia.gov.in/ | Link to the official portal; do not imply a listing is open unless confirmed. |
| Scholarships | National Scholarship Portal | https://scholarships.gov.in/ | Link to scheme/application source; never infer that a scheme is currently open. |
| Entrance exams | National Testing Agency | https://www.nta.ac.in/ | Link to the current official notification and dates. |
| Civil services exams | UPSC | https://upsc.gov.in/ | Link to official notices and examination pages. |
| Language tools | BHASHINI | https://bhashini.gov.in/ | Treat API access and use conditions as subject to provider onboarding and terms. |

## Metadata to store for each resource

`id`, `title`, `provider`, `canonical_url`, `category`, `topics`, `audience/stage`, `publisher_type`, `access_note`, `interface_languages`, `content_languages_if_confirmed`, `last_checked_at`, `review_status`, and an internal `reviewer_note` where needed. Do not call a source “verified” just because its home page is reachable. A checked date is not a service-level guarantee that a link or opportunity remains current.

## Local-first behavior

- Resource search and filters operate over a small metadata catalogue shipped with the app.
- Bookmarks contain resource IDs only and are stored locally on the device.
- Saved links may be visible offline as bookmarks; the external destination still needs internet.
- Do not scrape providers without reviewing terms, build a local mirror of their content, or download content into the application cache without clear permission.
- Keep user-specific/private data out of service-worker caches.
- If a destination is not reachable, show an honest failure and keep the student’s local search/bookmarks usable.

## Telugu language policy

The app interface supports English (`en`), Hindi (`hi`), Tamil (`ta`) and Telugu (`te`). This setting changes UdaanSetu labels and selected local pathway guidance only. It does not imply that the linked resource itself is localized into the selected language. Content-language claims must be based on the provider’s own page or explicit source metadata. Voice support depends on browser/device capability; always preserve a text alternative.

## Pre-release checklist

1. Recheck every URL, provider identity and category.
2. Add source reviewer and review status, not only a hardcoded date, before expanding the catalogue.
3. Verify the selected Telugu translations with a fluent reviewer before field testing.
4. Test keyboard and screen-reader navigation, 320px-wide layouts, large text, low-end Android hardware, and offline transitions.
5. Check each provider's licence/terms before reproducing any content or logo. Use plain text names and external links by default.
6. Measure broken-link rate, resource search success, bookmarks restored offline, and percent of users who reach a verified next step.

## Additional curated directories

The starter catalogue now includes Khan Academy India, the National Digital Library of India (NDLI), IGNOU Online/eGyanKosh, Code.org student learning, LeetCode Explore, and HackerRank tutorials. These are external discovery links; UdaanSetu stores metadata and bookmarks only. Provider pages may require accounts, restrict some features, or use a different language from the interface. Review links periodically and verify eligibility or availability on the provider's own website. Source validation (14 October 2026): Khan Academy India, NDLI, IGNOU Online, Code.org students, LeetCode Explore, and HackerRank tutorials.

### Provider-source references

- Khan Academy India: https://india.khanacademy.org/
- National Digital Library of India portal: https://ndl.iitkgp.ac.in/
- NDLI project information: https://project.ndl.gov.in/products/ndli-web-portal/
- IGNOU Online: https://www.ignouonline.ac.in/
- Code.org student learning: https://code.org/en-US/students
- LeetCode Explore: https://leetcode.com/explore/
- HackerRank JavaScript tutorial series: https://www.hackerrank.com/domains/tutorials/10-days-of-javascript

These are discovery URLs, not endorsements or guarantees of free access, language coverage, current availability, age suitability, certification, employment, or eligibility. Check the linked provider before recommending a specific course or task.
