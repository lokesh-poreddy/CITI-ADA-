package in.udaansetu.platform.opportunity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

class OpportunityEligibilityEngineTest {
    private final OpportunityEligibilityEngine engine = new OpportunityEligibilityEngine();

    @Test
    void returnsRulesMatchOnlyWhenAllConfiguredInputsMatch() {
        EligibilityCheckResponse result = engine.check(fullyConfiguredOpportunity(),
                new EligibilityCheckRequest("12", "Tamil Nadu", 18, 200_000L));
        assertEquals("RULES_MATCH", result.status());
        assertEquals(4, result.matchedRules().size());
        org.junit.jupiter.api.Assertions.assertTrue(result.authorityNote().contains("official provider"));
    }

    @Test
    void asksOnlyForMissingInputsInsteadOfAssumingTheyDoNotMatch() {
        EligibilityCheckResponse result = engine.check(fullyConfiguredOpportunity(),
                new EligibilityCheckRequest("12", null, null, null));
        assertEquals("NEEDS_MORE_INFORMATION", result.status());
        assertEquals(3, result.missingInformation().size());
    }

    @Test
    void potentialMismatchIsNotPresentedAsAnOfficialRejection() {
        EligibilityCheckResponse result = engine.check(fullyConfiguredOpportunity(),
                new EligibilityCheckRequest("12", "Tamil Nadu", 45, 200_000L));
        assertEquals("POSSIBLE_MISMATCH", result.status());
        org.junit.jupiter.api.Assertions.assertTrue(result.authorityNote().contains("not be used as the sole reason"));
    }

    private Opportunity fullyConfiguredOpportunity() {
        return new Opportunity("test-scholarship", "Test scholarship", "Test record", OpportunityType.SCHOLARSHIP,
                "Test provider", "Tamil Nadu", Set.of("en"), List.of("test"), "Test source",
                "https://example.gov.in/source", "https://example.gov.in/apply", SourceTrust.OFFICIAL_PORTAL,
                ListingStatus.PUBLISHED, LocalDate.now(), null, null, Set.of("12"), Set.of("Tamil Nadu"),
                16, 25, 300_000L, true, true, List.of(), "Check the source.");
    }
}
