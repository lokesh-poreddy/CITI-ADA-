package in.udaansetu.platform.opportunity;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

/** Immutable opportunity catalogue entry. Official facts must remain traceable to sourceUrl. */
public record Opportunity(
        String id,
        String title,
        String summary,
        OpportunityType type,
        String provider,
        String locationLabel,
        Set<String> languageCodes,
        List<String> tags,
        String sourceName,
        String sourceUrl,
        String applicationUrl,
        SourceTrust sourceTrust,
        ListingStatus listingStatus,
        LocalDate lastVerifiedAt,
        LocalDate opensOn,
        LocalDate deadline,
        Set<String> eligibleEducationLevels,
        Set<String> eligibleStates,
        Integer minAge,
        Integer maxAge,
        Long maxAnnualFamilyIncomeInr,
        boolean eligibilityRulesConfigured,
        boolean demoOnly,
        List<String> requiredDocuments,
        String nextStep
) {
    public Opportunity {
        languageCodes = languageCodes == null ? Set.of() : Set.copyOf(languageCodes);
        tags = tags == null ? List.of() : List.copyOf(tags);
        eligibleEducationLevels = eligibleEducationLevels == null ? Set.of() : Set.copyOf(eligibleEducationLevels);
        eligibleStates = eligibleStates == null ? Set.of() : Set.copyOf(eligibleStates);
        requiredDocuments = requiredDocuments == null ? List.of() : List.copyOf(requiredDocuments);
    }
}
