package in.udaansetu.platform.facilitator;

import in.udaansetu.platform.facilitator.FacilitatorDtos.*;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** Demo actor headers are a local prototype boundary only; replace them with authenticated RBAC. */
@RestController
@RequestMapping("/api/v1/facilitator")
public class FacilitatorWorkspaceController {
    private final FacilitatorWorkspaceService service;
    public FacilitatorWorkspaceController(FacilitatorWorkspaceService service) { this.service = service; }

    @GetMapping("/cohorts") public List<Cohort> cohorts(@RequestHeader("X-Actor-Key") String actor) { return service.listCohorts(actor); }
    @PostMapping("/cohorts") @ResponseStatus(HttpStatus.CREATED)
    public Cohort createCohort(@RequestHeader("X-Actor-Key") String actor, @Valid @RequestBody CohortCreateRequest request) { return service.createCohort(actor, request); }
    @PostMapping("/cohorts/{cohortId}/learners")
    public Cohort addLearner(@RequestHeader("X-Actor-Key") String actor, @PathVariable String cohortId, @Valid @RequestBody CohortLearnerRequest request) { return service.addLearner(actor, cohortId, request); }
    @GetMapping("/referrals") public List<Referral> referrals(@RequestHeader("X-Actor-Key") String actor) { return service.listReferrals(actor); }
    @PostMapping("/referrals") @ResponseStatus(HttpStatus.CREATED)
    public Referral referral(@RequestHeader("X-Actor-Key") String actor, @Valid @RequestBody ReferralCreateRequest request) { return service.createReferral(actor, request); }
}
