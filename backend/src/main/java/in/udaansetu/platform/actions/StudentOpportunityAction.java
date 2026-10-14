package in.udaansetu.platform.actions;

import java.time.Instant;

/** Contains no free-text notes; anonymous learner keys are prototype identifiers, not authentication. */
public record StudentOpportunityAction(
        String id,
        String clientEventId,
        String opportunityId,
        ActionStatus status,
        Instant createdAt,
        Instant updatedAt,
        String syncStatus
) { }
