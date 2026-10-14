package in.udaansetu.platform.opportunity;

import java.util.List;

public record EligibilityCheckResponse(
        String opportunityId,
        String status,
        String explanation,
        List<String> matchedRules,
        List<String> missingInformation,
        String authorityNote
) { }
