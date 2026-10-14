package in.udaansetu.platform.mentors;

import in.udaansetu.platform.mentors.MentorDtos.*;
import in.udaansetu.platform.privacy.DemoReviewerAccess;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/mentors")
public class MentorController {
    private final MentorService service; private final DemoReviewerAccess reviewerAccess;
    public MentorController(MentorService service, DemoReviewerAccess reviewerAccess) { this.service=service; this.reviewerAccess=reviewerAccess; }
    @GetMapping public List<MentorProfile> discover(@RequestParam(required=false) String expertise, @RequestParam(required=false) String language, @RequestParam(required=false) String region) { return service.discover(expertise,language,region); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public MentorProfile submit(@Valid @RequestBody MentorSubmission request) { return service.submit(request); }
    @GetMapping("/review-queue") public List<MentorProfile> reviewQueue(@RequestHeader("X-Reviewer-Token") String token) { reviewerAccess.requireConfiguredReviewer(token); return service.reviewQueue(); }
    @PostMapping("/{id}/verify") public MentorProfile verify(@RequestHeader("X-Reviewer-Token") String token, @PathVariable String id, @Valid @RequestBody MentorVerificationRequest request) { reviewerAccess.requireConfiguredReviewer(token); return service.verify(id,request); }
    @PostMapping("/{id}/connection-requests") @ResponseStatus(HttpStatus.CREATED) public MentorConnectionRequest connect(@PathVariable String id, @Valid @RequestBody ConnectionRequest request) { return service.requestConnection(id,request); }
    @GetMapping("/connection-requests") public List<MentorConnectionRequest> requests(@RequestHeader("X-Actor-Key") String facilitatorKey) { return service.listRequests(facilitatorKey); }
}
