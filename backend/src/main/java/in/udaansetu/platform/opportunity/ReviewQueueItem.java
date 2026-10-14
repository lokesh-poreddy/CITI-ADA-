package in.udaansetu.platform.opportunity;

import java.time.Instant;
import java.util.List;

public record ReviewQueueItem(
        String reviewId,
        Opportunity candidate,
        List<ValidationFinding> findings,
        String reviewStatus,
        Instant submittedAt,
        Instant reviewedAt,
        String reviewerNote
) { }
