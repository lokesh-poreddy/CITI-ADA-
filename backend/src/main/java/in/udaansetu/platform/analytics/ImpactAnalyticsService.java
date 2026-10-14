package in.udaansetu.platform.analytics;

import java.time.LocalDate;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.LongAdder;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * Privacy-minimizing prototype analytics. It retains aggregate counters only—not event rows,
 * learner identifiers, device fingerprints, opportunity queries, or free-text answers.
 * Storage is in-memory for the hackathon and resets on restart.
 */
@Service
public class ImpactAnalyticsService {
    private final Map<MetricEventName, LongAdder> eventCounts = new EnumMap<>(MetricEventName.class);
    private final Map<MetricActorRole, LongAdder> roleCounts = new EnumMap<>(MetricActorRole.class);
    private final Map<String, LongAdder> languageCounts = new LinkedHashMap<>();
    private final Map<ConnectivityMode, LongAdder> connectivityCounts = new EnumMap<>(ConnectivityMode.class);
    private final LongAdder total = new LongAdder();

    public ImpactAnalyticsService() {
        for (MetricEventName name : MetricEventName.values()) eventCounts.put(name, new LongAdder());
        for (MetricActorRole role : MetricActorRole.values()) roleCounts.put(role, new LongAdder());
        for (ConnectivityMode mode : ConnectivityMode.values()) connectivityCounts.put(mode, new LongAdder());
        for (String language : new String[] {"en", "hi", "ta", "unknown"}) languageCounts.put(language, new LongAdder());
    }

    public void record(AnalyticsEventRequest event) {
        // Fixed enumerations only. No raw request or actor context is kept after this method returns.
        eventCounts.get(event.eventName()).increment();
        roleCounts.get(event.actorRole()).increment();
        connectivityCounts.get(event.connectivity()).increment();
        String language = languageCounts.containsKey(event.language()) ? event.language() : "unknown";
        languageCounts.get(language).increment();
        total.increment();
    }

    public AnalyticsSummary summary() {
        return new AnalyticsSummary(LocalDate.now(), total.sum(), enumSnapshot(eventCounts), enumSnapshot(roleCounts),
                mapSnapshot(languageCounts), enumSnapshot(connectivityCounts), "IN_MEMORY_AGGREGATES",
                "Aggregate counters only; no learner-level event history or free-text payload is retained. Resets on restart.");
    }

    private static <E extends Enum<E>> Map<String, Long> enumSnapshot(Map<E, LongAdder> source) {
        Map<String, Long> result = new LinkedHashMap<>();
        source.forEach((key, value) -> result.put(key.name(), value.sum()));
        return Map.copyOf(result);
    }

    private static Map<String, Long> mapSnapshot(Map<String, LongAdder> source) {
        return source.entrySet().stream().collect(Collectors.toUnmodifiableMap(Map.Entry::getKey, entry -> entry.getValue().sum()));
    }
}
