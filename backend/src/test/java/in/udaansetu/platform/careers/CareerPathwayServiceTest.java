package in.udaansetu.platform.careers;

import static org.junit.jupiter.api.Assertions.*;
import in.udaansetu.platform.learners.LearnerProfileCreatedResponse;
import in.udaansetu.platform.learners.LearnerProfileRequest;
import in.udaansetu.platform.learners.LearnerProfileService;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CareerPathwayServiceTest {
    private LearnerProfileService profiles;
    private CareerPathwayService pathways;

    @BeforeEach
    void setUp() {
        profiles = new LearnerProfileService();
        pathways = new CareerPathwayService(profiles);
    }

    @Test
    void recommendsRelevantHandsOnPathwaysWithMoreThanOneOption() {
        LearnerProfileCreatedResponse learner = profiles.create(new LearnerProfileRequest(
                "diploma_iti", "en", List.of("handsOn", "technology"),
                List.of("practical", "problemSolving"), List.of("skillCertificate", "employment"), true));

        CareerRecommendationResponse response = pathways.recommend(learner.learnerId());

        assertEquals(3, response.items().size());
        assertEquals("skilled-technical", response.items().get(0).pathwayId());
        assertTrue(response.items().get(0).relativeFit() > response.items().get(1).relativeFit());
        assertTrue(response.items().stream().map(CareerRecommendationItem::pathwayId).distinct().count() == 3);
        assertTrue(response.disclaimer().contains("not an assessment"));

        CareerRecommendationResponse repeated = pathways.recommend(learner.learnerId());
        assertEquals(response.items().stream().map(CareerRecommendationItem::pathwayId).toList(),
                repeated.items().stream().map(CareerRecommendationItem::pathwayId).toList());
        assertEquals(response.items().stream().map(CareerRecommendationItem::matchedSignals).toList(),
                repeated.items().stream().map(CareerRecommendationItem::matchedSignals).toList());
    }

    @Test
    void rejectsExpiredOrUnknownTemporaryProfile() {
        var error = assertThrows(org.springframework.web.server.ResponseStatusException.class,
                () -> pathways.recommend("learner-00000000-0000-0000-0000-000000000000"));
        assertEquals(404, error.getStatusCode().value());
    }

    @Test
    void catalogueHasUniqueIdsAndActionableSteps() {
        assertEquals(6, pathways.catalogueSizeForTests());
        var all = pathways.list();
        assertEquals(all.size(), all.stream().map(CareerPathwaySummary::pathwayId).distinct().count());
        for (var entry : all) {
            var detail = pathways.detail(entry.pathwayId());
            assertEquals(3, detail.steps().size());
            assertFalse(detail.resources().isEmpty());
            assertTrue(detail.resources().stream().allMatch(resource -> resource.url().startsWith("https://")));
            assertFalse(detail.caution().isBlank());
        }
    }
}
