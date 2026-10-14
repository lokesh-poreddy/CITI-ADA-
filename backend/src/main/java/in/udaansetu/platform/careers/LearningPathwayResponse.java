package in.udaansetu.platform.careers;

import java.util.List;

public record LearningPathwayResponse(
        String pathwayId, String title, String summary, List<LearningStep> steps,
        List<LearningResource> resources, String caution, String sourceNotice
) {
    public LearningPathwayResponse {
        steps = steps == null ? List.of() : List.copyOf(steps);
        resources = resources == null ? List.of() : List.copyOf(resources);
    }
}
