package in.udaansetu.platform.opportunity;

import in.udaansetu.platform.privacy.DemoReviewerAccess;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Prototype reviewer gate. Replace with authenticated authorization before public deployment. */
@RestController
@RequestMapping("/api/v1/opportunity-ingestion")
public class OpportunityIngestionController {
    private final OpportunityIngestionService service;
    private final DemoReviewerAccess reviewerAccess;

    public OpportunityIngestionController(OpportunityIngestionService service, DemoReviewerAccess reviewerAccess) {
        this.service = service;
        this.reviewerAccess = reviewerAccess;
    }

    @PostMapping("/preview") @ResponseStatus(HttpStatus.CREATED)
    public List<ReviewQueueItem> preview(@RequestHeader("X-Reviewer-Token") String token, @Valid @RequestBody IngestionPreviewRequest request) {
        reviewerAccess.requireConfiguredReviewer(token);
        return service.previewAndStage(request);
    }

    @GetMapping("/review-queue")
    public List<ReviewQueueItem> queue(@RequestHeader("X-Reviewer-Token") String token, @RequestParam(required = false) String status) {
        reviewerAccess.requireConfiguredReviewer(token);
        return service.queue(status);
    }

    @PostMapping("/review-queue/{reviewId}/decision")
    public ReviewQueueItem decide(@RequestHeader("X-Reviewer-Token") String token, @PathVariable String reviewId, @Valid @RequestBody ReviewDecisionRequest decision) {
        reviewerAccess.requireConfiguredReviewer(token);
        return service.review(reviewId, decision);
    }


}
