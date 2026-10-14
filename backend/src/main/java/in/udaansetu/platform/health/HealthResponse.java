package in.udaansetu.platform.health;

import java.time.Instant;

/** Small, stable health contract. Never add secrets or user data here. */
public record HealthResponse(
        String status,
        String service,
        String version,
        Instant timestamp
) { }
