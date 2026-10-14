package in.udaansetu.platform.opportunity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

/** Integration test for serialization round-trips through the configured relational schema. */
@SpringBootTest
class OpportunityPersistenceIntegrationTest {
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private OpportunityCatalogue catalogue;
    @Autowired private OpportunityReviewRepository reviewRepository;

    @Test
    void catalogueRecordSurvivesRepositoryReconstruction() {
        String id = "durable-test-" + UUID.randomUUID().toString().replace("-", "");
        Opportunity expected = new Opportunity(id, "Persistence verification sample",
                "Synthetic record used by automated integration tests.", OpportunityType.COURSE,
                "Test provider", "All India", Set.of("en", "ta"), List.of("test", "persistence"),
                "Test source", "https://example.org/source", "https://example.org/apply",
                SourceTrust.REFERENCE_ONLY, ListingStatus.REFERENCE_ONLY, LocalDate.now(), null, null,
                Set.of(), Set.of(), null, null, null, false, true, List.of(),
                "Test fixture only; not a real opportunity.");

        catalogue.publish(expected);
        OpportunityCatalogue reconstructed = new OpportunityCatalogue(jdbcTemplate, objectMapper);

        assertEquals(expected, reconstructed.findById(id).orElseThrow());
        assertTrue(jdbcTemplate.queryForObject("SELECT COUNT(*) FROM opportunity_catalogue WHERE id = ?", Integer.class, id) > 0);
    }


    @Test
    void startupSeedingDoesNotOverwriteReviewedCatalogueEdits() {
        String id = "nsp-scholarship-discovery";
        Opportunity original = catalogue.findById(id).orElseThrow();
        java.sql.Timestamp createdBefore = jdbcTemplate.queryForObject(
                "SELECT created_at FROM opportunity_catalogue WHERE id = ?", java.sql.Timestamp.class, id);
        assertNotNull(createdBefore);
        Opportunity reviewedEdit = new Opportunity(original.id(), "Reviewed title preserved", original.summary(),
                original.type(), original.provider(), original.locationLabel(), original.languageCodes(), original.tags(),
                original.sourceName(), original.sourceUrl(), original.applicationUrl(), original.sourceTrust(),
                original.listingStatus(), original.lastVerifiedAt(), original.opensOn(), original.deadline(),
                original.eligibleEducationLevels(), original.eligibleStates(), original.minAge(), original.maxAge(),
                original.maxAnnualFamilyIncomeInr(), original.eligibilityRulesConfigured(), original.demoOnly(),
                original.requiredDocuments(), original.nextStep());
        try {
            catalogue.publish(reviewedEdit);
            catalogue.seedDatabaseAfterMigrations();
            assertEquals("Reviewed title preserved", catalogue.findById(id).orElseThrow().title(),
                    "application re-seeding must not overwrite reviewed records");
            java.sql.Timestamp createdAfter = jdbcTemplate.queryForObject(
                    "SELECT created_at FROM opportunity_catalogue WHERE id = ?", java.sql.Timestamp.class, id);
            assertEquals(createdBefore, createdAfter, "updating a record must preserve created_at");
        } finally {
            catalogue.publish(original);
        }
    }

    @Test
    void pendingReviewRecordSurvivesRepositoryReconstruction() {
        String id = "review-durable-test-" + UUID.randomUUID().toString().replace("-", "");
        Opportunity candidate = new Opportunity(id, "Pending review sample", "Synthetic review candidate.",
                OpportunityType.COURSE, "Test provider", "All India", Set.of("en"), List.of("test"),
                "Test source", "https://example.org/source", "https://example.org/apply", SourceTrust.UNVERIFIED,
                ListingStatus.REVIEW_REQUIRED, null, null, null, Set.of(), Set.of(), null, null, null,
                false, true, List.of(), "Test fixture only.");
        ReviewQueueItem expected = new ReviewQueueItem(UUID.randomUUID().toString(), candidate,
                List.of(new ValidationFinding("WARNING", "TEST_FIXTURE", "Synthetic record only.")),
                "PENDING", Instant.now(), null, null);

        reviewRepository.save(expected);
        OpportunityReviewRepository reconstructed = new OpportunityReviewRepository(jdbcTemplate, objectMapper);

        assertEquals(expected, reconstructed.findById(expected.reviewId()).orElseThrow());
        assertTrue(reconstructed.findAll().stream().anyMatch(item -> item.reviewId().equals(expected.reviewId())));
        assertTrue(reconstructed.hasPendingCandidateId(id));

        ReviewQueueItem approved = new ReviewQueueItem(expected.reviewId(), candidate, expected.findings(),
                "APPROVED", expected.submittedAt(), Instant.now(), "Test-only reviewer note");
        reconstructed.save(approved);
        assertFalse(reconstructed.hasPendingCandidateId(id), "resolved review is no longer a pending duplicate");
    }
}
