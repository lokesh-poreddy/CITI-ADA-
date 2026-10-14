package in.udaansetu.platform.learners;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/learners/profiles")
public class LearnerProfileController {
    private final LearnerProfileService service;

    public LearnerProfileController(LearnerProfileService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerProfileCreatedResponse create(@Valid @RequestBody LearnerProfileRequest request) {
        return service.create(request);
    }

    @DeleteMapping("/{learnerId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTemporaryProfile(@PathVariable String learnerId) {
        service.delete(learnerId);
    }
}
