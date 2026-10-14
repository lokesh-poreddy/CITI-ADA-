package in.udaansetu.platform.opportunity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record IngestionCandidateRequest(
        @NotBlank @Size(max = 100) String id,
        @NotBlank @Size(max = 180) String title,
        @NotBlank @Size(max = 2000) String summary,
        @NotNull OpportunityType type,
        @NotBlank @Size(max = 180) String provider,
        @Size(max = 120) String locationLabel,
        @NotBlank @Size(max = 180) String sourceName,
        @NotBlank @Size(max = 500) String sourceUrl,
        @Size(max = 500) String applicationUrl,
        LocalDate opensOn,
        LocalDate deadline,
        Set<@Size(max = 20) String> languageCodes,
        List<@Size(max = 80) String> tags,
        Set<@Size(max = 80) String> eligibleEducationLevels,
        Set<@Size(max = 80) String> eligibleStates,
        @Min(13) Integer minAge,
        @Min(13) Integer maxAge,
        @PositiveOrZero Long maxAnnualFamilyIncomeInr,
        boolean eligibilityRulesConfigured,
        List<@Size(max = 180) String> requiredDocuments,
        @Size(max = 500) String applicationInstruction
) { }
