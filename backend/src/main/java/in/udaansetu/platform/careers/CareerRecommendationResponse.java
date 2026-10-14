package in.udaansetu.platform.careers;

import java.time.Instant;
import java.util.List;

public record CareerRecommendationResponse(List<CareerRecommendationItem> items, Instant generatedAt, String disclaimer) {
    public CareerRecommendationResponse { items = items == null ? List.of() : List.copyOf(items); }
}
