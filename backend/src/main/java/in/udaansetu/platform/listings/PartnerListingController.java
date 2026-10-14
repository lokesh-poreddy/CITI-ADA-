package in.udaansetu.platform.listings;

import in.udaansetu.platform.listings.PartnerListingDtos.*;
import in.udaansetu.platform.privacy.DemoReviewerAccess;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/partner-listings")
public class PartnerListingController {
    private final PartnerListingService service; private final DemoReviewerAccess reviewerAccess;
    public PartnerListingController(PartnerListingService service, DemoReviewerAccess reviewerAccess){this.service=service;this.reviewerAccess=reviewerAccess;}
    @GetMapping public List<PartnerListing> browse(@RequestParam(required=false) String kind,@RequestParam(required=false) String location,@RequestParam(required=false) String q){return service.browse(kind,location,q);}
    @GetMapping("/mine") public List<PartnerListing> mine(@RequestHeader("X-Partner-Key") String partnerKey){return service.mine(partnerKey);}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public PartnerListing create(@RequestHeader("X-Partner-Key") String partnerKey,@Valid @RequestBody ListingCreateRequest request){return service.create(partnerKey,request);}
    @PostMapping("/{id}/submit") public PartnerListing submit(@RequestHeader("X-Partner-Key") String partnerKey,@PathVariable String id){return service.submit(partnerKey,id);}
    @GetMapping("/review-queue") public List<PartnerListing> reviewQueue(@RequestHeader("X-Reviewer-Token") String token){reviewerAccess.requireConfiguredReviewer(token);return service.reviewQueue();}
    @PostMapping("/{id}/review") public PartnerListing review(@RequestHeader("X-Reviewer-Token") String token,@PathVariable String id,@Valid @RequestBody ListingReviewRequest request){reviewerAccess.requireConfiguredReviewer(token);return service.review(id,request);}
}
