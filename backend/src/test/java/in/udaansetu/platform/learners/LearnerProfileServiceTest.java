package in.udaansetu.platform.learners;

import static org.junit.jupiter.api.Assertions.*;
import java.util.List;
import org.junit.jupiter.api.Test;

class LearnerProfileServiceTest {
    @Test
    void createsOpaqueTemporaryIdWithoutReturningProfileContent() {
        LearnerProfileService service = new LearnerProfileService();
        LearnerProfileRequest request = new LearnerProfileRequest("std11_12", "ta",
                List.of("nature", "science"), List.of("practical"), List.of("skillCertificate"), true);

        LearnerProfileCreatedResponse result = service.create(request);

        assertTrue(result.learnerId().matches("^learner-[0-9a-fA-F-]{36}$"));
        assertEquals("IN_MEMORY_TTL_30_MINUTES", result.storageMode());
        assertTrue(result.expiresAt().isAfter(result.createdAt()));
        assertEquals(1, service.activeProfileCountForTests());
        var stored = service.findActive(result.learnerId()).orElseThrow();
        assertEquals("ta", stored.profile().preferredLanguage());
        assertFalse(result.notice().isBlank());
    }

    @Test
    void deleteRemovesTemporaryProfileAndRejectsMalformedIdentifiers() {
        LearnerProfileService service = new LearnerProfileService();
        LearnerProfileCreatedResponse result = service.create(new LearnerProfileRequest("std9_10", "en",
                List.of("handsOn"), List.of(), List.of("skillCertificate"), true));
        assertTrue(service.delete(result.learnerId()));
        assertTrue(service.findActive(result.learnerId()).isEmpty());
        assertFalse(service.delete("not-a-learner-id"));
    }

    @Test
    void returnsEmptyForUnknownOrMalformedProfileIdentifiers() {
        LearnerProfileService service = new LearnerProfileService();
        assertTrue(service.findActive("learner-00000000-0000-0000-0000-000000000000").isEmpty());
        assertTrue(service.findActive("not-a-learner-id").isEmpty());
        assertTrue(service.findActive(null).isEmpty());
    }
}
