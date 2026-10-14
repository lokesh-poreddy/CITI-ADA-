package in.udaansetu.platform.opportunity;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record EligibilityCheckRequest(
        @Size(max = 50) String educationLevel,
        @Size(max = 80) String state,
        @Min(13) @Max(100) Integer age,
        @PositiveOrZero Long annualFamilyIncomeInr
) { }
