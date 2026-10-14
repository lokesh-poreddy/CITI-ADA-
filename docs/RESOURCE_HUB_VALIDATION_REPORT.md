# UdaanSetu v0.7.1 — Resource Hub and Telugu Localization Validation

**Validation date:** 14 October 2026  
**Release scope:** curated external education/resource directory + fourth interface locale (Telugu) consistency.

## Product changes

- Expanded the local metadata catalogue to **26 external resource links** across coding, school learning, open courses, skills, exams, careers and financial aid.
- Added Khan Academy India, National Digital Library of India (NDLI), IGNOU Online/eGyanKosh, Code.org student learning, LeetCode Explore and HackerRank tutorial links.
- Kept the resource model link-only: UdaanSetu stores catalogue metadata and local bookmark IDs; the original publisher retains the learning content. Provider terms, cost, eligibility, language and availability must be checked at source.
- Added Telugu (`te`) locale consistency for local learner persistence, stage labels, dates, speech locale, impact-event locale validation, and facilitator module content-language choices.
- Added a dependency-free Node smoke checker (`frontend/scripts/check-resource-hub.mjs`) and wired it into the strict release script and CI contract job.
- Added shared Vitest DOM-matchers setup at `frontend/src/test/setup.js` so React Testing Library matchers such as `toBeInTheDocument()` are registered.

## Executed checks

| Check | Result | Limit |
|---|---:|---|
| `node frontend/scripts/check-resource-hub.mjs` (run from `frontend/`) | 10/10 passed | Offline functional smoke of pure JS catalogue, locale dictionaries, pathways, speech locale and local profile storage. |
| `python scripts/check-integration-contracts.py` | 89/89 passed | Static contracts only; not a complete runtime test. |
| `PYTHONPATH=. python -m pytest -q tests` (from `ai-service/`) | 12 passed | Unit/API/middleware tests. |
| `PYTHONPATH=. python evaluation/evaluate_retrieval.py` (from `ai-service/`) | 7/7 passed | Small deterministic fixture set only; not production model-quality evidence. |
| TypeScript compiler API syntax parse of frontend JS/JSX files | 32 files, no syntax diagnostics | Syntax parse only; no dependency resolution or semantic/type checking. |
| JavaScript module checks (`node --check`) | Passed for `resourceCatalog.js`, `careerCatalog.js`, `teluguCatalog.js`, `browserSpeech.js` | Does not parse React JSX or bundle assets. |
| JSON/POM/shell/YAML validation | Manifest JSON and shell syntax checks pass; Compose configuration cannot be executed without Docker | Toolchain-limited; see below. |

## Blocked / not verified

- The dependency-aware React/Vite build and Vitest suite were **not executed** because this workspace has no installed `frontend/node_modules` and dependency installation cannot complete against the npm registry from this environment.
- Maven/Spring compilation, the real Flyway/H2/PostgreSQL runtime integration tests, and the production JAR were **not executed** against the actual dependencies in this environment.
- Docker Compose configuration, container image builds, networked startup and integrated HTTP smoke tests were **not executed** because Docker is unavailable here.
- This release is not described as full-build-verified, security-certified or production-ready. Run `./scripts/doctor.sh` followed by `./scripts/verify-release.sh` in a network-enabled environment with Java 21, Node/npm, Python dependencies and Docker Compose before the showcase release.

## Data-language policy

The UdaanSetu interface locale is separate from the content language of a linked provider. Resource `languageCodes` metadata must only describe languages actually confirmed for the provider content; adding Telugu to the interface does not imply that every external course is available in Telugu. The interface must make the provider handoff clear and avoid mirroring or re-hosting third-party content.

## Public provider references checked for catalogue expansion

- Khan Academy India — https://india.khanacademy.org/
- National Digital Library of India — https://ndl.iitkgp.ac.in/ and project information at https://project.ndl.gov.in/products/ndli-web-portal/
- IGNOU Online — https://www.ignouonline.ac.in/
- Code.org student learning — https://code.org/en-US/students
- LeetCode Explore — https://leetcode.com/explore/
- HackerRank 10 Days of JavaScript — https://www.hackerrank.com/domains/tutorials/10-days-of-javascript

These are discovery links, not endorsements or guarantees of a course's availability, access terms, language support, certification, eligibility or outcomes. Users should check the original source.
