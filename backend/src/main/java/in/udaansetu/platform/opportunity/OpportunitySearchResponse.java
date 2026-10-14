package in.udaansetu.platform.opportunity;

import java.time.Instant;
import java.util.List;

public record OpportunitySearchResponse(
        List<Opportunity> items,
        int total,
        int page,
        int size,
        Instant generatedAt,
        String dataNotice
) { }
