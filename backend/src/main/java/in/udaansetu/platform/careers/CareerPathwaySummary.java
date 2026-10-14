package in.udaansetu.platform.careers;

import java.util.Set;

public record CareerPathwaySummary(String pathwayId, String category, String title, String summary, Set<String> interestTags) {}
