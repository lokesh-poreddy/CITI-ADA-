package in.udaansetu.platform.analytics;

import java.time.LocalDate;
import java.util.Map;

public record AnalyticsSummary(
        LocalDate generatedOn,
        long totalEvents,
        Map<String, Long> byEvent,
        Map<String, Long> byRole,
        Map<String, Long> byLanguage,
        Map<String, Long> byConnectivity,
        String storageMode,
        String privacyNote) {}
