package in.udaansetu.platform.health;

import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {
    private static final String SERVICE_NAME = "udaan-setu-platform-api";

    private final String version;

    public HealthController(@Value("${app.version:0.7.1}") String version) {
        this.version = version;
    }

    @GetMapping
    public HealthResponse health() {
        return new HealthResponse("UP", SERVICE_NAME, version, Instant.now());
    }

    @GetMapping("/live")
    public HealthResponse liveness() {
        return new HealthResponse("UP", SERVICE_NAME, version, Instant.now());
    }
}
