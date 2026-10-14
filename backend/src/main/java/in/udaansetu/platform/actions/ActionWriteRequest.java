package in.udaansetu.platform.actions;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ActionWriteRequest(
        @NotBlank @Size(max = 80) @Pattern(regexp = "[A-Za-z0-9_-]+") String clientEventId,
        @NotBlank @Size(max = 100) String opportunityId,
        @NotNull ActionStatus status
) { }
