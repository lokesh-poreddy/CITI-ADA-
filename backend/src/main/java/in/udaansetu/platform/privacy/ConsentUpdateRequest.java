package in.udaansetu.platform.privacy;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ConsentUpdateRequest(
        @NotNull ConsentScope scope,
        @NotNull Boolean granted,
        @NotBlank @Size(max = 40) String policyVersion) {}
