package in.udaansetu.platform.sustainability;

import in.udaansetu.platform.sustainability.SustainabilityDtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sustainability")
public class SustainabilityController {
    private final SustainabilityService service;
    public SustainabilityController(SustainabilityService service){this.service=service;}
    @GetMapping("/overview") public SustainabilityOverview overview(){return service.overview();}
    @PostMapping("/interest") @ResponseStatus(HttpStatus.CREATED) public InterestRecord interest(@Valid @RequestBody InterestRequest request){return service.submitInterest(request);}
}
