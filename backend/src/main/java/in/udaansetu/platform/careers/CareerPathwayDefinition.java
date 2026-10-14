package in.udaansetu.platform.careers;

import java.util.List;
import java.util.Set;

public record CareerPathwayDefinition(
        String id,
        String category,
        String title,
        String summary,
        Set<String> interests,
        Set<String> strengths,
        Set<String> goals,
        Set<String> academicStages,
        List<LearningStep> steps,
        List<LearningResource> resources,
        String caution
) {
    public CareerPathwayDefinition {
        interests = interests == null ? Set.of() : Set.copyOf(interests);
        strengths = strengths == null ? Set.of() : Set.copyOf(strengths);
        goals = goals == null ? Set.of() : Set.copyOf(goals);
        academicStages = academicStages == null ? Set.of() : Set.copyOf(academicStages);
        steps = steps == null ? List.of() : List.copyOf(steps);
        resources = resources == null ? List.of() : List.copyOf(resources);
    }
}
