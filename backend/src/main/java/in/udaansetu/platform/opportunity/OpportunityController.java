package in.udaansetu.platform.opportunity;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping("/api/v1/opportunities")
public class OpportunityController {
    private final OpportunityService service;
    public OpportunityController(OpportunityService service) { this.service = service; }

    @GetMapping
    public OpportunitySearchResponse search(
            @RequestParam(required = false) @Size(max = 120) String q,
            @RequestParam(required = false) OpportunityType type,
            @RequestParam(required = false) @Size(max = 80) String state,
            @RequestParam(required = false) @Size(max = 10) String language,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(50) int size) {
        return service.search(q, type, state, language, page, size);
    }

    @GetMapping("/{id}") public Opportunity get(@PathVariable String id) { return service.detail(id); }

    @PostMapping("/{id}/eligibility-check")
    public EligibilityCheckResponse checkEligibility(@PathVariable String id, @Valid @RequestBody EligibilityCheckRequest request) {
        return service.checkEligibility(id, request);
    }
}
