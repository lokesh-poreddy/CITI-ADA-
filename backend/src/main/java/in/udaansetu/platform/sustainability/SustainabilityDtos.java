package in.udaansetu.platform.sustainability;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public final class SustainabilityDtos {
    private SustainabilityDtos() {}
    public record RevenueModel(String id,String name,String whoPays,String valueHypothesis,String safeguards) {}
    public record SustainabilityOverview(String productPolicy,List<RevenueModel> models,List<String> validationQuestions,String paymentStatus) {}
    public record InterestRequest(@NotBlank @Size(max=120) String organizationName,
            @NotBlank @Size(max=80) String organizationType,
            @NotBlank @Size(max=60) String modelId,
            @Min(1) @Max(1000000) int approximateLearners,
            @Email @Size(max=160) String contactEmail,
            @Size(max=600) String notes,
            boolean consentToFollowUp) {}
    public record InterestRecord(String id,String organizationName,String organizationType,String modelId,
            int approximateLearners,String contactEmail,String notes,boolean consentToFollowUp,
            String status,Instant createdAt) {}
}
