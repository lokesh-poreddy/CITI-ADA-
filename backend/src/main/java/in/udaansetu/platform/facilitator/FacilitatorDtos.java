package in.udaansetu.platform.facilitator;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/** DTO contracts for facilitator cohort support. Store only the minimum information needed. */
public final class FacilitatorDtos {
    private FacilitatorDtos() {}

    public record CohortCreateRequest(
            @NotBlank @Size(max = 100) String name,
            @Size(max = 100) String region,
            @Size(max = 300) String purpose) {}

    public record CohortLearnerRequest(
            @NotBlank @Size(max = 80) String learnerKey,
            @NotBlank @Size(max = 70) String displayAlias,
            @AssertTrue(message = "Learner consent must be recorded before adding a learner") boolean consentRecorded) {}

    public record LearnerLink(String learnerKey, String displayAlias, boolean consentRecorded, Instant linkedAt) {}

    public record Cohort(String id, String ownerKey, String name, String region, String purpose,
            Instant createdAt, List<LearnerLink> learners, boolean demoRecord) {}

    public record ReferralCreateRequest(
            @NotBlank String cohortId,
            @NotBlank @Size(max = 80) String learnerKey,
            @NotBlank @Size(max = 40) String targetType,
            @NotBlank @Size(max = 120) String targetId,
            @NotBlank @Size(max = 400) String summary,
            LocalDate followUpDate,
            @AssertTrue(message = "Consent must be recorded before creating a referral") boolean consentRecorded) {}

    public record Referral(String id, String cohortId, String learnerKey, String targetType, String targetId,
            String summary, LocalDate followUpDate, String status, String createdBy, Instant createdAt) {}
}
