package in.udaansetu.platform.analytics;

import in.udaansetu.platform.privacy.DemoReviewerAccess;
import in.udaansetu.platform.privacy.ConsentScope;
import in.udaansetu.platform.privacy.PrivacyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
public class ImpactAnalyticsController {
    private final ImpactAnalyticsService service;
    private final DemoReviewerAccess reviewerAccess;
    private final PrivacyService privacyService;

    public ImpactAnalyticsController(ImpactAnalyticsService service, DemoReviewerAccess reviewerAccess, PrivacyService privacyService) {
        this.service = service;
        this.reviewerAccess = reviewerAccess;
        this.privacyService = privacyService;
    }

    @PostMapping("/events")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public AnalyticsEventAccepted accept(@RequestHeader(value = "X-Actor-Key", required = false) String actorKey,
            @Valid @RequestBody AnalyticsEventRequest request) {
        if (actorKey == null || !actorKey.matches("[A-Za-z0-9_-]{4,160}")) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "A valid prototype actor key is required to verify the optional analytics preference.");
        }
        if (!privacyService.hasConsent(actorKey, ConsentScope.OPTIONAL_ANALYTICS)) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Optional analytics consent is not enabled for this prototype actor.");
        }
        service.record(request);
        return new AnalyticsEventAccepted(true, true,
                "Aggregate only. Do not submit names, contact details, learner IDs or free text.");
    }

    @GetMapping("/summary")
    public AnalyticsSummary summary(@RequestHeader(value = "X-Reviewer-Token", required = false) String token) {
        reviewerAccess.requireConfiguredReviewer(token);
        return service.summary();
    }
}
