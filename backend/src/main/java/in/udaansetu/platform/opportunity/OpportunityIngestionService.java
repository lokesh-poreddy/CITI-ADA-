package in.udaansetu.platform.opportunity;

import java.net.URI;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

/** Stages submissions for human review; it never crawls a URL or publishes on ingestion alone. */
@Service
public class OpportunityIngestionService {
    private static final Set<String> OFFICIAL_HOSTS = Set.of(
            "scholarships.gov.in", "swayam.gov.in", "www.swayam.gov.in", "skillindiadigital.gov.in",
            "www.skillindiadigital.gov.in", "diksha.gov.in", "www.diksha.gov.in", "ncs.gov.in", "www.ncs.gov.in",
            "bhashini.gov.in", "www.bhashini.gov.in", "apprenticeshipindia.gov.in", "www.apprenticeshipindia.gov.in");
    private final OpportunityCatalogue catalogue;
    private final OpportunityReviewRepository reviewRepository;
    private final Map<String, ReviewQueueItem> inMemoryQueue = new ConcurrentHashMap<>();

    /** Test-only constructor for focused in-memory service tests. */
    public OpportunityIngestionService(OpportunityCatalogue catalogue) { this(catalogue, null); }

    @Autowired
    public OpportunityIngestionService(OpportunityCatalogue catalogue, OpportunityReviewRepository reviewRepository) {
        this.catalogue = catalogue;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public List<ReviewQueueItem> previewAndStage(IngestionPreviewRequest request) {
        List<ReviewQueueItem> staged = new ArrayList<>();
        for (IngestionCandidateRequest input : request.records()) {
            List<ValidationFinding> findings = validate(input);
            SourceTrust trust = isOfficial(input.sourceUrl()) ? SourceTrust.OFFICIAL_PORTAL : SourceTrust.UNVERIFIED;
            Opportunity candidate = new Opportunity(input.id(), input.title().trim(), input.summary().trim(), input.type(),
                    input.provider().trim(), blankTo(input.locationLabel(), "Not specified"),
                    input.languageCodes() == null ? Set.of() : input.languageCodes(), input.tags() == null ? List.of() : input.tags(),
                    input.sourceName().trim(), input.sourceUrl().trim(), blankTo(input.applicationUrl(), input.sourceUrl()).trim(),
                    trust, ListingStatus.REVIEW_REQUIRED, null, input.opensOn(), input.deadline(),
                    input.eligibleEducationLevels() == null ? Set.of() : input.eligibleEducationLevels(),
                    input.eligibleStates() == null ? Set.of() : input.eligibleStates(), input.minAge(), input.maxAge(),
                    input.maxAnnualFamilyIncomeInr(), input.eligibilityRulesConfigured(), false,
                    input.requiredDocuments() == null ? List.of() : input.requiredDocuments(),
                    blankTo(input.applicationInstruction(), "Open the source and confirm current details."));
            String reviewId = UUID.randomUUID().toString();
            ReviewQueueItem item = new ReviewQueueItem(reviewId, candidate, List.copyOf(findings), "PENDING", Instant.now(), null, null);
            save(item);
            staged.add(item);
        }
        return List.copyOf(staged);
    }

    public List<ReviewQueueItem> queue(String status) {
        return queueValues().stream()
                .filter(item -> status == null || status.isBlank() || item.reviewStatus().equalsIgnoreCase(status))
                .sorted(Comparator.comparing(ReviewQueueItem::submittedAt).reversed()).toList();
    }

    @Transactional
    public ReviewQueueItem review(String reviewId, ReviewDecisionRequest decision) {
        ReviewQueueItem current = findReview(reviewId).orElse(null);
        if (current == null) throw new OpportunityNotFoundException(reviewId);
        if (!"PENDING".equals(current.reviewStatus())) throw new IllegalStateException("This review item has already been decided.");
        if (Boolean.TRUE.equals(decision.approved())) {
            List<ValidationFinding> blockers = current.findings().stream().filter(f -> "BLOCKER".equals(f.severity())).toList();
            if (!blockers.isEmpty()) throw new IllegalArgumentException("This record has blocking validation findings and cannot be approved.");
            boolean manualTrustReview = current.candidate().sourceTrust() == SourceTrust.UNVERIFIED
                    || current.findings().stream().anyMatch(f -> "APPLICATION_HOST_REVIEW_REQUIRED".equals(f.code()));
            if (manualTrustReview && (decision.note() == null || decision.note().trim().length() < 10)) {
                throw new IllegalArgumentException("A meaningful reviewer note of at least 10 characters is required for a non-allowlisted or external application host.");
            }
            Opportunity c = current.candidate();
            SourceTrust trust = c.sourceTrust() == SourceTrust.OFFICIAL_PORTAL ? SourceTrust.OFFICIAL_PORTAL : SourceTrust.REVIEWED_PARTNER;
            Opportunity published = withStatus(c, ListingStatus.PUBLISHED, trust, LocalDate.now());
            catalogue.publish(published);
            ReviewQueueItem done = new ReviewQueueItem(current.reviewId(), published, current.findings(), "APPROVED", current.submittedAt(), Instant.now(), safeNote(decision.note()));
            save(done);
            return done;
        }
        ReviewQueueItem rejected = new ReviewQueueItem(current.reviewId(), current.candidate(), current.findings(), "REJECTED", current.submittedAt(), Instant.now(), safeNote(decision.note()));
        save(rejected);
        return rejected;
    }

    private List<ReviewQueueItem> queueValues() {
        return reviewRepository == null ? List.copyOf(inMemoryQueue.values()) : reviewRepository.findAll();
    }

    private boolean hasPendingCandidateId(String candidateId) {
        if (reviewRepository != null) return reviewRepository.hasPendingCandidateId(candidateId);
        return inMemoryQueue.values().stream()
                .anyMatch(item -> "PENDING".equals(item.reviewStatus())
                        && item.candidate().id().equals(candidateId));
    }

    private java.util.Optional<ReviewQueueItem> findReview(String reviewId) {
        return reviewRepository == null ? java.util.Optional.ofNullable(inMemoryQueue.get(reviewId)) : reviewRepository.findById(reviewId);
    }

    private void save(ReviewQueueItem item) {
        if (reviewRepository == null) inMemoryQueue.put(item.reviewId(), item);
        else reviewRepository.save(item);
    }

    private List<ValidationFinding> validate(IngestionCandidateRequest input) {
        List<ValidationFinding> findings = new ArrayList<>();
        if (catalogue.exists(input.id()) || hasPendingCandidateId(input.id())) findings.add(new ValidationFinding("BLOCKER", "DUPLICATE_ID", "An opportunity with this ID already exists or is already pending review."));
        if (input.deadline() != null && input.opensOn() != null && input.deadline().isBefore(input.opensOn()))
            findings.add(new ValidationFinding("BLOCKER", "INVALID_DATE_RANGE", "Deadline is before the opening date."));
        if (input.deadline() != null && input.deadline().isBefore(LocalDate.now()))
            findings.add(new ValidationFinding("WARNING", "DEADLINE_PASSED", "Deadline is in the past; verify whether this is a historical or expired record."));
        if (input.minAge() != null && input.maxAge() != null && input.minAge() > input.maxAge())
            findings.add(new ValidationFinding("BLOCKER", "INVALID_AGE_RANGE", "Minimum age exceeds maximum age."));
        try {
            URI uri = URI.create(input.sourceUrl());
            if (!"https".equalsIgnoreCase(uri.getScheme()) || uri.getHost() == null)
                findings.add(new ValidationFinding("BLOCKER", "SOURCE_MUST_USE_HTTPS", "Source URL must be a valid HTTPS URL."));
            else if (!isOfficial(input.sourceUrl()))
                findings.add(new ValidationFinding("WARNING", "SOURCE_REQUIRES_MANUAL_REVIEW", "Source host is not on the starter allowlist and requires human review."));
        } catch (RuntimeException ex) {
            findings.add(new ValidationFinding("BLOCKER", "INVALID_SOURCE_URL", "Source URL is invalid."));
        }
        if (!input.eligibilityRulesConfigured()) findings.add(new ValidationFinding("WARNING", "ELIGIBILITY_NOT_STRUCTURED", "Eligibility is not encoded as reviewable rules; checker must return NEEDS_REVIEW."));
        if (input.applicationUrl() != null && !input.applicationUrl().isBlank()) {
            try {
                URI app = URI.create(input.applicationUrl());
                if (!"https".equalsIgnoreCase(app.getScheme()) || app.getHost() == null) {
                    findings.add(new ValidationFinding("BLOCKER", "INVALID_APPLICATION_URL", "Application URL must use HTTPS."));
                } else {
                    URI source = URI.create(input.sourceUrl());
                    boolean sameHost = source.getHost() != null && source.getHost().equalsIgnoreCase(app.getHost());
                    if (!sameHost && !isOfficial(input.applicationUrl())) {
                        findings.add(new ValidationFinding("WARNING", "APPLICATION_HOST_REVIEW_REQUIRED", "Application URL uses a different non-allowlisted host; reviewer must inspect this destination and add a note."));
                    }
                }
            } catch (RuntimeException ex) { findings.add(new ValidationFinding("BLOCKER", "INVALID_APPLICATION_URL", "Application URL is invalid.")); }
        }
        return findings;
    }

    private boolean isOfficial(String url) {
        try { return OFFICIAL_HOSTS.contains(URI.create(url).getHost().toLowerCase(Locale.ROOT)); }
        catch (RuntimeException ex) { return false; }
    }
    private String blankTo(String value, String fallback) { return value == null || value.isBlank() ? fallback : value; }
    private String safeNote(String value) { return value == null ? "" : value.trim().substring(0, Math.min(500, value.trim().length())); }
    private Opportunity withStatus(Opportunity c, ListingStatus status, SourceTrust trust, LocalDate verifiedAt) {
        return new Opportunity(c.id(), c.title(), c.summary(), c.type(), c.provider(), c.locationLabel(), c.languageCodes(), c.tags(), c.sourceName(), c.sourceUrl(), c.applicationUrl(), trust, status, verifiedAt, c.opensOn(), c.deadline(), c.eligibleEducationLevels(), c.eligibleStates(), c.minAge(), c.maxAge(), c.maxAnnualFamilyIncomeInr(), c.eligibilityRulesConfigured(), c.demoOnly(), c.requiredDocuments(), c.nextStep());
    }
}
