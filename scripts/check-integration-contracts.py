#!/usr/bin/env python3
"""Offline, stdlib-only cross-layer contract checks for UdaanSetu.

These checks catch identifier/route drift before dependency-aware frontend and Java tests run.
They are not a replacement for npm tests, Maven tests, container builds or runtime smoke tests.
"""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []
checks = 0

def check(condition: bool, message: str) -> None:
    global checks
    checks += 1
    if condition:
        print(f"PASS {message}")
    else:
        errors.append(message)
        print(f"FAIL {message}")

def read(relative: str) -> str:
    path = ROOT / relative
    if not path.is_file():
        errors.append(f"required file exists: {relative}")
        print(f"FAIL required file exists: {relative}")
        return ""
    return path.read_text(encoding="utf-8")

frontend_catalog = read("frontend/src/student/careerCatalog.js")
backend_catalog = read("backend/src/main/java/in/udaansetu/platform/careers/CareerPathwayService.java")
front_ids_block = frontend_catalog.split("export const INTEREST_OPTIONS", 1)[0]
front_ids = re.findall(r"^\s*id:\s*'([a-z0-9-]+)'", front_ids_block, re.MULTILINE)
backend_ids = re.findall(r'path\("([a-z0-9-]+)"', backend_catalog)
check(len(front_ids) == 6 and len(set(front_ids)) == len(front_ids), "frontend contains six unique career-pathway IDs")
check(len(backend_ids) == 6 and len(set(backend_ids)) == len(backend_ids), "Java backend contains six unique career-pathway IDs")
check(set(front_ids) == set(backend_ids), "frontend and Java pathway identifiers match exactly")

profile_dto = read("backend/src/main/java/in/udaansetu/platform/learners/LearnerProfileRequest.java")
profile_controller = read("backend/src/main/java/in/udaansetu/platform/learners/LearnerProfileController.java")
profile_service = read("backend/src/main/java/in/udaansetu/platform/learners/LearnerProfileService.java")
check('@RequestMapping("/api/v1/learners/profiles")' in profile_controller and "@PostMapping" in profile_controller,
      "learner profile API path agrees with implementation")
check("@AssertTrue boolean allowDemoProcessing" in profile_dto, "server profile request requires explicit prototype-processing opt-in")
check("Duration.ofMinutes(30)" in profile_service and "new ConcurrentHashMap" in profile_service,
      "profile store is volatile and TTL-limited, not persistent")
for forbidden in ("phone", "email", "birthDate", "annualFamilyIncome", "caste", "exactAddress", "state"):
    check(forbidden.lower() not in profile_dto.lower(), f"learner profile DTO does not collect {forbidden}")

career_controller = read("backend/src/main/java/in/udaansetu/platform/careers/CareerPathwayController.java")
api_client = read("frontend/src/api/learnerJourney.js")
check('"/api/v1"' in career_controller and '@GetMapping("/career-pathways")' in career_controller,
      "public career catalogue API is declared")
check('@PostMapping("/career-pathways/recommendations")' in career_controller and "/career-pathways/recommendations" in api_client,
      "career recommendation API path aligns across frontend and backend")
check('@GetMapping("/learning-pathways/{pathwayId}")' in career_controller and "/learning-pathways/${encodeURIComponent(pathwayId)}" in api_client,
      "learning pathway API path aligns across frontend and backend")
for resource_url in re.findall(r"url:\s*'([^']+)'", front_ids_block):
    check(resource_url.startswith("https://"), f"pathway resource uses HTTPS: {resource_url}")

app = read("frontend/src/App.jsx")
journey = read("frontend/src/student/StudentJourney.jsx")
offline = read("frontend/src/offline/offlinePocket.js")
service_worker = read("frontend/public/sw.js")
opportunity_centre = read("frontend/src/opportunities/OpportunityCentre.jsx")
check("import StudentJourney from './student/StudentJourney.jsx'" in app and "<StudentJourney" in app,
      "student journey is integrated into main application")
check("suggestedQuery={suggestedOpportunityQuery}" in app and "suggestedQuery = ''" in opportunity_centre,
      "selected pathway can hand a query into Opportunity Centre")
check("allowDemoProcessing" in journey and "createLearnerProfile(nextProfile)" in journey,
      "server profile submission is gated by the explicit UI preference")
check("state: profile.state" not in api_client and "stays on-device" in api_client.lower(),
      "optional region selection is not sent to the current matching API")
check('@DeleteMapping("/{learnerId}")' in profile_controller and "deleteLearnerProfile" in api_client,
      "temporary learner profiles have a best-effort delete path")
state_options_block = frontend_catalog.split("export const STATE_OPTIONS = [", 1)[-1].split("];", 1)[0]
state_ids = re.findall(r"id:\s*'([a-z0-9-]+)'", state_options_block)
check(len(state_ids) == 36 and len(set(state_ids)) == 36,
      "frontend has 36 unique state/UT options")
check(frontend_catalog.count("localSessionFallback:") == 4 and frontend_catalog.count("storageUnavailable:") == 4,
      "local-storage fallback messages cover all four UI languages")
check("matchLocalPathways(nextProfile, 3)" in journey, "local pathway recommendations are the default fallback")
check("globalThis.setTimeout" in journey and "saveLocalLearnerProfile(profile)" in journey,
      "profile drafts autosave locally while editing without a server call")
check("const DB_VERSION = 2" in offline and "const STORE_LEARNER = 'learnerProfile'" in offline,
      "offline store migration includes the learner profile store")
check("url.pathname.startsWith('/api/')" in service_worker, "service worker excludes API endpoints from caching")
check("const localCleared = await clearLocalLearnerProfile()" in journey and "t.clearFailed" in journey,
      "the UI does not claim local erasure succeeded when storage deletion fails")
check("allowDemoProcessing: false" in offline,
      "local draft storage never persists a prior demo-service opt-in")
check("['en', 'hi', 'ta', 'te'].includes(profile?.preferredLanguage)" in offline,
      "offline learner pocket preserves Telugu locale")
check("allowDemoProcessing: false, preferredLanguage: locale" in journey,
      "resuming a saved draft requires demo-service opt-in to be confirmed again")
check("remoteCleanupPending" in journey and "remoteCleared ? '' : remoteProfileId" in journey,
      "failed remote profile cleanup is disclosed and retained for retry")
check("clearRetryAvailable" in journey and "t.retryCleanup" in journey,
      "failed local or remote clearing leaves a visible retry action")
check(frontend_catalog.count("retryCleanup:") == 4,
      "cleanup retry action is localized in English, Hindi, Tamil and Telugu")
check("path.interests().stream().sorted().toList()" in backend_catalog and "path.strengths().stream().sorted().toList()" in backend_catalog and "path.goals().stream().sorted().toList()" in backend_catalog,
      "Java pathway explanation signals use deterministic sorted-set traversal")
check(frontend_catalog.count("remoteCleanupPending:") == 4,
      "remote profile cleanup-pending message is localized in English, Hindi, Tamil and Telugu")
check("{plan.catalogueConnected ? t.connectedPlan : t.localOnly}" in journey,
      "learning-plan connection badge uses localized UI copy")
check('"version": "0.7.1"' in read("frontend/package.json") and "0.7.1" in read("backend/pom.xml") and 'SERVICE_VERSION = "0.7.1"' in read("ai-service/app/config.py"),
      "frontend, Java backend and Python AI service share release version 0.7.1")
check("STAGE_GUIDANCE" in frontend_catalog and "academicStage" in frontend_catalog.split("export function buildLocalLearningPlan", 1)[-1].split("export const PROFILE_SCHEMA_VERSION", 1)[0],
      "local learning plans include stage-specific guidance")


# Resource directory / product-positioning and fourth-language contracts.
resource_catalog = read("frontend/src/resources/resourceCatalog.js")
resource_hub = read("frontend/src/resources/ResourceHub.jsx")
resource_tests = read("frontend/src/resources/resourceCatalog.test.js")
telugu_catalog = read("frontend/src/student/teluguCatalog.js")
voice = read("frontend/src/voice/browserSpeech.js")
journey = read("frontend/src/student/StudentJourney.jsx")
check("export const RESOURCE_CATALOG" in resource_catalog and "https://www.w3schools.com/" in resource_catalog and "https://www.geeksforgeeks.org/" in resource_catalog and "https://india.khanacademy.org/" in resource_catalog and "https://ndl.iitkgp.ac.in/" in resource_catalog,
      "resource hub includes coding, India-aligned school learning and digital library resources")
check("target=\"_blank\" rel=\"noopener noreferrer\"" in resource_hub and "resource.url" in resource_hub,
      "resource cards open original third-party sources safely rather than re-hosting their content")
check("audience === 'saved' && !saved.has(resource.id)" in resource_catalog and "audience !== 'saved'" in resource_catalog,
      "saved-link filter treats bookmarks as saved IDs rather than an audience category")
check("te: {" in read("frontend/src/App.jsx") and '<option value="te">తెలుగు</option>' in read("frontend/src/App.jsx"),
      "main application language picker supports Telugu")
check("te: Object.assign({}, UI_TEXT.en" in frontend_catalog and "te: {" in frontend_catalog.split("export const STAGE_GUIDANCE", 1)[1],
      "learner journey includes Telugu interface strings and stage guidance")
check("export function localizedOptionLabel" in telugu_catalog and "export function localizeCareerPath" in telugu_catalog,
      "Telugu option and pathway localization helpers exist")
check("te: 'te-IN'" in voice and '<option value="te">తెలుగు</option>' in journey,
      "Telugu locale is connected to speech and learner-language selection")
check("<option value=\"te\">Telugu</option>" in read("frontend/src/partners/PartnerWorkspace.jsx"),
      "facilitator module authoring can declare Telugu content language")
check("['en', 'hi', 'ta', 'te'].includes(language)" in read("frontend/src/release/ImpactTrustConsole.jsx"),
      "impact event telemetry recognises Telugu interface locale")
check("'resourceCatalog.test.js'" in resource_tests or "describe('curated resource hub catalogue'" in resource_tests,
      "resource catalogue has a regression test suite")
check("Resource Hub — product and source policy" in read("docs/RESOURCE_HUB_RESEARCH.md"),
      "resource hub source policy and curated-source documentation exists")

for relative in (
    "frontend/src/student/careerCatalog.test.js",
    "frontend/scripts/check-resource-hub.mjs",
    "frontend/src/resources/resourceCatalog.test.js",
    "frontend/src/resources/ResourceHub.test.jsx",
    "frontend/src/student/teluguCatalog.js",
    "docs/RESOURCE_HUB_RESEARCH.md",
    "frontend/src/student/StudentJourney.test.jsx",
    "backend/src/test/java/in/udaansetu/platform/careers/CareerPathwayServiceTest.java",
    "backend/src/test/java/in/udaansetu/platform/learners/LearnerProfileServiceTest.java",
    "docs/PHASE_02_08_LEARNER_JOURNEY.md",
    "docs/PHASE_02_08_ACCEPTANCE.md",
    "docs/PHASE_02_08_TEAM_EXECUTION.md",
):
    check((ROOT / relative).is_file(), f"phase 02–08 implementation/test/documentation exists: {relative}")


# Phase 29–30 persistence and identity-boundary contracts.
pom = read("backend/pom.xml")
opportunity_catalogue = read("backend/src/main/java/in/udaansetu/platform/opportunity/OpportunityCatalogue.java")
review_repository = read("backend/src/main/java/in/udaansetu/platform/opportunity/OpportunityReviewRepository.java")
ingestion_service = read("backend/src/main/java/in/udaansetu/platform/opportunity/OpportunityIngestionService.java")
reviewer_access = read("backend/src/main/java/in/udaansetu/platform/privacy/DemoReviewerAccess.java")
identity_filter = read("backend/src/main/java/in/udaansetu/platform/security/PrototypeIdentityBoundaryFilter.java")
postgres_profile = read("backend/src/main/resources/application-postgres.yml")
prod_profile = read("backend/src/main/resources/application-prod.yml")
migration = read("backend/src/main/resources/db/migration/V1__create_opportunity_persistence.sql")
migration_v2 = read("backend/src/main/resources/db/migration/V2__add_pending_review_lookup_index.sql")
check("spring-boot-starter-jdbc" in pom and "flyway-core" in pom and "flyway-database-postgresql" in pom and "<artifactId>postgresql</artifactId>" in pom and "<artifactId>h2</artifactId>" in pom,
      "JDBC, Flyway, PostgreSQL and H2 dependencies exist")
check("opportunity_catalogue" in migration and "opportunity_review_queue" in migration and "payload_json TEXT" in migration,
      "Flyway migration defines durable catalogue and review queue tables")
check("JdbcTemplate" in opportunity_catalogue and "SELECT payload_json FROM opportunity_catalogue" in opportunity_catalogue and "@Transactional" in opportunity_catalogue,
      "opportunity catalogue has a transactional JDBC path and in-memory test mode")
check("seeds.stream().filter(seed -> !exists(seed.id())).forEach(this::publish)" in opportunity_catalogue,
      "application-start seed routine inserts only missing catalogue records")
update_block = opportunity_catalogue.split("UPDATE opportunity_catalogue", 1)[1].split(chr(34) * 3, 1)[0]
check("UPDATE opportunity_catalogue" in opportunity_catalogue and "created_at" not in update_block,
      "catalogue updates preserve the original created_at timestamp")
check("JdbcTemplate" in review_repository and "opportunity_review_queue" in review_repository and "@Transactional" in review_repository,
      "review queue is stored through a durable repository")
check("OpportunityReviewRepository" in ingestion_service and "@Transactional" in ingestion_service,
      "opportunity ingestion/review service participates in transactional persistence")
check("hasPendingCandidateId" in review_repository and "WHERE candidate_id = ? AND review_status = ?" in review_repository,
      "duplicate review detection uses indexed columns without deserializing the entire queue")
check("idx_opportunity_review_candidate_status" in migration_v2 and "(candidate_id, review_status)" in migration_v2,
      "additive Flyway migration adds composite index for pending-duplicate queries")
check("catalogue.exists(input.id()) || hasPendingCandidateId(input.id())" in ingestion_service,
      "ingestion duplicate validation calls the focused pending-candidate query")
check("MessageDigest.isEqual" in reviewer_access and "token.length() < 24" in reviewer_access,
      "shared reviewer gate enforces minimum token strength and constant-time comparison")
check("PrototypeIdentityBoundaryFilter" in identity_filter and "PROTOTYPE_IDENTITY_DISABLED" in identity_filter,
      "production-safe identity filter fails closed for prototype-only routes")
check("APP_DATASOURCE_URL" in postgres_profile and "org.postgresql.Driver" in postgres_profile,
      "PostgreSQL profile is configured for the platform API")
check("prototype-identities-enabled: false" in prod_profile,
      "production profile disables spoofable prototype identity headers")
check((ROOT / "backend/src/test/java/in/udaansetu/platform/opportunity/OpportunityPersistenceIntegrationTest.java").is_file(),
      "database round-trip integration tests exist")
check((ROOT / "backend/src/test/java/in/udaansetu/platform/security/PrototypeIdentityBoundaryFilterTest.java").is_file(),
      "production identity boundary tests exist")
check((ROOT / "compose.production.yaml").is_file() and "postgres-data" in read("compose.yaml"),
      "production-safe compose override and persistent database volume exist")

manifest_path = ROOT / "phase-manifest.json"
try:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    check(manifest.get("version", "").startswith("0.7.1"), "cumulative phase manifest version reflects resource hub and Telugu localization")
except Exception as exc:
    check(False, f"phase manifest parses ({exc})")

print(f"\nIntegration contract checks: {checks - len(errors)}/{checks} passed")
if errors:
    print("Failed checks:", file=sys.stderr)
    for error in errors:
        print(f" - {error}", file=sys.stderr)
    sys.exit(1)
print("These are offline source-contract checks only; run the dependency-aware release gate for final verification.")
