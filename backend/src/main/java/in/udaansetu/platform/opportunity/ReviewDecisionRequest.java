package in.udaansetu.platform.opportunity;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewDecisionRequest(@NotNull Boolean approved, @Size(max = 500) String note) { }
