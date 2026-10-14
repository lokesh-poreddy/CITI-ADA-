package in.udaansetu.platform.learners;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Service;

/**
 * Prototype-only, volatile storage. Profiles expire after 30 minutes and are never written to disk.
 * Production must replace this store and add authenticated object-level authorization and retention controls.
 */
@Service
public class LearnerProfileService {
    private static final Duration PROFILE_TTL = Duration.ofMinutes(30);
    private final ConcurrentMap<String, LearnerProfile> profiles = new ConcurrentHashMap<>();

    public LearnerProfileCreatedResponse create(LearnerProfileRequest request) {
        Instant now = Instant.now();
        expireOldProfiles(now);
        String id = "learner-" + UUID.randomUUID();
        LearnerProfile value = new LearnerProfile(id, request, now, now.plus(PROFILE_TTL));
        profiles.put(id, value);
        return new LearnerProfileCreatedResponse(id, now, value.expiresAt(), "IN_MEMORY_TTL_30_MINUTES",
                "Prototype only: this profile is kept in server memory for up to 30 minutes and disappears on restart. This is not an account or legal-consent workflow.");
    }

    public Optional<LearnerProfile> findActive(String learnerId) {
        if (learnerId == null || !learnerId.matches("^learner-[0-9a-fA-F-]{36}$")) return Optional.empty();
        Instant now = Instant.now();
        expireOldProfiles(now);
        LearnerProfile value = profiles.get(learnerId);
        if (value == null || !value.expiresAt().isAfter(now)) {
            profiles.remove(learnerId);
            return Optional.empty();
        }
        return Optional.of(value);
    }

    public boolean delete(String learnerId) {
        if (learnerId == null || !learnerId.matches("^learner-[0-9a-fA-F-]{36}$")) return false;
        return profiles.remove(learnerId) != null;
    }

    public int activeProfileCountForTests() {
        expireOldProfiles(Instant.now());
        return profiles.size();
    }

    private void expireOldProfiles(Instant now) {
        profiles.entrySet().removeIf(entry -> !entry.getValue().expiresAt().isAfter(now));
    }
}
