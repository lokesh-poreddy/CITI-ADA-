package in.udaansetu.platform.mentors;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public final class MentorDtos {
    private MentorDtos() {}
    public record MentorSubmission(@NotBlank @Size(max=90) String displayName,
            @NotBlank @Size(max=120) String expertise,
            @NotBlank @Size(max=250) String bio,
            @NotBlank @Size(max=100) String region,
            @NotBlank @Size(max=100) String languages,
            @NotBlank @Size(max=120) String organization,
            @AssertTrue(message="Consent to mentor verification and safeguarding review is required") boolean verificationConsent) {}
    public record MentorProfile(String id, String displayName, String expertise, String bio, String region,
            List<String> languages, String organization, boolean verified, String availability,
            boolean demoProfile, Instant submittedAt) {}
    public record ConnectionRequest(@NotBlank @Size(max=70) String learnerAlias,
            @NotBlank @Size(max=300) String purpose,
            @NotBlank @Size(max=80) String facilitatorKey,
            @AssertTrue(message="A learner/guardian consent record is required") boolean consentConfirmed,
            @AssertTrue(message="Initial mentor contact must be facilitator-mediated") boolean facilitatorMediated,
            @AssertTrue(message="For this minor-inclusive prototype, guardian or institution approval must be confirmed") boolean guardianOrInstitutionApprovalConfirmed) {}
    public record MentorConnectionRequest(String id, String mentorId, String learnerAlias, String purpose,
            String facilitatorKey, String status, Instant createdAt, String safetyNote) {}
    public record MentorVerificationRequest(@NotBlank String decision, @Size(max=300) String note) {}
}
