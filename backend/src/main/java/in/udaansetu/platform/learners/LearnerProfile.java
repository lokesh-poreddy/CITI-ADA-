package in.udaansetu.platform.learners;

import java.time.Instant;

public record LearnerProfile(String learnerId, LearnerProfileRequest profile, Instant createdAt, Instant expiresAt) {}
