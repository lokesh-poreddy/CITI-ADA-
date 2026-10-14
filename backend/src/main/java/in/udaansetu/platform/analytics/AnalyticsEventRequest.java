package in.udaansetu.platform.analytics;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/** Aggregate analytics event. The contract intentionally has no user ID, free text, query, or PII field. */
public record AnalyticsEventRequest(
        @NotNull MetricEventName eventName,
        @NotNull MetricActorRole actorRole,
        @NotNull ConnectivityMode connectivity,
        @Pattern(regexp = "en|hi|ta|unknown") String language) {
    public AnalyticsEventRequest {
        if (language == null || language.isBlank()) language = "unknown";
    }
}
