package in.udaansetu.platform.learners;

import java.time.Instant;

public record LearnerProfileCreatedResponse(
        String learnerId,
        Instant createdAt,
        Instant expiresAt,
        String storageMode,
        String notice
) {}
