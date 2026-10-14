package in.udaansetu.platform.release;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Public showcase metadata contains status only; no credentials or environment values are returned. */
@RestController
@RequestMapping("/api/v1/release")
public class ReleaseStatusController {
    private final String version;
    public ReleaseStatusController(@Value("${app.version:0.7.1}") String version) { this.version = version; }

    @GetMapping("/status")
    public ReleaseStatus status() {
        return new ReleaseStatus("UdaanSetu", version, "HACKATHON_PROTOTYPE", false,
                "RELATIONAL_CATALOGUE_AND_IN_MEMORY_FOR_OTHER_FEATURES", "DEMO_HEADERS_NOT_AUTHENTICATION",
                List.of("External government/partner API sync", "Email/SMS/push delivery", "Payment checkout", "Production AI provider", "Production identity provider and RBAC"),
                List.of("Replace prototype actor headers with a production identity provider and role-based authorization",
                        "Move remaining in-memory stores to governed persistence and test backup/restore",
                        "Review child safety, consent, data retention and applicable law",
                        "Run dependency, accessibility, load and disaster-recovery tests",
                        "Configure secrets and restrict operational endpoints at the network edge"));
    }
}
