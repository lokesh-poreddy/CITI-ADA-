package in.udaansetu.platform.learners;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Objects;

/** Minimal, non-identifying profile used only after explicit prototype-service opt-in. */
public record LearnerProfileRequest(
        @NotBlank @Pattern(regexp = "^(std9_10|std11_12|diploma_iti|undergraduate|graduate)$") String academicStage,
        @NotBlank @Pattern(regexp = "^(en|hi|ta)$") String preferredLanguage,
        @NotEmpty @Size(max = 10) List<@Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9_-]{1,39}$") String> interests,
        @Size(max = 8) List<@Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9_-]{1,39}$") String> strengths,
        @NotEmpty @Size(max = 5) List<@Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9_-]{1,39}$") String> goals,
        @AssertTrue boolean allowDemoProcessing
) {
    public LearnerProfileRequest {
        interests = interests == null ? List.of() : interests.stream().filter(Objects::nonNull).limit(10).toList();
        strengths = strengths == null ? List.of() : strengths.stream().filter(Objects::nonNull).limit(8).toList();
        goals = goals == null ? List.of() : goals.stream().filter(Objects::nonNull).limit(5).toList();
    }
}
