package in.udaansetu.platform.careers;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CareerRecommendationRequest(
        @NotBlank @Pattern(regexp = "^learner-[0-9a-fA-F-]{36}$") String learnerId
) {}
