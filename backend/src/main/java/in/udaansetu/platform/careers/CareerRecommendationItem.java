package in.udaansetu.platform.careers;

import java.util.List;

public record CareerRecommendationItem(
        String pathwayId,
        int relativeFit,
        List<String> matchedSignals,
        String explanation
) {
    public CareerRecommendationItem {
        matchedSignals = matchedSignals == null ? List.of() : List.copyOf(matchedSignals);
    }
}
