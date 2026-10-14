package in.udaansetu.platform.analytics;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class ImpactAnalyticsServiceTest {
    @Test
    void aggregatesOnlyFixedDimensionsAndDoesNotExposeEventRows() {
        ImpactAnalyticsService service = new ImpactAnalyticsService();
        service.record(new AnalyticsEventRequest(MetricEventName.OPPORTUNITY_OPENED, MetricActorRole.STUDENT, ConnectivityMode.OFFLINE, "ta"));
        service.record(new AnalyticsEventRequest(MetricEventName.OPPORTUNITY_OPENED, MetricActorRole.STUDENT, ConnectivityMode.ONLINE, "ta"));
        service.record(new AnalyticsEventRequest(MetricEventName.TEST_EVENT, MetricActorRole.ANONYMOUS, ConnectivityMode.UNKNOWN, "en"));

        AnalyticsSummary summary = service.summary();
        assertEquals(3, summary.totalEvents());
        assertEquals(2L, summary.byEvent().get("OPPORTUNITY_OPENED"));
        assertEquals(2L, summary.byRole().get("STUDENT"));
        assertEquals(2L, summary.byLanguage().get("ta"));
        assertEquals("IN_MEMORY_AGGREGATES", summary.storageMode());
        org.junit.jupiter.api.Assertions.assertFalse(summary.toString().contains("learner-123"));
    }
}
