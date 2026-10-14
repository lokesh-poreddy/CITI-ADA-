package in.udaansetu.platform.listings;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;

public final class PartnerListingDtos {
    private PartnerListingDtos() {}
    public enum ListingKind { APPRENTICESHIP, INTERNSHIP, ENTRY_LEVEL_JOB, TRAINING }
    public enum ListingStatus { DRAFT, PENDING_REVIEW, PUBLISHED, REJECTED }
    public record ListingCreateRequest(@NotBlank @Size(max=140) String title,
            @NotBlank @Size(max=120) String organization,
            @NotBlank @Size(max=900) String description,
            @NotBlank @Size(max=100) String location,
            @NotBlank @Size(max=60) String workMode,
            @NotBlank String kind,
            @NotBlank @Size(max=600) String eligibilitySummary,
            @NotBlank @Size(max=500) String applicationUrl,
            @Size(max=500) String sourceUrl,
            LocalDate deadline) {}
    public record PartnerListing(String id, String partnerKey, String title, String organization, String description,
            String location, String workMode, ListingKind kind, String eligibilitySummary, String applicationUrl,
            String sourceUrl, LocalDate deadline, ListingStatus status, boolean organizationVerified,
            boolean demoListing, Instant createdAt, Instant updatedAt, String reviewNote) {}
    public record ListingReviewRequest(@NotBlank String decision, @Size(max=400) String note) {}
}
